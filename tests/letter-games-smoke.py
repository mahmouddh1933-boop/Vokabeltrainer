"""Browser checks for the expanded Huroof Start letter bridge."""
import argparse
from unicodedata import combining

from playwright.sync_api import expect, sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--base-url", required=True)
args = parser.parse_args()
base = args.base_url.rstrip("/")

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path="/usr/bin/chromium", args=["--no-sandbox"])
    page = browser.new_page(viewport={"width": 320, "height": 850}, service_workers="block")
    page.add_init_script("""
        localStorage.setItem("vocabInterfaceLanguage", "de");
        localStorage.setItem("oliveLearnerThemeV1", "neutral");
    """)
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(base + "/letters.html")
    page.get_by_role("link", name="Buchstabenbrücke").click()
    expect(page.get_by_role("heading", name="Buchstabenbrücke")).to_be_visible()
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")

    tiles = page.locator("#bridge-letters")
    word = page.locator("#bridge-word")
    groups = page.locator("#bridge-connections span")
    feedback = page.locator("#bridge-feedback")
    tiles.get_by_role("button", name="ا", exact=True).click()
    expect(word).to_have_text("· · ·")
    expect(feedback).to_contain_text("Suche den nächsten Buchstaben")
    tiles.get_by_role("button", name="بَ", exact=True).press("Enter")
    tiles.get_by_role("button", name="ا", exact=True).click()
    expect(word).to_have_text("بَا")
    expect(groups).to_have_text(["بَا"])
    tiles.get_by_role("button", name="ب", exact=True).click()
    expect(word).to_have_text("بَاب")
    expect(groups).to_have_text(["بَا", "ب"])
    expect(feedback).to_contain_text("verbindet sich nicht")
    page.locator("#bridge-undo").click()
    expect(word).to_have_text("بَا")
    picker = page.locator("#bridge-words")
    picker.select_option(label="2 · سَمَك")
    for letter in ["سَ", "مَ", "ك"]:
        tiles.get_by_role("button", name=letter, exact=True).click()
    expect(groups).to_have_text(["سَمَك"])
    page.locator("#bridge-reset").click()
    expect(word).to_have_text("· · ·")

    expect(page.locator("#vowel-scenes")).to_have_count(0)
    words_seen = set()
    next_word = page.locator("#bridge-next")
    levels = page.locator("#bridge-levels button")
    expect(levels).to_have_count(3)
    for level, (count, lengths) in enumerate([(30, {2, 3}), (35, {4}), (35, {5, 6})]):
        levels.nth(level).click()
        words = picker.locator("option")
        expect(words).to_have_count(count)
        for index, label in enumerate(words.all_text_contents()):
            target = label.split(" · ", 1)[1]
            words_seen.add("".join(character for character in target if not combining(character)))
            picker.select_option(str(index))
            letters = []
            for character in target:
                if combining(character):
                    letters[-1] += character
                else:
                    letters.append(character)
            assert len(letters) in lengths, target
            connected = []
            for letter_index, letter in enumerate(letters):
                tiles.get_by_role("button", name=letter, exact=True).click()
                if not connected or letters[letter_index - 1][0] in "اأإآدذرزو":
                    connected.append(letter)
                else:
                    connected[-1] += letter
            expect(word).to_have_text(target)
            expect(groups).to_have_text(connected)
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), target
            if index == count - 1 and level < 2:
                next_word.click()
                expect(levels.nth(level + 1)).to_have_attribute("aria-pressed", "true")
                expect(word).to_have_text("· · · ·" if level == 0 else "· · · · ·")
    assert len(words_seen) == 100
    expect(next_word).to_be_disabled()
    page.locator("#app-language-select").select_option("ar")
    expect(page.get_by_role("heading", name="جسر الحروف")).to_be_visible()
    expect(feedback).to_contain_text("أحسنت")
    expect(word).to_have_text("مَزْرَعَة")
    page.set_viewport_size({"width": 1280, "height": 850})
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
    assert not errors, errors
    browser.close()

print("PASS all 100 words, joining and breaks, 3 levels, keyboard, AR/DE, and responsive layout")
