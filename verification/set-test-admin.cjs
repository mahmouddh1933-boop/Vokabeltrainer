"use strict";
if(process.env.FIREBASE_AUTH_EMULATOR_HOST!=="127.0.0.1:9099" || process.env.FIRESTORE_EMULATOR_HOST!=="127.0.0.1:8080")throw Error("Local emulators required");
const {initializeApp}=require("firebase-admin/app"),{getFirestore}=require("firebase-admin/firestore");
const uid=process.argv[2];if(!uid||uid.includes("/")||uid.length>128)throw Error("Test UID required");
initializeApp({projectId:"letters-from-olive"});
getFirestore().doc("oliveFreeAdmins/"+uid).set({enabled:true}).then(()=>console.log("Test administrator assigned"),e=>{console.error(e.message);process.exitCode=1;});
