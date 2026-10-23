"""Generate the portable browser bank from the reviewed JSON source (no fetch/file:// dependency)."""
from pathlib import Path
import json
ROOT = Path(__file__).resolve().parents[1]
bank = json.loads((ROOT/'data/exams/bank.json').read_text())
(ROOT/'js/teacher-exams-data.js').write_text('/* New exercises inspired by the teacher’s uploaded originals; originals remain byte-identical. */\n(function(root, factory) { const data=factory(); if(typeof module==="object" && module.exports) module.exports=data; else root.TeacherExamData=data; })(globalThis, () => ('+json.dumps(bank,ensure_ascii=False,separators=(',', ':'))+'));\n')
print('Teacher exam browser bank generated.')
