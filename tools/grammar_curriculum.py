"""Assemble the requested A1–B2 grammar path without verb paradigms.

Original source lesson files and IDs are retained. Only edition selection/order
changes; additional spelling lessons are kept in a clearly separate appendix.
"""
from copy import deepcopy
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]

def bi(ar, de):return {'ar': ar, 'de': de}

def load_curriculum(grammar):
    bank = {l['id']: deepcopy(l) for l in grammar['lessons']}
    for name in ['a1-a2-interrogatives.json','a1-a2-time-place.json']:
        item=json.loads((ROOT/'data'/name).read_text());bank[item['id']]=item
    for item in json.loads((ROOT/'data/a1-a2-unit-grammar.json').read_text()):bank[item['id']]=item
    advanced=json.loads((ROOT/'data/b1-b2-grammar.json').read_text())
    bank[advanced['passive']['id']]=advanced['passive']
    bank['active-participle']['sections']+=advanced['activeSections']
    bank['active-participle']['questions']+=advanced['activeQuestions']
    aliases={'detached-pronouns':'pronouns','adjective-basic':'adjectival-attribute'}
    for item in json.loads((ROOT/'data/grammar/curriculum-additions.json').read_text()):
        item['id']=aliases.get(item['id'],item['id'])
        item['contentVersion']=max(2,item.get('contentVersion',0))
        bank[item['id']]=item
    bank['interrogative-nouns']['title']=bi('أسماء الاستفهام وتكوين الأسئلة','Fragewörter und Fragen bilden')
    bank['subject-object']['title']=bi('الجملة الفعلية والفاعل والمفعول به','Verbalsatz, Subjekt und Objekt')
    bank['number']['title']=bi('المفرد والمثنى والجمع وجموع التكسير الشائعة','Singular, Dual und häufige Pluralformen')
    plan=json.loads((ROOT/'data/grammar/curriculum-plan.json').read_text())
    lessons=[];stages=[]
    for stage in plan['stages']:
        stages.append({k:v for k,v in stage.items() if k!='owner'})
        previous=None
        for ident in stage['ids']:
            lesson=bank[ident]
            lesson['stage']=stage['id'];lesson['level']=stage['id'] if stage['id'] in ['A1','A2','B1','B2'] else None
            lesson['owner']=stage['owner'];lesson['prerequisites']=[previous] if previous else []
            lessons.append(lesson);previous=ident
    if len({l['id'] for l in lessons})!=len(lessons):raise ValueError('Curriculum lesson IDs must be unique')
    return {**grammar,'lessons':lessons,'stages':stages,'curriculumVersion':1}
