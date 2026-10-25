/* Spark edition: Firestore enforces the email list and administrator role.
 * Device counts/blocks are cooperative browser controls, not token-bound security. */
(() => {
  "use strict";
  const config = window.OliveFirebaseConfig;
  const enabled = config?.enabled === true && config.accessControl === true;
  const store = window.JisrStorage?.local;
  const GRANT = "__oliveFreeAccessGrantV1", LEASE = 24 * 60 * 60 * 1000;
  let currentUser, database, devicePromise, timer, stopped = true, checking, admin = false;
  const error = code => Object.assign(new Error(code), {code});
  const email = value => {
    const e = String(value || "").trim().toLowerCase();
    if (e.length > 254 || !/^[^\s/@]+@[^\s/@]+\.[^\s/@]+$/.test(e)) throw error("INVALID_EMAIL");
    return e;
  };
  const stamp = () => window.firebase.firestore.FieldValue.serverTimestamp();
  const millis = value => typeof value?.toMillis === "function" ? value.toMillis() : Number(value || 0);
  async function device() {
    if (devicePromise) return devicePromise;
    devicePromise = (async () => {
      if (!window.isSecureContext || !crypto?.getRandomValues || !window.indexedDB) throw error("DEVICE_STORAGE");
      const db = await new Promise((resolve, reject) => {
        const r = indexedDB.open("oliveFreeInstallationV1", 1);
        r.onupgradeneeded = () => r.result.createObjectStore("keys");
        r.onsuccess = () => resolve(r.result);
        r.onerror = () => reject(error("DEVICE_STORAGE"));
      });
      try {
        return await new Promise((resolve, reject) => {
          const tx = db.transaction("keys", "readwrite"), os = tx.objectStore("keys"), r = os.get("id");
          let id;
          r.onsuccess = () => {
            id = r.result;
            if (!/^[a-f0-9]{64}$/.test(id || "")) {
              id = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, "0")).join("");
              os.put(id, "id");
            }
          };
          tx.oncomplete = () => resolve(id);
          tx.onerror = tx.onabort = () => reject(error("DEVICE_STORAGE"));
        });
      } finally { db.close(); }
    })().catch(() => { devicePromise = null; throw error("DEVICE_STORAGE"); });
    return devicePromise;
  }
  function deadline(promise) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(error("NETWORK")), 15000);
      promise.then(value => { clearTimeout(timeout); resolve(value); }, e => { clearTimeout(timeout); reject(e); });
    });
  }
  function network(e) { return ["NETWORK", "unavailable", "deadline-exceeded"].includes(e?.code); }
  async function membership() {
    const owner = await database.doc("oliveFreeAdmins/" + currentUser.uid).get({source:"server"});
    admin = owner.exists && owner.data().enabled === true;
    if (!admin) {
      const allowed = await database.doc("oliveFreeEmails/" + email(currentUser.email)).get({source:"server"});
      if (!allowed.exists || allowed.data().enabled !== true) throw error("EMAIL_NOT_ALLOWED");
    }
    return admin;
  }
  function label() {
    const ua = navigator.userAgent;
    const os = /Android/i.test(ua) ? "Android" : /iPhone|iPad/i.test(ua) ? "iOS" : /Windows/i.test(ua) ? "Windows" : /Mac/i.test(ua) ? "macOS" : "Linux";
    const browser = /Edg\//.test(ua) ? "Edge" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : "Safari";
    return os + " · " + browser;
  }
  async function registerDevice() {
    const id = await device(), ref = database.doc("oliveFreeMembers/" + currentUser.uid), block = ref.collection("deviceBlocks").doc(id);
    await database.runTransaction(async tx => {
      const [profile, blocked] = await Promise.all([tx.get(ref), tx.get(block)]);
      if (blocked.exists && blocked.data().blocked === true) throw error("DEVICE_REVOKED");
      const old = profile.data() || {}, devices = {...old.devices};
      if (!devices[id] && Object.keys(devices).length >= 2) throw error("DEVICE_LIMIT");
      devices[id] = {label: label(), agent: navigator.userAgent.slice(0,240), firstSeenAt: devices[id]?.firstSeenAt || stamp(), lastSeenAt: stamp()};
      tx.set(ref, {email: email(currentUser.email), devices, touchedDevice:id, createdAt:old.createdAt || stamp(), lastSeenAt:stamp()});
    });
    store.setItem(GRANT, JSON.stringify({uid:currentUser.uid,deviceId:id,leaseExpiresAt:Date.now()+LEASE}));
  }
  function readGrant() { try { return JSON.parse(store.getItem(GRANT) || "null"); } catch (_) { return null; } }
  async function offline(user) {
    const g = readGrant();
    if (!g || g.uid !== user.uid || g.deviceId !== await device() || g.leaseExpiresAt <= Date.now()) throw error("OFFLINE_APPROVAL_EXPIRED");
    admin = false;
    startHeartbeat();
    return {user, isAdmin:false, offline:true};
  }
  async function enter(user, auth, loadScript) {
    if (!enabled) return {user,isAdmin:false};
    currentUser = user; stopped = false; store.setScope(user.uid);
    if (!user.emailVerified) throw error("VERIFY_EMAIL");
    const adminPage = location.pathname.endsWith("/admin.html");
    if (navigator.onLine === false) {
      if (adminPage) throw error("ADMIN_ONLINE_REQUIRED");
      return offline(user);
    }
    try {
      if (!window.firebase.firestore) await loadScript("js/vendor/firebase/firebase-firestore-compat.js");
      database = window.firebase.firestore();
      if (config.emulator && !database.__oliveEmulator) { database.useEmulator("127.0.0.1",8080);database.__oliveEmulator=true; }
      await deadline(membership());
      if (adminPage && !admin) throw error("ADMIN_ONLY");
      await deadline(registerDevice());
      startHeartbeat();
      return {user,isAdmin:admin};
    } catch (e) {
      if (network(e) && !adminPage) { try { return await offline(user); } catch (_) {} }
      if (e.code === "permission-denied") throw error("EMAIL_NOT_ALLOWED");
      throw e;
    }
  }
  function deny(code) {
    admin = false; store.removeItem(GRANT); stop();
    window.dispatchEvent(new CustomEvent("olive-access-denied", {detail:{code}}));
  }
  async function heartbeat() {
    if (stopped || !currentUser || checking) return;
    if (navigator.onLine === false) {
      if (location.pathname.endsWith("/admin.html")) deny("ADMIN_ONLINE_REQUIRED");
      else if ((readGrant()?.leaseExpiresAt || 0) <= Date.now()) deny("OFFLINE_APPROVAL_EXPIRED");
      return;
    }
    checking = (async () => {
      try {
        // A cold offline start did not load Firestore: reconnect through the full gate.
        if (!database) { location.reload(); return; }
        await deadline(membership());
        if (location.pathname.endsWith("/admin.html") && !admin) throw error("ADMIN_ONLY");
        await deadline(registerDevice());
      } catch (e) {
        if (!network(e) || (readGrant()?.leaseExpiresAt || 0) <= Date.now()) deny(e.code === "permission-denied" ? "EMAIL_NOT_ALLOWED" : e.code);
      } finally { checking = null; }
    })();
    return checking;
  }
  function startHeartbeat() { clearInterval(timer);timer=setInterval(heartbeat,300000); }
  function stop() { stopped=true;clearInterval(timer); }
  window.addEventListener("online", () => {if(enabled && !stopped){startHeartbeat();heartbeat();}});
  document.addEventListener("visibilitychange", () => {if(enabled && !document.hidden && !stopped)heartbeat();});
  window.addEventListener("pagehide",stop);
  async function requireAdmin() {
    if (navigator.onLine === false) throw error("ADMIN_ONLINE_REQUIRED");
    await membership();
    if (!admin) throw error("ADMIN_ONLY");
  }
  async function adminListMembers(data) {
    const limit = Math.min(50,Math.max(1,Number(data.limit)||30));
    let q = database.collection("oliveFreeEmails").orderBy("email").limit(limit+1);
    const prefix=String(data.query||"").trim().toLowerCase();
    if(prefix)q=q.where("email",">=",prefix).where("email","<=",prefix+"\uf8ff");
    if(data.after)q=q.startAfter(email(data.after));
    const list=await q.get({source:"server"});
    const rows=await Promise.all(list.docs.slice(0,limit).map(async doc=>{
      const row=doc.data(),profiles=await database.collection("oliveFreeMembers").where("email","==",row.email).limit(10).get({source:"server"});
      const profile=profiles.docs.sort((a,b)=>millis(b.data().lastSeenAt)-millis(a.data().lastSeenAt))[0];
      return {email:row.email,enabled:row.enabled,role:profile?.id===currentUser.uid?"admin":"student",uid:profile?.id||null,registeredDevices:Object.keys(profile?.data().devices||{}).length,lastSeenAt:millis(profile?.data().lastSeenAt),createdAt:millis(row.createdAt)};
    }));
    return {rows,next:list.size>limit?rows.at(-1).email:null,maxDevices:2};
  }
  async function adminSetEmail(data) {
    const e=email(data.email);
    if(typeof data.enabled!=="boolean")throw error("INVALID_STATUS");
    const ref=database.doc("oliveFreeEmails/"+e);
    await database.runTransaction(async tx=>{
      const old=await tx.get(ref);
      tx.set(ref,{email:e,enabled:data.enabled,createdAt:old.data()?.createdAt||stamp(),updatedAt:stamp()});
    });
    return {email:e,enabled:data.enabled};
  }
  function userRef(uid) {
    if(typeof uid!=="string" || !uid || uid.length>128 || uid.includes("/"))throw error("INVALID_USER");
    return database.doc("oliveFreeMembers/"+uid);
  }
  async function adminListDevices(data) {
    const ref=userRef(data.uid),[profile,blocks]=await Promise.all([ref.get({source:"server"}),ref.collection("deviceBlocks").orderBy("blockedAt","desc").limit(100).get({source:"server"})]);
    const devices=new Map(Object.entries(profile.data()?.devices||{}).map(([id,d])=>[id,{id,...d,active:true,status:"active"}]));
    blocks.docs.forEach(d=>{if(d.data().blocked)devices.set(d.id,{id:d.id,...d.data(),active:false,status:"revoked"});});
    return {devices:[...devices.values()].map(d=>({...d,createdAt:millis(d.firstSeenAt),lastSeenAt:millis(d.lastSeenAt),recent:d.active&&Date.now()-millis(d.lastSeenAt)<10*60*1000})).sort((a,b)=>Number(b.active)-Number(a.active)||b.lastSeenAt-a.lastSeenAt)};
  }
  async function adminChangeDevice(data) {
    const ref=userRef(data.uid);
    if(!/^[a-f0-9]{64}$/.test(data.deviceId||"")||!["revoke","release"].includes(data.action))throw error("INVALID_DEVICE");
    if(data.uid===currentUser.uid&&data.deviceId===await device())throw error("CURRENT_ADMIN_DEVICE");
    const block=ref.collection("deviceBlocks").doc(data.deviceId);
    await database.runTransaction(async tx=>{
      const [profile,oldBlock]=await Promise.all([tx.get(ref),tx.get(block)]);
      if(!profile.exists)throw error("DEVICE_NOT_FOUND");
      const devices={...profile.data().devices},old=devices[data.deviceId]||oldBlock.data();
      if(!old)throw error("DEVICE_NOT_FOUND");
      delete devices[data.deviceId];
      tx.update(ref,{devices});
      if(data.action==="revoke")tx.set(block,{label:old.label||"متصفح",agent:old.agent||"",firstSeenAt:old.firstSeenAt||stamp(),lastSeenAt:old.lastSeenAt||stamp(),blocked:true,blockedAt:stamp()});
      else tx.delete(block);
    });
    return {ok:true};
  }
  const methods={adminListMembers,adminSetEmail,adminListDevices,adminChangeDevice};
  const messages={
    VERIFY_EMAIL:["أكّد ملكية بريدك الإلكتروني قبل فتح الدروس. أرسل رسالة التحقق، ثم افتح رابطها وأعد التحقق هنا.","Bestätige deine E-Mail-Adresse. Öffne den Bestätigungslink und prüfe erneut."],
    EMAIL_NOT_ALLOWED:["هذا البريد غير مضاف إلى قائمة الطلاب المسموح لهم. تواصل مع الأستاذ.","Diese E-Mail-Adresse ist nicht freigeschaltet. Wende dich an deinen Lehrer."],
    DEVICE_LIMIT:["وصل الحساب إلى جهازين مسجّلين في التطبيق. اطلب من الأستاذ إزالة تسجيل قديم. هذا حد إرشادي في النسخة المجانية.","Zwei Browser sind bereits registriert. Bitte den Lehrer, einen alten Eintrag zu entfernen. Dies ist eine kooperative Grenze der kostenlosen Ausgabe."],
    DEVICE_REVOKED:["أُلغي تسجيل هذا المتصفح في التطبيق. تواصل مع الأستاذ للسماح بإعادة تسجيله.","Dieser Browsereintrag wurde gesperrt. Bitte den Lehrer um erneute Freigabe."],
    DEVICE_STORAGE:["اسمح بحفظ بيانات الموقع لاستخدام تعريف ثابت لهذا المتصفح، ثم أعد المحاولة.","Erlaube Websitedaten, damit dieser Browser wiedererkannt werden kann."],
    OFFLINE_APPROVAL_EXPIRED:["اتصل بالإنترنت للتحقق من صلاحية الحساب. التشغيل دون اتصال متاح لمدة ٢٤ ساعة بعد آخر تحقق ناجح.","Verbinde dich zur Zugriffsprüfung mit dem Internet. Offline-Nutzung ist 24 Stunden nach erfolgreicher Prüfung möglich."],
    ADMIN_ONLINE_REQUIRED:["تحتاج لوحة الإدارة إلى اتصال بالإنترنت.","Die Verwaltung benötigt eine Internetverbindung."],
    ADMIN_ONLY:["هذه الصفحة مخصّصة لمدير التطبيق.","Diese Seite ist nur für die Administration."],
    NETWORK:["تعذّر التحقق من صلاحية الدخول. تحقّق من الاتصال أو من حصة Firebase المجانية ثم حاول مجددًا.","Die Zugriffsprüfung ist nicht erreichbar. Prüfe Verbindung und kostenloses Firebase-Kontingent."],
  };
  window.OliveAccess={enabled,enter,heartbeat,stop,isAdmin:()=>admin,deviceId:device,clearGrant:()=>store?.removeItem(GRANT),message:code=>messages[code]||messages.NETWORK,
    admin:async(name,data={})=>{if(!methods[name])throw error("ADMIN_ONLY");await requireAdmin();return methods[name](data);}};
})();
