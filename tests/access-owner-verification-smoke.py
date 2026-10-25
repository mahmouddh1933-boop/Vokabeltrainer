"""Configured primary owner gets administration only after actual email confirmation."""
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
import subprocess,os,json,urllib.request
ROOT=Path(__file__).resolve().parents[1];EMAIL='emulator-owner@example.test'
subprocess.run(['node','functions/test/reset-owner.cjs'],cwd=ROOT,check=True,env={**os.environ,'FIREBASE_AUTH_EMULATOR_HOST':'127.0.0.1:9099','FIRESTORE_EMULATOR_HOST':'127.0.0.1:8080'})
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(viewport={'width':390,'height':900});page.add_init_script("localStorage.setItem('vocabInterfaceLanguage','ar');localStorage.setItem('oliveLearnerThemeV1','neutral')");page.goto('http://127.0.0.1:5000/login.html');expect(page.locator('#auth-submit')).to_be_enabled();page.locator('[data-auth-mode=register]').click();page.locator('#auth-email').fill(EMAIL);page.locator('#auth-password').fill('Olive-Verify-Test-123!');page.locator('#auth-confirm').fill('Olive-Verify-Test-123!');page.locator('#auth-submit').click();expect(page.locator('#auth-blocker')).to_contain_text('أكّد ملكية',timeout=30000);assert page.evaluate('typeof VocabApp')=='undefined'
 codes=json.load(urllib.request.urlopen('http://127.0.0.1:9099/emulator/v1/projects/letters-from-olive/oobCodes'))['oobCodes'];code=next(c['oobCode'] for c in reversed(codes) if c['email']==EMAIL and c['requestType']=='VERIFY_EMAIL')
 page.evaluate('code=>firebase.auth().applyActionCode(code)',code);page.get_by_role('button',name='أعد التحقق',exact=True).click();page.wait_for_selector('#auth-admin-link',state='attached',timeout=30000);assert page.evaluate('OliveAccess.isAdmin()')
 page.goto('http://127.0.0.1:5000/admin.html');page.wait_for_selector('#admin-members .admin-member');assert page.evaluate('OliveAuth.getUser().getIdTokenResult(true).then(r=>r.claims.oliveAdmin)') is True
 b.close();print('PASS configured primary owner auto-bootstrap, no learning before verification, actual verification link and server-issued admin device session')
