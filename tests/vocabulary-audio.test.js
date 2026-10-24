const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const catalog=require('../data/vocab_catalog.json');
const recordings=require('../js/vocab-audio-data.js').audio;
const manifest=require('../audio/vocabulary-manifest.json');
const root=path.resolve(__dirname,'..');

test('Every one of the 2,400 vocabulary entries has an exact local recording in HTTP and inline releases',()=>{
  const words=new Set(catalog.lists.flatMap(l=>l.words.map(w=>w.ar.normalize('NFC'))));
  assert.equal(words.size,2397);
  assert.equal(manifest.catalogEntries,2400);
  assert.equal(manifest.clips.length,words.size);
  assert.deepEqual(Object.keys(recordings).sort(),[...words].sort());
  for(const clip of manifest.clips){
    assert.equal(clip.text,clip.text.normalize('NFC'));
    assert.equal(recordings[clip.text],clip.path);
    assert.match(clip.path,/^audio\/[a-z0-9/-]+\.mp3$/);
    const bytes=fs.readFileSync(path.join(root,clip.path));
    assert.ok(bytes.length>500,clip.text);
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),clip.sha256,clip.text);
    assert.ok(clip.seconds>.2 && clip.seconds<35,clip.text);
  }
  for(const name of ['lernseite','test4','review']){
    const html=fs.readFileSync(path.join(root,name+'.html'),'utf8');
    assert.ok(html.indexOf('js/vocab-audio-data.js')>=0);
    assert.ok(html.indexOf('js/vocab-audio-data.js')<html.indexOf('js/app.js'));
  }
});

test('Vowel distinctions and updated Levantine month names have separate accurate synthesis keys',()=>{
  for(const [a,b] of [['ظَهْرٌ','ظُهْرٌ'],['شَعْرٌ','شِعْرٌ']]){
    if(recordings[a.normalize('NFC')] && recordings[b.normalize('NFC')])
      assert.notEqual(recordings[a.normalize('NFC')],recordings[b.normalize('NFC')]);
  }
  const calendar=catalog.lists.find(l=>l.id==='a1_07');
  for(const word of calendar.words)assert.ok(recordings[word.ar],word.ar);
  assert.ok(recordings['ذُرَةٌ']);
  assert.equal(recordings['ذَرَةٌ'],undefined,'Do not strip vowels and accidentally play corn for an atom');
});
