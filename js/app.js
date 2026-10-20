(function () {
    "use strict";
  const localStorage = window.JisrStorage.local;
  const sessionStorage = window.JisrStorage.session;

    const KEYS = {
        stats: "learningStats",
        wrongWords: "wrongWords",
        studiedWords: "studiedWords",
        listMastery: "listMasteryV12",
        currentVocab: "vocabList",
        currentSource: "currentVocabSource",
        testResults: "testResults",
        lastTestOutcome: "lastTestOutcomeV12"
    };

    const TEST_DURATION_KEY = "vocabTestDurationSeconds";
    const TEST_DURATIONS = [60, 90, 120];

    function getTestDuration() {
        try {
            const value = Number(localStorage.getItem(TEST_DURATION_KEY));
            return TEST_DURATIONS.includes(value) ? value : 60;
        } catch (_) {
            return 60;
        }
    }

    function setTestDuration(seconds) {
        const value = Number(seconds);
        if (!TEST_DURATIONS.includes(value)) return false;
        try { localStorage.setItem(TEST_DURATION_KEY, String(value)); } catch (_) {}
        return true;
    }

    const TEST_CONFIG = {
        writing: { label: "الكتابة", icon: "✍️", requiredScore: 80, requiredPasses: 2 },
        choice: { label: "الاختيار من متعدد", icon: "✅", requiredScore: 80, requiredPasses: 2 },
        letters: { label: "الحروف الناقصة", icon: "🔤", requiredScore: 80, requiredPasses: 2 },
        listening: { label: "الاستماع", icon: "🔊", requiredScore: 80, requiredPasses: 2 },
        scramble: { label: "ترتيب الحروف المبعثرة", icon: "🧩", requiredScore: 80, requiredPasses: 2 },
        connected: { label: "إكمال الحروف المتصلة", icon: "🔗", requiredScore: 80, requiredPasses: 2 }
    };

    const DEFAULT_STATS = {
        totalTests: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        bestScore: 0,
        lastScore: 0,
        perfectTests: 0,
        qualifyingTests: 0
    };

    function getJSON(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            if (raw === null) return fallback;
            const value = JSON.parse(raw);
            return value ?? fallback;
        } catch (_) {
            return fallback;
        }
    }

    function setJSON(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function stripArabicDiacritics(value) {
        return String(value ?? "")
            .normalize("NFC")
            .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/gu, "");
    }

    function normalizeAnswer(value, options) {
        const opts = options || {};
        let text = String(value ?? "")
            .normalize("NFC")
            .replace(/\u0640/g, "")
            .replace(/\s+/g, " ")
            .trim()
            .toLocaleLowerCase();
        if (opts.ignoreArabicDiacritics) text = stripArabicDiacritics(text);
        return text;
    }

    function isCorrect(answer, correct, compareMode) {
        const ignoreArabicDiacritics = compareMode === "arabic" || compareMode === "arabic-ignore-diacritics";
        return normalizeAnswer(answer, { ignoreArabicDiacritics }) === normalizeAnswer(correct, { ignoreArabicDiacritics });
    }

    function wordKey(arabic, german) {
        return `${normalizeAnswer(arabic, { ignoreArabicDiacritics: true })}|||${normalizeAnswer(german)}`;
    }

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function shuffle(values) {
        const array = [...values];
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function getCurrentVocabList() {
        const list = getJSON(KEYS.currentVocab, []);
        return Array.isArray(list) ? list.filter(item => Array.isArray(item) && item.length >= 2) : [];
    }

    function getCurrentSource() {
        return getJSON(KEYS.currentSource, {});
    }

    function saveVocabList(vocabList, sourceInfo) {
        const cleaned = (Array.isArray(vocabList) ? vocabList : [])
            .map(item => [String(item?.[0] ?? "").trim(), String(item?.[1] ?? "").trim()])
            .filter(([ar, de]) => ar && de);
        setJSON(KEYS.currentVocab, cleaned);
        setJSON("arabicList", cleaned.map(([ar]) => ar));
        setJSON(KEYS.currentSource, sourceInfo || {});
        return cleaned;
    }

    function getStats() {
        return { ...DEFAULT_STATS, ...getJSON(KEYS.stats, {}) };
    }

    function getWrongWords() {
        const words = getJSON(KEYS.wrongWords, []);
        return Array.isArray(words) ? words : [];
    }

    function saveWrongWords(words) {
        setJSON(KEYS.wrongWords, Array.isArray(words) ? words : []);
    }

    function getStudiedWords() {
        const words = getJSON(KEYS.studiedWords, []);
        return Array.isArray(words) ? words : [];
    }

    function markStudied(arabic, german) {
        if (!arabic || !german) return;
        const words = getStudiedWords();
        const key = wordKey(arabic, german);
        if (!words.some(item => item.key === key)) {
            words.push({ key, arabic, german, firstSeen: new Date().toISOString() });
            setJSON(KEYS.studiedWords, words);
        }
    }

    function addWrongWord(arabic, german, testType) {
        if (!arabic || !german) return;
        const words = getWrongWords();
        const key = wordKey(arabic, german);
        const existing = words.find(item => item.key === key);
        const now = new Date().toISOString();
        if (existing) {
            existing.mistakes = Number(existing.mistakes || 0) + 1;
            existing.lastWrong = now;
            existing.lastTest = testType || existing.lastTest || "";
        } else {
            words.push({ key, arabic, german, mistakes: 1, firstWrong: now, lastWrong: now, lastTest: testType || "" });
        }
        words.sort((a, b) => Number(b.mistakes || 0) - Number(a.mistakes || 0));
        saveWrongWords(words);
    }

    function removeWrongWord(arabic, german) {
        const key = wordKey(arabic, german);
        const words = getWrongWords();
        const filtered = words.filter(item => item.key !== key);
        saveWrongWords(filtered);
        return filtered.length !== words.length;
    }

    function simpleHash(value) {
        let hash = 2166136261;
        const text = String(value || "");
        for (let i = 0; i < text.length; i++) {
            hash ^= text.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        return (hash >>> 0).toString(36);
    }

    function getSourceKey(sourceInfo, vocabList) {
        const source = sourceInfo || {};
        if (source.type === "ready-list" && source.id) return `ready-list:${source.id}`;
        const vocab = Array.isArray(vocabList) ? vocabList : [];
        const signature = vocab.map(item => Array.isArray(item) ? wordKey(item[0], item[1]) : wordKey(item?.ar, item?.de)).join("##");
        if (source.type === "excel") return `excel:${normalizeAnswer(source.title || "excel")}:${simpleHash(signature)}`;
        return `custom:${simpleHash(signature || JSON.stringify(source))}`;
    }

    function getMasteryMap() {
        const map = getJSON(KEYS.listMastery, {});
        return map && typeof map === "object" && !Array.isArray(map) ? map : {};
    }

    function makeMasteryRecord(sourceInfo, vocabList) {
        const source = sourceInfo || {};
        const tests = {};
        Object.keys(TEST_CONFIG).forEach(type => {
            tests[type] = { attempts: 0, qualifyingPasses: 0, bestScore: 0, lastScore: 0, lastAttemptAt: null };
        });
        return {
            sourceKey: getSourceKey(source, vocabList),
            title: source.title || "القائمة الحالية",
            type: source.type || "custom",
            sourceId: source.id || null,
            cefr: source.cefr || null,
            tests,
            mastered: false,
            masteredAt: null,
            updatedAt: null
        };
    }

    function normalizeMasteryRecord(record, sourceInfo, vocabList) {
        const base = makeMasteryRecord(sourceInfo, vocabList);
        const merged = { ...base, ...(record || {}), tests: { ...base.tests } };
        Object.keys(TEST_CONFIG).forEach(type => {
            merged.tests[type] = { ...base.tests[type], ...(record?.tests?.[type] || {}) };
            merged.tests[type].qualifyingPasses = Math.min(TEST_CONFIG[type].requiredPasses, Math.max(0, Number(merged.tests[type].qualifyingPasses || 0)));
        });
        merged.mastered = Object.keys(TEST_CONFIG).every(type => merged.tests[type].qualifyingPasses >= TEST_CONFIG[type].requiredPasses);
        return merged;
    }

    function getListMasteryProgress(sourceInfo, vocabList) {
        const map = getMasteryMap();
        const key = getSourceKey(sourceInfo, vocabList);
        const record = normalizeMasteryRecord(map[key], sourceInfo, vocabList);
        const requiredPasses = Object.values(TEST_CONFIG).reduce((sum, config) => sum + config.requiredPasses, 0);
        const completedPasses = Object.keys(TEST_CONFIG).reduce((sum, type) => sum + Math.min(TEST_CONFIG[type].requiredPasses, Number(record.tests[type].qualifyingPasses || 0)), 0);
        return {
            sourceKey: key,
            title: record.title,
            tests: record.tests,
            completedPasses,
            requiredPasses,
            percentage: requiredPasses ? Math.round((completedPasses / requiredPasses) * 100) : 0,
            mastered: completedPasses >= requiredPasses,
            masteredAt: record.masteredAt || null
        };
    }

    function getCurrentListMasteryProgress() {
        return getListMasteryProgress(getCurrentSource(), getCurrentVocabList());
    }

    function updateListMastery(testType, score) {
        if (!TEST_CONFIG[testType]) return null;
        const source = getCurrentSource();
        const vocab = getCurrentVocabList();
        const key = getSourceKey(source, vocab);
        const map = getMasteryMap();
        const before = normalizeMasteryRecord(map[key], source, vocab);
        const wasMastered = before.mastered;
        const test = { ...before.tests[testType] };
        const config = TEST_CONFIG[testType];
        const now = new Date().toISOString();
        const qualifies = Number(score) >= config.requiredScore;
        const previousPasses = Number(test.qualifyingPasses || 0);
        const counted = qualifies && previousPasses < config.requiredPasses;

        test.attempts = Number(test.attempts || 0) + 1;
        test.lastScore = Number(score) || 0;
        test.bestScore = Math.max(Number(test.bestScore || 0), Number(score) || 0);
        test.lastAttemptAt = now;
        if (counted) test.qualifyingPasses = previousPasses + 1;

        before.tests[testType] = test;
        before.updatedAt = now;
        before.mastered = Object.keys(TEST_CONFIG).every(type => before.tests[type].qualifyingPasses >= TEST_CONFIG[type].requiredPasses);
        if (before.mastered && !wasMastered) before.masteredAt = now;
        map[key] = before;
        setJSON(KEYS.listMastery, map);

        const progress = getListMasteryProgress(source, vocab);
        return {
            testType,
            score: Number(score) || 0,
            qualifies,
            counted,
            passCount: Number(test.qualifyingPasses || 0),
            requiredPasses: config.requiredPasses,
            requiredScore: config.requiredScore,
            newlyMastered: before.mastered && !wasMastered,
            ...progress
        };
    }

    function getMasterySummary() {
        const map = getMasteryMap();
        const records = Object.values(map);
        let masteredLists = 0;
        let completedPasses = 0;
        records.forEach(raw => {
            const tests = raw?.tests || {};
            let all = true;
            Object.keys(TEST_CONFIG).forEach(type => {
                const passes = Math.min(TEST_CONFIG[type].requiredPasses, Number(tests[type]?.qualifyingPasses || 0));
                completedPasses += passes;
                if (passes < TEST_CONFIG[type].requiredPasses) all = false;
            });
            if (all) masteredLists += 1;
        });
        return { trackedLists: records.length, masteredLists, completedPasses };
    }


    // Remember the previous question set separately for each test and vocabulary source.
    function selectFreshTestWords(vocab, testType, limit = 5) {
        if (!Array.isArray(vocab) || !vocab.length) return [];
        const count = Math.min(limit, vocab.length);
        const source = getSourceKey(getCurrentSource(), vocab);
        const storageKey = 'vocabPreviousQuestions:' + testType + ':' + source;
        let previous = [];
        try { previous = JSON.parse(sessionStorage.getItem(storageKey) || '[]'); } catch (_) {}
        const keyOf = word => JSON.stringify([word[0], word[1]]);
        const previousSet = new Set(previous);
        const fresh = shuffle(vocab.filter(w => !previousSet.has(keyOf(w))));
        const repeated = shuffle(vocab.filter(w => previousSet.has(keyOf(w))));
        const selected = fresh.concat(repeated).slice(0, count);
        // Even if every question must be repeated, vary their order when possible.
        if (selected.length > 1 && previous.length === selected.length && selected.every((w, i) => keyOf(w) === previous[i])) {
            selected.push(selected.shift());
        }
        try { sessionStorage.setItem(storageKey, JSON.stringify(selected.map(keyOf))); } catch (_) {}
        return selected;
    }
    function recordTestResults(results, testType) {
        if (!Array.isArray(results) || !results.length) return null;
        const stats = getStats();
        let correctCount = 0;

        results.forEach(result => {
            markStudied(result.arabic, result.german);
            const correct = isCorrect(result.answer, result.correct, result.compareMode);
            if (correct) correctCount += 1;
            else addWrongWord(result.arabic, result.german, testType);
        });

        const score = Math.round((correctCount / results.length) * 100);
        stats.totalTests = Number(stats.totalTests || 0) + 1;
        stats.totalQuestions = Number(stats.totalQuestions || 0) + results.length;
        stats.correctAnswers = Number(stats.correctAnswers || 0) + correctCount;
        stats.wrongAnswers = Number(stats.wrongAnswers || 0) + (results.length - correctCount);
        stats.lastScore = score;
        stats.bestScore = Math.max(Number(stats.bestScore || 0), score);
        if (correctCount === results.length) stats.perfectTests = Number(stats.perfectTests || 0) + 1;
        if (score >= 80) stats.qualifyingTests = Number(stats.qualifyingTests || 0) + 1;
        setJSON(KEYS.stats, stats);

        const mastery = updateListMastery(testType, score);
        const outcome = {
            testType,
            score,
            correctCount,
            total: results.length,
            recordedAt: new Date().toISOString(),
            mastery
        };
        setJSON(KEYS.lastTestOutcome, outcome);
        return outcome;
    }

    function getLastTestOutcome() {
        return getJSON(KEYS.lastTestOutcome, null);
    }

    function getCurrentVocabProgress() {
        const vocabList = getCurrentVocabList();
        const studiedSet = new Set(getStudiedWords().map(item => item.key));
        const keys = [...new Set(vocabList.map(item => wordKey(item[0], item[1])))];
        const studied = keys.filter(key => studiedSet.has(key)).length;
        const mastery = getCurrentListMasteryProgress();
        return {
            total: keys.length,
            studied,
            studiedPercentage: keys.length ? Math.round((studied / keys.length) * 100) : 0,
            masteryPercentage: mastery.percentage,
            masteredPercentage: mastery.percentage,
            completedPasses: mastery.completedPasses,
            requiredPasses: mastery.requiredPasses,
            listMastered: mastery.mastered,
            mastery
        };
    }

    function getListProgress(words, sourceInfo) {
        const pairs = (Array.isArray(words) ? words : []).map(item => Array.isArray(item) ? [item[0], item[1]] : [item?.ar, item?.de]).filter(([ar, de]) => ar && de);
        const studiedSet = new Set(getStudiedWords().map(item => item.key));
        const keys = [...new Set(pairs.map(([ar, de]) => wordKey(ar, de)))];
        const studied = keys.filter(key => studiedSet.has(key)).length;
        const mastery = getListMasteryProgress(sourceInfo || {}, pairs);
        return {
            total: keys.length,
            studied,
            studiedPercentage: keys.length ? Math.round((studied / keys.length) * 100) : 0,
            masteryPercentage: mastery.percentage,
            masteredPercentage: mastery.percentage,
            completedPasses: mastery.completedPasses,
            requiredPasses: mastery.requiredPasses,
            listMastered: mastery.mastered,
            mastery
        };
    }

    function getTestLabel(type) {
        return TEST_CONFIG[type]?.label || type || "الاختبار";
    }

    async function loadCatalog() {
        try {
            const response = await fetch("./data/vocab_catalog.json", { cache: "no-store" });
            if (response.ok) {
                const payload = await response.json();
                if (payload && Array.isArray(payload.lists)) return payload;
            }
        } catch (_) {
            // file:// may block fetch; use generated fallback below.
        }
        if (window.VOCAB_CATALOG_FALLBACK && Array.isArray(window.VOCAB_CATALOG_FALLBACK.lists)) return window.VOCAB_CATALOG_FALLBACK;
        throw new Error("تعذّر تحميل بيانات القوائم الجاهزة.");
    }

    let cachedVoices = [];
    let activeUtterance = null;
    let activeOnlineAudio = null;
    let reusableAudio = null;
    let speechTimer = null;
    let speechInitialized = false;
    let speechRequestId = 0;
    const speechText = (ar, de) =>
      localStorage.getItem("vocabInterfaceLanguage") === "de" ? de : ar;

    function refreshVoices() {
      if (!("speechSynthesis" in window)) return [];
      try {
        const voices = window.speechSynthesis.getVoices() || [];
        if (voices.length) cachedVoices = voices;
      } catch (_) {}
      return cachedVoices;
    }
    function getArabicVoices() {
      return refreshVoices().filter(
        (voice) =>
          /^ar(?:[-_]|$)/i.test(voice.lang || "") ||
          /arabic|عربي/i.test(voice.name || ""),
      );
    }
    function chooseArabicVoice() {
      const voices = getArabicVoices();
      return (
        voices.find((v) => /^ar[-_]SA$/i.test(v.lang)) ||
        voices.find((v) => v.default) ||
        voices[0] ||
        null
      );
    }
    function getSpeechSupport() {
      const localSupported =
        "speechSynthesis" in window &&
        typeof SpeechSynthesisUtterance !== "undefined";
      return {
        supported: localSupported || typeof Audio !== "undefined",
        localSupported,
        onlineFallback: typeof Audio !== "undefined",
        arabicVoice: localSupported ? chooseArabicVoice() : null,
        arabicVoices: localSupported ? getArabicVoices() : [],
      };
    }
    function initSpeech(onReady) {
      if (!("speechSynthesis" in window)) {
        if (typeof onReady === "function") onReady(getSpeechSupport());
        return;
      }
      refreshVoices();
      if (!speechInitialized) {
        speechInitialized = true;
        window.speechSynthesis.addEventListener?.("voiceschanged", refreshVoices);
      }
      if (typeof onReady === "function") onReady(getSpeechSupport());
    }
    function stopSpeech() {
      speechRequestId++;
      clearTimeout(speechTimer);
      speechTimer = null;
      // Detach stale handlers before cancel/pause: mobile engines may emit a late end/error.
      if (activeUtterance)
        activeUtterance.onstart =
          activeUtterance.onend =
          activeUtterance.onerror =
            null;
      activeUtterance = null;
      try {
        window.speechSynthesis?.cancel();
      } catch (_) {}
      if (activeOnlineAudio) {
        activeOnlineAudio.onplaying =
          activeOnlineAudio.onended =
          activeOnlineAudio.onerror =
            null;
        try {
          activeOnlineAudio.pause();
          activeOnlineAudio.currentTime = 0;
        } catch (_) {}
        activeOnlineAudio = null;
      }
    }
    function getOnlineTTSUrls(text) {
      const encoded = encodeURIComponent(text);
      return [
        `https://translate.google.com/translate_tts?ie=UTF-8&client=gtx&tl=ar&q=${encoded}`,
        `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=ar&q=${encoded}`,
      ];
    }
    function speakArabic(text, onStatus) {
      const value = String(text || "")
        .trim()
        .normalize("NFC");
      if (!value) return false;
      stopSpeech();
      const requestId = speechRequestId;
      const current = () => requestId === speechRequestId;
      const status = (ar, de, error = false) => {
        if (current() && typeof onStatus === "function")
          onStatus(speechText(ar, de), error);
      };
      const blocked = () =>
        status(
          "اضغط زر الاستماع مرة أخرى للسماح بالصوت، وتحقق من مستوى الصوت.",
          "Tippe erneut auf Anhören, um Audio zu erlauben, und prüfe die Lautstärke.",
          true,
        );
      const unavailable = () =>
        status(
          "تعذّر تشغيل الصوت. تحقق من الاتصال أو فعّل صوتًا عربيًا في إعدادات النطق بالجهاز.",
          "Audio nicht verfügbar. Prüfe die Verbindung oder aktiviere eine arabische Stimme in den Spracheinstellungen des Geräts.",
          true,
        );
      function playMedia(url, fallback, recorded) {
        if (!current()) return;
        if (typeof Audio === "undefined") {
          fallback();
          return;
        }
        const audio = reusableAudio || (reusableAudio = new Audio());
        activeOnlineAudio = audio;
        let settled = false;
        let started = false;
        const fail = (error) => {
          if (settled || !current()) return;
          settled = true;
          clearTimeout(speechTimer);
          audio.onplaying = audio.onended = audio.onerror = null;
          try {
            audio.pause();
          } catch (_) {}
          activeOnlineAudio = null;
          if (error?.name === "NotAllowedError") blocked();
          else fallback();
        };
        audio.preload = "auto";
        audio.onplaying = () => {
          if (!current() || settled) return;
          started = true;
          clearTimeout(speechTimer);
          status("🔊 يتم تشغيل النطق…", "🔊 Aussprache wird abgespielt…");
        };
        audio.onended = () => {
          if (!current() || settled) return;
          settled = true;
          clearTimeout(speechTimer);
          activeOnlineAudio = null;
          status("تم تشغيل النطق.", "Aussprache abgespielt.");
        };
        audio.onerror = fail;
        audio.src = url;
        status(
          recorded ? "جارٍ تشغيل الصوت…" : "جارٍ تحميل النطق عبر الإنترنت…",
          recorded ? "Audio wird gestartet…" : "Online-Aussprache wird geladen…",
        );
        // play() stays in the click handler. Reuse this element on iOS/Android.
        try {
          audio.play()?.catch(fail);
        } catch (error) {
          fail(error);
        }
        if (!started && !settled && current())
          speechTimer = setTimeout(() => fail(), 8000);
      }
      function online(index = 0) {
        if (!current()) return;
        const urls = getOnlineTTSUrls(value);
        if (index >= urls.length) {
          unavailable();
          return;
        }
        playMedia(urls[index], () => online(index + 1), false);
      }
      function local() {
        if (!current()) return;
        const supported =
          "speechSynthesis" in window &&
          typeof SpeechSynthesisUtterance !== "undefined";
        if (!supported) {
          online();
          return;
        }
        initSpeech();
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(value);
        activeUtterance = utterance;
        const voice = chooseArabicVoice();
        if (voice) utterance.voice = voice;
        // Empty voice lists are normal on mobile before the first spoken request.
        utterance.lang = voice?.lang || "ar-SA";
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        let resolved = false;
        let started = false;
        const fallback = (event) => {
          if (resolved || !current()) return;
          resolved = true;
          clearTimeout(speechTimer);
          utterance.onstart = utterance.onend = utterance.onerror = null;
          activeUtterance = null;
          try {
            synth.cancel();
          } catch (_) {}
          if (event?.error === "not-allowed") blocked();
          else online();
        };
        utterance.onstart = () => {
          if (!current() || resolved) return;
          started = true;
          clearTimeout(speechTimer);
          status("🔊 يتم تشغيل صوت الجهاز…", "🔊 Gerätestimme wird abgespielt…");
        };
        utterance.onend = () => {
          if (!current() || resolved) return;
          resolved = true;
          clearTimeout(speechTimer);
          activeUtterance = null;
          status("تم تشغيل النطق.", "Aussprache abgespielt.");
        };
        utterance.onerror = fallback;
        status("جارٍ تشغيل صوت الجهاز…", "Gerätestimme wird gestartet…");
        try {
          if (synth.paused) synth.resume();
          // No await, timer, or network request before speak(): preserve the tap gesture.
          synth.speak(utterance);
          if (!started && !resolved && current())
            speechTimer = setTimeout(() => fallback(), 2500);
        } catch (_) {
          fallback();
        }
      }
      const recording =
        window.ArabicLetterData?.audio[value] ||
        window.ArabicPracticeData?.audio[value] ||
        window.ArabicBookData?.audio[value] ||
        window.ArabicYouthData?.audio[value];
      if (recording) playMedia(recording, local, true);
      else local();
      return true;
    }

    window.VocabApp = {
        KEYS,
        TEST_CONFIG,
        getTestDuration,
        setTestDuration,
        getJSON,
        setJSON,
        stripArabicDiacritics,
        normalizeAnswer,
        isCorrect,
        wordKey,
        escapeHTML,
        shuffle,
        getCurrentVocabList,
        getCurrentSource,
        saveVocabList,
        getStats,
        getWrongWords,
        getStudiedWords,
        markStudied,
        addWrongWord,
        removeWrongWord,
        getSourceKey,
        getListMasteryProgress,
        getCurrentListMasteryProgress,
        getMasterySummary,
        recordTestResults,
        selectFreshTestWords,
        getLastTestOutcome,
        getCurrentVocabProgress,
        getListProgress,
        getTestLabel,
        loadCatalog,
        initSpeech,
        getSpeechSupport,
        stopSpeech,
        speakArabic
    };
}());
