const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const data=require('../js/reading-exercises-data.js');
const root=path.join(__dirname,'..');
test('The workshop contains eight complete chapters with unique tasks and valid illustrated answers',()=>{
 assert.equal(data.chapters.length,8);assert.equal(data.activities.length,64);
 const ids=new Set();let questions=0;
 for(const chapter of data.chapters)assert.equal(data.activities.filter(a=>a.chapter===chapter.id).length,8);
 for(const a of data.activities){
  assert.ok(!ids.has(a.id));ids.add(a.id);
  assert.ok(data.chapters.some(c=>c.id===a.chapter));
  if(a.image)assert.ok(fs.existsSync(path.join(root,a.image)),a.image);
  for(const q of a.questions||[]){questions++;assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length);assert.equal(new Set(q.options).size,q.options.length);assert.ok(q.explanation.length>5);}
  if(a.type==='story'){assert.equal(a.frames.length,3);assert.equal(a.questions.length,2);for(const f of a.frames){assert.ok(f.text&&f.imageAlt);assert.ok(fs.existsSync(path.join(root,f.image)));}}
  if(a.type==='draw')assert.equal(a.instructions.length,4);
  if(a.type==='color')for(const part of a.parts){assert.ok(data.colors.some(c=>c.id===part.answer));assert.ok(a.svg.includes('data-part="'+part.id+'"'));}
 }
 assert.equal(questions,160);
});
test('The six requested flags have their real stripe order and the Syrian and Jordanian stars differ correctly',()=>{
 const flags=data.activities.filter(a=>a.chapter==='colors');
 assert.deepEqual(flags.slice(0,6).map(a=>a.parts.filter(p=>['top','middle','bottom'].includes(p.id)).map(p=>p.answer)),[
  ['black','white','green'],['green','white','black'],['black','white','green'],['black','red','yellow'],['red','white','blue'],['blue','yellow']]);
 const syria=flags[1],jordan=flags[2];
 assert.equal(syria.parts.filter(p=>p.id.startsWith('star')&&p.answer==='red').length,3);
 for(const match of syria.svg.matchAll(/data-part="star\d" points="([^"]+)"/g))assert.equal(match[1].split(' ').length,10);
 assert.equal(jordan.parts.find(p=>p.id==='star').answer,'white');
 assert.equal(jordan.svg.match(/data-part="star" points="([^"]+)"/)[1].split(' ').length,14);
 assert.equal(flags[0].parts.find(p=>p.id==='triangle').answer,'red');
});
