const {test}=require('node:test');const assert=require('node:assert/strict');
const N=require('../js/reading-workshop-audio.js'),D=require('../js/reading-exercises-data.js');
test('Narration announces the activity and numbered questions without underscores or decorative elongation',()=>{
 for(const a of D.activities){const p=N.plan(a);assert.ok(p[0].text.startsWith('عُنْوَانُ النَّشَاطِ: '));assert.equal(p[0].pauseAfter,2000);assert.ok(p.every(s=>!s.text.includes('_')&&!s.text.includes('ـ')));for(const s of p.filter(s=>s.kind==='question'))assert.ok(s.text.startsWith('السُّؤَالُ '));}
 const apples=N.plan(D.activities.find(a=>a.id==='count-1'));
 assert.match(apples[0].text,/تُفَّاحٌ فِي السُّوقِ/);assert.match(apples[1].text,/السُّؤَالُ الْأَوَّلُ: كَمْ تُفَّاحَةً حَمْرَاءَ/);
});
function fixture(){
 let time=0,id=0;const timers=new Map(),spoken=[];
 const narrator=N.create({speak:(text,status,end)=>spoken.push({text,end,time}),stop:()=>{},setTimer:(fn,delay)=>(timers.set(++id,{fn,at:time+delay}),id),clearTimer:key=>timers.delete(key)});
 function advance(ms){time+=ms;for(const [key,entry] of [...timers])if(entry.at<=time){timers.delete(key);entry.fn();}}
 return {narrator,spoken,advance};
}
test('The full two-second pause starts when the title finishes, not when it starts',()=>{
 const {narrator,spoken,advance}=fixture();narrator.play(D.activities[0]);advance(6000);assert.equal(spoken.length,1);
 spoken[0].end(true);advance(1999);assert.equal(spoken.length,1);advance(1);assert.equal(spoken.length,2);assert.equal(spoken[1].time,8000);
});
test('Stop, replay and failed audio never allow queued old questions to play',()=>{
 const {narrator,spoken,advance}=fixture();narrator.play(D.activities[0]);spoken[0].end(true);narrator.stop();advance(3000);assert.equal(spoken.length,1);
 narrator.play(D.activities[1]);const stale=spoken[1].end;narrator.play(D.activities[2]);stale(true);advance(3000);assert.equal(spoken.length,3);
 spoken[2].end(false);advance(10000);assert.equal(spoken.length,3);
});
test('Story narration follows displayed cards without giving away their chronological order',()=>{
 const a=D.activities.find(x=>x.id==='stories-1'),cards=N.plan(a).filter(s=>s.kind==='card');
 assert.ok(cards[0].text.endsWith(a.frames[N.displayOrder(a)[0]].text));assert.ok(cards.every(s=>s.text.startsWith('الْبِطَاقَةُ ')));
});
