(() => {
  "use strict";
  window.JisrStorage.ready(() => {
    const D = window.ArabicReadingTrainer;
    const app = window.VocabApp;
    const $ = (id) => document.getElementById(id);
    let lang = window.JisrStorage.local.getItem("vocabInterfaceLanguage") === "de" ? "de" : "ar";
    const t = (ar, de) => lang === "de" ? de : ar;
    const number = (n) => n.toLocaleString(lang === "ar" ? "ar" : "de");
    const el = (tag, text, className) => {
      const n = document.createElement(tag);
      if (text !== undefined) n.textContent = text;
      if (className) n.className = className;
      return n;
    };
    const button = (text, action) => {
      const b = el("button", text, "practice-button");
      b.type = "button";
      b.addEventListener("click", action);
      return b;
    };
    const validIds = new Set(D.words.map((w) => w.id));
    const saved = app.getStats().readingTrainerV1 || {};
    const ids = (v) => Array.isArray(v) ? [...new Set(v.filter((id) => validIds.has(id)))] : [];
    const state = {
      level: D.levels.some((l) => l.id === saved.level) ? saved.level : "1",
      positions: saved.positions && typeof saved.positions === "object" ? { ...saved.positions } : {},
      heard: ids(saved.heard),
      read: ids(saved.read),
      speed: saved.speed === 0.8 ? 0.8 : 1,
    };
    const bank = () => D.words.filter((w) => w.level === state.level);
    const index = () => {
      const n = state.positions[state.level];
      return Number.isInteger(n) && n >= 0 && n < bank().length ? n : 0;
    };
    const current = () => bank()[index()];
    const prefixLabel = (count) => t(count === 2 ? "أول حرفين" : `أول ${number(count)} حروف`, `erste ${count} Buchstaben`);
    const save = () => app.setJSON("learningStats", { ...app.getStats(), readingTrainerV1: state });
    const stageNames = () => ({
      letters: t("الحروف مع حركاتها", "Buchstabenlaute mit Vokalen"),
      prefixes: t("الدمج التراكمي", "Schrittweise verbinden"),
      word: t("الكلمة كاملة", "Ganzes Wort"),
    });

    // One reusable local track per word: no chained play() calls, remote TTS,
    // timer-based fake highlights or reliance on speechSynthesis boundary events.
    const audio = new Audio();
    audio.preload = "metadata";
    audio.preservesPitch = true;
    let request = 0;
    let frame = 0;
    let loadingTimer = 0;
    let session = null;
    let activeKey = "";
    let wordSpans = [];
    let letterButtons = [];
    let prefixButtons = [];
    let audioReady = false;
    let audioLoading = false;
    let preparation = 0;
    let preparationTimer = 0;
    let controller = null;
    let objectURL = null;

    function status(message, error = false) {
      $("rt-status").textContent = message;
      $("rt-status").classList.toggle("is-error", error);
    }
    function transport() {
      $("rt-listen").disabled = audioLoading;
      document.querySelectorAll("[data-play]").forEach((b) => { b.disabled = !audioReady; });
      [...letterButtons, ...prefixButtons].forEach((b) => { b.disabled = !audioReady; });
      $("rt-pause").disabled = !session || !session.started;
      $("rt-pause").textContent = audio.paused && session?.started
        ? t("استئناف", "Fortsetzen") : t("إيقاف مؤقت", "Pause");
      $("rt-stop").disabled = !session;
      $("rt-listen").setAttribute("aria-pressed", String(!!session?.full));
    }
    function prepareAudio(w) {
      const token = ++preparation;
      clearTimeout(preparationTimer);
      controller?.abort();
      controller = new AbortController();
      audioReady = false;
      audioLoading = true;
      audio.removeAttribute("src");
      audio.load();
      if (objectURL) URL.revokeObjectURL(objectURL);
      objectURL = null;
      audio.dataset.readingWord = w.id;
      audio.dataset.readingSource = w.path;
      status(t("جارٍ تحميل صوت الكلمة…", "Wortaudio wird geladen…"));
      transport();
      const live = () => token === preparation;
      const fail = () => {
        if (!live()) return;
        clearTimeout(preparationTimer);
        audioLoading = false;
        audioReady = false;
        transport();
        status(t("تعذّر تحميل صوت الكلمة. اضغط الاستماع لإعادة المحاولة، وتحقق من الاتصال أو مجلد audio في نسخة ZIP.",
          "Wortaudio konnte nicht geladen werden. Tippe zum erneuten Laden auf Anhören und prüfe die Verbindung oder den Audioordner der ZIP-Version."), true);
      };
      const load = (url) => {
        if (!live()) return;
        audio.onloadedmetadata = () => {
          if (!live()) return;
          clearTimeout(preparationTimer);
          audioLoading = false;
          audioReady = true;
          transport();
          status(t("اضغط الاستماع، ثم اقرأ الكلمة بصوتك.", "Tippe auf Anhören und lies das Wort anschließend laut."));
        };
        audio.onerror = fail;
        audio.preload = "auto";
        audio.src = url;
        audio.load();
      };
      preparationTimer = setTimeout(() => {
        if (!live()) return;
        controller.abort();
        fail();
      }, 15000);
      // Memory-backed media is seekable even on simple static hosts that do
      // not implement HTTP Range. This prevents a selected prefix/letter from
      // accidentally playing the entire earlier part of the track.
      if (location.protocol === "file:") load(w.path);
      else fetch(w.path, { signal: controller.signal })
        .then((r) => {
          if (!r.ok) throw new Error("audio-http");
          return r.arrayBuffer();
        })
        .then((bytes) => {
          if (!live()) return;
          objectURL = URL.createObjectURL(new Blob([bytes], { type: "audio/mpeg" }));
          load(objectURL);
        })
        .catch((error) => { if (error.name !== "AbortError") fail(); });
    }
    function highlight(event) {
      const key = event ? `${event.stage}:${event.index}` : "";
      if (key === activeKey) return;
      activeKey = key;
      const w = current();
      const indices = event?.stage === "letters" ? w.sounds[event.index].letters
        : event?.stage === "prefixes" ? w.prefixes[event.index].letters
          : event?.stage === "word" ? wordSpans.map((_, i) => i) : [];
      wordSpans.forEach((s, i) => s.classList.toggle("rt-active", indices.includes(i)));
      letterButtons.forEach((b, i) => b.classList.toggle("rt-active", event?.stage === "letters" && i === event.index));
      prefixButtons.forEach((b, i) => b.classList.toggle("rt-active", event?.stage === "prefixes" && i === event.index));
      document.querySelectorAll("#rt-stages li").forEach((li) => {
        if (li.dataset.stage === event?.stage) li.setAttribute("aria-current", "step");
        else li.removeAttribute("aria-current");
      });
      if (event) {
        const text = event.stage === "letters" ? w.sounds[event.index].spokenText
          : event.stage === "prefixes" ? w.prefixes[event.index].text : w.word;
        const step = event.stage === "prefixes" ? ` · ${prefixLabel(w.prefixes[event.index].count)}` : "";
        $("rt-current").textContent = `${stageNames()[event.stage]}${step}: ${text}`;
      } else $("rt-current").textContent = "";
    }
    function stop(clearStatus = true) {
      request++;
      cancelAnimationFrame(frame);
      clearTimeout(loadingTimer);
      audio.onplaying = audio.onended = audio.onerror = audio.ontimeupdate =
        audio.onloadedmetadata = audio.onwaiting = null;
      audio.pause();
      session = null;
      activeKey = "reset";
      highlight(null);
      if (clearStatus) status("");
      transport();
    }
    function finish(full) {
      const id = session?.id;
      stop(false);
      if (full && id && !state.heard.includes(id)) {
        state.heard.push(id);
        save();
        progress();
      }
      status(full ? t("أحسنت! استمعتَ للمراحل الثلاث. الآن اقرأ الكلمة بنفسك.",
        "Gut gemacht! Du hast alle drei Schritte gehört. Lies das Wort jetzt selbst.")
        : t("أحسنت، أعد النطق بصوتك أو استمع مرة أخرى.", "Sprich jetzt selbst nach oder höre noch einmal zu."));
    }
    function tick() {
      if (!session || audio.paused) return;
      const time = audio.currentTime;
      if (!session.full && time >= session.end) {
        finish(false);
        return;
      }
      const event = current().events.find((e) => time >= e.start && time < e.end);
      highlight(event || null);
    }
    function animate(token) {
      if (token !== request || !session || audio.paused) return;
      tick();
      if (session) frame = requestAnimationFrame(() => animate(token));
    }
    function play(stage = "all", onlyIndex = null) {
      if (!audioReady) {
        if (!audioLoading) prepareAudio(current());
        return;
      }
      stop();
      app.stopSpeech();
      const w = current();
      const events = stage === "all" ? w.events : w.events.filter((e) =>
        e.stage === stage && (onlyIndex === null || e.index === onlyIndex));
      if (!events.length) return;
      const token = request;
      const start = stage === "all" ? 0 : Math.max(0, events[0].start - 0.035);
      session = { id: w.id, full: stage === "all", end: events.at(-1).end, started: false };
      const live = () => token === request && session?.id === w.id;
      const fail = (error) => {
        if (!live()) return;
        stop(false);
        status(error?.name === "NotAllowedError"
          ? t("اضغط الاستماع مجددًا للسماح بالصوت وتحقق من مستوى الصوت.", "Tippe erneut auf Anhören und prüfe die Lautstärke.")
          : t("تعذّر تشغيل صوت الكلمة. أعد المحاولة وتحقّق من الاتصال، أو من وجود مجلد audio عند فتح نسخة ZIP.",
            "Wortaudio konnte nicht abgespielt werden. Versuche es erneut. Prüfe die Verbindung oder bei der ZIP-Version den Ordner audio."), true);
      };
      audio.playbackRate = state.speed;
      audio.onplaying = () => {
        if (!live()) return;
        session.started = true;
        clearTimeout(loadingTimer);
        status(t("استمع وتابع الحرف أو بداية الكلمة الملوَّنة.", "Höre zu und folge dem markierten Laut oder Wortanfang."));
        transport();
        cancelAnimationFrame(frame);
        animate(token);
      };
      audio.onwaiting = () => {
        if (live()) {
          status(t("جارٍ تحميل الصوت…", "Audio wird geladen…"));
          clearTimeout(loadingTimer);
          loadingTimer = setTimeout(() => fail(), 15000);
        }
      };
      audio.onerror = fail;
      audio.ontimeupdate = () => { if (live()) tick(); };
      audio.onended = () => { if (live()) finish(session.full); };
      status(t("جارٍ تشغيل الصوت…", "Audio wird gestartet…"));
      transport();
      loadingTimer = setTimeout(() => fail(), 15000);
      try {
        audio.currentTime = start;
        // Media is already loaded and seekable. Keep play() inside the tap.
        const result = audio.play();
        result?.catch(fail);
      } catch (error) { fail(error); }
    }
    function progress() {
      const words = bank();
      const read = words.filter((w) => state.read.includes(w.id)).length;
      const heard = words.filter((w) => state.heard.includes(w.id)).length;
      $("rt-progress-text").textContent = t(
        `استمعتُ للمراحل كاملة: ${number(heard)} / ${number(words.length)} · قرأتُ بنفسي: ${number(read)} / ${number(words.length)}`,
        `Alle Schritte gehört: ${heard} / ${words.length} · Selbst gelesen: ${read} / ${words.length}`);
      $("rt-progress").value = read;
      $("rt-progress").max = words.length;
      const isRead = state.read.includes(current().id);
      $("rt-self-read").textContent = isRead ? t("✓ قرأتُها بنفسي · اضغط لإلغاء العلامة", "✓ Selbst gelesen · Markierung entfernen")
        : t("قرأتُها بنفسي · ضع علامة", "Selbst gelesen · Markieren");
      $("rt-self-read").setAttribute("aria-pressed", String(isRead));
      $("rt-word-grid").querySelectorAll("button").forEach((b, i) => { b.dataset.read = String(state.read.includes(words[i].id)); });
    }
    function selectWord(i, fromLibrary = false) {
      stop();
      state.positions[state.level] = Math.max(0, Math.min(i, bank().length-1));
      save();
      render();
      $("rt-word").focus({ preventScroll: true });
      if (fromLibrary) $("rt-word").scrollIntoView({ block: "center", behavior: "instant" });
    }
    function render() {
      stop();
      const w = current();
      $("rt-levels").replaceChildren(...D.levels.map((l) => {
        const b = button(l[lang === "de" ? "de" : "ar"], () => {
          state.level = l.id;
          save();
          render();
        });
        b.dataset.level = l.id;
        b.setAttribute("aria-pressed", String(l.id === state.level));
        return b;
      }));
      $("rt-level-description").textContent = D.levels.find((l) => l.id === state.level).description[lang];
      $("rt-counter").textContent = `${number(index()+1)} / ${number(bank().length)}`;
      $("rt-word-select").replaceChildren(...bank().map((word, i) => {
        const option = el("option", `${number(i+1)} · ${word.word}`);
        option.value = String(i);
        return option;
      }));
      $("rt-word-select").value = String(index());
      wordSpans = w.letters.map((l) => el("span", l.text));
      $("rt-word").replaceChildren(...wordSpans);
      $("rt-word").setAttribute("aria-label", w.word);
      $("rt-meaning").textContent = w.de;
      letterButtons = w.sounds.map((sound, i) => {
        const b = button(sound.text, () => play("letters", i));
        b.setAttribute("aria-label", t(`استمع للصوت: ${sound.spokenText}`, `Laut hören: ${sound.spokenText}`));
        b.title = sound.context ? t(`نقرأه في سياقه: ${sound.spokenText}`, `Im Wortzusammenhang: ${sound.spokenText}`) : sound.text;
        return b;
      });
      prefixButtons = w.prefixes.map((prefix, i) => {
        const b = button(prefix.text, () => play("prefixes", i));
        b.setAttribute("aria-label", t(`دمج ${prefixLabel(prefix.count)}: ${prefix.text}`, `${prefixLabel(prefix.count)} verbinden: ${prefix.text}`));
        b.dataset.count = String(prefix.count);
        return b;
      });
      $("rt-letter-strip").replaceChildren(...letterButtons);
      $("rt-prefixes").replaceChildren(...prefixButtons);
      $("rt-word-grid").replaceChildren(...bank().map((word, i) => {
        const b = button(word.word, () => selectWord(i, true));
        if (i === index()) b.setAttribute("aria-current", "true");
        return b;
      }));
      $("rt-prev").disabled = index() === 0;
      $("rt-next").disabled = index() === bank().length-1;
      $("rt-speed").value = String(state.speed);
      progress();
      prepareAudio(w);
    }
    $("rt-listen").onclick = () => play();
    document.querySelectorAll("[data-play]").forEach((b) => { b.onclick = () => play(b.dataset.play); });
    $("rt-stop").onclick = () => { stop(); status(t("تم إيقاف الصوت.", "Audio gestoppt.")); };
    $("rt-pause").onclick = () => {
      if (!session) return;
      if (audio.paused) {
        const token = request;
        audio.play()?.catch(() => {
          if (token !== request) return;
          stop(false);
          status(t("اضغط زر الاستماع لإعادة تشغيل الصوت.", "Tippe auf Anhören, um erneut zu starten."), true);
        });
      } else {
        audio.pause();
        cancelAnimationFrame(frame);
        status(t("متوقف مؤقتًا. يمكنك الاستئناف من الموضع نفسه.", "Pause. Du kannst an derselben Stelle fortsetzen."));
      }
      transport();
    };
    $("rt-speed").onchange = (e) => {
      state.speed = e.target.value === "0.8" ? 0.8 : 1;
      audio.playbackRate = state.speed;
      save();
    };
    $("rt-word-select").onchange = (e) => selectWord(Number(e.target.value));
    $("rt-prev").onclick = () => selectWord(index()-1);
    $("rt-next").onclick = () => selectWord(index()+1);
    $("rt-self-read").onclick = () => {
      const id = current().id;
      state.read = state.read.includes(id) ? state.read.filter((v) => v !== id) : [...state.read, id];
      save();
      progress();
    };
    window.addEventListener("app-language-change", (event) => {
      lang = event.detail.lang === "de" ? "de" : "ar";
      render();
    });
    window.addEventListener("pagehide", () => { stop(); controller?.abort(); clearTimeout(preparationTimer); });
    window.addEventListener("pageshow", (e) => { if (e.persisted && !audioReady) prepareAudio(current()); });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else if (!audioReady) prepareAudio(current());
    });
    render();
    $("lesson-loading")?.remove();
  });
})();
