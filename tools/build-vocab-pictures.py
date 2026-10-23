"""Generate tiny local SVG learning aids and exact Arabic/German pair mappings.

Uses simple geometry and system Unicode pictographs; no remote images or fonts.
"""
import json
from pathlib import Path
import unicodedata

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'images/vocab'
OUT.mkdir(parents=True, exist_ok=True)
catalog = json.loads((ROOT / 'data/vocab_catalog.json').read_text())
lists = {item['id']: item for item in catalog['lists']}
mapping = {}
def key(ar, de):
    ar = ''.join(c for c in unicodedata.normalize('NFC', ar) if not unicodedata.category(c).startswith('M') and c != 'ـ').strip()
    return json.dumps([ar, unicodedata.normalize('NFC', de).lower().strip()], ensure_ascii=False, separators=(',', ':'))


def save(list_id, index, content):
    word = lists[list_id]['words'][index]
    path = f'images/vocab/{list_id}-{index+1:02d}.svg'
    svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100"><rect x="1" y="1" width="118" height="98" rx="18" fill="#f6f5e9"/>' + content + '</svg>'
    (ROOT / path).write_text(svg)
    mapping[key(word['ar'], word['de'])] = path


def icon(glyph):
    return f'<text x="60" y="73" text-anchor="middle" font-size="66" font-family="Noto Color Emoji,Apple Color Emoji,Segoe UI Emoji,sans-serif">{glyph}</text>'


sets = {
    'a1_11': ['🍞','🍚','🍝','🥩','🍗','🐟','🥚','🧀','🧈',None,'🧂',None,'🥣','🥗','🍽️','🥄',None,'🔪',None,'🍳'],
    'a1_12': ['🍎','🍌','🍊','🍋','🍇','🍓','🍉',None,None,'🍑','🥔','🍅','🥒','🥕','🧅','🧄','🥬','🫑','🫛','🌽'],
    'a1_13': ['💧','🥛','🍵','☕','🧃','🍫','🍰','🍨',None,None,None,'🍽️','🥐',None,None,'📋',None,None,None,None],
    'a1_16': ['🏫',None,None,'📖','📓','🖊️','✏️',None,'📏',None,'📄','🎒',None,None,None,None,None,None,'📃',None],
    'a1_21': ['🐈','🐕','🐦','🐟','🐎','🐄','🐑','🐐','🐔','🦆','🐇','🐁','🐪','🫏','🦁','🐘','🐒','🐝','🦋','🐢'],
}
for list_id, glyphs in sets.items():
    assert len(glyphs) == len(lists[list_id]['words'])
    for index, glyph in enumerate(glyphs):
        if glyph: save(list_id,index,icon(glyph))

# Pomegranate has no standard emoji: a crown, cut-open fruit and visible seeds.
save('a1_12',7,'<path d="M49 25 44 12 56 17 62 8 68 18 80 12 75 27" fill="#a32933"/><circle cx="61" cy="56" r="34" fill="#b7383e"/><ellipse cx="70" cy="57" rx="23" ry="29" fill="#f6dac5"/>'+''.join(f'<ellipse cx="{x}" cy="{y}" rx="4" ry="5" fill="#b6243d"/>' for x,y in [(60,39),(75,39),(53,53),(68,54),(82,54),(60,69),(75,71)]))
save('a1_12',8,'<g fill="#8d4d28" stroke="#5e331b" stroke-width="2"><ellipse cx="36" cy="61" rx="14" ry="25" transform="rotate(-25 36 61)"/><ellipse cx="64" cy="42" rx="14" ry="25"/><ellipse cx="85" cy="67" rx="14" ry="25" transform="rotate(25 85 67)"/></g><path d="M36 48v25M64 28v28M85 54v25" stroke="#bd824e" stroke-width="3"/>')
save('a1_11',9,'<path d="M50 12h20v25l12 10v40H38V47l12-10Z" fill="#cad883" stroke="#52713e" stroke-width="3"/><path d="M41 58h38v25H41Z" fill="#b1bd41"/><path d="M48 10h24v10H48Z" fill="#315e45"/>')
save('a1_11',11,'<g fill="#fff" stroke="#b7b2a2" stroke-width="2"><path d="m25 48 22-14 22 14v24L47 85 25 72Z"/><path d="m57 27 19-12 20 12v23L76 62 57 50Z"/><path d="m45 55 22-14 22 14v24L67 92 45 79Z"/></g>')
save('a1_11',16,'<path d="M43 15v24q0 12 12 14v35M55 15v38M67 15v24q0 12-12 14" fill="none" stroke="#64706a" stroke-width="6" stroke-linecap="round"/>')
save('a1_11',18,'<path d="M26 36h68v35q0 16-16 16H42q-16 0-16-16Z" fill="#8c9c8a" stroke="#3e6250" stroke-width="3"/><path d="M20 35h80M43 28q17-17 34 0M11 46h15m68 0h15" fill="none" stroke="#3e6250" stroke-width="7" stroke-linecap="round"/>')
save('a1_13',8,'<path d="m35 13 7 74h36l7-74Z" fill="#dbeef2" fill-opacity=".5" stroke="#527d85" stroke-width="3"/><path d="M39 24h42" stroke="#527d85" stroke-width="2"/>')
save('a1_13',9,'<path d="M28 27h51v40q0 17-25 17T28 67Z" fill="#f8faf9" stroke="#456d58" stroke-width="3"/><path d="M79 35h12q18 16-12 27M22 89h63" fill="none" stroke="#456d58" stroke-width="4"/>')
save('a1_13',10,'<path d="M51 10h18v22l10 10v45H41V42l10-10Z" fill="#d6eaf2" stroke="#5b8590" stroke-width="3"/><path d="M50 9h20v9H50Z" fill="#567f65"/>')

