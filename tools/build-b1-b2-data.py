"""Refresh the standalone JS bundle from canonical advanced-unit JSON."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
data=json.loads((ROOT/'data/b1-b2-units.json').read_text())
(ROOT/'js/b1-b2-units-data.js').write_text('window.HuroofAdvancedUnits='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n')
print('Advanced units:',len(data['units']))
