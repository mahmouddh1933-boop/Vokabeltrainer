(() => {
  "use strict";

  window.JisrStorage.ready(() => {
    const { $, choose, el, button, onLanguage, shuffle } = window.Practice;
    const { graphemes, nonJoining } = window.ArabicLetterExamples;
    const levels = [
      [
        "بَاب", "سَمَك", "وَرْد", "يَد", "قَمَر", "قَلَم", "جَبَل", "شَمْس",
        "أَب", "أَخ", "فَم", "دَار", "نَار", "نُور", "تِين", "تُوت",
        "زَيْت", "بَيْت", "يَوْم", "عَيْن", "لَيْل", "فِيل", "حُوت", "ضَوْء",
        "رَأْس", "مَوْز", "بَحْر", "نَهْر", "نَمْل", "نَجْم",
      ],
      [
        "كِتَاب", "قِطَار", "مَكْتَب", "جِدَار", "مَوْزَة", "حِزَام", "سَاعَة", "كُرْسِي",
        "مَطْبَخ", "مَسْجِد", "مَلْعَب", "مَسْرَح", "مَخْرَج", "مَدْخَل", "مَطْعَم",
        "حَدِيد", "خَشَبَة", "وَرَقَة", "زَهْرَة", "شَجَرَة", "ثَمَرَة", "سَمَكَة",
        "نَحْلَة", "نَخْلَة", "نَمْلَة", "لُعْبَة", "قَمِيص", "طَاوَة", "شُبَّاك",
        "جَرِيد", "حَلِيب", "عَصِير", "رَغِيف", "طَعَام", "سَرِير",
      ],
      [
        "مِفْتَاح", "زَيْتُون", "مَدْرَسَة", "مَكْتَبَة", "بُسْتَان", "نَافِذَة", "فَرَاشَة",
        "حَاسُوب", "سَيَّارَة", "طَائِرَة", "سَفِينَة", "حَافِلَة", "دَرَّاجَة", "مِمْحَاة",
        "مِسْطَرَة", "حَقِيبَة", "جَرِيدَة", "صَحِيفَة", "صُنْدُوق", "عُصْفُور",
        "مِصْبَاح", "مِكْنَسَة", "سِتَارَة", "ثَلَّاجَة", "غَسَّالَة", "مِلْعَقَة",
        "مَرْوَحَة", "بُرْتُقَال", "لَيْمُون", "رُمَّانَة", "فُسْتَان", "بِطَّانِيَّة",
        "إِجَاصَة", "حَدِيقَة", "مَزْرَعَة",
      ],
    ];
    const wordSelect = $("bridge-words");
    const levelButtons = [...$("bridge-levels").querySelectorAll("button")];
    let level = 0;
    let wordIndex = 0;
    let letters = [];
    let placed = 0;
    let wrongTile = false;

    function renderBridge() {
      const added = letters.slice(0, placed);
      $("bridge-word").textContent = added.join("") || letters.map(() => "·").join(" ");

      const groups = $("bridge-connections");
      groups.replaceChildren();
      added.forEach((letter, index) => {
        const group = groups.lastElementChild;
        if (!group || nonJoining.has(added[index - 1][0])) {
          groups.append(el("span", letter, "letter-bridge-group"));
        } else {
          group.textContent += letter;
        }
      });

      const complete = placed === letters.length;
      for (const tile of $("bridge-letters").children) tile.disabled = complete;
      $("bridge-undo").disabled = placed === 0;
      $("bridge-reset").disabled = placed === 0 && !wrongTile;
      $("bridge-next").disabled = !complete || (level === levels.length - 1 && wordIndex === levels[level].length - 1);

      let feedback = choose("ضع الحرف الأول على الجسر.", "Setze den ersten Buchstaben auf die Brücke.");
      if (wrongTile) {
        feedback = choose(`ابحث عن الحرف التالي «${letters[placed]}».`, `Suche den nächsten Buchstaben «${letters[placed]}».`);
      } else if (placed > 1) {
        const previous = added.at(-2)[0];
        const current = added.at(-1)[0];
        feedback = nonJoining.has(previous)
          ? choose(`«${previous}» لا يتصل بالحرف الذي يأتي بعده «${current}».`,
            `«${previous}» verbindet sich nicht mit dem folgenden «${current}».`)
          : choose(`اتصل «${previous}» بالحرف «${current}».`, `«${previous}» und «${current}» sind verbunden.`);
      } else if (placed === 1) {
        feedback = choose("الآن اختر الحرف التالي.", "Wähle jetzt den nächsten Buchstaben.");
      }
      if (complete) {
        feedback = choose(`أحسنت! كوّنت «${letters.join("")}». ${feedback}`, `Gut gemacht! Du hast «${letters.join("")}» zusammengesetzt. ${feedback}`);
      }
      $("bridge-feedback").textContent = feedback;
    }

    function resetBridge() {
      placed = 0;
      wrongTile = false;
      renderBridge();
    }

    function selectWord(index) {
      wordIndex = index;
      const words = levels[level];
      letters = graphemes(words[index]);
      const tiles = shuffle([...new Set(letters)]);
      levelButtons.forEach((control, i) => control.setAttribute("aria-pressed", String(i === level)));
      wordSelect.replaceChildren(...words.map((word, i) => {
        const option = el("option", `${i + 1} · ${word}`);
        option.value = String(i);
        return option;
      }));
      wordSelect.value = String(index);
      $("bridge-letters").replaceChildren(...tiles.map((tile) => button(tile, () => {
        wrongTile = tile !== letters[placed];
        if (!wrongTile) placed += 1;
        renderBridge();
        if (placed === letters.length) {
          const next = $("bridge-next");
          (next.disabled ? $("bridge-undo") : next).focus();
        }
      })));
      resetBridge();
    }

    wordSelect.onchange = () => selectWord(Number(wordSelect.value));
    levelButtons.forEach((control, i) => {
      control.onclick = () => {
        level = i;
        selectWord(0);
      };
    });
    $("bridge-undo").onclick = () => {
      placed -= 1;
      wrongTile = false;
      renderBridge();
      if (placed === 0) $("bridge-letters").firstElementChild.focus();
    };
    $("bridge-reset").onclick = () => {
      resetBridge();
      $("bridge-letters").firstElementChild.focus();
    };
    $("bridge-next").onclick = () => {
      if (wordIndex === levels[level].length - 1) {
        level += 1;
        selectWord(0);
      } else {
        selectWord(wordIndex + 1);
      }
      $("bridge-letters").firstElementChild.focus();
    };

    selectWord(0);
    onLanguage(renderBridge);
  });
})();
