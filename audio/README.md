# أصوات الحروف · Alphabet audio

168 MP3 clips are bundled with the application: 28 Arabic letter names, 28 example words and four marked forms per letter. The files play directly from the same folder as the application; they require no TTS service or installed Arabic voice at playback time. Keep `audio/letters/` when copying or extracting the app.

The clips were generated with Arabic speech from the Google Translate TTS endpoint already used by this application and downloaded over verified HTTPS on 2026-10-18. Pronunciation corrections were generated on 2026-10-19 with explicitly vocalized text and the slower-speech request parameter. `pronunciation-corrections.json` records those 38 synthesis inputs and file paths. `js/letter-data.js` maps Arabic text to each file, including aliases for vocalized example words. They are synthesized speech, not human recordings.

The corrected example words are **جَمَل، ذُرَة، ضِفْدَع، ظَرْف، عِنَب، رُمَّان**. In particular, the corn picture uses **ذُرَة**, not **ذَرَّة** (atom). The earlier Ta-name correction used **تَاء**; it is superseded by the final-sukun name below. Its three vowel clips were regenerated too.

On 2026-10-23, all **28 letter-name recordings** were replaced with explicitly vocalized names ending in sukun for pause, such as **الْبَاءْ، الْجِيمْ، التَّاءْ**. The letter cards and listening questions request `spokenName`; plain-name and final-sukun aliases resolve to the same local recording. `letter-name-waqf.json` records the exact synthesis texts and SHA-256 hashes; `tools/generate-letter-name-audio.py` regenerates and decodes them. The new `*-name-waqf.mp3` filenames avoid reusing cached older recordings. Earlier Ta-name synthesis metadata is retained under `supersededClips` in `pronunciation-corrections.json`. Example-word and vowel recordings are unchanged. As with the existing audio, file-integrity and browser-playback checks do not constitute a human phonetic review.

A consonant carrying sukun cannot start a syllable. All 28 sukun buttons therefore play the contextual sample shown beneath the buttons, such as **أَبْ، أَتْ، أَوْ، أَيْ**. For hamza on alif, the sample is **اِقْرَأْ**. This avoids asking the speech engine to pronounce an isolated, vowelless consonant. The example updates with the selected letter in both interface languages.

All clips were fully decoded with FFmpeg and checked with FFprobe; the audio check also measures non-silent duration. Mobile Chrome emulation verifies real playback of all 28 sukun clips, the six corrected words and Ta's name/vowels with external requests blocked. These checks verify file integrity and playback; they do not replace a native speaker's listening review on a physical phone.

Other words use an Arabic device voice first, with online TTS as a fallback. Playback always starts from a user tap. If the browser denies playback, the interface asks the user to tap again rather than looping through providers.

## Listening practice, sentences and stories

An additional **120 MP3 clips** in `audio/practice/` cover the 36 sound-contrast words, 24 sentence solutions, 36 story sentences and 24 story vocabulary items. `practice-manifest.json` records each exact vocalized synthesis input and relative file path. The shared playback API uses `ArabicPracticeData.audio`, with NFC-normalized text keys, before attempting any device voice or online fallback.

These clips were synthesized with the same Arabic Google Translate TTS endpoint, requested with `ttsslow=1`, and downloaded over verified HTTPS on 2026-10-19. Every clip was decoded and checked for audible signal. They are synthetic voices and have not received a human phonetic review. Keep all audio directories when extracting the download.

## Second-level workbook

`audio/book-two/` adds **151 synthetic MP3s** for the independent 28-letter workbook. Its 84 vocabulary words and 84 reading sentences use these plus 17 already bundled clips. `book-two-manifest.json` records the new vocalized synthesis inputs, generated with the same Arabic TTS endpoint and downloaded over verified HTTPS on 2026-10-19. `ArabicBookData.audio` resolves all 168 playback texts to local files. Audio remains synthetic and has not had human phonetic review. These three audio directories together contain **439 MP3s**.

## العربية للشباب · Youth book

`audio/youth/` adds **221 synthetic MP3s** for eight independent youth units: dialogue turns, eight picture words per unit and both four-paragraph reading texts. Repeated vocabulary shares a file. `youth-manifest.json` records all exact vocalized inputs and file paths; NFC text keys in `ArabicYouthData.audio` select them before any device or online voice. Clips were generated using the same Arabic Google Translate TTS endpoint with `ttsslow=1`, downloaded over verified HTTPS on 2026-10-20. All files were fully decoded and checked for audible output, and playback was exercised by touch in mobile Chromium with external requests blocked. This is synthetic speech, without human phonetic acceptance or testing on a physical Android device.

The complete download now includes **660 MP3 files**. All audio folders must remain beside the extracted HTML files.

## كتاب الشباب2 ج1 · Six-unit book

`audio/book-youth-two-part-one/` adds **134 synthetic Arabic MP3s** for the six-unit book: original dialogue turns, vocabulary and short reading segments. `book-youth-two-part-one-manifest.json` records every exact synthesis text and content-derived filename. These were generated with the Arabic Google Translate TTS endpoint (`ttsslow=1`) over verified HTTPS on 2026-10-21. Existing identical texts and all six sound-contrast pairs reuse already bundled clips. `ArabicYouthBookTwoPartOneData.audio` selects local files directly from a user tap before considering device voices or online speech.

All added clips were fully decoded with FFmpeg and checked for audible signal. Browser tests exercise playback with external requests blocked; they do not replace a native speaker's pronunciation review or a test on a physical Android phone. These are synthetic voices.

The complete download now includes **794 MP3 files**. Extract all audio folders together with the HTML files.
