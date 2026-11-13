const {test}=require('node:test');
const fs=require('node:fs'),path=require('node:path');
const {initializeTestEnvironment,assertSucceeds,assertFails}=require('@firebase/rules-unit-testing');
const {doc,setDoc,getDoc,serverTimestamp,Timestamp}=require('firebase/firestore');
test('Official suite rules: allowed app IDs, account isolation, separate records and revision checks',
 {skip:process.env.RUN_OFFICIAL_ACCESS_RULES!=='1'},async()=>{
 const env=await initializeTestEnvironment({projectId:'demo-huroof-suite',firestore:{host:'127.0.0.1',port:8080,rules:fs.readFileSync(path.join(__dirname,'../firestore.rules'),'utf8')}});
 const uid='suite-student',email='suite@example.test',claims={email,email_verified:true};
 const db=env.authenticatedContext(uid,claims).firestore();
 const record=value=>({schema:1,revision:1,value:JSON.stringify(value),applied:{},updatedAt:serverTimestamp()});
 try{
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(ctx=>setDoc(doc(ctx.firestore(),'oliveFreeEmails',email),{email,enabled:true,createdAt:Timestamp.now(),updatedAt:Timestamp.now()}));
  for(const app of ['start','a1-a2','b1-b2','books']){
   const ref=doc(db,'users',uid,'apps',app,'learning','learningStats');await assertSucceeds(setDoc(ref,record({app})));
   await assertSucceeds(getDoc(ref));await assertFails(setDoc(ref,{...record({}),revision:3}));
   await assertFails(setDoc(doc(db,'users',uid,'apps',app,'learning','authToken'),record('token')));
   for(const context of [env.unauthenticatedContext(),env.authenticatedContext('other-student',claims),env.authenticatedContext(uid,{...claims,email_verified:false})])await assertFails(getDoc(doc(context.firestore(),'users',uid,'apps',app,'learning','learningStats')));
   await assertSucceeds(setDoc(doc(db,'users',uid,'apps',app,'sync','state'),{schema:1,version:1,records:{},updatedAt:serverTimestamp()}));
  }
  await assertFails(setDoc(doc(db,'users',uid,'apps','unexpected','learning','learningStats'),record({})));
  await assertFails(getDoc(doc(db,'users',uid,'apps','unexpected','sync','state')));
  await assertSucceeds(setDoc(doc(db,'users',uid,'learning','learningStats'),record({legacy:true})));
 }finally{await env.cleanup()}
});
