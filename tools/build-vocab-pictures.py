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

# Five complete concrete-word lists: local drawings stay under 1.4 KB each.
INK='#4b6b51'
FILL='#d3dfc0'
def drawing(shapes):
    return f'<g fill="{FILL}" stroke="{INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">{shapes}</g>'

furniture = [
    '<path d="M19 83V32h8v32h77v19M28 64V44h66v20"/><rect x="30" y="45" width="23" height="16" rx="5"/>', # bed
    '<path d="M39 52V15h42v37M32 59h56v10H32ZM39 70v19m42-19v19"/>',
    '<path d="M16 42h88v12H16ZM25 54v32m70-32v32"/>',
    '<path d="M14 38h92v10H14ZM23 49v39m75-39v39M68 49v33h28M70 63h25"/><rect x="34" y="19" width="30" height="18" rx="3"/>',
    '<rect x="29" y="12" width="62" height="76" rx="5"/><path d="M60 14v72m-8-37v13m16-13v13"/>',
    '<rect x="20" y="41" width="80" height="34" rx="8"/><path d="M28 45V25h64v20M15 44v31h90V44M28 76v10m64-10v10M60 43v25"/>',
    '<path d="M15 52h90v10H15ZM28 63v14m64-14v14"/><path d="M30 28h12v22H30ZM47 23h14v27H47ZM69 30h15v20H69Z"/>',
    '<ellipse cx="60" cy="48" rx="30" ry="37"/><path d="m45 51 26-26m-14 39 22-22M43 87h34"/>',
    '<path d="m41 16-19 39h76L79 16ZM60 56v27M38 86h44"/>',
    '<path d="m27 20 72 9-7 57-76-9Z"/><path d="m35 31 50 6-5 35-52-6ZM25 20l-5-8m16 10-1-9m12 10 1-9m42 76 5 8m-16-10 2 9m-14-11-1 9"/>',
    '<path d="M21 26q39-10 78 0-8 24 0 48-39 10-78 0 8-24 0-48Z"/>',
    '<path d="M23 19h67v63H23ZM31 25h57v49H31Z"/><path d="M38 26v47m12-47v47m12-47v47m12-47v47"/>',
    '<path d="M18 17h84M25 19v66l24-11V20M71 20v54l24 11V19M30 34v37m59-37v37"/>',
    '<rect x="15" y="20" width="90" height="57" rx="6"/><rect x="23" y="28" width="74" height="40" rx="2"/><path d="M60 78v9M42 90h36"/>',
    '<rect x="31" y="10" width="58" height="80" rx="5"/><path d="M32 40h56M43 21v12m0 17v23"/>',
    '<rect x="25" y="14" width="70" height="75" rx="6"/><circle cx="60" cy="58" r="22"/><circle cx="38" cy="26" r="3"/><path d="M52 72q-8-10 6-20t15 10M65 25h16"/>',
    '<rect x="22" y="14" width="76" height="75" rx="5"/><circle cx="38" cy="27" r="4"/><circle cx="59" cy="27" r="4"/><circle cx="80" cy="27" r="4"/><rect x="31" y="41" width="58" height="38" rx="4"/><path d="M42 49h36"/>',
    '<path d="m78 11-20 48M37 56l33 12-13 22-34-12Z"/><path d="m32 77 13-17m-4 21 12-18m-4 21 12-18"/>',
    '<path d="M22 16h76M32 19v62h54V19M39 68h40m-40 8h40"/>',
    '<rect x="24" y="38" width="72" height="43" rx="15"/><ellipse cx="58" cy="52" rx="18" ry="7"/><circle cx="36" cy="23" r="7"/><circle cx="77" cy="18" r="9"/>',
]
assert len(furniture)==20
for index, shapes in enumerate(furniture):save('a1_10',index,drawing(shapes))

