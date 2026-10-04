import { JapaneseWord } from '../types/game';

export const JAPANESE_DICTIONARY: Record<string, JapaneseWord> = {
  // ==========================================
  // ROOM 1 TARGET & CORE COMBINATIONS
  // Available Kana: か, ぎ, み, と, ね, こ
  // ==========================================
  'かぎ': {
    word: 'かぎ',
    kanji: '鍵',
    romaji: 'kagi',
    meaning: 'Key',
    icon: '🔑',
    type: 'Noun (Room 1 Target)'
  },
  'カギ': {
    word: 'カギ',
    kanji: '鍵',
    romaji: 'kagi',
    meaning: 'Key',
    icon: '🔑',
    type: 'Noun (Room 1 Target)'
  },
  'かみ': {
    word: 'かみ',
    kanji: '神 / 紙 / 髪',
    romaji: 'kami',
    meaning: 'God / Spirit / Paper / Hair',
    icon: '⛩️',
    type: 'Noun'
  },
  'カミ': {
    word: 'カミ',
    kanji: '神 / 紙',
    romaji: 'kami',
    meaning: 'God / Paper',
    icon: '⛩️',
    type: 'Noun'
  },
  'かこ': {
    word: 'かこ',
    kanji: '過去',
    romaji: 'kako',
    meaning: 'Past / History',
    icon: '⏳',
    type: 'Noun'
  },
  'カコ': {
    word: 'カコ',
    kanji: '過去',
    romaji: 'kako',
    meaning: 'Past',
    icon: '⏳',
    type: 'Noun'
  },
  'こと': {
    word: 'こと',
    kanji: '事 / 琴',
    romaji: 'koto',
    meaning: 'Matter / Thing / Koto Harp',
    icon: '🎵',
    type: 'Noun'
  },
  'コト': {
    word: 'コト',
    kanji: '事',
    romaji: 'koto',
    meaning: 'Matter / Event',
    icon: '🎵',
    type: 'Noun'
  },
  'みこと': {
    word: 'みこと',
    kanji: '尊 / 命',
    romaji: 'mikoto',
    meaning: 'Lord / Highness / Prince',
    icon: '👑',
    type: 'Noun'
  },
  'ミコト': {
    word: 'ミコト',
    kanji: '尊',
    romaji: 'mikoto',
    meaning: 'Lord / Highness',
    icon: '👑',
    type: 'Noun'
  },
  'ねこ': {
    word: 'ねこ',
    kanji: '猫',
    romaji: 'neko',
    meaning: 'Cat',
    icon: '🐱',
    type: 'Noun'
  },
  'ネコ': {
    word: 'ネコ',
    kanji: '猫',
    romaji: 'neko',
    meaning: 'Cat',
    icon: '🐱',
    type: 'Noun'
  },
  'こねこ': {
    word: 'こねこ',
    kanji: '子猫',
    romaji: 'koneko',
    meaning: 'Kitten',
    icon: '🐱',
    type: 'Noun'
  },
  'コネコ': {
    word: 'コネコ',
    kanji: '子猫',
    romaji: 'koneko',
    meaning: 'Kitten',
    icon: '🐱',
    type: 'Noun'
  },
  'みぎ': {
    word: 'みぎ',
    kanji: '右',
    romaji: 'migi',
    meaning: 'Right (direction)',
    icon: '➡️',
    type: 'Noun'
  },
  'ミギ': {
    word: 'ミギ',
    kanji: '右',
    romaji: 'migi',
    meaning: 'Right',
    icon: '➡️',
    type: 'Noun'
  },
  'とみ': {
    word: 'とみ',
    kanji: '富',
    romaji: 'tomi',
    meaning: 'Wealth / Fortune / Riches',
    icon: '💰',
    type: 'Noun'
  },
  'トミ': {
    word: 'トミ',
    kanji: '富',
    romaji: 'tomi',
    meaning: 'Wealth',
    icon: '💰',
    type: 'Noun'
  },
  'とこ': {
    word: 'とこ',
    kanji: '床',
    romaji: 'toko',
    meaning: 'Bed / Floor / Alcove',
    icon: '🛏️',
    type: 'Noun'
  },
  'トコ': {
    word: 'トコ',
    kanji: '床',
    romaji: 'toko',
    meaning: 'Bed / Floor',
    icon: '🛏️',
    type: 'Noun'
  },
  'みこ': {
    word: 'みこ',
    kanji: '巫女',
    romaji: 'miko',
    meaning: 'Shrine Maiden',
    icon: '⛩️',
    type: 'Noun'
  },
  'ミコ': {
    word: 'ミコ',
    kanji: '巫女',
    romaji: 'miko',
    meaning: 'Shrine Maiden',
    icon: '⛩️',
    type: 'Noun'
  },
  'みね': {
    word: 'みね',
    kanji: '嶺 / 峰',
    romaji: 'mine',
    meaning: 'Peak / Ridge / Summit',
    icon: '🏔️',
    type: 'Noun'
  },
  'ミネ': {
    word: 'ミネ',
    kanji: '峰',
    romaji: 'mine',
    meaning: 'Peak',
    icon: '🏔️',
    type: 'Noun'
  },
  'こみ': {
    word: 'こみ',
    kanji: '混み',
    romaji: 'komi',
    meaning: 'Crowded / Congestion',
    icon: '👥',
    type: 'Noun'
  },
  'コミ': {
    word: 'コミ',
    kanji: '混み',
    romaji: 'komi',
    meaning: 'Crowded',
    icon: '👥',
    type: 'Noun'
  },
  'こぎ': {
    word: 'こぎ',
    kanji: '漕ぎ',
    romaji: 'kogi',
    meaning: 'Rowing (a boat)',
    icon: '🚣',
    type: 'Noun'
  },
  'こね': {
    word: 'こね',
    kanji: 'コネ',
    romaji: 'kone',
    meaning: 'Connections / Ties',
    icon: '🤝',
    type: 'Noun'
  },
  'とぎ': {
    word: 'とぎ',
    kanji: '研ぎ',
    romaji: 'togi',
    meaning: 'Sharpening / Polishing',
    icon: '🗡️',
    type: 'Noun'
  },
  'かき': {
    word: 'かき',
    kanji: '柿 / 牡蠣',
    romaji: 'kaki',
    meaning: 'Persimmon / Oyster',
    icon: '🦪',
    type: 'Noun'
  },
  'みき': {
    word: 'みき',
    kanji: '幹 / 神酒',
    romaji: 'miki',
    meaning: 'Tree Trunk / Sacred Sake',
    icon: '🌳',
    type: 'Noun'
  },
  'とと': {
    word: 'とと',
    kanji: '魚 / 父',
    romaji: 'toto',
    meaning: 'Fish / Father (familiar)',
    icon: '🐟',
    type: 'Noun'
  },
  'こころ': {
    word: 'こころ',
    kanji: '心',
    romaji: 'kokoro',
    meaning: 'Heart / Mind / Spirit',
    icon: '❤️',
    type: 'Noun'
  },
  'ねごと': {
    word: 'ねごと',
    kanji: '寝言',
    romaji: 'negoto',
    meaning: 'Sleep Talking / Nonsense',
    icon: '💤',
    type: 'Noun'
  },
  'こみち': {
    word: 'こみち',
    kanji: '小道',
    romaji: 'komichi',
    meaning: 'Narrow Path / Lane',
    icon: '🛤️',
    type: 'Noun'
  },
  'ねこみみ': {
    word: 'ねこみみ',
    kanji: '猫耳',
    romaji: 'nekomimi',
    meaning: 'Cat Ears',
    icon: '🐱',
    type: 'Noun'
  },
  'こねぎ': {
    word: 'こねぎ',
    kanji: '小葱',
    romaji: 'konegi',
    meaning: 'Green Spring Onion',
    icon: '🧅',
    type: 'Noun'
  },

  // ==========================================
  // ROOM 2 TARGET & CORE COMBINATIONS
  // Available Kana: と, び, ら, い, ぬ, は, な (+ Room 1)
  // ==========================================
  'とびら': {
    word: 'とびら',
    kanji: '扉',
    romaji: 'tobira',
    meaning: 'Door / Gateway',
    icon: '🚪',
    type: 'Noun (Room 2 Target)'
  },
  'トビラ': {
    word: 'トビラ',
    kanji: '扉',
    romaji: 'tobira',
    meaning: 'Door',
    icon: '🚪',
    type: 'Noun (Room 2 Target)'
  },
  'ドア': {
    word: 'ドア',
    kanji: '扉',
    romaji: 'doa',
    meaning: 'Door',
    icon: '🚪',
    type: 'Noun'
  },
  'いぬ': {
    word: 'いぬ',
    kanji: '犬',
    romaji: 'inu',
    meaning: 'Dog',
    icon: '🐶',
    type: 'Noun'
  },
  'イヌ': {
    word: 'イヌ',
    kanji: '犬',
    romaji: 'inu',
    meaning: 'Dog',
    icon: '🐶',
    type: 'Noun'
  },
  'こいぬ': {
    word: 'こいぬ',
    kanji: '子犬',
    romaji: 'koinu',
    meaning: 'Puppy',
    icon: '🐶',
    type: 'Noun'
  },
  'はな': {
    word: 'はな',
    kanji: '花 / 鼻',
    romaji: 'hana',
    meaning: 'Flower / Nose',
    icon: '🌸',
    type: 'Noun'
  },
  'ハナ': {
    word: 'ハナ',
    kanji: '花',
    romaji: 'hana',
    meaning: 'Flower',
    icon: '🌸',
    type: 'Noun'
  },
  'とら': {
    word: 'とら',
    kanji: '虎',
    romaji: 'tora',
    meaning: 'Tiger',
    icon: '🐯',
    type: 'Noun'
  },
  'トラ': {
    word: 'トラ',
    kanji: '虎',
    romaji: 'tora',
    meaning: 'Tiger',
    icon: '🐯',
    type: 'Noun'
  },
  'いと': {
    word: 'いと',
    kanji: '糸',
    romaji: 'ito',
    meaning: 'Thread / Yarn',
    icon: '🧵',
    type: 'Noun'
  },
  'イト': {
    word: 'イト',
    kanji: '糸',
    romaji: 'ito',
    meaning: 'Thread',
    icon: '🧵',
    type: 'Noun'
  },
  'はと': {
    word: 'はと',
    kanji: '鳩',
    romaji: 'hato',
    meaning: 'Pigeon / Dove',
    icon: '🕊️',
    type: 'Noun'
  },
  'ハト': {
    word: 'ハト',
    kanji: '鳩',
    romaji: 'hato',
    meaning: 'Pigeon',
    icon: '🕊️',
    type: 'Noun'
  },
  'はら': {
    word: 'はら',
    kanji: '原 / 腹',
    romaji: 'hara',
    meaning: 'Field / Meadow / Belly',
    icon: '🌾',
    type: 'Noun'
  },
  'なみ': {
    word: 'なみ',
    kanji: '波',
    romaji: 'nami',
    meaning: 'Wave / Ocean Swell',
    icon: '🌊',
    type: 'Noun'
  },
  'ナミ': {
    word: 'ナミ',
    kanji: '波',
    romaji: 'nami',
    meaning: 'Wave',
    icon: '🌊',
    type: 'Noun'
  },
  'はね': {
    word: 'はね',
    kanji: '羽 / 翼',
    romaji: 'hane',
    meaning: 'Feather / Wing',
    icon: '🪶',
    type: 'Noun'
  },
  'いね': {
    word: 'いね',
    kanji: '稲',
    romaji: 'ine',
    meaning: 'Rice Plant',
    icon: '🌾',
    type: 'Noun'
  },
  'はい': {
    word: 'はい',
    kanji: '灰',
    romaji: 'hai',
    meaning: 'Ash / Yes',
    icon: '🌫️',
    type: 'Noun'
  },
  'らい': {
    word: 'らい',
    kanji: '雷',
    romaji: 'rai',
    meaning: 'Thunder / Lightning',
    icon: '⚡',
    type: 'Noun'
  },
  'たい': {
    word: 'たい',
    kanji: '鯛',
    romaji: 'tai',
    meaning: 'Sea Bream (Red Snapper)',
    icon: '🐟',
    type: 'Noun'
  },
  'ぬの': {
    word: 'ぬの',
    kanji: '布',
    romaji: 'nuno',
    meaning: 'Cloth / Fabric',
    icon: '🧶',
    type: 'Noun'
  },
  'なは': {
    word: 'なは',
    kanji: '那覇',
    romaji: 'naha',
    meaning: 'Naha (Okinawa capital)',
    icon: '🏖️',
    type: 'Proper Noun'
  },
  'なら': {
    word: 'なら',
    kanji: '奈良',
    romaji: 'nara',
    meaning: 'Nara (Ancient Japanese capital)',
    icon: '🦌',
    type: 'Proper Noun'
  },
  'はなび': {
    word: 'はなび',
    kanji: '花火',
    romaji: 'hanabi',
    meaning: 'Fireworks',
    icon: '🎆',
    type: 'Noun'
  },
  'ハナビ': {
    word: 'ハナビ',
    kanji: '花火',
    romaji: 'hanabi',
    meaning: 'Fireworks',
    icon: '🎆',
    type: 'Noun'
  },
  'となり': {
    word: 'となり',
    kanji: '隣',
    romaji: 'tonari',
    meaning: 'Neighbor / Next to',
    icon: '🏘️',
    type: 'Noun'
  },
  'いらい': {
    word: 'いらい',
    kanji: '依頼',
    romaji: 'irai',
    meaning: 'Request / Commission',
    icon: '📜',
    type: 'Noun'
  },
  'なつ': {
    word: 'なつ',
    kanji: '夏',
    romaji: 'natsu',
    meaning: 'Summer',
    icon: '🌻',
    type: 'Noun'
  },
  'たいら': {
    word: 'たいら',
    kanji: '平ら',
    romaji: 'taira',
    meaning: 'Flat / Level',
    icon: '🟩',
    type: 'Adjective / Noun'
  },
  'はらい': {
    word: 'はらい',
    kanji: '祓い / 払い',
    romaji: 'harai',
    meaning: 'Purification / Payment',
    icon: '⛩️',
    type: 'Noun'
  },
  'かない': {
    word: 'かない',
    kanji: '家内',
    romaji: 'kanai',
    meaning: 'Inside house / My wife',
    icon: '🏠',
    type: 'Noun'
  },
  'なぎ': {
    word: 'なぎ',
    kanji: '凪',
    romaji: 'nagi',
    meaning: 'Calm Sea / Lull',
    icon: '🌊',
    type: 'Noun'
  },
  'から': {
    word: 'から',
    kanji: '殻 / 空',
    romaji: 'kara',
    meaning: 'Shell / Empty',
    icon: '🐚',
    type: 'Noun'
  },
  'かた': {
    word: 'かた',
    kanji: '肩 / 型',
    romaji: 'kata',
    meaning: 'Shoulder / Martial Form',
    icon: '🥋',
    type: 'Noun'
  },
  'たね': {
    word: 'たね',
    kanji: '種',
    romaji: 'tane',
    meaning: 'Seed / Pip',
    icon: '🌱',
    type: 'Noun'
  },
  'たび': {
    word: 'たび',
    kanji: '旅',
    romaji: 'tabi',
    meaning: 'Journey / Travel',
    icon: '🧳',
    type: 'Noun'
  },
  'ねらい': {
    word: 'ねらい',
    kanji: '狙い',
    romaji: 'nerai',
    meaning: 'Aim / Target / Goal',
    icon: '🎯',
    type: 'Noun'
  },
  'いとこ': {
    word: 'いとこ',
    kanji: '従兄弟',
    romaji: 'itoko',
    meaning: 'Cousin',
    icon: '👥',
    type: 'Noun'
  },
  'ことば': {
    word: 'ことば',
    kanji: '言葉',
    romaji: 'kotoba',
    meaning: 'Word / Language / Speech',
    icon: '💬',
    type: 'Noun'
  },
  'びと': {
    word: 'びと',
    kanji: '人',
    romaji: 'bito',
    meaning: 'Person / Folk',
    icon: '👤',
    type: 'Noun'
  },
  'ひら': {
    word: 'ひら',
    kanji: '平 / 掌',
    romaji: 'hira',
    meaning: 'Flat surface / Palm',
    icon: '✋',
    type: 'Noun'
  },
  'はなこ': {
    word: 'はなこ',
    kanji: '花子',
    romaji: 'hanako',
    meaning: 'Hanako (traditional name)',
    icon: '🌸',
    type: 'Proper Noun'
  },
  'ことり': {
    word: 'ことり',
    kanji: '小鳥',
    romaji: 'kotori',
    meaning: 'Little Bird',
    icon: '🐦',
    type: 'Noun'
  },
  'いなか': {
    word: 'いなか',
    kanji: '田舎',
    romaji: 'inaka',
    meaning: 'Countryside / Rural area',
    icon: '🏡',
    type: 'Noun'
  },
  'なた': {
    word: 'なた',
    kanji: '鉈',
    romaji: 'nata',
    meaning: 'Japanese Hatchet / Machete',
    icon: '🪓',
    type: 'Noun'
  },
  'いぬねこ': {
    word: 'いぬねこ',
    kanji: '犬猫',
    romaji: 'inuneko',
    meaning: 'Dogs and Cats',
    icon: '🐶🐱',
    type: 'Noun'
  },
  'かたち': {
    word: 'かたち',
    kanji: '形',
    romaji: 'katachi',
    meaning: 'Shape / Form',
    icon: '🔷',
    type: 'Noun'
  },
  'みかた': {
    word: 'みかた',
    kanji: '味方 / 見方',
    romaji: 'mikata',
    meaning: 'Ally / Perspective',
    icon: '🛡️',
    type: 'Noun'
  },
  'たから': {
    word: 'たから',
    kanji: '宝',
    romaji: 'takara',
    meaning: 'Treasure',
    icon: '💎',
    type: 'Noun'
  },

  // ==========================================
  // ROOM 3 TARGET & CORE COMBINATIONS
  // Available Kana: で, ぐ, ち, ほ, し, み, ず (+ Room 1 & 2)
  // ==========================================
  'でぐち': {
    word: 'でぐち',
    kanji: '出口',
    romaji: 'deguchi',
    meaning: 'Exit / Way out',
    icon: '🚪',
    type: 'Noun (Room 3 Target)'
  },
  'デグチ': {
    word: 'デグチ',
    kanji: '出口',
    romaji: 'deguchi',
    meaning: 'Exit',
    icon: '🚪',
    type: 'Noun (Room 3 Target)'
  },
  'ほし': {
    word: 'ほし',
    kanji: '星',
    romaji: 'hoshi',
    meaning: 'Star / Celestial body',
    icon: '⭐',
    type: 'Noun'
  },
  'ホシ': {
    word: 'ホシ',
    kanji: '星',
    romaji: 'hoshi',
    meaning: 'Star',
    icon: '⭐',
    type: 'Noun'
  },
  'みず': {
    word: 'みず',
    kanji: '水',
    romaji: 'mizu',
    meaning: 'Water',
    icon: '💧',
    type: 'Noun'
  },
  'ミズ': {
    word: 'ミズ',
    kanji: '水',
    romaji: 'mizu',
    meaning: 'Water',
    icon: '💧',
    type: 'Noun'
  },
  'ちず': {
    word: 'ちず',
    kanji: '地図',
    romaji: 'chizu',
    meaning: 'Map / Atlas',
    icon: '🗺️',
    type: 'Noun'
  },
  'チズ': {
    word: 'チズ',
    kanji: '地図',
    romaji: 'chizu',
    meaning: 'Map',
    icon: '🗺️',
    type: 'Noun'
  },
  'ほね': {
    word: 'ほね',
    kanji: '骨',
    romaji: 'hone',
    meaning: 'Bone / Skeleton',
    icon: '🦴',
    type: 'Noun'
  },
  'ホネ': {
    word: 'ホネ',
    kanji: '骨',
    romaji: 'hone',
    meaning: 'Bone',
    icon: '🦴',
    type: 'Noun'
  },
  'しずく': {
    word: 'しずく',
    kanji: '雫',
    romaji: 'shizuku',
    meaning: 'Droplet / Tear drop',
    icon: '💧',
    type: 'Noun'
  },
  'シズク': {
    word: 'シズク',
    kanji: '雫',
    romaji: 'shizuku',
    meaning: 'Droplet',
    icon: '💧',
    type: 'Noun'
  },
  'ぐち': {
    word: 'ぐち',
    kanji: '愚痴 / 口',
    romaji: 'guchi',
    meaning: 'Complaint / Opening',
    icon: '🗣️',
    type: 'Noun'
  },
  'ちから': {
    word: 'ちから',
    kanji: '力',
    romaji: 'chikara',
    meaning: 'Power / Strength',
    icon: '💪',
    type: 'Noun'
  },
  'チカラ': {
    word: 'チカラ',
    kanji: '力',
    romaji: 'chikara',
    meaning: 'Power',
    icon: '💪',
    type: 'Noun'
  },
  'いち': {
    word: 'いち',
    kanji: '一',
    romaji: 'ichi',
    meaning: 'One (number)',
    icon: '1️⃣',
    type: 'Numeral'
  },
  'しち': {
    word: 'しち',
    kanji: '七',
    romaji: 'shichi',
    meaning: 'Seven (number)',
    icon: '7️⃣',
    type: 'Numeral'
  },
  'はち': {
    word: 'はち',
    kanji: '八 / 蜂',
    romaji: 'hachi',
    meaning: 'Eight / Bee',
    icon: '8️⃣',
    type: 'Numeral / Noun'
  },
  'みち': {
    word: 'みち',
    kanji: '道',
    romaji: 'michi',
    meaning: 'Path / Road / Way',
    icon: '🛤️',
    type: 'Noun'
  },
  'くち': {
    word: 'くち',
    kanji: '口',
    romaji: 'kuchi',
    meaning: 'Mouth / Opening',
    icon: '👄',
    type: 'Noun'
  },
  'しろ': {
    word: 'しろ',
    kanji: '城 / 白',
    romaji: 'shiro',
    meaning: 'Castle / White color',
    icon: '🏯',
    type: 'Noun'
  },
  'ほたる': {
    word: 'ほたる',
    kanji: '蛍',
    romaji: 'hotaru',
    meaning: 'Firefly',
    icon: '🪲',
    type: 'Noun'
  },
  'しずか': {
    word: 'しずか',
    kanji: '静か',
    romaji: 'shizuka',
    meaning: 'Quiet / Peaceful',
    icon: '🤫',
    type: 'Na-Adjective'
  },
  'ちち': {
    word: 'ちち',
    kanji: '父 / 乳',
    romaji: 'chichi',
    meaning: 'Father / Milk',
    icon: '👨',
    type: 'Noun'
  },
  'ほのか': {
    word: 'ほのか',
    kanji: '仄か',
    romaji: 'honoka',
    meaning: 'Faint / Subtle glow',
    icon: '🕯️',
    type: 'Na-Adjective'
  },
  'しぐれ': {
    word: 'しぐれ',
    kanji: '時雨',
    romaji: 'shigure',
    meaning: 'Late Autumn Shower',
    icon: '🌧️',
    type: 'Noun'
  },
  'しらべ': {
    word: 'しらべ',
    kanji: '調べ',
    romaji: 'shirabe',
    meaning: 'Melody / Investigation',
    icon: '🔍',
    type: 'Noun'
  },
  'いし': {
    word: 'いし',
    kanji: '石 / 意志',
    romaji: 'ishi',
    meaning: 'Stone / Willpower',
    icon: '🪨',
    type: 'Noun'
  },
  'ひと': {
    word: 'ひと',
    kanji: '人',
    romaji: 'hito',
    meaning: 'Person / Human',
    icon: '👤',
    type: 'Noun'
  },
  'ちえ': {
    word: 'ちえ',
    kanji: '知恵',
    romaji: 'chie',
    meaning: 'Wisdom / Wit',
    icon: '💡',
    type: 'Noun'
  },
  'ちか': {
    word: 'ちか',
    kanji: '地下',
    romaji: 'chika',
    meaning: 'Basement / Underground',
    icon: '🚇',
    type: 'Noun'
  },
  'ほこ': {
    word: 'ほこ',
    kanji: '鉾 / 矛',
    romaji: 'hoko',
    meaning: 'Spear / Halberd',
    icon: '🔱',
    type: 'Noun'
  },
  'しき': {
    word: 'しき',
    kanji: '四季 / 式',
    romaji: 'shiki',
    meaning: 'Four Seasons / Ceremony',
    icon: '🌸',
    type: 'Noun'
  },
  'みずぎ': {
    word: 'みずぎ',
    kanji: '水着',
    romaji: 'mizugi',
    meaning: 'Swimsuit',
    icon: '🩱',
    type: 'Noun'
  },
  'しごと': {
    word: 'しごと',
    kanji: '仕事',
    romaji: 'shigoto',
    meaning: 'Work / Job',
    icon: '💼',
    type: 'Noun'
  },
  'ちび': {
    word: 'ちび',
    kanji: '禿び',
    romaji: 'chibi',
    meaning: 'Tiny / Little one',
    icon: '👶',
    type: 'Noun'
  },
  'いのち': {
    word: 'いのち',
    kanji: '命',
    romaji: 'inochi',
    meaning: 'Life / Soul',
    icon: '✨',
    type: 'Noun'
  },
  'ひかり': {
    word: 'ひかり',
    kanji: '光',
    romaji: 'hikari',
    meaning: 'Light / Beam',
    icon: '💡',
    type: 'Noun'
  },
  'あかり': {
    word: 'あかり',
    kanji: '明かり',
    romaji: 'akari',
    meaning: 'Light / Lamp',
    icon: '🏮',
    type: 'Noun'
  },
  'みずうみ': {
    word: 'みずうみ',
    kanji: '湖',
    romaji: 'mizuumi',
    meaning: 'Lake',
    icon: '🌊',
    type: 'Noun'
  },
  'ほしぞら': {
    word: 'ほしぞら',
    kanji: '星空',
    romaji: 'hoshizora',
    meaning: 'Starry Sky',
    icon: '🌌',
    type: 'Noun'
  },
  'しちみ': {
    word: 'しちみ',
    kanji: '七味',
    romaji: 'shichimi',
    meaning: 'Seven Flavor Chili Blend',
    icon: '🌶️',
    type: 'Noun'
  },
  'ちぎり': {
    word: 'ちぎり',
    kanji: '契り',
    romaji: 'chigiri',
    meaning: 'Pledge / Vow / Covenant',
    icon: '🤝',
    type: 'Noun'
  },
  'ひみつ': {
    word: 'ひみつ',
    kanji: '秘密',
    romaji: 'himitsu',
    meaning: 'Secret / Mystery',
    icon: '🤫',
    type: 'Noun'
  },
  'かみなり': {
    word: 'かみなり',
    kanji: '雷 / 神鳴り',
    romaji: 'kaminari',
    meaning: 'Thunderbolt / Lightning',
    icon: '⚡',
    type: 'Noun'
  },
  'でんち': {
    word: 'でんち',
    kanji: '電池',
    romaji: 'denchi',
    meaning: 'Battery',
    icon: '🔋',
    type: 'Noun'
  },
  'ぐあい': {
    word: 'ぐあい',
    kanji: '具合',
    romaji: 'guai',
    meaning: 'Condition / Health / State',
    icon: '🩺',
    type: 'Noun'
  },
  'でまえ': {
    word: 'でまえ',
    kanji: '出前',
    romaji: 'demae',
    meaning: 'Food Delivery',
    icon: '🍜',
    type: 'Noun'
  },
  'かがやき': {
    word: 'かがやき',
    kanji: '輝き',
    romaji: 'kagayaki',
    meaning: 'Brilliance / Radiance',
    icon: '✨',
    type: 'Noun'
  },

  // ==========================================
  // GENERAL JAPANESE ESSENTIALS
  // ==========================================
  'ひ': {
    word: 'ひ',
    kanji: '火 / 日',
    romaji: 'hi',
    meaning: 'Fire / Sun / Day',
    icon: '🔥',
    type: 'Noun'
  },
  'つき': {
    word: 'つき',
    kanji: '月',
    romaji: 'tsuki',
    meaning: 'Moon',
    icon: '🌙',
    type: 'Noun'
  },
  'ほん': {
    word: 'ほん',
    kanji: '本',
    romaji: 'hon',
    meaning: 'Book',
    icon: '📖',
    type: 'Noun'
  },
  'かさ': {
    word: 'かさ',
    kanji: '傘',
    romaji: 'kasa',
    meaning: 'Umbrella',
    icon: '☂️',
    type: 'Noun'
  },
  'くるま': {
    word: 'くるま',
    kanji: '車',
    romaji: 'kuruma',
    meaning: 'Car / Vehicle',
    icon: '🚗',
    type: 'Noun'
  },
  'とり': {
    word: 'とり',
    kanji: '鳥',
    romaji: 'tori',
    meaning: 'Bird',
    icon: '🐦',
    type: 'Noun'
  },
  'き': {
    word: 'き',
    kanji: '木 / 気',
    romaji: 'ki',
    meaning: 'Tree / Wood / Spirit',
    icon: '🌳',
    type: 'Noun'
  },
  'やま': {
    word: 'やま',
    kanji: '山',
    romaji: 'yama',
    meaning: 'Mountain',
    icon: '⛰️',
    type: 'Noun'
  },
  'かわ': {
    word: 'かわ',
    kanji: '川 / 皮',
    romaji: 'kawa',
    meaning: 'River / Skin',
    icon: '🌊',
    type: 'Noun'
  },
  'そら': {
    word: 'そら',
    kanji: '空',
    romaji: 'sora',
    meaning: 'Sky',
    icon: '☁️',
    type: 'Noun'
  },
  'あめ': {
    word: 'あめ',
    kanji: '雨 / 飴',
    romaji: 'ame',
    meaning: 'Rain / Candy',
    icon: '🌧️',
    type: 'Noun'
  },
  'ゆき': {
    word: 'ゆき',
    kanji: '雪',
    romaji: 'yuki',
    meaning: 'Snow',
    icon: '❄️',
    type: 'Noun'
  },
  'め': {
    word: 'め',
    kanji: '目',
    romaji: 'me',
    meaning: 'Eye',
    icon: '👁️',
    type: 'Noun'
  },
  'て': {
    word: 'て',
    kanji: '手',
    romaji: 'te',
    meaning: 'Hand',
    icon: '✋',
    type: 'Noun'
  },
  'いえ': {
    word: 'いえ',
    kanji: '家',
    romaji: 'ie',
    meaning: 'House / Home',
    icon: '🏠',
    type: 'Noun'
  },
  'あさ': {
    word: 'あさ',
    kanji: '朝',
    romaji: 'asa',
    meaning: 'Morning',
    icon: '🌅',
    type: 'Noun'
  },
  'よる': {
    word: 'よる',
    kanji: '夜',
    romaji: 'yoru',
    meaning: 'Night',
    icon: '🌃',
    type: 'Noun'
  },
  'ひる': {
    word: 'ひる',
    kanji: '昼',
    romaji: 'hiru',
    meaning: 'Daytime / Noon',
    icon: '☀️',
    type: 'Noun'
  },
  'まち': {
    word: 'まち',
    kanji: '町 / 街',
    romaji: 'machi',
    meaning: 'Town / Street',
    icon: '🏙️',
    type: 'Noun'
  },
  'うみ': {
    word: 'うみ',
    kanji: '海',
    romaji: 'umi',
    meaning: 'Sea / Ocean',
    icon: '🌊',
    type: 'Noun'
  },
  'くも': {
    word: 'くも',
    kanji: '雲 / 蜘蛛',
    romaji: 'kumo',
    meaning: 'Cloud / Spider',
    icon: '☁️',
    type: 'Noun'
  },
  'かぜ': {
    word: 'かぜ',
    kanji: '風',
    romaji: 'kaze',
    meaning: 'Wind / Breeze',
    icon: '🍃',
    type: 'Noun'
  },
  'もり': {
    word: 'もり',
    kanji: '森',
    romaji: 'mori',
    meaning: 'Forest',
    icon: '🌲',
    type: 'Noun'
  },
  'にじ': {
    word: 'にじ',
    kanji: '虹',
    romaji: 'niji',
    meaning: 'Rainbow',
    icon: '🌈',
    type: 'Noun'
  },
  'はる': {
    word: 'はる',
    kanji: '春',
    romaji: 'haru',
    meaning: 'Spring (season)',
    icon: '🌸',
    type: 'Noun'
  },
  'あき': {
    word: 'あき',
    kanji: '秋',
    romaji: 'aki',
    meaning: 'Autumn / Fall',
    icon: '🍁',
    type: 'Noun'
  },
  'ふゆ': {
    word: 'ふゆ',
    kanji: '冬',
    romaji: 'fuyu',
    meaning: 'Winter',
    icon: '⛄',
    type: 'Noun'
  },
  'かめ': {
    word: 'かめ',
    kanji: '亀',
    romaji: 'kame',
    meaning: 'Turtle / Tortoise',
    icon: '🐢',
    type: 'Noun'
  },
  'うま': {
    word: 'うま',
    kanji: '馬',
    romaji: 'uma',
    meaning: 'Horse',
    icon: '🐎',
    type: 'Noun'
  },
  'ふね': {
    word: 'ふね',
    kanji: '船',
    romaji: 'fune',
    meaning: 'Boat / Ship',
    icon: '⛵',
    type: 'Noun'
  },
  'さかな': {
    word: 'さかな',
    kanji: '魚',
    romaji: 'sakana',
    meaning: 'Fish',
    icon: '🐟',
    type: 'Noun'
  },
  'あし': {
    word: 'あし',
    kanji: '足 / 脚',
    romaji: 'ashi',
    meaning: 'Foot / Leg',
    icon: '🦶',
    type: 'Noun'
  },
  'かお': {
    word: 'かお',
    kanji: '顔',
    romaji: 'kao',
    meaning: 'Face',
    icon: '😀',
    type: 'Noun'
  },
  'こえ': {
    word: 'こえ',
    kanji: '声',
    romaji: 'koe',
    meaning: 'Voice',
    icon: '📢',
    type: 'Noun'
  },
  'まど': {
    word: 'まど',
    kanji: '窓',
    romaji: 'mado',
    meaning: 'Window',
    icon: '🪟',
    type: 'Noun'
  },
  'へや': {
    word: 'へや',
    kanji: '部屋',
    romaji: 'heya',
    meaning: 'Room',
    icon: '🚪',
    type: 'Noun'
  },
  'かがみ': {
    word: 'かがみ',
    kanji: '鏡',
    romaji: 'kagami',
    meaning: 'Mirror',
    icon: '🪞',
    type: 'Noun'
  },
  'とけい': {
    word: 'とけい',
    kanji: '時計',
    romaji: 'tokei',
    meaning: 'Clock / Watch',
    icon: '⏰',
    type: 'Noun'
  },
  'ふで': {
    word: 'ふで',
    kanji: '筆',
    romaji: 'fude',
    meaning: 'Calligraphy Brush',
    icon: '🖌️',
    type: 'Noun'
  },
  'みみ': {
    word: 'みみ',
    kanji: '耳',
    romaji: 'mimi',
    meaning: 'Ear',
    icon: '👂',
    type: 'Noun'
  },
  'はこ': {
    word: 'はこ',
    kanji: '箱',
    romaji: 'hako',
    meaning: 'Box / Crate',
    icon: '📦',
    type: 'Noun'
  },
  'むし': {
    word: 'むし',
    kanji: '虫',
    romaji: 'mushi',
    meaning: 'Bug / Insect',
    icon: '🐛',
    type: 'Noun'
  },
  'つち': {
    word: 'つち',
    kanji: '土',
    romaji: 'tsuchi',
    meaning: 'Earth / Soil',
    icon: '🌍',
    type: 'Noun'
  },
  'かえる': {
    word: 'かえる',
    kanji: '蛙',
    romaji: 'kaeru',
    meaning: 'Frog',
    icon: '🐸',
    type: 'Noun'
  },
  'うし': {
    word: 'うし',
    kanji: '牛',
    romaji: 'ushi',
    meaning: 'Cow / Bull',
    icon: '🐮',
    type: 'Noun'
  },
  'ゆめ': {
    word: 'ゆめ',
    kanji: '夢',
    romaji: 'yume',
    meaning: 'Dream',
    icon: '💭',
    type: 'Noun'
  },
  'みどり': {
    word: 'みどり',
    kanji: '緑',
    romaji: 'midori',
    meaning: 'Green (color / greenery)',
    icon: '🟢',
    type: 'Noun'
  },
  'すし': {
    word: 'すし',
    kanji: '寿司',
    romaji: 'sushi',
    meaning: 'Sushi',
    icon: '🍣',
    type: 'Noun'
  },
  'おちゃ': {
    word: 'おちゃ',
    kanji: 'お茶',
    romaji: 'ocha',
    meaning: 'Green Tea',
    icon: '🍵',
    type: 'Noun'
  },
  'だんご': {
    word: 'だんご',
    kanji: '団子',
    romaji: 'dango',
    meaning: 'Sweet Dango Dumpling',
    icon: '🍡',
    type: 'Noun'
  },
  'たいやき': {
    word: 'たいやき',
    kanji: '鯛焼き',
    romaji: 'taiyaki',
    meaning: 'Taiyaki Waffle Cake',
    icon: '🐟',
    type: 'Noun'
  },
  'ふじさん': {
    word: 'ふじさん',
    kanji: '富士山',
    romaji: 'fujisan',
    meaning: 'Mount Fuji',
    icon: '🗻',
    type: 'Proper Noun'
  }
};

/**
 * Normalizes input and looks up Japanese word.
 * Supports exact matches and kana conversion.
 */
export function lookupJapaneseWord(word: string): JapaneseWord | null {
  const trimmed = word.trim();
  if (!trimmed) return null;

  // Direct match
  if (JAPANESE_DICTIONARY[trimmed]) {
    return JAPANESE_DICTIONARY[trimmed];
  }

  // Convert Katakana to Hiragana if entered in Katakana
  const toHiragana = (str: string) => {
    return str.replace(/[\u30a1-\u30f6]/g, (match) => {
      const chr = match.charCodeAt(0) - 0x60;
      return String.fromCharCode(chr);
    });
  };

  const hiraganaVersion = toHiragana(trimmed);
  if (JAPANESE_DICTIONARY[hiraganaVersion]) {
    return JAPANESE_DICTIONARY[hiraganaVersion];
  }

  return null;
}
