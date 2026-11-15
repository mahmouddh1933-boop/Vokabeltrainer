// Apply only public Firebase WEB configuration; never use a service-account key.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=__dirname,publicDir=path.join(root,'public');
const digest=value=>crypto.createHash('sha256').update(value).digest('hex');
const fail=message=>{throw new Error(message)};
function read(filename){const bytes=fs.readFileSync(filename);return (bytes[0]===255&&bytes[1]===254?bytes.subarray(2).toString('utf16le'):bytes.toString('utf8')).replace(/^\uFEFF/,'')}
function parse(text){
 let value;try{value=JSON.parse(text)}catch{}
 if(value?.private_key||value?.type==='service_account')fail('Use the public WEB config, never a private service-account key.');
 value=value?.result??value;value=value?.sdkConfig??value;
 if(value?.fileContents)return parse(value.fileContents);
 if(value&&typeof value==='object')return value;
 const result={};for(const key of ['apiKey','authDomain','projectId','storageBucket','messagingSenderId','appId','databaseURL']){
  const match=text.match(new RegExp('["\\\']?'+key+'["\\\']?\\s*:\\s*["\\\']([^"\\\']+)["\\\']'));if(match)result[key]=match[1];
 }return result;
}
function validate(c){
 if(!/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(c.projectId||''))fail('Invalid Firebase Project ID.');
 if(!/^[\w-]{20,}$/.test(c.apiKey||''))fail('Missing or invalid public apiKey.');
 if(!/^[a-z0-9.-]+$/.test(c.authDomain||''))fail('Missing authDomain.');
 if(!/^\d+:\d+:web:[a-zA-Z0-9]+$/.test(c.appId||''))fail('Use the App ID of a Firebase WEB app.');
 if(c.private_key)fail('Private keys are not accepted.');
 if(Object.values(c).some(v=>typeof v==='string'&&/[<>\u0000-\u001f]/.test(v)))fail('Invalid characters in public configuration.');
}
try{
 const file=path.resolve(root,process.argv[2]&&process.argv[2]!=='--check'?process.argv[2]:'firebase-web-config.json');
 if(!fs.existsSync(file))fail('Save this project’s public WEB configuration as firebase-web-config.json first.');
 const input=parse(read(file));validate(input);
 const keys=['apiKey','authDomain','projectId','storageBucket','messagingSenderId','appId','databaseURL'];
 const config=Object.fromEntries(keys.filter(k=>typeof input[k]==='string').map(k=>[k,input[k]]));
 if(process.argv.includes('--check')){
  const selected=JSON.parse(read(path.join(root,'.firebaserc'))).projects?.default;
  if(selected!==config.projectId)fail('The selected Firebase project does not match the app configuration.');
  if(process.env.GCLOUD_PROJECT&&process.env.GCLOUD_PROJECT!==config.projectId)fail('Deployment target differs from this app’s project.');
  const installed=read(path.join(publicDir,'js/firebase-config.js'));
  if(!installed.includes(JSON.stringify(config)))fail('Run node configure-firebase.cjs before deployment.');
  console.log('READY '+config.projectId);process.exit(0);
 }
 const block='/* HUROOF_INDEPENDENT_FIREBASE_BEGIN */\n'+
 '(()=>{const emulator=["localhost","127.0.0.1"].includes(location.hostname)&&location.port==="5000";window.OliveFirebaseConfig=Object.freeze({enabled:true,emulator,accessControl:true,accessMode:"spark",firebase:Object.freeze('+JSON.stringify(config)+')});})();\n'+
 '/* HUROOF_INDEPENDENT_FIREBASE_END */';
 const pattern=/\/\* HUROOF_INDEPENDENT_FIREBASE_BEGIN \*\/[\s\S]*?\/\* HUROOF_INDEPENDENT_FIREBASE_END \*\//g;
 const files=fs.readdirSync(publicDir).filter(n=>n.endsWith('.html')).map(n=>path.join(publicDir,n));files.push(path.join(publicDir,'js/firebase-config.js'));
 let count=0;for(const filename of files){const source=read(filename);if(source.includes('HUROOF_INDEPENDENT_FIREBASE_BEGIN')){fs.writeFileSync(filename,source.replace(pattern,()=>block));count++}}
 if(count<2)fail('Firebase configuration markers are missing from the package.');
 fs.writeFileSync(path.join(root,'.firebaserc'),JSON.stringify({projects:{default:config.projectId}},null,2)+'\n');
 // Persist normalized public metadata for deployment and repeatable validation.
 fs.writeFileSync(path.join(root,'firebase-web-config.json'),JSON.stringify(config,null,2)+'\n');
 const workerFile=path.join(publicDir,'pwa-worker.js');let worker=read(workerFile);
 const assets=JSON.parse(worker.match(/const ASSETS = (.*);\nconst BASE/)[1]);
 for(const [name,meta]of Object.entries(assets)){const bytes=fs.readFileSync(path.join(publicDir,name));meta.rev=digest(bytes).slice(0,16);meta.bytes=bytes.length}
 const payload=JSON.stringify(assets);worker=worker.replace(/const ASSETS = .*;\nconst BASE/,()=>`const ASSETS = ${payload};\nconst BASE`).replace(/const RELEASE = "[^"]+";/,`const RELEASE = "${digest(payload).slice(0,16)}";`);fs.writeFileSync(workerFile,worker);
 console.log('CONFIGURED '+config.projectId+' — '+count+' app files; offline cache refreshed.');
 console.log('Next: enable Email/Password and create the default Firestore database in this project. Then run node deploy-firebase.cjs.');
}catch(error){console.error(error.message);process.exitCode=1}