colors = ['#ef4444','#2563eb','#16a34a','#facc15','#ffffff','#151515','#985728','#858585','#f97316','#ec7bad','#9333ea']
for index, color in enumerate(colors):
    save('a1_08',index,f'<rect x="24" y="15" width="72" height="70" rx="16" fill="{color}" stroke="#667062" stroke-width="2"/>')
save('a1_08',11,'<rect x="24" y="16" width="72" height="68" rx="14" fill="#dfeacb" stroke="#7c9262" stroke-width="3"/><circle cx="60" cy="48" r="17" fill="#fffbe7"/>')
save('a1_08',12,'<rect x="24" y="16" width="72" height="68" rx="14" fill="#244b39" stroke="#7c9262" stroke-width="3"/><circle cx="60" cy="48" r="17" fill="#142b22"/>')
shapes = ['<circle cx="60" cy="50" r="33"/>','<rect x="27" y="17" width="66" height="66"/>','<path d="m60 13 40 72H20Z"/>','<rect x="16" y="27" width="88" height="46"/>','<path d="M19 50h82"/>','<circle cx="60" cy="50" r="5" fill="#49775b"/>','<circle cx="36" cy="39" r="18"/><path d="m79 44 19 33H60Z"/>']
for index, shape in enumerate(shapes,13):
    save('a1_08',index,'<g fill="#d7e5c6" stroke="#49775b" stroke-width="5" stroke-linejoin="round">'+shape+'</g>')

# Family mini-diagrams: parents and children, with the requested person highlighted.
# More abstract relationships are intentionally left text-only.
def person(x,y,kind,active):
    color = '#b5743e' if active else '#85997b'
    hair = f'<path d="M{x-9} {y+1}q0-17 18 0" fill="none" stroke="{color}" stroke-width="4"/>' if kind == 'female' else ''
    return f'<g fill="{color}"><circle cx="{x}" cy="{y}" r="7"/><path d="M{x-11} {y+11}h22v20h-22Z"/></g>'+hair
def family(target):
    result='<path d="M37 44h46M60 44v13M37 57h46" stroke="#b9c5ad" stroke-width="3" fill="none"/>'
    for role,x,y,kind in [('father',37,17,'male'),('mother',83,17,'female'),('son',37,66,'male'),('daughter',83,66,'female')]:
        result+=person(x,y,kind,role in target)
    return result
for index,target in [(0,{'father','mother','son','daughter'}),(1,{'father'}),(2,{'mother'}),(3,{'son'}),(4,{'daughter'}),(14,{'son'}),(18,{'father','mother'})]:
    save('a1_04',index,family(target))
for index,glyph in [(7,'👴'),(8,'👵')]:save('a1_04',index,icon(glyph))

source = '''(() => { "use strict";
const mappings = __MAP__;
const key = (ar,de) => JSON.stringify([String(ar).normalize("NFC").replace(/\\p{M}/gu,"").replace(/ـ/g,"").trim(),String(de).normalize("NFC").trim().toLocaleLowerCase("de")]);
const api = {get:(ar,de)=>mappings[key(ar,de)] || null, mappings};
if(typeof module!=="undefined" && module.exports) module.exports=api; else window.VocabPictures=api;
})();
'''.replace('__MAP__',json.dumps(mapping,ensure_ascii=False,separators=(',',':')))
(ROOT / 'js/vocab-pictures.js').write_text(source)
size=sum(path.stat().st_size for path in OUT.glob('*.svg'))
assert all(path.stat().st_size < 1400 for path in OUT.glob('*.svg'))
print(f'{len(mapping)} exact word-pair illustrations; {size:,} SVG bytes total; no external assets.')
