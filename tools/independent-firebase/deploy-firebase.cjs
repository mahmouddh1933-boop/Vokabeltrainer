// Deploy only the project selected by this package's validated public configuration.
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
process.chdir(__dirname);
const check=spawnSync(process.execPath,[path.join(__dirname,'configure-firebase.cjs'),'--check'],{stdio:'inherit'});if(check.status!==0)process.exit(check.status||1);
const project=JSON.parse(fs.readFileSync('firebase-web-config.json','utf8')).projectId;
for(const service of ['firestore:rules','hosting']){
 const args=['firebase-tools','deploy','--only',service,'--project',project];
 const result=process.platform==='win32'?spawnSync(process.env.ComSpec||'cmd.exe',['/d','/s','/c','npx.cmd '+args.join(' ')],{stdio:'inherit'}):spawnSync('npx',args,{stdio:'inherit'});
 if(result.status!==0)process.exit(result.status||1);
}
console.log('Published: https://'+project+'.web.app/');
