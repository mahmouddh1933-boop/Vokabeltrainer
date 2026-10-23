(function () {
    "use strict";
    window.JisrStorage.ready(() => {
        const results = VocabApp.getJSON("testResults", []);
        const outcome = VocabApp.getLastTestOutcome();
        const container = document.getElementById("results");
        let correctCount = 0, wrongCount = 0;

        if (!Array.isArray(results) || !results.length) {
            container.innerHTML = '<p class="empty-message">لا توجد نتيجة محفوظة.</p>';
        } else {
            results.forEach((result, index) => {
                const correct = VocabApp.isCorrect(result.answer, result.correct, result.compareMode);
                if (correct) correctCount += 1; else wrongCount += 1;
                const div = document.createElement("div");
                div.className = "result-question";
                div.innerHTML = `<p><strong>${index + 1}. السؤال:</strong> <bdi>${VocabApp.escapeHTML(result.question)}</bdi></p><p><strong>إجابتك:</strong> <bdi>${VocabApp.escapeHTML(result.answer || "لم تتم الإجابة")}</bdi></p><p><strong>الإجابة الصحيحة:</strong> <bdi>${VocabApp.escapeHTML(result.correct)}</bdi></p><p class="${correct ? "result-correct" : "result-wrong"}">${correct ? "صحيح!" : "تحتاج إلى مراجعة."} ${VocabApp.escapeHTML(VocabApp.encouragement(correct))}</p><hr>`;
                container.appendChild(div);
            });
            const score = Math.round((correctCount / results.length) * 100);
            const summary = document.createElement("p");
            summary.className = "summary";
            summary.textContent = `أجبت بشكل صحيح عن ${correctCount} من أصل ${results.length}. (${score}٪)`;
            container.appendChild(summary);

            if (wrongCount) {
                const note = document.getElementById("review-note");
                note.textContent = `تمت إضافة ${wrongCount} ${wrongCount === 1 ? "كلمة" : "كلمات"} إلى قائمة مراجعة الأخطاء.`;
                note.hidden = false;
            }
        }

        renderMasteryOutcome(outcome);
        const retryButton = document.getElementById("retry-test");
        const testRoutes = {writing:"test1.html",choice:"test2.html",letters:"test3.html",listening:"test4.html",scramble:"test5.html",connected:"test6.html"};
        const retryRoute = testRoutes[outcome?.testType];
        retryButton.hidden = !retryRoute || !Array.isArray(results) || !results.length;
        if (retryRoute) retryButton.addEventListener("click", () => {window.location.href = "./" + retryRoute;});
        document.getElementById("review-errors").addEventListener("click", () => { window.location.href = "./review.html"; });
        document.getElementById("show-stats").addEventListener("click", () => { window.location.href = "./stats.html"; });
        document.getElementById("back-to-learn").addEventListener("click", () => { window.location.href = "./lernseite.html"; });
        document.getElementById("back-to-test").addEventListener("click", () => { window.location.href = "./test.html"; });
    });

    function renderMasteryOutcome(outcome) {
        const box = document.getElementById("mastery-result-note");
        if (!outcome?.mastery) { box.hidden = true; return; }
        const m = outcome.mastery;
        const label = VocabApp.getTestLabel(outcome.testType);
        if (m.newlyMastered) {
            box.className = "mastery-result-box success";
            box.innerHTML = `<strong>🎉 مبروك! أتقنت هذه القائمة.</strong><span>حققت 80٪ أو أكثر مرتين في كل اختبار من الاختبارات الأربعة.</span>`;
        } else if (m.qualifies) {
            box.className = "mastery-result-box success";
            const countedText = m.counted ? `تم احتساب هذه المحاولة: ${label} ${m.passCount}/${m.requiredPasses}.` : `شرط ${label} مكتمل بالفعل: ${m.passCount}/${m.requiredPasses}.`;
            box.innerHTML = `<strong>✅ نتيجة مؤهلة للإتقان (${m.score}٪)</strong><span>${countedText}</span><span>تقدّم القائمة: ${m.completedPasses}/${m.requiredPasses} — ${m.percentage}٪.</span>`;
        } else {
            box.className = "mastery-result-box warning";
            box.innerHTML = `<strong>النتيجة ${m.score}٪</strong><span>تحتاج إلى 80٪ على الأقل حتى تُحسب محاولة إتقان في اختبار ${label}.</span><span>تقدّم القائمة الحالي: ${m.completedPasses}/${m.requiredPasses} — ${m.percentage}٪.</span>`;
        }
        box.hidden = false;
    }
}());
