const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
test('Two apps and two accounts keep learning data separate while sharing language preferences',()=>{
 const values=new Map(),backend={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k),key:i=>[...values.keys()][i],get length(){return values.size}};
 const source=fs.readFileSync(path.join(root,'js/storage.js'),'utf8');
 const make=id=>{const ctx={module:{exports:{}},window:{HuroofEdition:{id}},Map,Set};vm.runInNewContext(source,ctx);return ctx.module.exports.createStorage('localStorage',{localStorage:backend})};
 const basic=make('a1-a2'),advanced=make('b1-b2');basic.setScope('alice');advanced.setScope('alice');
 basic.setItem('learningStats','basic');advanced.setItem('learningStats','advanced');
 assert.deepEqual(Array.from(basic.keys()),['learningStats']);assert.deepEqual(Array.from(advanced.keys()),['learningStats']);
 assert.equal(basic.getItem('learningStats'),'basic');assert.equal(advanced.getItem('learningStats'),'advanced');
 basic.setItem('vocabInterfaceLanguage','ar');assert.equal(advanced.getItem('vocabInterfaceLanguage'),'ar');
 basic.setScope('bob');assert.equal(basic.getItem('learningStats'),null);assert.deepEqual(Array.from(basic.keys()),[]);basic.setScope('alice');assert.equal(basic.getItem('learningStats'),'basic');
});
test('Login return URLs stay inside their own application and preserve lesson fragments',()=>{
 const source=fs.readFileSync(path.join(root,'js/auth-session.js'),'utf8');
 const code=source.slice(source.indexOf('  function nextPage('),source.indexOf('  function goToLogin('));
 const next=new Function('location','URL','value',code+';return nextPage(value)');
 const location=new URL('https://example.test/books/login.html');
 assert.equal(next(location,URL,'https://example.test/books/youth-book-two-part-one.html#unit-6'),'/books/youth-book-two-part-one.html#unit-6');
 for(const value of ['https://evil.test/books/index.html','/a1-a2/skills.html','javascript:alert(1)','/books/../admin.html'])assert.equal(next(location,URL,value),'/books/index.html');
 assert.equal(next(new URL('https://example.test/login.html'),URL,'/skills.html#A2'),'/skills.html#A2');
});
test('The actual Firebase adapter selects per-app documents and retains the legacy path without an edition',()=>{
 const source=fs.readFileSync(path.join(root,'js/cloud-sync.js'),'utf8');
 const code=source.slice(source.indexOf('  function firebaseTransport('),source.indexOf('  async function recover('));
 for(const id of ['start','a1-a2','b1-b2','books',null]){
  const calls=[];const database={doc:p=>(calls.push(p),{path:p}),collection:p=>(calls.push(p),{path:p})};
  const window={HuroofEdition:id?{id}:undefined};
  new Function('database','window',code+';return firebaseTransport("alice")')(database,window);
  const base='users/alice'+(id?'/apps/'+id:'');assert.deepEqual(calls,[base+'/sync/state',base+'/learning']);
 }
});
test('Root PWA retirement removes only the monolithic cache and never app caches or learner storage',()=>{
 const source=fs.readFileSync(path.join(root,'tools/build-suite.py'),'utf8');
 const script=source.split("retire='''")[1].split("'''",1)[0];let activate;const removed=[];
 const context={URL,caches:{keys:async()=>['huroof-pwa:/:core:old','huroof-pwa:/start/:core:new','huroof-pwa:/books/:core:new'],delete:async k=>removed.push(k)},self:{addEventListener:(name,fn)=>{if(name==='activate')activate=fn},registration:{scope:'https://example.test/',unregister:async()=>{}},clients:{matchAll:async()=>[]}}};
 vm.runInNewContext(script,context);return new Promise((resolve,reject)=>activate({waitUntil:task=>task.then(()=>{assert.deepEqual(removed,['huroof-pwa:/:core:old']);resolve()},reject)}));
});
