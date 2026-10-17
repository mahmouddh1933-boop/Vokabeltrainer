(function () {
    "use strict";
    document.addEventListener("DOMContentLoaded", () => {
        let queue = VocabApp.getWrongWords();
        let index = 0;
        const content = document.getElementById("review-content");
        const empty = document.getElementById("empty-review");
        const card = document.getElementById("review-card");
        const speechStatus = document.getElementById("speech-status");
        VocabApp.initSpeech();

        function current() { return queue[index] || null; }
        function render() {
            if (!queue.length) { content.hidden = true; empty.hidden = false; return; }
            content.hidden = false; empty.hidden = true;
            if (index >= queue.length) index = 0;
            const item = current();
            document.getElementById("review-position").textContent = `${index + 1} / ${queue.length}`;
            document.getElementById("review-mistakes").textContent = `${Number(item.mistakes || 0)} أخطاء`;
            document.getElementById("review-test").textContent = item.lastTest ? `آخر خطأ: ${VocabApp.getTestLabel(item.lastTest)}` : "كلمة للمراجعة";
            document.getElementById("review-arabic").textContent = item.arabic;
            document.getElementById("review-german").textContent = item.german;
            card.classList.remove("flipped");
            speechStatus.textContent = "";
        }
        function removeCurrentAndContinue() {
            const item = current();
            if (item) VocabApp.removeWrongWord(item.arabic, item.german);
            queue.splice(index, 1);
            if (index >= queue.length) index = 0;
            render();
        }
        const toggle = () => card.classList.toggle("flipped");
        card.addEventListener("click", toggle);
        card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
        document.getElementById("pronounce-button").addEventListener("click", () => {
            const item = current(); if (!item) return;
            VocabApp.speakArabic(item.arabic, (message, isError) => { speechStatus.textContent = message; speechStatus.style.color = isError ? "#a4252c" : ""; });
        });
        document.getElementById("reviewed-button").addEventListener("click", removeCurrentAndContinue);
        document.getElementById("prev-review").addEventListener("click", () => { if (queue.length) { index = (index - 1 + queue.length) % queue.length; render(); } });
        document.getElementById("next-review").addEventListener("click", () => { if (queue.length) { index = (index + 1) % queue.length; render(); } });
        document.getElementById("learn-button").addEventListener("click", () => { window.location.href = "./lernseite.html"; });
        document.getElementById("stats-button").addEventListener("click", () => { window.location.href = "./stats.html"; });
        document.getElementById("home-button").addEventListener("click", () => { window.location.href = "./index.html"; });
        render();
    });
}());
