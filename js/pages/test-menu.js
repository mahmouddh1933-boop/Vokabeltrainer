(function () {
    "use strict";
    document.addEventListener("DOMContentLoaded", () => {
        const routes = { "test1-button": "./test1.html", "test2-button": "./test2.html", "test3-button": "./test3.html", "test4-button": "./test4.html", "test5-button": "./test5.html", "test6-button": "./test6.html", "review-button": "./review.html", "stats-button": "./stats.html", "back-to-learn": "./lernseite.html" };
        Object.entries(routes).forEach(([id, route]) => document.getElementById(id)?.addEventListener("click", () => { window.location.href = route; }));
        const durationButtons = [...document.querySelectorAll("[data-duration]")];
        function updateDurationButtons() {
            const current = VocabApp.getTestDuration();
            durationButtons.forEach(button => {
                const active = Number(button.dataset.duration) === current;
                button.classList.toggle("active", active);
                button.setAttribute("aria-pressed", String(active));
            });
        }
        durationButtons.forEach(button => button.addEventListener("click", () => {
            VocabApp.setTestDuration(button.dataset.duration);
            updateDurationButtons();
        }));
        updateDurationButtons();
        const mastery = VocabApp.getCurrentListMasteryProgress();
        Object.entries(VocabApp.TEST_CONFIG).forEach(([type, config]) => {
            const el = document.getElementById(`${type}-status`);
            if (!el) return;
            const passes = mastery.tests[type].qualifyingPasses;
            el.textContent = passes >= config.requiredPasses ? `✓ ${passes}/${config.requiredPasses}` : `${passes}/${config.requiredPasses} نجاحات`;
        });
        const overall = document.getElementById("test-mastery-overall");
        if (overall) overall.textContent = mastery.mastered ? "🎉 هذه القائمة متقنة 100٪" : `تقدّم الإتقان: ${mastery.completedPasses}/${mastery.requiredPasses} (${mastery.percentage}٪)`;
    });
}());
