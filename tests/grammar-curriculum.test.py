"""Structural and independent linguistic checks for the requested level plan."""
import json,subprocess,sys,unittest
from pathlib import Path
R=Path(__file__).resolve().parents[1];sys.path.insert(0,str(R/'tools'))
from grammar_curriculum import load_curriculum
original=json.loads(subprocess.check_output(['node','-e',"console.log(JSON.stringify(require('./js/grammar-data.js')))"],cwd=R))
g=load_curriculum(original);bank={l['id']:l for l in g['lessons']}
class Curriculum(unittest.TestCase):
 def test_levels_and_order(self):
  stages={s['id']:s for s in g['stages']}
  self.assertEqual([len(stages[i]['ids']) for i in ['A1','A2','B1','B2']],[12,13,16,16])
  self.assertEqual(stages['A1']['ids'][:6],['word-classes','gender','definiteness','pronouns','demonstratives','nominal-basics'])
  self.assertEqual(stages['A2']['ids'][-4:],['comparison-basic','basic-numerals','reason-result','case-basics'])
  self.assertEqual(stages['B1']['ids'][:6],['sentence-analysis','inflection-signs','past-construction','imperative-construction','present-inflection','five-verbs'])
  self.assertEqual(stages['B2']['ids'][:8],['passive-voice','tamyiz','absolute-object','apposition','emphasis','exception','advanced-conditionals','diptotes'])
  self.assertEqual(len(bank),63)
 def test_schema_and_annotations(self):
  for l in g['lessons']:
   self.assertGreaterEqual(len(l['questions']),4,l['id']);self.assertGreaterEqual(len(l['sections']),2,l['id'])
   for key in ['title','intro','summary','takeaway']:
    self.assertTrue(l[key]['ar'] and l[key]['de'],(l['id'],key))
   for q in l['questions']:
    self.assertIn(q['correct'],range(len(q['options'])));self.assertEqual(len({str(o) for o in q['options']}),len(q['options']))
    self.assertTrue(q['explanation']['ar'] and q['explanation']['de'])
   for section in l['sections']:
    for e in section.get('examples',[]):
     end=0
     for a in sorted(e.get('annotations',[]),key=lambda a:a['start']):
      self.assertGreaterEqual(a['start'],end,(l['id'],e['ar']));self.assertGreater(a['end'],a['start']);self.assertLessEqual(a['end'],len(e['ar']));end=a['end']
   for p in l['prerequisites']:self.assertIn(p,bank)
 def test_linguistic_answers(self):
  fixtures={'exception':{'ما إعراب خالد في ما حضر إلا خالدٌ؟':'فاعل مرفوع'},'diptotes':{'أي صيغة صحيحة مع أل؟':'فِي الْمَسَاجِدِ'},'inflection-signs':{'اختر نصب جمع المؤنث السالم.':'رَأَيْتُ الطَّالِبَاتِ.'},'pronouns':{'أي ضمير يعود على امرأتين غائبتين؟':'هُمَا'},'basic-numerals':{'اختر ثلاث سيارات.':'ثَلَاثُ سَيَّارَاتٍ'}}
  for id,qs in fixtures.items():
   for prompt,answer in qs.items():
    q=next(q for q in bank[id]['questions'] if q['prompt']['ar']==prompt);self.assertEqual(q['options'][q['correct']],answer)
 def test_exact_new_highlight_targets(self):
  def marks(id,section):
   e=bank[id]['sections'][section]['examples'][0]
   return [e['ar'][a['start']:a['end']] for a in e['annotations']]
  self.assertEqual(marks('inflection-signs',1),['ا','يْ','تِ'])
  self.assertEqual(marks('future-usage',1),['سَ'])
  self.assertEqual(marks('nominal-basics',0),['الطَّالِبُ','مُجْتَهِدٌ'])
 def test_unit_links_stay_in_beginner_edition(self):
  for ids in json.loads((R/'data/a1-a2-unit-links.json').read_text()).values():
   for id in ids:self.assertEqual(bank[id]['owner'],'a1-a2')
 def test_paradigms_stay_separate(self):
  self.assertNotIn('basic-verbs',bank)
  self.assertEqual([l['id'] for l in g['lessons'] if l['owner']=='a1-a2' and l['id'] in ['past-construction','imperative-construction','present-inflection']],[])
if __name__=='__main__':unittest.main()
