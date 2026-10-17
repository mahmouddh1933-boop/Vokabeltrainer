(function(){
"use strict";
const letters=[
["أ","الألف",1],["ب","الباء",0],["ت","التاء",0],["ث","الثاء",0],["ج","الجيم",0],["ح","الحاء",0],["خ","الخاء",0],
["د","الدال",1],["ذ","الذال",1],["ر","الراء",1],["ز","الزاي",1],["س","السين",0],["ش","الشين",0],["ص","الصاد",0],["ض","الضاد",0],["ط","الطاء",0],["ظ","الظاء",0],["ع","العين",0],["غ","الغين",0],["ف","الفاء",0],["ق","القاف",0],["ك","الكاف",0],["ل","اللام",0],["م","الميم",0],["ن","النون",0],["ه","الهاء",0],["و","الواو",1],["ي","الياء",0]
];
// Arabic shaping is performed by the browser; non-joining letters never connect to a subsequent letter.
let current=0;
const $=id=>document.getElementById(id);
const card=$("letter-card"), grid=$("letters-grid");
const saved=Number(sessionStorage.getItem("lettersLastIndex"));if(Number.isInteger(saved)&&saved>=0&&saved<letters.length)current=saved;
letters.forEach(([glyph,name],i)=>{const btn=document.createElement("button");btn.type="button";btn.textContent=glyph;btn.title=name;btn.setAttribute("aria-label",name);btn.addEventListener("click",()=>select(i));grid.appendChild(btn)});
function makeForm(label,value){const item=document.createElement("div");item.className="letters-form";const title=document.createElement("span");title.className="letters-form-label";title.textContent=label;const glyph=document.createElement("span");glyph.className="letters-form-glyph";glyph.textContent=value;glyph.setAttribute("lang","ar");item.append(title,glyph);return item;}
function render(){const [char,name,nonjoining]=letters[current];$("letter-counter").textContent=`${current+1} / ${letters.length}`;$("letter-name").textContent=name;$("letter-front-name").textContent=name;$("letter-big").textContent=char;$("letter-back-heading").textContent=(localStorage.getItem('vocabInterfaceLanguage')==='de'?`Schreibformen: ${name}`:`أشكال حرف ${name}`);
const forms=$("letter-forms");forms.replaceChildren();
// Explicit presentation forms preserve the intended standalone/initial/medial/final glyph even without neighboring Arabic letters.
const formsData={
"أ":["ﺃ","ﺃ","ﺄ","ﺃ","ﺄ"],"ب":["ﺏ","ﺑ","ﺒ","ﺏ","ﺐ"],"ت":["ﺕ","ﺗ","ﺘ","ﺕ","ﺖ"],"ث":["ﺙ","ﺛ","ﺜ","ﺙ","ﺚ"],"ج":["ﺝ","ﺟ","ﺠ","ﺝ","ﺞ"],"ح":["ﺡ","ﺣ","ﺤ","ﺡ","ﺢ"],"خ":["ﺥ","ﺧ","ﺨ","ﺥ","ﺦ"],"د":["ﺩ","ﺩ","ﺪ","ﺩ","ﺪ"],"ذ":["ﺫ","ﺫ","ﺬ","ﺫ","ﺬ"],"ر":["ﺭ","ﺭ","ﺮ","ﺭ","ﺮ"],"ز":["ﺯ","ﺯ","ﺰ","ﺯ","ﺰ"],"س":["ﺱ","ﺳ","ﺴ","ﺱ","ﺲ"],"ش":["ﺵ","ﺷ","ﺸ","ﺵ","ﺶ"],"ص":["ﺹ","ﺻ","ﺼ","ﺹ","ﺺ"],"ض":["ﺽ","ﺿ","ﻀ","ﺽ","ﺾ"],"ط":["ﻁ","ﻃ","ﻄ","ﻁ","ﻂ"],"ظ":["ﻅ","ﻇ","ﻈ","ﻅ","ﻆ"],"ع":["ﻉ","ﻋ","ﻌ","ﻉ","ﻊ"],"غ":["ﻍ","ﻏ","ﻐ","ﻍ","ﻎ"],"ف":["ﻑ","ﻓ","ﻔ","ﻑ","ﻒ"],"ق":["ﻕ","ﻗ","ﻘ","ﻕ","ﻖ"],"ك":["ﻙ","ﻛ","ﻜ","ﻙ","ﻚ"],"ل":["ﻝ","ﻟ","ﻠ","ﻝ","ﻞ"],"م":["ﻡ","ﻣ","ﻤ","ﻡ","ﻢ"],"ن":["ﻥ","ﻧ","ﻨ","ﻥ","ﻦ"],"ه":["ﻩ","ﻫ","ﻬ","ﻩ","ﻪ"],"و":["ﻭ","ﻭ","ﻮ","ﻭ","ﻮ"],"ي":["ﻱ","ﻳ","ﻴ","ﻱ","ﻲ"]};
const de=localStorage.getItem('vocabInterfaceLanguage')==='de';
const labels=de?["Am Wortanfang","In der Wortmitte","Am Wortende (getrennt)","Am Wortende (verbunden)"]:["في أول الكلمة","في وسط الكلمة","في آخر الكلمة منفصل","في آخر الكلمة متصل"];
// Four positional forms; keep Arabic glyph in a shaping-safe wrapper.
formsData[char].slice(1).forEach((value,i)=>forms.appendChild(makeForm(labels[i],value)));
$("letter-note").textContent=de?(nonjoining?"Dieser Buchstabe verbindet sich nicht mit dem folgenden Buchstaben.":"Die Verbindung hängt von der Position und den benachbarten Buchstaben ab."):(nonjoining?"هذا الحرف لا يتصل بالحرف الذي بعده؛ لذلك لا يوجد له شكل يتصل من الجهتين في وسط الكلمة.":"يتصل هذا الحرف بما قبله وما بعده بحسب موضعه والحروف المجاورة.");
[...grid.children].forEach((b,i)=>{b.classList.toggle("active",i===current);b.setAttribute("aria-current",i===current?"true":"false")});
card.classList.remove("flipped");card.setAttribute("aria-pressed","false");sessionStorage.setItem("lettersLastIndex",String(current));window.dispatchEvent(new CustomEvent("letterchange",{detail:{index:current}}));}
function select(i){current=(i+letters.length)%letters.length;render();}
card.addEventListener("click",()=>{const flipped=card.classList.toggle("flipped");card.setAttribute("aria-pressed",String(flipped))});
$("letter-previous").addEventListener("click",()=>select(current-1));$("letter-next").addEventListener("click",()=>select(current+1));
$("letter-speak").addEventListener("click",()=>window.lettersSpeak(letters[current][1]));
window.renderLetterFormsForLanguage=render;
render();
})();