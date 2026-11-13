/* Five fresh questions, drawn from five distinct activities in the chapter. */
(()=>{'use strict';
 function choose(activities,previous=[],random=Math.random){
  const shuffle=rows=>{const out=[...rows];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;};
  const excluded=new Set(previous),groups=shuffle(activities.filter(a=>a.chapter==='meaning'&&a.questions?.length));
  return groups.slice(0,5).map(a=>{
   const candidates=a.questions.map((q,i)=>({...q,source:a.id,sourceKey:a.id+':'+i})).filter(q=>!excluded.has(q.sourceKey));
   return shuffle(candidates.length?candidates:a.questions.map((q,i)=>({...q,source:a.id,sourceKey:a.id+':'+i})))[0];
  });
 }
 if(typeof module!=='undefined'&&module.exports)module.exports={choose};else window.ReadingSelfCheck={choose};
})();
