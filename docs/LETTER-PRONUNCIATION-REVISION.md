# Letter pronunciation and handwriting revision · 2026-10-25

The reported letter-card examples now explicitly request and display **دُبٌّ، ظَرْفٌ، عِنَبٌ، فِيلٌ، لَيْمُونٌ، هِلَالٌ، يَدٌ**. The bear includes both ḍamma and the doubled bāʾ. Legacy unmarked lookup keys still resolve to the revised recording.

Jīm and Wāw keep their pause forms **الْجِيمْ، الْوَاوْ**. Their recordings, the seven word examples, the **إِ** sound, and the related Alif-maqṣūra example use new local filenames so cached older MP3s are not reused. Exact matching vocabulary entries share the revised word clips.

`tools/generate-letter-pronunciation-revision.py` uses fully vocalized Arabic targets at the synthesis provider's normal rate, after a short instructional carrier and a sentence pause. It detects that pause, extracts only the target word/name and applies a small constant slowdown. The carrier is not played. `audio/letter-pronunciation-revision.json` records all eleven requested texts, complete synthesis prompts, extraction boundaries, source/output hashes and durations. This differs from simply requesting the same old isolated slow TTS input again. The speech is synthetic; decoding/playback checks are not a human phonetic acceptance review.

The supplementary Alif card now shows **فَتَى**, with a note explaining the pause pronunciation with final long ā and no audible tanwīn. This is an instructional pause example; other grammatical contexts are not globally rewritten. The Kasra button uses **إِ**, with Hamza below Alif. `letter.vowelForms` is the common source for vowel labels and the curated demo's audio selection; the old **أِ** key is only a playback alias for old saved material.

The handwriting canvas measures the actual glyph ink with `TextMetrics`, fits it within a 32-pixel internal margin, and centres the ink rectangle on both axes. This includes Alif's high Hamza. Canvas dimensions are read from the element, and a fallback is provided for older text-metric implementations. Clearing or changing the letter redraws the centred guide.

Verification: the Node data/audio tests check hashes, NFC text keys and revised mappings. `tests/letter-revision-smoke.py` plays the eleven real clips with outside requests blocked, checks **إِ** and **فَتَى**, and inspects painted canvas pixels for all 28 letters in Arabic and German at mobile/desktop widths. It accepts `--inline` for portable HTML and `--demo` for the six-letter demo. Existing letter and vocabulary playback checks remain applicable.

The main letter-name generator preserves the two revised names; the vocabulary generator prioritises the revision manifest when reusing audio. The dedicated revision generator is repeatable and updates the name, related-letter, pronunciation-correction and vocabulary manifests together.
