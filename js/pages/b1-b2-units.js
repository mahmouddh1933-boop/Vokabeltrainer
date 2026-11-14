(() => {
  'use strict';
  window.JisrStorage.ready(() => {
    const units=window.HuroofAdvancedUnits.units, A=window.VocabApp, host=document.getElementById('advanced-content');
    const de=()=>window.AppLanguage?.get()==='de', t=(ar,german)=>de()?german:ar;
    const modules=[['reading','القراءة','Lesen'],['vocabulary','المفردات','Wortschatz'],['grammar','القواعد','Grammatik'],['listening','الاستماع','Hören'],['speaking','المحادثة','Sprechen'],['writing','الكتابة','Schreiben']];
    let current=null, section='reading', filter='B1', audio=null;
    function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;}
    function button(text,fn){const n=el('button',text,'practice-button');n.type='button';n.addEventListener('click',fn);return n;}
    function link(text,href){const n=el('a',text,'practice-button');n.href=href;return n;}
    const records=()=>A.getStats().advancedUnitsV1||{};
    const record=id=>records()[id]||{};
    function patch(id,changes){A.setJSON('learningStats',{...A.getStats(),advancedUnitsV1:{...records(),[id]:{...record(id),...changes,updatedAt:Date.now()}}});}
    function moduleRecord(){return record(current.id).modules?.[section]||{};}
    function saveModule(changes){const prior=record(current.id);patch(current.id,{modules:{...prior.modules,[section]:{...moduleRecord(),...changes}}});}
    function updateProgress(){const n=document.getElementById('advanced-progress');if(n){const ratio=el('bdi',modules.filter(([key])=>record(current.id).modules?.[key]?.done).length+' / 6');ratio.dir='ltr';n.replaceChildren(el('span',t('أقسام أنجزتها: ','Erledigte Abschnitte: ')),ratio);}}
    function stop(){if(audio){audio.pause();audio.removeAttribute('src');audio.load();audio=null;}}
    function quiz(questions){
      const form=el('form',undefined,'advanced-quiz'),unitId=current.id,moduleId=section;
      const saved=moduleRecord();
      questions.forEach((q,i)=>{
        const group=el('fieldset');group.append(el('legend',`${i+1}. ${q.q}`));
        q.opts.forEach((option,j)=>{const label=el('label'),input=el('input');input.type='radio';input.name='question-'+i;input.value=j;input.required=true;input.checked=saved.answers?.[i]===j;label.append(input,el('span',option));group.append(label);});form.append(group);
      });
      const submit=el('button',t('تحقق من الإجابات','Antworten prüfen'),'practice-button');submit.type='submit';
      const result=el('div',undefined,'advanced-feedback');result.setAttribute('aria-live','polite');
      function feedback(answers){const score=questions.filter((q,i)=>answers[i]===q.a).length;const total=el('strong',`${score} / ${questions.length}`);total.dir='ltr';result.replaceChildren(total);questions.forEach((q,i)=>result.append(el('p',`${i+1}. ${answers[i]===q.a?'✓':'✗'} ${q.opts[q.a]}`)));return score;}
      if(saved.answers?.length===questions.length)feedback(saved.answers);
      form.addEventListener('submit',event=>{event.preventDefault();const answers=questions.map((_,i)=>Number(new FormData(form).get('question-'+i)));const score=feedback(answers);const prior=record(unitId);patch(unitId,{modules:{...prior.modules,[moduleId]:{...prior.modules?.[moduleId],answers,score,total:questions.length,done:score===questions.length}}});updateProgress();});
      form.append(submit,result);return form;
    }
    function draft(key,label,placeholder){const box=el('label',label,'advanced-draft-label'),area=el('textarea');area.id='advanced-'+key;area.dir='auto';area.placeholder=placeholder;area.value=record(current.id)[key]||'';const count=el('span',undefined,'advanced-muted'),status=el('span',undefined,'advanced-muted');status.setAttribute('aria-live','polite');const unitId=current.id;
      function update(){const n=area.value.trim()?area.value.trim().split(/\s+/u).length:0;count.textContent=t('عدد الكلمات: ','Wörter: ')+n;}
      area.addEventListener('input',()=>{patch(unitId,{[key]:area.value});update();status.textContent=t('حُفظت المسودة في سجلّ تعلّمك.','Entwurf im Lernstand gespeichert.');});update();box.append(area,count,status);return box;
    }
    function overview(){
      host.append(el('p',t('اختر مستوى ووحدة. يُحفظ تقدّم الأقسام ومسوداتك، وتظل الكتابة والمحادثة للتقييم الذاتي أو مع معلّم.','Wähle Stufe und Einheit. Fortschritt und Entwürfe werden gespeichert; Sprechen und Schreiben beurteilst du selbst oder mit einer Lehrkraft.')));
      const filters=el('nav',undefined,'advanced-tabs');filters.setAttribute('aria-label',t('المستوى','Sprachniveau'));
      for(const level of ['B1','B2']){const b=link(level+' · 20 '+t('وحدة','Einheiten'),'#'+level);b.setAttribute('aria-current',filter===level?'page':'false');filters.append(b);}host.append(filters);
      const searchLabel=el('label',t('ابحث بعنوان الوحدة','Einheit nach Titel suchen')),search=el('input');search.type='search';search.id='advanced-search';searchLabel.append(search);host.append(searchLabel);
      const grid=el('div',undefined,'advanced-unit-grid');host.append(grid);
      const normalize=s=>s.normalize('NFD').replace(/\p{M}/gu,'').replace(/[أإآ]/g,'ا').toLowerCase();
      function cards(){grid.replaceChildren();for(const u of units.filter(u=>u.level===filter&&normalize(u.title).includes(normalize(search.value)))){const card=el('article',undefined,'advanced-unit-card');card.append(el('span',u.level,'advanced-muted'),el('h2',u.title),el('p',u.value),el('p',`${u.wordCount} `+t('كلمة في نص القراءة','Wörter im Lesetext')));const completed=modules.filter(([key])=>record(u.id).modules?.[key]?.done).length;card.append(el('p',t('أقسام منجزة: ','Erledigte Abschnitte: ')+completed+' / 6'),link(t('افتح الوحدة','Einheit öffnen'),'#'+u.id+'/reading'));grid.append(card);}if(!grid.childElementCount)grid.append(el('p',t('لا توجد وحدة مطابقة.','Keine passende Einheit.')));}
      search.addEventListener('input',cards);cards();
    }
    function unitView(){
      host.append(link(t('جميع الوحدات','Alle Einheiten'),'#'+current.level),el('h2',current.title));
      const progress=el('p');progress.id='advanced-progress';host.append(progress);updateProgress();
      const nav=el('nav',undefined,'advanced-tabs');nav.setAttribute('aria-label',t('أقسام الوحدة','Abschnitte der Einheit'));
      for(const [id,ar,german] of modules){const l=link(t(ar,german),'#'+current.id+'/'+id);l.dataset.module=id;if(id===section)l.setAttribute('aria-current','page');nav.append(l);}host.append(nav);
      const body=el('section',undefined,'advanced-module');body.id='advanced-module';body.append(el('h3',t(...modules.find(m=>m[0]===section).slice(1))));host.append(body);
      if(section==='reading'){
        body.append(el('p',current.wordCount+' '+t('كلمة · اقرأ ثم أجب عن أسئلة الفهم.','Wörter · Lies den Text und beantworte die Fragen.')));
        const article=el('article',current.reading,'advanced-reading');article.lang='ar';article.dir='rtl';body.append(article,quiz(current.readingQuiz));
      }else if(section==='vocabulary'){
        const grid=el('div',undefined,'advanced-unit-grid');for(const word of current.vocabulary){const card=el('article',undefined,'advanced-word');card.append(el('h4',word.ar),el('p',word.de),el('p',word.example),el('p',word.example_de,'advanced-muted'));grid.append(card);}body.append(grid,quiz(current.vocabularyQuiz));
      }else if(section==='grammar'){
        body.append(el('h4',current.grammar.title),el('p',current.grammar.body),el('blockquote',current.grammar.example));
        const id=current.grammar.lesson;if(window.HuroofEdition?.grammarIds.includes(id))body.append(link(t('افتح شرح القاعدة وتدريباتها','Grammatiklektion und Übungen öffnen'),'grammar.html#'+id));
        body.append(quiz(current.grammar.quiz));
      }else if(section==='listening'){
        body.append(el('p',t('استمع إلى التقرير ثم أجب. التسجيل صوت عربي آلي مُرفق، ويمكن تغيير السرعة من المشغّل.','Höre den Bericht und beantworte die Fragen. Lokale synthetische arabische Aufnahme; Tempo über den Player ändern.')));
        audio=el('audio');audio.id='advanced-audio';audio.controls=true;audio.preload='metadata';audio.src=current.listening.audio;
        const status=el('p');status.setAttribute('aria-live','polite');audio.addEventListener('error',()=>{status.textContent=t('تعذر تحميل التسجيل. تحقق من اكتمال مجلد الصوت.','Aufnahme konnte nicht geladen werden. Prüfe den Audioordner.');});
        const speed=el('select');speed.setAttribute('aria-label',t('سرعة التسجيل','Wiedergabetempo'));for(const x of [.75,1,1.25]){const option=new Option(x+'×',x);option.selected=x===1;speed.append(option);}speed.addEventListener('change',()=>audio.playbackRate=Number(speed.value));
        const transcript=el('details');transcript.append(el('summary',t('أظهر نص التقرير','Transkript anzeigen')),el('p',current.listening.script,'advanced-reading'));body.append(audio,speed,status,transcript,quiz(current.listening.quiz));
      }else if(section==='speaking'){
        const list=el('ol');for(const text of current.speaking)list.append(el('li',text));body.append(list,el('p',t('ناقش الأسئلة مع زميل، وعلّل رأيك وقدّم مثالًا. لا يسجّل التطبيق صوتك ولا يصحح النطق آليًا.','Besprich die Fragen, begründe deine Meinung und nenne ein Beispiel. Keine Tonaufnahme oder automatische Aussprachebewertung.')),draft('speakingNotes',t('ملاحظات للمحادثة','Gesprächsnotizen'),t('سجّل أفكارك هنا…','Notiere deine Gedanken…')));
      }else if(section==='writing'){
        body.append(el('p',current.writing));if(de())body.append(el('p',current.writingDe));body.append(el('p',current.level==='B1'?t('١٠٠–١٥٠ كلمة: رسالة أو قصة قصيرة بمقدمة وتسلسل وخاتمة.','100–150 Wörter: Brief oder kurze Erzählung mit Einleitung, Verlauf und Schluss.'):t('٢٠٠–٣٠٠ كلمة: مقال أو نص حجاجي بأطروحة وحجتين ورأي مخالف وخاتمة.','200–300 Wörter: Aufsatz oder Argumentation mit These, zwei Gründen, Gegenposition und Schluss.')),draft('essay',t('مسودة الكتابة','Schreibentwurf'),t('اكتب نصّك هنا…','Schreibe deinen Text…')));
        const checklist=el('ul');for(const item of [t('التزمت بالموضوع ونوع النص.','Thema und Textsorte eingehalten.'),t('رتبت أفكاري واستعملت روابط مناسبة.','Gedanken geordnet und passend verknüpft.'),t('راجعت القاعدة والمفردات وعلامات الترقيم.','Grammatik, Wortschatz und Zeichensetzung geprüft.')])checklist.append(el('li',item));body.append(checklist,el('p',t('تقييم ذاتي أو مع معلّم؛ لا تُمنح علامة آلية للنص الحر.','Selbstbeurteilung oder Rückmeldung einer Lehrkraft; keine automatische Bewertung freier Texte.')));
      }
      if(['speaking','writing'].includes(section)){
        const label=el('label',undefined,'advanced-self-check'),check=el('input');check.type='checkbox';check.checked=!!moduleRecord().done;check.addEventListener('change',()=>{saveModule({done:check.checked});updateProgress();});label.append(check,el('span',t('أنجزت النشاط وراجعته ذاتيًا أو مع معلّم.','Aktivität erledigt und selbst oder mit einer Lehrkraft geprüft.')));body.append(label);
      }
      const index=modules.findIndex(m=>m[0]===section),next=index<5?'#'+current.id+'/'+modules[index+1][0]:'#'+current.level;
      body.append(link(index<5?t('القسم التالي','Nächster Abschnitt'):t('العودة للوحدات','Zurück zur Übersicht'),next));
    }
    function render(){stop();const parts=location.hash.slice(1).split('/');current=units.find(u=>u.id===parts[0])||null;if(current){filter=current.level;section=modules.some(m=>m[0]===parts[1])?parts[1]:'reading';}else if(['B1','B2'].includes(parts[0]))filter=parts[0];host.replaceChildren();if(current)unitView();else overview();}
    window.addEventListener('hashchange',render);window.addEventListener('app-language-change',render);window.addEventListener('pagehide',stop);render();
  });
})();
