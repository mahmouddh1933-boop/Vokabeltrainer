(() => {
  "use strict";
  const config = window.OliveFirebaseConfig,
    enabled = config?.enabled === true && config.accessControl === true;
  const store = window.JisrStorage?.local,
    GRANT = "__oliveAccessGrantV1";
  let auth,
    currentUser,
    admin = false,
    devicePromise,
    timer,
    stopped = false,
    checking;
  const error = (code) => Object.assign(new Error(code), { code });
  function encode(bytes) {
    return btoa(String.fromCharCode(...new Uint8Array(bytes)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
  function device() {
    if (devicePromise) return devicePromise;
    devicePromise = (async () => {
      if (
        !window.isSecureContext ||
        !window.crypto?.subtle ||
        !window.indexedDB
      )
        throw error("DEVICE_STORAGE");
      const db = await new Promise((resolve, reject) => {
        const r = indexedDB.open("oliveDeviceIdentityV1", 1);
        r.onupgradeneeded = () => r.result.createObjectStore("keys");
        r.onsuccess = () => resolve(r.result);
        r.onerror = () => reject(error("DEVICE_STORAGE"));
      });
      const candidate = await crypto.subtle.generateKey(
        { name: "ECDSA", namedCurve: "P-256" },
        false,
        ["sign", "verify"],
      );
      const pair = await new Promise((resolve, reject) => {
        const tx = db.transaction("keys", "readwrite"),
          os = tx.objectStore("keys"),
          r = os.get("installation");
        let value;
        r.onsuccess = () => {
          value = r.result || candidate;
          if (!r.result) os.put(value, "installation");
        };
        tx.oncomplete = () => resolve(value);
        tx.onerror = tx.onabort = () => reject(error("DEVICE_STORAGE"));
      });
      db.close();
      const exported = await crypto.subtle.exportKey("jwk", pair.publicKey),
        publicKey = { kty: "EC", crv: "P-256", x: exported.x, y: exported.y };
      const hash = await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(JSON.stringify(publicKey)),
        ),
        id = Array.from(new Uint8Array(hash), (b) =>
          b.toString(16).padStart(2, "0"),
        ).join("");
      return { pair, publicKey, id };
    })().catch(() => {
      devicePromise = null;
      throw error("DEVICE_STORAGE");
    });
    return devicePromise;
  }
  async function call(name, data, user = currentUser) {
    if (!user) throw error("SIGN_IN_REQUIRED");
    const token = await user.getIdToken().catch(() => {
      throw error("NETWORK");
    });
    const base = config.emulator
      ? "http://127.0.0.1:5001/" +
        config.firebase.projectId +
        "/" +
        config.functionsRegion +
        "/"
      : "https://" +
        config.functionsRegion +
        "-" +
        config.firebase.projectId +
        ".cloudfunctions.net/";
    const controller = new AbortController(),
      timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(base + name, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ data }),
        signal: controller.signal,
        cache: "no-store",
      });
      let payload;
      try {
        payload = await response.json();
      } catch (_) {
        throw error("NETWORK");
      }
      if (
        payload.error &&
        ["UNAVAILABLE", "DEADLINE_EXCEEDED"].includes(payload.error.status)
      )
        throw error("NETWORK");
      if (payload.error)
        throw error(
          payload.error.message || payload.error.status || "ACCESS_DENIED",
        );
      if (!response.ok) throw error("NETWORK");
      return payload.result;
    } catch (e) {
      if (!e.code) throw error("NETWORK");
      throw e;
    } finally {
      clearTimeout(timeout);
    }
  }
  async function signed(purpose, user = currentUser) {
    const d = await device(),
      c = await call("accessChallenge", { purpose }, user),
      payload = ["olive-device-v1", user.uid, c.id, c.nonce, d.id].join("|");
    const signature = encode(
      await crypto.subtle.sign(
        { name: "ECDSA", hash: "SHA-256" },
        d.pair.privateKey,
        new TextEncoder().encode(payload),
      ),
    );
    return {
      deviceId: d.id,
      publicKey: d.publicKey,
      challengeId: c.id,
      signature,
    };
  }
  function readGrant() {
    try {
      return JSON.parse(store.getItem(GRANT) || "null");
    } catch (_) {
      return null;
    }
  }
  function saveGrant(result) {
    store.setItem(
      GRANT,
      JSON.stringify({
        uid: currentUser.uid,
        deviceId: result.deviceId,
        sessionId: result.sessionId,
        leaseExpiresAt: result.leaseExpiresAt,
      }),
    );
  }
  async function offlineGrant(user) {
    const d = await device(),
      g = readGrant();
    if (
      !g ||
      g.uid !== user.uid ||
      g.deviceId !== d.id ||
      g.leaseExpiresAt <= Date.now()
    )
      throw error("OFFLINE_APPROVAL_EXPIRED");
    admin = false;
    startHeartbeat();
    return { offline: true, isAdmin: false };
  }
  function description() {
    const ua = navigator.userAgent;
    const os = /Android/i.test(ua)
      ? "Android"
      : /iPhone|iPad/i.test(ua)
        ? "iOS"
        : /Windows/i.test(ua)
          ? "Windows"
          : /Mac/i.test(ua)
            ? "macOS"
            : "Linux";
    const browser = /Edg\//.test(ua)
      ? "Edge"
      : /Firefox\//.test(ua)
        ? "Firefox"
        : /Chrome\//.test(ua)
          ? "Chrome"
          : "Safari";
    return os + " · " + browser;
  }
  async function enter(user, instance) {
    if (!enabled) return { user, isAdmin: false };
    auth = instance;
    currentUser = user;
    store.setScope(user.uid);
    stopped = false;
    if (!user.emailVerified) throw error("VERIFY_EMAIL");
    const administrator = location.pathname.endsWith("/admin.html");
    if (navigator.onLine === false) {
      if (administrator) throw error("ADMIN_ONLINE_REQUIRED");
      return offlineGrant(user);
    }
    try {
      const data = await signed("begin", user);
      data.label = description();
      data.agent = navigator.userAgent.slice(0, 240);
      const result = await call("accessBegin", data, user);
      const credential = await auth.signInWithCustomToken(result.customToken);
      currentUser = credential.user;
      saveGrant(result);
      admin = result.isAdmin === true;
      if (administrator && !admin) throw error("ADMIN_ONLY");
      startHeartbeat();
      return { user: currentUser, isAdmin: admin };
    } catch (e) {
      if (e.code === "NETWORK" && !administrator) {
        try { return await offlineGrant(user); } catch (_) { throw e; }
      }
      throw e;
    }
  }
  async function heartbeat() {
    if (stopped || !currentUser || checking) return;
    if (navigator.onLine === false) {
      if ((readGrant()?.leaseExpiresAt || 0) <= Date.now()) {
        admin = false;
        stop();
        window.dispatchEvent(
          new CustomEvent("olive-access-denied", {
            detail: { code: "OFFLINE_APPROVAL_EXPIRED" },
          }),
        );
      }
      return;
    }
    checking = (async () => {
      try {
        const proof = await signed("heartbeat"),
          result = await call("accessHeartbeat", proof);
        saveGrant(result);
        admin = result.isAdmin === true;
      } catch (e) {
        if (
          e.code !== "NETWORK" ||
          (readGrant()?.leaseExpiresAt || 0) <= Date.now()
        ) {
          admin = false;
          store.removeItem(GRANT);
          stop();
          window.dispatchEvent(
            new CustomEvent("olive-access-denied", {
              detail: { code: e.code },
            }),
          );
        }
      } finally {
        checking = null;
      }
    })();
    return checking;
  }
  function startHeartbeat() {
    clearInterval(timer);
    timer = setInterval(heartbeat, 120000);
  }
  function stop() {
    stopped = true;
    clearInterval(timer);
  }
  window.addEventListener("online", () => {
    if (enabled && !stopped) {
      startHeartbeat();
      heartbeat();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (enabled && !document.hidden && !stopped) heartbeat();
  });
  window.addEventListener("pagehide", stop);
  const messages = {
    VERIFY_EMAIL: [
      "أكّد ملكية بريدك الإلكتروني قبل فتح الدروس. أرسل رسالة التحقق، ثم افتح رابطها وأعد التحقق هنا.",
      "Bestätige deine E-Mail-Adresse. Öffne den Bestätigungslink und prüfe deinen Status erneut.",
    ],
    EMAIL_NOT_ALLOWED: [
      "هذا البريد غير مضاف إلى قائمة الطلاب المسموح لهم. تواصل مع الأستاذ.",
      "Diese E-Mail-Adresse ist nicht freigeschaltet. Wende dich an deinen Lehrer.",
    ],
    EMAIL_ACCOUNT_MISMATCH: [
      "تعذّر ربط هذا الحساب بالدعوة. تواصل مع الأستاذ.",
      "Dieses Konto passt nicht zur Freigabe. Wende dich an deinen Lehrer.",
    ],
    DEVICE_LIMIT: [
      "وصل الحساب إلى حد جهازين مسجّلين. اطلب من الأستاذ إلغاء جهاز قديم قبل إضافة هذا الجهاز.",
      "Zwei Geräte sind bereits registriert. Bitte den Lehrer, ein altes Gerät zu entfernen.",
    ],
    DEVICE_REVOKED: [
      "أُلغي تسجيل هذا المتصفح. تواصل مع الأستاذ للسماح بإعادة تسجيله.",
      "Dieser Browser wurde gesperrt. Bitte den Lehrer um erneute Freigabe.",
    ],
    DEVICE_STORAGE: [
      "اسمح بحفظ بيانات الموقع لاستخدام تعريف ثابت لهذا المتصفح، ثم أعد المحاولة.",
      "Erlaube Websitedaten, damit dieser Browser dauerhaft erkannt werden kann.",
    ],
    OFFLINE_APPROVAL_EXPIRED: [
      "اتصل بالإنترنت للتحقق من صلاحية الحساب والجهاز. التشغيل دون اتصال متاح لمدة ٢٤ ساعة بعد آخر تحقق ناجح.",
      "Verbinde dich zur Prüfung von Konto und Gerät mit dem Internet. Offline-Nutzung ist 24 Stunden nach erfolgreicher Prüfung möglich.",
    ],
    ADMIN_ONLINE_REQUIRED: [
      "تحتاج لوحة الإدارة إلى اتصال بالإنترنت.",
      "Die Verwaltung benötigt eine Internetverbindung.",
    ],
    ADMIN_ONLY: [
      "هذه الصفحة مخصّصة لمدير التطبيق.",
      "Diese Seite ist nur für die Administration.",
    ],
    NETWORK: [
      "تعذّر التحقق من صلاحية الدخول. تحقّق من الاتصال أو تواصل مع الأستاذ.",
      "Die Zugriffsprüfung ist nicht erreichbar. Prüfe die Verbindung oder wende dich an den Lehrer.",
    ],
  };
  window.OliveAccess = {
    enabled,
    enter,
    stop,
    heartbeat,
    isAdmin: () => admin,
    clearGrant: () => store?.removeItem(GRANT),
    message: (code) => messages[code] || messages.NETWORK,
    admin: async (name, data) => {
      if (!admin) throw error("ADMIN_ONLY");
      if (
        ![
          "adminListMembers",
          "adminSetEmail",
          "adminListDevices",
          "adminChangeDevice",
        ].includes(name)
      )
        throw error("ACCESS_DENIED");
      return call(name, data);
    },
  };
})();
