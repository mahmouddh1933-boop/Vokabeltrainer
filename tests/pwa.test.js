const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const crypto=require('node:crypto');
const source=fs.readFileSync('pwa-worker.js','utf8');
const assets=JSON.parse(source.match(/const ASSETS = ([\s\S]*?);\n/)[1]);
test('Installable manifest uses scoped relative URLs and opaque correctly sized PNG icons',()=>{
 const m=JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));assert.equal(m.name,'حروف من الزيتون');assert.equal(m.display,'standalone');assert.equal(m.scope,'./');assert.equal(m.id,'./');assert.equal(m.start_url,'./index.html?source=pwa');
 for(const icon of m.icons){const b=fs.readFileSync(icon.src);assert.equal(b.subarray(1,4).toString(),'PNG');const size=Number(icon.sizes.split('x')[0]);assert.equal(b.readUInt32BE(16),size);assert.equal(b.readUInt32BE(20),size);assert.ok(assets[icon.src]&&!assets[icon.src].media);}
 assert.ok(m.icons.some(i=>i.purpose==='maskable'));
});
test('Worker precache inventory matches public source bytes and excludes private/API/PDF resources',()=>{
 assert.ok(assets['styles.css']&&!assets['styles.css'].media);assert.ok(assets['index.html']&&!assets['index.html'].media);assert.ok(assets['login.html']&&!assets['login.html'].media);assert.ok(assets['js/vendor/firebase/firebase-auth-compat.js']);
 for(const [name,a] of Object.entries(assets)){const bytes=fs.readFileSync(name);assert.equal(a.rev,crypto.createHash('sha256').update(bytes).digest('hex').slice(0,16),name);assert.equal(a.bytes,bytes.length);assert.ok(!name.endsWith('.pdf')&&!name.startsWith('downloads/')&&!name.includes('/users/')&&!name.includes('://'));}
 assert.equal(Object.keys(assets).filter(n=>n.endsWith('.mp3')).length,3344);assert.ok(assets['audio/skills/a1-01-listening.mp3'].media);
 for(const name of fs.readdirSync('.').filter(n=>n.endsWith('.html')&&n!=='offline.html')){const html=fs.readFileSync(name,'utf8');assert.ok(html.includes('rel="manifest"'));assert.ok(html.includes('js/pwa.js'));}
});
test('Hosting cache headers permit worker and manifest updates without weakening authentication',()=>{
 const cfg=JSON.parse(fs.readFileSync('firebase.json','utf8'));
 assert.equal(cfg.hosting.headers.find(h=>h.source==='/pwa-worker.js').headers.find(h=>h.key==='Cache-Control').value,'no-cache');
 assert.equal(cfg.hosting.headers.find(h=>h.source==='**/*.html').headers.find(h=>h.key==='Cache-Control').value,'no-store');
 const build=fs.readFileSync('tools/build-hosting.py','utf8');assert.ok(build.includes("'js/pwa.js'"));assert.ok(build.includes('data-auth-src'));assert.ok(fs.readFileSync('js/auth-session.js','utf8').includes('if (!user)'));
});
