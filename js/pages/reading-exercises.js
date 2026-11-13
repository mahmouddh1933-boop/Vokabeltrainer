/* Original Arabic reading workshop: meaning, pictures, colouring and production. */
(() => {
 'use strict';
 window.JisrStorage.ready(()=>{
  const D=window.ArabicReadingExercises,A=window.VocabApp,S=window.JisrStorage.local;
  const narrator=window.ReadingWorkshopAudio.create({speak:(...args)=>A.speakArabic(...args),stop:()=>A.stopSpeech()});
  const $=id=>document.getElementById(id),de=()=>window.AppLanguage?.get()==='de';
  const t=(ar,german)=>de()?german:ar;
  const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
  const button=(text,action,cls='rx-button')=>{const b=el('button',text,cls);b.type='button';b.addEventListener('click',action);return b;};
  const arabic=n=>{n.lang='ar';n.dir='rtl';return n;};
  let chapter=null,activity=null,palette='red',drawColor='black',search='',svgAbort=null;
  let previousQuiz=[];
  const active=()=>A.getStats().readingExercisesV1||{};
  const saved=id=>active()[id]||{answers:{},colors:{},order:[],criteria:{}};
  function write(id,patch){const stats=A.getStats();A.setJSON('learningStats',{...stats,readingExercisesV1:{...(stats.readingExercisesV1||{}),[id]:{...saved(id),...patch}}});}
  function draft(patch){write(activity.id,{...patch,checked:false});updateCounter();}
  const norm=text=>String(text).normalize('NFC').replace(/[\u064b-\u065f\u0670ـ]/g,'').toLowerCase();
  const done=a=>saved(a.id).completed===true||(a.type==='draw'?saved(a.id).reviewed===true:saved(a.id).checked&&result(a,saved(a.id)).correct===result(a,saved(a.id)).total);
  function enterActivity(){
   if(!activity)return;
   const completed=!!done(activity);
   write(activity.id,{answers:{},colors:{},order:[],criteria:{},checked:false,reviewed:false,completed});
   if(activity.type==='draw')S.removeItem('readingExercisesDrawingV1:'+activity.id);
  }
  function selfCheck(){
   const questions=window.ReadingSelfCheck.choose(D.activities,previousQuiz);previousQuiz=questions.map(q=>q.sourceKey);
   return {id:'meaning-self-check',chapter:'meaning',title:'اِخْتَبِرْ نَفْسَكَ',type:'quiz',selfCheck:true,questions};
  }
  function result(a,state){
   let correct=0,total=0;
   for(const [i,q] of (a.questions||[]).entries()){total++;if(state.answers?.['q'+i]===q.answer)correct++;}
   if(a.type==='color')for(const p of a.parts){total++;if((state.colors?.[p.id]||'white')===p.answer)correct++;}
   if(a.type==='story'){total+=a.frames.length;for(let i=0;i<a.frames.length;i++)if(state.order?.[i]===i)correct++;}
   return {correct,total};
  }
  function image(path,alt,cls='rx-scene'){const n=el('img',undefined,cls);n.src=path;n.alt=alt;n.width=600;n.height=340;n.loading='lazy';return n;}
  function heading(text){const n=el('h2',text);n.tabIndex=-1;return n;}
  function updateCounter(){
   const finished=D.activities.filter(done).length;
   $('rx-total-progress').textContent=t(`أكملت ${finished} من ${D.activities.length} نشاطًا.`,`${finished} / ${D.activities.length} Aufgaben abgeschlossen`);
   $('rx-total-bar').value=finished;$('rx-total-bar').max=D.activities.length;
  }
  const icons={book:'📖',eye:'🔎',palette:'🎨',compass:'↔',apple:'🍎',key:'🗝',story:'🌿',kite:'✎'};
  function route(){
   const parts=location.hash.slice(1).split('/');chapter=D.chapters.find(c=>c.id===parts[0])||null;
   activity=chapter?D.activities.find(a=>a.chapter===chapter.id&&a.id===parts[1])||null:null;
   if(chapter?.id==='meaning'&&parts[1]==='self-check')activity=selfCheck();
   enterActivity();
   svgAbort?.abort();narrator.stop();$('rx-audio-status').textContent='';render();
  }
  function go(hash){if(location.hash==='#'+hash)route();else location.hash=hash;}
  function card(title,description,action,detail,icon){
   const n=button('',action,'rx-card');if(icon)n.append(el('span',icons[icon]||'🌿','rx-card-icon'));
   n.append(el('h2',title),el('p',description),el('strong',detail,'rx-card-detail'));return n;
  }
  function render(){
   narrator.stop();$('rx-audio-status').textContent='';
   updateCounter();const host=$('rx-content');host.replaceChildren();$('rx-back').hidden=!chapter;
   $('rx-back').textContent=activity?t('← العودة إلى أنشطة الباب','← Zurück zum Kapitel'):t('← جميع الأبواب','← Alle Kapitel');
   $('rx-breadcrumb').textContent=chapter?chapter.title+(activity?' / '+activity.title:''):t('رحلة من الجملة إلى الحكاية','Vom Satz zur Geschichte');
   $('rx-print').textContent=t(activity?'طباعة هذا النشاط':chapter?'طباعة هذا الباب':'طباعة جميع الأنشطة',activity?'Aufgabe drucken':chapter?'Kapitel drucken':'Alle Aufgaben drucken');
   if(activity){renderActivity(host);return;}
   const grid=el('div',undefined,'rx-grid');
   if(!chapter){
    $('rx-subtitle').textContent=t('٦٤ نشاطًا أصيلًا بالعربية: اقرأ، اكتشف، لوّن، رتّب وارسم. ابدأ بجملة قصيرة وتقدّم إلى حكاية كاملة.','64 eigene Aufgaben auf Arabisch: lesen, entdecken, ausmalen, ordnen und zeichnen. Vom kurzen Satz zur kleinen Geschichte.');
    for(const c of D.chapters){const all=D.activities.filter(a=>a.chapter===c.id),n=all.filter(done).length;
     grid.append(card(de()?c.titleDe:c.title,de()?c.introDe:c.intro,()=>go(c.id),t(`المستوى ${c.level} · أكملت ${n} من ٨`,`Stufe ${c.level} · ${n} / 8 abgeschlossen`),c.icon));}
   }else{
    $('rx-subtitle').textContent=de()?chapter.introDe:chapter.intro;
    const label=el('label',t('ابحث عن نشاط داخل هذا الباب','Aufgabe in diesem Kapitel suchen'),'rx-search-label'),input=el('input');input.type='search';input.value=search;input.placeholder=t('ابحث بعنوان النشاط…','Aufgabentitel suchen…');label.append(input);host.append(label);
    const fill=()=>{grid.replaceChildren();let shown=0;for(const a of D.activities.filter(a=>a.chapter===chapter.id&&norm(a.title).includes(norm(search)))){
     shown++;grid.append(card(a.title,taskInstruction(a),()=>go(chapter.id+'/'+a.id),done(a)?t('✓ أكملت هذا النشاط','✓ Abgeschlossen'):t('اقرأ وجرّب ←','Lesen und ausprobieren ←')));}
     if(chapter.id==='meaning'&&(!search||norm('اختبر نفسك').includes(norm(search)))){shown++;grid.append(card(t('اختبر نفسك','Teste dich selbst'),t('٥ أسئلة عشوائية من أنشطة هذا الباب. أعد الاختبار لتحصل على أسئلة مختلفة.','5 zufällige Fragen aus diesem Kapitel. Wiederhole den Test mit anderen Fragen.'),()=>go('meaning/self-check'),t('ابدأ جولة جديدة ←','Neue Runde starten ←'),'book'));}
     if(!shown)grid.append(el('p',t('لا توجد أنشطة تطابق البحث.','Keine passenden Aufgaben.')));};
    input.addEventListener('input',()=>{search=input.value;fill();});fill();
   }
   host.append(grid);
  }
  function taskInstruction(a){return a.type==='color'?t('اقرأ التعليمات ثم اختر اللون والمساحة المناسبة.','Lies die Anweisungen und wähle Farbe und Fläche.'):a.type==='story'?t('رتّب الصور والجمل ثم أجب عن الأسئلة.','Bilder und Sätze ordnen, dann Fragen beantworten.'):a.type==='draw'?t('حوّل الكلمات إلى رسم وراجعه بمعايير واضحة.','Verwandle Wörter in ein Bild und prüfe es anhand der Kriterien.'):a.image?t('تأمّل الصورة واقرأ كل سؤال حتى النهاية.','Betrachte das Bild und lies jede Frage vollständig.'):t('اقرأ ثم اختر الإجابة التي تناسب المعنى.','Lies und wähle die Antwort, die zum Sinn passt.');}
  function renderActivity(host){
   const a=activity,section=el('section',undefined,'rx-activity');section.dataset.activity=a.id;
   const h=heading(a.title);section.append(h,el('p',taskInstruction(a),'rx-instruction'));$('rx-subtitle').textContent=de()?chapter.introDe:chapter.intro;
   section.append(el('p',t('كل دخول إلى النشاط يبدأ بإجابات فارغة؛ تبقى علامة إنجازك السابقة محفوظة.','Bei jedem Einstieg beginnst du ohne Antworten. Dein bisheriger Abschluss bleibt erhalten.'),'rx-help'));
   if(a.type==='color')renderColor(a,section);
   else if(a.type==='draw')renderDrawing(a,section);
   else if(a.type==='story')renderStory(a,section);
   else if(a.image)section.append(image(a.image,a.imageAlt));
   if(a.questions?.length)renderQuestions(a,section);
   const feedback=el('div',undefined,'rx-feedback');feedback.id='rx-feedback';feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');section.append(feedback);
   const actions=el('div',undefined,'rx-actions');
   if(a.type!=='draw')actions.append(button(t('تحقّق من إجاباتي','Antworten prüfen'),()=>check(a),'rx-button rx-primary'));
   actions.append(button(t('استمع للنص','Text anhören'),()=>{
    narrator.play(a,(message,error)=>{$('rx-audio-status').textContent=message;$('rx-audio-status').classList.toggle('is-error',error);});
   }),button(t('إيقاف الصوت','Audio stoppen'),()=>{narrator.stop();$('rx-audio-status').textContent='';}));
   section.append(actions);host.append(section);
   if(saved(a.id).checked)showFeedback(a);
   const nav=el('nav',undefined,'rx-actions');nav.setAttribute('aria-label',t('التنقل بين الأنشطة','Aufgaben-Navigation'));
   const all=D.activities.filter(x=>x.chapter===chapter.id),index=all.findIndex(x=>x.id===a.id);
   if(a.selfCheck){
    nav.append(button(t('العودة إلى مفاتيح الكلمات','Zurück zum Kapitel'),()=>go('meaning')),button(t('إعادة الاختبار بأسئلة مختلفة','Mit anderen Fragen wiederholen'),()=>{activity=selfCheck();enterActivity();render();},'rx-button rx-primary'));host.append(nav);return;
   }
   const prev=button(t('النشاط السابق','Vorherige Aufgabe'),()=>go(chapter.id+'/'+all[index-1].id)),next=button(t('النشاط التالي','Nächste Aufgabe'),()=>go(chapter.id+'/'+all[index+1].id));prev.disabled=index===0;next.disabled=index===all.length-1;
   nav.append(prev,button(t('أنشطة هذا الباب','Alle Kapitelaufgaben'),()=>go(chapter.id)),next);host.append(nav);
  }
  function renderQuestions(a,section){
   const state=saved(a.id),quiz=el('div',undefined,'rx-questions');
   for(const [i,q] of a.questions.entries()){
    const field=el('fieldset',undefined,'rx-question');field.dataset.question=i;field.append(arabic(el('legend',`${i+1}. ${q.prompt}`)));
    const options=el('div',undefined,'rx-options');
    for(const [j,text] of q.options.entries()){
     const label=el('label',undefined,'rx-option'),radio=el('input');radio.type='radio';radio.name=a.id+'-q'+i;radio.value=j;radio.checked=state.answers?.['q'+i]===j;
     radio.addEventListener('change',()=>{draft({answers:{...(saved(a.id).answers||{}),['q'+i]:j}});clearFeedback();});label.append(radio,arabic(el('span',text)));options.append(label);
    }
    field.append(options);quiz.append(field);
   }
   section.append(quiz);
  }
  function clearFeedback(){const n=$('rx-feedback');if(n)n.replaceChildren();document.querySelectorAll('.rx-correct,.rx-wrong').forEach(n=>n.classList.remove('rx-correct','rx-wrong'));}
  function check(a){
   const state=saved(a.id),unanswered=(a.questions||[]).some((q,i)=>!Number.isInteger(state.answers?.['q'+i]));
   if(unanswered||(a.type==='story'&&(state.order||[]).length!==a.frames.length)){
    $('rx-feedback').textContent=t('أكمل الإجابات وترتيب الأحداث أولًا. خذ وقتك واقرأ بهدوء.','Ergänze zuerst alle Antworten und die Reihenfolge. Lies in Ruhe.');return;
   }
   const score=result(a,state);write(a.id,{checked:true,completed:saved(a.id).completed||score.correct===score.total});showFeedback(a);updateCounter();
  }
  function showFeedback(a){
   const state=saved(a.id),r=result(a,state),box=$('rx-feedback');box.replaceChildren();
   const perfect=r.correct===r.total;
   box.append(el('h3',perfect?t('بارك الله بك! قراءة دقيقة وعمل ممتاز.','Sehr gut! Du hast genau gelesen.'):t('محاولة طيبة! راجع الدليل وجرّب مرة أخرى.','Guter Versuch! Prüfe die Hinweise und versuche es erneut.')),
    el('p',t(`${r.correct} من ${r.total} إجابات صحيحة.`,`${r.correct} von ${r.total} Antworten richtig.`)));
   for(const [i,q] of (a.questions||[]).entries()){
    const field=document.querySelector('[data-question="'+i+'"]'),ok=state.answers?.['q'+i]===q.answer;field?.classList.add(ok?'rx-correct':'rx-wrong');
    if(!ok)box.append(arabic(el('p',`${i+1}. ${q.options[q.answer]} — ${q.explanation}`)));
   }
   if(a.type==='color')for(const p of a.parts){const ok=(state.colors?.[p.id]||'white')===p.answer;document.querySelector('[data-color-label="'+p.id+'"]')?.classList.add(ok?'rx-correct':'rx-wrong');if(!ok)box.append(arabic(el('p',p.label+': '+LABELS[p.answer])));}
   if(a.type==='story'&&!state.order.every((v,i)=>v===i)){
    box.append(el('h3',t('ترتيب الحكاية الصحيح','Richtige Reihenfolge')));for(const f of a.frames)box.append(arabic(el('p',f.text)));
   }
  }
  function renderStory(a,section){
   section.append(el('h3',t('اضغط الأحداث بالترتيب: أولًا، ثم، أخيرًا','Wähle die Ereignisse: zuerst, dann, zuletzt')));
   const selected=el('div',undefined,'rx-story-selected');selected.setAttribute('aria-live','polite');
   const choices=el('div',undefined,'rx-story-grid');
   const refresh=()=>{
    selected.replaceChildren();choices.replaceChildren();const order=saved(a.id).order||[];
    order.forEach((index,pos)=>{const n=el('div',undefined,'rx-story-step');n.append(el('strong',String(pos+1)),arabic(el('p',a.frames[index].text)));selected.append(n);});
    const display=window.ReadingWorkshopAudio.displayOrder(a);
    for(const index of display){const f=a.frames[index],b=button('',()=>{draft({order:[...(saved(a.id).order||[]),index]});clearFeedback();refresh();},'rx-story-card');b.disabled=order.includes(index);b.dataset.frame=index;b.append(image(f.image,f.imageAlt),arabic(el('p',f.text)));choices.append(b);}
   };
   section.append(selected,choices,button(t('تراجع عن آخر حدث','Letztes Ereignis zurücknehmen'),()=>{draft({order:(saved(a.id).order||[]).slice(0,-1)});clearFeedback();refresh();}));refresh();
  }
  function paletteBar(current,onSelect){
   const bar=el('div',undefined,'rx-palette');bar.setAttribute('role','group');bar.setAttribute('aria-label',t('اختر لونًا','Farbe wählen'));
   for(const c of D.colors){const b=button(c.label,()=>{onSelect(c.id);for(const child of bar.children)child.setAttribute('aria-pressed',String(child===b));},'rx-swatch');b.style.setProperty('--swatch',c.hex);b.setAttribute('aria-pressed',String(c.id===current));b.dataset.color=c.id;bar.append(b);}
   return bar;
  }
  function renderColor(a,section){
   const list=el('ol',undefined,'rx-reading-text');for(const instruction of a.instructions)list.append(arabic(el('li',instruction)));section.append(list);
   section.append(el('p',t('١. اختر لونًا. ٢. اضغط على جزء الرسم أو زر اسمه. الأبيض يمكن أن يبقى أبيض.','1. Farbe wählen. 2. Bildfläche oder ihren Namen antippen. Weiße Flächen dürfen weiß bleiben.'),'rx-help'));
   section.append(paletteBar(palette,id=>{palette=id;}));
   const art=el('div',undefined,'rx-color-art');art.id='rx-color-art';art.setAttribute('aria-label',a.title);
   const targets=el('div',undefined,'rx-color-targets');
   const paint=id=>{draft({colors:{...(saved(a.id).colors||{}),[id]:palette}});clearFeedback();refresh();};
   const refresh=()=>{for(const p of a.parts){const color=saved(a.id).colors?.[p.id]||'white',node=art.querySelector('[data-part="'+p.id+'"]');if(node)node.setAttribute('fill',D.colors.find(c=>c.id===color).hex);const b=targets.querySelector('[data-color-label="'+p.id+'"]');if(b)b.style.setProperty('--part-color',D.colors.find(c=>c.id===color).hex);}};
   for(const p of a.parts){const b=button(p.label,()=>paint(p.id),'rx-part');b.dataset.colorLabel=p.id;targets.append(b);}
   section.append(art,targets);
   // file:// viewers may reject fetch; the ordinary image and named buttons
   // remain functional, with a local SVG region overlay built from the data.
   const mount=text=>{if(activity?.id!==a.id)return;const doc=new DOMParser().parseFromString(text,'image/svg+xml');const svg=doc.documentElement;if(svg.localName!=='svg')throw new Error('Invalid illustration');art.replaceChildren(document.importNode(svg,true));for(const p of a.parts){const node=art.querySelector('[data-part="'+p.id+'"]');if(!node)throw new Error('Missing region');node.setAttribute('tabindex','0');node.setAttribute('role','button');node.setAttribute('aria-label',p.label);node.addEventListener('click',()=>paint(p.id));node.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();paint(p.id);}});}refresh();};
   if(a.svg)mount(a.svg);
   else{svgAbort=new AbortController();fetch(a.image,{signal:svgAbort.signal}).then(r=>{if(!r.ok)throw Error();return r.text();}).then(mount).catch(e=>{if(e.name!=='AbortError')art.replaceChildren(image(a.image,a.imageAlt));});}
   refresh();
  }
  function drawingLoad(id){try{return JSON.parse(S.getItem('readingExercisesDrawingV1:'+id))||{strokes:[],text:''};}catch(_){return {strokes:[],text:''};}}
  function renderDrawing(a,section){
   const list=el('ol',undefined,'rx-reading-text');for(const instruction of a.instructions)list.append(arabic(el('li',instruction)));section.append(list);
   section.append(el('p',t('ارسم بإصبعك أو بالفأرة، أو ارسم على ورقة. راجع المعنى والمكان والعدد والألوان مع معلمك؛ الرسم لا يحصل على تصحيح آلي.','Zeichne mit Finger oder Maus oder auf Papier. Prüfe Bedeutung, Lage, Anzahl und Farben mit einer Lehrkraft; Zeichnungen werden nicht automatisch bewertet.'),'rx-help'));
   const drawing=drawingLoad(a.id);let stroke=null;const canvas=el('canvas',undefined,'rx-canvas');canvas.width=900;canvas.height=510;canvas.setAttribute('aria-label',t('لوحة رسم؛ يمكنك أيضًا الرسم على ورقة واستخدام قائمة المراجعة.','Zeichenfläche; alternativ auf Papier zeichnen und die Prüfliste nutzen.'));
   const ctx=canvas.getContext('2d');
   function redraw(){ctx.clearRect(0,0,900,510);ctx.lineCap='round';ctx.lineJoin='round';for(const line of drawing.strokes){ctx.strokeStyle=line.color;ctx.lineWidth=5;ctx.beginPath();line.points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.stroke();}}
   function persist(){S.setItem('readingExercisesDrawingV1:'+a.id,JSON.stringify(drawing));}
   const point=e=>{const r=canvas.getBoundingClientRect();return [Math.round((e.clientX-r.left)*900/r.width),Math.round((e.clientY-r.top)*510/r.height)];};
   canvas.addEventListener('pointerdown',e=>{if(e.button&&e.pointerType==='mouse')return;e.preventDefault();if(drawing.strokes.length>=240)drawing.strokes.shift();stroke={color:D.colors.find(c=>c.id===drawColor).hex,points:[point(e)]};drawing.strokes.push(stroke);canvas.setPointerCapture(e.pointerId);});
   canvas.addEventListener('pointermove',e=>{if(!stroke)return;const p=point(e),last=stroke.points.at(-1);if(Math.hypot(p[0]-last[0],p[1]-last[1])>3&&stroke.points.length<1200)stroke.points.push(p);redraw();});
   function stop(){if(stroke){if(stroke.points.length===1)stroke.points.push([stroke.points[0][0]+1,stroke.points[0][1]+1]);stroke=null;redraw();persist();}}
   canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop);canvas.addEventListener('lostpointercapture',stop);
   section.append(paletteBar(drawColor,id=>{drawColor=id;}),canvas);
   const actions=el('div',undefined,'rx-actions');actions.append(button(t('تراجع عن آخر خط','Letzten Strich zurücknehmen'),()=>{drawing.strokes.pop();redraw();persist();}),button(t('مسح الرسم','Zeichnung leeren'),()=>{if(confirm(t('هل تريد مسح رسم هذا النشاط؟','Zeichnung dieser Aufgabe leeren?'))){drawing.strokes=[];redraw();persist();}}));section.append(actions);
   const label=el('label',a.writing,'rx-writing'),textarea=el('textarea');textarea.rows=3;textarea.maxLength=600;textarea.value=drawing.text||'';textarea.lang='ar';textarea.dir='rtl';textarea.addEventListener('input',()=>{drawing.text=textarea.value;persist();});label.append(textarea);section.append(label,el('p',t('الرسم والجملة يُحفظان على هذا المتصفح لهذا الحساب.','Bild und Satz bleiben für dieses Konto in diesem Browser gespeichert.'),'rx-help'));
   const criteria=el('fieldset',undefined,'rx-review');criteria.append(el('legend',t('راجع رسمك بندًا بندًا','Prüfe dein Bild Schritt für Schritt')));
   a.instructions.forEach((text,i)=>{const label=el('label'),input=el('input');input.type='checkbox';input.checked=!!saved(a.id).criteria?.[i];input.addEventListener('change',()=>{write(a.id,{criteria:{...(saved(a.id).criteria||{}),[i]:input.checked},reviewed:false});updateCounter();});label.append(input,arabic(el('span',text)));criteria.append(label);});
   section.append(criteria,button(t('راجعت عملي وأنهيت النشاط','Geprüft und abgeschlossen'),()=>{if(a.instructions.every((_,i)=>saved(a.id).criteria?.[i])){write(a.id,{reviewed:true,completed:true});updateCounter();$('rx-feedback').textContent=t('عمل جميل! أنجزت النشاط بالمراجعة الذاتية. شارك رسمك مع معلمك.','Gut gemacht! Selbstprüfung abgeschlossen. Zeige dein Bild deiner Lehrkraft.');}else $('rx-feedback').textContent=t('راجع جميع البنود أولًا، ثم علّم ما حققته في رسمك.','Prüfe zuerst alle Kriterien und hake Erledigtes ab.');},'rx-button rx-primary'));
   redraw();
  }
  function printActivities(){
   const host=$('rx-print-content');host.replaceChildren();
   const all=activity?[activity]:D.activities.filter(a=>!chapter||a.chapter===chapter.id);
   for(const a of all){const section=el('section',undefined,'rx-print-activity');section.append(el('h2',a.title));
    if(a.image)section.append(image(a.image,a.imageAlt));
    for(const text of a.instructions||[])section.append(arabic(el('p','□ '+text)));
    for(const f of a.frames||[]){section.append(image(f.image,f.imageAlt),arabic(el('p','□ '+f.text)));}
    for(const q of a.questions||[])section.append(arabic(el('p',q.prompt)),arabic(el('p',q.options.map(x=>'□ '+x).join('     '))));
    if(a.type==='draw')section.append(el('div',undefined,'rx-print-drawing'),arabic(el('p','جُمْلَتِي: ................................................................')));
    section.append(el('p','الاسم: .............................     التاريخ: .............................'));host.append(section);
   }
   // Print-only pictures are off-screen; eager loading lets the browser include
   // them in the worksheet instead of deferring them until a screen scroll.
   for(const img of host.querySelectorAll('img'))img.loading='eager';
   window.print();
  }
  $('rx-back').addEventListener('click',()=>{search='';go(activity?chapter.id:'');});$('rx-print').addEventListener('click',printActivities);
  window.addEventListener('hashchange',route);window.addEventListener('app-language-change',render);window.addEventListener('pagehide',()=>narrator.stop());
  window.addEventListener('pageshow',event=>{if(event.persisted)route();});
  $('lesson-loading')?.remove();route();
 });
})();
