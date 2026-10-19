(() => {
  "use strict";
  const data = {
    lessons: [
      {
        id: "letter-01",
        char: "أ",
        contrast: "ل",
        vocabulary: [
          {
            ar: "أَسَد",
            de: "Löwe",
            image: {
              file: "images/book-two/twemoji/1f981.svg",
            },
          },
          {
            ar: "أَرْنَب",
            de: "Kaninchen",
            image: {
              file: "images/book-two/twemoji/1f407.svg",
            },
          },
          {
            ar: "أَنَانَاس",
            de: "Ananas",
            image: {
              file: "images/book-two/twemoji/1f34d.svg",
            },
          },
        ],
        reading: [
          {
            ar: "هَذَا أَسَدٌ.",
            de: "Das ist ein Löwe.",
          },
          {
            ar: "وَهَذَا أَرْنَبٌ صَغِيرٌ.",
            de: "Und das ist ein kleines Kaninchen.",
          },
          {
            ar: "يَأْكُلُ الْأَرْنَبُ الْعُشْبَ.",
            de: "Das Kaninchen frisst Gras.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: هَذَا ….",
              de: "Ergänze aus dem Text: هَذَا ….",
            },
            options: ["أَسَدٌ", "أَرْنَب", "أَنَانَاس"],
            answer: "أَسَدٌ",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: يَأْكُلُ الْأَرْنَبُ ….",
              de: "Ergänze aus dem Text: يَأْكُلُ الْأَرْنَبُ ….",
            },
            options: ["أَسَد", "أَرْنَب", "الْعُشْبَ"],
            answer: "الْعُشْبَ",
            evidence: 2,
          },
        ],
        grammar: {
          title: {
            ar: "التحية",
            de: "Begrüßung",
          },
          rule: {
            ar: "نرد التحية بألفاظ مهذبة.",
            de: "Wir antworten höflich auf eine Begrüßung.",
          },
          examples: ["وَعَلَيْكُمُ السَّلَامُ", "الْخَيْرِ"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "ردّ على: السَّلَامُ عَلَيْكُمْ",
                de: "Antworte auf den Friedensgruß.",
              },
              options: [
                "وَعَلَيْكُمُ السَّلَامُ",
                "إِلَى اللِّقَاءِ",
                "صَبَاحُ الْخَيْرِ",
              ],
              answer: "وَعَلَيْكُمُ السَّلَامُ",
            },
            {
              id: "g1",
              prompt: {
                ar: "أكمل: صَبَاحُ…",
                de: "Ergänze den Morgengruß.",
              },
              options: ["الْبَيْتِ", "الْقَلَمِ", "الْخَيْرِ"],
              answer: "الْخَيْرِ",
            },
            {
              id: "g2",
              prompt: {
                ar: "ماذا نقول عند الوداع؟",
                de: "Was sagen wir beim Abschied?",
              },
              options: ["هَذَا أَسَدٌ", "إِلَى اللِّقَاءِ", "أَنَا طَالِبٌ"],
              answer: "إِلَى اللِّقَاءِ",
            },
            {
              id: "g3",
              prompt: {
                ar: "ردّ على: شُكْرًا",
                de: "Antworte auf Danke.",
              },
              options: ["عَفْوًا", "مَرْحَبًا", "مَسَاءُ الْخَيْرِ"],
              answer: "عَفْوًا",
            },
          ],
        },
      },
      {
        id: "letter-02",
        char: "ب",
        contrast: "ت",
        vocabulary: [
          {
            ar: "بَيْت",
            de: "Haus",
            image: {
              file: "images/book-two/twemoji/1f3e0.svg",
            },
          },
          {
            ar: "بَطَّة",
            de: "Ente",
            image: {
              file: "images/book-two/twemoji/1f986.svg",
            },
          },
          {
            ar: "بَصَل",
            de: "Zwiebel",
            image: {
              file: "images/book-two/twemoji/1f9c5.svg",
            },
          },
        ],
        reading: [
          {
            ar: "قُرْبَ الْبَيْتِ بَطَّةٌ.",
            de: "In der Nähe des Hauses ist eine Ente.",
          },
          {
            ar: "تَسْبَحُ الْبَطَّةُ فِي الْمَاءِ.",
            de: "Die Ente schwimmt im Wasser.",
          },
          {
            ar: "وَفِي الْمَطْبَخِ بَصَلٌ.",
            de: "Und in der Küche liegen Zwiebeln.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: تَسْبَحُ الْبَطَّةُ فِي ….",
              de: "Ergänze aus dem Text: تَسْبَحُ الْبَطَّةُ فِي ….",
            },
            options: ["بَيْت", "بَطَّة", "الْمَاءِ"],
            answer: "الْمَاءِ",
            evidence: 1,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: وَفِي … بَصَلٌ.",
              de: "Ergänze aus dem Text: وَفِي … بَصَلٌ.",
            },
            options: ["بَطَّة", "الْمَطْبَخِ", "بَيْت"],
            answer: "الْمَطْبَخِ",
            evidence: 2,
          },
        ],
        grammar: {
          title: {
            ar: "هذا وهذه",
            de: "Dieser und diese",
          },
          rule: {
            ar: "نستخدم هذا للمذكر وهذه للمؤنث.",
            de: "Hāḏā steht beim Maskulinum, hāḏihi beim Femininum.",
          },
          examples: ["هَذَا", "هَذِهِ"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "… بَيْتٌ",
                de: "Ergänze: … ein Haus.",
              },
              options: ["هَذِهِ", "هَؤُلَاءِ", "هَذَا"],
              answer: "هَذَا",
            },
            {
              id: "g1",
              prompt: {
                ar: "… بَطَّةٌ",
                de: "Ergänze: … eine Ente.",
              },
              options: ["هَؤُلَاءِ", "هَذِهِ", "هَذَا"],
              answer: "هَذِهِ",
            },
            {
              id: "g2",
              prompt: {
                ar: "… بَصَلٌ",
                de: "Ergänze: … Zwiebeln.",
              },
              options: ["هَذَا", "هَذِهِ", "أَنَا"],
              answer: "هَذَا",
            },
            {
              id: "g3",
              prompt: {
                ar: "… حَقِيبَةٌ",
                de: "Ergänze: … eine Tasche.",
              },
              options: ["هَذَا", "نَحْنُ", "هَذِهِ"],
              answer: "هَذِهِ",
            },
          ],
        },
      },
      {
        id: "letter-03",
        char: "ت",
        contrast: "ث",
        vocabulary: [
          {
            ar: "تُفَّاح",
            de: "Äpfel",
            image: {
              file: "images/book-two/twemoji/1f34e.svg",
            },
          },
          {
            ar: "تَاج",
            de: "Krone",
            image: {
              file: "images/book-two/twemoji/1f451.svg",
            },
          },
          {
            ar: "تِمْسَاح",
            de: "Krokodil",
            image: {
              file: "images/book-two/twemoji/1f40a.svg",
            },
          },
        ],
        reading: [
          {
            ar: "تَحْمِلُ تَمَارَا تُفَّاحَةً.",
            de: "Tamara trägt einen Apfel.",
          },
          {
            ar: "وَتَرْسُمُ تَاجًا فِي الدَّفْتَرِ.",
            de: "Sie zeichnet eine Krone ins Heft.",
          },
          {
            ar: "ثُمَّ تَرْسُمُ تِمْسَاحًا.",
            de: "Dann zeichnet sie ein Krokodil.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: تَحْمِلُ تَمَارَا ….",
              de: "Ergänze aus dem Text: تَحْمِلُ تَمَارَا ….",
            },
            options: ["تَاج", "تُفَّاحَةً", "تُفَّاح"],
            answer: "تُفَّاحَةً",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: ثُمَّ تَرْسُمُ ….",
              de: "Ergänze aus dem Text: ثُمَّ تَرْسُمُ ….",
            },
            options: ["تِمْسَاحًا", "تُفَّاح", "تَاج"],
            answer: "تِمْسَاحًا",
            evidence: 2,
          },
        ],
        grammar: {
          title: {
            ar: "التاء المربوطة",
            de: "Tāʾ marbūṭa",
          },
          rule: {
            ar: "التاء المربوطة تكتب ة أو ـة في نهاية الكلمة.",
            de: "Tāʾ marbūṭa steht als ة oder ـة am Wortende.",
          },
          examples: ["تُفَّاحَة", "ة"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "اختر الكلمة المنتهية بتاء مربوطة.",
                de: "Wähle das Wort mit Tāʾ marbūṭa.",
              },
              options: ["بَيْت", "تُفَّاحَة", "تَاج"],
              answer: "تُفَّاحَة",
            },
            {
              id: "g1",
              prompt: {
                ar: "أكمل: مَدْرَسَـ…",
                de: "Ergänze das Wort Schule.",
              },
              options: ["ة", "ت", "ه"],
              answer: "ة",
            },
            {
              id: "g2",
              prompt: {
                ar: "اختر الكتابة الصحيحة.",
                de: "Wähle die richtige Schreibung.",
              },
              options: ["حَقِيبَت", "حَقِيبَه", "حَقِيبَة"],
              answer: "حَقِيبَة",
            },
            {
              id: "g3",
              prompt: {
                ar: "اختر الكلمة التي تنتهي بتاء مفتوحة.",
                de: "Welches Wort endet mit offenem Tā?",
              },
              options: ["وَرْدَة", "بَيْت", "بَطَّة"],
              answer: "بَيْت",
            },
          ],
        },
      },
      {
        id: "letter-04",
        char: "ث",
        contrast: "ت",
        vocabulary: [
          {
            ar: "ثَعْلَب",
            de: "Fuchs",
            image: {
              file: "images/book-two/twemoji/1f98a.svg",
            },
          },
          {
            ar: "ثَلْج",
            de: "Schnee",
            image: {
              file: "images/book-two/twemoji/2744.svg",
            },
          },
          {
            ar: "ثُوم",
            de: "Knoblauch",
            image: {
              file: "images/book-two/twemoji/1f9c4.svg",
            },
          },
        ],
        reading: [
          {
            ar: "يَعِيشُ الثَّعْلَبُ فِي الْغَابَةِ.",
            de: "Der Fuchs lebt im Wald.",
          },
          {
            ar: "يَنْزِلُ الثَّلْجُ فِي الشِّتَاءِ.",
            de: "Im Winter fällt Schnee.",
          },
          {
            ar: "نَضَعُ الثُّومَ فِي الطَّعَامِ.",
            de: "Wir geben Knoblauch ins Essen.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: يَعِيشُ الثَّعْلَبُ فِي ….",
              de: "Ergänze aus dem Text: يَعِيشُ الثَّعْلَبُ فِي ….",
            },
            options: ["الْغَابَةِ", "ثَعْلَب", "ثَلْج"],
            answer: "الْغَابَةِ",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: يَنْزِلُ الثَّلْجُ فِي ….",
              de: "Ergänze aus dem Text: يَنْزِلُ الثَّلْجُ فِي ….",
            },
            options: ["ثَعْلَب", "ثَلْج", "الشِّتَاءِ"],
            answer: "الشِّتَاءِ",
            evidence: 1,
          },
        ],
        grammar: {
          title: {
            ar: "واحد واثنان",
            de: "Eins und zwei",
          },
          rule: {
            ar: "المفرد يدل على واحد، والمثنى على اثنين.",
            de: "Singular bedeutet eins, Dual bedeutet zwei.",
          },
          examples: ["اثْنَانِ", "كِتَابَانِ"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "ثَعْلَبٌ واحد، وثَعْلَبَانِ…",
                de: "Ein Fuchs, zwei Füchse: ergänze.",
              },
              options: ["اثْنَانِ", "وَاحِدٌ", "ثَلَاثَةٌ"],
              answer: "اثْنَانِ",
            },
            {
              id: "g1",
              prompt: {
                ar: "ما مثنى كِتَابٌ في الرفع؟",
                de: "Wie heißt Buch im Dual im Nominativ?",
              },
              options: ["كُتُبٌ", "كِتَابٌ", "كِتَابَانِ"],
              answer: "كِتَابَانِ",
            },
            {
              id: "g2",
              prompt: {
                ar: "ما مفرد ثَعْلَبَانِ؟",
                de: "Wie lautet der Singular von zwei Füchsen?",
              },
              options: ["ثَلْجٌ", "ثَعْلَبٌ", "ثَعَالِبُ"],
              answer: "ثَعْلَبٌ",
            },
            {
              id: "g3",
              prompt: {
                ar: "أكمل: هَاتَانِ…",
                de: "Ergänze: Diese beiden sind …",
              },
              options: ["بَطَّتَانِ", "بَطَّةٌ", "بَطَّاتٌ"],
              answer: "بَطَّتَانِ",
            },
          ],
        },
      },
      {
        id: "letter-05",
        char: "ج",
        contrast: "ح",
        vocabulary: [
          {
            ar: "جَمَل",
            de: "Kamel",
            image: {
              file: "images/book-two/twemoji/1f42a.svg",
            },
          },
          {
            ar: "جَزَر",
            de: "Karotten",
            image: {
              file: "images/book-two/twemoji/1f955.svg",
            },
          },
          {
            ar: "جَبَل",
            de: "Berg",
            image: {
              file: "images/book-two/twemoji/26f0.svg",
            },
          },
        ],
        reading: [
          {
            ar: "جَمَالٌ يَرْسُمُ جَمَلًا.",
            de: "Jamal zeichnet ein Kamel.",
          },
          {
            ar: "يَرْسُمُ جَبَلًا خَلْفَ الْجَمَلِ.",
            de: "Er zeichnet einen Berg hinter das Kamel.",
          },
          {
            ar: "ثُمَّ يَأْكُلُ جَزَرَةً.",
            de: "Dann isst er eine Karotte.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: جَمَالٌ يَرْسُمُ ….",
              de: "Ergänze aus dem Text: جَمَالٌ يَرْسُمُ ….",
            },
            options: ["جَمَل", "جَزَر", "جَمَلًا"],
            answer: "جَمَلًا",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: ثُمَّ يَأْكُلُ ….",
              de: "Ergänze aus dem Text: ثُمَّ يَأْكُلُ ….",
            },
            options: ["جَزَر", "جَزَرَةً", "جَمَل"],
            answer: "جَزَرَةً",
            evidence: 2,
          },
        ],
        grammar: {
          title: {
            ar: "المذكر والمؤنث",
            de: "Maskulin und feminin",
          },
          rule: {
            ar: "توافق الصفة الاسم في التذكير والتأنيث.",
            de: "Das Adjektiv stimmt im Geschlecht mit dem Nomen überein.",
          },
          examples: ["كَبِيرٌ", "صَغِيرَةٌ"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "أكمل: جَمَلٌ…",
                de: "Ergänze: ein großes Kamel.",
              },
              options: ["كَبِيرَةٌ", "كَبِيرَتَانِ", "كَبِيرٌ"],
              answer: "كَبِيرٌ",
            },
            {
              id: "g1",
              prompt: {
                ar: "أكمل: بِنْتٌ…",
                de: "Ergänze: ein kleines Mädchen.",
              },
              options: ["صِغَارٌ", "صَغِيرَةٌ", "صَغِيرٌ"],
              answer: "صَغِيرَةٌ",
            },
            {
              id: "g2",
              prompt: {
                ar: "اختر المؤنث.",
                de: "Wähle das feminine Nomen.",
              },
              options: ["نَاقَةٌ", "جَمَلٌ", "جَبَلٌ"],
              answer: "نَاقَةٌ",
            },
            {
              id: "g3",
              prompt: {
                ar: "أكمل: زَرَافَةٌ…",
                de: "Ergänze: eine große Giraffe.",
              },
              options: ["طَوِيلٌ", "طَوِيلَانِ", "طَوِيلَةٌ"],
              answer: "طَوِيلَةٌ",
            },
          ],
        },
      },
      {
        id: "letter-06",
        char: "ح",
        contrast: "خ",
        vocabulary: [
          {
            ar: "حُوت",
            de: "Wal",
            image: {
              file: "images/book-two/twemoji/1f40b.svg",
            },
          },
          {
            ar: "حِصَان",
            de: "Pferd",
            image: {
              file: "images/book-two/twemoji/1f40e.svg",
            },
          },
          {
            ar: "حَقِيبَة",
            de: "Tasche",
            image: {
              file: "images/book-two/twemoji/1f392.svg",
            },
          },
        ],
        reading: [
          {
            ar: "تَحْمِلُ حَنَانُ حَقِيبَةً.",
            de: "Hanan trägt eine Tasche.",
          },
          {
            ar: "فِي الْحَقِيبَةِ صُورَةُ حُوتٍ.",
            de: "In der Tasche ist ein Bild eines Wals.",
          },
          {
            ar: "وَصُورَةُ حِصَانٍ.",
            de: "Und ein Bild eines Pferdes.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: تَحْمِلُ حَنَانُ ….",
              de: "Ergänze aus dem Text: تَحْمِلُ حَنَانُ ….",
            },
            options: ["حِصَان", "حَقِيبَةً", "حُوت"],
            answer: "حَقِيبَةً",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: فِي الْحَقِيبَةِ صُورَةُ ….",
              de: "Ergänze aus dem Text: فِي الْحَقِيبَةِ صُورَةُ ….",
            },
            options: ["حُوتٍ", "حِصَان", "حَقِيبَة"],
            answer: "حُوتٍ",
            evidence: 1,
          },
        ],
        grammar: {
          title: {
            ar: "أنا وأنت",
            de: "Ich und du",
          },
          rule: {
            ar: "أنا للمتكلم، وأنتَ للمخاطب المذكر، وأنتِ للمخاطبة.",
            de: "Anā heißt ich; anta du (männlich), anti du (weiblich).",
          },
          examples: ["أَنَا", "أَنْتَ"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "أتحدث عن نفسي: … أَقْرَأُ.",
                de: "Über mich selbst: … lese.",
              },
              options: ["هِيَ", "أَنَا", "هُوَ"],
              answer: "أَنَا",
            },
            {
              id: "g1",
              prompt: {
                ar: "أخاطب ولدًا: … تَقْرَأُ.",
                de: "Zu einem Jungen: … liest.",
              },
              options: ["أَنْتَ", "أَنَا", "هُمْ"],
              answer: "أَنْتَ",
            },
            {
              id: "g2",
              prompt: {
                ar: "أخاطب بنتًا: … تَقْرَئِينَ.",
                de: "Zu einem Mädchen: … liest.",
              },
              options: ["هُوَ", "أَنَا", "أَنْتِ"],
              answer: "أَنْتِ",
            },
            {
              id: "g3",
              prompt: {
                ar: "اختر الجملة الصحيحة.",
                de: "Wähle den richtigen Satz.",
              },
              options: [
                "أَنَا تَحْمِلِينَ حَقِيبَةً",
                "أَنَا أَحْمِلُ حَقِيبَةً",
                "أَنَا يَحْمِلُ حَقِيبَةً",
              ],
              answer: "أَنَا أَحْمِلُ حَقِيبَةً",
            },
          ],
        },
      },
      {
        id: "letter-07",
        char: "خ",
        contrast: "ج",
        vocabulary: [
          {
            ar: "خُبْز",
            de: "Brot",
            image: {
              file: "images/book-two/twemoji/1f35e.svg",
            },
          },
          {
            ar: "خِيَار",
            de: "Gurke",
            image: {
              file: "images/book-two/twemoji/1f952.svg",
            },
          },
          {
            ar: "خَرُوف",
            de: "Schaf",
            image: {
              file: "images/book-two/twemoji/1f411.svg",
            },
          },
        ],
        reading: [
          {
            ar: "يَأْكُلُ خَالِدٌ خُبْزًا وَخِيَارًا.",
            de: "Khalid isst Brot und Gurke.",
          },
          {
            ar: "يَخْرُجُ خَالِدٌ إِلَى الْحَقْلِ.",
            de: "Khalid geht auf das Feld.",
          },
          {
            ar: "يَرَى خَرُوفًا صَغِيرًا.",
            de: "Er sieht ein kleines Schaf.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: يَأْكُلُ خَالِدٌ … وَخِيَارًا.",
              de: "Ergänze aus dem Text: يَأْكُلُ خَالِدٌ … وَخِيَارًا.",
            },
            options: ["خُبْزًا", "خُبْز", "خِيَار"],
            answer: "خُبْزًا",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: يَرَى … صَغِيرًا.",
              de: "Ergänze aus dem Text: يَرَى … صَغِيرًا.",
            },
            options: ["خُبْز", "خِيَار", "خَرُوفًا"],
            answer: "خَرُوفًا",
            evidence: 2,
          },
        ],
        grammar: {
          title: {
            ar: "لي ولك",
            de: "Mir und dir gehören",
          },
          rule: {
            ar: "نستخدم لي ولكَ ولكِ للتعبير عن الملكية.",
            de: "Lī, laka und laki drücken Zugehörigkeit aus.",
          },
          examples: ["لِي", "لَكَ"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "أتحدث عن خبزي: هَذَا الْخُبْزُ…",
                de: "Über mein Brot: Dieses Brot gehört …",
              },
              options: ["لِي", "لَهَا", "لَهُمْ"],
              answer: "لِي",
            },
            {
              id: "g1",
              prompt: {
                ar: "أخاطب ولدًا: هَذَا الْقَلَمُ…",
                de: "Zum Jungen: Dieser Stift gehört dir.",
              },
              options: ["لَكِ", "لِي", "لَكَ"],
              answer: "لَكَ",
            },
            {
              id: "g2",
              prompt: {
                ar: "أخاطب بنتًا: هَذِهِ الْحَقِيبَةُ…",
                de: "Zum Mädchen: Diese Tasche gehört dir.",
              },
              options: ["لَهُ", "لَكِ", "لَكَ"],
              answer: "لَكِ",
            },
            {
              id: "g3",
              prompt: {
                ar: "اختر الجملة التي تعبّر عن ملكيتي.",
                de: "Welcher Satz bedeutet, dass es mir gehört?",
              },
              options: [
                "هَذَا الْكِتَابُ لِي",
                "هَذَا الْكِتَابُ لَهُ",
                "هَذَا الْكِتَابُ لَهَا",
              ],
              answer: "هَذَا الْكِتَابُ لِي",
            },
          ],
        },
      },
      {
        id: "letter-08",
        char: "د",
        contrast: "ذ",
        vocabulary: [
          {
            ar: "دُبّ",
            de: "Bär",
            image: {
              file: "images/book-two/twemoji/1f43b.svg",
            },
          },
          {
            ar: "دَجَاجَة",
            de: "Huhn",
            image: {
              file: "images/book-two/twemoji/1f414.svg",
            },
          },
          {
            ar: "دَرَّاجَة",
            de: "Fahrrad",
            image: {
              file: "images/book-two/twemoji/1f6b2.svg",
            },
          },
        ],
        reading: [
          {
            ar: "يَرْكَبُ دَاوُدُ دَرَّاجَةً.",
            de: "Dawud fährt Fahrrad.",
          },
          {
            ar: "يَرَى دَجَاجَةً قُرْبَ الدَّارِ.",
            de: "Er sieht ein Huhn in der Nähe des Hauses.",
          },
          {
            ar: "وَيَقْرَأُ قِصَّةً عَنْ دُبٍّ.",
            de: "Und er liest eine Geschichte über einen Bären.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: يَرْكَبُ دَاوُدُ ….",
              de: "Ergänze aus dem Text: يَرْكَبُ دَاوُدُ ….",
            },
            options: ["دُبّ", "دَجَاجَة", "دَرَّاجَةً"],
            answer: "دَرَّاجَةً",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: وَيَقْرَأُ قِصَّةً عَنْ ….",
              de: "Ergänze aus dem Text: وَيَقْرَأُ قِصَّةً عَنْ ….",
            },
            options: ["دَرَّاجَة", "دُبٍّ", "دَجَاجَة"],
            answer: "دُبٍّ",
            evidence: 2,
          },
        ],
        grammar: {
          title: {
            ar: "في وعلى",
            de: "In und auf",
          },
          rule: {
            ar: "تأتي في وعلى قبل الاسم لتوضيح المكان.",
            de: "Fī und ʿalā stehen vor einem Nomen und geben den Ort an.",
          },
          examples: ["فِي", "عَلَى"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "القلم داخل الحقيبة: الْقَلَمُ … الْحَقِيبَةِ.",
                de: "Der Stift ist in der Tasche.",
              },
              options: ["عَلَى", "إِلَى", "فِي"],
              answer: "فِي",
            },
            {
              id: "g1",
              prompt: {
                ar: "الكتاب فوق الطاولة: الْكِتَابُ … الطَّاوِلَةِ.",
                de: "Das Buch liegt auf dem Tisch.",
              },
              options: ["مِنْ", "عَلَى", "فِي"],
              answer: "عَلَى",
            },
            {
              id: "g2",
              prompt: {
                ar: "أكمل بالحرف المناسب للاتجاه: أَذْهَبُ … الْمَدْرَسَةِ.",
                de: "Ergänze die Richtung: Ich gehe zur Schule.",
              },
              options: ["إِلَى", "عَلَى", "فِي"],
              answer: "إِلَى",
            },
            {
              id: "g3",
              prompt: {
                ar: "اختر حرف جر.",
                de: "Wähle eine Präposition.",
              },
              options: ["كِتَاب", "يَكْتُبُ", "فِي"],
              answer: "فِي",
            },
          ],
        },
      },
      {
        id: "letter-09",
        char: "ذ",
        contrast: "د",
        vocabulary: [
          {
            ar: "ذُرَة",
            de: "Mais",
            image: {
              file: "images/book-two/twemoji/1f33d.svg",
            },
          },
          {
            ar: "ذِئْب",
            de: "Wolf",
            image: {
              file: "images/book-two/twemoji/1f43a.svg",
            },
          },
          {
            ar: "ذُبَابَة",
            de: "Fliege",
            image: {
              file: "images/book-two/twemoji/1fab0.svg",
            },
          },
        ],
        reading: [
          {
            ar: "يَحْمِلُ ذِيَابٌ ذُرَةً.",
            de: "Dhiyab trägt Mais.",
          },
          {
            ar: "يَرَى ذُبَابَةً عَلَى النَّافِذَةِ.",
            de: "Er sieht eine Fliege am Fenster.",
          },
          {
            ar: "ثُمَّ يَرْسُمُ ذِئْبًا.",
            de: "Dann zeichnet er einen Wolf.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: يَحْمِلُ ذِيَابٌ ….",
              de: "Ergänze aus dem Text: يَحْمِلُ ذِيَابٌ ….",
            },
            options: ["ذُبَابَة", "ذُرَةً", "ذِئْب"],
            answer: "ذُرَةً",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: ثُمَّ يَرْسُمُ ….",
              de: "Ergänze aus dem Text: ثُمَّ يَرْسُمُ ….",
            },
            options: ["ذِئْبًا", "ذُرَة", "ذِئْب"],
            answer: "ذِئْبًا",
            evidence: 2,
          },
        ],
        grammar: {
          title: {
            ar: "هذا وذلك",
            de: "Dieser hier und jener dort",
          },
          rule: {
            ar: "هذا للقريب، وذلك للبعيد في المذكر.",
            de: "Hāḏā bezeichnet Nahes, ḏālika Fernes (maskulin).",
          },
          examples: ["هَذَا", "ذَلِكَ"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "ذئب قريب: … ذِئْبٌ.",
                de: "Ein Wolf in der Nähe: … ein Wolf.",
              },
              options: ["هَذِهِ", "هَذَا", "ذَلِكَ"],
              answer: "هَذَا",
            },
            {
              id: "g1",
              prompt: {
                ar: "بيت بعيد: … بَيْتٌ.",
                de: "Ein Haus in der Ferne: … ein Haus.",
              },
              options: ["ذَلِكَ", "هَذَا", "هَذِهِ"],
              answer: "ذَلِكَ",
            },
            {
              id: "g2",
              prompt: {
                ar: "قلم قريب: … قَلَمٌ.",
                de: "Ein Stift in der Nähe: … ein Stift.",
              },
              options: ["ذَلِكَ", "تِلْكَ", "هَذَا"],
              answer: "هَذَا",
            },
            {
              id: "g3",
              prompt: {
                ar: "ماذا نستخدم للمؤنث البعيد؟",
                de: "Was steht bei einem fernen femininen Nomen?",
              },
              options: ["هَذَا", "تِلْكَ", "ذَلِكَ"],
              answer: "تِلْكَ",
            },
          ],
        },
      },
      {
        id: "letter-10",
        char: "ر",
        contrast: "ز",
        vocabulary: [
          {
            ar: "رُمَّان",
            de: "Granatapfel",
            image: {
              file: "images/letters/10.png",
            },
          },
          {
            ar: "رِيشَة",
            de: "Feder",
            image: {
              file: "images/book-two/twemoji/1fab6.svg",
            },
          },
          {
            ar: "رُوبُوت",
            de: "Roboter",
            image: {
              file: "images/book-two/twemoji/1f916.svg",
            },
          },
        ],
        reading: [
          {
            ar: "رَامِي يَأْكُلُ رُمَّانًا.",
            de: "Rami isst Granatapfel.",
          },
          {
            ar: "يَجِدُ رِيشَةً عَلَى الْأَرْضِ.",
            de: "Er findet eine Feder auf dem Boden.",
          },
          {
            ar: "ثُمَّ يَلْعَبُ بِرُوبُوتٍ صَغِيرٍ.",
            de: "Dann spielt er mit einem kleinen Roboter.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: رَامِي يَأْكُلُ ….",
              de: "Ergänze aus dem Text: رَامِي يَأْكُلُ ….",
            },
            options: ["رُمَّانًا", "رُمَّان", "رِيشَة"],
            answer: "رُمَّانًا",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: يَجِدُ … عَلَى الْأَرْضِ.",
              de: "Ergänze aus dem Text: يَجِدُ … عَلَى الْأَرْضِ.",
            },
            options: ["رُمَّان", "رُوبُوت", "رِيشَةً"],
            answer: "رِيشَةً",
            evidence: 1,
          },
        ],
        grammar: {
          title: {
            ar: "الألوان",
            de: "Farben",
          },
          rule: {
            ar: "توافق كلمة اللون الاسم الذي تصفه.",
            de: "Die Farbbezeichnung passt sich dem beschriebenen Nomen an.",
          },
          examples: ["حَمْرَاءُ", "أَزْرَقُ"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "أكمل: رُمَّانَةٌ…",
                de: "Ergänze: ein roter Granatapfel.",
              },
              options: ["حَمْرَاءُ", "أَحْمَرُ", "أَبْيَضُ"],
              answer: "حَمْرَاءُ",
            },
            {
              id: "g1",
              prompt: {
                ar: "أكمل: قَلَمٌ…",
                de: "Ergänze: ein blauer Stift.",
              },
              options: ["زَرْقَاءُ", "حَمْرَاءُ", "أَزْرَقُ"],
              answer: "أَزْرَقُ",
            },
            {
              id: "g2",
              prompt: {
                ar: "أكمل: وَرْدَةٌ…",
                de: "Ergänze: eine weiße Rose.",
              },
              options: ["أَسْوَدُ", "بَيْضَاءُ", "أَبْيَضُ"],
              answer: "بَيْضَاءُ",
            },
            {
              id: "g3",
              prompt: {
                ar: "اختر مؤنث أَخْضَرُ.",
                de: "Wähle die feminine Form von grün.",
              },
              options: ["خَضْرَاءُ", "خُضْرٌ", "أَخْضَرُ"],
              answer: "خَضْرَاءُ",
            },
          ],
        },
      },
      {
        id: "letter-11",
        char: "ز",
        contrast: "ر",
        vocabulary: [
          {
            ar: "زَرَافَة",
            de: "Giraffe",
            image: {
              file: "images/book-two/twemoji/1f992.svg",
            },
          },
          {
            ar: "زَهْرَة",
            de: "Blume",
            image: {
              file: "images/book-two/twemoji/1f33c.svg",
            },
          },
          {
            ar: "زَيْتُون",
            de: "Oliven",
            image: {
              file: "images/book-two/twemoji/1fad2.svg",
            },
          },
        ],
        reading: [
          {
            ar: "تَرْسُمُ زَيْنَبُ زَرَافَةً.",
            de: "Zaynab zeichnet eine Giraffe.",
          },
          {
            ar: "تَضَعُ زَهْرَةً قُرْبَ الرَّسْمِ.",
            de: "Sie legt eine Blume neben das Bild.",
          },
          {
            ar: "وَتَأْكُلُ خُبْزًا وَزَيْتُونًا.",
            de: "Und sie isst Brot und Oliven.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: تَرْسُمُ زَيْنَبُ ….",
              de: "Ergänze aus dem Text: تَرْسُمُ زَيْنَبُ ….",
            },
            options: ["زَهْرَة", "زَيْتُون", "زَرَافَةً"],
            answer: "زَرَافَةً",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: تَضَعُ … قُرْبَ الرَّسْمِ.",
              de: "Ergänze aus dem Text: تَضَعُ … قُرْبَ الرَّسْمِ.",
            },
            options: ["زَيْتُون", "زَهْرَةً", "زَرَافَة"],
            answer: "زَهْرَةً",
            evidence: 1,
          },
        ],
        grammar: {
          title: {
            ar: "المثنى",
            de: "Der Dual",
          },
          rule: {
            ar: "تضاف انِ إلى كثير من الأسماء للدلالة على اثنين في حالة الرفع.",
            de: "Viele Nomen erhalten im Nominativ die Endung -āni für zwei.",
          },
          examples: ["زَهْرَتَانِ", "قَلَمَانِ"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "مثنى زَهْرَةٌ في الرفع هو…",
                de: "Zwei Blumen im Nominativ heißen …",
              },
              options: ["زُهُورٌ", "زَهْرَةٌ", "زَهْرَتَانِ"],
              answer: "زَهْرَتَانِ",
            },
            {
              id: "g1",
              prompt: {
                ar: "أكمل: هَذَانِ…",
                de: "Ergänze: Diese beiden sind …",
              },
              options: ["أَقْلَامٌ", "قَلَمَانِ", "قَلَمٌ"],
              answer: "قَلَمَانِ",
            },
            {
              id: "g2",
              prompt: {
                ar: "ما مفرد زَرَافَتَانِ؟",
                de: "Wie lautet der Singular von zwei Giraffen?",
              },
              options: ["زَرَافَةٌ", "زَرَافَاتٌ", "زَهْرَةٌ"],
              answer: "زَرَافَةٌ",
            },
            {
              id: "g3",
              prompt: {
                ar: "أكمل: هَاتَانِ…",
                de: "Ergänze: Diese beiden sind …",
              },
              options: ["زَهْرَةٌ", "زُهُورٌ", "زَهْرَتَانِ"],
              answer: "زَهْرَتَانِ",
            },
          ],
        },
      },
      {
        id: "letter-12",
        char: "س",
        contrast: "ش",
        vocabulary: [
          {
            ar: "سَمَكَة",
            de: "Fisch",
            image: {
              file: "images/book-two/twemoji/1f41f.svg",
            },
          },
          {
            ar: "سَيَّارَة",
            de: "Auto",
            image: {
              file: "images/book-two/twemoji/1f697.svg",
            },
          },
          {
            ar: "سَاعَة",
            de: "Uhr",
            image: {
              file: "images/book-two/twemoji/231a.svg",
            },
          },
        ],
        reading: [
          {
            ar: "يَنْظُرُ سَامِي إِلَى السَّاعَةِ.",
            de: "Sami schaut auf die Uhr.",
          },
          {
            ar: "يَرْكَبُ السَّيَّارَةَ مَعَ أَبِيهِ.",
            de: "Er fährt mit seinem Vater im Auto.",
          },
          {
            ar: "يَرَيَانِ سَمَكَةً فِي حَوْضٍ.",
            de: "Die beiden sehen einen Fisch in einem Aquarium.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: يَنْظُرُ سَامِي إِلَى ….",
              de: "Ergänze aus dem Text: يَنْظُرُ سَامِي إِلَى ….",
            },
            options: ["سَيَّارَة", "السَّاعَةِ", "سَمَكَة"],
            answer: "السَّاعَةِ",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: يَرْكَبُ السَّيَّارَةَ مَعَ ….",
              de: "Ergänze aus dem Text: يَرْكَبُ السَّيَّارَةَ مَعَ ….",
            },
            options: ["أَبِيهِ", "سَمَكَة", "سَيَّارَة"],
            answer: "أَبِيهِ",
            evidence: 1,
          },
        ],
        grammar: {
          title: {
            ar: "أين؟",
            de: "Wo?",
          },
          rule: {
            ar: "نسأل بأين عن المكان.",
            de: "Mit ayna fragen wir nach dem Ort.",
          },
          examples: ["أَيْنَ", "فِي الْمَاءِ"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "نسأل عن مكان السيارة: … السَّيَّارَةُ؟",
                de: "Frage nach dem Ort des Autos.",
              },
              options: ["مَتَى", "أَيْنَ", "مَنْ"],
              answer: "أَيْنَ",
            },
            {
              id: "g1",
              prompt: {
                ar: "أجب: أَيْنَ السَّمَكَةُ؟",
                de: "Antworte: Wo ist der Fisch?",
              },
              options: ["فِي الْمَاءِ", "صَبَاحًا", "أَنَا سَامِي"],
              answer: "فِي الْمَاءِ",
            },
            {
              id: "g2",
              prompt: {
                ar: "أجب عن مكان الساعة.",
                de: "Antworte mit einer Ortsangabe.",
              },
              options: ["اسْمِي سَامِي", "نَعَمْ", "عَلَى الطَّاوِلَةِ"],
              answer: "عَلَى الطَّاوِلَةِ",
            },
            {
              id: "g3",
              prompt: {
                ar: "اختر سؤالًا عن المكان.",
                de: "Wähle eine Frage nach dem Ort.",
              },
              options: ["مَتَى تَنَامُ؟", "أَيْنَ الْكِتَابُ؟", "مَنْ هَذَا؟"],
              answer: "أَيْنَ الْكِتَابُ؟",
            },
          ],
        },
      },
      {
        id: "letter-13",
        char: "ش",
        contrast: "س",
        vocabulary: [
          {
            ar: "شَمْس",
            de: "Sonne",
            image: {
              file: "images/book-two/twemoji/2600.svg",
            },
          },
          {
            ar: "شَجَرَة",
            de: "Baum",
            image: {
              file: "images/book-two/twemoji/1f333.svg",
            },
          },
          {
            ar: "شَمْعَة",
            de: "Kerze",
            image: {
              file: "images/book-two/twemoji/1f56f.svg",
            },
          },
        ],
        reading: [
          {
            ar: "تُشْرِقُ الشَّمْسُ صَبَاحًا.",
            de: "Morgens scheint die Sonne.",
          },
          {
            ar: "تَجْلِسُ شَذَى تَحْتَ شَجَرَةٍ.",
            de: "Shadha sitzt unter einem Baum.",
          },
          {
            ar: "وَفِي الْبَيْتِ شَمْعَةٌ جَمِيلَةٌ.",
            de: "Und im Haus steht eine schöne Kerze.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: تُشْرِقُ الشَّمْسُ ….",
              de: "Ergänze aus dem Text: تُشْرِقُ الشَّمْسُ ….",
            },
            options: ["صَبَاحًا", "شَمْس", "شَجَرَة"],
            answer: "صَبَاحًا",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: تَجْلِسُ شَذَى تَحْتَ ….",
              de: "Ergänze aus dem Text: تَجْلِسُ شَذَى تَحْتَ ….",
            },
            options: ["شَمْس", "شَمْعَة", "شَجَرَةٍ"],
            answer: "شَجَرَةٍ",
            evidence: 1,
          },
        ],
        grammar: {
          title: {
            ar: "اللام الشمسية والقمرية",
            de: "Sonnen- und Mondbuchstaben",
          },
          rule: {
            ar: "في الشَّمْس لام شمسية لا تُنطق، وفي الْقَمَر لام قمرية تُنطق.",
            de: "Bei aš-šams wird das l assimiliert; bei al-qamar wird es ausgesprochen.",
          },
          examples: ["الشَّمْس", "الْكِتَاب"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "اختر كلمة ذات لام شمسية.",
                de: "Wähle ein Wort mit Sonnenbuchstaben.",
              },
              options: ["الشَّمْس", "الْقَمَر", "الْبَيْت"],
              answer: "الشَّمْس",
            },
            {
              id: "g1",
              prompt: {
                ar: "اختر كلمة ذات لام قمرية.",
                de: "Wähle ein Wort mit Mondbuchstaben.",
              },
              options: ["الشَّجَرَة", "السَّاعَة", "الْكِتَاب"],
              answer: "الْكِتَاب",
            },
            {
              id: "g2",
              prompt: {
                ar: "هل تُنطق اللام في الشَّمْس؟",
                de: "Wird das l in aš-šams ausgesprochen?",
              },
              options: ["دَائِمًا", "لَا", "نَعَمْ"],
              answer: "لَا",
            },
            {
              id: "g3",
              prompt: {
                ar: "ما العلامة على الشين بعد اللام الشمسية؟",
                de: "Welches Zeichen trägt šīn nach dem Artikel?",
              },
              options: ["الشَّدَّة", "التَّنْوِين", "الْكَسْرَة فَقَط"],
              answer: "الشَّدَّة",
            },
          ],
        },
      },
      {
        id: "letter-14",
        char: "ص",
        contrast: "ض",
        vocabulary: [
          {
            ar: "صَابُون",
            de: "Seife",
            image: {
              file: "images/book-two/twemoji/1f9fc.svg",
            },
          },
          {
            ar: "صَارُوخ",
            de: "Rakete",
            image: {
              file: "images/book-two/twemoji/1f680.svg",
            },
          },
          {
            ar: "صَحْن",
            de: "Teller",
            image: {
              file: "images/book-two/twemoji/1f37d.svg",
            },
          },
        ],
        reading: [
          {
            ar: "يَغْسِلُ صَالِحٌ يَدَيْهِ بِالصَّابُونِ.",
            de: "Salih wäscht seine Hände mit Seife.",
          },
          {
            ar: "يَضَعُ الطَّعَامَ فِي الصَّحْنِ.",
            de: "Er legt das Essen auf den Teller.",
          },
          {
            ar: "ثُمَّ يَرْسُمُ صَارُوخًا.",
            de: "Dann zeichnet er eine Rakete.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: يَغْسِلُ صَالِحٌ يَدَيْهِ بِ….",
              de: "Ergänze aus dem Text: يَغْسِلُ صَالِحٌ يَدَيْهِ بِ….",
            },
            options: ["صَارُوخ", "صَحْن", "الصَّابُونِ"],
            answer: "الصَّابُونِ",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: ثُمَّ يَرْسُمُ ….",
              de: "Ergänze aus dem Text: ثُمَّ يَرْسُمُ ….",
            },
            options: ["صَارُوخ", "صَارُوخًا", "صَابُون"],
            answer: "صَارُوخًا",
            evidence: 2,
          },
        ],
        grammar: {
          title: {
            ar: "الجملة الاسمية",
            de: "Der Nominalsatz",
          },
          rule: {
            ar: "تبدأ الجملة الاسمية باسم أو ضمير، وتخبرنا عنه.",
            de: "Ein Nominalsatz beginnt mit einem Nomen oder Pronomen und sagt etwas darüber aus.",
          },
          examples: ["الصَّحْنُ نَظِيفٌ", "مُفِيدٌ"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "اختر جملة اسمية.",
                de: "Wähle einen Nominalsatz.",
              },
              options: [
                "يَغْسِلُ صَالِحٌ",
                "اِغْسِلْ يَدَيْكَ",
                "الصَّحْنُ نَظِيفٌ",
              ],
              answer: "الصَّحْنُ نَظِيفٌ",
            },
            {
              id: "g1",
              prompt: {
                ar: "أكمل: الصَّابُونُ…",
                de: "Ergänze: Die Seife ist …",
              },
              options: ["فِي", "مُفِيدٌ", "يَكْتُبُ"],
              answer: "مُفِيدٌ",
            },
            {
              id: "g2",
              prompt: {
                ar: "ما الكلمة التي تبدأ بها جملة الصَّارُوخُ سَرِيعٌ؟",
                de: "Mit welchem Wort beginnt der Satz?",
              },
              options: ["الصَّارُوخُ", "سَرِيعٌ", "يَطِيرُ"],
              answer: "الصَّارُوخُ",
            },
            {
              id: "g3",
              prompt: {
                ar: "اختر الجملة الصحيحة.",
                de: "Wähle den richtigen Satz.",
              },
              options: [
                "السَّيَّارَةُ جَدِيدٌ",
                "السَّيَّارَةُ جَدِيدَانِ",
                "السَّيَّارَةُ جَدِيدَةٌ",
              ],
              answer: "السَّيَّارَةُ جَدِيدَةٌ",
            },
          ],
        },
      },
      {
        id: "letter-15",
        char: "ض",
        contrast: "ص",
        vocabulary: [
          {
            ar: "ضِفْدَع",
            de: "Frosch",
            image: {
              file: "images/book-two/twemoji/1f438.svg",
            },
          },
          {
            ar: "ضِرْس",
            de: "Backenzahn",
            image: {
              file: "images/book-two/twemoji/1f9b7.svg",
            },
          },
          {
            ar: "ضَبَاب",
            de: "Nebel",
            image: {
              file: "images/book-two/twemoji/1f32b.svg",
            },
          },
        ],
        reading: [
          {
            ar: "يَقْفِزُ الضِّفْدَعُ قُرْبَ الْبِرْكَةِ.",
            de: "Der Frosch springt am Teich.",
          },
          {
            ar: "يَظْهَرُ الضَّبَابُ صَبَاحًا.",
            de: "Morgens erscheint Nebel.",
          },
          {
            ar: "تُنَظِّفُ ضُحَى أَضْرَاسَهَا.",
            de: "Duha putzt ihre Backenzähne.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: يَقْفِزُ الضِّفْدَعُ قُرْبَ ….",
              de: "Ergänze aus dem Text: يَقْفِزُ الضِّفْدَعُ قُرْبَ ….",
            },
            options: ["ضِرْس", "الْبِرْكَةِ", "ضِفْدَع"],
            answer: "الْبِرْكَةِ",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: يَظْهَرُ الضَّبَابُ ….",
              de: "Ergänze aus dem Text: يَظْهَرُ الضَّبَابُ ….",
            },
            options: ["صَبَاحًا", "ضِفْدَع", "ضِرْس"],
            answer: "صَبَاحًا",
            evidence: 1,
          },
        ],
        grammar: {
          title: {
            ar: "هو وهي مع المضارع",
            de: "Er und sie im Präsens",
          },
          rule: {
            ar: "نقول هو يكتب، وهي تكتب.",
            de: "Wir sagen huwa yaktubu und hiya taktubu.",
          },
          examples: ["يَكْتُبُ", "تُنَظِّفُ"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "أكمل: هُوَ … فِي الدَّفْتَرِ.",
                de: "Ergänze: Er schreibt ins Heft.",
              },
              options: ["أَكْتُبُ", "يَكْتُبُ", "تَكْتُبُ"],
              answer: "يَكْتُبُ",
            },
            {
              id: "g1",
              prompt: {
                ar: "أكمل: هِيَ … أَسْنَانَهَا.",
                de: "Ergänze: Sie putzt ihre Zähne.",
              },
              options: ["تُنَظِّفُ", "يُنَظِّفُ", "أُنَظِّفُ"],
              answer: "تُنَظِّفُ",
            },
            {
              id: "g2",
              prompt: {
                ar: "أكمل: أَنَا … كِتَابًا.",
                de: "Ergänze: Ich lese ein Buch.",
              },
              options: ["يَقْرَأُ", "تَقْرَئِينَ", "أَقْرَأُ"],
              answer: "أَقْرَأُ",
            },
            {
              id: "g3",
              prompt: {
                ar: "أكمل: الضِّفْدَعُ…",
                de: "Ergänze: Der Frosch springt.",
              },
              options: ["أَقْفِزُ", "يَقْفِزُ", "تَقْفِزُ"],
              answer: "يَقْفِزُ",
            },
          ],
        },
      },
      {
        id: "letter-16",
        char: "ط",
        contrast: "ظ",
        vocabulary: [
          {
            ar: "طَائِر",
            de: "Vogel",
            image: {
              file: "images/book-two/twemoji/1f426.svg",
            },
          },
          {
            ar: "طَائِرَة",
            de: "Flugzeug",
            image: {
              file: "images/book-two/twemoji/2708.svg",
            },
          },
          {
            ar: "طَبْل",
            de: "Trommel",
            image: {
              file: "images/book-two/twemoji/1f941.svg",
            },
          },
        ],
        reading: [
          {
            ar: "يَطِيرُ طَائِرٌ فَوْقَ الشَّجَرَةِ.",
            de: "Ein Vogel fliegt über den Baum.",
          },
          {
            ar: "تَمُرُّ طَائِرَةٌ فِي السَّمَاءِ.",
            de: "Ein Flugzeug fliegt am Himmel vorbei.",
          },
          {
            ar: "يَقْرَعُ طَارِقٌ الطَّبْلَ.",
            de: "Tariq schlägt die Trommel.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: يَطِيرُ طَائِرٌ فَوْقَ ….",
              de: "Ergänze aus dem Text: يَطِيرُ طَائِرٌ فَوْقَ ….",
            },
            options: ["الشَّجَرَةِ", "طَائِر", "طَائِرَة"],
            answer: "الشَّجَرَةِ",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: يَقْرَعُ طَارِقٌ ….",
              de: "Ergänze aus dem Text: يَقْرَعُ طَارِقٌ ….",
            },
            options: ["طَائِر", "طَائِرَة", "الطَّبْلَ"],
            answer: "الطَّبْلَ",
            evidence: 2,
          },
        ],
        grammar: {
          title: {
            ar: "صيغة الأمر",
            de: "Der Imperativ",
          },
          rule: {
            ar: "نستخدم الأمر لطلب عمل شيء، ونراعي المخاطب.",
            de: "Mit dem Imperativ bitten wir um eine Handlung und beachten die angesprochene Person.",
          },
          examples: ["اُكْتُبْ", "اِقْرَئِي"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "اطلب من ولد أن يكتب.",
                de: "Bitte einen Jungen zu schreiben.",
              },
              options: ["اُكْتُبْ", "يَكْتُبُ", "كَتَبَ"],
              answer: "اُكْتُبْ",
            },
            {
              id: "g1",
              prompt: {
                ar: "اطلب من بنت أن تقرأ.",
                de: "Bitte ein Mädchen zu lesen.",
              },
              options: ["اِقْرَأْ", "يَقْرَأُ", "اِقْرَئِي"],
              answer: "اِقْرَئِي",
            },
            {
              id: "g2",
              prompt: {
                ar: "اطلب من ولد أن يجلس.",
                de: "Bitte einen Jungen, sich zu setzen.",
              },
              options: ["يَجْلِسُ", "اِجْلِسْ", "جَلَسَ"],
              answer: "اِجْلِسْ",
            },
            {
              id: "g3",
              prompt: {
                ar: "اختر فعل الأمر.",
                de: "Wähle den Imperativ.",
              },
              options: ["اِفْتَحْ", "فَتَحَ", "يَفْتَحُ"],
              answer: "اِفْتَحْ",
            },
          ],
        },
      },
      {
        id: "letter-17",
        char: "ظ",
        contrast: "ط",
        vocabulary: [
          {
            ar: "ظَرْف",
            de: "Briefumschlag",
            image: {
              file: "images/book-two/twemoji/2709.svg",
            },
          },
          {
            ar: "ظِلّ",
            de: "Schatten",
            image: {
              sheet: 0,
            },
          },
          {
            ar: "ظُفْر",
            de: "Fingernagel",
            image: {
              sheet: 1,
            },
          },
        ],
        reading: [
          {
            ar: "تَضَعُ ظَبْيَةُ رِسَالَةً فِي ظَرْفٍ.",
            de: "Zabya steckt einen Brief in einen Umschlag.",
          },
          {
            ar: "ثُمَّ تَجْلِسُ فِي ظِلِّ شَجَرَةٍ.",
            de: "Dann sitzt sie im Schatten eines Baumes.",
          },
          {
            ar: "وَتَنْظُرُ إِلَى ظُفْرِهَا النَّظِيفِ.",
            de: "Und sie betrachtet ihren sauberen Fingernagel.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: تَضَعُ ظَبْيَةُ رِسَالَةً فِي ….",
              de: "Ergänze aus dem Text: تَضَعُ ظَبْيَةُ رِسَالَةً فِي ….",
            },
            options: ["ظِلّ", "ظُفْر", "ظَرْفٍ"],
            answer: "ظَرْفٍ",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: ثُمَّ تَجْلِسُ فِي ظِلِّ ….",
              de: "Ergänze aus dem Text: ثُمَّ تَجْلِسُ فِي ظِلِّ ….",
            },
            options: ["ظِلّ", "شَجَرَةٍ", "ظَرْف"],
            answer: "شَجَرَةٍ",
            evidence: 1,
          },
        ],
        grammar: {
          title: {
            ar: "ظروف المكان",
            de: "Ortsangaben",
          },
          rule: {
            ar: "فوق وتحت وأمام وخلف كلمات توضّح المكان.",
            de: "Über, unter, vor und hinter geben den Ort an.",
          },
          examples: ["فَوْقَ", "تَحْتَ"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "الطائر أعلى الشجرة: الطَّائِرُ … الشَّجَرَةِ.",
                de: "Der Vogel ist über dem Baum.",
              },
              options: ["تَحْتَ", "خَلْفَ", "فَوْقَ"],
              answer: "فَوْقَ",
            },
            {
              id: "g1",
              prompt: {
                ar: "القلم أسفل الكتاب: الْقَلَمُ … الْكِتَابِ.",
                de: "Der Stift liegt unter dem Buch.",
              },
              options: ["أَمَامَ", "تَحْتَ", "فَوْقَ"],
              answer: "تَحْتَ",
            },
            {
              id: "g2",
              prompt: {
                ar: "ما عكس أَمَامَ؟",
                de: "Was ist das Gegenteil von vor?",
              },
              options: ["خَلْفَ", "فَوْقَ", "هُنَا"],
              answer: "خَلْفَ",
            },
            {
              id: "g3",
              prompt: {
                ar: "ما عكس فَوْقَ؟",
                de: "Was ist das Gegenteil von über?",
              },
              options: ["أَمَامَ", "خَلْفَ", "تَحْتَ"],
              answer: "تَحْتَ",
            },
          ],
        },
      },
      {
        id: "letter-18",
        char: "ع",
        contrast: "غ",
        vocabulary: [
          {
            ar: "عِنَب",
            de: "Trauben",
            image: {
              file: "images/book-two/twemoji/1f347.svg",
            },
          },
          {
            ar: "عَسَل",
            de: "Honig",
            image: {
              file: "images/book-two/twemoji/1f36f.svg",
            },
          },
          {
            ar: "عَيْن",
            de: "Auge",
            image: {
              file: "images/book-two/twemoji/1f441.svg",
            },
          },
        ],
        reading: [
          {
            ar: "يَأْكُلُ عُمَرُ عِنَبًا.",
            de: "Omar isst Trauben.",
          },
          {
            ar: "وَيَضَعُ الْعَسَلَ عَلَى الْخُبْزِ.",
            de: "Und er streicht Honig auf das Brot.",
          },
          {
            ar: "يَغْسِلُ وَجْهَهُ وَيَحْمِي عَيْنَيْهِ.",
            de: "Er wäscht sein Gesicht und schützt seine Augen.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: يَأْكُلُ عُمَرُ ….",
              de: "Ergänze aus dem Text: يَأْكُلُ عُمَرُ ….",
            },
            options: ["عَسَل", "عِنَبًا", "عِنَب"],
            answer: "عِنَبًا",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: وَيَضَعُ الْعَسَلَ عَلَى ….",
              de: "Ergänze aus dem Text: وَيَضَعُ الْعَسَلَ عَلَى ….",
            },
            options: ["الْخُبْزِ", "عِنَب", "عَسَل"],
            answer: "الْخُبْزِ",
            evidence: 1,
          },
        ],
        grammar: {
          title: {
            ar: "حرف العطف الواو",
            de: "Das Bindewort und",
          },
          rule: {
            ar: "تربط الواو بين كلمتين أو جملتين، ولا تدل وحدها على ترتيب زمني.",
            de: "Wa verbindet Wörter oder Sätze, legt aber allein keine zeitliche Reihenfolge fest.",
          },
          examples: ["وَ", "وَ"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "أكمل: عِنَبٌ … عَسَلٌ.",
                de: "Ergänze: Trauben und Honig.",
              },
              options: ["مِنْ", "وَ", "فِي"],
              answer: "وَ",
            },
            {
              id: "g1",
              prompt: {
                ar: "اختر حرف العطف.",
                de: "Wähle das Bindewort.",
              },
              options: ["وَ", "عَلَى", "إِلَى"],
              answer: "وَ",
            },
            {
              id: "g2",
              prompt: {
                ar: "اربط: عُمَرُ، عَلِيٌّ.",
                de: "Verbinde Omar und Ali.",
              },
              options: [
                "عُمَرُ فِي عَلِيٍّ",
                "عُمَرُ مِنْ عَلِيٍّ",
                "عُمَرُ وَعَلِيٌّ",
              ],
              answer: "عُمَرُ وَعَلِيٌّ",
            },
            {
              id: "g3",
              prompt: {
                ar: "ماذا تربط الواو في قَلَمٌ وَكِتَابٌ؟",
                de: "Was verbindet wa in Stift und Buch?",
              },
              options: ["فِعْلَيْ أَمْرٍ", "اسْمَيْنِ", "حَرْفَيْ جَرٍّ"],
              answer: "اسْمَيْنِ",
            },
          ],
        },
      },
      {
        id: "letter-19",
        char: "غ",
        contrast: "ع",
        vocabulary: [
          {
            ar: "غُرَاب",
            de: "Krähe",
            image: {
              sheet: 2,
            },
          },
          {
            ar: "غِيتَار",
            de: "Gitarre",
            image: {
              file: "images/book-two/twemoji/1f3b8.svg",
            },
          },
          {
            ar: "غُصْن",
            de: "Ast",
            image: {
              sheet: 3,
            },
          },
        ],
        reading: [
          {
            ar: "يَقِفُ غُرَابٌ عَلَى غُصْنٍ.",
            de: "Eine Krähe sitzt auf einem Ast.",
          },
          {
            ar: "تَرَاهُ غَادَةُ مِنَ النَّافِذَةِ.",
            de: "Ghada sieht sie vom Fenster aus.",
          },
          {
            ar: "ثُمَّ تَعْزِفُ عَلَى الْغِيتَارِ.",
            de: "Dann spielt sie Gitarre.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: يَقِفُ غُرَابٌ عَلَى ….",
              de: "Ergänze aus dem Text: يَقِفُ غُرَابٌ عَلَى ….",
            },
            options: ["غُصْنٍ", "غُرَاب", "غِيتَار"],
            answer: "غُصْنٍ",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: تَرَاهُ غَادَةُ مِنَ ….",
              de: "Ergänze aus dem Text: تَرَاهُ غَادَةُ مِنَ ….",
            },
            options: ["غُرَاب", "غِيتَار", "النَّافِذَةِ"],
            answer: "النَّافِذَةِ",
            evidence: 1,
          },
        ],
        grammar: {
          title: {
            ar: "هنا وهناك",
            de: "Hier und dort",
          },
          rule: {
            ar: "هنا للمكان القريب، وهناك للمكان البعيد.",
            de: "Hunā bezeichnet einen nahen, hunāka einen ferneren Ort.",
          },
          examples: ["هُنَا", "هُنَاكَ"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "الكتاب بجانبي: الْكِتَابُ…",
                de: "Das Buch liegt direkt neben mir.",
              },
              options: ["هُنَا", "هُنَاكَ", "مَتَى"],
              answer: "هُنَا",
            },
            {
              id: "g1",
              prompt: {
                ar: "الغراب بعيد عني: الْغُرَابُ…",
                de: "Die Krähe ist weit von mir entfernt.",
              },
              options: ["هُنَا", "أَنَا", "هُنَاكَ"],
              answer: "هُنَاكَ",
            },
            {
              id: "g2",
              prompt: {
                ar: "ما الكلمة التي تدل على مكان قريب؟",
                de: "Welches Wort bezeichnet einen nahen Ort?",
              },
              options: ["غَدًا", "هُنَا", "هُوَ"],
              answer: "هُنَا",
            },
            {
              id: "g3",
              prompt: {
                ar: "اختر سؤالًا نجيب عنه بكلمة هُنَاكَ.",
                de: "Welche Frage kann man mit dort beantworten?",
              },
              options: ["أَيْنَ الْغُصْنُ؟", "مَنْ أَنْتَ؟", "كَمْ عُمْرُكَ؟"],
              answer: "أَيْنَ الْغُصْنُ؟",
            },
          ],
        },
      },
      {
        id: "letter-20",
        char: "ف",
        contrast: "ق",
        vocabulary: [
          {
            ar: "فِيل",
            de: "Elefant",
            image: {
              file: "images/book-two/twemoji/1f418.svg",
            },
          },
          {
            ar: "فَرَاشَة",
            de: "Schmetterling",
            image: {
              file: "images/book-two/twemoji/1f98b.svg",
            },
          },
          {
            ar: "فُرْشَاة",
            de: "Pinsel",
            image: {
              file: "images/book-two/twemoji/1f58c.svg",
            },
          },
        ],
        reading: [
          {
            ar: "يَرْسُمُ فَادِي فِيلًا كَبِيرًا.",
            de: "Fadi zeichnet einen großen Elefanten.",
          },
          {
            ar: "وَيَرْسُمُ فَرَاشَةً صَغِيرَةً.",
            de: "Und er zeichnet einen kleinen Schmetterling.",
          },
          {
            ar: "يُلَوِّنُ الرَّسْمَ بِفُرْشَاةٍ.",
            de: "Er malt das Bild mit einem Pinsel aus.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: يَرْسُمُ فَادِي … كَبِيرًا.",
              de: "Ergänze aus dem Text: يَرْسُمُ فَادِي … كَبِيرًا.",
            },
            options: ["فِيل", "فَرَاشَة", "فِيلًا"],
            answer: "فِيلًا",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: يُلَوِّنُ الرَّسْمَ بِ….",
              de: "Ergänze aus dem Text: يُلَوِّنُ الرَّسْمَ بِ….",
            },
            options: ["فَرَاشَة", "فُرْشَاةٍ", "فِيل"],
            answer: "فُرْشَاةٍ",
            evidence: 2,
          },
        ],
        grammar: {
          title: {
            ar: "الجملة الفعلية",
            de: "Der Verbalsatz",
          },
          rule: {
            ar: "تبدأ الجملة الفعلية بفعل، ثم نعرف من قام به.",
            de: "Ein Verbalsatz beginnt mit einem Verb; danach erfahren wir, wer handelt.",
          },
          examples: ["يَرْسُمُ فَادِي فِيلًا", "يَطِيرُ"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "اختر جملة فعلية.",
                de: "Wähle einen Verbalsatz.",
              },
              options: [
                "الْفِيلُ كَبِيرٌ",
                "هَذَا قَلَمٌ",
                "يَرْسُمُ فَادِي فِيلًا",
              ],
              answer: "يَرْسُمُ فَادِي فِيلًا",
            },
            {
              id: "g1",
              prompt: {
                ar: "ما الفعل في يَطِيرُ الطَّائِرُ؟",
                de: "Welches Wort ist das Verb?",
              },
              options: ["الْفِيلُ", "يَطِيرُ", "الطَّائِرُ"],
              answer: "يَطِيرُ",
            },
            {
              id: "g2",
              prompt: {
                ar: "من يرسم في يَرْسُمُ فَادِي فِيلًا؟",
                de: "Wer zeichnet im Satz?",
              },
              options: ["فَادِي", "فِيلًا", "يَرْسُمُ"],
              answer: "فَادِي",
            },
            {
              id: "g3",
              prompt: {
                ar: "أكمل بفعل: … الْفَرَاشَةُ.",
                de: "Ergänze ein Verb: Der Schmetterling …",
              },
              options: ["جَمِيلَةٌ", "هَذِهِ", "تَطِيرُ"],
              answer: "تَطِيرُ",
            },
          ],
        },
      },
      {
        id: "letter-21",
        char: "ق",
        contrast: "ف",
        vocabulary: [
          {
            ar: "قَمَر",
            de: "Mond",
            image: {
              file: "images/book-two/twemoji/1f319.svg",
            },
          },
          {
            ar: "قَلَم",
            de: "Stift",
            image: {
              file: "images/book-two/twemoji/1f58a.svg",
            },
          },
          {
            ar: "قِطّ",
            de: "Katze",
            image: {
              file: "images/book-two/twemoji/1f408.svg",
            },
          },
        ],
        reading: [
          {
            ar: "يَظْهَرُ الْقَمَرُ فِي اللَّيْلِ.",
            de: "Der Mond erscheint in der Nacht.",
          },
          {
            ar: "يَجْلِسُ قَاسِمٌ وَمَعَهُ قَلَمٌ.",
            de: "Qasim sitzt mit einem Stift da.",
          },
          {
            ar: "يَرْسُمُ قِطًّا أَبْيَضَ.",
            de: "Er zeichnet eine weiße Katze.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: يَظْهَرُ الْقَمَرُ فِي ….",
              de: "Ergänze aus dem Text: يَظْهَرُ الْقَمَرُ فِي ….",
            },
            options: ["قَلَم", "اللَّيْلِ", "قَمَر"],
            answer: "اللَّيْلِ",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: يَرْسُمُ … أَبْيَضَ.",
              de: "Ergänze aus dem Text: يَرْسُمُ … أَبْيَضَ.",
            },
            options: ["قِطًّا", "قَمَر", "قَلَم"],
            answer: "قِطًّا",
            evidence: 2,
          },
        ],
        grammar: {
          title: {
            ar: "هل ونعم",
            de: "Ja-Nein-Fragen",
          },
          rule: {
            ar: "نسأل بهل، ويمكن أن نجيب بنعم وجملة مناسبة.",
            de: "Wir stellen mit hal eine Ja-Nein-Frage und können mit naʿam antworten.",
          },
          examples: ["نَعَمْ، أَقْرَأُ", "هَلْ"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "أجب بالإثبات: هَلْ تَقْرَأُ؟",
                de: "Antworte bejahend: Liest du?",
              },
              options: [
                "أَيْنَ الْكِتَابُ؟",
                "نَعَمْ، أَقْرَأُ",
                "لَا أَقْرَأُ",
              ],
              answer: "نَعَمْ، أَقْرَأُ",
            },
            {
              id: "g1",
              prompt: {
                ar: "أكمل أداة السؤال: … هَذَا قَلَمٌ؟",
                de: "Ergänze: Ist das ein Stift?",
              },
              options: ["هَلْ", "فِي", "عَلَى"],
              answer: "هَلْ",
            },
            {
              id: "g2",
              prompt: {
                ar: "أجب بالإثبات: هَلْ تَكْتُبُ؟",
                de: "Antworte bejahend: Schreibst du?",
              },
              options: ["لَا أَكْتُبُ", "اُكْتُبْ", "نَعَمْ، أَكْتُبُ"],
              answer: "نَعَمْ، أَكْتُبُ",
            },
            {
              id: "g3",
              prompt: {
                ar: "اختر جوابًا مثبتًا.",
                de: "Wähle eine bejahende Antwort.",
              },
              options: ["أَيْنَ", "نَعَمْ", "لَا"],
              answer: "نَعَمْ",
            },
          ],
        },
      },
      {
        id: "letter-22",
        char: "ك",
        contrast: "ل",
        vocabulary: [
          {
            ar: "كِتَاب",
            de: "Buch",
            image: {
              file: "images/book-two/twemoji/1f4d8.svg",
            },
          },
          {
            ar: "كُرَة",
            de: "Ball",
            image: {
              file: "images/book-two/twemoji/26bd.svg",
            },
          },
          {
            ar: "كَلْب",
            de: "Hund",
            image: {
              file: "images/book-two/twemoji/1f415.svg",
            },
          },
        ],
        reading: [
          {
            ar: "يَقْرَأُ كَمَالٌ كِتَابًا.",
            de: "Kamal liest ein Buch.",
          },
          {
            ar: "بَعْدَ الْقِرَاءَةِ يَلْعَبُ بِالْكُرَةِ.",
            de: "Nach dem Lesen spielt er mit dem Ball.",
          },
          {
            ar: "وَيَجْرِي كَلْبُهُ فِي الْحَدِيقَةِ.",
            de: "Und sein Hund läuft im Park.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: يَقْرَأُ كَمَالٌ ….",
              de: "Ergänze aus dem Text: يَقْرَأُ كَمَالٌ ….",
            },
            options: ["كِتَابًا", "كِتَاب", "كُرَة"],
            answer: "كِتَابًا",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: وَيَجْرِي كَلْبُهُ فِي ….",
              de: "Ergänze aus dem Text: وَيَجْرِي كَلْبُهُ فِي ….",
            },
            options: ["كِتَاب", "كُرَة", "الْحَدِيقَةِ"],
            answer: "الْحَدِيقَةِ",
            evidence: 2,
          },
        ],
        grammar: {
          title: {
            ar: "ياء المتكلم",
            de: "Mein mit -ī",
          },
          rule: {
            ar: "نضيف ياء المتكلم إلى الاسم لنعبر عن ملكيته: كتابي.",
            de: "Mit angehängtem -ī drücken wir mein aus: kitābī.",
          },
          examples: ["كِتَابِي", "قَلَمِي"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "كِتَابٌ يخصني: هذا…",
                de: "Ein Buch gehört mir: Das ist mein …",
              },
              options: ["كِتَابِي", "كِتَابُهُ", "كِتَابُهَا"],
              answer: "كِتَابِي",
            },
            {
              id: "g1",
              prompt: {
                ar: "قَلَمٌ يخصني: هذا…",
                de: "Ein Stift gehört mir: Das ist mein …",
              },
              options: ["قَلَمُهُ", "قَلَمُهَا", "قَلَمِي"],
              answer: "قَلَمِي",
            },
            {
              id: "g2",
              prompt: {
                ar: "بَيْتٌ يخصني: هذا…",
                de: "Ein Haus gehört mir: Das ist mein …",
              },
              options: ["بَيْتُهَا", "بَيْتِي", "بَيْتُهُ"],
              answer: "بَيْتِي",
            },
            {
              id: "g3",
              prompt: {
                ar: "كُرَةٌ تخصني: هذه…",
                de: "Ein Ball gehört mir: Das ist mein …",
              },
              options: ["كُرَتِي", "كُرَتُهُ", "كُرَتُهَا"],
              answer: "كُرَتِي",
            },
          ],
        },
      },
      {
        id: "letter-23",
        char: "ل",
        contrast: "ك",
        vocabulary: [
          {
            ar: "لَيْمُون",
            de: "Zitronen",
            image: {
              file: "images/book-two/twemoji/1f34b.svg",
            },
          },
          {
            ar: "لِسَان",
            de: "Zunge",
            image: {
              file: "images/book-two/twemoji/1f445.svg",
            },
          },
          {
            ar: "لَوْز",
            de: "Mandeln",
            image: {
              sheet: 4,
            },
          },
        ],
        reading: [
          {
            ar: "عِنْدَ لَيْلَى لَيْمُونٌ وَلَوْزٌ.",
            de: "Layla hat Zitronen und Mandeln.",
          },
          {
            ar: "تَأْكُلُ لَيْلَى اللَّوْزَ.",
            de: "Layla isst die Mandeln.",
          },
          {
            ar: "تَقُولُ لَيْلَى: لَا أُكْثِرُ مِنَ الْحَلْوَى.",
            de: "Layla sagt: Ich esse nicht zu viele Süßigkeiten.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: عِنْدَ لَيْلَى لَيْمُونٌ وَ….",
              de: "Ergänze aus dem Text: عِنْدَ لَيْلَى لَيْمُونٌ وَ….",
            },
            options: ["لَيْمُون", "لِسَان", "لَوْزٌ"],
            answer: "لَوْزٌ",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: تَأْكُلُ لَيْلَى ….",
              de: "Ergänze aus dem Text: تَأْكُلُ لَيْلَى ….",
            },
            options: ["لِسَان", "اللَّوْزَ", "لَيْمُون"],
            answer: "اللَّوْزَ",
            evidence: 1,
          },
        ],
        grammar: {
          title: {
            ar: "لا النافية",
            de: "Verneinen mit lā",
          },
          rule: {
            ar: "لا النافية تخبرنا أن الفعل لا يحدث. نقول: لا أَلْعَبُ. وهي مختلفة عن لا الناهية التي تطلب ترك الفعل.",
            de: "Verneinendes lā sagt, dass etwas nicht geschieht: lā alʿabu. Es unterscheidet sich vom verbietenden lā.",
          },
          examples: ["لَا أَشْرَبُ الْقَهْوَةَ", "لَا أَلْعَبُ فِي الشَّارِعِ"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "أجب بلا عن نفسك: هَلْ تَشْرَبُ الْقَهْوَةَ؟",
                de: "Antworte mit lā über dich: Trinkst du Kaffee?",
              },
              options: [
                "نَعَمْ، أَشْرَبُ الْقَهْوَةَ",
                "لَا يَشْرَبُ الْقَهْوَةَ",
                "لَا أَشْرَبُ الْقَهْوَةَ",
              ],
              answer: "لَا أَشْرَبُ الْقَهْوَةَ",
            },
            {
              id: "g1",
              prompt: {
                ar: "أجب بلا عن نفسك: هَلْ تَلْعَبُ فِي الشَّارِعِ؟",
                de: "Antworte mit lā über dich: Spielst du auf der Straße?",
              },
              options: [
                "لَا يَلْعَبُ فِي الشَّارِعِ",
                "لَا أَلْعَبُ فِي الشَّارِعِ",
                "نَعَمْ، أَلْعَبُ",
              ],
              answer: "لَا أَلْعَبُ فِي الشَّارِعِ",
            },
            {
              id: "g2",
              prompt: {
                ar: "أجب بلا عن نفسك: هَلْ تَقْطِفُ الْأَزْهَارَ؟",
                de: "Antworte mit lā über dich: Pflückst du die Blumen?",
              },
              options: [
                "لَا أَقْطِفُ الْأَزْهَارَ",
                "أَقْطِفُ الْأَزْهَارَ",
                "لَا يَقْطِفُ الْأَزْهَارَ",
              ],
              answer: "لَا أَقْطِفُ الْأَزْهَارَ",
            },
            {
              id: "g3",
              prompt: {
                ar: "أجب بلا عن نفسك: هَلْ تُكْثِرُ مِنَ الْحَلْوَى؟",
                de: "Antworte mit lā über dich: Isst du zu viele Süßigkeiten?",
              },
              options: [
                "نَعَمْ، أُكْثِرُ",
                "لَا يُكْثِرُ مِنَ الْحَلْوَى",
                "لَا أُكْثِرُ مِنَ الْحَلْوَى",
              ],
              answer: "لَا أُكْثِرُ مِنَ الْحَلْوَى",
            },
          ],
        },
      },
      {
        id: "letter-24",
        char: "م",
        contrast: "ن",
        vocabulary: [
          {
            ar: "مَوْز",
            de: "Bananen",
            image: {
              file: "images/book-two/twemoji/1f34c.svg",
            },
          },
          {
            ar: "مِفْتَاح",
            de: "Schlüssel",
            image: {
              file: "images/book-two/twemoji/1f511.svg",
            },
          },
          {
            ar: "مِظَلَّة",
            de: "Regenschirm",
            image: {
              file: "images/book-two/twemoji/2602.svg",
            },
          },
        ],
        reading: [
          {
            ar: "تَحْمِلُ مَرْيَمُ مِظَلَّةً.",
            de: "Maryam trägt einen Regenschirm.",
          },
          {
            ar: "تَفْتَحُ الْبَابَ بِالْمِفْتَاحِ.",
            de: "Sie öffnet die Tür mit dem Schlüssel.",
          },
          {
            ar: "ثُمَّ تَأْكُلُ مَوْزَةً.",
            de: "Dann isst sie eine Banane.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: تَحْمِلُ مَرْيَمُ ….",
              de: "Ergänze aus dem Text: تَحْمِلُ مَرْيَمُ ….",
            },
            options: ["مِفْتَاح", "مِظَلَّةً", "مَوْز"],
            answer: "مِظَلَّةً",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: تَفْتَحُ الْبَابَ بِ….",
              de: "Ergänze aus dem Text: تَفْتَحُ الْبَابَ بِ….",
            },
            options: ["الْمِفْتَاحِ", "مَوْز", "مِظَلَّة"],
            answer: "الْمِفْتَاحِ",
            evidence: 1,
          },
        ],
        grammar: {
          title: {
            ar: "المبتدأ والخبر",
            de: "Subjekt und Prädikat",
          },
          rule: {
            ar: "في مَرْيَمُ مُجْتَهِدَةٌ المبتدأ مريم والخبر مجتهدة.",
            de: "In Maryam ist fleißig ist Maryam das Subjekt und fleißig das Prädikat.",
          },
          examples: ["الْمِفْتَاحُ", "لَذِيذٌ"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "ما المبتدأ في الْمِفْتَاحُ صَغِيرٌ؟",
                de: "Was ist das Subjekt im Satz Der Schlüssel ist klein?",
              },
              options: ["يَفْتَحُ", "الْمِفْتَاحُ", "صَغِيرٌ"],
              answer: "الْمِفْتَاحُ",
            },
            {
              id: "g1",
              prompt: {
                ar: "ما الخبر في الْمَوْزُ لَذِيذٌ؟",
                de: "Was ist das Prädikat im Satz Bananen sind lecker?",
              },
              options: ["لَذِيذٌ", "الْمَوْزُ", "يَأْكُلُ"],
              answer: "لَذِيذٌ",
            },
            {
              id: "g2",
              prompt: {
                ar: "أكمل الخبر: الْمِظَلَّةُ…",
                de: "Ergänze das Prädikat: Der Regenschirm ist …",
              },
              options: ["جَدِيدٌ", "جَدِيدَانِ", "جَدِيدَةٌ"],
              answer: "جَدِيدَةٌ",
            },
            {
              id: "g3",
              prompt: {
                ar: "اختر جملة ذات مبتدأ وخبر.",
                de: "Wähle einen einfachen Nominalsatz.",
              },
              options: [
                "يَأْكُلُ الْوَلَدُ",
                "مَرْيَمُ مُجْتَهِدَةٌ",
                "اِقْرَأْ",
              ],
              answer: "مَرْيَمُ مُجْتَهِدَةٌ",
            },
          ],
        },
      },
      {
        id: "letter-25",
        char: "ن",
        contrast: "ب",
        vocabulary: [
          {
            ar: "نَجْمَة",
            de: "Stern",
            image: {
              file: "images/book-two/twemoji/2b50.svg",
            },
          },
          {
            ar: "نَحْلَة",
            de: "Biene",
            image: {
              file: "images/book-two/twemoji/1f41d.svg",
            },
          },
          {
            ar: "نَمْلَة",
            de: "Ameise",
            image: {
              file: "images/book-two/twemoji/1f41c.svg",
            },
          },
        ],
        reading: [
          {
            ar: "تَرَى نُورُ نَحْلَةً عَلَى زَهْرَةٍ.",
            de: "Nur sieht eine Biene auf einer Blume.",
          },
          {
            ar: "وَتَرَى نَمْلَةً عَلَى الْأَرْضِ.",
            de: "Und sie sieht eine Ameise auf dem Boden.",
          },
          {
            ar: "وَفِي اللَّيْلِ تَرْسُمُ نَجْمَةً.",
            de: "In der Nacht zeichnet sie einen Stern.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: تَرَى نُورُ نَحْلَةً عَلَى ….",
              de: "Ergänze aus dem Text: تَرَى نُورُ نَحْلَةً عَلَى ….",
            },
            options: ["زَهْرَةٍ", "نَجْمَة", "نَحْلَة"],
            answer: "زَهْرَةٍ",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: وَفِي اللَّيْلِ تَرْسُمُ ….",
              de: "Ergänze aus dem Text: وَفِي اللَّيْلِ تَرْسُمُ ….",
            },
            options: ["نَحْلَة", "نَمْلَة", "نَجْمَةً"],
            answer: "نَجْمَةً",
            evidence: 2,
          },
        ],
        grammar: {
          title: {
            ar: "نحن وهم",
            de: "Wir und sie",
          },
          rule: {
            ar: "نحن لجماعة المتكلمين، وهم لجماعة الغائبين المذكرين أو المختلطة.",
            de: "Naḥnu heißt wir; hum bezeichnet eine männliche oder gemischte Gruppe anderer Personen.",
          },
          examples: ["نَحْنُ", "هُمْ"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "نتحدث عن مجموعتنا: … نَقْرَأُ.",
                de: "Über unsere Gruppe: … lesen.",
              },
              options: ["نَحْنُ", "هُمْ", "أَنَا"],
              answer: "نَحْنُ",
            },
            {
              id: "g1",
              prompt: {
                ar: "أتحدث عن مجموعة أولاد: … يَلْعَبُونَ.",
                de: "Über eine Gruppe Jungen: … spielen.",
              },
              options: ["نَحْنُ", "هِيَ", "هُمْ"],
              answer: "هُمْ",
            },
            {
              id: "g2",
              prompt: {
                ar: "أكمل: نَحْنُ…",
                de: "Ergänze: Wir schreiben.",
              },
              options: ["أَكْتُبُ", "نَكْتُبُ", "يَكْتُبُونَ"],
              answer: "نَكْتُبُ",
            },
            {
              id: "g3",
              prompt: {
                ar: "أكمل: هُمْ…",
                de: "Ergänze: Sie lesen.",
              },
              options: ["يَقْرَؤُونَ", "نَقْرَأُ", "تَقْرَأُ"],
              answer: "يَقْرَؤُونَ",
            },
          ],
        },
      },
      {
        id: "letter-26",
        char: "ه",
        contrast: "ح",
        vocabulary: [
          {
            ar: "هِلَال",
            de: "Mondsichel",
            image: {
              file: "images/book-two/twemoji/1f319.svg",
            },
          },
          {
            ar: "هَدِيَّة",
            de: "Geschenk",
            image: {
              file: "images/book-two/twemoji/1f381.svg",
            },
          },
          {
            ar: "هَاتِف",
            de: "Telefon",
            image: {
              file: "images/book-two/twemoji/260e.svg",
            },
          },
        ],
        reading: [
          {
            ar: "تَحْمِلُ هُدَى هَدِيَّةً.",
            de: "Huda trägt ein Geschenk.",
          },
          {
            ar: "تَتَّصِلُ بِجَدَّتِهَا بِالْهَاتِفِ.",
            de: "Sie ruft ihre Großmutter an.",
          },
          {
            ar: "وَتَرَى الْهِلَالَ فِي السَّمَاءِ.",
            de: "Und sie sieht die Mondsichel am Himmel.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: تَحْمِلُ هُدَى ….",
              de: "Ergänze aus dem Text: تَحْمِلُ هُدَى ….",
            },
            options: ["هِلَال", "هَاتِف", "هَدِيَّةً"],
            answer: "هَدِيَّةً",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: تَتَّصِلُ بِجَدَّتِهَا بِ….",
              de: "Ergänze aus dem Text: تَتَّصِلُ بِجَدَّتِهَا بِ….",
            },
            options: ["هَدِيَّة", "الْهَاتِفِ", "هِلَال"],
            answer: "الْهَاتِفِ",
            evidence: 1,
          },
        ],
        grammar: {
          title: {
            ar: "هؤلاء",
            de: "Diese Personen",
          },
          rule: {
            ar: "نستخدم هؤلاء للإشارة إلى جمع العقلاء، مذكرين أو مؤنثات.",
            de: "Hāʾulāʾi verweist auf mehrere Personen beider Geschlechter.",
          },
          examples: ["هَؤُلَاءِ", "هَؤُلَاءِ"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "أكمل: … طُلَّابٌ.",
                de: "Ergänze: Dies sind Schüler.",
              },
              options: ["هَذَا", "هَذِهِ", "هَؤُلَاءِ"],
              answer: "هَؤُلَاءِ",
            },
            {
              id: "g1",
              prompt: {
                ar: "أكمل: … مُعَلِّمَاتٌ.",
                de: "Ergänze: Dies sind Lehrerinnen.",
              },
              options: ["ذَلِكَ", "هَؤُلَاءِ", "هَذَا"],
              answer: "هَؤُلَاءِ",
            },
            {
              id: "g2",
              prompt: {
                ar: "اختر جملة صحيحة عن ولد واحد.",
                de: "Wähle einen Satz über einen Jungen.",
              },
              options: ["هَذَا طَالِبٌ", "هَؤُلَاءِ طَالِبٌ", "هَذِهِ طَالِبٌ"],
              answer: "هَذَا طَالِبٌ",
            },
            {
              id: "g3",
              prompt: {
                ar: "اختر جملة صحيحة عن بنت واحدة.",
                de: "Wähle einen Satz über ein Mädchen.",
              },
              options: [
                "هَؤُلَاءِ طَالِبَةٌ",
                "هَذَا طَالِبَةٌ",
                "هَذِهِ طَالِبَةٌ",
              ],
              answer: "هَذِهِ طَالِبَةٌ",
            },
          ],
        },
      },
      {
        id: "letter-27",
        char: "و",
        contrast: "ر",
        vocabulary: [
          {
            ar: "وَرْدَة",
            de: "Rose",
            image: {
              file: "images/book-two/twemoji/1f339.svg",
            },
          },
          {
            ar: "وَجْه",
            de: "Gesicht",
            image: {
              file: "images/book-two/twemoji/1f642.svg",
            },
          },
          {
            ar: "وَرَقَة",
            de: "Blatt",
            image: {
              file: "images/book-two/twemoji/1f343.svg",
            },
          },
        ],
        reading: [
          {
            ar: "يَغْسِلُ وَائِلٌ وَجْهَهُ.",
            de: "Wail wäscht sein Gesicht.",
          },
          {
            ar: "ثُمَّ يَسْقِي وَرْدَةً.",
            de: "Dann gießt er eine Rose.",
          },
          {
            ar: "وَيَرَى وَرَقَةَ شَجَرٍ عَلَى الْأَرْضِ.",
            de: "Und er sieht ein Baumblatt auf dem Boden.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: يَغْسِلُ وَائِلٌ ….",
              de: "Ergänze aus dem Text: يَغْسِلُ وَائِلٌ ….",
            },
            options: ["وَجْه", "وَجْهَهُ", "وَرْدَة"],
            answer: "وَجْهَهُ",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: ثُمَّ يَسْقِي ….",
              de: "Ergänze aus dem Text: ثُمَّ يَسْقِي ….",
            },
            options: ["وَرْدَةً", "وَجْه", "وَرَقَة"],
            answer: "وَرْدَةً",
            evidence: 1,
          },
        ],
        grammar: {
          title: {
            ar: "الواو وثم",
            de: "Und und dann",
          },
          rule: {
            ar: "الواو للجمع، وثم للترتيب مع مهلة.",
            de: "Wa verbindet; ṯumma bedeutet danach mit einem zeitlichen Abstand.",
          },
          examples: ["وَ", "ثُمَّ"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "اربط اسمين: وَرْدَةٌ … وَرَقَةٌ.",
                de: "Verbinde zwei Nomen: Rose und Blatt.",
              },
              options: ["إِلَى", "وَ", "فِي"],
              answer: "وَ",
            },
            {
              id: "g1",
              prompt: {
                ar: "أكمل بالترتيب مع مهلة: أَدْرُسُ … أَلْعَبُ.",
                de: "Ergänze: Ich lerne und spiele danach.",
              },
              options: ["ثُمَّ", "مِنْ", "عَلَى"],
              answer: "ثُمَّ",
            },
            {
              id: "g2",
              prompt: {
                ar: "اختر حرف عطف.",
                de: "Wähle ein Bindewort.",
              },
              options: ["تَحْتَ", "فَوْقَ", "ثُمَّ"],
              answer: "ثُمَّ",
            },
            {
              id: "g3",
              prompt: {
                ar: "هل الواو وحدها تفرض ترتيبًا زمنيًا؟",
                de: "Legt wa allein eine zeitliche Reihenfolge fest?",
              },
              options: ["دَائِمًا", "لَا", "نَعَمْ"],
              answer: "لَا",
            },
          ],
        },
      },
      {
        id: "letter-28",
        char: "ي",
        contrast: "ن",
        vocabulary: [
          {
            ar: "يَد",
            de: "Hand",
            image: {
              file: "images/book-two/twemoji/270b.svg",
            },
          },
          {
            ar: "يَمَامَة",
            de: "Taube",
            image: {
              file: "images/book-two/twemoji/1f54a.svg",
            },
          },
          {
            ar: "يَقْطِين",
            de: "Kürbis",
            image: {
              sheet: 5,
            },
          },
        ],
        reading: [
          {
            ar: "يَغْسِلُ يَاسِرٌ يَدَيْهِ.",
            de: "Yasir wäscht seine Hände.",
          },
          {
            ar: "يَأْكُلُ حَسَاءَ الْيَقْطِينِ.",
            de: "Er isst Kürbissuppe.",
          },
          {
            ar: "ثُمَّ يَرَى يَمَامَةً بَيْضَاءَ.",
            de: "Dann sieht er eine weiße Taube.",
          },
        ],
        comprehension: [
          {
            id: "r0",
            prompt: {
              ar: "أكمل من النص: يَغْسِلُ يَاسِرٌ ….",
              de: "Ergänze aus dem Text: يَغْسِلُ يَاسِرٌ ….",
            },
            options: ["يَدَيْهِ", "يَد", "يَمَامَة"],
            answer: "يَدَيْهِ",
            evidence: 0,
          },
          {
            id: "r1",
            prompt: {
              ar: "أكمل من النص: ثُمَّ يَرَى … بَيْضَاءَ.",
              de: "Ergänze aus dem Text: ثُمَّ يَرَى … بَيْضَاءَ.",
            },
            options: ["يَد", "يَقْطِين", "يَمَامَةً"],
            answer: "يَمَامَةً",
            evidence: 2,
          },
        ],
        grammar: {
          title: {
            ar: "الماضي والمضارع",
            de: "Vergangenheit und Gegenwart",
          },
          rule: {
            ar: "الماضي يدل على حدث وقع، والمضارع على حدث يحدث أو سيحدث.",
            de: "Vergangenheit beschreibt Geschehenes; Präsens beschreibt Gegenwart oder Zukunft.",
          },
          examples: ["كَتَبَ", "يَكْتُبُ"],
          questions: [
            {
              id: "g0",
              prompt: {
                ar: "أكمل: أَمْسِ … يَاسِرٌ.",
                de: "Ergänze: Gestern schrieb Yasir.",
              },
              options: ["كَتَبَ", "يَكْتُبُ", "اُكْتُبْ"],
              answer: "كَتَبَ",
            },
            {
              id: "g1",
              prompt: {
                ar: "أكمل: الْآنَ … يَاسِرٌ.",
                de: "Ergänze: Jetzt schreibt Yasir.",
              },
              options: ["كَتَبَ", "اُكْتُبْ", "يَكْتُبُ"],
              answer: "يَكْتُبُ",
            },
            {
              id: "g2",
              prompt: {
                ar: "اختر فعلًا ماضيًا.",
                de: "Wähle ein Verb in der Vergangenheit.",
              },
              options: ["اِلْعَبْ", "لَعِبَ", "يَلْعَبُ"],
              answer: "لَعِبَ",
            },
            {
              id: "g3",
              prompt: {
                ar: "اختر فعلًا مضارعًا.",
                de: "Wähle ein Verb im Präsens.",
              },
              options: ["يَغْسِلُ", "غَسَلَ", "اِغْسِلْ"],
              answer: "يَغْسِلُ",
            },
          ],
        },
      },
    ],
    audio: {
      أَسَد: "audio/book-two/001.mp3",
      أَرْنَب: "audio/book-two/002.mp3",
      أَنَانَاس: "audio/book-two/003.mp3",
      "هَذَا أَسَدٌ.": "audio/book-two/004.mp3",
      "وَهَذَا أَرْنَبٌ صَغِيرٌ.": "audio/book-two/005.mp3",
      "يَأْكُلُ الْأَرْنَبُ الْعُشْبَ.": "audio/book-two/006.mp3",
      بَيْت: "audio/book-two/007.mp3",
      بَطَّة: "audio/book-two/008.mp3",
      بَصَل: "audio/book-two/009.mp3",
      "قُرْبَ الْبَيْتِ بَطَّةٌ.": "audio/book-two/010.mp3",
      "تَسْبَحُ الْبَطَّةُ فِي الْمَاءِ.": "audio/book-two/011.mp3",
      "وَفِي الْمَطْبَخِ بَصَلٌ.": "audio/book-two/012.mp3",
      تُفَّاح: "audio/book-two/013.mp3",
      تَاج: "audio/practice/005.mp3",
      تِمْسَاح: "audio/book-two/014.mp3",
      "تَحْمِلُ تَمَارَا تُفَّاحَةً.": "audio/book-two/015.mp3",
      "وَتَرْسُمُ تَاجًا فِي الدَّفْتَرِ.": "audio/book-two/016.mp3",
      "ثُمَّ تَرْسُمُ تِمْسَاحًا.": "audio/book-two/017.mp3",
      ثَعْلَب: "audio/book-two/018.mp3",
      ثَلْج: "audio/book-two/019.mp3",
      ثُوم: "audio/book-two/020.mp3",
      "يَعِيشُ الثَّعْلَبُ فِي الْغَابَةِ.": "audio/book-two/021.mp3",
      "يَنْزِلُ الثَّلْجُ فِي الشِّتَاءِ.": "audio/book-two/022.mp3",
      "نَضَعُ الثُّومَ فِي الطَّعَامِ.": "audio/book-two/023.mp3",
      جَمَل: "audio/letters/05-word.mp3",
      جَزَر: "audio/book-two/024.mp3",
      جَبَل: "audio/book-two/025.mp3",
      "جَمَالٌ يَرْسُمُ جَمَلًا.": "audio/book-two/026.mp3",
      "يَرْسُمُ جَبَلًا خَلْفَ الْجَمَلِ.": "audio/book-two/027.mp3",
      "ثُمَّ يَأْكُلُ جَزَرَةً.": "audio/book-two/028.mp3",
      حُوت: "audio/book-two/029.mp3",
      حِصَان: "audio/book-two/030.mp3",
      حَقِيبَة: "audio/book-two/031.mp3",
      "تَحْمِلُ حَنَانُ حَقِيبَةً.": "audio/book-two/032.mp3",
      "فِي الْحَقِيبَةِ صُورَةُ حُوتٍ.": "audio/book-two/033.mp3",
      "وَصُورَةُ حِصَانٍ.": "audio/book-two/034.mp3",
      خُبْز: "audio/practice/069.mp3",
      خِيَار: "audio/book-two/035.mp3",
      خَرُوف: "audio/book-two/036.mp3",
      "يَأْكُلُ خَالِدٌ خُبْزًا وَخِيَارًا.": "audio/book-two/037.mp3",
      "يَخْرُجُ خَالِدٌ إِلَى الْحَقْلِ.": "audio/book-two/038.mp3",
      "يَرَى خَرُوفًا صَغِيرًا.": "audio/book-two/039.mp3",
      دُبّ: "audio/practice/017.mp3",
      دَجَاجَة: "audio/book-two/040.mp3",
      دَرَّاجَة: "audio/book-two/041.mp3",
      "يَرْكَبُ دَاوُدُ دَرَّاجَةً.": "audio/book-two/042.mp3",
      "يَرَى دَجَاجَةً قُرْبَ الدَّارِ.": "audio/book-two/043.mp3",
      "وَيَقْرَأُ قِصَّةً عَنْ دُبٍّ.": "audio/book-two/044.mp3",
      ذُرَة: "audio/practice/021.mp3",
      ذِئْب: "audio/book-two/045.mp3",
      ذُبَابَة: "audio/book-two/046.mp3",
      "يَحْمِلُ ذِيَابٌ ذُرَةً.": "audio/book-two/047.mp3",
      "يَرَى ذُبَابَةً عَلَى النَّافِذَةِ.": "audio/book-two/048.mp3",
      "ثُمَّ يَرْسُمُ ذِئْبًا.": "audio/book-two/049.mp3",
      رُمَّان: "audio/letters/10-word.mp3",
      رِيشَة: "audio/book-two/050.mp3",
      رُوبُوت: "audio/book-two/051.mp3",
      "رَامِي يَأْكُلُ رُمَّانًا.": "audio/book-two/052.mp3",
      "يَجِدُ رِيشَةً عَلَى الْأَرْضِ.": "audio/book-two/053.mp3",
      "ثُمَّ يَلْعَبُ بِرُوبُوتٍ صَغِيرٍ.": "audio/book-two/054.mp3",
      زَرَافَة: "audio/book-two/055.mp3",
      زَهْرَة: "audio/book-two/056.mp3",
      زَيْتُون: "audio/book-two/057.mp3",
      "تَرْسُمُ زَيْنَبُ زَرَافَةً.": "audio/book-two/058.mp3",
      "تَضَعُ زَهْرَةً قُرْبَ الرَّسْمِ.": "audio/book-two/059.mp3",
      "وَتَأْكُلُ خُبْزًا وَزَيْتُونًا.": "audio/book-two/060.mp3",
      سَمَكَة: "audio/book-two/061.mp3",
      سَيَّارَة: "audio/book-two/062.mp3",
      سَاعَة: "audio/book-two/063.mp3",
      "يَنْظُرُ سَامِي إِلَى السَّاعَةِ.": "audio/book-two/064.mp3",
      "يَرْكَبُ السَّيَّارَةَ مَعَ أَبِيهِ.": "audio/book-two/065.mp3",
      "يَرَيَانِ سَمَكَةً فِي حَوْضٍ.": "audio/book-two/066.mp3",
      شَمْس: "audio/book-two/067.mp3",
      شَجَرَة: "audio/book-two/068.mp3",
      شَمْعَة: "audio/book-two/069.mp3",
      "تُشْرِقُ الشَّمْسُ صَبَاحًا.": "audio/book-two/070.mp3",
      "تَجْلِسُ شَذَى تَحْتَ شَجَرَةٍ.": "audio/book-two/071.mp3",
      "وَفِي الْبَيْتِ شَمْعَةٌ جَمِيلَةٌ.": "audio/book-two/072.mp3",
      صَابُون: "audio/book-two/073.mp3",
      صَارُوخ: "audio/book-two/074.mp3",
      صَحْن: "audio/book-two/075.mp3",
      "يَغْسِلُ صَالِحٌ يَدَيْهِ بِالصَّابُونِ.": "audio/book-two/076.mp3",
      "يَضَعُ الطَّعَامَ فِي الصَّحْنِ.": "audio/book-two/077.mp3",
      "ثُمَّ يَرْسُمُ صَارُوخًا.": "audio/book-two/078.mp3",
      ضِفْدَع: "audio/letters/15-word.mp3",
      ضِرْس: "audio/book-two/079.mp3",
      ضَبَاب: "audio/book-two/080.mp3",
      "يَقْفِزُ الضِّفْدَعُ قُرْبَ الْبِرْكَةِ.": "audio/book-two/081.mp3",
      "يَظْهَرُ الضَّبَابُ صَبَاحًا.": "audio/book-two/082.mp3",
      "تُنَظِّفُ ضُحَى أَضْرَاسَهَا.": "audio/book-two/083.mp3",
      طَائِر: "audio/practice/006.mp3",
      طَائِرَة: "audio/book-two/084.mp3",
      طَبْل: "audio/book-two/085.mp3",
      "يَطِيرُ طَائِرٌ فَوْقَ الشَّجَرَةِ.": "audio/book-two/086.mp3",
      "تَمُرُّ طَائِرَةٌ فِي السَّمَاءِ.": "audio/book-two/087.mp3",
      "يَقْرَعُ طَارِقٌ الطَّبْلَ.": "audio/book-two/088.mp3",
      ظَرْف: "audio/practice/022.mp3",
      ظِلّ: "audio/practice/024.mp3",
      ظُفْر: "audio/book-two/089.mp3",
      "تَضَعُ ظَبْيَةُ رِسَالَةً فِي ظَرْفٍ.": "audio/book-two/090.mp3",
      "ثُمَّ تَجْلِسُ فِي ظِلِّ شَجَرَةٍ.": "audio/book-two/091.mp3",
      "وَتَنْظُرُ إِلَى ظُفْرِهَا النَّظِيفِ.": "audio/book-two/092.mp3",
      عِنَب: "audio/practice/088.mp3",
      عَسَل: "audio/book-two/093.mp3",
      عَيْن: "audio/book-two/094.mp3",
      "يَأْكُلُ عُمَرُ عِنَبًا.": "audio/book-two/095.mp3",
      "وَيَضَعُ الْعَسَلَ عَلَى الْخُبْزِ.": "audio/book-two/096.mp3",
      "يَغْسِلُ وَجْهَهُ وَيَحْمِي عَيْنَيْهِ.": "audio/book-two/097.mp3",
      غُرَاب: "audio/book-two/098.mp3",
      غِيتَار: "audio/book-two/099.mp3",
      غُصْن: "audio/practice/100.mp3",
      "يَقِفُ غُرَابٌ عَلَى غُصْنٍ.": "audio/book-two/100.mp3",
      "تَرَاهُ غَادَةُ مِنَ النَّافِذَةِ.": "audio/book-two/101.mp3",
      "ثُمَّ تَعْزِفُ عَلَى الْغِيتَارِ.": "audio/book-two/102.mp3",
      فِيل: "audio/book-two/103.mp3",
      فَرَاشَة: "audio/book-two/104.mp3",
      فُرْشَاة: "audio/book-two/105.mp3",
      "يَرْسُمُ فَادِي فِيلًا كَبِيرًا.": "audio/book-two/106.mp3",
      "وَيَرْسُمُ فَرَاشَةً صَغِيرَةً.": "audio/book-two/107.mp3",
      "يُلَوِّنُ الرَّسْمَ بِفُرْشَاةٍ.": "audio/book-two/108.mp3",
      قَمَر: "audio/practice/035.mp3",
      قَلَم: "audio/book-two/109.mp3",
      قِطّ: "audio/book-two/110.mp3",
      "يَظْهَرُ الْقَمَرُ فِي اللَّيْلِ.": "audio/book-two/111.mp3",
      "يَجْلِسُ قَاسِمٌ وَمَعَهُ قَلَمٌ.": "audio/book-two/112.mp3",
      "يَرْسُمُ قِطًّا أَبْيَضَ.": "audio/book-two/113.mp3",
      كِتَاب: "audio/practice/036.mp3",
      كُرَة: "audio/practice/098.mp3",
      كَلْب: "audio/practice/032.mp3",
      "يَقْرَأُ كَمَالٌ كِتَابًا.": "audio/book-two/114.mp3",
      "بَعْدَ الْقِرَاءَةِ يَلْعَبُ بِالْكُرَةِ.": "audio/book-two/115.mp3",
      "وَيَجْرِي كَلْبُهُ فِي الْحَدِيقَةِ.": "audio/book-two/116.mp3",
      لَيْمُون: "audio/book-two/117.mp3",
      لِسَان: "audio/book-two/118.mp3",
      لَوْز: "audio/book-two/119.mp3",
      "عِنْدَ لَيْلَى لَيْمُونٌ وَلَوْزٌ.": "audio/book-two/120.mp3",
      "تَأْكُلُ لَيْلَى اللَّوْزَ.": "audio/book-two/121.mp3",
      "تَقُولُ لَيْلَى: لَا أُكْثِرُ مِنَ الْحَلْوَى.":
        "audio/book-two/122.mp3",
      مَوْز: "audio/book-two/123.mp3",
      مِفْتَاح: "audio/book-two/124.mp3",
      مِظَلَّة: "audio/book-two/125.mp3",
      "تَحْمِلُ مَرْيَمُ مِظَلَّةً.": "audio/book-two/126.mp3",
      "تَفْتَحُ الْبَابَ بِالْمِفْتَاحِ.": "audio/book-two/127.mp3",
      "ثُمَّ تَأْكُلُ مَوْزَةً.": "audio/book-two/128.mp3",
      نَجْمَة: "audio/book-two/129.mp3",
      نَحْلَة: "audio/book-two/130.mp3",
      نَمْلَة: "audio/book-two/131.mp3",
      "تَرَى نُورُ نَحْلَةً عَلَى زَهْرَةٍ.": "audio/book-two/132.mp3",
      "وَتَرَى نَمْلَةً عَلَى الْأَرْضِ.": "audio/book-two/133.mp3",
      "وَفِي اللَّيْلِ تَرْسُمُ نَجْمَةً.": "audio/book-two/134.mp3",
      هِلَال: "audio/practice/030.mp3",
      هَدِيَّة: "audio/book-two/135.mp3",
      هَاتِف: "audio/book-two/136.mp3",
      "تَحْمِلُ هُدَى هَدِيَّةً.": "audio/book-two/137.mp3",
      "تَتَّصِلُ بِجَدَّتِهَا بِالْهَاتِفِ.": "audio/book-two/138.mp3",
      "وَتَرَى الْهِلَالَ فِي السَّمَاءِ.": "audio/book-two/139.mp3",
      وَرْدَة: "audio/book-two/140.mp3",
      وَجْه: "audio/book-two/141.mp3",
      وَرَقَة: "audio/book-two/142.mp3",
      "يَغْسِلُ وَائِلٌ وَجْهَهُ.": "audio/book-two/143.mp3",
      "ثُمَّ يَسْقِي وَرْدَةً.": "audio/book-two/144.mp3",
      "وَيَرَى وَرَقَةَ شَجَرٍ عَلَى الْأَرْضِ.": "audio/book-two/145.mp3",
      يَد: "audio/book-two/146.mp3",
      يَمَامَة: "audio/book-two/147.mp3",
      يَقْطِين: "audio/book-two/148.mp3",
      "يَغْسِلُ يَاسِرٌ يَدَيْهِ.": "audio/book-two/149.mp3",
      "يَأْكُلُ حَسَاءَ الْيَقْطِينِ.": "audio/book-two/150.mp3",
      "ثُمَّ يَرَى يَمَامَةً بَيْضَاءَ.": "audio/book-two/151.mp3",
    },
  };
  const strip = (text) =>
    String(text)
      .normalize("NFKC")
      .replace(/[\u064B-\u065F\u0670\u0640]/g, "");
  data.normalizeAnswer = (text) =>
    strip(text)
      .replace(/[.,،؛:!؟?]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  data.letterAtStart = (word) => Array.from(strip(word))[0];
  data.isCorrectAnswer = (question, value) => {
    if (data.normalizeAnswer(value) !== data.normalizeAnswer(question.answer))
      return false;
    const collision = question.options.some(
      (option) =>
        option.normalize("NFC") !== question.answer.normalize("NFC") &&
        data.normalizeAnswer(option) === data.normalizeAnswer(question.answer),
    );
    if (collision && /[\u064B-\u065F]/.test(value))
      return value.trim().normalize("NFC") === question.answer.normalize("NFC");
    return true;
  };
  data.questions = function (lesson) {
    const other = data.lessons.find((l) => l.char === lesson.contrast);
    const images = lesson.vocabulary.map((word, i) => ({
      id: `p${i}`,
      kind: "picture",
      image: word.image,
      options: lesson.vocabulary.map((w) => w.ar),
      answer: word.ar,
    }));
    const spelling = lesson.vocabulary.map((word, i) => ({
      id: `s${i}`,
      kind: "spelling",
      word: word.ar,
      masked: word.ar.replace(lesson.char, "□"),
      answer: lesson.char,
      options: [lesson.char, lesson.contrast, "و"].filter(
        (x, j, a) => a.indexOf(x) === j,
      ),
    }));
    const classify = [...lesson.vocabulary, ...other.vocabulary].map(
      (word, i) => ({
        id: `c${i}`,
        kind: "classify",
        word: word.ar,
        answer: data.letterAtStart(word.ar),
        options: [lesson.char, lesson.contrast],
      }),
    );
    return [
      ...images,
      ...spelling,
      ...classify,
      ...lesson.comprehension.map((q) => ({ ...q, kind: "reading" })),
      ...lesson.grammar.questions.map((q) => ({ ...q, kind: "grammar" })),
    ];
  };
  if (typeof module !== "undefined" && module.exports) module.exports = data;
  else window.ArabicBookData = data;
})();
