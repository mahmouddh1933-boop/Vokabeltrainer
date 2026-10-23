(() => {
  "use strict";
  window.JisrStorage.ready(() => {
    const $ = id => document.getElementById(id);
    const t = item => item[window.AppLanguage?.get() === "de" ? "de" : "ar"];
    let index = Number(window.JisrStorage.session.getItem("lettersLastIndex")) || 0;
    function render() {
      const letter = window.ArabicLetterData.letters[index];
      const group = window.ArabicLetterRelated.groups[letter?.char];
      $("letter-related").hidden = !group;
      if (!group) return;
      $("letter-related-title").textContent = t(group.title);
      $("letter-related-intro").textContent = t(group.intro);
      $("letter-related-cards").replaceChildren(...group.cards.map(item => {
        const tile = document.createElement("article"); tile.className = "letter-related-card";
        const glyph = document.createElement("strong"); glyph.lang = "ar"; glyph.className = "related-glyph"; glyph.textContent = item.glyph;
        const word = document.createElement("p"); word.lang = "ar"; word.className = "related-word";
        const units = window.ArabicLetterExamples.graphemes(item.word);
        const target = units.findIndex(unit => unit.replace(/\p{M}/gu, "") === item.target);
        window.ArabicLetterExamples.highlight(word, item.word, target);
        const meaning = document.createElement("small"); meaning.lang = "de"; meaning.textContent = item.meaning;
        const note = document.createElement("p"); note.textContent = t(item.note);
        const listen = document.createElement("button"); listen.type = "button";
        listen.textContent = t({ar:"استمع للكلمة",de:"Wort anhören"});
        listen.addEventListener("click", () => window.lettersSpeak(item.word));
        tile.append(glyph,word,meaning,note,listen); return tile;
      }));
      const links = letter.char === "ت"
        ? [["ta-endings",{ar:"تدرّب على التاء المربوطة والمبسوطة",de:"Tā-Endungen üben"}]]
        : [["hamza-initial",{ar:"درس همزة القطع والوصل",de:"Qaṭʿ und Waṣl lernen"}],["alif-endings",{ar:"الألف القائمة والمقصورة",de:"ا und ى unterscheiden"}]];
      $("letter-related-links").replaceChildren(...links.map(([id,label]) => {
        const a = document.createElement("a"); a.href = `grammar.html#${id}`; a.textContent = t(label); return a;
      }));
    }
    window.addEventListener("letterchange", e => { index=e.detail.index; render(); });
    window.addEventListener("app-language-change", render);
    render();
  });
})();
