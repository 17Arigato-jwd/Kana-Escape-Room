export interface RoomJapaneseTheme {
  id: string;
  roomNumber: number;
  kanjiChamber: string;      // e.g. "第壱室"
  kanjiTitle: string;        // e.g. "電脳・秋葉原工房"
  englishTitle: string;      // e.g. "Cyber Akihabara Workshop"
  descriptionJp: string;     // Short Japanese atmospheric subtitle
  wagaraClass: string;       // "wagara-ichimatsu" | "wagara-asanoha" | "wagara-seigaiha"
  wagaraName: string;        // "市松 (Ichimatsu)" | "麻の葉 (Asanoha)" | "青海波 (Seigaiha)"
  pixelBoxClass: string;     // "pixel-box" | "pixel-box-cedar" | "pixel-box-vermillion"
  borderClass: string;       // Tailwind border class
  accentTextClass: string;   // Tailwind text class
  badgeBgClass: string;      // Tailwind bg class
  hankoText: string;         // "見事" | "合格" | "皆伝"
  doorNameJp: string;        // "シャッター" | "障子の扉" | "神聖な鳥居"
}

export const ROOM_THEMES: Record<string, RoomJapaneseTheme> = {
  'room-1': {
    id: 'room-1',
    roomNumber: 1,
    kanjiChamber: '第壱室',
    kanjiTitle: '秋葉原・電脳工房',
    englishTitle: 'The Cyber Akihabara Workshop',
    descriptionJp: '昭和レトロな電子機器とゲーム機が並ぶ秘密の工房',
    wagaraClass: 'wagara-ichimatsu',
    wagaraName: '市松模様 (Ichimatsu)',
    pixelBoxClass: 'pixel-box',
    borderClass: 'border-cyan-500/80',
    accentTextClass: 'text-cyan-400',
    badgeBgClass: 'bg-indigo-950/90',
    hankoText: '見事',
    doorNameJp: '電子防護扉',
  },
  'room-2': {
    id: 'room-2',
    roomNumber: 2,
    kanjiChamber: '第弐室',
    kanjiTitle: '古文書院・茶室',
    englishTitle: 'The Grand Ryokan Archive',
    descriptionJp: '古文書と杉の木枠に包まれた、静寂なる書院造りの部屋',
    wagaraClass: 'wagara-asanoha',
    wagaraName: '麻の葉模様 (Asanoha)',
    pixelBoxClass: 'pixel-box-cedar',
    borderClass: 'border-amber-500/80',
    accentTextClass: 'text-amber-400',
    badgeBgClass: 'bg-amber-950/90',
    hankoText: '合格',
    doorNameJp: '重厚な障子格子扉',
  },
  'room-3': {
    id: 'room-3',
    roomNumber: 3,
    kanjiChamber: '第参室',
    kanjiTitle: '神聖鳥居・月光の神域',
    englishTitle: 'The Sacred Torii Sanctum',
    descriptionJp: '月明かりと桜が舞う、結界に守られた聖なる鳥居の間',
    wagaraClass: 'wagara-seigaiha',
    wagaraName: '青海波模様 (Seigaiha)',
    pixelBoxClass: 'pixel-box-vermillion',
    borderClass: 'border-rose-500/80',
    accentTextClass: 'text-rose-400',
    badgeBgClass: 'bg-rose-950/90',
    hankoText: '皆伝',
    doorNameJp: '朱塗りの神聖鳥居',
  },
};

export function getRoomTheme(roomId: string): RoomJapaneseTheme {
  return ROOM_THEMES[roomId] || ROOM_THEMES['room-1'];
}
