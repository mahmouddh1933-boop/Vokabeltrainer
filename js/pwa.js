(() => {
  "use strict";
  // Registration precedes the auth gate; it only stores public lesson assets.
  if (!["https:", "http:"].includes(location.protocol)) return;
  const supported = "serviceWorker" in navigator && window.isSecureContext;
  let registration,
    installPrompt,
    updating = false,
    details,
    status,
    install,
    update,
    check,
    clear,
    steps,
    latest;
  const isStandalone = () =>
    matchMedia("(display-mode: standalone)").matches ||
    navigator.standalone === true;
  const language = () =>
    window.AppLanguage?.get() || document.documentElement.lang || "ar";
  const t = (ar, de) => (language() === "de" ? de : ar);
  const labels = new Map();
  function node(tag, ar, de) {
    const e = document.createElement(tag);
    if (ar !== undefined) {
      labels.set(e, [ar, de]);
      e.textContent = t(ar, de);
    }
    return e;
  }
  function button(id, ar, de, handler) {
    const e = node("button", ar, de);
    e.type = "button";
    e.id = id;
    e.addEventListener("click", handler);
    return e;
  }
  function request(type, timeout = 3000) {
    return new Promise((resolve, reject) => {
      const worker = navigator.serviceWorker.controller || registration?.active;
      if (!worker) {
        reject(Error("Not ready"));
        return;
      }
      const channel = new MessageChannel(),
        timer = setTimeout(() => {
          channel.port1.close();
          reject(Error("Timeout"));
        }, timeout);
      channel.port1.onmessage = (event) => {
        clearTimeout(timer);
        channel.port1.close();
        resolve(event.data);
      };
      worker.postMessage({ type }, [channel.port2]);
    });
  }
  async function refresh() {
    if (!status) return;
    for (const [e, pair] of labels) e.textContent = t(...pair);
    install.hidden = isStandalone();
    update.hidden = !registration?.waiting;
    check.disabled = !supported || !navigator.onLine;
    if (!supported) {
      install.disabled = true;
      status.textContent = t(
        "للتثبيت افتح التطبيق عبر رابط HTTPS في متصفح يدعم التثبيت.",
        "Zum Installieren öffne die App über HTTPS in einem unterstützten Browser.",
      );
      clear.disabled = true;
      return;
    }
    try {
      latest = await request("PWA_STATUS");
      if (!latest.ready) check.textContent = t("حفظ الدروس دون اتصال", "Lektionen offline speichern");
      clear.disabled = !latest.mediaCount;
      status.textContent =
        (navigator.onLine
          ? t("متصل بالإنترنت. ", "Online. ")
          : t("أنت دون اتصال. ", "Du bist offline. ")) +
        (latest.ready
          ? t(
              "الدروس النصية جاهزة على هذا الجهاز. التسجيلات والصور المحفوظة: ",
              "Die Textlektionen sind auf diesem Gerät bereit. Gespeicherte Aufnahmen und Bilder: ",
            )
          : t(
              "الدروس غير مكتملة للحفظ دون اتصال؛ اتصل بالإنترنت واضغط حفظ الدروس. ملفات الوسائط: ",
              "Die Offline-Lektionen sind unvollständig. Verbinde dich mit dem Internet und wähle Lektionen speichern. Medien: ",
            )) +
        latest.mediaCount +
        " (" +
        (latest.mediaBytes / 1024 / 1024).toFixed(1) +
        " MB)." +
        (registration?.waiting
          ? t(
              " يوجد تحديث جاهز. احفظ إجاباتك قبل تحديث الصفحة.",
              " Ein Update ist bereit. Speichere deine Antworten vor dem Neuladen.",
            )
          : "") +
        (isStandalone()
          ? t(
              " التطبيق مفتوح بوضع مستقل.",
              " Die App ist im eigenständigen Modus geöffnet.",
            )
          : "");
    } catch (_) {
      clear.disabled = true;
      status.textContent = t(
        "جارٍ تجهيز الدروس للعمل دون إنترنت. أبقِ الاتصال متاحًا حتى يكتمل التجهيز.",
        "Die Lektionen werden offline vorbereitet. Lass die Internetverbindung bis zum Abschluss bestehen.",
      );
    }
  }
  function mount() {
    if (details || !document.querySelector("main")) return;
    details = node("details");
    details.id = "olive-pwa";
    details.className = "olive-pwa-panel";
    details.append(
      node(
        "summary",
        "تثبيت التطبيق والعمل دون إنترنت",
        "App installieren und offline lernen",
      ),
    );
    status = node("p");
    status.id = "pwa-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    details.append(status);
    const actions = node("div");
    actions.className = "pwa-actions";
    install = button(
      "pwa-install",
      "تثبيت التطبيق",
      "App installieren",
      async () => {
        if (installPrompt) {
          const prompt = installPrompt;
          installPrompt = null;
          await prompt.prompt();
          await prompt.userChoice;
          await refresh();
        } else steps.hidden = !steps.hidden;
      },
    );
    update = button(
      "pwa-update",
      "تحديث التطبيق وإعادة فتح الصفحة",
      "App aktualisieren und neu laden",
      () => {
        if (!registration?.waiting) return;
        updating = true;
        update.disabled = true;
        registration.waiting.postMessage({ type: "APPLY_UPDATE" });
      },
    );
    update.hidden = true;
    check = button(
      "pwa-check-update",
      "البحث عن تحديث",
      "Nach Updates suchen",
      async () => {
        check.disabled = true;
        try {
          if (latest && !latest.ready) {
            const result = await request("PREPARE_CORE", 120000);
            if (result.error) throw Error("Preparation failed");
          } else await registration?.update();
          await refresh();
        } catch (_) {
          status.textContent = t(
            "تعذّر فحص التحديث. حاول عند عودة الاتصال.",
            "Updateprüfung fehlgeschlagen. Versuche es wieder mit Internet.",
          );
        } finally {
          check.disabled = !navigator.onLine;
        }
      },
    );
    clear = button(
      "pwa-clear-media",
      "مسح الصوت والصور المحفوظة",
      "Gespeicherte Medien entfernen",
      async () => {
        clear.disabled = true;
        try {
          await request("CLEAR_MEDIA");
          await refresh();
        } catch (_) {
          status.textContent = t(
            "تعذّر مسح الملفات. حاول مجددًا.",
            "Dateien konnten nicht entfernt werden. Bitte erneut versuchen.",
          );
        }
      },
    );
    actions.append(install, update, check, clear);
    details.append(actions);
    steps = node(
      "p",
      "على أندرويد مع Chrome: افتح قائمة ⋮ ثم «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».\nعلى iPhone مع Safari: مشاركة ← إضافة إلى الشاشة الرئيسية.\nعلى الحاسوب مع Chrome أو Edge: اختر رمز التثبيت بجانب عنوان الموقع.",
      "Android mit Chrome: Menü ⋮ → App installieren oder Zum Startbildschirm hinzufügen.\niPhone mit Safari: Teilen → Zum Home-Bildschirm.\nComputer mit Chrome oder Edge: Installationssymbol neben der Adressleiste.",
    );
    steps.className = "pwa-install-steps";
    steps.hidden = true;
    details.append(steps);
    const restricted=window.OliveFirebaseConfig?.enabled&&window.OliveFirebaseConfig?.accessControl;
    details.append(node("p",restricted
      ?"يتطلب تسجيل الدخول والمزامنة والتحقق من الجهاز اتصالًا بالإنترنت؛ التشغيل دون اتصال متاح ٢٤ ساعة بعد التحقق. استخدم «تذكّرني» على جهازك الشخصي. تُحفظ التسجيلات والصور عند استخدامها ضمن مساحة محدودة؛ مسحها هنا لا يحذف إجاباتك أو تقدّمك."
      :"التقدّم محفوظ محليًا في هذا المتصفح. تُحفظ التسجيلات والصور عند استخدامها أثناء الاتصال ضمن مساحة محدودة؛ مسحها هنا لا يحذف إجاباتك أو تقدّمك.",restricted
      ?"Anmeldung, Synchronisierung und Geräteprüfung benötigen Internet; offline ist die Nutzung 24 Stunden nach einer Prüfung möglich. Wähle auf deinem eigenen Gerät Angemeldet bleiben. Medien werden beim Aufrufen begrenzt gespeichert; das Entfernen hier löscht keine Antworten oder Lernstände."
      :"Dein Lernstand bleibt in diesem Browser gespeichert. Aufgerufene Medien werden mit Internet begrenzt gespeichert; das Entfernen hier löscht keine Antworten oder Lernstände."));
    const teacher = document
      .getElementById("teacher-exams-entry")
      ?.closest("section");
    if (teacher) teacher.before(details);
    else document.querySelector("main").append(details);
    details.addEventListener("toggle", () => {
      if (details.open) refresh();
    });
    refresh();
  }
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
  });
  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    refresh();
  });
  window.addEventListener("app-language-change", refresh);
  window.addEventListener("online", refresh);
  window.addEventListener("offline", refresh);
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-auth-language]")) setTimeout(refresh, 0);
  });
  if (supported) {
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (updating) location.reload();
      else refresh();
    });
    navigator.serviceWorker
      .register(new URL("pwa-worker.js", document.baseURI), {
        scope: "./",
        updateViaCache: "none",
      })
      .then((r) => {
        registration = r;
        refresh();
        r.addEventListener("updatefound", () => {
          const worker = r.installing;
          worker?.addEventListener("statechange", () => {
            if (worker.state === "installed" || worker.state === "redundant")
              refresh();
          });
        });
        navigator.serviceWorker.ready.then(() => refresh());
      })
      .catch(async () => {
        // Re-registering can fail offline even while a working worker controls this page.
        const existing = await navigator.serviceWorker.getRegistration().catch(() => undefined);
        if (existing?.active || navigator.serviceWorker.controller) {
          registration = existing;
          await refresh();
          return;
        }
        if (status)
          status.textContent = t(
            "لم يكتمل تجهيز العمل دون إنترنت. تحقق من الاتصال ومساحة الجهاز، ثم أعد فتح الصفحة.",
            "Offline-Vorbereitung nicht abgeschlossen. Prüfe Verbindung und Speicherplatz und öffne die Seite erneut.",
          );
      });
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();
