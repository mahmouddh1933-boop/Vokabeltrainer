(()=>{'use strict';
const labels={ar:'يتطلب النطق اتصالاً بالإنترنت. إذا لم يعمل، فتحقق من اتصالك أو جرّب متصفح Chrome أو Edge.',de:'Die Sprachausgabe benötigt Internet. Prüfe deine Verbindung oder verwende Chrome / Edge.'};
function speak(text){
  const lang=localStorage.getItem('lettersLanguage')==='de'?'de':'ar';
  const update=(message,error)=>{for(const id of ['letters-speech-status','enhanced-speech']){const el=document.getElementById(id);if(el){el.textContent=message;el.style.color=error?'#ad2436':'';}}};
  if(!window.VocabApp){update(labels[lang],true);return;}
  VocabApp.speakArabic(text,(message,error)=>update(error?labels[lang]+' '+message:message,error));
}
window.lettersSpeak=speak;
})();