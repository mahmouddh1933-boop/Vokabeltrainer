/* Public Firebase web configuration. No Analytics or service account is loaded. */
(() => {
  "use strict";
  const projectId = "letters-from-olive";
  const hostname = location.hostname;
  const emulator =
    ["localhost", "127.0.0.1"].includes(hostname) && location.port === "5000";
  const hosting =
    [projectId + ".web.app", projectId + ".firebaseapp.com"].includes(
      hostname,
    ) ||
    (hostname.startsWith(projectId + "--") && hostname.endsWith(".web.app"));
  window.OliveFirebaseConfig = Object.freeze({
    enabled: document.documentElement.dataset.oliveHosted === "true" || (hosting && location.protocol === "https:") || emulator,
    emulator,
    accessControl: true,
    functionsRegion: "europe-west1",
    firebase: Object.freeze({
      apiKey: "AIzaSyCwWZ3SKc5jjby5oHqS-CAhwC5XQt6JqDQ",
      authDomain: "letters-from-olive.firebaseapp.com",
      projectId,
      storageBucket: "letters-from-olive.firebasestorage.app",
      messagingSenderId: "522529813150",
      appId: "1:522529813150:web:db0c754569d584f2f1c18f",
    }),
  });
})();
