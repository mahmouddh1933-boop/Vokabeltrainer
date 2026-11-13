/* Announced, numbered narration; pauses start after actual audio completion. */
(() => {
 'use strict';
 const masculine=['الْأَوَّلُ','الثَّانِي','الثَّالِثُ','الرَّابِعُ','الْخَامِسُ','السَّادِسُ','السَّابِعُ','الثَّامِنُ','التَّاسِعُ','الْعَاشِرُ','الْحَادِيَ عَشَرَ','الثَّانِيَ عَشَرَ'];
 const feminine=['الْأُولَى','الثَّانِيَةُ','الثَّالِثَةُ','الرَّابِعَةُ','الْخَامِسَةُ','السَّادِسَةُ','السَّابِعَةُ','الثَّامِنَةُ'];
 const clean=text=>String(text||'').replace(/[_\u0640\u25a1]+/g,' ').replace(/\s+/g,' ').trim();
 function displayOrder(a){
  const arrangements=[[2,0,1],[1,2,0],[0,2,1],[1,0,2],[2,1,0]];
  return arrangements[(Number(a.id.split('-').at(-1))-1)%arrangements.length];
 }
 function plan(a){
  const steps=[{text:'عُنْوَانُ النَّشَاطِ: '+clean(a.title)+'.',pauseAfter:2000,kind:'title'}];
  for(const [i,text] of (a.instructions||[]).entries())steps.push({text:'التَّعْلِيمَةُ '+feminine[i]+': '+clean(text),pauseAfter:450,kind:'instruction'});
  // Read the cards in their displayed order, without revealing the answer to
  // the chronological ordering exercise by announcing the correct events.
  if(a.frames)for(const [i,index] of displayOrder(a).entries())steps.push({text:'الْبِطَاقَةُ '+feminine[i]+': '+clean(a.frames[index].text),pauseAfter:450,kind:'card'});
  for(const [i,q] of (a.questions||[]).entries())steps.push({text:'السُّؤَالُ '+(masculine[i]||String(i+1))+': '+clean(q.prompt),pauseAfter:650,kind:'question'});
  return steps;
 }
 function create({speak,stop,setTimer=setTimeout,clearTimer=clearTimeout}){
  let generation=0,timer=null;
  function cancel(){generation++;if(timer!==null)clearTimer(timer);timer=null;stop();}
  function play(activity,onStatus){
   cancel();const current=++generation,steps=plan(activity);
   function run(index){
    if(current!==generation||index>=steps.length)return;
    const step=steps[index];
    speak(step.text,(message,error)=>{if(current===generation)onStatus?.(message,error);},success=>{
     if(current!==generation||!success||index===steps.length-1)return;
     timer=setTimer(()=>{timer=null;run(index+1);},step.pauseAfter);
    });
   }
   run(0);
  }
  return {play,stop:cancel};
 }
 const api={clean,displayOrder,plan,create};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else window.ReadingWorkshopAudio=api;
})();
