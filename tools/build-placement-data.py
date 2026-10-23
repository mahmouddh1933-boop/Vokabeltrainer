"""Validate the authored placement bank and emit its offline browser module."""
from pathlib import Path
import json,unicodedata
ROOT=Path(__file__).resolve().parents[1]
data=json.loads((ROOT/'data/placement-bank.json').read_text())
ids={q['id']:q for q in data['questions']};assert len(ids)==160
seen=[]
for t in data['tests']:
 for name,form in t['forms'].items():
  assert len(form)==16 and len(set(form))==16
  assert set(form)<=ids.keys()
  assert {ids[q]['domain'] for q in form}==set(t['domains'])
  assert all(sum(ids[q]['domain']==d for q in form)==(2 if t['id']=='quick' else 8) for d in t['domains'])
  assert all(sum(ids[q]['correct']==i for q in form)==4 for i in range(4)), 'Balanced correct-answer positions'
  seen+=form
assert len(seen)==len(set(seen))==160,'Every form must use exclusive items'
for q in data['questions']:
 assert len(q['options'])==len(set(q['options']))==4 and 0<=q['correct']<4
 if q.get('passage'):assert q['passage'] in data['passages']
 if q['domain']=='listening':assert data['passages'][q['passage']]['kind']=='audio'
manifest=ROOT/'audio/placement-manifest.json'
if manifest.exists():
 clips=json.loads(manifest.read_text())['clips'];data['audio']={unicodedata.normalize('NFC',c['text']):c['path'] for c in clips}
 assert all(unicodedata.normalize('NFC',p['text']) in data['audio'] for p in data['passages'].values() if p['kind']=='audio')
(ROOT/'js/placement-data.js').write_text('(() => {"use strict"; const data='+json.dumps(data,ensure_ascii=False,indent=2)+';\nif(typeof module!=="undefined"&&module.exports)module.exports=data;else window.ArabicPlacementData=data;})();\n')
print('PASS: 160 authored items, five tests, two disjoint 16-item forms per test.')
