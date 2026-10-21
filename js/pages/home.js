(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", async () => {
    const excelPanel = document.getElementById("excel-panel");
    const listsPanel = document.getElementById("ready-lists-panel");
    const learningPath = document.getElementById("learning-path");
    const learnButton = document.getElementById("learn-button");
    const successMessage = document.getElementById("success-message");
    const errorMessage = document.getElementById("error-message");

    const stats = VocabApp.getStats();
    const masterySummary = VocabApp.getMasterySummary();
    document.getElementById("wrong-total").textContent =
      VocabApp.getWrongWords().length;
    document.getElementById("mastered-lists-total").textContent =
      masterySummary.masteredLists;
    document.getElementById("tests-total").textContent = stats.totalTests || 0;

    function showPanel(kind) {
      excelPanel.hidden = kind !== "excel";
      listsPanel.hidden = false;
      const panel = kind === "excel" ? excelPanel : listsPanel;
      setTimeout(
        () => panel.scrollIntoView({ behavior: "smooth", block: "nearest" }),
        30,
      );
    }

    document
      .getElementById("show-excel-button")
      .addEventListener("click", () => showPanel("excel"));
    document.getElementById("review-button").addEventListener("click", () => {
      window.location.href = "./review.html";
    });
    document.getElementById("stats-button").addEventListener("click", () => {
      window.location.href = "./stats.html";
    });

    try {
      const catalog = await VocabApp.loadCatalog();
      renderLearningPath(catalog, learningPath);
    } catch (error) {
      learningPath.innerHTML = `<p class="empty-message">${VocabApp.escapeHTML(error.message)}</p>`;
    }

    document
      .getElementById("file-upload")
      .addEventListener("change", (event) => {
        const file = event.target.files[0];
        successMessage.hidden = true;
        errorMessage.hidden = true;
        learnButton.hidden = true;
        if (!file) return;

        const fileName = file.name.toLowerCase();
        if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
          showError("يرجى رفع ملف Excel بصيغة .xlsx أو .xls.");
          return;
        }
        if (typeof XLSX === "undefined") {
          showError("تعذّر تحميل مكتبة Excel. تحقق من اتصال الإنترنت.");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const workbook = XLSX.read(new Uint8Array(e.target.result), {
              type: "array",
            });
            if (!workbook.SheetNames.length)
              throw new Error("ملف Excel لا يحتوي على ورقة عمل.");
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            let rows = XLSX.utils
              .sheet_to_json(sheet, { header: 1, defval: "", raw: false })
              .map((row) => [
                String(row[0] ?? "").trim(),
                String(row[1] ?? "").trim(),
              ])
              .filter(([a, b]) => a && b);
            if (!rows.length)
              throw new Error("لم يتم العثور على مفردات صالحة في أول عمودين.");

            const arHeaders = [
              "العربية",
              "عربي",
              "arabisch",
              "arabic",
              "الكلمة العربية",
              "اللغة العربية",
            ];
            const deHeaders = [
              "deutsch",
              "german",
              "الألمانية",
              "المانية",
              "الكلمة الألمانية",
              "اللغة الألمانية",
            ];
            const a0 = normalizeHeader(rows[0][0]);
            const b0 = normalizeHeader(rows[0][1]);
            let order = null;
            if (arHeaders.includes(a0) && deHeaders.includes(b0)) {
              order = "ar-de";
              rows = rows.slice(1);
            } else if (deHeaders.includes(a0) && arHeaders.includes(b0)) {
              order = "de-ar";
              rows = rows.slice(1);
            }
            if (!rows.length) throw new Error("الملف يحتوي على عناوين فقط.");

            if (!order) {
              const sample = rows.slice(0, 10);
              const arInA = sample.filter((row) => hasArabic(row[0])).length;
              const arInB = sample.filter((row) => hasArabic(row[1])).length;
              order = arInB > arInA ? "de-ar" : "ar-de";
            }

            const vocab = rows
              .map(([a, b]) => (order === "ar-de" ? [a, b] : [b, a]))
              .filter(([ar, de]) => ar && de);
            if (!vocab.length)
              throw new Error("لم يتم العثور على أزواج عربية/ألمانية صالحة.");

            VocabApp.saveVocabList(vocab, {
              type: "excel",
              title: file.name,
              count: vocab.length,
            });
            successMessage.textContent = `تم تحميل ${vocab.length} مفردة من الملف بنجاح.`;
            successMessage.hidden = false;
            learnButton.hidden = false;
          } catch (error) {
            showError(error.message || "تعذّر قراءة ملف Excel.");
          }
        };
        reader.onerror = () => showError("تعذّر قراءة ملف Excel.");
        reader.readAsArrayBuffer(file);
      });

    learnButton.addEventListener("click", () => {
      window.location.href = "./lernseite.html";
    });
    function showError(message) {
      errorMessage.textContent = `خطأ: ${message}`;
      errorMessage.hidden = false;
    }
  });

  function normalizeHeader(value) {
    return String(value || "")
      .trim()
      .toLowerCase();
  }
  function hasArabic(value) {
    return /[\u0600-\u06FF]/u.test(String(value || ""));
  }

  function listSource(list, level) {
    return {
      type: "ready-list",
      id: list.id,
      cefr: level?.cefr || level?.id || null,
      levelId: level?.id || null,
      levelTitle: level
        ? `${level.title}${level.subtitle ? ` · ${level.subtitle}` : ""}`
        : "",
      title: list.title,
      count: (list.words || []).length,
    };
  }

  function renderLearningPath(catalog, target) {
    const lists = Array.isArray(catalog.lists) ? catalog.lists : [];
    const levels =
      Array.isArray(catalog.levels) && catalog.levels.length
        ? catalog.levels
        : [
            {
              id: "A1",
              cefr: "A1",
              title: "المستوى A1",
              subtitle: "المبتدئ",
              description: "",
              listIds: lists.map((list) => list.id),
            },
          ];
    const byId = new Map(lists.map((list) => [list.id, list]));
    target.innerHTML = "";
    const levelGrid = document.createElement("div");
    levelGrid.className = "cefr-level-grid";
    target.appendChild(levelGrid);
    const detailsHost = document.createElement("div");
    detailsHost.className = "cefr-level-details-host";
    target.appendChild(detailsHost);

    levels.forEach((level, levelIndex) => {
      const levelLists = (level.listIds || [])
        .map((id) => byId.get(id))
        .filter(Boolean);
      const levelStats = getLevelStats(level, levelLists);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "cefr-level-card";
      button.dataset.levelId = level.id;
      button.setAttribute("aria-pressed", String(levelIndex === 0));
      button.innerHTML = `
                <span class="cefr-level-code">${VocabApp.escapeHTML(level.cefr || level.id)}</span>
                <span class="cefr-level-copy">
                    <span class="cefr-level-title-row"><strong>${VocabApp.escapeHTML(level.title || level.id)}</strong>${level.recommended ? '<span class="recommended-badge">ابدأ من هنا</span>' : ""}</span>
                    <small>${VocabApp.escapeHTML(level.subtitle || "")}</small>
                    <span class="cefr-level-description">${VocabApp.escapeHTML(level.description || "")}</span>
                    <span class="cefr-level-meta">${levelLists.length} مواضيع · ${levelStats.totalWords} مفردة · ${levelStats.masteredLists}/${levelLists.length} قوائم متقنة</span>
                    <span class="cefr-progress-track"><span style="width:${levelStats.percent}%"></span></span>
                    <span class="cefr-progress-label">${levelStats.percent}٪ تقدّم نحو الإتقان</span>
                </span>`;
      button.addEventListener("click", () => {
        levelGrid.querySelectorAll(".cefr-level-card").forEach((item) => {
          item.classList.remove("active");
          item.setAttribute("aria-pressed", "false");
        });
        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");
        renderLevelDetails(level, levelLists, detailsHost);
        setTimeout(
          () =>
            detailsHost.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            }),
          20,
        );
      });
      levelGrid.appendChild(button);
      if (levelIndex === 0) {
        button.classList.add("active");
        renderLevelDetails(level, levelLists, detailsHost);
      }
    });
  }

  function getLevelStats(level, levelLists) {
    let totalWords = 0,
      masteredLists = 0,
      completed = 0,
      required = 0;
    levelLists.forEach((list) => {
      totalWords += (list.words || []).length;
      const progress = VocabApp.getListProgress(
        list.words,
        listSource(list, level),
      );
      completed += progress.completedPasses;
      required += progress.requiredPasses;
      if (progress.listMastered) masteredLists += 1;
    });
    return {
      totalWords,
      masteredLists,
      percent: required ? Math.round((completed / required) * 100) : 0,
    };
  }

  function renderLevelDetails(level, levelLists, host) {
    const stats = getLevelStats(level, levelLists);
    host.innerHTML = `
            <section class="cefr-detail-panel">
                <div class="level-heading">
                    <div><span class="cefr-detail-label">${VocabApp.escapeHTML(level.cefr || level.id)}</span><h3>${VocabApp.escapeHTML(level.title || level.id)} · ${VocabApp.escapeHTML(level.subtitle || "")}</h3><p>${VocabApp.escapeHTML(level.description || "")}</p></div>
                    <span class="level-progress-badge">${stats.percent}٪ تقدّم</span>
                </div>
                <div class="ready-lists-grid"></div>
            </section>`;

    const grid = host.querySelector(".ready-lists-grid");
    levelLists.forEach((list, index) => {
      const source = listSource(list, level);
      const progress = VocabApp.getListProgress(list.words, source);
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.listId = list.id;
      button.className = `ready-list-button${progress.listMastered ? " mastered-list" : ""}`;
      button.innerHTML = `
                <span class="list-number">${progress.listMastered ? "✓" : index + 1}</span>
                <span class="list-button-text">
                    <strong>${VocabApp.escapeHTML(list.title)}</strong>
                    <small>${(list.words || []).length} مفردة · ${progress.completedPasses}/${progress.requiredPasses} محاولات إتقان ناجحة</small>
                    <span class="list-progress-line"><span style="width:${progress.masteryPercentage}%"></span></span>
                    <span class="list-mastery-percent">${progress.listMastered ? "متقنة 100٪" : `${progress.masteryPercentage}٪`}</span>
                </span>`;
      button.addEventListener("click", () => {
        const vocab = (list.words || [])
          .map((item) => [item.ar, item.de])
          .filter(([ar, de]) => ar && de);
        VocabApp.saveVocabList(vocab, source);
        window.location.href = "./lernseite.html";
      });
      grid.appendChild(button);
    });
  }
})();
