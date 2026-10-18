(() => {
  "use strict";
  const paths = {
    home: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    book: '<path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v15"/>',
    letters:
      '<path d="m4 19 5-14 5 14M6 14h6m4-8h6m-3-3v3m-3 4c1 4 3 6 6 8m0-12c0 5-2 9-7 12"/>',
    check:
      '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="m8 12 3 3 5-6"/>',
    chart: '<path d="M4 4v16h17M9 15v-4m5 4V7m5 8v-6"/>',
    repeat:
      '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6 7a7 7 0 0 1 12-1l2 3M4 15l2 3a7 7 0 0 0 12-1"/>',
    upload:
      '<path d="M12 16V3m-5 5 5-5 5 5M4 15v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5"/>',
    arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    spark:
      '<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z"/>',
  };
  const icon = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.book}</svg>`;
  const label = (de, ar) =>
    `<span data-de="${de}" data-ar="${ar}">${ar}</span>`;
  document.addEventListener("DOMContentLoaded", () => {
    const page = location.pathname.split("/").pop() || "index.html";
    const isHome = page === "index.html";
    const nav = [
      ["index.html", "home", "Übersicht", "نظرة عامة"],
      ["index.html#ready-lists-panel", "book", "Mein Lernpfad", "مسار تعلّمي"],
      ["huruf.html", "letters", "Das Alphabet", "الحروف العربية"],
      ["test.html", "check", "Wissen testen", "اختبر معرفتك"],
      ["review.html", "repeat", "Wiederholen", "المراجعة"],
      ["stats.html", "chart", "Mein Fortschritt", "تقدّمي"],
      ["verbs.html", "book", "Verben lernen", "تصريف الأفعال"],
      [
        "grammar.html",
        "letters",
        "Grammatik & Rechtschreibung",
        "قواعد العربية",
      ],
    ];
    const sidebar = document.createElement("aside");
    sidebar.className = "app-sidebar";
    sidebar.id = "app-sidebar";
    sidebar.innerHTML = `<a href="index.html" class="brand" aria-label="Jisr"><span class="brand-mark" lang="ar">جـ</span><span class="brand-type">jisr<span>جسر · ${label("Arabisch lernen", "تعلّم العربية")}</span></span></a>
      <div class="sidebar-label">${label("DEIN LERNRAUM", "مساحة التعلّم")}</div>
      <nav aria-label="${document.documentElement.lang === "de" ? "Hauptnavigation" : "القائمة الرئيسية"}">${nav.map(([href, name, de, ar]) => `<a href="${href}" class="nav-link ${href === page || (isHome && href === "index.html") || (page.startsWith("test") && href === "test.html") || (page === "lernseite.html" && href === "index.html#ready-lists-panel") ? "is-active" : ""}" ${href === page ? 'aria-current="page"' : ""}>${icon(name)}${label(de, ar)}${href === "index.html#ready-lists-panel" ? '<span class="nav-badge">20</span>' : ""}</a>`).join("")}</nav>
      <div class="sidebar-bottom"><div class="sidebar-note"><span class="note-spark">✳</span><strong>${label("Ein Wort kann eine Brücke sein.", "قد تكون الكلمة جسراً.")}</strong><p>${label("Bleib neugierig. Der Rest kommt Wort für Wort.", "ابقَ فضولياً. والباقي يأتي كلمة بعد كلمة.")}</p></div><a class="teacher-profile" href="index.html"><span class="teacher-avatar">MB</span><span><strong>Mahmoud Barakat</strong><small>${label("Dein Arabischlehrer", "معلّم اللغة العربية")}</small></span><span class="profile-dot"></span></a></div>`;
    document.body.prepend(sidebar);
    const topbar = document.createElement("header");
    topbar.className = "app-topbar";
    const current =
      page === "lernseite.html"
        ? nav[1]
        : nav.find((item) => item[0] === page) ||
          (page.startsWith("test")
            ? nav[3]
            : ["", "book", "Lernraum", "مساحة التعلّم"]);
    topbar.innerHTML = `<div class="topbar-left"><button type="button" class="menu-toggle" aria-controls="app-sidebar" aria-expanded="false" aria-label="Menü / القائمة">${icon("menu")}</button><span class="breadcrumb-brand">jisr</span><span class="breadcrumb-separator">/</span>${label(current[2], current[3])}</div><div class="topbar-right"><span class="learning-indicator"><span></span>${label("Zeit für etwas Neues", "وقت لاكتشاف شيء جديد")}</span><div class="language-slot"></div><span class="topbar-avatar" aria-hidden="true">${icon("spark")}</span></div>`;
    sidebar.after(topbar);
    const picker = document.querySelector(".app-language-bar");
    if (picker) topbar.querySelector(".language-slot").append(picker);
    const backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    backdrop.hidden = true;
    topbar.after(backdrop);
    const toggle = topbar.querySelector(".menu-toggle");
    const mobile = matchMedia("(max-width: 960px)");
    function syncNavigation() {
      sidebar.inert =
        mobile.matches && !document.body.classList.contains("nav-open");
    }
    function setMenu(open) {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.innerHTML = icon(open ? "close" : "menu");
      backdrop.hidden = !open;
      syncNavigation();
      if (open) sidebar.querySelector("a").focus();
    }
    mobile.addEventListener("change", () => {
      if (!mobile.matches) setMenu(false);
      syncNavigation();
    });
    syncNavigation();
    toggle.addEventListener("click", () =>
      setMenu(!document.body.classList.contains("nav-open")),
    );
    backdrop.addEventListener("click", () => setMenu(false));
    document.addEventListener("keydown", (e) => {
      if (!document.body.classList.contains("nav-open")) return;
      if (e.key === "Escape") {
        setMenu(false);
        toggle.focus();
      }
      if (e.key === "Tab") {
        const links = sidebar.querySelectorAll("a[href]");
        const first = links[0],
          last = links[links.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
    sidebar
      .querySelectorAll("nav a")
      .forEach((a) => a.addEventListener("click", () => setMenu(false)));
    const main = document.querySelector("main");
    if (main && !main.id) main.id = "main-content";
    const skip = document.createElement("a");
    skip.href = "#main-content";
    skip.className = "skip-link";
    skip.innerHTML = label("Zum Inhalt", "إلى المحتوى");
    document.body.prepend(skip);
    document
      .querySelectorAll("[data-icon]")
      .forEach((el) => (el.innerHTML = icon(el.dataset.icon)));
    document
      .querySelectorAll(".stat-arrow,.hero-cta>span:last-child")
      .forEach((el) => (el.innerHTML = icon("arrow")));
    document.querySelectorAll(".tool-link").forEach((el) => {
      el.dataset.de = el.dataset.de.replace(" ↗", "");
      el.dataset.ar = el.dataset.ar.replace(" ↖", "");
    });
    const footer = document.getElementById("teacher-credit");
    if (footer)
      footer.innerHTML = `<span>© jisr · ${label("Mit Neugier wächst Verbindung.", "بالفضول تنمو الروابط.")}</span><span>${label("Mit Sorgfalt erstellt von", "أُعدّ بعناية على يد")} <b>Mahmoud Barakat</b></span>`;
    function syncLanguage() {
      const lang =
        window.AppLanguage?.get() ||
        localStorage.getItem("vocabInterfaceLanguage") ||
        "ar";
      document.querySelectorAll("[data-de][data-ar]").forEach((el) => {
        const value = el.dataset[lang].replaceAll("\\n", "\n");
        if (el.textContent !== value) el.textContent = value;
      });
      sidebar
        .querySelector("nav")
        .setAttribute(
          "aria-label",
          lang === "de" ? "Hauptnavigation" : "القائمة الرئيسية",
        );
    }
    window.addEventListener("app-language-change", syncLanguage);
    syncLanguage();
    document.getElementById("hero-start")?.addEventListener("click", () =>
      document.getElementById("ready-lists-panel").scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      }),
    );
    document
      .querySelector(".file-upload-label")
      ?.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          document.getElementById("file-upload").click();
        }
      });
    if (location.hash === "#excel-panel")
      document.getElementById("show-excel-button")?.click();
  });
})();
