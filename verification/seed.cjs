"use strict";
// Test helpers must never write to a real Firebase project.
if(process.env.FIREBASE_AUTH_EMULATOR_HOST!=="127.0.0.1:9099" || process.env.FIRESTORE_EMULATOR_HOST!=="127.0.0.1:8080")throw Error("Local emulators required");
const {initializeApp}=require("firebase-admin/app"),{getAuth}=require("firebase-admin/auth"),{getFirestore}=require("firebase-admin/firestore");
initializeApp({projectId:"letters-from-olive"});
(async()=>{
 const db=getFirestore(),auth=getAuth(),id=Date.now()+"-"+require("node:crypto").randomBytes(3).toString("hex"),output={};
 for(const role of ["admin","student","studentB","outsider"]){
  const email=`olive-${role.toLowerCase()}-${id}@example.test`;
  const user=await auth.createUser({email,password:"Olive-Admin-Test-123!",emailVerified:true});
  if(role==="admin")await db.doc("oliveFreeAdmins/"+user.uid).set({enabled:true});
  else if(role!=="outsider")await db.doc("oliveFreeEmails/"+email).set({email,enabled:true,createdAt:new Date(),updatedAt:new Date()});
  output[role]={email,uid:user.uid};
 }
 output.unverifiedEmail=`olive-verify-${id}@example.test`;
 await db.doc("oliveFreeEmails/"+output.unverifiedEmail).set({email:output.unverifiedEmail,enabled:true,createdAt:new Date(),updatedAt:new Date()});
 console.log(JSON.stringify(output));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
