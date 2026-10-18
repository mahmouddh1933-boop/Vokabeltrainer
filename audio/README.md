# أصوات الحروف · Alphabet audio

168 MP3 clips are bundled with the application: 28 Arabic letter names, 28 example words and four marked forms per letter. The files play directly from the same folder as the application; they require no TTS service or installed Arabic voice at playback time. Keep `audio/letters/` when copying or extracting the app.

The clips were generated with Arabic speech from the Google Translate TTS endpoint already used by this application and downloaded over verified HTTPS on 2026-10-18. `js/letter-data.js` maps the exact Arabic text to each file. Every downloaded file was checked for a positive duration with FFprobe and fully decoded with FFmpeg. They are synthesized speech, not human recordings.

Other words use an Arabic device voice first, with online TTS as a fallback. Playback always starts from a user tap. If the browser denies playback, the interface asks the user to tap again rather than looping through providers.