rooms = [
    '<path d="m13 46 47-35 47 35M25 39v49h70V39M52 88V61h19v27"/>',
    '<rect x="25" y="9" width="70" height="80"/><path d="M36 21h15v15H36ZM68 21h15v15H68ZM36 45h15v15H36ZM68 45h15v15H68ZM53 89V70h16v19"/>',
    '<path d="M17 21h86v66H17ZM17 21l18 14h50l18-14M35 35v37h50V35M17 87l18-15m50 0 18 15"/>',
    '<path d="M16 19h88v68H16ZM29 77V44h64v33M30 60h62M36 48h18v10H36ZM30 60V36h62v24"/>',
    '<path d="M16 18h88v70H16ZM28 54V38h64v16M25 54v21h70V54M58 53v17M31 76v6m58-6v6"/>',
    '<path d="M16 18h88v70H16ZM27 50h66v28H27ZM61 50v28M32 37h18v8H32Z"/><circle cx="76" cy="42" r="6"/>',
    '<path d="M17 19h86v69H17ZM27 59h66q-2 18-14 18H41Q29 76 27 59ZM34 58V42q0-12 15-12M39 79v6m42-6v6"/>',
    '<path d="M22 17h76v72H22ZM38 88V32h43v56m-4-38h-8"/><path d="m40 18 20-10 20 10"/>',
    '<path d="M25 12h70v76H25ZM25 37h70m-70 25h70"/><path d="M29 38h62v23H29Z" fill="#ae733f"/>',
    '<path d="M18 86h20V70h19V54h19V38h19V21h10M19 62l72-52"/>',
    '<rect x="20" y="10" width="80" height="80" rx="5"/><path d="M35 87V37h50v50M60 38v49m-17-63 6-7 6 7m11-7 6 7 6-7"/>',
    '<path d="M30 13h60v36H30ZM18 50h84v34H18ZM27 54v26m17-26v26m17-26v26m17-26v26m17-26v26"/>',
    '<path d="M16 28h88v59H16Z" fill="#eef1e3"/><path d="M16 28h88" stroke="#b4773f" stroke-width="9"/>',
    '<path d="M17 20h86v64H17Z" fill="#eef1e3"/><path d="m17 84 18-21h50l18 21Z" fill="#ae733f"/>',
    '<path d="M24 15h71v72H24Z" fill="#ae733f"/><path d="M24 38h71M24 63h71M48 16v22m25 0v24m-25 1v24" stroke="#fffdf5"/>',
    '<rect x="30" y="12" width="60" height="77"/><path d="M39 89V20h43v69"/><circle cx="72" cy="55" r="3"/>',
    '<rect x="23" y="15" width="74" height="70"/><path d="M60 16v68M24 50h72M20 89h80"/>',
    '<circle cx="39" cy="37" r="21"/><circle cx="39" cy="37" r="9"/><path d="m55 52 39 36m-12-25-9 10m0-17-9 10"/>',
    '<rect x="36" y="15" width="48" height="72" rx="9"/><circle cx="60" cy="58" r="12"/><path d="M46 28h28M51 77h18"/>',
    '<path d="M24 89V37h72v52M19 38V25h82v13M33 25V13h52v12M41 24v-7m12 7v-7m13 7v-7m12 7v-7"/>',
]
assert len(rooms)==20
for index, shapes in enumerate(rooms):save('a1_09',index,drawing(shapes))

clothes=['👔','👖','👗',None,'🧥',None,'👞','🧦','🎩','🧣',None,'👓','👜','☂️','💍','⌚','👛','🧤','👕',None]
for index,glyph in enumerate(clothes):
    if glyph:save('a1_14',index,icon(glyph))
save('a1_14',3,drawing('<path d="M41 17h38l19 66H22ZM41 26h38M47 29 40 74m20-45v45m13-45 7 45"/>'))
save('a1_14',5,drawing('<path d="m42 21 18 7 18-7 20 14-9 24-12-7v27H43V52l-12 7-9-24ZM60 29v49M46 65h8m12 0h8M43 79h34" fill="#7c9c85"/>'))
save('a1_14',10,drawing('<rect x="13" y="40" width="94" height="21" rx="5"/><rect x="27" y="36" width="25" height="29" rx="3"/><path d="M31 50h25m16 0h1m11 0h1m11 0h1"/>'))
save('a1_14',19,drawing('<path d="m40 14 20 7 20-7 25 17-12 18-9-7v45H36V42l-9 7-12-18ZM40 14l20 39 20-39M60 54v32M46 67h7m14 0h7"/>'))

