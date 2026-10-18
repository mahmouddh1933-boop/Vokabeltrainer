(() => {
  "use strict";
  const data =
    typeof module !== "undefined" && module.exports
      ? require("./letter-data.js")
      : window.ArabicLetterData;
  const examples =
    typeof module !== "undefined" && module.exports
      ? require("./letter-examples.js")
      : window.ArabicLetterExamples;
  const extras = {
    أ: [
      {
        word: "أرنب",
        de: "Kaninchen",
      },
      {
        word: "أمل",
        de: "Hoffnung",
      },
      {
        word: "أذن",
        de: "Ohr",
      },
      {
        word: "أم",
        de: "Mutter",
      },
      {
        word: "رأس",
        de: "Kopf",
      },
      {
        word: "كأس",
        de: "Glas",
      },
      {
        word: "بدأ",
        de: "begann",
      },
      {
        word: "نبأ",
        de: "Nachricht",
      },
    ],
    ب: [
      {
        word: "بنت",
        de: "Mädchen",
      },
      {
        word: "بحر",
        de: "Meer",
      },
      {
        word: "بستان",
        de: "Garten",
      },
      {
        word: "برج",
        de: "Turm",
      },
      {
        word: "خبز",
        de: "Brot",
      },
      {
        word: "سبح",
        de: "schwamm",
      },
      {
        word: "ثوب",
        de: "Kleid",
      },
      {
        word: "حبل",
        de: "Seil",
      },
    ],
    ت: [
      {
        word: "تفاحة",
        de: "Apfel",
      },
      {
        word: "تاج",
        de: "Krone",
      },
      {
        word: "تمساح",
        de: "Krokodil",
      },
      {
        word: "توت",
        de: "Maulbeeren",
      },
      {
        word: "مفتاح",
        de: "Schlüssel",
      },
      {
        word: "دفتر",
        de: "Heft",
      },
      {
        word: "حوت",
        de: "Wal",
      },
      {
        word: "صوت",
        de: "Stimme",
      },
    ],
    ث: [
      {
        word: "ثور",
        de: "Stier",
      },
      {
        word: "ثلج",
        de: "Schnee",
      },
      {
        word: "ثوب",
        de: "Kleid",
      },
      {
        word: "ثوم",
        de: "Knoblauch",
      },
      {
        word: "كثير",
        de: "viel",
      },
      {
        word: "مثال",
        de: "Beispiel",
      },
      {
        word: "أثاث",
        de: "Möbel",
      },
      {
        word: "حديث",
        de: "Gespräch",
      },
    ],
    ج: [
      {
        word: "جبن",
        de: "Käse",
      },
      {
        word: "جرس",
        de: "Glocke",
      },
      {
        word: "جسر",
        de: "Brücke",
      },
      {
        word: "جزر",
        de: "Karotten",
      },
      {
        word: "عجلة",
        de: "Rad",
      },
      {
        word: "حجر",
        de: "Stein",
      },
      {
        word: "برج",
        de: "Turm",
      },
      {
        word: "موج",
        de: "Wellen",
      },
    ],
    ح: [
      {
        word: "حبل",
        de: "Seil",
      },
      {
        word: "حوت",
        de: "Wal",
      },
      {
        word: "حديقة",
        de: "Garten",
      },
      {
        word: "حقيبة",
        de: "Tasche",
      },
      {
        word: "سحابة",
        de: "Wolke",
      },
      {
        word: "نحلة",
        de: "Biene",
      },
      {
        word: "صباح",
        de: "Morgen",
      },
      {
        word: "مفتاح",
        de: "Schlüssel",
      },
    ],
    خ: [
      {
        word: "خروف",
        de: "Schaf",
      },
      {
        word: "خيمة",
        de: "Zelt",
      },
      {
        word: "خيار",
        de: "Gurke",
      },
      {
        word: "خاتم",
        de: "Ring",
      },
      {
        word: "بخار",
        de: "Dampf",
      },
      {
        word: "صخرة",
        de: "Felsen",
      },
      {
        word: "بطيخ",
        de: "Wassermelone",
      },
      {
        word: "شيخ",
        de: "Scheich",
      },
    ],
    د: [
      {
        word: "دفتر",
        de: "Heft",
      },
      {
        word: "دلو",
        de: "Eimer",
      },
      {
        word: "درج",
        de: "Treppe",
      },
      {
        word: "دجاج",
        de: "Hühner",
      },
      {
        word: "هدية",
        de: "Geschenk",
      },
      {
        word: "حديقة",
        de: "Garten",
      },
      {
        word: "أسد",
        de: "Löwe",
      },
      {
        word: "جليد",
        de: "Eis",
      },
    ],
    ذ: [
      {
        word: "ذهب",
        de: "Gold",
      },
      {
        word: "ذيل",
        de: "Schwanz",
      },
      {
        word: "ذئب",
        de: "Wolf",
      },
      {
        word: "ذراع",
        de: "Arm",
      },
      {
        word: "نافذة",
        de: "Fenster",
      },
      {
        word: "غذاء",
        de: "Nahrung",
      },
      {
        word: "تلميذ",
        de: "Schüler",
      },
      {
        word: "لذيذ",
        de: "lecker",
      },
    ],
    ر: [
      {
        word: "ريشة",
        de: "Feder",
      },
      {
        word: "رجل",
        de: "Mann",
      },
      {
        word: "رأس",
        de: "Kopf",
      },
      {
        word: "رغيف",
        de: "Brotlaib",
      },
      {
        word: "كرسي",
        de: "Stuhl",
      },
      {
        word: "شجرة",
        de: "Baum",
      },
      {
        word: "بحر",
        de: "Meer",
      },
      {
        word: "سرير",
        de: "Bett",
      },
    ],
    ز: [
      {
        word: "زرافة",
        de: "Giraffe",
      },
      {
        word: "زيت",
        de: "Öl",
      },
      {
        word: "زجاج",
        de: "Glas",
      },
      {
        word: "زيتون",
        de: "Oliven",
      },
      {
        word: "حزام",
        de: "Gürtel",
      },
      {
        word: "ميزان",
        de: "Waage",
      },
      {
        word: "كنز",
        de: "Schatz",
      },
      {
        word: "موز",
        de: "Banane",
      },
    ],
    س: [
      {
        word: "سيارة",
        de: "Auto",
      },
      {
        word: "ساعة",
        de: "Uhr",
      },
      {
        word: "سفينة",
        de: "Schiff",
      },
      {
        word: "سلة",
        de: "Korb",
      },
      {
        word: "أسد",
        de: "Löwe",
      },
      {
        word: "جسر",
        de: "Brücke",
      },
      {
        word: "جرس",
        de: "Glocke",
      },
      {
        word: "عدس",
        de: "Linsen",
      },
    ],
    ش: [
      {
        word: "شجرة",
        de: "Baum",
      },
      {
        word: "شارع",
        de: "Straße",
      },
      {
        word: "شراع",
        de: "Segel",
      },
      {
        word: "شوكة",
        de: "Gabel",
      },
      {
        word: "عشب",
        de: "Gras",
      },
      {
        word: "مشمش",
        de: "Aprikosen",
      },
      {
        word: "فراشة",
        de: "Schmetterling",
      },
      {
        word: "ريش",
        de: "Federn",
      },
    ],
    ص: [
      {
        word: "صندوق",
        de: "Kiste",
      },
      {
        word: "صابون",
        de: "Seife",
      },
      {
        word: "صورة",
        de: "Bild",
      },
      {
        word: "صحن",
        de: "Teller",
      },
      {
        word: "حصان",
        de: "Pferd",
      },
      {
        word: "عصير",
        de: "Saft",
      },
      {
        word: "قميص",
        de: "Hemd",
      },
      {
        word: "مقص",
        de: "Schere",
      },
    ],
    ض: [
      {
        word: "ضرس",
        de: "Backenzahn",
      },
      {
        word: "ضوء",
        de: "Licht",
      },
      {
        word: "ضحك",
        de: "lachte",
      },
      {
        word: "ضيف",
        de: "Gast",
      },
      {
        word: "مضرب",
        de: "Schläger",
      },
      {
        word: "خضرة",
        de: "Grün",
      },
      {
        word: "أرض",
        de: "Erde",
      },
      {
        word: "عرض",
        de: "Vorführung",
      },
    ],
    ط: [
      {
        word: "طبل",
        de: "Trommel",
      },
      {
        word: "طفل",
        de: "Kind",
      },
      {
        word: "طريق",
        de: "Weg",
      },
      {
        word: "طعام",
        de: "Essen",
      },
      {
        word: "مطر",
        de: "Regen",
      },
      {
        word: "قطار",
        de: "Zug",
      },
      {
        word: "شاطئ",
        de: "Strand",
      },
      {
        word: "خيط",
        de: "Faden",
      },
    ],
    ظ: [
      {
        word: "ظل",
        de: "Schatten",
      },
      {
        word: "ظهر",
        de: "Rücken",
      },
      {
        word: "ظلام",
        de: "Dunkelheit",
      },
      {
        word: "ظبي",
        de: "Gazelle",
      },
      {
        word: "عظيم",
        de: "großartig",
      },
      {
        word: "نظارة",
        de: "Brille",
      },
      {
        word: "حفظ",
        de: "lernte auswendig",
      },
      {
        word: "محظوظ",
        de: "glücklich",
      },
    ],
    ع: [
      {
        word: "علم",
        de: "Flagge",
      },
      {
        word: "عين",
        de: "Auge",
      },
      {
        word: "عسل",
        de: "Honig",
      },
      {
        word: "عصفور",
        de: "Vogel",
      },
      {
        word: "ملعب",
        de: "Spielplatz",
      },
      {
        word: "سعيد",
        de: "glücklich",
      },
      {
        word: "شارع",
        de: "Straße",
      },
      {
        word: "شمع",
        de: "Wachs",
      },
    ],
    غ: [
      {
        word: "غيمة",
        de: "Wolke",
      },
      {
        word: "غرفة",
        de: "Zimmer",
      },
      {
        word: "غراب",
        de: "Rabe",
      },
      {
        word: "غابة",
        de: "Wald",
      },
      {
        word: "رغيف",
        de: "Brotlaib",
      },
      {
        word: "بغل",
        de: "Maultier",
      },
      {
        word: "دماغ",
        de: "Gehirn",
      },
      {
        word: "بلوغ",
        de: "Erreichen",
      },
    ],
    ف: [
      {
        word: "فراشة",
        de: "Schmetterling",
      },
      {
        word: "فراولة",
        de: "Erdbeere",
      },
      {
        word: "فنجان",
        de: "Tasse",
      },
      {
        word: "فستان",
        de: "Kleid",
      },
      {
        word: "عصفور",
        de: "Vogel",
      },
      {
        word: "سفينة",
        de: "Schiff",
      },
      {
        word: "أنف",
        de: "Nase",
      },
      {
        word: "صف",
        de: "Reihe",
      },
    ],
    ق: [
      {
        word: "قلم",
        de: "Stift",
      },
      {
        word: "قطار",
        de: "Zug",
      },
      {
        word: "قلب",
        de: "Herz",
      },
      {
        word: "قارب",
        de: "Boot",
      },
      {
        word: "بقرة",
        de: "Kuh",
      },
      {
        word: "حقيبة",
        de: "Tasche",
      },
      {
        word: "سوق",
        de: "Markt",
      },
      {
        word: "صندوق",
        de: "Kiste",
      },
    ],
    ك: [
      {
        word: "كرة",
        de: "Ball",
      },
      {
        word: "كلب",
        de: "Hund",
      },
      {
        word: "كوب",
        de: "Becher",
      },
      {
        word: "كرسي",
        de: "Stuhl",
      },
      {
        word: "بكرة",
        de: "Spule",
      },
      {
        word: "فكرة",
        de: "Idee",
      },
      {
        word: "ديك",
        de: "Hahn",
      },
      {
        word: "شوك",
        de: "Dornen",
      },
    ],
    ل: [
      {
        word: "لحم",
        de: "Fleisch",
      },
      {
        word: "لوز",
        de: "Mandeln",
      },
      {
        word: "لبن",
        de: "Milch",
      },
      {
        word: "لعبة",
        de: "Spielzeug",
      },
      {
        word: "ملعقة",
        de: "Löffel",
      },
      {
        word: "ثلج",
        de: "Schnee",
      },
      {
        word: "فيل",
        de: "Elefant",
      },
      {
        word: "حبل",
        de: "Seil",
      },
    ],
    م: [
      {
        word: "ماء",
        de: "Wasser",
      },
      {
        word: "مدرسة",
        de: "Schule",
      },
      {
        word: "مسجد",
        de: "Moschee",
      },
      {
        word: "مفتاح",
        de: "Schlüssel",
      },
      {
        word: "سمكة",
        de: "Fisch",
      },
      {
        word: "نمر",
        de: "Tiger",
      },
      {
        word: "نجم",
        de: "Stern",
      },
      {
        word: "علم",
        de: "Flagge",
      },
    ],
    ن: [
      {
        word: "نحلة",
        de: "Biene",
      },
      {
        word: "نار",
        de: "Feuer",
      },
      {
        word: "نمر",
        de: "Tiger",
      },
      {
        word: "نخلة",
        de: "Dattelpalme",
      },
      {
        word: "عنب",
        de: "Trauben",
      },
      {
        word: "صندوق",
        de: "Kiste",
      },
      {
        word: "لبن",
        de: "Milch",
      },
      {
        word: "سفينة",
        de: "Schiff",
      },
    ],
    ه: [
      {
        word: "هاتف",
        de: "Telefon",
      },
      {
        word: "هدية",
        de: "Geschenk",
      },
      {
        word: "هواء",
        de: "Luft",
      },
      {
        word: "هرم",
        de: "Pyramide",
      },
      {
        word: "قهوة",
        de: "Kaffee",
      },
      {
        word: "مهندس",
        de: "Ingenieur",
      },
      {
        word: "فهد",
        de: "Leopard",
      },
      {
        word: "ذهب",
        de: "Gold",
      },
    ],
    و: [
      {
        word: "ولد",
        de: "Junge",
      },
      {
        word: "وسادة",
        de: "Kissen",
      },
      {
        word: "وجه",
        de: "Gesicht",
      },
      {
        word: "ورق",
        de: "Papier",
      },
      {
        word: "سوق",
        de: "Markt",
      },
      {
        word: "صوت",
        de: "Stimme",
      },
      {
        word: "حلو",
        de: "süß",
      },
      {
        word: "نحو",
        de: "Richtung",
      },
    ],
    ي: [
      {
        word: "ياسمين",
        de: "Jasmin",
      },
      {
        word: "يمين",
        de: "rechts",
      },
      {
        word: "يوم",
        de: "Tag",
      },
      {
        word: "يتيم",
        de: "Waise",
      },
      {
        word: "سيارة",
        de: "Auto",
      },
      {
        word: "خيار",
        de: "Gurke",
      },
      {
        word: "وادي",
        de: "Tal",
      },
      {
        word: "جدي",
        de: "Ziegenbock",
      },
    ],
  };
  const modes = ["forms", "missing", "circle"];
  const shuffle = (items, random) => {
    const a = [...items];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const banks = Object.fromEntries(
    data.letters.map((letter) => [
      letter.char,
      [
        ...examples.examples[letter.char].map((e) => ({ ...e })),
        ...extras[letter.char].map((e) => ({
          ...e,
          index: examples.graphemes(e.word).indexOf(letter.char),
        })),
      ],
    ]),
  );
  function wordInfo(char, example) {
    const letter = data.letters.find((l) => l.char === char);
    const units = examples.graphemes(example.word),
      index = example.index;
    const before = index > 0 && !examples.nonJoining.has(units[index - 1]);
    const after =
      index < units.length - 1 &&
      !letter.nonjoining &&
      units[index + 1] !== "ء";
    const shape = before
      ? after
        ? "medial"
        : "final"
      : after
        ? "initial"
        : "isolated";
    const position =
      index === 0 ? "start" : index === units.length - 1 ? "end" : "middle";
    return {
      shape,
      position,
      before,
      after,
      masked: units.map((u, i) => (i === index ? "□" : u)).join(""),
    };
  }
  function createLetterQuestions(char, mode, random = Math.random) {
    const letter = data.letters.find((l) => l.char === char);
    if (!letter || !modes.includes(mode))
      throw new Error("Unknown letter or focused mode");
    const words = banks[char];
    if (mode === "circle")
      return Array.from({ length: 12 }, (_, i) => {
        const count = 4 + (i % 3);
        const targets = Array.from({ length: count }, (_, j) => ({
          glyph: letter.forms[(i + j) % 4],
          letter: char,
        }));
        const otherLetters = shuffle(
          data.letters.filter((l) => l.char !== char),
          random,
        );
        const others = otherLetters
          .slice(0, 16 - count)
          .map((l, j) => ({ glyph: l.forms[(i + j) % 4], letter: l.char }));
        const cells = shuffle([...targets, ...others], random);
        return {
          id: `circle-${i}`,
          kind: "circle",
          letter: char,
          cells,
          correct: cells.flatMap((cell, index) =>
            cell.letter === char ? [index] : [],
          ),
        };
      });
    if (mode === "missing")
      return shuffle(words, random).map((example, i) => ({
        id: `missing-${i}`,
        kind: "missing",
        letter: char,
        example,
        ...wordInfo(char, example),
        options: shuffle(
          [
            char,
            ...shuffle(
              data.letters.filter((l) => l.char !== char),
              random,
            )
              .slice(0, 3)
              .map((l) => l.char),
          ],
          random,
        ),
        correct: char,
      }));
    return shuffle(
      words.flatMap((example, i) => {
        const info = wordInfo(char, example);
        return [
          {
            id: `shape-${i}`,
            kind: "shape",
            letter: char,
            example,
            ...info,
            options: shuffle(
              letter.nonjoining
                ? ["isolated", "final"]
                : ["initial", "medial", "isolated", "final"],
              random,
            ),
            correct: info.shape,
          },
          {
            id: `position-${i}`,
            kind: "position",
            letter: char,
            example,
            ...info,
            options: shuffle(["start", "middle", "end"], random),
            correct: info.position,
          },
        ];
      }),
      random,
    );
  }
  function isCorrectAnswer(q, answer) {
    if (q.kind !== "circle") return answer === q.correct;
    return (
      Array.isArray(answer) &&
      answer.length === q.correct.length &&
      new Set(answer).size === answer.length &&
      answer.every((index) => q.correct.includes(index))
    );
  }
  const api = {
    banks,
    modes,
    wordInfo,
    createLetterQuestions,
    isCorrectAnswer,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else window.ArabicLetterFocused = api;
})();
