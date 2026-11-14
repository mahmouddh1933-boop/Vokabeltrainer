const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const data=require('../data/b1-b2-units.json'),extra=require('../data/b1-b2-grammar.json');
const build=process.env.HUROOF_B1_B2_BUILD_DIR||'/tmp/huroof-four-apps/b1-b2';
const load=name=>{const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(build,'js',name),'utf8'),context);return context.window;};
test('Forty source units have level-appropriate readings and six complete learning areas',()=>{
 assert.equal(data.units.length,40);assert.equal(new Set(data.units.map(u=>u.id)).size,40);
 for(const level of ['B1','B2'])assert.equal(data.units.filter(u=>u.level===level).length,20);
 for(const u of data.units){const count=u.reading.trim().split(/\s+/u).length;assert.equal(u.wordCount,count);assert.ok(count>=(u.level==='B1'?200:350)&&count<=(u.level==='B1'?350:600),u.id);assert.ok(u.vocabulary.length>=8);assert.ok(u.grammar.body&&u.grammar.example);assert.ok(u.speaking.length>=3);assert.ok(u.writing);for(const bank of [u.readingQuiz,u.vocabularyQuiz,u.grammar.quiz,u.listening.quiz])for(const q of bank){assert.ok(q.q);assert.ok(q.a>=0&&q.a<q.opts.length);assert.equal(new Set(q.opts).size,q.opts.length);}}
});
test('Both editions retain identical complete 251-verb data and mood overrides',()=>{
 const advanced=require(path.join(build,'js/verb-data.js')),beginner=require(path.join(path.dirname(build),'a1-a2/js/verb-data.js'));assert.equal(advanced.verbs.length,251);assert.deepEqual(advanced.verbs,beginner.verbs);
 for(const verb of advanced.verbs)for(const mode of ['past','present','past-lam','future','prohibition'])for(const p of mode==='prohibition'?advanced.imperativePronouns:advanced.pronouns)assert.equal(advanced.negativeForm(verb,mode,p),beginner.negativeForm(verb,mode,p));
});
test('B1/B2 grammar contains passive transformations and weak/geminated active participles',()=>{
 const g=load('grammar-data.js').ArabicGrammarData,passive=g.lessons.find(l=>l.id==='passive-voice'),active=g.lessons.find(l=>l.id==='active-participle');assert.ok(passive);assert.equal(passive.questions.length,12);assert.ok(active.questions.length>=22);
 for(const form of ['مَادٌّ','رَادٌّ','الْبَائِعُ','قَاضٍ','قَاضِيًا','قَاضِي'])assert.ok(JSON.stringify(active).includes(form),form);
 for(const form of ['قِيلَ','بِيعَ','دُعِيَ','يُدْعَى','يُمَدُّ'])assert.ok(JSON.stringify(passive).includes(form),form);
 assert.ok(g.stages.some(s=>s.ids.includes('passive-voice')));
});
test('Advanced navigation exposes units without removing vocabulary quiz pages',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(build,'edition-manifest.json')));assert.ok(manifest.routes.some(r=>r.href==='texts.html'));assert.ok(manifest.pages.includes('test.html'));assert.ok(!manifest.routes.some(r=>r.href==='test.html'));assert.ok(manifest.statFields.includes('advancedUnitsV1'));
 const source=fs.readFileSync(path.join(build,'js/design.js'),'utf8');assert.ok(!source.includes('Vokabeltests'));assert.equal(manifest.counts.verbs,251);assert.equal(manifest.counts.advancedUnits,40);
});
test('Every listening report ships matching audio and verified PWA inventory bytes',()=>{
 const manifest=require('../audio/b1-b2-manifest.json');assert.equal(manifest.clips.length,40);
 const worker=fs.readFileSync(path.join(build,'pwa-worker.js'),'utf8'),assets=JSON.parse(worker.match(/const ASSETS = (.*);\nconst BASE/)[1]);
 for(const u of data.units){const clip=manifest.clips.find(c=>c.unit===u.id);assert.equal(clip.text,u.listening.script);assert.ok(clip.duration>5);const bytes=fs.readFileSync(path.join(build,u.listening.audio)),hash=crypto.createHash('sha256').update(bytes).digest('hex');assert.equal(hash,clip.sha256);assert.equal(assets[u.listening.audio].rev,hash.slice(0,16));}
 for(const name of ['texts.html','js/b1-b2-units-data.js','images/brand/olive-symbol.svg','images/pwa/icon-512.png']){const bytes=fs.readFileSync(path.join(build,name));assert.equal(assets[name].rev,crypto.createHash('sha256').update(bytes).digest('hex').slice(0,16));}
});
