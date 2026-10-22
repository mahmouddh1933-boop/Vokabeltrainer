(()=>{ 'use strict';
 // Show fatḥatayn on the written alif for the app's preferred spelling.
 const normalize=s=>s.replace(/\u064bا/g,'ا\u064b');
 function visit(root){
   if(!root || (root.nodeType===1 && root.matches('script,style,textarea,input,[contenteditable="true"]'))) return;
   const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
   const changes=[];
   while(walker.nextNode()){
     const n=walker.currentNode, p=n.parentElement;
     if(!p || p.closest('script,style,textarea,input,[contenteditable="true"]'))continue;
     const s=normalize(n.nodeValue);if(s!==n.nodeValue)changes.push([n,s]);
   }
   for(const [n,s] of changes)n.nodeValue=s;
 }
 window.JisrStorage.ready(()=>{
   visit(document.body);
   const obs=new MutationObserver(items=>{
     for(const m of items){
       if(m.type==='characterData'){const n=m.target;if(!n.parentElement?.closest('script,style,textarea,input,[contenteditable="true"]')){const s=normalize(n.nodeValue);if(s!==n.nodeValue)n.nodeValue=s;}}
       else for(const n of m.addedNodes){if(n.nodeType===1)visit(n);else if(n.nodeType===3 && n.parentElement && !n.parentElement.closest('script,style,textarea,input,[contenteditable="true"]')){const s=normalize(n.nodeValue);if(s!==n.nodeValue)n.nodeValue=s;}}
     }
   });
   obs.observe(document.body,{subtree:true,childList:true,characterData:true});
 });
})();
