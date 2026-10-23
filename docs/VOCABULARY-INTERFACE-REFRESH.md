# Vocabulary and interface refresh · October 2026

- The home page opens with the seven-stage learning route, followed by placement guidance and finally «الاختبارات الخاصة بالأستاذ محمود بركات». All existing saved-report and route IDs remain available.
- Removed the three shortcut buttons pictured above the classroom exam catalog. The exam catalog, sidebar placement entry and vocabulary/letter tests remain reachable through their own learning pages.
- The A1 calendar uses vocalized Levantine month names, in calendar order: كانون الثاني = Januar, شباط = Februar, … كانون الأول = Dezember. Monday is «الِاثْنَيْنِ» / Montag without «يوم». The authoritative source is `data/cefr/A1.txt`; regenerate the JSON and offline copy with `python3 tools/build-vocab-catalog.py`.
- An already selected built-in `a1_07` calendar refreshes on its next read. Imported/custom lists and previous learning records remain intact.
- Vocabulary cards now have light cream/sage surfaces, dark text and subtle olive branches on both faces. The twenty basic number entries display Arabic-Indic digits on the Arabic face and Western digits on the German face. These are presentation aids; stored answers, spoken words and grading still use the words.
- The shared theme provides one stronger olive palette for secondary actions, a darker primary action, and consistent hover/selection states. It does not change mobile tile dimensions or replace green/red feedback states.
- Eight positive and eight supportive retry messages rotate independently, in Arabic and German, across letter exercises, reading/spelling, grammar, sentences, stories, book exercises, vocabulary results and finished classroom tests. Assessment answers remain hidden until completion where required.
- Added matching illustrations for all 100 entries in housing/rooms, furniture/household objects, clothes/personal items, body parts and weather/nature. The new SVGs total 34,428 bytes; each is at most 532 bytes. The full mapping contains 212 local illustrations. Body parts are highlighted in diagrams; furniture and rooms use simple geometry. Clothing/weather also use system pictographs. No external image requests are needed.

Verification: `node --test tests/*.test.js`, `tests/vocabulary-refresh-smoke.py`, mobile scramble/layout checks and existing reading, grammar, navigation and book/browser checks. The vocabulary refresh smoke check also accepts `--inline` for the extracted portable archive while blocking separate script/stylesheet requests.

Release targets: rebuild the offline ZIP with `tools/build-download.py` and the Firebase ZIP with `tools/build-hosting.py --archive`. Publishing the updated site requires deploying the Firebase package; preparing a ZIP does not change the live site.
