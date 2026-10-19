(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {
        const vocabList = VocabApp.getCurrentVocabList();
        const source = VocabApp.getCurrentSource();
        const flashcard = document.getElementById("flashcard");
        const front = document.getElementById("front");
        const back = document.getElementById("back");
        const speechStatus = document.getElementById("speech-status");
        let currentIndex = 0;

        renderSource(source, vocabList.length);
        VocabApp.initSpeech();

        function showWord() {
            if (!vocabList.length) {
                front.textContent = "لا توجد مفردات";
                back.textContent = "اختر قائمة من الصفحة الرئيسية";
                document.querySelectorAll("button").forEach(button => { if (button.id !== "home-button") button.disabled = true; });
                return;
            }
            const [arabic, german] = vocabList[currentIndex];
            front.textContent = arabic;
            back.textContent = german;
            flashcard.classList.remove("flipped");
            VocabApp.markStudied(arabic, german);
            speechStatus.textContent = "";
            updateProgress();
        }

        function updateProgress() {
            const progress = VocabApp.getCurrentVocabProgress();
            document.getElementById("word-position").textContent = `${currentIndex + 1} / ${vocabList.length}`;
            document.getElementById("card-nav-position").textContent = `${currentIndex + 1} / ${vocabList.length}`;
            document.getElementById("learn-progress-fill").style.width = `${((currentIndex + 1) / Math.max(vocabList.length, 1)) * 100}%`;
            document.getElementById("mastery-text").textContent = `${progress.masteryPercentage}٪ إتقان`;
            renderMasteryStatus(progress.mastery);
        }

        function renderMasteryStatus(mastery) {
            const host = document.getElementById("test-mastery-status");
            host.innerHTML = Object.entries(VocabApp.TEST_CONFIG).map(([type, config]) => {
                const test = mastery.tests[type];
                const complete = test.qualifyingPasses >= config.requiredPasses;
                return `<div class="test-mastery-chip ${complete ? "complete" : ""}"><span>${config.icon} ${config.label}</span><strong>${test.qualifyingPasses}/${config.requiredPasses}</strong></div>`;
            }).join("");
            document.getElementById("mastery-summary-note").textContent = mastery.mastered
                ? "🎉 تم إتقان هذه القائمة: حققت شرط 80٪ مرتين في جميع الاختبارات الستة."
                : `أكملت ${mastery.completedPasses} من أصل ${mastery.requiredPasses} محاولات ناجحة مطلوبة.`;
        }

        function nextWord() { if (vocabList.length) { currentIndex = (currentIndex + 1) % vocabList.length; showWord(); } }
        function prevWord() { if (vocabList.length) { currentIndex = (currentIndex - 1 + vocabList.length) % vocabList.length; showWord(); } }
        function toggleCard() { flashcard.classList.toggle("flipped"); }

        flashcard.addEventListener("click", toggleCard);
        flashcard.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggleCard(); } });
        document.getElementById("next-button").addEventListener("click", nextWord);
        document.getElementById("prev-button").addEventListener("click", prevWord);
        document.getElementById("pronounce-button").addEventListener("click", () => {
            if (!vocabList.length) return;
            VocabApp.speakArabic(vocabList[currentIndex][0], (message, isError) => {
                speechStatus.textContent = message;
                speechStatus.style.color = isError ? "#a4252c" : "";
            });
        });
        document.getElementById("test-button").addEventListener("click", () => { window.location.href = "./test.html"; });
        document.getElementById("review-button").addEventListener("click", () => { window.location.href = "./review.html"; });
        document.getElementById("stats-button").addEventListener("click", () => { window.location.href = "./stats.html"; });
        document.getElementById("home-button").addEventListener("click", () => { window.location.href = "./index.html"; });
        showWord();
    });

    function renderSource(source, count) {
        const meta = document.getElementById("source-meta");
        if (!source || !source.type) { meta.innerHTML = `<span class="source-chip">${count} مفردة</span>`; return; }
        const title = source.title || (source.type === "excel" ? "ملف Excel" : "قائمة جاهزة");
        const type = source.type === "excel" ? "Excel" : "قائمة جاهزة";
        const level = source.levelTitle ? `<span class="source-chip">${VocabApp.escapeHTML(source.levelTitle)}</span>` : "";
        meta.innerHTML = `<span class="source-chip">${VocabApp.escapeHTML(title)}</span><span class="source-chip">${type} · ${count} مفردة</span>${level}`;
    }
}());
