(function(){
"use strict";
  const localStorage = window.JisrStorage.local;
document.addEventListener('DOMContentLoaded',()=>{
 const area=document.getElementById('test-area'), timerEl=document.getElementById('timer');
 const selected=VocabApp.selectFreshTestWords(VocabApp.getCurrentVocabList(),'connected'), entries=[];
 let timeLeft=VocabApp.getTestDuration(), timer=null, submitted=false;
 function assembled(entry, placeholder){return entry.units.map((u,i)=>u.hidden?(entry.inputs.get(i).input.value.trim()||placeholder)+u.marks:u.base+u.marks).join('');}
 function update(entry, recentlyFilled){
  // Filled letters must be real, adjacent text nodes in one Arabic line.
  // This lets the shaping engine connect them correctly (and break at ا د ذ ر ز و).
  entry.inputs.forEach((record, index)=>{
   const value=Array.from(record.input.value.trim())[0]||'';
   if(value && record.label.isConnected){
    const node=document.createTextNode(value+entry.units[index].marks);
    record.rendered=node;
    record.label.replaceWith(node);
   }else if(!value && record.rendered && record.rendered.isConnected){
    record.rendered.replaceWith(record.label);
    record.rendered=null;
   }else if(value && record.rendered){
    record.rendered.textContent=value+entry.units[index].marks;
   }
  });
  entry.undo.disabled=!entry.history.length;
  if(recentlyFilled){
   const next=Array.from(entry.inputs.values()).find(rec=>rec.label.isConnected && !rec.input.value.trim());
   if(next)next.input.focus();
  }
 }
 function undo(entry){
  while(entry.history.length){
   const last=entry.history.pop();const record=entry.inputs.get(last);
   if(!record || !record.input.value.trim())continue;
   record.input.value='';update(entry,false);record.input.focus();return;
  }
  update(entry,false);
 }
 selected.forEach((word,index)=>{
  const masked=maskWord(word[0]);
  const card=document.createElement('section');card.className='question';
  const heading=document.createElement('p');heading.innerHTML=`<strong>${index+1}. <span data-i18n="meaning">المعنى بالألمانية:</span></strong> <span class="german-text">${VocabApp.escapeHTML(word[1])}</span>`;
  const instructions=document.createElement('p');instructions.textContent='أكمل الحروف الناقصة:';
  const preview=document.createElement('div');preview.className='connected-word';preview.dir='rtl';preview.lang='ar';

  const entry={original:word[0],german:word[1],units:masked.units,preview,inputs:new Map(),history:[],undo:null};entries.push(entry);
  let missing=0;
  masked.units.forEach((unit,i)=>{
   if(!unit.hidden){preview.appendChild(document.createTextNode(unit.base+unit.marks));return;}
   missing++;
   const label=document.createElement('label');label.className='connected-inline-label';
   const input=document.createElement('input');input.type='text';input.className='letter-input';input.maxLength=2;input.autocomplete='off';input.setAttribute('aria-label',`الحرف الناقص ${missing}`);input.dir='rtl';
   input.placeholder='□';input.setAttribute('aria-label',`الحرف الناقص ${missing}`);
   const record={input,label,rendered:null};entry.inputs.set(i,record);
   input.addEventListener('input',()=>{
    const typed=Array.from(input.value.trim());
    input.value=typed[0]||'';
    if(input.value){entry.history.push(i);update(entry,true);}
    else update(entry,false);
   });
   label.append(input);preview.append(label);
  });
  const undoButton=document.createElement('button');undoButton.type='button';undoButton.className='secondary-button connected-undo';
  undoButton.textContent=(localStorage.getItem('vocabInterfaceLanguage')==='de'?'↶ Letzten Buchstaben zurücknehmen':'↶ التراجع عن آخر حرف');
  undoButton.addEventListener('click',()=>undo(entry));entry.undo=undoButton;
  card.append(heading,instructions,preview,undoButton);area.append(card);update(entry,false);
 });
 window.addEventListener('app-language-change',e=>{entries.forEach(entry=>{entry.undo.textContent=e.detail.lang==='de'?'↶ Letzten Buchstaben zurücknehmen':'↶ التراجع عن آخر حرف';});});
 timerEl.textContent=`الوقت المتبقي: ${timeLeft} ثانية`;
 function submit(){if(submitted||!entries.length)return;submitted=true;clearInterval(timer);
  const results=entries.map(e=>({question:e.german,correct:e.original,answer:assembled(e,'')||'لم تتم الإجابة',arabic:e.original,german:e.german,compareMode:'arabic'}));
  VocabApp.setJSON('testResults',results);VocabApp.recordTestResults(results,'connected');window.location.href='./ergebnis.html';
 }
 if(!entries.length){area.innerHTML='<p class="empty-message">لا توجد مفردات. اختر قائمة أو ارفع ملف Excel أولاً.</p>';document.getElementById('submit-test').disabled=true;}
 else timer=setInterval(()=>{timeLeft=Math.max(0,timeLeft-1);timerEl.textContent=`الوقت المتبقي: ${timeLeft} ثانية`;if(!timeLeft)submit();},1000);
 document.getElementById('submit-test').addEventListener('click',submit);
 document.getElementById('back-to-test').addEventListener('click',()=>{clearInterval(timer);location.href='./test.html'});
 document.getElementById('back-to-learn').addEventListener('click',()=>{clearInterval(timer);location.href='./lernseite.html'});
});
    function isArabicDiacritic(char) {
        return /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/u.test(char);
    }

    function isArabicLetter(char) {
        return /[\u0621-\u063A\u0641-\u064A\u066E-\u06D3\u06FA-\u06FC\u0750-\u077F\u08A0-\u08C9]/u.test(char);
    }

    function splitArabicUnits(word) {
        const units = [];
        Array.from(String(word || "").normalize("NFC")).forEach(char => {
            if (isArabicDiacritic(char)) {
                if (units.length) units[units.length - 1].marks += char;
                else units.push({ base: "", marks: char, isLetter: false, hidden: false });
                return;
            }
            units.push({ base: char, marks: "", isLetter: isArabicLetter(char), hidden: false });
        });
        return units;
    }

    function getMissingCount(letterCount) {
        if (letterCount < 4) return 1;
        if (letterCount <= 5) return 2;
        if (letterCount <= 7) return 3;
        if (letterCount <= 9) return 4;
        return 5;
    }

    function maskWord(word) {
        const units = splitArabicUnits(word);
        const letterIndices = units.map((unit, index) => ({ unit, index })).filter(item => item.unit.isLetter).map(item => item.index);
        const count = Math.min(getMissingCount(letterIndices.length), letterIndices.length);
        const chosen = VocabApp.shuffle(letterIndices).slice(0, count);
        chosen.forEach(index => { units[index].hidden = true; });
        return { units };
    }

}());