weather=['🌤️','☀️','🌷','☀️','🍂','⛄','🌧️','❄️','🌬️',None,None,None,'☀️','🌧️','🌳','🌸',None,'🌊','⛰️','🏖️']
for index,glyph in enumerate(weather):
    if glyph:save('a1_20',index,icon(glyph))
for index,level,color in [(9,29,'#c06f41'),(10,67,'#4b83a1'),(11,48,'#ab9c4e')]:
    save('a1_20',index,drawing(f'<path d="M45 21q0-12 14-12t14 12v45a22 22 0 1 1-28 0Z"/><path d="M59 76V{level}" stroke="{color}" stroke-width="9"/><circle cx="59" cy="78" r="11" fill="{color}"/><path d="M80 27h14m-14 14h10m-10 14h14"/>'))
save('a1_20',16,drawing('<path d="M10 15h100v72H10Z"/><path d="M50 15q35 23 2 36T60 87" fill="none" stroke="#629bac" stroke-width="20"/>'))

# Body diagrams highlight the anatomical part instead of using ambiguous face emojis.
def body(part):
    base='<circle cx="60" cy="18" r="12"/><path d="M44 36h32l12 24-8 4-8-17v19l6 25H65l-5-24-5 24H42l6-25V47l-8 17-8-4Z"/>'
    marks={
      0:'<path d="M60 7v83M32 50h56"/>',
      10:'<path d="M54 31h12"/>',11:'<path d="M44 37h10"/>',
      12:'<path d="m42 43-9 18"/>',13:'<circle cx="32" cy="65" r="5"/>',
      15:'<path d="M60 39v23m-10-18 10 4 10-4"/>',16:'<ellipse cx="60" cy="55" rx="8" ry="7"/>',
      17:'<path d="m69 70 5 18"/>',18:'<circle cx="70" cy="76" r="5"/>',19:'<path d="M66 91h15"/>',
    }
    mark=marks[part]
    return drawing(base)+f'<g fill="none" stroke="#b8743b" stroke-width="6" stroke-linecap="round">{mark}</g>'
for index in [0,10,11,12,13,15,16,17,18,19]:save('a1_15',index,body(index))
def head(part):
    base='<ellipse cx="60" cy="49" rx="29" ry="37"/><path d="M32 35q3-29 28-27 26 0 29 27M39 38h9m24 0h9M55 43l-4 15h13M49 69q11 8 23 0" fill="none"/>'
    marks={
      1:'<ellipse cx="60" cy="49" rx="29" ry="37"/>',
      2:'<ellipse cx="60" cy="53" rx="22" ry="28"/>',
      3:'<ellipse cx="44" cy="39" rx="9" ry="5"/>',
      4:'<path d="M88 39q16-9 11 12T88 63"/>',
      5:'<path d="M56 42l-5 16h13"/>',
      6:'<ellipse cx="60" cy="69" rx="13" ry="6"/>',
      9:'<path d="M33 32q4-26 27-24t28 24M43 13l-7 18m18-22-4 19m16-19 4 19m7-13 8 16"/>',
    }
    return drawing(base)+f'<g fill="none" stroke="#b8743b" stroke-width="4" stroke-linecap="round">{marks[part]}</g>'
for index in [1,2,3,4,5,6,9]:save('a1_15',index,head(index))
save('a1_15',7,drawing('<path d="M30 19q10-12 30-3 20-9 30 3 5 17-8 32-4 37-14 33l-8-26-8 26q-10 4-14-33-13-15-8-32Z" fill="#fffdf5"/>'))
save('a1_15',8,drawing('<ellipse cx="60" cy="43" rx="36" ry="25" fill="#72594d"/><path d="M40 42h40v23q0 23-20 23T40 65Z" fill="#d28b84"/><path d="M60 47v25"/>'))
save('a1_15',14,drawing('<path d="M35 85V52q0-7 9-4V19q0-12 10-6v30-9q0-10 10-5v15-6q0-10 10-5v13-3q0-10 10-5v25q0 17-12 22Z"/><path d="M48 16h1v22" fill="none" stroke="#b8743b" stroke-width="6"/>'))

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
