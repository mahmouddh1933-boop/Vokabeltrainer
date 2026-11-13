(() => {
  'use strict';
  window.JisrStorage.ready(()=>{
    const E=window.HuroofEdition,A=window.VocabApp,S=window.JisrStorage.local;
    const de=()=>window.AppLanguage?.get()==='de';
    const t=(ar,german)=>de()?german:ar;
    const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
    const page=location.pathname.split('/').pop()||'index.html';
    const galleryPositions=new Map();
    function owner(url){
      const name=url.pathname.split('/').pop(),level=url.searchParams.get('level'),list=url.searchParams.get('list');
      if(name==='grammar.html'&&url.hash){const id=url.hash.slice(1);if(E.basicLessons.includes(id))return'a1-a2';if(E.advancedLessons.includes(id))return'b1-b2';}
      if(['vocabulary.html','lernseite.html'].includes(name)){
        if(level)return /^B/.test(level)?'b1-b2':'a1-a2';
        if(list)return /^b[12]_/.test(list)?'b1-b2':/^a[12]_/.test(list)?'a1-a2':'books';
      }
      return E.owners[name]||'a1-a2';
    }
    function correctLinks(){
      for(const node of document.querySelectorAll('a[href]')){
        let u;try{u=new URL(node.getAttribute('href'),location.href);}catch(_){continue;}
        if(u.origin!==location.origin)continue;
        const name=u.pathname.split('/').pop();if(!name?.endsWith('.html'))continue;
        const other=owner(u),specific=(name==='grammar.html'&&u.hash&&!E.grammarIds.includes(u.hash.slice(1)))||
          (name==='vocabulary.html'&&u.searchParams.has('level')&&!E.levels.includes(u.searchParams.get('level')));
        if(E.pages.includes(name)&&!specific)continue;
        if(E.suite)node.href='../'+other+'/'+name+u.search+u.hash;
        else node.href='apps.html?app='+encodeURIComponent(other);
      }
    }
    // Old grammar bookmarks may point at a lesson now owned by the other app.
    if(page==='grammar.html'&&location.hash&&!E.grammarIds.includes(location.hash.slice(1))){
      const target=owner(new URL(location.href));
      if(target!==E.id){
        location.replace(E.suite?'../'+target+'/grammar.html'+location.hash:'apps.html?app='+encodeURIComponent(target));
        return;
      }
    }
    function directory(){
      const host=document.getElementById('edition-directory');if(!host)return;
      host.replaceChildren();
      document.getElementById('edition-image-dialog')?.remove();
      const dialog=el('dialog',null,'edition-image-dialog');dialog.id='edition-image-dialog';let viewer=null;
      const close=el('button',t('إغلاق الصورة','Bild schließen'),'practice-button');close.type='button';close.addEventListener('click',()=>dialog.close());
      const large=el('img'),caption=el('p');
      function counter(index,total){return t(`${index+1} من ${total}`,`${index+1} von ${total}`);}
      function controls(shift){
        const root=el('div',null,'edition-carousel-controls');root.dir=de()?'ltr':'rtl';
        const previous=el('button',(de()?'← ':'→ ')+t('السابقة','Zurück'),'practice-button');previous.type='button';previous.dataset.galleryPrevious='';previous.setAttribute('aria-label',t('الصورة السابقة','Vorheriges Bild'));previous.addEventListener('click',()=>shift(-1));
        const count=el('span',null,'edition-carousel-count');count.dataset.galleryCount='';count.setAttribute('aria-live','polite');count.setAttribute('aria-atomic','true');
        const next=el('button',(de()?'→ ':'← ')+t('التالية','Weiter'),'practice-button');next.type='button';next.dataset.galleryNext='';next.setAttribute('aria-label',t('الصورة التالية','Nächstes Bild'));next.addEventListener('click',()=>shift(1));
        root.append(previous,count,next);return {root,count};
      }
      function keyboard(event,shift,jump){
        if(event.key==='ArrowLeft'){event.preventDefault();shift(de()?-1:1);}
        else if(event.key==='ArrowRight'){event.preventDefault();shift(de()?1:-1);}
        else if(event.key==='Home'){event.preventDefault();jump(0);}
        else if(event.key==='End'){event.preventDefault();jump(-1);}
      }
      const modalControls=controls(step=>viewer?.shift(step));
      dialog.append(close,large,caption,modalControls.root);document.body.append(dialog);
      dialog.addEventListener('keydown',event=>keyboard(event,step=>viewer?.shift(step),index=>viewer?.jump(index)));
      dialog.addEventListener('close',()=>{viewer=null;});
      dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
      const jump=el('nav',null,'edition-gallery-nav');jump.setAttribute('aria-label',t('معارض التطبيقات','App-Galerien'));
      for(const item of E.editions.filter(item=>item.id!==E.id)){const link=el('a',de()?item.de:item.ar,'practice-button');link.href='#preview-'+item.id;jump.append(link);}host.append(jump);
      for(const item of E.editions.filter(item=>item.id!==E.id)){
        const box=el('section',null,'edition-showcase');box.id='preview-'+item.id;
        box.append(el('h2',de()?item.de:item.ar),el('p',de()?item.descriptionDe:item.description));
        const carousel=el('div',null,'edition-carousel');carousel.dataset.gallery=item.id;carousel.setAttribute('role','region');carousel.setAttribute('aria-label',de()?item.de:item.ar);carousel.setAttribute('aria-roledescription',t('معرض صور','Bildergalerie'));carousel.tabIndex=0;
        const figure=el('figure'),button=el('button',null,'edition-preview-button'),img=el('img'),description=el('figcaption');button.type='button';
        img.width=1000;img.height=750;img.loading='eager';img.id='preview-image-'+item.id;
        const dots=el('div',null,'edition-carousel-dots');dots.setAttribute('role','group');dots.setAttribute('aria-label',t('اختيار الصورة','Bild wählen'));
        let index=galleryPositions.get(item.id)||0;
        const navigation=controls(step=>show(index+step));
        for(const control of navigation.root.querySelectorAll('button'))control.setAttribute('aria-controls',img.id);
        function show(next){
          const focused=dots.contains(document.activeElement);index=(next+item.previews.length)%item.previews.length;galleryPositions.set(item.id,index);
          const frame=item.previews[index];img.src='images/editions/'+item.id+'/'+(index+1)+'.webp';img.alt=de()?frame.de:frame.ar;description.textContent=img.alt;navigation.count.textContent=counter(index,item.previews.length);
          button.setAttribute('aria-label',t('تكبير الصورة: ','Bild vergrößern: ')+img.alt);
          [...dots.children].forEach((dot,i)=>{dot.setAttribute('aria-current',String(i===index));dot.tabIndex=i===index?0:-1;});
          if(focused)dots.children[index].focus();if(viewer?.id===item.id)viewer.refresh();
        }
        for(const [i,frame] of item.previews.entries()){
          const dot=el('button',String(i+1),'edition-carousel-dot');dot.type='button';dot.setAttribute('aria-label',t(`عرض الصورة ${i+1}: `,`Bild ${i+1} anzeigen: `)+(de()?frame.de:frame.ar));dot.addEventListener('click',()=>show(i));dots.append(dot);
        }
        button.addEventListener('click',()=>{
          viewer={id:item.id,shift:step=>show(index+step),jump:show,refresh:()=>{large.src=img.src;large.alt=img.alt;caption.textContent=img.alt;modalControls.count.textContent=counter(index,item.previews.length);}};
          viewer.refresh();dialog.setAttribute('aria-label',de()?item.de:item.ar);dialog.showModal();
        });
        carousel.addEventListener('keydown',event=>keyboard(event,step=>show(index+step),show));
        button.append(img);figure.append(button,description);carousel.append(figure,navigation.root,dots);show(index);
        box.append(carousel,el('p',t('كل خطوة صغيرة تفتح لك بابًا جديدًا في العربية.','Jeder kleine Schritt öffnet dir neue Möglichkeiten auf Arabisch.'),'edition-encouragement'));host.append(box);
      }
    }
    function home(){
      const host=document.getElementById('edition-routes');if(!host)return;
      host.replaceChildren();
      for(const r of E.routes){
        const card=el('a',null,'route-card');card.href=r.href;card.append(el('h2',de()?r.de:r.ar),el('p',de()?r.descriptionDe:r.description));host.append(card);
      }
      document.getElementById('edition-summary').textContent=de()?E.summaryDe:E.summary;
    }
    function progress(){
      const n=document.getElementById('edition-progress');if(!n)return;
      const stats=A.getStats(),r=stats.readingTrainerV1||{},p=stats.phonicsV1||{},work=stats.readingExercisesV1||{};
      n.replaceChildren(el('p',t(`كلمات علّمتها كمقروءة: ${(r.read||[]).length} من ١٥٠.`,`Selbst als gelesen markiert: ${(r.read||[]).length} von 150 Wörtern.`)),
        el('p',t(`كلمات استمعت إليها: ${(r.heard||[]).length}.`,`Angehörte Wörter: ${(r.heard||[]).length}.`)),
        el('p',t('يُحفظ تقدّم مدرّب القراءة والهجاء تلقائيًّا في هذا التطبيق.','Lesetrainer und Lautübungen speichern ihren Lernstand in dieser App.')));
      if(Object.keys(p).length)n.append(el('p',t('لديك تدريبات محفوظة في القراءة والهجاء.','Du hast gespeicherte Lese- und Lautübungen.')));
      if(Object.keys(work).length)n.append(el('p',t(`نشاطات عملت عليها في تدريبات القراءة: ${Object.keys(work).length}.`,`Bearbeitete Aufgaben in der Lesewerkstatt: ${Object.keys(work).length}.`)));
    }
    async function importLegacy(){
      const button=document.getElementById('edition-import'),status=document.getElementById('edition-import-status');button.disabled=true;
      try{
        const user=window.OliveAuth?.getUser(),values={};
        if(user&&window.firebase){
          const snapshot=await window.firebase.firestore().collection('users/'+user.uid+'/learning').get({source:'server'});
          for(const doc of snapshot.docs){try{values[doc.id]=JSON.parse(doc.data().value);}catch(_){}}
        }else{
          for(const key of ['learningStats','wrongWords','studiedWords','listMasteryV12',...E.practiceKeys]){
            try{const value=localStorage.getItem(key);if(value!==null)values[key]=JSON.parse(value);}catch(_){}
          }
        }
        let copied=0;
        const incoming=values.learningStats||{},current=A.getStats();
        function merge(old,next,key=''){
          if(next==null)return old;
          if(Array.isArray(old)&&Array.isArray(next)){
            if(['read','heard','completed','studied'].includes(key))return [...new Set([...old,...next])];
            return Array.from({length:Math.max(old.length,next.length)},(_,i)=>merge(old[i],next[i]));
          }
          if(old&&next&&typeof old==='object'&&typeof next==='object'){
            const result={...old};for(const [k,v] of Object.entries(next))result[k]=merge(old[k],v,k);return result;
          }
          return next;
        }
        for(const key of E.statFields)if(incoming[key]){current[key]=merge(incoming[key],current[key]||{});copied++;}
        if(incoming.grammarPathV1&&E.grammarIds.length){
          const old=incoming.grammarPathV1,prior=current.grammarPathV1||{};
          const lessons=Object.fromEntries(Object.entries(old.lessons||{}).filter(([id])=>E.grammarIds.includes(id)));
          if(Object.keys(lessons).length){current.grammarPathV1={...old,...prior,lessons:merge(lessons,prior.lessons||{})};copied++;}
        }
        A.setJSON('learningStats',current);
        const catalog=await A.loadCatalog(),lists=[...catalog.lists,...(catalog.bookVocabulary?.lists||[]),...(catalog.bookVocabulary2?.lists||[])];
        const ids=new Set(lists.map(l=>l.id));
        const norm=s=>String(s||'').normalize('NFC').replace(/[\u064b-\u065f\u0670]/g,'');
        const words=new Set(lists.flatMap(l=>l.words.map(w=>norm(w.ar)+'\t'+w.de)));
        for(const key of ['wrongWords','studiedWords']){
          const saved=A.getJSON(key,[]),items=(values[key]||[]).filter(w=>words.has(norm(w.arabic)+'\t'+w.german));
          const map=new Map(items.map(w=>[w.key||w.arabic+'\t'+w.german,w]));for(const w of saved)map.set(w.key||w.arabic+'\t'+w.german,w);
          if(items.length){A.setJSON(key,[...map.values()]);copied+=items.length;}
        }
        const mastery=Object.fromEntries(Object.entries(values.listMasteryV12||{}).filter(([,v])=>ids.has(v.sourceId)));
        if(Object.keys(mastery).length){A.setJSON('listMasteryV12',{...mastery,...A.getJSON('listMasteryV12',{})});copied+=Object.keys(mastery).length;}
        for(const key of E.practiceKeys)if(values[key]&&!S.getItem(key)){S.setItem(key,JSON.stringify(values[key]));copied++;}
        status.textContent=copied?t('استُعيدت الإنجازات المناسبة لهذا التطبيق. بياناتك القديمة لم تتغير. الإحصاءات الإجمالية القديمة تبقى في النسخة السابقة.','Passende Lernstände wurden übernommen. Alte Daten bleiben erhalten; die früheren Gesamtstatistiken bleiben in der bisherigen Version.'):
          t('لم نجد إنجازات قديمة مناسبة في الحساب أو المتصفح الحالي.','Für dieses Konto bzw. diesen Browser wurden keine passenden früheren Lernstände gefunden.');
        progress();
      }catch(_){status.textContent=t('تعذّر استيراد التقدّم الآن. لم تتغير بيانات النسخة السابقة؛ أعد المحاولة مع الاتصال بالإنترنت.','Import gerade nicht möglich. Die bisherigen Daten bleiben erhalten. Versuche es mit Internetverbindung erneut.');}
      finally{button.disabled=false;}
    }
    const button=document.getElementById('edition-import');if(button)button.addEventListener('click',importLegacy);
    const subtitle=el('span',null,'edition-brand');subtitle.dataset.ar=E.ar;subtitle.dataset.de=E.de;subtitle.textContent=de()?E.de:E.ar;
    document.querySelector('.app-sidebar .brand-type')?.append(subtitle);
    function render(){home();directory();progress();correctLinks();}
    render();window.addEventListener('app-language-change',render);
    let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(correctLinks,50);}).observe(document.body,{childList:true,subtree:true});
  });
})();
