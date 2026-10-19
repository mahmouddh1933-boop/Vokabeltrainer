(function () {
  "use strict";
  const localStorage = window.JisrStorage.local;
  const sessionStorage = window.JisrStorage.session;
  const letters = window.ArabicLetterData.letters.map((d) => [
    d.char,
    d.name,
    Number(d.nonjoining),
  ]);
  // Arabic shaping is performed by the browser; non-joining letters never connect to a subsequent letter.
  let current = 0;
  const $ = (id) => document.getElementById(id);
  const card = $("letter-card"),
    grid = $("letters-grid");
  const saved = Number(sessionStorage.getItem("lettersLastIndex"));
  if (Number.isInteger(saved) && saved >= 0 && saved < letters.length)
    current = saved;
  letters.forEach(([glyph, name], i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = glyph;
    btn.title = name;
    btn.setAttribute("aria-label", name);
    btn.addEventListener("click", () => select(i));
    grid.appendChild(btn);
  });
  function makeForm(label, value, example, position, de) {
    const item = document.createElement("span");
    item.className = "letters-form";
    const title = document.createElement("span");
    title.className = "letters-form-label";
    title.textContent = label;
    const glyph = document.createElement("span");
    glyph.className = "letters-form-glyph";
    glyph.textContent = value;
    glyph.lang = "ar";
    const word = document.createElement("span");
    word.className = "letter-example-word";
    word.lang = "ar";
    window.ArabicLetterExamples.highlight(word, example.word, example.index);
    const meaning = document.createElement("span");
    meaning.className = "letter-example-meaning";
    meaning.lang = "de";
    meaning.textContent = example.de;
    item.append(title, glyph, word, meaning);
    if (position === 2) {
      const note = document.createElement("span");
      note.className = "letter-connection-note";
      const previous = window.ArabicLetterExamples.graphemes(example.word)[
        example.index - 1
      ];
      note.textContent = de
        ? `Nach „${previous}“: keine Verbindung.`
        : `قبله «${previous}» لا يتصل بما بعده`;
      item.append(note);
    }
    return item;
  }
  function render() {
    const [char, name, nonjoining] = letters[current];
    $("letter-counter").textContent = `${current + 1} / ${letters.length}`;
    if ($("letter-nav-position"))
      $("letter-nav-position").textContent = `${current + 1} / ${letters.length}`;
    $("letter-name").textContent = name;
    $("letter-front-name").textContent = name;
    $("letter-big").textContent = char;
    $("letter-back-heading").textContent =
      localStorage.getItem("vocabInterfaceLanguage") === "de"
        ? `Schreibformen: ${char}`
        : `أشكال حرف ${name}`;
    const forms = $("letter-forms");
    forms.replaceChildren();
    // Explicit presentation forms preserve the intended standalone/initial/medial/final glyph even without neighboring Arabic letters.
    const formsData = Object.fromEntries(
      window.ArabicLetterData.letters.map((d) => [d.char, d.forms]),
    );
    const de = localStorage.getItem("vocabInterfaceLanguage") === "de";
    card.setAttribute(
      "aria-label",
      de ? "Buchstabenkarte umdrehen" : "اقلب بطاقة الحرف",
    );
    const labels = de
      ? [
          "Am Wortanfang",
          "In der Wortmitte",
          "Am Wortende (getrennt)",
          "Am Wortende (verbunden)",
        ]
      : [
          "في أول الكلمة",
          "في وسط الكلمة",
          "في آخر الكلمة منفصل",
          "في آخر الكلمة متصل",
        ];
    // Four positional forms; keep Arabic glyph in a shaping-safe wrapper.
    formsData[char].forEach((value, i) =>
      forms.appendChild(
        makeForm(
          labels[i],
          value,
          window.ArabicLetterExamples.examples[char][i],
          i,
          de,
        ),
      ),
    );
    $("letter-note").textContent = de
      ? nonjoining
        ? "Dieser Buchstabe verbindet sich nicht mit dem folgenden Buchstaben."
        : "Die Verbindung hängt von der Position und den benachbarten Buchstaben ab."
      : nonjoining
        ? "هذا الحرف لا يتصل بالحرف الذي بعده؛ لذلك لا يوجد له شكل يتصل من الجهتين في وسط الكلمة."
        : "يتصل هذا الحرف بما قبله وما بعده بحسب موضعه والحروف المجاورة.";
    [...grid.children].forEach((b, i) => {
      b.classList.toggle("active", i === current);
      b.setAttribute("aria-current", i === current ? "true" : "false");
    });
    card.classList.remove("flipped");
    card.setAttribute("aria-pressed", "false");
    $("lesson-loading")?.remove();
    sessionStorage.setItem("lettersLastIndex", String(current));
    window.dispatchEvent(
      new CustomEvent("letterchange", { detail: { index: current } }),
    );
  }
  function select(i) {
    current = (i + letters.length) % letters.length;
    render();
  }
  card.addEventListener("click", () => {
    const flipped = card.classList.toggle("flipped");
    card.setAttribute("aria-pressed", String(flipped));
  });
  $("letter-previous").addEventListener("click", () => select(current - 1));
  $("letter-next").addEventListener("click", () => select(current + 1));
  $("letter-speak").addEventListener("click", () =>
    window.lettersSpeak(letters[current][1]),
  );
  window.renderLetterFormsForLanguage = () => {
    const flipped = card.classList.contains("flipped");
    render();
    card.classList.toggle("flipped", flipped);
    card.setAttribute("aria-pressed", String(flipped));
  };
  render();
})();
