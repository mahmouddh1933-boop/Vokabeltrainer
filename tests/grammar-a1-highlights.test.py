import json,subprocess,sys,unittest
from pathlib import Path
R=Path(__file__).resolve().parents[1];sys.path.insert(0,str(R/'tools'))
from grammar_curriculum import load_curriculum
source=json.loads(subprocess.check_output(['node','-e',"console.log(JSON.stringify(require('./js/grammar-data.js')))"],cwd=R));g=load_curriculum(source);bank={l['id']:l for l in g['lessons']}
def examples(id):return [e for s in bank[id]['sections'] for e in s.get('examples',[])]
def marks(e):return [(e['ar'][a['start']:a['end']],a['role']) for a in e.get('annotations',[])]
class Highlights(unittest.TestCase):
 def test_classes(self):
  self.assertEqual(marks(examples('word-classes')[0]),[('كِتَابٌ','noun'),('أَنَا','noun'),('هَذَا','noun')])
  self.assertEqual(marks(examples('word-classes')[1]),[('كَتَبْتُ','verb'),('لَمْ','particle'),('يَكْتُبْ','verb'),('اُكْتُبِي','verb')])
  self.assertEqual(len(marks(examples('word-classes')[2])),3)
 def test_gender_and_moon_letters(self):
  self.assertEqual([marks(e) for e in bank['gender']['sections'][1]['examples']],[[('هَذَا','masculine'),('جَدِيدٌ','masculine')],[('هَذِهِ','feminine'),('جَدِيدَةٌ','feminine')],[('هَذَا','masculine'),('مُجْتَهِدٌ','masculine')],[('هَذِهِ','feminine'),('مُجْتَهِدَةٌ','feminine')]])
  self.assertEqual([marks(e)[1][0] for e in bank['definiteness']['sections'][1]['examples']],['ق','ك','ب'])
 def test_every_pronoun_and_demonstrative(self):
  self.assertEqual([len(s['examples']) for s in bank['pronouns']['sections']],[2,6,6])
  self.assertEqual([marks(e)[0][0] for e in examples('pronouns')],['أَنَا','نَحْنُ','أَنْتَ','أَنْتِ','أَنْتُمَا','أَنْتُمَا','أَنْتُمْ','أَنْتُنَّ','هُوَ','هِيَ','هُمَا','هُمَا','هُمْ','هُنَّ'])
  self.assertEqual(len(examples('demonstratives')),17)
  for e in examples('demonstratives'):self.assertEqual(len(marks(e)),1)
  self.assertEqual(examples('demonstratives')[2]['de'],'Das sind Schüler.')
 def test_prepositions_and_attached_letters(self):
  e=bank['prepositions']['sections'][1]['examples'][1]
  self.assertEqual(marks(e),[('لِ','particle')]);self.assertEqual(e['annotations'][0]['start'],e['ar'].index('لِلط'))
  self.assertEqual(marks(bank['prepositions']['sections'][1]['examples'][2]),[('كَ','particle')])
  self.assertEqual([v for e in examples('sequence-conjunctions') for v,r in marks(e)],['وَ','فَ','ثُمَّ'])
  self.assertEqual(marks(bank['possession-basics']['sections'][0]['examples'][0]),[('ي','suffix'),('كَ','suffix'),('هُ','suffix')])
  self.assertEqual(marks(bank['possession-basics']['sections'][1]['examples'][0]),[('ةٌ','ta'),('تِ','ta'),('ي','suffix')])
 def test_endings_comparison_cases(self):
  self.assertEqual(marks(bank['number']['sections'][1]['examples'][0]),[('انِ','sign')])
  self.assertEqual(marks(bank['number']['sections'][1]['examples'][2]),[('تَ','ta'),('انِ','sign')])
  self.assertEqual(marks(bank['number']['sections'][2]['examples'][0]),[('ونَ','sign'),('ينَ','sign')])
  self.assertEqual(marks(bank['idafa']['sections'][1]['examples'][0])[0][0],'كِتَابَا')
  self.assertEqual([v for e in examples('comparison-basic') for v,r in marks(e)],['أَكْبَرُ','أَقْرَبُ','أَسْهَلُ'])
  self.assertEqual([r for v,r in marks(examples('case-basics')[0])],['nominative','nominative','accusative','genitive'])
  self.assertIn('Ich sah den Schüler.',examples('case-basics')[0]['de'])
  self.assertEqual([marks(e)[0][0] for e in bank['case-basics']['sections'][1]['examples']],['ا','يْ'])
 def test_spelling_targets(self):
  self.assertEqual([v for v,r in marks(examples('ta-endings')[0])],['ت','ت','ت','ت'])
  self.assertEqual([v for v,r in marks(examples('ta-endings')[1])],['ة','ة','ة'])
  self.assertEqual([len(marks(e)) for e in examples('alif-endings')],[3,2,4])
  for e in examples('alif-endings'):
   for v,r in marks(e):self.assertIn(v,['ا','ى'])
  self.assertEqual([len(marks(e)) for e in examples('hamza-initial')],[3,1,2,3,2])
  for e in examples('hamza-initial'):
   for v,r in marks(e):self.assertIn(v,['ا','أ','إ','آ'])
 def test_body_ranges(self):
  for id in ['number','possession-basics','ta-endings']:
   for s in bank[id]['sections']:
    ranges=s.get('bodyAnnotations',{}).get('ar',[])
    for a in ranges:self.assertIn(s['body']['ar'][a['start']:a['end']],['ة','ت','ي'])
if __name__=='__main__':unittest.main()
