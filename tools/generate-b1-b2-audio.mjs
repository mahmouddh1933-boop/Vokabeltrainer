/** Rebuild local Arabic listening reports using eSpeak-NG (synthetic voice).
 * npm install --prefix /tmp/huroof-tts @echogarden/espeak-ng-emscripten@0.3.5
 * node tools/generate-b1-b2-audio.mjs /tmp/huroof-tts/node_modules/@echogarden/espeak-ng-emscripten/espeak-ng.js
 * Requires ffmpeg. Source data is data/b1-b2-units.json; no runtime TTS service.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url));
if(!process.argv[2])throw new Error('Pass the installed espeak-ng.js module path (version 0.3.5).');
const create=(await import(pathToFileURL(path.resolve(process.argv[2])).href)).default;
const module=await create(),voice=new module.eSpeakNGWorker();
if(voice.set_voice('','ar')!==0)throw new Error('Arabic voice is unavailable.');
voice.set_rate(145);
const data=JSON.parse(fs.readFileSync(path.join(root,'data/b1-b2-units.json'),'utf8'));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'huroof-b1b2-audio-')),clips=[];
try{
 for(const unit of data.units){
  const chunks=[];voice.synthesize(unit.listening.script,samples=>{chunks.push(Buffer.from(samples.buffer,samples.byteOffset,samples.byteLength));return false;});
  const pcm=path.join(tmp,'speech.pcm');fs.writeFileSync(pcm,Buffer.concat(chunks));
  const output=path.join(root,unit.listening.audio);fs.mkdirSync(path.dirname(output),{recursive:true});
  execFileSync('ffmpeg',['-v','error','-y','-f','s16le','-ar',String(voice.get_samplerate()),'-ac','1','-i',pcm,'-af','loudnorm=I=-18:TP=-3:LRA=9','-ar','22050','-b:a','48k',output]);
  const duration=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','csv=p=0',output],{encoding:'utf8'}).trim());
  if(!(duration>5))throw new Error('Unexpected audio length: '+unit.id);
  clips.push({unit:unit.id,path:unit.listening.audio,text:unit.listening.script,duration,sha256:createHash('sha256').update(fs.readFileSync(output)).digest('hex')});
  console.log(unit.id,duration.toFixed(1)+'s');
 }
 fs.writeFileSync(path.join(root,'audio/b1-b2-manifest.json'),JSON.stringify({provider:'eSpeak-NG via @echogarden/espeak-ng-emscripten 0.3.5',voice:'ar',synthetic:true,clips},null,2)+'\n');
 // Keep standalone source and portable builds on the same canonical data.
 fs.writeFileSync(path.join(root,'js/b1-b2-units-data.js'),'window.HuroofAdvancedUnits='+JSON.stringify(data)+';\n');
}finally{fs.rmSync(tmp,{recursive:true,force:true});}
