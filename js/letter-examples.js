(() => {
  "use strict";
  // Each row: letter, initial, medial, separated final, connected final.
  // The separated final is always preceded by ا د ذ ر ز و (including أ).
  const rows = [
    [
      "أ",
      ["أسد", "Löwe"],
      ["سأل", "fragte"],
      ["قرأ", "las"],
      ["ملأ", "füllte"],
    ],
    ["ب", ["بطة", "Ente"], ["جبل", "Berg"], ["باب", "Tür"], ["كلب", "Hund"]],
    [
      "ت",
      ["تفاح", "Äpfel"],
      ["كتاب", "Buch"],
      ["نبات", "Pflanze"],
      ["بيت", "Haus"],
    ],
    [
      "ث",
      ["ثعلب", "Fuchs"],
      ["مثلث", "Dreieck"],
      ["إرث", "Erbe"],
      ["بحث", "Suche"],
    ],
    [
      "ج",
      ["جمل", "Kamel"],
      ["نجم", "Stern"],
      ["تاج", "Krone"],
      ["ثلج", "Schnee"],
    ],
    [
      "ح",
      ["حصان", "Pferd"],
      ["بحر", "Meer"],
      ["تفاح", "Äpfel"],
      ["ملح", "Salz"],
    ],
    [
      "خ",
      ["خبز", "Brot"],
      ["نخلة", "Dattelpalme"],
      ["صاروخ", "Rakete"],
      ["مطبخ", "Küche"],
    ],
    ["د", ["دب", "Bär"], ["مدرسة", "Schule"], ["ورد", "Rosen"], ["يد", "Hand"]],
    [
      "ذ",
      ["ذرة", "Mais"],
      ["بذرة", "Samen"],
      ["رذاذ", "Sprühregen"],
      ["فخذ", "Oberschenkel"],
    ],
    [
      "ر",
      ["رمان", "Granatapfel"],
      ["برتقال", "Orangen"],
      ["دار", "Haus"],
      ["قمر", "Mond"],
    ],
    [
      "ز",
      ["زهرة", "Blume"],
      ["مزرعة", "Bauernhof"],
      ["أرز", "Reis"],
      ["خبز", "Brot"],
    ],
    [
      "س",
      ["سمكة", "Fisch"],
      ["مسرح", "Theater"],
      ["كأس", "Glas"],
      ["شمس", "Sonne"],
    ],
    [
      "ش",
      ["شمس", "Sonne"],
      ["بشرة", "Haut"],
      ["فراش", "Bettzeug"],
      ["جيش", "Armee"],
    ],
    [
      "ص",
      ["صقر", "Falke"],
      ["بصل", "Zwiebeln"],
      ["غواص", "Taucher"],
      ["قفص", "Käfig"],
    ],
    [
      "ض",
      ["ضفدع", "Frosch"],
      ["خضار", "Gemüse"],
      ["حوض", "Becken"],
      ["بيض", "Eier"],
    ],
    [
      "ط",
      ["طائرة", "Flugzeug"],
      ["بطيخ", "Wassermelone"],
      ["بساط", "Teppich"],
      ["قط", "Katze"],
    ],
    [
      "ظ",
      ["ظرف", "Briefumschlag"],
      ["نظيف", "sauber"],
      ["ألفاظ", "Ausdrücke"],
      ["حظ", "Glück"],
    ],
    [
      "ع",
      ["عنب", "Trauben"],
      ["معلم", "Lehrer"],
      ["ذراع", "Arm"],
      ["إصبع", "Finger"],
    ],
    [
      "غ",
      ["غزال", "Gazelle"],
      ["مغرب", "Westen"],
      ["فراغ", "Freiraum"],
      ["صمغ", "Klebstoff"],
    ],
    [
      "ف",
      ["فيل", "Elefant"],
      ["مفتاح", "Schlüssel"],
      ["خروف", "Schaf"],
      ["كتف", "Schulter"],
    ],
    [
      "ق",
      ["قمر", "Mond"],
      ["مقعد", "Sitzplatz"],
      ["أوراق", "Blätter"],
      ["طبق", "Teller"],
    ],
    [
      "ك",
      ["كتاب", "Buch"],
      ["مكتب", "Schreibtisch"],
      ["شباك", "Fenster"],
      ["سمك", "Fisch"],
    ],
    [
      "ل",
      ["ليمون", "Zitrone"],
      ["قلم", "Stift"],
      ["هلال", "Mondsichel"],
      ["جبل", "Berg"],
    ],
    [
      "م",
      ["موز", "Banane"],
      ["جمل", "Kamel"],
      ["طعام", "Essen"],
      ["قلم", "Stift"],
    ],
    [
      "ن",
      ["نجم", "Stern"],
      ["منزل", "Wohnung"],
      ["حصان", "Pferd"],
      ["عين", "Auge"],
    ],
    [
      "ه",
      ["هلال", "Mondsichel"],
      ["نهر", "Fluss"],
      ["مياه", "Wasser"],
      ["وجه", "Gesicht"],
    ],
    [
      "و",
      ["وردة", "Rose"],
      ["فول", "Bohnen"],
      ["جرو", "Welpe"],
      ["دلو", "Eimer"],
    ],
    ["ي", ["يد", "Hand"], ["بيت", "Haus"], ["شاي", "Tee"], ["كرسي", "Stuhl"]],
  ];
  const examples = Object.fromEntries(
    rows.map(([letter, ...words]) => [
      letter,
      words.map(([word, de], position) => ({
        word,
        de,
        index:
          position === 0 ? 0 : position === 1 ? 1 : Array.from(word).length - 1,
      })),
    ]),
  );
  const nonJoining = new Set(Array.from("اأإآدذرزو"));
  function graphemes(word) {
    const result = [];
    for (const char of word) {
      if (/\p{M}/u.test(char) && result.length)
        result[result.length - 1] += char;
      else result.push(char);
    }
    return result;
  }
  function highlight(container, word, index) {
    const clusters = graphemes(word);
    const target = document.createElement("mark");
    target.className = "letter-target";
    target.textContent = clusters[index];
    container.replaceChildren(
      document.createTextNode(clusters.slice(0, index).join("")),
      target,
      document.createTextNode(clusters.slice(index + 1).join("")),
    );
  }
  const api = { examples, nonJoining, graphemes, highlight };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else window.ArabicLetterExamples = api;
})();
