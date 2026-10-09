const https = require('https');
const fs = require('fs');
const path = require('path');

const audioDir = path.join(__dirname, '../public/audio');
fs.mkdirSync(audioDir, { recursive: true });

function getAudioKey(text) {
  return Array.from(text).map((c) => c.codePointAt(0).toString(16)).join('_');
}

// 1. All Hiragana
const hiragana = [
  'あ', 'い', 'う', 'え', 'お',
  'か', 'き', 'く', 'け', 'こ', 'が', 'ぎ', 'ぐ', 'げ', 'ご',
  'さ', 'し', 'す', 'せ', 'そ', 'ざ', 'じ', 'ず', 'ぜ', 'ぞ',
  'た', 'ち', 'つ', 'て', 'と', 'だ', 'ぢ', 'づ', 'で', 'ど',
  'な', 'に', 'ぬ', 'ね', 'の',
  'は', 'ひ', 'ふ', 'へ', 'ほ', 'ば', 'び', 'ぶ', 'べ', 'ぼ', 'ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ',
  'ま', 'み', 'む', 'め', 'も',
  'や', 'ゆ', 'よ',
  'ら', 'り', 'る', 'れ', 'ろ',
  'わ', 'を', 'ん',
  'きゃ', 'きゅ', 'きょ', 'しゃ', 'しゅ', 'しょ', 'ちゃ', 'ちゅ', 'ちょ',
  'にゃ', 'にゅ', 'にょ', 'ひゃ', 'ひゅ', 'ひょ', 'みゃ', 'みゅ', 'みょ',
  'りゃ', 'りゅ', 'りょ', 'ぎゃ', 'ぎゅ', 'ぎょ', 'じゃ', 'じゅ', 'じょ',
  'びゃ', 'びゅ', 'びょ', 'ぴゃ', 'ぴゅ', 'ぴょ'
];

// 2. All Katakana
const katakana = [
  'ア', 'イ', 'ウ', 'エ', 'オ',
  'カ', 'キ', 'ク', 'ケ', 'コ', 'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
  'サ', 'シ', 'ス', 'セ', 'ソ', 'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ',
  'タ', 'チ', 'ツ', 'テ', 'ト', 'ダ', 'ヂ', 'ヅ', 'デ', 'ド',
  'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
  'ハ', 'ヒ', 'フ', 'ヘ', 'ホ', 'バ', 'ビ', 'ブ', 'ベ', 'ボ', 'パ', 'ピ', 'プ', 'ペ', 'ポ',
  'マ', 'ミ', 'ム', 'メ', 'モ',
  'ヤ', 'ユ', 'ヨ',
  'ラ', 'リ', 'ル', 'レ', 'ロ',
  'ワ', 'ヲ', 'ン'
];

// 3. Minigame and special terms
const minigameWords = [
  'じゃんけん', 'ぽん', 'グー', 'チョキ', 'パー', 'あいこでしょ',
  '星', '月', '火', '水', '木', '金', '土', '日',
  'ほし', 'つき', 'ひ', 'みず', 'き', 'きん', 'つち',
  'かぎ', 'とびら', 'でぐち'
];

// 4. Extract all dictionary words
const dictPath = path.join(__dirname, '../src/data/dictionary.ts');
const dictContent = fs.readFileSync(dictPath, 'utf8');
const dictMatches = dictContent.matchAll(/word:\s*['"]([^'"]+)['"]/g);
const dictWords = [];
for (const m of dictMatches) {
  dictWords.push(m[1]);
}

const allWords = Array.from(new Set([...hiragana, ...katakana, ...minigameWords, ...dictWords]));
console.log(`Total audio clips to verify/download: ${allWords.length}`);

function downloadOne(word) {
  return new Promise((resolve) => {
    const key = getAudioKey(word);
    const dest = path.join(audioDir, `${key}.mp3`);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      return resolve({ word, key, cached: true });
    }

    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ja&client=tw-ob&q=${encodeURIComponent(word)}`;
    const opts = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://translate.google.com/',
      },
    };

    https
      .get(url, opts, (res) => {
        if (res.statusCode !== 200) {
          return resolve({ word, key, error: `HTTP ${res.statusCode}` });
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve({ word, key, size: fs.statSync(dest).size });
        });
      })
      .on('error', (e) => resolve({ word, key, error: e.message }));
  });
}

async function main() {
  const manifest = {};
  let successCount = 0;

  for (let i = 0; i < allWords.length; i++) {
    const word = allWords[i];
    const key = getAudioKey(word);
    const res = await downloadOne(word);

    if (!res.error) {
      manifest[word] = key;
      successCount++;
    } else {
      console.warn(`[WARN] Failed to download ${word}:`, res.error);
    }

    if ((i + 1) % 25 === 0 || i === allWords.length - 1) {
      console.log(`Progress: ${i + 1}/${allWords.length} (${successCount} successful)`);
    }

    if (!res.cached) {
      await new Promise((r) => setTimeout(r, 60));
    }
  }

  // Save manifest
  const manifestPath = path.join(audioDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Audio manifest saved to ${manifestPath} with ${Object.keys(manifest).length} clips!`);
}

main().catch(console.error);
