(() => {
  "use strict";
  const localStorage = window.JisrStorage.local;
  const paths = {
    phonics:'<circle cx="5" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><path d="M7 12h10M10 7l4 5-4 5M3 5v2m18-2v2M3 17v2m18-2v2"/>',
    reader:'<path d="M4 4h12v7M4 4v16h8M7 8h6M7 12h3M7 16h3"/><circle cx="16" cy="15" r="4"/><path d="m19 18 3 3"/>',
    workshop:'<path d="M4 3h10v5M4 3v18h16V11M14 3l6 5h-6V3M7 8h4M7 12h4M7 16h3m3 3 1-4 6-6 3 3-6 6-4 1Z"/>',
    vocab:'<rect x="7" y="4" width="14" height="17" rx="2"/><path d="M4 18H3V2h14M10 10h8M10 14h6M10 18h4"/>',
    skills:'<path d="M3 5h8v14H3zM11 8h10v11H11M6 8h2M6 11h2M14 12l2 2 3-4M14 17h4"/>',
    sentence:'<path d="M3 4h18v14H7l-4 3V4Z M6 8h5m3 0h4M6 12h12M6 15h8"/>',
    story:'<path d="M12 5C8 2 4 3 2 4v16c4-2 7-1 10 1 3-2 6-3 10-1V4c-3-1-7-1-10 1Zm0 0v16M5 8h4M5 12h4M16 7l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z"/>',
    grammar:'<path d="M5 3h14v18H5zM8 7h8M8 11h8M8 15h3M14 16l2 2 4-5"/>',
    verbs:'<path d="M4 6h13l-3-3M20 18H7l3 3M20 6v6M4 18v-6M8 10l-2 2 2 2m8-4 2 2-2 2M11 15l2-6"/>',
    books:'<path d="M3 4h5v17H3zM8 7h5v14H8zM14 5l5-1 4 16-5 1-4-16ZM4 8h3m2 3h3m4-1 5-1"/>',
    exam:'<path d="M8 3h8v3H8zM7 4H4v18h16V4h-3M7 10l1 1 2-2m2 1h5M7 15l1 1 2-2m2 1h5M7 19h10"/>',
    placement:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/><path d="m16 8 6-6m-4 0h4v4"/>',
    gallery:'<rect x="2" y="5" width="20" height="15" rx="2"/><circle cx="8" cy="10" r="2"/><path d="m3 18 6-5 4 3 4-6 5 7M6 2h12"/>',
    admin:'<path d="M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6l-9-4Z"/><circle cx="12" cy="9" r="2"/><path d="M8 16c0-4 8-4 8 0"/>',
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
  const iconForPage=href=>({
    'index.html':'home','letters.html':'letters','huruf.html':'letters','letter-tests.html':'check','sounds.html':'phonics',
    'reading.html':'phonics','reading-trainer.html':'reader','reading-exercises.html':'workshop','progress.html':'chart',
    'vocabulary.html':'vocab','lernseite.html':'vocab','skills.html':'skills','sentences.html':'sentence','stories.html':'story',
    'grammar.html':'grammar','verbs.html':'verbs','books.html':'books','exams.html':'exam','placement.html':'placement',
    'review.html':'repeat','test.html':'check','stats.html':'chart','apps.html':'gallery','admin.html':'admin'
  })[href.split(/[?#]/)[0]]||'book';
  const label = (de, ar) =>
    `<span data-de="${de}" data-ar="${ar}">${ar}</span>`;
  window.JisrStorage.ready(() => {
    const page = location.pathname.split("/").pop() || "index.html";
    const isHome = page === "index.html";
    const nav = [
      ...window.LearningRoute.stages,
      ...(window.OliveAccess?.isAdmin() ? [{id:"admin",href:"admin.html",ar:"لوحة الإدارة",de:"Verwaltung"}] : []),
      { id: "exams", href: "exams.html", ar: "الاختبارات", de: "Tests" },
      {
        id: "placement",
        href: "placement.html",
        ar: "تحديد المستوى",
        de: "Einstufung",
      },
    ].map((s) => [
      s.href,
      iconForPage(s.href),
      s.de,
      s.ar,
    ]);
    const activeHref = ["exams.html", "placement.html", "admin.html"].includes(page)
      ? page
      : window.LearningRoute.stage?.href;
    const sidebar = document.createElement("aside");
    sidebar.className = "app-sidebar";
    sidebar.id = "app-sidebar";
    sidebar.innerHTML = `<a href="index.html" class="brand" aria-label="حروف من الزيتون"><span class="brand-mark"><img src="images/brand/olive-symbol.svg" alt="" /></span><span class="brand-type" lang="ar" dir="rtl">حروف من الزيتون<span>${label("Mit festen Wurzeln wachsen", "نتعلّم وننمو، بجذور راسخة")}</span></span></a>
      <div class="sidebar-label">${label("DEIN LERNRAUM", "مساحة التعلّم")}</div>
      <nav aria-label="${document.documentElement.lang === "de" ? "Hauptnavigation" : "القائمة الرئيسية"}">${nav.map(([href, name, de, ar]) => `<a href="${href}" class="nav-link ${href === activeHref ? "is-active" : ""}" ${href === activeHref ? 'aria-current="page"' : ""}>${icon(name)}${label(de, ar)}${href === "index.html#ready-lists-panel" ? `<span class="nav-badge">${window.VOCAB_CATALOG_META?.lists || 120}</span>` : ""}</a>`).join("")}</nav>
      <div class="sidebar-bottom"><p class="sidebar-credit" lang="ar" dir="rtl">إعداد الأستاذ محمود بركات</p></div>`;
    document.body.prepend(sidebar);
    const topbar = document.createElement("header");
    topbar.className = "app-topbar";
    const current =
      page === "exams.html"
        ? ["", "check", "Tests", "الاختبارات"]
        : page === "placement.html"
          ? [
              "",
              "check",
              "Diagnostische Einstiegschecks",
              "اختبارات تحديد المستوى",
            ]
          : nav.find((item) => item[0] === activeHref) || [
              "",
              "home",
              "Dein Lernpfad",
              "مسار تعلّمك",
            ];
    topbar.innerHTML = `<div class="topbar-left"><button type="button" class="menu-toggle" aria-controls="app-sidebar" aria-expanded="false" aria-label="Menü / القائمة">${icon("menu")}</button><span class="breadcrumb-brand" lang="ar" dir="rtl">حروف من الزيتون</span><span class="breadcrumb-separator">/</span>${label(current[2], current[3])}</div><div class="topbar-right"><span class="learning-indicator"><span></span>${label("Zeit für etwas Neues", "وقت لاكتشاف شيء جديد")}</span><div class="language-slot"></div><span class="topbar-avatar" aria-hidden="true">${icon("spark")}</span></div>`;
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
        document.body.classList.contains("olive-chooser-open") ||
        (mobile.matches && !document.body.classList.contains("nav-open"));
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
    window.addEventListener("olive-picker-visibility-change", syncNavigation);
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
    if (main && !isHome && page !== "login.html") {
      let destination = [
        "index.html",
        "رجوع إلى مسار التعلم",
        "Zurück zum Lernpfad",
      ];
      if (/^test[1-6]\.html$/.test(page) || page === "ergebnis.html")
        destination = [
          "test.html",
          "رجوع إلى اختيار الاختبار",
          "Zurück zur Testauswahl",
        ];
      else if (
        ["test.html", "placement.html"].includes(page) &&
        window.LearningRoute
      )
        destination = [
          "exams.html",
          "رجوع إلى قائمة الاختبارات",
          "Zurück zur Testübersicht",
        ];
      else if (
        window.LearningRoute?.stage &&
        window.LearningRoute.stage.href !== page
      ) {
        const parent = window.LearningRoute.stage;
        destination = [
          parent.href,
          "رجوع إلى " + parent.ar,
          "Zurück: " + parent.de,
        ];
      }
      const existing = main.querySelector(".teacher-exams-context a");
      const back = existing || document.createElement("a");
      back.href = destination[0];
      back.classList.add("page-back-link");
      back.dataset.ar = destination[1];
      back.dataset.de = destination[2];
      back.textContent = destination[1];
      if (existing) existing.parentElement.classList.add("page-back-nav");
      else {
        const bar = document.createElement("nav");
        bar.className = "page-back-nav";
        bar.setAttribute("aria-label", "الرجوع / Zurück");
        bar.append(back);
        main.prepend(bar);
      }
    }
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
      el.dataset.de = (el.dataset.de || "").replace(" ↗", "");
      el.dataset.ar = (el.dataset.ar || "").replace(" ↖", "");
    });
    const footer = document.getElementById("teacher-credit");
    if (footer)
      footer.innerHTML = `<span>© حروف من الزيتون · ${label("Mit Neugier wächst Verbindung.", "بالفضول تنمو الروابط.")}</span><span>${label("Mit Sorgfalt erstellt von", "أُعدّ بعناية على يد")} <b>Mahmoud Barakat</b></span>`;
    function syncLanguage() {
      const lang =
        window.AppLanguage?.get() ||
        localStorage.getItem("vocabInterfaceLanguage") ||
        "ar";
      document.querySelectorAll("[data-de][data-ar]").forEach((el) => {
        const value = el.dataset[lang].split("\\n").join("\n");
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
      document.getElementById("ready-lists-panel")?.scrollIntoView({
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
