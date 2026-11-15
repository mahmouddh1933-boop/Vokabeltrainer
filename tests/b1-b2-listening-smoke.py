"""Answer every revised listening quiz offline and invalidate old quiz results."""
from playwright.sync_api import sync_playwright
base='http://127.0.0.1:8093/b1-b2/'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(service_workers='block')
 c.add_init_script("localStorage.setItem('oliveLearnerThemeV1','neutral');localStorage.setItem('vocabInterfaceLanguage','ar')")
 c.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) else r.abort());page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(base+'texts.html');page.wait_for_selector('.advanced-unit-card');units=page.evaluate('HuroofAdvancedUnits.units')
 page.evaluate("VocabApp.setJSON('learningStats',{...VocabApp.getStats(),advancedUnitsV1:{B11:{essay:'keep this draft',modules:{listening:{answers:[0,1],done:true}}}}})")
 page.goto(base+'texts.html#B11/listening');page.wait_for_selector('.advanced-quiz');assert page.locator('.advanced-quiz input:checked').count()==0;assert page.locator('.advanced-feedback strong').count()==0
 for u in units:
  page.goto(base+'texts.html#'+u['id']+'/listening');page.wait_for_selector('.advanced-quiz')
  assert page.locator('.advanced-quiz legend').all_text_contents()==[f'{i+1}. '+q['q'] for i,q in enumerate(u['listening']['quiz'])]
  for wrong in [True,False]:
   for i,q in enumerate(u['listening']['quiz']):page.locator('.advanced-quiz fieldset').nth(i).locator('input').nth((q['a']+1)%3 if wrong else q['a']).check()
   page.locator('.advanced-quiz button[type=submit]').click();assert page.locator('.advanced-feedback strong').inner_text()==('0 / 2' if wrong else '2 / 2')
  page.reload();page.wait_for_selector('.advanced-feedback strong');assert page.locator('.advanced-feedback strong').inner_text()=='2 / 2'
  assert page.evaluate('id=>VocabApp.getStats().advancedUnitsV1[id].modules.listening.questionsVersion',u['id'])==2
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 assert page.evaluate('VocabApp.getStats().advancedUnitsV1.B11.essay')=='keep this draft';assert not errors,errors;b.close()
print('PASS 80 revised listening questions across 40 units: wrong answers, corrections, reload, version migration and retained writing drafts; offline requests only')
