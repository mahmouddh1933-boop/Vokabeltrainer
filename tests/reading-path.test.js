const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const crypto=require('node:crypto');const D=require('../js/phonics-data');const S=require('../js/practice-data');
test('96 distinct reading tasks preserve graphemes, real letter gaps, and independent syllable fixtures',()=>{
 const ids=new Set();const strip=x=>x.normalize('NFC').replace(/[\u064b-\u0652\u0670ـ\s]/g,'');
 for(const mode of ['segment','blend','missing','family']){assert.equal(D[mode].length,24);for(const q of D[mode]){assert(!ids.has(q.id));ids.add(q.id);assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert(q.correct>=0&&q.correct<4);assert(D.audio[q.word.normalize('NFC')]);if(q.parts)assert.equal(q.parts.join(''),q.word);if(mode==='missing'){assert.equal(strip(q.display).replace('□',q.answer),strip(q.word));assert.equal(q.options[q.correct],q.answer);}if(mode==='blend')assert.equal(q.options[q.correct],q.word);}}
 const byWord=Object.fromEntries(D.segment.map(q=>[q.word,q.parts]));
 assert.deepEqual(byWord['كَتَبَ'],['كَ','تَ','بَ']);assert.deepEqual(byWord['كِتَابْ'],['كِ','تَابْ']);assert.deepEqual(byWord['أَرْنَبْ'],['أَرْ','نَبْ']);assert.deepEqual(byWord['حَلِيبْ'],['حَ','لِيبْ']);
 assert.deepEqual(D.blend.find(q=>q.word==='مَدْرَسَة').parts,['مَ','دْ','رَ','سَ','ة']);
 assert.equal(D.family.filter(q=>q.family.ar==='نهاية ـَاب').length,3);
 assert.deepEqual(D.family.filter(q=>q.family.ar==='نهاية ـَاب').map(q=>q.word),['بَاب','كِتَاب','حِسَاب']);
});
test('Expanded sentences remain unique and cover questions, commands and both vocabulary stages',()=>{
 assert.equal(S.sentences.length,120);assert.equal(new Set(S.sentences.map(q=>q.id)).size,120);assert.equal(new Set(S.sentences.map(q=>q.words.join(' '))).size,120);
 for(const level of ['A1','A2']){const qs=S.sentences.filter(q=>q.level===level);assert.equal(qs.length,60);assert(qs.filter(q=>q.kind==='question').length>=16);assert(qs.filter(q=>q.kind==='command').length>=4);}
 assert.equal(S.sentences.find(q=>q.id==='s60').words.join(' '),'أَيَّ لَوْنٍ تُحِبُّ؟');
 assert(S.sentences.some(q=>q.words.join(' ')==='لَمْ أَشْتَرِ الْحِذَاءَ لِأَنَّهُ غَالٍ'));
 assert(S.sentences.some(q=>q.words.join(' ')==='لَا تَعْبُرِ الشَّارِعَ الْآنَ'));
});
test('Every new recording has reproducible text, checksum, and a local file',()=>{
 for(const [name,data] of [['phonics',D],['sentence-expanded',require('../js/sentence-expanded-data')]]){const manifest=require('../audio/'+name+'-manifest.json');assert.equal(new Set(manifest.clips.map(c=>c.path)).size,manifest.clips.length);for(const c of manifest.clips){assert.equal(data.audio[c.text.normalize('NFC')],c.path);const bytes=fs.readFileSync(require('node:path').join(__dirname,'..',c.path));assert(bytes.length>500);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),c.sha256);}}
});
