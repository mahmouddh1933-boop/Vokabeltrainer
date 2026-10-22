(function () {
    "use strict";
    window.JisrStorage.ready(() => {
        const vocab = VocabApp.getCurrentVocabList();
        const selected = VocabApp.selectFreshTestWords(vocab, "choice");
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
                const alternatives = VocabApp.shuffle(vocab.filter(v => v[1] !== word[1])).slice(0, 3).map(v => v[1]);
                const choices = VocabApp.shuffle([...new Set([...alternatives, word[1]])]);
                const div = document.createElement("div");
                div.className = "question";
                div.innerHTML = `<p><strong>${index + 1}. ما معنى هذه الكلمة؟</strong></p><p class="arabic-text">${VocabApp.escapeHTML(word[0])}</p>${choices.map(choice => `<label class="choice-label"><input type="radio" name="q-${index}" value="${VocabApp.escapeHTML(choice)}"><span class="german-text">${VocabApp.escapeHTML(choice)}</span></label>`).join("")}`;
                area.appendChild(div);
            });
            timer = setInterval(() => {
                timeLeft -= 1;
                document.getElementById("timer").textContent = `الوقت المتبقي: ${timeLeft} ثانية`;
                if (timeLeft <= 0) submit();
            }, 1000);
        }

        function submit() {
            if (submitted || !selected.length) return;
            submitted = true;
            clearInterval(timer);
            const results = selected.map((word, index) => ({
                question: word[0],
                correct: word[1],
                answer: document.querySelector(`input[name="q-${index}"]:checked`)?.value || "لم تتم الإجابة",
                arabic: word[0],
                german: word[1]
            }));
            VocabApp.setJSON("testResults", results);
            VocabApp.recordTestResults(results, "choice");
            window.location.href = "./ergebnis.html";
        }

        document.getElementById("submit-test").addEventListener("click", submit);
        document.getElementById("back-to-test").addEventListener("click", () => { clearInterval(timer); window.location.href = "./test.html"; });
        document.getElementById("back-to-learn").addEventListener("click", () => { clearInterval(timer); window.location.href = "./lernseite.html"; });
    });
}());
