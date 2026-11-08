"""Compile manually reviewed Book 2 vocabulary; photographed prompts are source data.

All 46 photos have manual transcripts and source hashes in the review file.
Canonical words and contextual German translations are editorial data. No OCR
or archive access is needed to rebuild the catalog after review.
"""
from pathlib import Path
import json,re,unicodedata,collections,copy
root=Path(__file__).resolve().parents[1]
review=json.loads((root/'data/book-vocabulary-2-review.json').read_text())
old=json.loads((root/'data/book-vocabulary-source.json').read_text());pages={str(p['image']):p['transcript'] for p in review['pages']}
def clean(s):return unicodedata.normalize('NFC',s.replace('ـ',''))
def bare(s):return re.sub('[\u064b-\u065f\u0670]','',clean(s))
def key(s):
 b=bare(s)
 if b in ['من','بمن']:return 'min' if 'مِ' in s else 'man'
 if b in ['أنت','وأنت']:return 'anti' if 'تِ' in s else 'anta'
 if b=='بك':return 'biki' if 'كِ' in s else 'bika'
 if b=='إن' and 'ّ' in s:return 'inna'
 if b=='مالي' and 'ّ' in s:return 'malien'
 if b=='تفضل':return 'prefer-'+b if 'تُ' in s else 'offer'
 if b in ['أفضل','يفضل'] and 'ّ' in s:return 'prefer-'+b
 if b=='رجل':return 'leg' if 'رِ' in s else 'man-human'
 if b=='جد':return 'diligence' if 'جِ' in s else 'grandfather'
 if b=='تمر':return 'pass' if 'مُ' in s else 'dates'
 if b=='بعيد':return 'eid-prefixed' if s.startswith('بِ') else 'far'
 if b=='تجول':return 'strolling-noun' if 'وُ' in s else 'stroll-verb'
 if b=='عمر' and 'ّ' in s:return 'wind-up'
 return b
refs={};aliases={}
for e in old['entries']:
 ar=e['ar'];refs[ar]={'ar':ar,'de':e['de']}
 for form in [ar,*e['sourceForms']]:
  if bare(form)=='يدرس' and ar.startswith('يُ'):continue
  if key(form)=='مالي':continue
  if ar==clean('عِيدٌ') and bare(form)=='بعيد':continue
  aliases[key(form)]=ar
for line in review['lexicon']:
 ar,de,forms=line.split('|');ar=clean(ar)
 assert ar not in refs,('Duplicate existing canonical',ar)
 refs[ar]=dict(ar=ar,de=de)
 for form in [ar,*forms.split()]:
  k=key(form)
  assert k not in aliases or aliases[k]==ar,('Ambiguous lexical alias',form,ar,aliases.get(k))
  aliases[k]=ar
for line in review['aliases']:
 ar,forms=line.split('|');ar=clean(ar)
 assert ar in refs,('Missing reference',ar)
 for form in forms.split():aliases[key(form)]=ar
for ar,de in [('سَلِيمٌ','gesund; unversehrt'),('سَلَّمَ','begrüßen; übergeben'),('صَبَاحٌ','der Morgen')]:refs[clean(ar)]['de']=de
# Whole printed words are matched first; only known conjunction and article prefixes are merged.
def find(form):
 for candidate in [form,form[1:] if form[:1] in 'وف' else form,form[2:] if form.startswith('ال') else form,form[3:] if form[:1] in 'وف' and form[1:3]=='ال' else form]:
  ar=aliases.get(key(candidate))
  if ar:return ar
 return None
unknown=collections.defaultdict(set);used={};ordered=[];records=[]
for n,s in sorted(pages.items(),key=lambda item:int(item[0])):
 ids=[];forms=[]
 for raw in s.split():
  ar=find(raw)
  if ar is None:unknown[raw].add(int(n));continue
  if ar not in used:used[ar]=copy.deepcopy(refs[ar]);used[ar].update(id=f'b2v-{len(ordered)+1:03}',sourceForms=[],sourceImages=[]);ordered.append(used[ar])
  entry=used[ar];form=raw.replace('_',' ');forms.append(form)
  if entry['id'] not in ids:ids.append(entry['id'])
  if form not in entry['sourceForms']:entry['sourceForms'].append(form)
  if int(n) not in entry['sourceImages']:entry['sourceImages'].append(int(n))
  # Source pages retain exact printed forms and their canonical card references.
 metadata=next(p for p in review['pages'] if p['image']==int(n))
 records.append({k:v for k,v in metadata.items() if k!='transcript'}|dict(observedForms=list(dict.fromkeys(forms)),entryIds=ids))
assert not unknown,dict(unknown)
assert len(records)==sum(a['imageCount'] for a in review['archives'])==46
assert len({e['ar'] for e in ordered})==len(ordered)
result=dict(version=1,title=review['title'],titleDe=review['titleDe'],sourceImageCount=len(records),archives=review['archives'],
 reviewMethod='Manual reading of every photograph; OCR is not used as the authority for vocalization.',
 scope='All readable lesson titles, dialogues, captions, stories and questions; cropped margins and tiny background print are excluded. Compound numbers stay complete.',
 deduplication='One lexical card per word within Book 2: merge articles, case, possession and repeated conjugations. Keep meaning-relevant vocalized contrasts. Each book remains an independent collection.',
 referenceSourceSha256=__import__('hashlib').sha256((root/'data/book-vocabulary-source.json').read_bytes()).hexdigest(),entries=ordered,pages=records)
(root/'data/book-vocabulary-2-source.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(f"Book 2: {len(records)} photos; {len(ordered)} canonical cards; {len(ordered)//20} full lists and {len(ordered)%20} remaining words.")
