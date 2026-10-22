(function () {
    "use strict";

    window.JisrStorage.ready(() => {
        const vocab = VocabApp.getCurrentVocabList();
        const selected = VocabApp.selectFreshTestWords(vocab, "letters");
        const maskedWords = [];
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
                const masked = maskWord(word[0]);
                maskedWords.push({ original: word[0], german: word[1], units: masked.units });
                const wordHtml = masked.units.map((unit, unitIndex) => {
                    if (unit.hidden) {
                        return `<input type="text" maxlength="1" id="answer-${index}-${unitIndex}" class="letter-input" autocomplete="off" aria-label="حرف ناقص">`;
                    }
                    if (unit.base === " ") return '<span class="arabic-letter">&nbsp;</span>';
                    return `<span class="arabic-letter">${VocabApp.escapeHTML(unit.base + unit.marks)}</span>`;
                }).join("");

                const div = document.createElement("div");
                div.className = "question";
                div.innerHTML = `<p><strong>${index + 1}. المعنى بالألمانية:</strong> <span class="german-text">${VocabApp.escapeHTML(word[1])}</span></p><p><strong>أكمل الكلمة العربية:</strong></p><div class="arabic-word-box" dir="rtl">${wordHtml}</div>`;
                area.appendChild(div);
            });

            timer = setInterval(() => {
                timeLeft -= 1;
                document.getElementById("timer").textContent = `الوقت المتبقي: ${timeLeft} ثانية`;
                if (timeLeft <= 0) submit();
            }, 1000);
        }

        function submit() {
            if (submitted || !maskedWords.length) return;
            submitted = true;
            clearInterval(timer);
            const results = maskedWords.map((wordData, wordIndex) => {
                const answer = wordData.units.map((unit, unitIndex) => {
                    if (!unit.hidden) return unit.base + unit.marks;
                    const typed = document.getElementById(`answer-${wordIndex}-${unitIndex}`)?.value.trim() || "";
                    return typed + unit.marks;
                }).join("");
                return {
                    question: wordData.german,
                    correct: wordData.original,
                    answer: answer || "لم تتم الإجابة",
                    arabic: wordData.original,
                    german: wordData.german,
                    compareMode: "arabic"
                };
            });
            VocabApp.setJSON("testResults", results);
            VocabApp.recordTestResults(results, "letters");
            window.location.href = "./ergebnis.html";
        }

        document.getElementById("submit-test").addEventListener("click", submit);
        document.getElementById("back-to-test").addEventListener("click", () => { clearInterval(timer); window.location.href = "./test.html"; });
        document.getElementById("back-to-learn").addEventListener("click", () => { clearInterval(timer); window.location.href = "./lernseite.html"; });
    });

    function isArabicDiacritic(char) {
        return /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/u.test(char);
    }

    function isArabicLetter(char) {
        return /[\u0621-\u063A\u0641-\u064A\u066E-\u06D3\u06FA-\u06FC\u0750-\u077F\u08A0-\u08C9]/u.test(char);
    }

    function splitArabicUnits(word) {
        const units = [];
        Array.from(String(word || "").normalize("NFC")).forEach(char => {
            if (isArabicDiacritic(char)) {
                if (units.length) units[units.length - 1].marks += char;
                else units.push({ base: "", marks: char, isLetter: false, hidden: false });
                return;
            }
            units.push({ base: char, marks: "", isLetter: isArabicLetter(char), hidden: false });
        });
        return units;
    }

    function getMissingCount(letterCount) {
        if (letterCount < 4) return 1;
        if (letterCount <= 5) return 2;
        if (letterCount <= 7) return 3;
        if (letterCount <= 9) return 4;
        return 5;
    }

    function maskWord(word) {
        const units = splitArabicUnits(word);
        const letterIndices = units.map((unit, index) => ({ unit, index })).filter(item => item.unit.isLetter).map(item => item.index);
        const count = Math.min(getMissingCount(letterIndices.length), letterIndices.length);
        const chosen = VocabApp.shuffle(letterIndices).slice(0, count);
        chosen.forEach(index => { units[index].hidden = true; });
        return { units };
    }
}());
