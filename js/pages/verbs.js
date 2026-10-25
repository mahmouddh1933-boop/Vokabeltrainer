(() => {
  "use strict";
  window.JisrStorage.ready(() => {
    const {
      verbs,
      pronouns,
      imperativePronouns,
      pronounsFor,
      parts,
      conjugate,
      negativeForm,
    } = window.VerbLessonData;
    const $ = (id) => document.getElementById(id);
    const escape = window.VocabApp.escapeHTML;
    const language = () => (window.AppLanguage?.get() === "de" ? "de" : "ar");
    const text = (ar, de) => (language() === "ar" ? ar : de);
    const labels = {
      past: { ar: "الماضي", de: "Perfekt" },
      present: { ar: "المضارع المرفوع", de: "Präsens (Indikativ)" },
      imperative: { ar: "الأمر", de: "Imperativ" },
    };
    const kinds = {
      sound: { ar: "أفعال صحيحة سالمة", de: "Regelmäßige Verben" },
      hamzated: { ar: "أفعال مهموزة", de: "Verben mit Hamza" },
      doubled: { ar: "أفعال صحيحة مضاعفة", de: "Geminierte Verben" },
      weak: { ar: "أفعال معتلة", de: "Schwache Verben" },
    };
    const shuffle = window.VocabApp.shuffle;
    const normalize = (value) =>
      String(value)
        .normalize("NFD")
        .replace(/\p{M}/gu, "")
        .replace(/[أإآ]/g, "ا")
        .toLocaleLowerCase()
        .trim();
    const searchIndex = new Map(
      verbs.map((item) => [
        item.id,
        normalize(
          [
            item.meaning.ar,
            item.meaning.de,
            conjugate(item, "past", pronouns[8]),
            conjugate(item, "present", pronouns[8]),
            ...imperativePronouns.map((p) => conjugate(item, "imperative", p)),
          ].join(" "),
        ),
      ]),
    );
    let verb = verbs[0],
      tense = "past",
      question = null;
    let answered = false,
      selected = null,
      attempts = 0,
      correctCount = 0;
    function formHTML(person) {
      const [prefix, stem, suffix] = parts(verb, tense, person);
      return `${prefix ? `<mark>${escape(prefix)}</mark>` : ""}${escape(stem)}${suffix ? `<mark>${escape(suffix)}</mark>` : ""}`;
    }
    function renderLesson() {
      const people = pronounsFor(tense);
      const sample =
        tense === "imperative" ? imperativePronouns[0] : pronouns[8];
      const tenseName = labels[tense][language()];
      document
        .querySelectorAll("[data-tense]")
        .forEach((button) =>
          button.setAttribute(
            "aria-pressed",
            String(button.dataset.tense === tense),
          ),
        );
      $("verb-form-count").textContent =
        tense === "imperative"
          ? text("٥ صيغ للمخاطب", "5 Imperativformen")
          : text("١٤ صيغة", "14 Formen");
      $("verb-meaning").textContent = verb.meaning[language()];
      $("verb-feature-form").textContent = conjugate(verb, tense, sample);
      $("verb-pattern").textContent =
        `${tenseName} · ${language() === "ar" ? sample.ar : sample.de}`;
      $("verb-example").textContent = verb.example[tense][0];
      $("verb-example-translation").textContent = verb.example[tense][1];
      $("verb-imperative-note").hidden = tense !== "imperative";
      $("verb-imperative-note").textContent = text(
        "الأمر للمخاطب فقط: أنتَ، أنتِ، أنتما، أنتم، أنتنّ. صيغة أنتما واحدة للمذكّر والمؤنّث. لا نستخدم هنا الأمر مع أنا أو هو.",
        "Der Imperativ gilt nur für angesprochene Personen: du, ihr zwei, ihr. Für „ihr zwei“ ist die Form für beide Geschlechter gleich. Es gibt hier keine Imperativformen für „ich“ oder „er“.",
      );
      $("verb-specific-note").textContent = verb.note
        ? verb.note[language()]
        : text(
            verb.kind === "hamzated"
              ? "هذا الفعل مهموز. لاحظ موضع الهمزة عند قراءة الصيغ."
              : "هذا فعل صحيح سالم. لاحظ الحركات وحروف الزيادة والنهايات مع كل ضمير.",
            verb.kind === "hamzated"
              ? "Dieses Verb enthält Hamza. Achte beim Lesen auf ihre Position."
              : "Dieses Verb hat einen regelmäßigen Stamm. Achte auf Vokale, Vorsilben und Endungen.",
          );
      if (verb.pattern) {
        const structureDe = {
          "ثلاثي مزيد": "erweitertes dreiradikaliges Verb",
          "رباعي مجرد": "vierwurzeliges Grundverb",
          "رباعي مزيد": "erweitertes vierwurzeliges Verb",
        };
        $("verb-specific-note").textContent = text(
          `صيغة الماضي من ${verb.formLength} أحرف · ${verb.structure} · الوزن ${verb.pattern} · الجذر: ${verb.root}.`,
          `${verb.formLength} Formbuchstaben · ${structureDe[verb.structure]} · Muster ${verb.pattern} · Wurzel: ${verb.root}.`,
        );
      }
      $("conjugation-caption").textContent = text(
        `تصريف ${conjugate(verb, "past", pronouns[8])} في صيغة ${tenseName}`,
        `${verb.meaning.de} · ${tenseName}`,
      );
      $("conjugation-body").innerHTML = people
        .map(
          (person, index) =>
            `<tr${tense !== "imperative" && [2, 8].includes(index) ? ' class="person-group-start"' : ""}><th scope="row" lang="ar">${escape(person.ar)}</th><td>${escape(language() === "ar" ? person.description : person.de)}</td><td class="verb-form" lang="ar">${formHTML(person)}</td></tr>`,
        )
        .join("");
      renderNegation();
    }
    function renderPractice() {
      const person = question.person;
      const tenseName = labels[tense][language()];
      $("verb-question").innerHTML =
        `<span>${escape(text(`اختر صيغة «${conjugate(verb, "past", pronouns[8])}» في ${tenseName} مع:`, `Konjugiere „${verb.meaning.de}“ im ${tenseName} für:`))}</span><strong lang="ar">${escape(person.ar)}</strong><small>${escape(language() === "ar" ? person.description : person.de)}</small>`;
      $("verb-score").textContent = text(
        `${correctCount} من ${attempts} إجابات صحيحة`,
        `${correctCount} von ${attempts} richtig`,
      );
      $("verb-answers").replaceChildren(
        ...question.options.map((form) => {
          const button = document.createElement("button");
          button.type = "button";
          button.lang = "ar";
          button.textContent = form;
          button.className = "verb-answer";
          button.disabled = answered;
          if (answered && form === question.correct)
            button.classList.add("is-correct");
          else if (answered && form === selected)
            button.classList.add("is-wrong");
          button.addEventListener("click", () => {
            if (answered) return;
            answered = true;
            selected = form;
            attempts++;
            if (form === question.correct) correctCount++;
            renderPractice();
          });
          return button;
        }),
      );
      const feedback = $("verb-feedback");
      feedback.className = `verb-feedback${answered ? (selected === question.correct ? " is-correct" : " is-wrong") : ""}`;
      feedback.replaceChildren();
      if (answered) {
        const message = document.createElement("span");
        message.textContent =
          selected === question.correct
            ? text(
                "أحسنت! التصريف الصحيح هو: ",
                "Richtig! Die passende Form ist: ",
              )
            : text(
                "لنحاول التعلّم من الإجابة. التصريف الصحيح هو: ",
                "Lerne aus der Antwort. Die richtige Form ist: ",
              );
        const form = document.createElement("bdi");
        form.lang = "ar";
        form.textContent = `${person.ar} ${question.correct}`;
        const explanation = document.createElement("span");
        explanation.textContent = text(
          ` — هذه صيغة ${tenseName} مع ${person.description}. قارنها بالسطر الموافق في الجدول.`,
          ` — ${tenseName} für „${person.de}“. Vergleiche die passende Zeile in der Tabelle.`,
        );
        feedback.append(message, form, explanation);
      }
    }
    function newQuestion() {
      const people = pronounsFor(tense);
      const candidates = people.filter(
        (person) => person.index !== question?.person.index,
      );
      const person = shuffle(candidates)[0];
      const correct = conjugate(verb, tense, person);
      const distractors = shuffle(
        [...new Set(people.map((p) => conjugate(verb, tense, p)))].filter(
          (form) => form !== correct,
        ),
      ).slice(0, 3);
      question = {
        person,
        correct,
        options: shuffle([correct, ...distractors]),
        verbId: verb.id,
        tense,
      };
      answered = false;
      selected = null;
      renderPractice();
    }
    function renderCatalog() {
      const query = normalize($("verb-search").value);
      const length = $("verb-length").value;
      const family = $("verb-family").value;
      const matches = verbs.filter(
        (item) =>
          searchIndex.get(item.id).includes(query) &&
          (length === "all" || item.formLength === Number(length)) &&
          (family === "all" || item.family === family),
      );
      if (matches.length && !matches.some((item) => item.id === verb.id))
        verb = matches[0];
      const select = $("verb-select");
      select.replaceChildren();
      Object.entries(kinds).forEach(([kind, label]) => {
        const items = matches.filter((item) => item.kind === kind);
        if (!items.length) return;
        const group = document.createElement("optgroup");
        group.label = label[language()];
        items.forEach((item) => {
          const option = document.createElement("option");
          option.value = item.id;
          option.textContent = `${conjugate(item, "past", pronouns[8])} — ${item.meaning[language()]}`;
          group.append(option);
        });
        select.append(group);
      });
      const empty = !matches.length;
      select.disabled = empty;
      if (empty) {
        const option = document.createElement("option");
        option.textContent = text("لا توجد نتائج", "Keine Treffer");
        select.append(option);
      } else select.value = verb.id;
      $("verb-result-count").textContent = text(
        `${matches.length} من ${verbs.length} فعلاً`,
        `${matches.length} von ${verbs.length} Verben`,
      );
      $("verb-empty").hidden = !empty;
      $("verb-content").hidden = empty;
      $("verb-practice").hidden = empty;
      $("verb-negation").hidden = empty;
      if (!empty) {
        renderLesson();
        if (
          !question ||
          question.verbId !== verb.id ||
          question.tense !== tense
        )
          newQuestion();
        else renderPractice();
      }
    }
    function renderNegation() {
      const mode=$("verb-negative-mode").value;
      const people=mode==='prohibition'?imperativePronouns:pronouns;
      const notes={
        past:['ما + الماضي: نفي حدث ماضٍ؛ لا تتغيّر صيغة الماضي.','mā + Perfekt: die Verbform bleibt unverändert.'],
        present:['لا النافية + المضارع المرفوع: نفي الحاضر أو العادة.','Verneinendes lā + Indikativ: Gegenwart oder Gewohnheit.'],
        'past-lam':['لم + المضارع المجزوم: نفي الماضي. الجزم بالسكون أو حذف النون أو حرف العلة. نون النسوة ثابتة.','lam + Jussiv verneint die Vergangenheit: Sukūn, Wegfall von Nūn oder des schwachen Endlauts. Die feminine Pluralendung bleibt.'],
        future:['لن + المضارع المنصوب: نفي المستقبل. النصب بالفتحة أو حذف النون؛ نون النسوة ثابتة.','lan + Subjunktiv: Zukunft verneinen. Fatḥa oder Wegfall von Nūn; die feminine Pluralendung bleibt.'],
        prohibition:['لا الناهية + المضارع المجزوم للمخاطب. نقول: اُكْتُبْ ← لَا تَكْتُبْ.','Verbietendes lā + Jussiv für die angesprochene Person: uktub → lā taktub.']
      };
      $("verb-negative-note").textContent=text(...notes[mode]);
      $("negative-caption").textContent=$("verb-negative-mode").selectedOptions[0].textContent+' · '+conjugate(verb,'past',pronouns[8]);
      $("verb-negative-body").innerHTML=people.map(p=>`<tr><th scope="row" lang="ar">${escape(p.ar)}<small> · ${escape(language()==='ar'?p.description:p.de)}</small></th><td class="negative-verb-form" lang="ar">${escape(negativeForm(verb,mode,p))}</td></tr>`).join('');
      const person=shuffle(people)[0],correct=negativeForm(verb,mode,person),forms=[...new Set(people.map(p=>negativeForm(verb,mode,p)))];
      const options=shuffle([correct,...shuffle(forms.filter(f=>f!==correct)).slice(0,3)]);
      $("verb-negative-question").textContent=text('اختر الصيغة مع: ','Wähle die Form für: ')+person.ar+' · '+text(person.description,person.de);
      $("verb-negative-feedback").textContent='';
      $("verb-negative-answers").replaceChildren(...options.map(form=>{const b=document.createElement('button');b.type='button';b.className='verb-answer';b.lang='ar';b.textContent=form;b.onclick=()=>{for(const btn of $("verb-negative-answers").children){btn.disabled=true;if(btn.textContent===correct)btn.classList.add('is-correct');else if(btn===b)btn.classList.add('is-wrong');}$("verb-negative-feedback").textContent=window.VocabApp.encouragement(form===correct)+' '+person.ar+' '+correct+' — '+text(...notes[mode]);};return b;}));
    }
    $("verb-negative-mode").addEventListener('change',renderNegation);
    $("verb-negative-next").addEventListener('click',renderNegation);
    $("verb-search").addEventListener("input", renderCatalog);
    $("verb-length").addEventListener("change", renderCatalog);
    $("verb-family").addEventListener("change", renderCatalog);
    $("verb-clear-search").addEventListener("click", () => {
      $("verb-search").value = "";
      $("verb-length").value = "all";
      $("verb-family").value = "all";
      renderCatalog();
      $("verb-search").focus();
    });
    $("verb-select").addEventListener("change", (event) => {
      verb = verbs.find((item) => item.id === event.target.value);
      renderLesson();
      newQuestion();
    });
    document.querySelectorAll("[data-tense]").forEach((button) =>
      button.addEventListener("click", () => {
        if (tense === button.dataset.tense) return;
        tense = button.dataset.tense;
        renderCatalog();
      }),
    );
    $("verb-next").addEventListener("click", newQuestion);
    window.addEventListener("app-language-change", renderCatalog);
    renderCatalog();
  });
})();
