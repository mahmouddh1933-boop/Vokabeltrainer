const {test}=require('node:test');
const assert=require('node:assert/strict');
const D=require('../js/verb-data.js');
const newVerbs=D.verbs.filter(v=>/^added-/.test(v.id)&&Number(v.id.slice(6))>=201);
const byForm=form=>D.verbs.find(v=>D.conjugate(v,'past',D.pronouns[8])===form);
test('Exactly 49 new verbs extend the shared catalog to 300 distinct lemmas',()=>{
 assert.equal(D.verbs.length,300);assert.equal(newVerbs.length,49);
 assert.equal(new Set(D.verbs.map(v=>v.id)).size,300);
 assert.equal(new Set(D.verbs.map(v=>D.conjugate(v,'past',D.pronouns[8]).normalize('NFC'))).size,300);
 for(const v of newVerbs){assert.equal(v.forms.past.length,14);assert.equal(v.forms.present.length,14);assert.equal(v.forms.imperative.length,5);assert.equal(v.moods.jussive.length,14);assert.equal(v.moods.subjunctive.length,14);assert.ok(v.meaning.ar&&v.meaning.de);}
});
test('Independent new-verb fixtures cover prefix vowels, hamza, doubled roots and weak-letter loss',()=>{
 const checks=[
 ['رَقَدَ','present',8,'يَرْقُدُ'],['نَهَضَ','imperative',2,'اِنْهَضْ'],['فَحَصَ','present',0,'أَفْحَصُ'],['حَفَرَ','imperative',3,'اِحْفِرِي'],
 ['حَصَدَ','imperative',2,'اُحْصُدْ'],['قَشَرَ','present',8,'يَقْشِرُ'],['عَبَرَ','present',8,'يَعْبُرُ'],
 ['أَسِفَ','present',0,'آسَفُ'],['أَلِفَ','present',0,'آلَفُ'],['نَشَأَ','past',10,'نَشَآ'],['نَشَأَ','past',12,'نَشَؤُوا'],
 ['حَدَّ','past',0,'حَدَدْتُ'],['جَرَّ','present',13,'يَجْرُرْنَ'],['لَفَّ','imperative',7,'اُلْفُفْنَ'],['صَدَّ','past-lam',8,'لَمْ يَصُدَّ'],
 ['وَعَظَ','present',8,'يَعِظُ'],['وَسَمَ','imperative',2,'سِمْ'],['وَشَمَ','past-lam',8,'لَمْ يَشِمْ'],
 ['غَابَ','past',0,'غِبْتُ'],['غَابَ','past-lam',8,'لَمْ يَغِبْ'],['شَاعَ','imperative',2,'شِعْ'],['ذَابَ','future',8,'لَنْ يَذُوبَ'],
 ['سَمَا','past',0,'سَمَوْتُ'],['سَمَا','future',8,'لَنْ يَسْمُوَ'],['نَمَا','past-lam',8,'لَمْ يَنْمُ'],['نَمَا','imperative',3,'اُنْمِي'],
 ['طَبَّقَ','present',8,'يُطَبِّقُ'],['بَسَّطَ','imperative',2,'بَسِّطْ'],['نَافَسَ','present',8,'يُنَافِسُ'],
 ['أَنْفَقَ','past',0,'أَنْفَقْتُ'],['أَتْقَنَ','present',8,'يُتْقِنُ'],['تَعَرَّفَ','past-lam',8,'لَمْ يَتَعَرَّفْ'],['تَسَامَحَ','present',8,'يَتَسَامَحُ']
 ];
 for(const [lemma,tense,index,expected]of checks){const v=byForm(lemma);assert.ok(v,lemma);const actual=['past','present','imperative'].includes(tense)?D.conjugate(v,tense,D.pronouns[index]):D.negativeForm(v,tense,D.pronouns[index]);assert.equal(actual,expected,lemma+' '+tense+' '+index);}
});
