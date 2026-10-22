(() => {
  "use strict";
  const config = window.OliveFirebaseConfig;
  const storage = window.JisrStorage;
  const loginPage = location.pathname.endsWith("/login.html");
  const enabled = config?.enabled === true;
  const root = document.documentElement;
  let auth,
    currentUser,
    startedUid,
    starting = false,
    busy = false;
  let mode = "login";
  let message = null;
  let authReady = false;
  const $ = (id) => document.getElementById(id);
  const language = () =>
    window.AppLanguage?.get() ||
    storage.local.getItem("vocabInterfaceLanguage") ||
    (navigator.language.startsWith("de") ? "de" : "ar");
  const t = (ar, de) => (language() === "de" ? de : ar);
  if (enabled && !loginPage) root.classList.add("auth-pending");

  function nextPage(value) {
    try {
      const url = new URL(value || "index.html", location.href);
      if (
        url.origin === location.origin &&
        /^\/[a-z0-9-]+\.html$/.test(url.pathname) &&
        !url.pathname.endsWith("/login.html")
      )
        return url.pathname + url.search + url.hash;
    } catch (_) {}
    return "/index.html";
  }
  function goToLogin() {
    const target = new URL("login.html", location.href);
    target.searchParams.set("next", nextPage(location.href));
    location.replace(target.href);
  }
  function showMessage(ar, de, error = false) {
    message = { ar, de, error };
    const node = $("auth-message");
    if (!node) return;
    node.textContent = t(ar, de);
    node.classList.toggle("is-error", error);
    node.setAttribute("role", error ? "alert" : "status");
    node.hidden = false;
  }
  function showError(error) {
    const messages = {
      "auth/invalid-email": [
        "أدخل بريدًا إلكترونيًا صالحًا.",
        "Bitte gib eine gültige E-Mail-Adresse ein.",
      ],
      "auth/invalid-credential": [
        "البريد الإلكتروني أو كلمة السر غير صحيحة.",
        "E-Mail-Adresse oder Passwort ist nicht richtig.",
      ],
      "auth/wrong-password": [
        "البريد الإلكتروني أو كلمة السر غير صحيحة.",
        "E-Mail-Adresse oder Passwort ist nicht richtig.",
      ],
      "auth/user-not-found": [
        "البريد الإلكتروني أو كلمة السر غير صحيحة.",
        "E-Mail-Adresse oder Passwort ist nicht richtig.",
      ],
      "auth/email-already-in-use": [
        "هذا البريد مستخدم بالفعل. سجّل الدخول أو استعد كلمة السر.",
        "Diese E-Mail-Adresse wird bereits verwendet. Melde dich an oder setze dein Passwort zurück.",
      ],
      "auth/weak-password": [
        "اختر كلمة سر أقوى من ٦ أحرف على الأقل، وراعِ متطلبات المشروع.",
        "Wähle ein stärkeres Passwort mit mindestens 6 Zeichen und beachte die Passwortvorgaben des Projekts.",
      ],
      "auth/password-does-not-meet-requirements": [
        "كلمة السر لا تستوفي متطلبات المشروع. استخدم كلمة سر أطول تتضمن أحرفًا كبيرة وصغيرة وأرقامًا ورموزًا.",
        "Das Passwort erfüllt die Projektvorgaben nicht. Verwende ein längeres Passwort mit Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen.",
      ],
      "auth/too-many-requests": [
        "محاولات كثيرة. انتظر قليلًا ثم حاول مجددًا.",
        "Zu viele Versuche. Bitte warte etwas und versuche es erneut.",
      ],
      "auth/network-request-failed": [
        "تعذّر الاتصال. تحقّق من الإنترنت وحاول مجددًا.",
        "Keine Verbindung. Prüfe deine Internetverbindung und versuche es erneut.",
      ],
      "auth/user-disabled": [
        "هذا الحساب معطّل. تواصل مع المعلّم.",
        "Dieses Konto wurde deaktiviert. Wende dich an deinen Lehrer.",
      ],
      "auth/operation-not-allowed": [
        "الدخول بالبريد وكلمة السر غير مفعّل بعد في Firebase. تواصل مع المعلّم.",
        "E-Mail/Passwort ist im Firebase-Projekt noch nicht aktiviert. Wende dich an deinen Lehrer.",
      ],
      "auth/unauthorized-domain": [
        "هذا النطاق غير مفعّل للتسجيل بعد. تواصل مع المعلّم.",
        "Diese Domain ist noch nicht für die Anmeldung freigegeben. Wende dich an deinen Lehrer.",
      ],
      "auth/web-storage-unsupported": [
        "اسمح للمتصفح بحفظ بيانات الموقع، ثم حاول مجددًا.",
        "Erlaube dem Browser das Speichern von Websitedaten und versuche es erneut.",
      ],
    };
    const pair = messages[error?.code] || [
      "تعذّر إكمال العملية. حاول مجددًا.",
      "Der Vorgang konnte nicht abgeschlossen werden. Bitte versuche es erneut.",
    ];
    showMessage(...pair, true);
  }
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const node = document.createElement("script");
      const timer = setTimeout(() => {
        node.remove();
        reject(new Error("Script download timed out"));
      }, 20000);
      node.src = src;
      node.onload = () => {
        clearTimeout(timer);
        resolve();
      };
      node.onerror = () => {
        clearTimeout(timer);
        node.remove();
        reject(new Error("Script unavailable"));
      };
      document.head.append(node);
    });
  }
  function blocker(failed = false) {
    let node = $("auth-blocker");
    if (!node) {
      node = document.createElement("section");
      node.className = "auth-blocker";
      node.id = "auth-blocker";
      document.body.append(node);
    }
    node.replaceChildren();
    const title = document.createElement("h1");
    title.lang = "ar";
    title.dir = "rtl";
    title.textContent = "حروف من الزيتون";
    const text = document.createElement("p");
    text.setAttribute("role", "status");
    text.textContent = failed
      ? t(
          "تعذّر الاتصال أو تحميل الصفحة. تحقّق من الإنترنت وحاول مجددًا.",
          "Die Verbindung oder das Laden der Seite ist fehlgeschlagen. Prüfe deine Internetverbindung und versuche es erneut.",
        )
      : t("جارٍ التحقّق من تسجيل الدخول…", "Deine Anmeldung wird geprüft …");
    node.append(title, text);
    if (failed) {
      const retry = document.createElement("button");
      retry.type = "button";
      retry.textContent = t("حاول مجددًا", "Erneut versuchen");
      retry.addEventListener("click", () => location.reload());
      node.append(retry);
    }
  }
  async function startApp(user) {
    const scripts = Array.from(
      document.querySelectorAll("script[data-auth-src]"),
    );
    if (!scripts.length) throw new Error("Hosting build required");
    storage.local.setScope(user.uid);
    storage.session.setScope(user.uid);
    try {
      await loadScript("js/cloud-sync-core.js");
      await loadScript("js/cloud-sync.js");
      await window.OliveSync.start({ user, loadScript });
    } catch (_) {
      // Learning remains available locally if the sync SDK cannot be loaded.
      if (!window.OliveSync)
        storage.local.subscribe(({ key, oldValue, value }) => {
          if (key.startsWith("__")) return;
          let pending;
          try {
            pending =
              JSON.parse(storage.local.getItem("__oliveSyncFallbackV1")) || {};
          } catch (_) {
            pending = {};
          }
          pending[key] = {
            base: Object.prototype.hasOwnProperty.call(pending, key)
              ? pending[key].base
              : oldValue,
            value,
          };
          storage.local.setItem(
            "__oliveSyncFallbackV1",
            JSON.stringify(pending),
            { silent: true },
          );
        });
    }
    storage.deferReady();
    for (const script of scripts) {
      try {
        await loadScript(script.dataset.authSrc);
      } catch (error) {
        // Spreadsheet import is optional; cached learning content remains usable.
        if (
          !script.dataset.authSrc.startsWith(
            "https://cdn.jsdelivr.net/npm/xlsx@",
          )
        )
          throw error;
      }
    }
    storage.finishReady();
    addAccountMenu(user);
    $("auth-blocker")?.remove();
    root.classList.remove("auth-pending");
  }
  function addAccountMenu(user) {
    const menu = document.createElement("details");
    menu.id = "olive-account";
    menu.className = "olive-account";
    const summary = document.createElement("summary");
    summary.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/></svg>';
    const panel = document.createElement("div");
    panel.className = "olive-account-panel";
    const email = document.createElement("p");
    email.dir = "ltr";
    email.textContent = user.email || "";
    const note = document.createElement("p");
    note.className = "olive-account-note";
    note.id = "auth-sync-status";
    note.setAttribute("role", "status");
    note.setAttribute("aria-live", "polite");
    const syncButton = document.createElement("button");
    syncButton.id = "auth-sync-now";
    syncButton.type = "button";
    let syncing = false;
    const logout = document.createElement("button");
    logout.id = "auth-signout";
    logout.type = "button";
    function translate() {
      summary.setAttribute("aria-label", t("حسابي", "Mein Konto"));
      summary.title = t("حسابي", "Mein Konto");
      const state = window.OliveSync?.state() || { status: "offline" };
      const newStand = state.remoteChanged && state.status === "saved";
      const statuses = {
        connecting: [
          "جارٍ الاتصال بحفظ التقدّم…",
          "Cloud-Verbindung wird hergestellt …",
        ],
        pending: [
          "محفوظ محليًا، بانتظار المزامنة…",
          "Lokal gespeichert. Synchronisierung ausstehend …",
        ],
        saving: [
          "جارٍ مزامنة التقدّم…",
          "Dein Lernstand wird synchronisiert …",
        ],
        saved: [
          "تمت مزامنة التقدّم مع حسابك.",
          "Dein Lernstand ist synchronisiert.",
        ],
        offline: [
          "المزامنة غير متاحة حاليًا. نحتفظ بالتغييرات محليًا ونحاول مجددًا عند الاتصال.",
          "Cloud gerade nicht erreichbar. Änderungen bleiben lokal gespeichert und werden erneut übertragen.",
        ],
        setup: [
          "الحفظ السحابي غير مفعّل بعد. التقدّم محفوظ محليًا.",
          "Cloud-Speicherung noch nicht freigeschaltet. Dein Lernstand bleibt lokal gespeichert.",
        ],
        "too-large": [
          "البيانات أكبر من حد المزامنة. التقدّم محفوظ محليًا.",
          "Ein Datensatz ist zu groß für die Synchronisierung. Dein Lernstand bleibt lokal gespeichert.",
        ],
      };
      note.textContent = newStand
        ? t(
            "يوجد تقدّم جديد من جهاز آخر. اضغط لتحديث الصفحة بعد حفظ تغييراتك.",
            "Neue Lernstände sind verfügbar. Beim Übernehmen wird diese Seite nach dem Speichern neu geladen.",
          )
        : t(...(statuses[state.status] || statuses.offline));
      syncButton.textContent = syncing
        ? t("لحظة من فضلك…", "Einen Moment …")
        : newStand
          ? t("حفظ وتحديث التقدّم", "Speichern und übernehmen")
          : t("المزامنة الآن", "Jetzt synchronisieren");
      syncButton.disabled = syncing;
      summary.dataset.sync = newStand ? "new" : state.status;
      logout.textContent = t("تسجيل الخروج", "Abmelden");
    }
    syncButton.addEventListener("click", async () => {
      syncing = true;
      translate();
      try {
        if (window.OliveSync) await window.OliveSync.refresh();
        else location.reload();
      } finally {
        syncing = false;
        translate();
      }
    });
    logout.addEventListener("click", async () => {
      logout.disabled = true;
      try {
        root.classList.add("auth-pending");
        blocker();
        if (window.OliveSync) {
          await Promise.race([
            window.OliveSync.flush(),
            new Promise((resolve) => setTimeout(resolve, 1800)),
          ]);
          window.OliveSync.stop();
        }
        await auth.signOut();
      } catch (_) {
        root.classList.remove("auth-pending");
        $("auth-blocker")?.remove();
        logout.disabled = false;
        note.textContent = t(
          "تعذّر تسجيل الخروج. حاول مجددًا.",
          "Abmelden fehlgeschlagen. Bitte versuche es erneut.",
        );
      }
    });
    panel.append(email, note, syncButton, logout);
    menu.append(summary, panel);
    document.querySelector(".topbar-right")?.prepend(menu);
    translate();
    window.OliveSync?.subscribe(translate);
    window.addEventListener("app-language-change", translate);
    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target)) menu.open = false;
    });
    menu.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        menu.open = false;
        summary.focus();
      }
    });
  }
  function renderLogin() {
    root.lang = language();
    root.dir = language() === "ar" ? "rtl" : "ltr";
    document
      .querySelectorAll("[data-auth-ar][data-auth-de]")
      .forEach((node) => {
        node.textContent = t(node.dataset.authAr, node.dataset.authDe);
      });
    document.querySelectorAll("[data-auth-language]").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.authLanguage === language()),
      );
    });
    const titles = {
      login: ["أهلًا بعودتك", "Willkommen zurück"],
      register: ["ابدأ رحلتك معنا", "Deine Lernreise beginnt"],
      reset: ["استعادة كلمة السر", "Passwort zurücksetzen"],
    };
    $("auth-title").textContent = t(...titles[mode]);
    document.title = t(...titles[mode]) + " · حروف من الزيتون";
    $("auth-password-field").hidden = mode === "reset";
    $("auth-confirm-field").hidden = mode !== "register";
    $("auth-remember-field").hidden = mode === "reset";
    $("auth-show-password").hidden = mode === "reset";
    $("auth-password").required = mode !== "reset";
    $("auth-password").minLength = mode === "register" ? 6 : 1;
    $("auth-password").autocomplete =
      mode === "register" ? "new-password" : "current-password";
    $("auth-confirm").required = mode === "register";
    $("auth-password-help").hidden = mode !== "register";
    const submit = {
      login: ["تسجيل الدخول", "Anmelden"],
      register: ["إنشاء حساب", "Konto erstellen"],
      reset: ["إرسال رابط الاستعادة", "Link zum Zurücksetzen senden"],
    };
    $("auth-submit").textContent = busy
      ? t("لحظة من فضلك…", "Einen Moment …")
      : t(...submit[mode]);
    $("auth-submit").disabled = busy || !authReady;
    $("auth-form").setAttribute("aria-busy", String(busy));
    document.querySelectorAll("[data-auth-mode]").forEach((button) => {
      button.disabled = busy;
      button.hidden = button.dataset.authMode === mode;
    });
    if (message) showMessage(message.ar, message.de, message.error);
  }
  function setupLogin() {
    document.querySelectorAll("[data-auth-language]").forEach((button) =>
      button.addEventListener("click", () => {
        storage.local.setItem(
          "vocabInterfaceLanguage",
          button.dataset.authLanguage,
        );
        renderLogin();
      }),
    );
    document.querySelectorAll("[data-auth-mode]").forEach((button) =>
      button.addEventListener("click", () => {
        mode = button.dataset.authMode;
        message = null;
        $("auth-message").hidden = true;
        $("auth-password").value = "";
        $("auth-confirm").value = "";
        $("auth-password").type = "password";
        $("auth-confirm").type = "password";
        $("auth-show-password").checked = false;
        renderLogin();
        $("auth-email").focus();
      }),
    );
    $("auth-show-password").addEventListener("change", (event) => {
      const type = event.target.checked ? "text" : "password";
      $("auth-password").type = type;
      $("auth-confirm").type = type;
    });
    $("auth-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!authReady || busy || !$("auth-form").reportValidity()) return;
      if (
        mode === "register" &&
        $("auth-password").value !== $("auth-confirm").value
      ) {
        showMessage(
          "كلمتا السر غير متطابقتين.",
          "Die Passwörter stimmen nicht überein.",
          true,
        );
        return;
      }
      busy = true;
      message = null;
      $("auth-message").hidden = true;
      renderLogin();
      try {
        const email = $("auth-email").value.trim();
        if (mode === "reset") {
          try {
            await auth.sendPasswordResetEmail(email);
          } catch (error) {
            if (error.code !== "auth/user-not-found") throw error;
          }
          showMessage(
            "إذا كان هناك حساب بهذا البريد، فستصلك رسالة لاستعادة كلمة السر. افحص البريد غير المرغوب فيه أيضًا.",
            "Falls für diese E-Mail-Adresse ein Konto besteht, erhältst du einen Link zum Zurücksetzen. Prüfe auch deinen Spamordner.",
          );
        } else {
          await auth.setPersistence(
            $("auth-remember").checked
              ? window.firebase.auth.Auth.Persistence.LOCAL
              : window.firebase.auth.Auth.Persistence.SESSION,
          );
          if (mode === "register")
            await auth.createUserWithEmailAndPassword(
              email,
              $("auth-password").value,
            );
          else
            await auth.signInWithEmailAndPassword(
              email,
              $("auth-password").value,
            );
          $("auth-password").value = "";
          $("auth-confirm").value = "";
          location.replace(
            nextPage(new URLSearchParams(location.search).get("next")),
          );
        }
      } catch (error) {
        showError(error);
      } finally {
        busy = false;
        renderLogin();
      }
    });
    $("auth-retry").addEventListener("click", () => location.reload());
    renderLogin();
    if (!enabled) {
      $("auth-form").hidden = true;
      $("auth-links").hidden = true;
      $("auth-offline").hidden = false;
    }
  }
  async function start() {
    if (loginPage) setupLogin();
    if (!enabled) return;
    if (!loginPage) blocker();
    let timer;
    try {
      await loadScript("js/vendor/firebase/firebase-app-compat.js");
      await loadScript("js/vendor/firebase/firebase-auth-compat.js");
      const app = window.firebase.initializeApp(config.firebase);
      auth = app.auth();
      if (config.emulator)
        auth.useEmulator("http://127.0.0.1:9099", { disableWarnings: true });
      timer = setTimeout(() => {
        if (!authReady) {
          if (loginPage) showError({ code: "auth/network-request-failed" });
          else blocker(true);
        }
      }, 20000);
      auth.onAuthStateChanged(
        async (user) => {
          clearTimeout(timer);
          authReady = true;
          currentUser = user;
          if (loginPage) {
            renderLogin();
            if (user && !busy)
              location.replace(
                nextPage(new URLSearchParams(location.search).get("next")),
              );
            return;
          }
          if (!user) {
            window.OliveSync?.stop();
            root.classList.add("auth-pending");
            goToLogin();
            return;
          }
          if (starting || startedUid) {
            if (startedUid && startedUid !== user.uid) {
              window.OliveSync?.stop();
              root.classList.add("auth-pending");
              location.reload();
            }
            return;
          }
          starting = true;
          startedUid = user.uid;
          try {
            await startApp(user);
          } catch (_) {
            root.classList.add("auth-pending");
            blocker(true);
          } finally {
            starting = false;
          }
        },
        () => {
          clearTimeout(timer);
          if (loginPage) showError({ code: "auth/network-request-failed" });
          else blocker(true);
        },
      );
    } catch (_) {
      clearTimeout(timer);
      if (loginPage) {
        showMessage(
          "تعذّر تحميل تسجيل الدخول. تحقّق من الإنترنت ثم أعد تحميل الصفحة.",
          "Die Anmeldung konnte nicht geladen werden. Prüfe deine Internetverbindung und lade die Seite erneut.",
          true,
        );
        $("auth-retry").hidden = false;
      } else blocker(true);
    }
  }
  document.addEventListener("DOMContentLoaded", start, { once: true });
  window.addEventListener("pageshow", (event) => {
    if (enabled && !loginPage && event.persisted) {
      root.classList.add("auth-pending");
      location.reload();
    }
  });
  window.OliveAuth = { enabled, getUser: () => currentUser || null };
})();
