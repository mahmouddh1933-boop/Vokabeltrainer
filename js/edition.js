/* Four complete editions share accounts, not their learning records. */
(() => {
  'use strict';
  const config=window.HuroofEditionConfig;
  const runScript=node=>new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    if(node.textContent.trim()){script.textContent=node.textContent;document.body.append(script);resolve();}
    else{script.onload=resolve;script.onerror=reject;script.src=node.dataset.authSrc;document.body.append(script);}
  });
  window.HuroofEdition=Object.freeze({...config,get suite(){
    if(config.suite)return true;
    try{return localStorage.getItem('huroofSuiteBaseV1')===new URL('../',location.href).href;}catch(_){return false;}
  },runScript});
  document.addEventListener('DOMContentLoaded',async()=>{
    if(window.OliveFirebaseConfig?.enabled||location.pathname.endsWith('/login.html'))return;
    window.JisrStorage.deferReady();
    try{for(const node of document.querySelectorAll('script[data-auth-src]')){
      try{await runScript(node);}catch(error){if(!node.dataset.authSrc.startsWith('https://cdn.jsdelivr.net/npm/xlsx@'))throw error;}
    }}
    finally{window.JisrStorage.finishReady();}
  },{once:true});
})();
