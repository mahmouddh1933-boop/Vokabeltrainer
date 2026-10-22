(function () {
    "use strict";
    window.JisrStorage.ready(() => {
        const stats = VocabApp.getStats();
        const progress = VocabApp.getCurrentVocabProgress();
        const mastery = progress.mastery;
        const wrong = VocabApp.getWrongWords();
        const summary = VocabApp.getMasterySummary();
        const accuracy = stats.totalQuestions ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0;

        document.getElementById("mastery-progress-text").textContent = `${progress.masteryPercentage}٪`;
        document.getElementById("mastery-progress-fill").style.width = `${progress.masteryPercentage}%`;
        document.getElementById("study-progress-details").textContent = progress.listMastered
            ? `القائمة متقنة ✓ — تم اجتياز الشروط الثمانية. تمت دراسة ${progress.studied} من أصل ${progress.total} مفردة.`
            : `أكملت ${progress.completedPasses} من أصل ${progress.requiredPasses} محاولات إتقان ناجحة. تمت دراسة ${progress.studied} من أصل ${progress.total} مفردة.`;

        const grid = document.getElementById("mastery-tests-grid");
        grid.innerHTML = Object.entries(VocabApp.TEST_CONFIG).map(([type, config]) => {
            const test = mastery.tests[type];
            const complete = test.qualifyingPasses >= config.requiredPasses;
            return `<div class="mastery-test-card ${complete ? "complete" : ""}"><span class="mastery-test-icon">${config.icon}</span><strong>${config.label}</strong><span class="mastery-pass-count">${test.qualifyingPasses}/${config.requiredPasses}</span><small>أفضل نتيجة: ${test.bestScore || 0}٪ · المحاولات: ${test.attempts || 0}</small></div>`;
        }).join("");

        document.getElementById("total-vocab").textContent = progress.total;
        document.getElementById("studied-words").textContent = progress.studied;
        document.getElementById("total-tests").textContent = stats.totalTests || 0;
        document.getElementById("accuracy").textContent = `${accuracy}٪`;
        document.getElementById("best-score").textContent = `${stats.bestScore || 0}٪`;
        document.getElementById("wrong-count").textContent = wrong.length;
        document.getElementById("total-correct").textContent = stats.correctAnswers || 0;
        document.getElementById("qualifying-tests").textContent = stats.qualifyingTests || 0;
        document.getElementById("mastered-lists").textContent = summary.masteredLists;

        document.getElementById("review-button").addEventListener("click", () => { window.location.href = "./review.html"; });
        document.getElementById("learn-button").addEventListener("click", () => { window.location.href = "./lernseite.html"; });
        document.getElementById("home-button").addEventListener("click", () => { window.location.href = "./index.html"; });
    });
}());
