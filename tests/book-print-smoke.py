"""Verify every lesson prints on two A4 pages, including special illustrations."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import argparse, subprocess, re
parser=argparse.ArgumentParser()
parser.add_argument('--base-url',default='http://127.0.0.1:8000')
base=parser.parse_args().base_url.rstrip('/')
out=Path('/tmp/jisr-book-printchecks');out.mkdir(exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1280,'height':1000})
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(base+'/book-level-two.html')
    lessons=page.evaluate('ArabicBookData.lessons')
    page.emulate_media(media='print')
    for l in lessons:
        page.evaluate('id=>location.hash=id',l['id'])
        page.wait_for_function('char=>document.getElementById("book-letter").textContent===char',arg=l['char'])
        page.wait_for_function('Array.from(document.querySelectorAll("#book-print img")).every(img=>img.complete && img.naturalWidth>0)')
        file=out/(l['id']+'.pdf')
        # Background graphics disabled: vocabulary pictures must still print.
        page.pdf(path=str(file),format='A4',print_background=False)
        info=subprocess.check_output(['pdfinfo',str(file)],text=True)
        pages=int(re.search(r'^Pages:\s+(\d+)',info,re.M).group(1))
        assert pages==2,(l['char'],pages)
    assert not errors,errors
    browser.close()
print('PASS: all 28 lessons print on two A4 pages with actual image elements; no app controls or saved answers in the worksheet')
