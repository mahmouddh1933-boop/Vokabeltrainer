"""Explicit Arabic reading sounds and cumulative spelling prefixes.

No letter-name lookup and no automatic text-to-speech grapheme conversion.
Short vowels stay short; matres lectionis become long vowels, not extra hamzas.
Sukūn and final tāʾ marbūṭa are heard in their actual preceding word context.
"""
import re
import unicodedata

CONSONANTS = dict(zip('بتثجحخدذرزسشصضطظعغفقكلمنهوي',
    ['b','t','θ','dʒ','ħ','x','d','ð','r','z','s','ʃ','sˤ','dˤ','tˤ','ðˤ','ʕ','ɣ','f','q','k','l','m','n','h','w','j']))
CONSONANTS.update({'أ':'ʔ','إ':'ʔ','ء':'ʔ','ؤ':'ʔ','ئ':'ʔ','ا':'ʔ','ة':'h'})
VOWELS = {'َ':'a','ِ':'i','ُ':'u'}


def graphemes(text):
    return re.findall(r'[^\u064b-\u065f\u0670][\u064b-\u065f\u0670]*', unicodedata.normalize('NFC', text))


def vowel(grapheme):
    return next((VOWELS[m] for m in grapheme[1:] if m in VOWELS), '')


def long_vowel(previous, current):
    if any(mark in current for mark in 'َُِّْ'):
        return ''
    return {('a','ا'):'a', ('a','ى'):'a', ('i','ي'):'i', ('u','و'):'u'}.get((vowel(previous),current[0]),'')


def phonemes(text):
    """MSA phones for one or more syllables, preserving all written short vowels."""
    gs = graphemes(text)
    result = ''
    i = 0
    while i < len(gs):
        g = gs[i]
        c = g[0]
        if c == 'ى':
            raise ValueError('Alif maqṣūra must follow fatḥa: '+text)
        result += CONSONANTS[c] * (2 if 'ّ' in g else 1)
        v = vowel(g)
        if v:
            following = gs[i+1] if i+1 < len(gs) else ''
            if following and long_vowel(g,following):
                result += v+'ː'
                i += 1
            else:
                result += v
        i += 1
    return result


def stressed(ipa):
    return re.sub(r'([aiu])', r'ˈ\1', ipa, count=1)


def whole_ipa(parts):
    ps = [phonemes(p) for p in parts]
    def weight(p):
        tail = re.split('[aiu]',p)[-1]
        return (2 if 'ː' in tail else 1) + len(tail.replace('ː','').replace('ˤ','').replace('ʒ',''))
    at = len(ps)-1 if weight(ps[-1])>=3 else max(0,len(ps)-2) if len(ps)>1 and weight(ps[-2])>=2 else max(0,len(ps)-3)
    return ''.join(stressed(p) if i==at else p for i,p in enumerate(ps))


def reading_sounds(word):
    """One button per written letter: CV, a pure long vowel, or a real coda context.

    A stop/glottal consonant with sukūn cannot be modeled as a CV without adding
    an incorrect vowel. Replay only its actual preceding word nucleus instead.
    Both the displayed spoken fragment and highlight expose that context.
    """
    gs=graphemes(word)
    sounds=[]
    for i,g in enumerate(gs):
        v=vowel(g)
        long=long_vowel(gs[i-1],g) if i else ''
        if v and 'ّ' not in g:
            ipa=phonemes(g)
            indices=[i]
            spoken=g
        elif long:
            ipa=long+'ː'
            indices=[i]
            spoken=g
        else:
            # Includes final sukūn, geminated codas and the pausal /h/ of ة.
            start=i-1 if v and 'ّ' in g else i
            while start>0 and not vowel(gs[start]):
                start-=1
            while start>0 and 'ّ' in gs[start]:
                start-=1
                while start>0 and not vowel(gs[start]):
                    start-=1
            assert start<i and vowel(gs[start]),(word,g)
            indices=list(range(start,i+1))
            spoken=''.join(gs[start:i+1])
            ipa=phonemes(spoken)
        assert any(v in ipa for v in 'aiu'),(word,g,ipa)
        sounds.append({'text':g,'spokenText':spoken,'letters':indices,'phonemes':stressed(ipa),
            'context':len(indices)>1})
    return sounds


def reading_prefixes(word, final_ipa):
    gs=graphemes(word)
    prefixes=[]
    for count in range(2,len(gs)+1):
        text=''.join(gs[:count])
        # The final prefix uses exactly the same reading as the full-word step.
        ipa=final_ipa if count==len(gs) else stressed(phonemes(text))
        prefixes.append({'text':text,'letters':list(range(count)),'count':count,'phonemes':ipa})
    return prefixes
