(function () {
    "use strict";
    document.addEventListener("DOMContentLoaded", () => {
        const vocab = VocabApp.getCurrentVocabList();
        const selected = VocabApp.selectFreshTestWords(vocab, "writing");
        const area = document.getElementById("test-area");
        let timeLeft = VocabApp.getTestDuration();
        document.getElementById("timer").textContent = `الوقت المتبقي: ${timeLeft} ثانية`;
        let timer = null;
        let submitted = false;

        if (!selected.length) {
            area.innerHTML = '<p class="empty-message">لا توجد مفردات. اختر قائمة أو ارفع ملف Excel أولاً.</p>';
            document.getElementById("submit-test").disabled = true;
        } else {
            selected.forEach((word, index) => {
                const div = document.createElement("div");
                div.className = "question";
                div.innerHTML = `<p><strong>${index + 1}. المعنى بالألمانية:</strong> <span class="german-text">${VocabApp.escapeHTML(word[1])}</span></p><input type="text" id="answer-${index}" autocomplete="off" placeholder="اكتب الكلمة العربية"><p class="answer-note">يمكنك الكتابة بالحركات أو بدونها.</p>`;
                area.appendChild(div);
            });
            timer = startTimer(() => submit());
        }

        function submit() {
            if (submitted || !selected.length) return;
            submitted = true;
            clearInterval(timer);
            const results = selected.map((word, index) => ({
                question: word[1],
                correct: word[0],
                answer: document.getElementById(`answer-${index}`).value.trim() || "لم تتم الإجابة",
                arabic: word[0],
                german: word[1],
                compareMode: "arabic"
            }));
            VocabApp.setJSON("testResults", results);
            VocabApp.recordTestResults(results, "writing");
            window.location.href = "./ergebnis.html";
        }

        function startTimer(onEnd) {
            return setInterval(() => {
                timeLeft -= 1;
                document.getElementById("timer").textContent = `الوقت المتبقي: ${timeLeft} ثانية`;
                if (timeLeft <= 0) { clearInterval(timer); onEnd(); }
            }, 1000);
        }

        document.getElementById("submit-test").addEventListener("click", submit);
        document.getElementById("back-to-test").addEventListener("click", () => { clearInterval(timer); window.location.href = "./test.html"; });
        document.getElementById("back-to-learn").addEventListener("click", () => { clearInterval(timer); window.location.href = "./lernseite.html"; });
    });
}());
