(() => {
  "use strict";
  const bi = (ar, de) => ({ ar, de });
  const card = (glyph, target, word, de, arNote, deNote, number, audio = `audio/letter-related/${String(number).padStart(2,"0")}.mp3`) => ({ glyph, target, word, meaning: de, note: bi(arNote, deNote), audio });
  const groups = {
    "أ": {
      title: bi("الهمزة والألف: صور نقرأها مع الألف", "Hamza und Alif: verwandte Schreibungen"),
      intro: bi("أ وإ وآ ليست مثل ا المدّية. ؤ همزة على واو، وئ همزة على نبرة؛ ليستا شكلين متصلين للألف ولا حرفين جديدين. ء همزة مفردة، وى ألف مقصورة بلا نقطتين، تنطق ألفًا لا ياءً.", "أ, إ und آ sind von langem ا zu unterscheiden. ؤ trägt Hamza auf Wāw, ئ auf einem Yā-Träger: keine Verbindungsformen von Alif und keine zusätzlichen Alphabetbuchstaben. ء ist Hamza ohne Träger; ى ist punktloses Alif maqṣūra mit dem Laut ā, nicht ī."),
      cards: [
        card("أ", "أ", "أَسَدٌ", "Löwe", "همزة فوق الألف؛ هنا معها فتحة.", "Hamza über Alif, hier mit Fatḥa.", 1),
        card("إ", "إ", "إِبْرَةٌ", "Nadel", "همزة القطع تحت الألف عند الكسر.", "Qaṭʿ-Hamza unter Alif bei Kasra.", 2),
        card("آ", "آ", "آدَمُ", "Adam", "همزة يتلوها مدّ بالألف، وتكتب بعلامة المدّ.", "Hamza plus langes ā mit Madda-Zeichen.", 3),
        card("ا", "ا", "بَابٌ", "Tür", "ألف المدّ، لا رأس همزة عليها.", "Langvokal-Alif ohne Hamza-Zeichen.", 4),
        card("ؤ", "ؤ", "مُؤْمِنٌ", "gläubig", "همزة على كرسي الواو؛ لا ننطق الكرسي واوًا مستقلة.", "Hamza auf Wāw; der Träger ist kein zusätzlicher w-Laut.", 5),
        card("ئ", "ئ", "بِئْرٌ", "Brunnen", "همزة على نبرة، وتسمى همزة على ياء أيضًا.", "Hamza auf einem Yā-Träger, auch Nabra genannt.", 6),
        card("ء", "ء", "مَاءٌ", "Wasser", "همزة مفردة على السطر.", "Hamza ohne Träger auf der Zeile.", 7),
        card("ى", "ى", "فَتَى", "junger Mann", "ألف مقصورة في آخر الكلمة؛ لا نقطتين تحتها. نقرأ المثال هنا عند الوقف: فَتَى، بلا تنوين مسموع.", "Alif maqṣūra am Wortende, ohne zwei Punkte. Dieses Beispiel wird in der Pause gesprochen: fatā, ohne hörbares Tanwīn.", 8, "audio/letter-related/08-waqf.mp3"),
      ],
    },
    "ت": {
      title: bi("مع التاء: ت وة وـة", "Beim Tā: ت, ة und ـة"),
      intro: bi("التاء المبسوطة ت تبقى تاءً عند الوقف والوصل. التاء المربوطة ة أو ـة تأتي آخر الكلمة، وتنطق هاءً عند الوقف وتاءً عند الوصل. ة وـة صورتان لحرف واحد بحسب الاتصال بما قبله.", "Offenes ت bleibt t in Pause und Verbindung. Tā marbūṭa ة bzw. ـة steht am Wortende: in der Pause h, beim Verbinden t. ة und ـة sind Verbindungsformen desselben Zeichens."),
      cards: [
        card("ت", "ت", "بَيْتٌ", "Haus", "تاء مبسوطة؛ نقف عليها بصوت تاء.", "Offenes Tā; in der Pause bleibt t hörbar.", 9),
        card("ـة", "ة", "مَدْرَسَةٌ", "Schule", "تاء مربوطة متصلة بالسين قبلها.", "Tā marbūṭa, mit dem vorangehenden Sīn verbunden.", 10),
        card("ة", "ة", "كُرَةٌ", "Ball", "تاء مربوطة منفصلة لأن الراء لا تتصل بما بعدها.", "Unverbundenes Tā marbūṭa nach dem nicht weiterverbindenden Rā.", 11),
      ],
    },
  };
  const audio = {};
  for (const group of Object.values(groups)) for (const item of group.cards) audio[item.word.normalize("NFC")] = item.audio;
  const api = { groups, audio };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else { window.ArabicLetterRelated = api; Object.assign(window.ArabicLetterData.audio, audio); }
})();
