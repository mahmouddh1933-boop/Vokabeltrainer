/* Visual preferences only. Learning data and existing storage keys stay independent. */
(() => {
  "use strict";
  const KEY = "oliveLearnerThemeV1";
  const storage = window.JisrStorage.local;
  const valid = (value) => ["boy", "girl", "neutral"].includes(value);
  const stored = storage.getItem(KEY);
  let theme = valid(stored) ? stored : "neutral";
  let chosen = valid(stored);
  document.documentElement.dataset.learnerTheme = theme;
  const t = (ar, de) => (window.AppLanguage?.get() === "de" ? de : ar);
  let overlay, panel, trigger, returnFocus;
  let inertBefore = [];
  function translated(node, ar, de) {
    node.dataset.ar = ar;
    node.dataset.de = de;
    node.textContent = t(ar, de);
    return node;
  }
  function node(tag, className) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    return element;
  }
  function sync() {
    document.documentElement.dataset.learnerTheme = theme;
    const names = {
      boy: t("ولد", "Junge"),
      girl: t("بنت", "Mädchen"),
      neutral: t("زيتون فقط", "Nur Olivenzweige"),
    };
    if (trigger) {
      trigger.setAttribute(
        "aria-label",
        t("تغيير رسومات الخلفية: ", "Hintergrund ändern: ") + names[theme],
      );
      trigger.title = t("غيّر رسوماتك", "Hintergrund wählen");
      trigger.querySelector("span").textContent = t(
        "رسوماتي",
        "Mein Hintergrund",
      );
    }
    overlay
      ?.querySelectorAll("[data-learner-choice]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(chosen && button.dataset.learnerChoice === theme),
        ),
      );
    overlay?.querySelectorAll("[data-ar][data-de]").forEach((el) => {
      el.textContent = t(el.dataset.ar, el.dataset.de);
    });
  }
  function choose(value) {
    if (!valid(value)) return;
    theme = value;
    chosen = true;
    storage.setItem(KEY, value);
    sync();
    window.dispatchEvent(
      new CustomEvent("learner-theme-change", { detail: { theme: value } }),
    );
    close();
  }
  function close() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    document.body.classList.remove("olive-chooser-open");
    for (const [el, inert] of inertBefore) el.inert = inert;
    inertBefore = [];
    window.dispatchEvent(new Event("olive-picker-visibility-change"));
    const target = returnFocus?.isConnected
      ? returnFocus
      : document.getElementById("hero-start") || trigger;
    target?.focus({ preventScroll: true });
  }
  function open() {
    if (!overlay || !overlay.hidden) return;
    returnFocus =
      document.activeElement?.closest("button,a,input,select") || null;
    overlay.hidden = false;
    document.body.classList.add("olive-chooser-open");
    sync();
    inertBefore = Array.from(
      document.querySelectorAll(
        "body > main, body > footer, .app-sidebar, .app-topbar, .skip-link",
      ),
    ).map((el) => [el, el.inert]);
    inertBefore.forEach(([el]) => {
      el.inert = true;
    });
    window.dispatchEvent(new Event("olive-picker-visibility-change"));
    panel.focus({ preventScroll: true });
  }
  function maybeWelcome() {
    const page = location.pathname.split("/").pop();
    if (
      (!page || page === "index.html") &&
      !chosen &&
      !document.getElementById("language-welcome")
    )
      open();
  }
  function makePicker() {
    overlay = node("div", "olive-chooser");
    overlay.id = "olive-learner-setup";
    overlay.hidden = true;
    panel = node("section", "olive-chooser-panel");
    panel.tabIndex = -1;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", "olive-chooser-title");
    panel.setAttribute("aria-describedby", "olive-chooser-help");
    const mark = node("img", "olive-chooser-mark");
    mark.src = "images/brand/olive-symbol.svg";
    mark.alt = "";
    const eyebrow = translated(
      node("p", "olive-eyebrow"),
      "حروف من الزيتون",
      "حروف من الزيتون",
    );
    eyebrow.lang = "ar";
    eyebrow.dir = "rtl";
    const title = translated(
      node("h2"),
      "اختر رسوماتك",
      "Wähle deinen Hintergrund",
    );
    title.id = "olive-chooser-title";
    const help = translated(
      node("p"),
      "شخصيتان لرحلة بين الحروف وأشجار الزيتون. يمكنك تغيير الرسومات في أي وقت.",
      "Zwei Figuren begleiten dich durch Buchstaben und Olivenbäume. Du kannst den Hintergrund jederzeit ändern.",
    );
    help.id = "olive-chooser-help";
    const choices = node("div", "olive-choice-grid");
    for (const [id, ar, de, captionAr, captionDe] of [
      [
        "boy",
        "أنا ولد",
        "Ich bin ein Junge",
        "رفيق رحلة الحروف",
        "Dein Begleiter beim Lernen",
      ],
      [
        "girl",
        "أنا بنت",
        "Ich bin ein Mädchen",
        "رفيقة رحلة الحروف",
        "Deine Begleiterin beim Lernen",
      ],
    ]) {
      const b = node("button", "olive-profile-choice");
      b.type = "button";
      b.dataset.learnerChoice = id;
      const preview = node("span", "olive-character-preview");
      preview.dataset.character = id;
      preview.setAttribute("aria-hidden", "true");
      b.append(
        preview,
        translated(node("strong"), ar, de),
        translated(node("small"), captionAr, captionDe),
      );
      b.addEventListener("click", () => choose(id));
      choices.append(b);
    }
    const neutral = translated(
      node("button", "olive-neutral-choice"),
      "أفضّل رسومات الزيتون فقط",
      "Ich möchte nur Olivenzweige",
    );
    neutral.type = "button";
    neutral.dataset.learnerChoice = "neutral";
    neutral.addEventListener("click", () => choose("neutral"));
    panel.append(mark, eyebrow, title, help, choices, neutral);
    overlay.append(panel);
    document.body.append(overlay);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        if (!chosen) choose("neutral");
        else close();
      }
    });
    document.addEventListener(
      "keydown",
      (e) => {
        if (overlay.hidden) return;
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopImmediatePropagation();
          if (!chosen) choose("neutral");
          else close();
        }
        if (e.key !== "Tab") return;
        const buttons = Array.from(
          panel.querySelectorAll("button:not(:disabled),a[href],input,select"),
        );
        const first = buttons[0],
          last = buttons[buttons.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first || document.activeElement === panel)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      },
      true,
    );
  }
  window.JisrStorage.ready(() => {
    document.body.classList.add("olive-app");
    const backdrop = node("div", "olive-backdrop");
    backdrop.id = "olive-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    backdrop.append(node("div", "olive-drawing-field"));
    document.body.prepend(backdrop);
    trigger = node("button", "olive-theme-open");
    trigger.id = "olive-theme-open";
    trigger.type = "button";
    trigger.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 21C9 13 13 8 20 3M9 14C2 14 2 8 3 5c6 1 8 5 6 9ZM13 9c0-5 4-7 8-7 0 5-3 8-8 7Zm0 3c5-2 9 0 10 3-5 3-9 2-10-3Z"/></svg><span></span>';
    const avatar = document.querySelector(".topbar-avatar");
    if (avatar) avatar.replaceWith(trigger);
    else document.querySelector(".topbar-right")?.append(trigger);
    trigger.addEventListener("click", open);
    makePicker();
    sync();
    maybeWelcome();
    window.addEventListener("app-language-change", () => {
      sync();
      queueMicrotask(maybeWelcome);
    });
  });
  window.OliveTheme = { get: () => theme, choose, open };
})();
