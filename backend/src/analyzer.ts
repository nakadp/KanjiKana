import kuromoji from 'kuromoji';
import path from 'path';

// Helper function to check if string contains Kanji
function hasKanji(str: string): boolean {
  return /[\u4e00-\u9faf]/.test(str);
}

// Helper function to convert Katakana to Hiragana
function katakanaToHiragana(str: string): string {
  return str.replace(/[\u30a1-\u30f6]/g, function (match) {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

// Simple Romaji mapping for demonstration (a real app would use a library like wanakana)
const romajiMap: Record<string, string> = {
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'を': 'wo', 'ん': 'n',
};

function hiraganaToRomaji(str: string): string {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += romajiMap[str[i]] || str[i];
  }
  return result;
}

// Initialize tokenizer asynchronously
let tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null = null;

const DICT_PATH = path.join(process.cwd(), 'node_modules', 'kuromoji', 'dict');

export async function initAnalyzer(): Promise<void> {
  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: DICT_PATH }).build((err, t) => {
      if (err) {
        console.error('Failed to load kuromoji dict', err);
        return reject(err);
      }
      tokenizer = t;
      console.log('Kuromoji tokenizer initialized');
      resolve();
    });
  });
}

export function analyzeText(inputText: string): string {
  if (!tokenizer) {
    throw new Error('Tokenizer not initialized');
  }

  const tokens = tokenizer.tokenize(inputText);
  let htmlResult = '<div class="text-xl leading-relaxed space-y-4"><p>';

  tokens.forEach(token => {
    const surface = token.surface_form;
    const reading = token.reading;

    // Line break logic (very simplified)
    if (surface === '\n') {
      htmlResult += '</p><p>';
      return;
    }

    if (hasKanji(surface) && reading) {
      const hiraganaReading = katakanaToHiragana(reading);
      const romaji = hiraganaToRomaji(hiraganaReading);
      // Adding a data-word attribute to make it clickable on the frontend
      htmlResult += `<ruby class="cursor-pointer hover:bg-green-100 rounded transition-colors" data-kanji="${surface}" data-reading="${hiraganaReading}" data-romaji="${romaji}">${surface}<rt>${hiraganaReading}</rt></ruby>`;
    } else {
      htmlResult += surface;
    }
  });

  htmlResult += '</p></div>';
  return htmlResult;
}
