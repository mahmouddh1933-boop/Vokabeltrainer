/* Shared local interactions. Canonical question IDs, answers and grading stay with each book. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SmartActivities=api;})(globalThis,()=>{
  'use strict';
  const live=new Set(),colors=['#176d83','#9a4f9b','#ab5d19','#3d719b','#7a6615','#36765a','#af4558','#634ea0'];
  function move(values,id,target,kind){
    const next={...values},old=next[id]||'';
    if(kind==='match'&&target){let swapped=false;for(const key of Object.keys(next))if(key!==id&&next[key]===target){next[key]=!swapped&&old!==target?old:'';swapped=true;}}
    next[id]=target;return next;
  }
  function disposeWithin(host){for(const entry of [...live])if(!entry.root.isConnected||host.contains(entry.root)){entry.destroy();live.delete(entry);}}
  function mount(host,cfg){
    disposeWithin(host);
    const doc=host.ownerDocument,kind=cfg.kind,items=cfg.items,targets=cfg.targets;
    const de=cfg.language==='de',t=(ar,german)=>de?german:ar;
    const root=doc.createElement('section');root.className='smart-activity smart-'+kind;root.dataset.smartKind=kind;root.dataset.smartId=cfg.id||'';
    let values={...cfg.values},checked={...cfg.checked},selected=null,drag=null,ghost=null,frame=0,suppressUntil=0;
    let board,svg,status,sourceNodes=new Map(),targetNodes=new Map();
    const targetValues=new Set(targets.map(x=>x.value)),itemMap=new Map(items.map(x=>[x.id,x]));
    const hash=text=>[...text].reduce((n,c)=>(Math.imul(n,31)+c.codePointAt(0))>>>0,2166136261);
    const bankOrder=items.slice().sort((a,b)=>hash(a.id+'word')-hash(b.id+'word'));
    const el=(tag,text,cls)=>{const n=doc.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
    const button=(text,fn,cls)=>{const b=el('button',text,cls);b.type='button';if(fn)b.addEventListener('click',fn);return b;};
    const good=id=>!!checked[id]&&!!cfg.isCorrect?.(id,values[id]);
    const locked=id=>cfg.locked||!!checked[id];
    const assigned=()=>items.filter(i=>targetValues.has(values[i.id])).length;
    const announce=text=>{if(status)status.textContent=text;};
    function dropTarget(event){const n=doc.elementFromPoint(event.clientX,event.clientY)?.closest('[data-smart-target]');return n&&root.contains(n)?n.dataset.smartTarget:null;}
    function cancel(){
      if(drag){try{if(root.hasPointerCapture(drag.pointerId))root.releasePointerCapture(drag.pointerId);}catch(_){} }
      drag=null;ghost?.remove();ghost=null;cancelAnimationFrame(frame);root.classList.remove('is-dragging');root.querySelectorAll('.is-over,.is-drag-source').forEach(n=>n.classList.remove('is-over','is-drag-source'));draw();
    }
    function setSelected(id){
      if(locked(id))return;
      selected=selected===id?null:id;
      for(const [key,node]of sourceNodes)node.setAttribute('aria-pressed',String(key===selected));
      announce(selected?t('اختر مستطيلًا أو كلمة مقابلة لوضع: ','Wähle ein Feld oder Gegenstück für: ')+itemMap.get(id).label:t('أُلغي الاختيار.','Auswahl aufgehoben.'));
    }
    function assign(id,value){
      if(!itemMap.has(id)||locked(id)||(!targetValues.has(value)&&value!==''))return;
      // Correct, already checked assignments cannot be displaced by a new match.
      if(kind==='match'&&items.some(i=>i.id!==id&&values[i.id]===value&&locked(i.id)))return announce(t('هذه المطابقة صحيحة ومحفوظة. اختر جوابًا آخر.','Diese richtige Verbindung bleibt erhalten. Wähle eine andere Antwort.'));
      const next=move(values,id,value,kind);
      for(const item of items)if((next[item.id]||'')!==(values[item.id]||''))cfg.onChange?.(item.id,next[item.id]||'');
      values=next;selected=null;render();
      announce(t('حُفظ الاختيار. المتبقي: ','Gespeichert. Noch offen: ')+(items.length-assigned()));
      (targetNodes.get(value)||sourceNodes.get(id))?.focus({preventScroll:true});
    }
    function point(node,other){const a=node.getBoundingClientRect(),b=board.getBoundingClientRect(),o=other?.getBoundingClientRect();return {x:(o?(a.left>o.left?a.left:a.right):(a.left>b.left+b.width/2?a.left:a.right))-b.left,y:a.top+a.height/2-b.top};}
    function path(a,b,color,pending=false){const p=doc.createElementNS('http://www.w3.org/2000/svg','path'),mid=(a.x+b.x)/2;p.setAttribute('d',`M${a.x},${a.y} C${mid},${a.y} ${mid},${b.y} ${b.x},${b.y}`);p.setAttribute('stroke',color);p.setAttribute('fill','none');p.setAttribute('stroke-width',pending?'4':'3');p.setAttribute('stroke-linecap','round');if(pending){p.setAttribute('stroke-dasharray','6 4');p.dataset.smartPreview='';}svg.append(p);}
    function draw(){
      if(!svg||!board?.isConnected)return;
      const r=board.getBoundingClientRect();if(!r.width)return;svg.setAttribute('viewBox',`0 0 ${r.width} ${r.height}`);svg.replaceChildren();
      for(const [index,item]of items.entries()){
        const a=sourceNodes.get(item.id),b=targetNodes.get(values[item.id]);
        if(a&&b&&drag?.id!==item.id)path(point(a,b),point(b,a),colors[index%colors.length]);
      }
      if(drag?.moved){const a=sourceNodes.get(drag.id);if(a)path(point(a),{x:drag.x-r.left,y:drag.y-r.top},colors[items.findIndex(i=>i.id===drag.id)%colors.length],true);}
    }
    function check(){
      if(cfg.assessment||assigned()!==items.length)return;
      for(const item of items)checked[item.id]=true;
      cfg.onCheck?.({...values});render();
      const score=items.filter(i=>good(i.id)).length;announce(t(`نتيجتك ${score} من ${items.length}. راجع الجدول، ثم أعد المحاولات غير الصحيحة.`,`Ergebnis: ${score} von ${items.length}. Prüfe die Tabelle und wiederhole die Fehler.`));
    }
    function retry(){
      const ids=items.filter(i=>checked[i.id]&&!good(i.id)).map(i=>i.id);
      for(const id of ids){delete checked[id];delete values[id];}
      cfg.onRetry?.(ids);selected=null;render();announce(t('احتُفظ بالإجابات الصحيحة. حاول تصحيح الباقي.','Richtige Antworten bleiben erhalten. Korrigiere den Rest.'));
    }
    function source(item,index){
      const b=button('',null,'smart-item');b.dataset.smartItem=item.id;b.setAttribute('aria-pressed',String(selected===item.id));b.disabled=!!locked(item.id);b.title=item.prompt||item.label;b.style.setProperty('--smart-color',colors[index%colors.length]);
      const number=el('span',String(index+1),'smart-number');number.setAttribute('aria-hidden','true');b.append(number,el('span',item.label));b.setAttribute('aria-label',`${index+1}. ${item.label}`);b.dir='auto';b.lang=item.lang||'ar';
      if(checked[item.id]){b.classList.add(good(item.id)?'is-correct':'is-wrong');b.append(el('span',good(item.id)?' ✓':' ✗','smart-result-mark'));}
      sourceNodes.set(item.id,b);return b;
    }
    function render(){
      root.replaceChildren();sourceNodes=new Map();targetNodes=new Map();
      root.append(el('p',kind==='classify'?t('اسحب الكلمات إلى المستطيل المناسب. أو اختر كلمة ثم مستطيلًا بالنقر أو بلوحة المفاتيح. يمكنك نقل الكلمة أو إعادتها إلى البنك قبل التحقق.','Ziehe Wörter in die passenden Felder. Alternativ Wort und Feld anklicken oder per Tastatur wählen. Vor dem Prüfen kannst du Wörter zurücklegen oder verschieben.'):t('اسحب من الكلمة إلى مقابلها لترسم خطًا ملوّنًا. أو اختر الطرفين بالنقر أو بلوحة المفاتيح. الأرقام تميّز الخطوط أيضًا.','Ziehe vom Wort zum Gegenstück, um eine farbige Linie zu zeichnen. Alternativ beide Seiten anklicken oder per Tastatur wählen. Nummern kennzeichnen die Linien zusätzlich.'),'smart-instructions'));
      board=el('div',undefined,'smart-board');root.append(board);
      if(kind==='classify'){
        const bank=el('section',undefined,'smart-bank');bank.dataset.smartBank='';bank.append(el('h4',t('بنك الكلمات','Wortbank')));
        const back=button(t('إعادة الكلمة المختارة إلى البنك','Gewähltes Wort zurücklegen'),()=>{if(selected)assign(selected,'');},'practice-button smart-return');back.disabled=!selected;bank.append(back);
        // The return action remains available immediately after selecting a chip.
        const chips=el('div',undefined,'smart-chips');bank.append(chips);board.append(bank);
        for(const item of bankOrder)if(!targetValues.has(values[item.id]))chips.append(source(item,items.indexOf(item)));
        if(!chips.childElementCount)chips.append(el('p',t('وُزّعت جميع الكلمات. يمكنك نقلها بين المستطيلات.','Alle Wörter sind verteilt. Du kannst sie zwischen den Feldern verschieben.')));
        const bins=el('div',undefined,'smart-bins');bins.style.setProperty('--smart-columns',targets.length);board.append(bins);
        for(const target of targets){const bin=el('section',undefined,'smart-bin');bin.dataset.smartTarget=target.value;const heading=button(target.label,null,'smart-target');heading.dataset.smartTarget=target.value;heading.setAttribute('aria-label',t('ضع الكلمة في: ','Wort zuordnen zu: ')+target.label);heading.dir='auto';targetNodes.set(target.value,heading);bin.append(heading);
          const content=el('div',undefined,'smart-chips');for(const [i,item]of items.entries())if(values[item.id]===target.value)content.append(source(item,i));bin.append(content);bins.append(bin);}
      }else{
        const first=el('div',undefined,'smart-sources'),second=el('div',undefined,'smart-targets');board.append(first,second);
        for(const [i,item]of items.entries())first.append(source(item,i));
        // Deterministic reordering survives reload, with no hint from the answer order.
        const arranged=targets.map((x,i)=>({x,key:(i*17+11)%Math.max(1,targets.length)})).sort((a,b)=>a.key-b.key).map(x=>x.x);
        if(arranged.every((x,i)=>x.value===targets[i].value))arranged.reverse();
        for(const target of arranged){const b=button(target.label,null,'smart-target');b.dataset.smartTarget=target.value;b.dir='auto';b.disabled=!!cfg.locked;const assignedIds=items.filter(i=>values[i.id]===target.value);if(assignedIds.length){b.append(el('span',' '+assignedIds.map(i=>items.indexOf(i)+1).join('، '),'smart-target-number'));b.classList.add('is-linked');}targetNodes.set(target.value,b);second.append(b);}
        svg=doc.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('smart-lines');svg.setAttribute('aria-hidden','true');board.append(svg);
      }
      const actions=el('div',undefined,'smart-actions');
      if(!cfg.assessment){const checkButton=button(t('تحقق من اختياراتي','Zuordnungen prüfen'),check,'practice-button smart-check');checkButton.disabled=assigned()!==items.length||items.every(i=>checked[i.id]);actions.append(checkButton);if(items.some(i=>checked[i.id]&&!good(i.id)))actions.append(button(t('أعيد غير الصحيح فقط','Nur Fehler wiederholen'),retry,'practice-button smart-retry'));}
      const remaining=el('p',t('المتبقي: ','Noch offen: ')+(items.length-assigned()),'smart-remaining');actions.append(remaining);root.append(actions);
      status=el('p',undefined,'smart-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');root.append(status);
      const wrap=el('div',undefined,'smart-summary-wrap'),table=el('table',undefined,'smart-summary');table.append(el('caption',t('جدول اختياراتي','Meine Zuordnungen')));
      const head=el('thead'),tr=el('tr');for(const title of [t('الكلمة أو العبارة','Wort oder Aussage'),t('اختياري','Meine Zuordnung'),t('المراجعة','Rückmeldung')])tr.append(el('th',title));head.append(tr);table.append(head);const body=el('tbody');
      for(const item of items){const row=el('tr');row.dataset.smartRow=item.id;const label=el('th',item.label);label.scope='row';label.dir='auto';const value=el('td',values[item.id]||'—');value.dir='auto';const feedback=el('td');if(checked[item.id]){const correct=good(item.id);row.classList.add(correct?'is-correct':'is-wrong');feedback.append(el('strong',correct?t('✓ صحيح','✓ Richtig'):t('✗ راجع الاختيار','✗ Bitte prüfen')));if(!correct&&cfg.correction)feedback.append(el('p',cfg.correction(item.id)));}else feedback.textContent=values[item.id]?t('لم يُصحَّح بعد','Noch nicht geprüft'):t('لم تُجب بعد','Noch offen');row.append(label,value,feedback);body.append(row);}
      table.append(body);wrap.append(table);root.append(wrap);draw();requestAnimationFrame(draw);
    }
    function autoScroll(){if(!drag?.moved)return;const y=drag.y,h=innerHeight,delta=y<64?-12:y>h-64?12:0;if(delta)window.scrollBy(0,delta);draw();frame=requestAnimationFrame(autoScroll);}
    root.addEventListener('pointerdown',event=>{
      const n=event.target.closest('[data-smart-item]');if(!n||!root.contains(n)||locked(n.dataset.smartItem)||event.button!==0||event.isPrimary===false)return;
      drag={id:n.dataset.smartItem,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,x:event.clientX,y:event.clientY,moved:false};root.setPointerCapture(event.pointerId);
    });
    root.addEventListener('pointermove',event=>{
      if(!drag||event.pointerId!==drag.pointerId)return;drag.x=event.clientX;drag.y=event.clientY;
      if(!drag.moved&&Math.hypot(drag.x-drag.startX,drag.y-drag.startY)>7){drag.moved=true;root.classList.add('is-dragging');sourceNodes.get(drag.id)?.classList.add('is-drag-source');if(kind==='classify'){ghost=el('div',itemMap.get(drag.id).label,'smart-drag-ghost');ghost.setAttribute('aria-hidden','true');doc.body.append(ghost);}frame=requestAnimationFrame(autoScroll);}
      if(!drag.moved)return;event.preventDefault();if(ghost){ghost.style.left=drag.x+'px';ghost.style.top=drag.y+'px';}
      root.querySelectorAll('.is-over').forEach(n=>n.classList.remove('is-over'));const target=dropTarget(event);if(target!==null)targetNodes.get(target)?.closest('.smart-bin,.smart-target')?.classList.add('is-over');draw();
    });
    root.addEventListener('pointerup',event=>{
      if(!drag||event.pointerId!==drag.pointerId)return;
      const {id,moved}=drag,target=moved?dropTarget(event):null,hit=doc.elementFromPoint(event.clientX,event.clientY),back=!!hit?.closest('[data-smart-bank]');cancel();suppressUntil=Date.now()+400;
      if(moved){if(target!==null)assign(id,target);else if(kind==='classify'&&back)assign(id,'');else announce(t('لم يتم الإفلات في مكان مناسب. بقي اختيارك كما هو.','Kein gültiges Ziel. Die Zuordnung blieb unverändert.'));}else setSelected(id);
      const backButton=root.querySelector('.smart-return');if(backButton)backButton.disabled=!selected;
    });
    root.addEventListener('pointercancel',()=>{cancel();announce(t('أُلغي السحب دون تغيير الإجابة.','Ziehen abgebrochen; Antwort unverändert.'));});
    root.addEventListener('click',event=>{
      if(event.detail!==0&&Date.now()<suppressUntil&&event.target.closest('[data-smart-item]'))return;
      const item=event.target.closest('[data-smart-item]');if(item&&root.contains(item)){setSelected(item.dataset.smartItem);const b=root.querySelector('.smart-return');if(b)b.disabled=!selected;return;}
      const target=event.target.closest('[data-smart-target]');if(target&&root.contains(target)){if(selected)assign(selected,target.dataset.smartTarget);else announce(t('اختر كلمة من البنك أولًا.','Wähle zuerst ein Wort.'));}
    });
    root.addEventListener('keydown',event=>{if(event.key==='Escape'){cancel();selected=null;const back=root.querySelector('.smart-return');if(back)back.disabled=true;for(const n of sourceNodes.values())n.setAttribute('aria-pressed','false');announce(t('أُلغي الاختيار.','Auswahl aufgehoben.'));}if((event.key==='Delete'||event.key==='Backspace')&&selected&&!locked(selected)){event.preventDefault();assign(selected,'');}});
    render();host.append(root);draw();const observer=typeof ResizeObserver==='function'?new ResizeObserver(draw):null;observer?.observe(root);
    const entry={root,destroy:()=>{cancel();observer?.disconnect();}};live.add(entry);return {root,values:()=>({...values}),destroy:()=>{entry.destroy();live.delete(entry);root.remove();}};
  }
  if(typeof window!=='undefined')window.addEventListener('resize',()=>{for(const e of [...live])if(!e.root.isConnected){e.destroy();live.delete(e);}});
  return {mount,move,disposeWithin};
});
