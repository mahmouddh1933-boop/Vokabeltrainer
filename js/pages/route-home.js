(() => {
  window.JisrStorage.ready(() => {
    const R = window.LearningRoute,
      host = document.getElementById("overall-learning-path");
    function render() {
      const de = window.AppLanguage?.get() === "de",
        data = R.state(),
        done = data.completed || {};
      host.replaceChildren();
      R.stages.forEach((s, i) => {
        const li = document.createElement("li");
        li.className = "route-step";
        const a = document.createElement("a");
        a.href = s.href;
        a.className = "route-card";
        const num = document.createElement("span");
        num.className = "route-number";
        num.textContent = done[s.id] ? "✓" : i + 1;
        const h = document.createElement("h2");
        h.textContent = de ? s.de : s.ar;
        const p = document.createElement("p");
        p.textContent = s.description[de ? "de" : "ar"];
        a.append(num, h, p);
        const b = document.createElement("button");
        b.type = "button";
        b.className = "practice-button";
        b.textContent = done[s.id]
          ? de
            ? "Als offen markieren"
            : "إلغاء علامة الإتمام"
          : de
            ? "Schritt abgeschlossen"
            : "أتممت المرحلة";
        b.setAttribute("aria-pressed", String(!!done[s.id]));
        b.onclick = () => {
          R.update({
            completed: { ...R.state().completed, [s.id]: !done[s.id] },
          });
          render();
        };
        li.append(a, b);
        host.append(li);
      });
      const latest = Object.values(
        window.VocabApp.getStats().placementV1?.attempts || {},
      )
        .filter((a) => a.status === "finished" && a.result?.primary)
        .sort((a, b) => b.finishedAt - a.finishedAt)[0];
      const placementText = document.getElementById("placement-home-result"),
        placementReport = document.getElementById("placement-home-report");
      if (latest && placementText && placementReport) {
        placementText.hidden = false;
        placementReport.hidden = false;
        placementText.textContent =
          (de
            ? "Deine letzte vorläufige Empfehlung: "
            : "توصيتك التشخيصية الأخيرة: ") +
          latest.result.primary.label[de ? "de" : "ar"];
        placementReport.href =
          "placement.html#attempt=" + encodeURIComponent(latest.id);
        placementReport.textContent = de
          ? "Fertigkeitsprofil und passende Lektionen ansehen"
          : "عرض ملف المهارات والدروس المقترحة";
      }
      const next =
        R.stages.find((s) => s.id === data.lastStage) ||
        R.stages.find((s) => !done[s.id]) ||
        R.stages[0];
      const resume = document.getElementById("route-resume");
      resume.href = next.href;
      resume.textContent =
        (de ? "Weiter: " : "تابع: ") + (de ? next.de : next.ar);
      document.getElementById("route-summary").textContent =
        Object.values(done).filter(Boolean).length +
        (de
          ? " / 7 Schritte selbst als abgeschlossen markiert"
          : " / ٧ مراحل علّمتها كمكتملة");
    }
    window.addEventListener("app-language-change", render);
    render();
  });
})();
