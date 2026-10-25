const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {initializeTestEnvironment,assertSucceeds,assertFails}=require('@firebase/rules-unit-testing');
const {doc,setDoc,getDoc,getDocs,collection,updateDoc,serverTimestamp,Timestamp}=require('firebase/firestore');
test('Official Spark Rules: email approval, verified ownership, private roles, account isolation and cooperative usage records',
 {skip:process.env.RUN_OFFICIAL_ACCESS_RULES!=='1'},async()=>{
 const env=await initializeTestEnvironment({projectId:'demo-huroof-access',firestore:{host:'127.0.0.1',port:8080,rules:fs.readFileSync(path.join(__dirname,'../firestore.rules'),'utf8')}});
 const uid='spark-student',email='student@example.test',owner='spark-admin',id='a'.repeat(64),second='b'.repeat(64),third='c'.repeat(64);
 const claims={email,email_verified:true};
 const db=env.authenticatedContext(uid,claims).firestore(),admin=env.authenticatedContext(owner,{email:'owner@example.test',email_verified:true}).firestore();
 const target=doc(db,'users',uid,'learning','learningStats');
 async function allow(enabled){await env.withSecurityRulesDisabled(async ctx=>{await setDoc(doc(ctx.firestore(),'oliveFreeEmails',email),{email,enabled,createdAt:Timestamp.now(),updatedAt:Timestamp.now()});});}
 const device=()=>({label:'Chrome',agent:'test',firstSeenAt:serverTimestamp(),lastSeenAt:serverTimestamp()});
 try{
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async ctx=>{await setDoc(doc(ctx.firestore(),'oliveFreeAdmins',owner),{enabled:true});});
  await assertFails(getDoc(target));await allow(true);
  // Native verified email/password tokens are sufficient in Spark; no custom token service.
  await assertSucceeds(setDoc(target,{schema:1,revision:1,value:'{"totalTests":1}',applied:{},updatedAt:serverTimestamp()}));
  await assertSucceeds(getDoc(target));
  for(const context of [env.unauthenticatedContext(),env.authenticatedContext(uid,{...claims,email_verified:false}),env.authenticatedContext('another',claims),env.authenticatedContext(uid,{...claims,email:'outsider@example.test'})]){
   await assertFails(getDoc(doc(context.firestore(),'users',uid,'learning','learningStats')));
  }
  await assertSucceeds(getDoc(doc(db,'oliveFreeEmails',email)));
  await assertFails(getDocs(collection(db,'oliveFreeEmails')));
  await assertFails(setDoc(doc(db,'oliveFreeEmails',email),{email,enabled:true}));
  await assertFails(setDoc(doc(db,'oliveFreeAdmins',uid),{enabled:true}));
  await assertFails(setDoc(doc(admin,'oliveFreeAdmins','new-owner'),{enabled:true}));
  await assertSucceeds(getDocs(collection(admin,'oliveFreeEmails')));
  await assertSucceeds(setDoc(doc(admin,'oliveFreeEmails','new@example.test'),{email:'new@example.test',enabled:true,createdAt:serverTimestamp(),updatedAt:serverTimestamp()}));
  await assertFails(setDoc(doc(admin,'oliveFreeEmails','new@example.test'),{email:'other@example.test',enabled:true,createdAt:serverTimestamp(),updatedAt:serverTimestamp()}));
  const profile=doc(db,'oliveFreeMembers',uid);
  await assertSucceeds(setDoc(profile,{email,devices:{[id]:device()},touchedDevice:id,createdAt:serverTimestamp(),lastSeenAt:serverTimestamp()}));
  let old=(await getDoc(profile)).data();
  await assertSucceeds(setDoc(profile,{...old,devices:{...old.devices,[second]:device()},touchedDevice:second,lastSeenAt:serverTimestamp()}));
  old=(await getDoc(profile)).data();
  await assertFails(setDoc(profile,{...old,devices:{...old.devices,[third]:device()},touchedDevice:third,lastSeenAt:serverTimestamp()}));
  await assertFails(setDoc(profile,{...old,devices:{[id]:{...old.devices[id],lastSeenAt:serverTimestamp()}},touchedDevice:id,lastSeenAt:serverTimestamp()}));
  await assertFails(getDoc(doc(db,'oliveFreeMembers',owner)));
  await assertFails(getDocs(collection(db,'oliveFreeMembers')));
  await assertSucceeds(getDocs(collection(admin,'oliveFreeMembers')));
  await assertFails(setDoc(doc(db,'oliveFreeMembers',uid,'deviceBlocks',id),{blocked:false}));
  await assertSucceeds(setDoc(doc(admin,'oliveFreeMembers',uid,'deviceBlocks',id),{blocked:true}));
  await assertFails(setDoc(profile,{...old,devices:{...old.devices,[id]:{...old.devices[id],lastSeenAt:serverTimestamp()}},touchedDevice:id,lastSeenAt:serverTimestamp()}));
  // This deliberately documents the free edition's device-security limitation.
  await assertSucceeds(getDoc(target));
  await allow(false);await assertFails(getDoc(target));
  await allow(true);await assertSucceeds(getDoc(target));
 }finally{await env.cleanup();}
});
