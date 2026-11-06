"""Author the paired, vocalized application sentences for all reading words.

Each line has a short sentence, its German translation, an expanded sentence,
its translation, and the exact target form used in both sentences.
"""
from pathlib import Path
import json,unicodedata,re
ROOT=Path(__file__).resolve().parents[1]
ROWS=r"""
كَتَبَ سَامِرٌ.|Samer schrieb.|كَتَبَ سَامِرٌ كَلِمَةً.|Samer schrieb ein Wort.|كَتَبَ
قَرَأَ عُمَرُ.|Omar las.|قَرَأَ عُمَرُ كِتَابًا.|Omar las ein Buch.|قَرَأَ
أَكَلَ حَسَنٌ.|Hasan aß.|أَكَلَ حَسَنٌ تُفَّاحَةً.|Hasan aß einen Apfel.|أَكَلَ
شَرِبَ أَحْمَدُ.|Ahmad trank.|شَرِبَ أَحْمَدُ حَلِيبًا.|Ahmad trank Milch.|شَرِبَ
لَعِبَ سَامِرٌ.|Samer spielte.|لَعِبَ سَامِرٌ مَعَ أَخِيهِ.|Samer spielte mit seinem Bruder.|لَعِبَ
رَسَمَ عُمَرُ.|Omar zeichnete.|رَسَمَ عُمَرُ بَيْتًا.|Omar zeichnete ein Haus.|رَسَمَ
جَلَسَ أَحْمَدُ.|Ahmad setzte sich.|جَلَسَ أَحْمَدُ عَلَى كُرْسِيٍّ.|Ahmad setzte sich auf einen Stuhl.|جَلَسَ
وَقَفَ حَسَنٌ.|Hasan stand.|وَقَفَ حَسَنٌ أَمَامَ الْبَابِ.|Hasan stand vor der Tür.|وَقَفَ
خَرَجَ عُمَرُ.|Omar ging hinaus.|خَرَجَ عُمَرُ مِنَ الْبَيْتِ.|Omar ging aus dem Haus.|خَرَجَ
دَخَلَ سَامِرٌ.|Samer kam herein.|دَخَلَ سَامِرٌ إِلَى الْغُرْفَةِ.|Samer kam ins Zimmer.|دَخَلَ
ذَهَبَ أَحْمَدُ.|Ahmad ging.|ذَهَبَ أَحْمَدُ إِلَى الْمَدْرَسَةِ.|Ahmad ging zur Schule.|ذَهَبَ
رَكِبَ عُمَرُ.|Omar stieg ein.|رَكِبَ عُمَرُ الْحَافِلَةَ.|Omar stieg in den Bus.|رَكِبَ
نَزَلَ حَسَنٌ.|Hasan stieg hinab.|نَزَلَ حَسَنٌ مِنَ الْحَافِلَةِ.|Hasan stieg aus dem Bus.|نَزَلَ
صَعِدَ سَامِرٌ.|Samer stieg hinauf.|صَعِدَ سَامِرٌ إِلَى غُرْفَتِهِ.|Samer ging hinauf in sein Zimmer.|صَعِدَ
فَتَحَ أَحْمَدُ.|Ahmad öffnete.|فَتَحَ أَحْمَدُ الْبَابَ.|Ahmad öffnete die Tür.|فَتَحَ
غَسَلَ عُمَرُ.|Omar wusch.|غَسَلَ عُمَرُ يَدَيْهِ.|Omar wusch seine Hände.|غَسَلَ
لَبِسَ حَسَنٌ.|Hasan zog sich an.|لَبِسَ حَسَنٌ قَمِيصًا.|Hasan zog ein Hemd an.|لَبِسَ
حَمَلَ سَامِرٌ.|Samer trug etwas.|حَمَلَ سَامِرٌ حَقِيبَةً.|Samer trug eine Tasche.|حَمَلَ
طَبَخَ أَحْمَدُ.|Ahmad kochte.|طَبَخَ أَحْمَدُ طَعَامًا.|Ahmad kochte Essen.|طَبَخَ
زَرَعَ عُمَرُ.|Omar pflanzte.|زَرَعَ عُمَرُ شَجَرَةً.|Omar pflanzte einen Baum.|زَرَعَ
جَمَعَ حَسَنٌ.|Hasan sammelte.|جَمَعَ حَسَنٌ أَقْلَامَهُ.|Hasan sammelte seine Stifte ein.|جَمَعَ
نَجَحَ سَامِرٌ.|Samer hatte Erfolg.|نَجَحَ سَامِرٌ فِي الِاخْتِبَارِ.|Samer bestand den Test.|نَجَحَ
سَمِعَ أَحْمَدُ.|Ahmad hörte.|سَمِعَ أَحْمَدُ صَوْتًا.|Ahmad hörte ein Geräusch.|سَمِعَ
فَهِمَ عُمَرُ.|Omar verstand.|فَهِمَ عُمَرُ السُّؤَالَ.|Omar verstand die Frage.|فَهِمَ
حَفِظَ حَسَنٌ.|Hasan lernte auswendig.|حَفِظَ حَسَنٌ كَلِمَةً جَدِيدَةً.|Hasan lernte ein neues Wort auswendig.|حَفِظَ
بَحَثَ سَامِرٌ.|Samer suchte.|بَحَثَ سَامِرٌ عَنْ قَلَمِهِ.|Samer suchte nach seinem Stift.|بَحَثَ
طَلَبَ أَحْمَدُ.|Ahmad bat um etwas.|طَلَبَ أَحْمَدُ كَأْسَ مَاءٍ.|Ahmad bat um ein Glas Wasser.|طَلَبَ
مَسَحَ عُمَرُ.|Omar wischte.|مَسَحَ عُمَرُ الطَّاوِلَةَ.|Omar wischte den Tisch ab.|مَسَحَ
قَطَعَ حَسَنٌ.|Hasan schnitt.|قَطَعَ حَسَنٌ رَغِيفًا.|Hasan schnitt einen Brotlaib.|قَطَعَ
سَبَحَ سَامِرٌ.|Samer schwamm.|سَبَحَ سَامِرٌ فِي الْبَحْرِ.|Samer schwamm im Meer.|سَبَحَ
هَذِهِ يَدٌ.|Das ist eine Hand.|هَذِهِ يَدٌ نَظِيفَةٌ.|Das ist eine saubere Hand.|يَدٌ
هَذَا فَمٌ.|Das ist ein Mund.|لِلْقِطِّ فَمٌ صَغِيرٌ.|Die Katze hat einen kleinen Mund.|فَمٌ
سَامِرٌ أَبٌ.|Samer ist Vater.|سَامِرٌ أَبٌ لِطِفْلَيْنِ.|Samer ist Vater von zwei Kindern.|أَبٌ
لِي أَخٌ.|Ich habe einen Bruder.|لِي أَخٌ صَغِيرٌ.|Ich habe einen kleinen Bruder.|أَخٌ
هَذَا قَلَمٌ.|Das ist ein Stift.|هَذَا قَلَمٌ أَزْرَقُ.|Das ist ein blauer Stift.|قَلَمٌ
هَذَا جَمَلٌ.|Das ist ein Kamel.|هَذَا جَمَلٌ كَبِيرٌ.|Das ist ein großes Kamel.|جَمَلٌ
هَذَا جَبَلٌ.|Das ist ein Berg.|هَذَا جَبَلٌ عَالٍ.|Das ist ein hoher Berg.|جَبَلٌ
هَذَا سَمَكٌ.|Das ist Fisch.|هَذَا سَمَكٌ طَازَجٌ.|Das ist frischer Fisch.|سَمَكٌ
هَذَا عِنَبٌ.|Das sind Weintrauben.|هَذَا عِنَبٌ حُلْوٌ.|Das sind süße Weintrauben.|عِنَبٌ
هَذَا عَسَلٌ.|Das ist Honig.|هَذَا عَسَلٌ لَذِيذٌ.|Das ist leckerer Honig.|عَسَلٌ
هَذَا لَبَنٌ.|Das ist Sauermilch.|هَذَا لَبَنٌ بَارِدٌ.|Das ist kalte Sauermilch.|لَبَنٌ
هَذَا تَمْرٌ.|Das sind Datteln.|هَذَا تَمْرٌ حُلْوٌ.|Das sind süße Datteln.|تَمْرٌ
هَذَا بَدْرٌ.|Das ist ein Vollmond.|فِي السَّمَاءِ بَدْرٌ مُضِيءٌ.|Am Himmel leuchtet ein Vollmond.|بَدْرٌ
هَذَا بَحْرٌ.|Das ist ein Meer.|هَذَا بَحْرٌ وَاسِعٌ.|Das ist ein weites Meer.|بَحْرٌ
هَذِهِ شَمْسٌ.|Das ist eine Sonne.|فِي الرَّسْمِ شَمْسٌ صَفْرَاءُ.|Auf der Zeichnung ist eine gelbe Sonne.|شَمْسٌ
هَذَا نَهْرٌ.|Das ist ein Fluss.|هَذَا نَهْرٌ طَوِيلٌ.|Das ist ein langer Fluss.|نَهْرٌ
هَذَا زَهْرٌ.|Das sind Blüten.|فِي الْحَدِيقَةِ زَهْرٌ جَمِيلٌ.|Im Garten gibt es schöne Blüten.|زَهْرٌ
هَذَا نَمْلٌ.|Das sind Ameisen.|تَحْتَ الشَّجَرَةِ نَمْلٌ كَثِيرٌ.|Unter dem Baum sind viele Ameisen.|نَمْلٌ
هَذَا نَجْمٌ.|Das ist ein Stern.|فِي السَّمَاءِ نَجْمٌ لَامِعٌ.|Am Himmel ist ein heller Stern.|نَجْمٌ
هَذَا وَرْدٌ.|Das sind Rosen.|فِي الْمَزْهَرِيَّةِ وَرْدٌ أَحْمَرُ.|In der Vase stehen rote Rosen.|وَرْدٌ
هَذَا بَابٌ.|Das ist eine Tür.|هَذَا بَابٌ مَفْتُوحٌ.|Das ist eine offene Tür.|بَابٌ
هَذَا مَاءٌ.|Das ist Wasser.|هَذَا مَاءٌ بَارِدٌ.|Das ist kaltes Wasser.|مَاءٌ
هَذِهِ دَارٌ.|Das ist ein Haus.|هَذِهِ دَارٌ وَاسِعَةٌ.|Das ist ein geräumiges Haus.|دَارٌ
هَذِهِ نَارٌ.|Das ist ein Feuer.|هَذِهِ نَارٌ قَوِيَّةٌ.|Das ist ein starkes Feuer.|نَارٌ
هَذَا نُورٌ.|Das ist Licht.|هَذَا نُورٌ سَاطِعٌ.|Das ist helles Licht.|نُورٌ
هَذَا سُوقٌ.|Das ist ein Markt.|هَذَا سُوقٌ قَرِيبٌ.|Das ist ein Markt in der Nähe.|سُوقٌ
هَذَا تُوتٌ.|Das sind Maulbeeren.|هَذَا تُوتٌ نَاضِجٌ.|Das sind reife Maulbeeren.|تُوتٌ
هَذَا تِينٌ.|Das sind Feigen.|هَذَا تِينٌ طَازَجٌ.|Das sind frische Feigen.|تِينٌ
هَذَا زَيْتٌ.|Das ist Öl.|هَذَا زَيْتٌ مِنَ الزَّيْتُونِ.|Das ist Öl aus Oliven.|زَيْتٌ
هَذَا بَيْتٌ.|Das ist ein Haus.|هَذَا بَيْتٌ جَمِيلٌ.|Das ist ein schönes Haus.|بَيْتٌ
هَذَا يَوْمٌ جَمِيلٌ.|Das ist ein schöner Tag.|هَذَا يَوْمٌ جَمِيلٌ لِلْقِرَاءَةِ.|Das ist ein schöner Tag zum Lesen.|يَوْمٌ
هَذِهِ عَيْنٌ.|Das ist ein Auge.|هَذِهِ عَيْنٌ تَرَى الْأَلْوَانَ.|Dieses Auge sieht Farben.|عَيْنٌ
هَذَا لَيْلٌ هَادِئٌ.|Das ist eine ruhige Nacht.|هَذَا لَيْلٌ هَادِئٌ بَعْدَ يَوْمٍ طَوِيلٍ.|Das ist eine ruhige Nacht nach einem langen Tag.|لَيْلٌ
هَذَا فِيلٌ.|Das ist ein Elefant.|هَذَا فِيلٌ كَبِيرٌ.|Das ist ein großer Elefant.|فِيلٌ
هَذَا حُوتٌ.|Das ist ein Wal.|هَذَا حُوتٌ يَسْبَحُ فِي الْبَحْرِ.|Dieser Wal schwimmt im Meer.|حُوتٌ
هَذَا ضَوْءٌ.|Das ist ein Lichtschein.|هَذَا ضَوْءٌ مِنَ الْمِصْبَاحِ.|Dieser Lichtschein kommt von der Lampe.|ضَوْءٌ
هَذَا كَأْسٌ.|Das ist ein Trinkglas.|هَذَا كَأْسٌ مِنَ الْمَاءِ.|Das ist ein Glas Wasser.|كَأْسٌ
هَذَا رَأْسٌ.|Das ist ein Kopf.|لِلْفِيلِ رَأْسٌ كَبِيرٌ.|Der Elefant hat einen großen Kopf.|رَأْسٌ
هَذَا كِتَابٌ.|Das ist ein Buch.|هَذَا كِتَابٌ عَنْ حَيَوَانَاتِ الْغَابَةِ.|Das ist ein Buch über Waldtiere.|كِتَابٌ
هَذَا حَلِيبٌ.|Das ist Milch.|هَذَا حَلِيبٌ دَافِئٌ.|Das ist warme Milch.|حَلِيبٌ
هَذَا عَصِيرٌ.|Das ist Saft.|هَذَا عَصِيرٌ مِنَ الْبُرْتُقَالِ.|Das ist Orangensaft.|عَصِيرٌ
هَذَا رَغِيفٌ.|Das ist ein Brotlaib.|هَذَا رَغِيفٌ طَازَجٌ.|Das ist ein frischer Brotlaib.|رَغِيفٌ
هَذَا طَعَامٌ.|Das ist Essen.|هَذَا طَعَامٌ لَذِيذٌ.|Das ist leckeres Essen.|طَعَامٌ
هَذَا مَوْزٌ.|Das sind Bananen.|هَذَا مَوْزٌ أَصْفَرُ.|Das sind gelbe Bananen.|مَوْزٌ
هَذَا لَيْمُونٌ.|Das sind Zitronen.|هَذَا لَيْمُونٌ مِنَ الْحَدِيقَةِ.|Das sind Zitronen aus dem Garten.|لَيْمُونٌ
هَذَا زَيْتُونٌ.|Das sind Oliven.|هَذَا زَيْتُونٌ أَخْضَرُ.|Das sind grüne Oliven.|زَيْتُونٌ
هَذَا خِيَارٌ.|Das sind Gurken.|هَذَا خِيَارٌ طَازَجٌ.|Das sind frische Gurken.|خِيَارٌ
هَذَا سَرِيرٌ.|Das ist ein Bett.|هَذَا سَرِيرٌ مُرِيحٌ.|Das ist ein bequemes Bett.|سَرِيرٌ
هَذَا سِتَارٌ.|Das ist ein Vorhang.|هَذَا سِتَارٌ أَزْرَقُ.|Das ist ein blauer Vorhang.|سِتَارٌ
هَذِهِ نَافِذَةٌ.|Das ist ein Fenster.|هَذِهِ نَافِذَةٌ مَفْتُوحَةٌ.|Das ist ein offenes Fenster.|نَافِذَةٌ
هَذِهِ مَدْرَسَةٌ.|Das ist eine Schule.|هَذِهِ مَدْرَسَةٌ قَرِيبَةٌ مِنْ بَيْتِي.|Diese Schule ist in der Nähe meines Hauses.|مَدْرَسَةٌ
هَذِهِ مَكْتَبَةٌ.|Das ist eine Bibliothek.|هَذِهِ مَكْتَبَةٌ فِيهَا كُتُبٌ كَثِيرَةٌ.|In dieser Bibliothek gibt es viele Bücher.|مَكْتَبَةٌ
هَذِهِ حَقِيبَةٌ.|Das ist eine Tasche.|هَذِهِ حَقِيبَةٌ خَفِيفَةٌ.|Das ist eine leichte Tasche.|حَقِيبَةٌ
هَذِهِ حَدِيقَةٌ.|Das ist ein Garten.|هَذِهِ حَدِيقَةٌ فِيهَا أَشْجَارٌ.|In diesem Garten stehen Bäume.|حَدِيقَةٌ
هَذِهِ مَدِينَةٌ.|Das ist eine Stadt.|هَذِهِ مَدِينَةٌ كَبِيرَةٌ.|Das ist eine große Stadt.|مَدِينَةٌ
سَامِرٌ طَبِيبٌ.|Samer ist Arzt.|سَامِرٌ طَبِيبٌ فِي الْمُسْتَشْفَى.|Samer ist Arzt im Krankenhaus.|طَبِيبٌ
عُمَرُ مَرِيضٌ.|Omar ist krank.|عُمَرُ مَرِيضٌ وَيَحْتَاجُ إِلَى الرَّاحَةِ.|Omar ist krank und braucht Ruhe.|مَرِيضٌ
بَيْتِي قَرِيبٌ.|Mein Haus ist in der Nähe.|بَيْتِي قَرِيبٌ مِنَ الْمَدْرَسَةِ.|Mein Haus ist in der Nähe der Schule.|قَرِيبٌ
بَيْتِي بَعِيدٌ.|Mein Haus ist weit weg.|بَيْتِي بَعِيدٌ عَنِ السُّوقِ.|Mein Haus ist weit vom Markt entfernt.|بَعِيدٌ
هَذَا بَيْتٌ كَبِيرٌ.|Das ist ein großes Haus.|هَذَا بَيْتٌ كَبِيرٌ لِعَائِلَةٍ كَبِيرَةٍ.|Das ist ein großes Haus für eine große Familie.|كَبِيرٌ
هَذَا قَلَمٌ صَغِيرٌ.|Das ist ein kleiner Stift.|هَذَا قَلَمٌ صَغِيرٌ فِي حَقِيبَتِي.|Das ist ein kleiner Stift in meiner Tasche.|صَغِيرٌ
هَذَا رَسْمٌ جَمِيلٌ.|Das ist eine schöne Zeichnung.|هَذَا رَسْمٌ جَمِيلٌ لِحَدِيقَةٍ.|Das ist eine schöne Zeichnung eines Gartens.|جَمِيلٌ
هَذَا كِتَابٌ جَدِيدٌ.|Das ist ein neues Buch.|هَذَا كِتَابٌ جَدِيدٌ عَنِ الرِّيَاضَةِ.|Das ist ein neues Buch über Sport.|جَدِيدٌ
هَذَا بَيْتٌ قَدِيمٌ.|Das ist ein altes Haus.|هَذَا بَيْتٌ قَدِيمٌ فِي قَرْيَتِنَا.|Das ist ein altes Haus in unserem Dorf.|قَدِيمٌ
أَحْمَدُ سَعِيدٌ.|Ahmad ist glücklich.|أَحْمَدُ سَعِيدٌ بِنَجَاحِهِ.|Ahmad freut sich über seinen Erfolg.|سَعِيدٌ
هَذَا قَمِيصٌ نَظِيفٌ.|Das ist ein sauberes Hemd.|هَذَا قَمِيصٌ نَظِيفٌ فِي الْخِزَانَةِ.|Das ist ein sauberes Hemd im Schrank.|نَظِيفٌ
هَذَا قِطَارٌ سَرِيعٌ.|Das ist ein schneller Zug.|هَذَا قِطَارٌ سَرِيعٌ بَيْنَ الْمَدِينَتَيْنِ.|Dieser schnelle Zug verbindet die beiden Städte.|سَرِيعٌ
هَذَا مَشْيٌ بَطِيءٌ.|Das ist langsames Gehen.|هَذَا مَشْيٌ بَطِيءٌ نَحْوَ الْبَيْتِ.|Das ist langsames Gehen in Richtung des Hauses.|بَطِيءٌ
سَامِرٌ صَدِيقٌ.|Samer ist ein Freund.|سَامِرٌ صَدِيقٌ يُسَاعِدُنِي.|Samer ist ein Freund, der mir hilft.|صَدِيقٌ
هَذَا طَرِيقٌ.|Das ist ein Weg.|هَذَا طَرِيقٌ إِلَى الْمَدْرَسَةِ.|Das ist ein Weg zur Schule.|طَرِيقٌ
هَذِهِ أُمٌّ.|Das ist eine Mutter.|هَذِهِ أُمٌّ تَقْرَأُ لِطِفْلِهَا.|Diese Mutter liest ihrem Kind vor.|أُمٌّ
هَذَا دُبٌّ.|Das ist ein Bär.|هَذَا دُبٌّ فِي الْغَابَةِ.|Das ist ein Bär im Wald.|دُبٌّ
هَذَا قِطٌّ.|Das ist eine Katze.|هَذَا قِطٌّ يَلْعَبُ بِكُرَةٍ.|Diese Katze spielt mit einem Ball.|قِطٌّ
هَذَا حُبٌّ.|Das ist Liebe.|هَذَا حُبٌّ لِلْعَائِلَةِ.|Das ist Liebe zur Familie.|حُبٌّ
هَذَا جَدٌّ.|Das ist ein Großvater.|هَذَا جَدٌّ يَحْكِي قِصَّةً.|Dieser Großvater erzählt eine Geschichte.|جَدٌّ
هَذَا حَظٌّ جَيِّدٌ.|Das ist Glück.|هَذَا حَظٌّ جَيِّدٌ فِي الْمُسَابَقَةِ.|Das ist Glück beim Wettbewerb.|حَظٌّ
هَذَا صَفٌّ.|Das ist eine Klasse.|هَذَا صَفٌّ فِيهِ عِشْرُونَ طَالِبًا.|In dieser Klasse sind zwanzig Schüler.|صَفٌّ
هَذَا حَقٌّ.|Das ist ein Recht.|التَّعَلُّمُ حَقٌّ لِلْجَمِيعِ.|Lernen ist ein Recht für alle.|حَقٌّ
أَقْرَأُ ثُمَّ أَكْتُبُ.|Ich lese und schreibe danach.|أَقْرَأُ الْكَلِمَةَ ثُمَّ أَكْتُبُهَا.|Ich lese das Wort und schreibe es danach.|ثُمَّ
هَذِهِ جَدَّةٌ.|Das ist eine Großmutter.|هَذِهِ جَدَّةٌ تَزْرَعُ الْوَرْدَ.|Diese Großmutter pflanzt Rosen.|جَدَّةٌ
عُمَرُ مُعَلِّمٌ.|Omar ist Lehrer.|عُمَرُ مُعَلِّمٌ فِي مَدْرَسَتِنَا.|Omar ist Lehrer an unserer Schule.|مُعَلِّمٌ
سَلْمَى مُعَلِّمَةٌ.|Salma ist Lehrerin.|سَلْمَى مُعَلِّمَةٌ تُعَلِّمُنَا الْقِرَاءَةَ.|Salma ist eine Lehrerin, die uns Lesen beibringt.|مُعَلِّمَةٌ
سَامِرٌ مُهَنْدِسٌ.|Samer ist Ingenieur.|سَامِرٌ مُهَنْدِسٌ يَرْسُمُ بَيْتًا.|Samer ist ein Ingenieur, der ein Haus entwirft.|مُهَنْدِسٌ
سَلْمَى مُهَنْدِسَةٌ.|Salma ist Ingenieurin.|سَلْمَى مُهَنْدِسَةٌ تَعْمَلُ فِي مَكْتَبٍ.|Salma ist Ingenieurin und arbeitet in einem Büro.|مُهَنْدِسَةٌ
أَحْمَدُ مُمَرِّضٌ.|Ahmad ist Krankenpfleger.|أَحْمَدُ مُمَرِّضٌ يُسَاعِدُ الْمَرْضَى.|Ahmad ist ein Krankenpfleger, der den Kranken hilft.|مُمَرِّضٌ
نُورُ مُمَرِّضَةٌ.|Nur ist Krankenpflegerin.|نُورُ مُمَرِّضَةٌ فِي الْمُسْتَشْفَى.|Nur ist Krankenpflegerin im Krankenhaus.|مُمَرِّضَةٌ
عُمَرُ نَجَّارٌ.|Omar ist Tischler.|عُمَرُ نَجَّارٌ يَصْنَعُ طَاوِلَةً.|Omar ist ein Tischler, der einen Tisch baut.|نَجَّارٌ
حَسَنٌ خَبَّازٌ.|Hasan ist Bäcker.|حَسَنٌ خَبَّازٌ يَصْنَعُ الْخُبْزَ.|Hasan ist ein Bäcker, der Brot backt.|خَبَّازٌ
سَامِرٌ فَلَّاحٌ.|Samer ist Bauer.|سَامِرٌ فَلَّاحٌ يَزْرَعُ الْخَضْرَاوَاتِ.|Samer ist ein Bauer, der Gemüse anbaut.|فَلَّاحٌ
هَذِهِ سَيَّارَةٌ.|Das ist ein Auto.|هَذِهِ سَيَّارَةٌ أَمَامَ الْبَيْتِ.|Dieses Auto steht vor dem Haus.|سَيَّارَةٌ
هَذِهِ دَرَّاجَةٌ.|Das ist ein Fahrrad.|هَذِهِ دَرَّاجَةٌ جَدِيدَةٌ لِأَخِي.|Das ist ein neues Fahrrad für meinen Bruder.|دَرَّاجَةٌ
هَذِهِ طَائِرَةٌ.|Das ist ein Flugzeug.|هَذِهِ طَائِرَةٌ فَوْقَ الْمَدِينَةِ.|Dieses Flugzeug fliegt über der Stadt.|طَائِرَةٌ
هَذَا رُمَّانٌ.|Das sind Granatäpfel.|هَذَا رُمَّانٌ مِنْ حَدِيقَتِنَا.|Das sind Granatäpfel aus unserem Garten.|رُمَّانٌ
هَذَا تُفَّاحٌ.|Das sind Äpfel.|هَذَا تُفَّاحٌ أَحْمَرُ.|Das sind rote Äpfel.|تُفَّاحٌ
هَذَا سُكَّرٌ.|Das ist Zucker.|هَذَا سُكَّرٌ لِلشَّايِ.|Das ist Zucker für den Tee.|سُكَّرٌ
هَذَا سُلَّمٌ.|Das ist eine Leiter.|هَذَا سُلَّمٌ لِلصُّعُودِ إِلَى السَّطْحِ.|Das ist eine Leiter zum Dach.|سُلَّمٌ
هَذِهِ مَظَلَّةٌ.|Das ist ein Regenschirm.|هَذِهِ مَظَلَّةٌ تَحْمِينِي مِنَ الْمَطَرِ.|Dieser Regenschirm schützt mich vor dem Regen.|مَظَلَّةٌ
هَذِهِ سَبُّورَةٌ.|Das ist eine Schultafel.|هَذِهِ سَبُّورَةٌ فِي الصَّفِّ.|Diese Schultafel steht im Klassenraum.|سَبُّورَةٌ
هَذِهِ ثَلَّاجَةٌ.|Das ist ein Kühlschrank.|هَذِهِ ثَلَّاجَةٌ فِيهَا حَلِيبٌ.|In diesem Kühlschrank steht Milch.|ثَلَّاجَةٌ
هَذِهِ غَسَّالَةٌ.|Das ist eine Waschmaschine.|هَذِهِ غَسَّالَةٌ تَغْسِلُ الْمَلَابِسَ.|Diese Waschmaschine wäscht die Kleidung.|غَسَّالَةٌ
هَذَا كُرْسِيٌّ.|Das ist ein Stuhl.|هَذَا كُرْسِيٌّ قُرْبَ الطَّاوِلَةِ.|Dieser Stuhl steht neben dem Tisch.|كُرْسِيٌّ
هَذِهِ هَدِيَّةٌ.|Das ist ein Geschenk.|هَذِهِ هَدِيَّةٌ لِأُمِّي.|Das ist ein Geschenk für meine Mutter.|هَدِيَّةٌ
الْمَشْيُ رِيَاضَةٌ.|Gehen ist Sport.|الْمَشْيُ رِيَاضَةٌ مُفِيدَةٌ لِلْجِسْمِ.|Gehen ist eine gesunde Sportart für den Körper.|رِيَاضَةٌ
هَذَا مُسْتَشْفَى.|Das ist ein Krankenhaus.|هَذَا مُسْتَشْفَى قَرِيبٌ مِنْ بَيْتِي.|Dieses Krankenhaus ist in der Nähe meines Hauses.|مُسْتَشْفَى
هَذِهِ صَيْدَلِيَّةٌ.|Das ist eine Apotheke.|هَذِهِ صَيْدَلِيَّةٌ لِشِرَاءِ الدَّوَاءِ.|In dieser Apotheke kann man Medikamente kaufen.|صَيْدَلِيَّةٌ
أَحْتَاجُ إِلَى مُسَاعَدَةٍ.|Ich brauche Hilfe.|أَحْتَاجُ إِلَى مُسَاعَدَةٍ فِي قِرَاءَةِ الْكَلِمَةِ.|Ich brauche Hilfe beim Lesen des Wortes.|مُسَاعَدَةٍ
هَذِهِ مُسَابَقَةٌ.|Das ist ein Wettbewerb.|هَذِهِ مُسَابَقَةٌ فِي الْقِرَاءَةِ.|Das ist ein Lesewettbewerb.|مُسَابَقَةٌ
هَذِهِ مُحَادَثَةٌ.|Das ist ein Gespräch.|هَذِهِ مُحَادَثَةٌ بَيْنَ صَدِيقَيْنِ.|Das ist ein Gespräch zwischen zwei Freunden.|مُحَادَثَةٌ
هَذِهِ مُرَاجَعَةٌ.|Das ist eine Wiederholung.|هَذِهِ مُرَاجَعَةٌ لِلْكَلِمَاتِ الْجَدِيدَةِ.|Das ist eine Wiederholung der neuen Wörter.|مُرَاجَعَةٌ
هَذِهِ اِسْتِرَاحَةٌ.|Das ist eine Pause.|هَذِهِ اِسْتِرَاحَةٌ بَعْدَ الدَّرْسِ.|Das ist eine Pause nach dem Unterricht.|اِسْتِرَاحَةٌ
هَذَا اِسْتِمَاعٌ.|Das ist Zuhören.|هَذَا اِسْتِمَاعٌ إِلَى حِوَارٍ قَصِيرٍ.|Hier hört man einem kurzen Dialog zu.|اِسْتِمَاعٌ
هَذَا اِسْتِخْدَامٌ مُفِيدٌ.|Das ist eine sinnvolle Benutzung.|هَذَا اِسْتِخْدَامٌ مُفِيدٌ لِلْكِتَابِ.|Das ist eine sinnvolle Benutzung des Buches.|اِسْتِخْدَامٌ
هَذَا تَعَاوُنٌ.|Das ist Zusammenarbeit.|هَذَا تَعَاوُنٌ بَيْنَ الزُّمَلَاءِ.|Das ist Zusammenarbeit unter Mitschülern.|تَعَاوُنٌ
هَذَا تَعَلُّمٌ.|Das ist Lernen.|هَذَا تَعَلُّمٌ لِكَلِمَاتٍ جَدِيدَةٍ.|Hier werden neue Wörter gelernt.|تَعَلُّمٌ
هَذَا تَحَدُّثٌ.|Das ist Sprechen.|هَذَا تَحَدُّثٌ بِاللُّغَةِ الْعَرَبِيَّةِ.|Hier wird Arabisch gesprochen.|تَحَدُّثٌ
أَنَا مَسْؤُولٌ.|Ich bin verantwortlich.|أَنَا مَسْؤُولٌ عَنْ نَظَافَةِ غُرْفَتِي.|Ich bin für die Sauberkeit meines Zimmers verantwortlich.|مَسْؤُولٌ
هَذَا سُؤَالٌ.|Das ist eine Frage.|هَذَا سُؤَالٌ عَنِ الدَّرْسِ.|Das ist eine Frage zum Unterricht.|سُؤَالٌ
هَذِهِ بِيئَةٌ نَظِيفَةٌ.|Das ist eine saubere Umwelt.|هَذِهِ بِيئَةٌ نَظِيفَةٌ نُحَافِظُ عَلَيْهَا.|Das ist eine saubere Umwelt, die wir schützen.|بِيئَةٌ
هَذِهِ قِرَاءَةٌ.|Das ist Lesen.|هَذِهِ قِرَاءَةٌ لِقِصَّةٍ قَصِيرَةٍ.|Hier wird eine kurze Geschichte gelesen.|قِرَاءَةٌ
هَذِهِ عَائِلَةٌ.|Das ist eine Familie.|هَذِهِ عَائِلَةٌ تَسْكُنُ فِي قَرْيَتِنَا.|Diese Familie wohnt in unserem Dorf.|عَائِلَةٌ
"""
def bare(s):return re.sub('[\u064b-\u065f\u0670]','',unicodedata.normalize('NFC',s))
source=json.loads((ROOT/'data/reading-trainer-source.json').read_text())
words=[(f'rt-{l["id"]}-{i+1:02}',unicodedata.normalize('NFC',l.get('spellings',{}).get(w,w.replace('|','')))) for l in source['levels'] for i,(w,_) in enumerate(l['words'])]
rows=ROWS.strip().splitlines();assert len(rows)==len(words),(len(rows),len(words))
result=[]
for (wid,word),row in zip(words,rows):
 short,de,expanded,expanded_de,focus=map(lambda s:unicodedata.normalize('NFC',s),row.split('|'))
 assert bare(focus)==bare(word),(wid,word,focus)
 sentences=[]
 for ar,translation in [(short,de),(expanded,expanded_de)]:
  assert ar.count(focus)==1 and len(ar.split())<=10,(wid,ar)
  sentences.append({'ar':ar,'de':translation,'focus':focus})
 assert len(expanded.split())>len(short.split()),wid
 result.append({'id':wid,'sentences':sentences})
(ROOT/'data/reading-trainer-sentences.json').write_text(json.dumps({'version':1,'words':result},ensure_ascii=False,indent=2)+'\n')
print('Authored',len(result)*2,'vocalized application sentences')
