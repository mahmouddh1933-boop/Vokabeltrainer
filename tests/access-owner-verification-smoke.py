"""Free Spark owner is assigned manually only after verified Firebase sign-in.
The protocol emulator used by this browser test does not enforce Rules.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
import subprocess,os,json,urllib.request
ROOT=Path(__file__).resolve().parents[1]
env={**os.environ,'FIREBASE_AUTH_EMULATOR_HOST':'127.0.0.1:9099','FIRESTORE_EMULATOR_HOST':'127.0.0.1:8080'}
seed=json.loads(subprocess.check_output(['node','verification/seed.cjs'],cwd=ROOT,text=True,env=env))
EMAIL=seed['unverifiedEmail']
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);ctx=b.new_context();page=ctx.new_page()
 ctx.add_init_script("localStorage.setItem('vocabInterfaceLanguage','ar');localStorage.setItem('oliveLearnerThemeV1','neutral')")
 ctx.route('**/*',lambda r:r.continue_() if r.request.url.startswith(tuple('http://127.0.0.1:'+str(port)+'/' for port in [5000,9099,8080])) else r.abort())
 page.goto('http://127.0.0.1:5000/login.html');expect(page.locator('#auth-submit')).to_be_enabled();page.locator('[data-auth-mode=register]').click();page.locator('#auth-email').fill(EMAIL);page.locator('#auth-password').fill('Olive-Verify-Test-123!');page.locator('#auth-confirm').fill('Olive-Verify-Test-123!');page.locator('#auth-submit').click();expect(page.locator('#auth-blocker')).to_contain_text('أكّد ملكية',timeout=30000);assert page.evaluate('typeof VocabApp')=='undefined'
 codes=json.load(urllib.request.urlopen('http://127.0.0.1:9099/emulator/v1/projects/letters-from-olive/oobCodes'))['oobCodes'];code=next(c['oobCode'] for c in reversed(codes) if c['email']==EMAIL and c['requestType']=='VERIFY_EMAIL')
 page.evaluate('code=>firebase.auth().applyActionCode(code)',code);page.get_by_role('button',name='أعد التحقق',exact=True).click();page.wait_for_selector('#olive-account',timeout=30000)
 assert not page.evaluate('OliveAccess.isAdmin()');assert page.locator('#auth-admin-link').count()==0
 uid=page.evaluate('OliveAuth.getUser().uid')
 subprocess.run(['node','verification/set-test-admin.cjs',uid],cwd=ROOT,check=True,env=env)
 page.reload();page.wait_for_selector('#auth-admin-link',state='attached',timeout=30000);assert page.evaluate('OliveAccess.isAdmin()')
 page.goto('http://127.0.0.1:5000/admin.html');page.wait_for_selector('#admin-members .admin-member')
 assert page.evaluate('OliveAuth.getUser().getIdTokenResult(true).then(r=>!r.claims.oliveAdmin&&!r.claims.oliveDevice)') is True
 b.close();print('PASS Spark actual email verification, no learning before confirmation, no automatic admin grant, Console-equivalent manual UID role and no custom device/admin token claims')
