# Bundled vocabulary pronunciation

The ready-made vocabulary cards previously relied on the device speech engine or cross-site online TTS. Unlike the letter and reading lessons, they had no local recordings. An unavailable Arabic voice, silent synthesis or a blocked online provider could therefore leave vocabulary silent while other lessons still played.

All 2,400 A1/A2/B1/B2 entries now have exact, NFC-normalized recording keys (2,397 distinct Arabic strings). The index is loaded synchronously with the other deferred dependencies on learning cards, listening tests and error-review cards. `VocabApp.speakArabic` selects the recording first and calls `Audio.play()` directly within the click/touch handler, reusing the same media element for Android/iOS gesture policies. The recordings require no device Arabic voice or external audio service at playback time.

Vowel distinctions remain significant: ظَهْرٌ and ظُهْرٌ must not collapse to the same key. No unvocalized matching is added. Imported words that exactly match a built-in entry also use its recording; other imported words retain the existing device/online fallback. Switching vocabulary or review cards cancels the old speech request, and navigating away cancels any active playback. Listening-test status labels are cleared when another question is played.

`tools/generate-vocabulary-audio.py` builds the recordings and `audio/vocabulary-manifest.json`, reusing 69 existing lesson recordings. Its 2,328 new MP3s use mono 22,050 Hz / 32 kbps speech audio. The complete vocabulary recording set occupies 16,412,740 bytes including reused clips. The source provider is Google Translate TTS; downloads happen at build time. The generator caches its raw inputs outside the repository and validates each generated MP3. `js/vocab-audio-data.js` is the compact runtime index. No Firebase credentials, Cloud Functions, database writes or runtime synthesis service are needed for these built-in recordings.

The offline and Firebase packages include all recordings. The Firebase authentication gate preserves dependency order. The demo builder includes only its 120 selected word recordings, retaining the existing content limits and independent local storage.

Verification:

- `node --test tests/*.test.js` checks complete catalog coverage, exact text keys, file hashes and synchronous speech/cancellation behavior.
- `python3 tests/vocabulary-audio-smoke.py` plays real MP3s in mobile Chromium with an Arabic speech engine deliberately unavailable and external requests blocked. It covers the four levels, calendar, vowel distinctions, card cancellation, listening tests and review in both interface languages.
- The same browser check accepts `--inline` for extracted portable HTML and `--demo` for the curated demo. Direct `file://` navigation is blocked by the cloud browser policy; the portable test blocks separate JS/CSS requests and plays the extracted local media over a local HTTP server. This is not a test on a physical Android device.

For an existing deployment, publish the newly built Firebase package. Existing saved progress and learning data are not reset by this change.
