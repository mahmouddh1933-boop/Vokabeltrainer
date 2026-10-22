(()=>{'use strict';
window.JisrStorage.ready(()=>{
 const vocab=VocabApp.getCurrentVocabList().filter(w=>/\p{Script=Arabic}/u.test(w[0]) && [...VocabApp.stripArabicDiacritics(w[0]).replace(/\s/g,'')].length>=2);
 const selected=VocabApp.selectFreshTestWords(vocab,'scramble');
 const area=document.getElementById('test-area');const submitButton=document.getElementById('submit-test');
 let seconds=VocabApp.getTestDuration(),timer=null,submitted=false;
 const timerEl=document.getElementById('timer');timerEl.textContent=`الوقت المتبقي: ${seconds} ثانية`;
 const entries=[];
  function displayAnswer(entry, placeholders=false){
   const picked=entry.chosen.map(id=>entry.shuffled[id].letter);let pos=0;
   return entry.slots.map(slot=>slot===' '?' ': (pos<picked.length?picked[pos++]: (pos++,placeholders?'＿':''))).join('');
  }

 for(const [i,word] of selected.entries()){
  // Keep individual graphemes together. Arabic presentation shaping is handled by the browser.
  const plain=VocabApp.stripArabicDiacritics(word[0]).replace(/\u0640/g,'').normalize('NFC');
  const normalized=plain.replace(/\s+/gu,' ').trim();
  const slots=Array.from(normalized);
  const chars=slots.filter(c=>c!==' ');
  // Spaces are fixed slots, not letters to select.
  const shuffled=VocabApp.shuffle(chars.map((letter,id)=>({letter,id})));
  if(chars.length>1 && shuffled.map(v=>v.letter).join('')===chars.join('')) shuffled.reverse();
  const entry={word,shuffled,chosen:[],chars,slots};entries.push(entry);
  const card=document.createElement('section');card.className='question';
  card.innerHTML=`<p><strong>${i+1}. المعنى بالألمانية:</strong> <span class="german-text">${VocabApp.escapeHTML(word[1])}</span></p><p class="scramble-hint">اضغط على الحروف بالترتيب الصحيح:</p><div class="scramble-answer" id="scramble-answer-${i}" aria-live="polite">…</div><div class="scramble-tiles" id="scramble-tiles-${i}"></div><div class="scramble-tools"><button type="button" class="secondary-button" data-undo="${i}">↶ تراجع</button><button type="button" class="secondary-button" data-reset="${i}">إعادة</button></div>`;
  area.append(card);
  function render(){const answer=card.querySelector('.scramble-answer');answer.textContent=displayAnswer(entry,true);const tiles=card.querySelector('.scramble-tiles');tiles.replaceChildren();shuffled.forEach((v,id)=>{const button=document.createElement('button');button.type='button';button.className='scramble-tile';button.textContent=v.letter;button.disabled=entry.chosen.includes(id);button.setAttribute('aria-label',`اختر الحرف ${v.letter}`);button.addEventListener('click',()=>{if(submitted)return;entry.chosen.push(id);render()});tiles.append(button)});}
  card.querySelector('[data-undo]').addEventListener('click',()=>{if(!submitted){entry.chosen.pop();render()}});
  card.querySelector('[data-reset]').addEventListener('click',()=>{if(!submitted){entry.chosen=[];render()}});
  render();
 }
 if(!entries.length){area.innerHTML='<p class="scramble-empty">لا توجد كلمات عربية مناسبة في القائمة الحالية. اختر قائمة مفردات أولاً.</p>';submitButton.disabled=true;}
 else timer=setInterval(()=>{seconds=Math.max(0,seconds-1);timerEl.textContent=`الوقت المتبقي: ${seconds} ثانية`;if(seconds===0)submit();},1000);
 function submit(){if(submitted||!entries.length)return;submitted=true;clearInterval(timer);
 const results=entries.map(e=>({question:e.word[1],correct:e.word[0],answer:e.chosen.length?displayAnswer(e):'لم تتم الإجابة',arabic:e.word[0],german:e.word[1],compareMode:'arabic'}));
 VocabApp.setJSON('testResults',results);VocabApp.recordTestResults(results,'scramble');window.location.href='./ergebnis.html';}
 submitButton.addEventListener('click',submit);
 document.getElementById('back-to-test').addEventListener('click',()=>{clearInterval(timer);location.href='./test.html'});
 document.getElementById('back-to-learn').addEventListener('click',()=>{clearInterval(timer);location.href='./lernseite.html'});
});})();