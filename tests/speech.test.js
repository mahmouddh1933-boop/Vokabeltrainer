const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
function setup({
  voices = [{ lang: "ar-SA", name: "Arabic" }],
  native = true,
  recording = false,
  practiceRecording = false,
  bookRecording = false,
  youthRecording = false,
  youthTwoRecording = false,
  language = "ar",
  behavior = "normal",
} = {}) {
  const calls = {
    speak: [],
    play: [],
    audio: [],
    timers: new Map(),
    statuses: [],
    cancel: 0,
  };
  let timer = 0;
  const synth = {
    getVoices: () => voices,
    addEventListener() {},
    cancel() {
      calls.cancel++;
    },
    speak(u) {
      calls.speak.push(u);
    },
    resume() {
      calls.resumed = true;
    },
    paused: false,
  };
  class Audio {
    constructor() {
      calls.audio.push(this);
      this.currentTime = 0;
    }
    pause() {
      this.paused = true;
    }
    play() {
      calls.play.push(this.src);
      if (behavior === "blocked")
        return Promise.reject({ name: "NotAllowedError" });
      return Promise.resolve();
    }
  }
  const context = {
    window: { speechSynthesis: native ? synth : undefined },
    localStorage: { getItem: () => language },
    Audio,
    SpeechSynthesisUtterance: class {
      constructor(text) {
        this.text = text;
      }
    },
    setTimeout: (f) => {
      calls.timers.set(++timer, f);
      return timer;
    },
    clearTimeout: (id) => calls.timers.delete(id),
    console,
  };
  if (!native) delete context.window.speechSynthesis;
  if (recording)
    context.window.ArabicLetterData = {
      audio: { الباء: "audio/letters/02-name.mp3" },
    };
  if (practiceRecording)
    context.window.ArabicPracticeData = {
      audio: { تِين: "audio/practice/001.mp3" },
    };
  if (bookRecording)
    context.window.ArabicBookData = {
      audio: { أَسَد: "audio/book-two/001.mp3" },
    };
  if (youthRecording)
    context.window.ArabicYouthData = {
      audio: { قِطَارٌ: "audio/youth/013.mp3" },
    };
  if (youthTwoRecording)
    context.window.ArabicYouthTwoData = {
      audio: { سَمَك: "audio/letters/12-word.mp3" },
    };
  vm.runInNewContext(
    fs.readFileSync(require.resolve("../js/storage.js"), "utf8"),
    context,
  );
  vm.runInNewContext(
    fs.readFileSync(require.resolve("../js/app.js"), "utf8"),
    context,
  );
  return {
    app: context.window.VocabApp,
    calls,
    synth,
    status: (...s) => calls.statuses.push(s),
  };
}
test("Native Arabic speak is invoked synchronously and does not contact online TTS", () => {
  const { app, calls, status } = setup();
  assert.equal(app.speakArabic("كَتَبَ", status), true);
  assert.equal(calls.speak.length, 1);
  assert.equal(calls.play.length, 0);
  const utterance = calls.speak[0];
  assert.equal(utterance.lang, "ar-SA");
  assert.equal(utterance.text, "كَتَبَ");
  utterance.onstart();
  assert.equal(calls.timers.size, 0);
  utterance.onend();
  assert.equal(calls.statuses.at(-1)[1], false);
});
test("New listening and story recordings use local files without a native voice", () => {
  const { app, calls } = setup({ native: false, practiceRecording: true });
  app.speakArabic("تِين");
  assert.deepEqual(calls.play, ["audio/practice/001.mp3"]);
  assert.equal(calls.speak.length, 0);
});
test("Second-level book recordings play locally without a native voice", () => {
  const { app, calls } = setup({ native: false, bookRecording: true });
  app.speakArabic("أَسَد");
  assert.deepEqual(calls.play, ["audio/book-two/001.mp3"]);
  assert.equal(calls.speak.length, 0);
});
test("An initially empty mobile voice list still starts speech immediately in Arabic", () => {
  const { app, calls } = setup({ voices: [] });
  app.speakArabic("ب");
  assert.equal(calls.speak.length, 1);
  assert.equal(calls.speak[0].lang, "ar-SA");
  assert.equal(calls.play.length, 0);
});
test("Letter recordings play directly without speech engines or external services", () => {
  const { app, calls } = setup({ native: false, recording: true });
  app.speakArabic("الباء");
  assert.deepEqual(calls.play, ["audio/letters/02-name.mp3"]);
  assert.equal(calls.speak.length, 0);
  calls.audio[0].onplaying();
  assert.equal(calls.timers.size, 0);
  app.speakArabic("الباء");
  assert.equal(calls.audio.length, 1, "Reuse the gesture-activated element");
  assert.equal(calls.play.length, 2);
});
test("Missing recording falls back to native speech; native failure uses online audio", () => {
  const { app, calls } = setup({ recording: true });
  app.speakArabic("الباء");
  calls.audio[0].onerror();
  assert.equal(calls.speak.length, 1);
  calls.speak[0].onerror({ error: "synthesis-unavailable" });
  assert.ok(calls.play.at(-1).startsWith("https://translate.google.com/"));
  assert.equal(calls.audio.length, 1);
});
test("A blocked mobile play request gives a retry message without repeatedly retrying", async () => {
  const { app, calls, status } = setup({
    native: false,
    recording: true,
    behavior: "blocked",
    language: "de",
  });
  app.speakArabic("الباء", status);
  await Promise.resolve();
  assert.equal(calls.play.length, 1);
  assert.equal(calls.statuses.at(-1)[1], true);
  assert.match(calls.statuses.at(-1)[0], /Tippe erneut/);
  assert.equal(calls.timers.size, 0);
});
test("Stopping speech clears pending fallback and ignores events from a previous request", () => {
  const { app, calls, status } = setup();
  app.speakArabic("الألف", status);
  const stale = calls.speak[0].onerror;
  app.speakArabic("الباء", status);
  stale({ error: "interrupted" });
  assert.equal(calls.play.length, 0);
  app.stopSpeech();
  assert.equal(calls.timers.size, 0);
  assert.equal(calls.speak[1].onerror, null);
});
test("Online failure exhausts finite endpoints and reports an actionable error", () => {
  const { app, calls, status } = setup({ native: false });
  app.speakArabic("اختبار", status);
  calls.audio[0].onerror();
  calls.audio[0].onerror();
  assert.equal(calls.play.length, 2);
  assert.equal(calls.audio.length, 1);
  assert.equal(calls.statuses.at(-1)[1], true);
  assert.match(calls.statuses.at(-1)[0], /صوتًا عربيًا/);
  assert.equal(calls.timers.size, 0);
});

test("Youth book recordings start synchronously without native voices or online TTS", () => {
  const { app, calls } = setup({ native: false, youthRecording: true });
  app.speakArabic("قِطَارٌ");
  assert.deepEqual(calls.play, ["audio/youth/013.mp3"]);
  assert.equal(calls.speak.length, 0);
});

test("Youth 2 listening starts synchronously from a bundled clip without a device voice", () => {
  const { app, calls } = setup({ native: false, youthTwoRecording: true });
  app.speakArabic("سَمَك");
  assert.deepEqual(calls.play, ["audio/letters/12-word.mp3"]);
  assert.equal(calls.speak.length, 0);
});
