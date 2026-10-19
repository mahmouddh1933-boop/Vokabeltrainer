# أصوات الحروف · Alphabet audio

168 MP3 clips are bundled with the application: 28 Arabic letter names, 28 example words and four marked forms per letter. The files play directly from the same folder as the application; they require no TTS service or installed Arabic voice at playback time. Keep `audio/letters/` when copying or extracting the app.

The clips were generated with Arabic speech from the Google Translate TTS endpoint already used by this application and downloaded over verified HTTPS on 2026-10-18. Pronunciation corrections were generated on 2026-10-19 with explicitly vocalized text and the slower-speech request parameter. `pronunciation-corrections.json` records those 38 synthesis inputs and file paths. `js/letter-data.js` maps Arabic text to each file, including aliases for vocalized example words. They are synthesized speech, not human recordings.

The corrected example words are **جَمَل، ذُرَة، ضِفْدَع، ظَرْف، عِنَب، رُمَّان**. In particular, the corn picture uses **ذُرَة**, not **ذَرَّة** (atom). The Ta name is spoken as **تَاء**, and its three vowel clips were regenerated too.

A consonant carrying sukun cannot start a syllable. All 28 sukun buttons therefore play the contextual sample shown beneath the buttons, such as **أَبْ، أَتْ، أَوْ، أَيْ**. For hamza on alif, the sample is **اِقْرَأْ**. This avoids asking the speech engine to pronounce an isolated, vowelless consonant. The example updates with the selected letter in both interface languages.

All clips were fully decoded with FFmpeg and checked with FFprobe; the audio check also measures non-silent duration. Mobile Chrome emulation verifies real playback of all 28 sukun clips, the six corrected words and Ta's name/vowels with external requests blocked. These checks verify file integrity and playback; they do not replace a native speaker's listening review on a physical phone.

Other words use an Arabic device voice first, with online TTS as a fallback. Playback always starts from a user tap. If the browser denies playback, the interface asks the user to tap again rather than looping through providers.
