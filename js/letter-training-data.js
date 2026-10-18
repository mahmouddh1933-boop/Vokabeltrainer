(() => {
  "use strict";
  const letterData =
    typeof module !== "undefined" && module.exports
      ? require("./letter-data.js")
      : window.ArabicLetterData;
  const examples =
    typeof module !== "undefined" && module.exports
      ? require("./letter-examples.js")
      : window.ArabicLetterExamples;
  const modes = ["names", "forms", "missing", "listening"];
  const families = [
    "بتثني",
    "جحخ",
    "دذ",
    "رز",
    "سش",
    "صض",
    "طظ",
    "عغ",
    "فق",
    "كلم",
    "أهو",
  ];
  function shuffle(items, random) {
    const list = [...items];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }
  function createQuestions(mode, random = Math.random) {
    if (!modes.includes(mode)) throw new Error("Unknown letter training mode");
    const letters = shuffle(letterData.letters, random);
    return letters.map((letter, index) => {
      const position = index % 4;
      const example = examples.examples[letter.char][position];
      const units = examples.graphemes(example.word);
      const family = families.find((f) => f.includes(letter.char)) || "";
      const candidates = shuffle(
        letterData.letters.filter((l) => l.char !== letter.char),
        random,
      );
      const related = candidates.filter((l) => family.includes(l.char));
      const others = candidates.filter((l) => !family.includes(l.char));
      const choices = [
        letter.char,
        ...[...related, ...others].slice(0, 3).map((l) => l.char),
      ];
      return {
        letter,
        position,
        example,
        shape: letter.forms[position],
        masked: units.map((u, i) => (i === example.index ? "□" : u)).join(""),
        options: shuffle(choices, random),
        correct: letter.char,
      };
    });
  }
  const api = { modes, createQuestions };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else window.ArabicLetterTraining = api;
})();
