/**
 * Ashtakoot (Gun Milan) Compatibility Calculator
 * 36-point system based on the Moon's Nakshatra and Rashi of both partners.
 * Uses classic Parashari Jyotish rules.
 */

// ─── Nakshatras (27) ────────────────────────────────────────────────────────

export interface Nakshatra {
  id: number;        // 0–26
  nameHi: string;
  nameEn: string;
  rashi: number;     // 0-based rashi index (0=Mesh..11=Meen)
  lord: string;      // planetary lord
  gana: "dev" | "manush" | "rakshasa";
  yoni: string;      // animal symbol
  yoniGender: "male" | "female";
  nadi: "aadi" | "madhya" | "antya";
  varna: "brahmin" | "kshatriya" | "vaishya" | "shudra";
}

export const NAKSHATRAS: Nakshatra[] = [
  // Mesh (Aries) — nakshatras 0,1,2
  { id: 0,  nameHi: "अश्विनी",       nameEn: "Ashwini",         rashi: 0,  lord: "Ke", gana: "dev",      yoni: "Horse",    yoniGender: "male",   nadi: "aadi",   varna: "vaishya"   },
  { id: 1,  nameHi: "भरणी",          nameEn: "Bharani",         rashi: 0,  lord: "Ve", gana: "manush",   yoni: "Elephant", yoniGender: "female", nadi: "madhya", varna: "shudra"    },
  { id: 2,  nameHi: "कृत्तिका",      nameEn: "Krittika",        rashi: 0,  lord: "Su", gana: "rakshasa", yoni: "Sheep",    yoniGender: "female", nadi: "antya",  varna: "brahmin"   },
  // Vrishabh (Taurus)
  { id: 3,  nameHi: "रोहिणी",        nameEn: "Rohini",          rashi: 1,  lord: "Mo", gana: "manush",   yoni: "Serpent",  yoniGender: "male",   nadi: "antya",  varna: "shudra"    },
  { id: 4,  nameHi: "मृगशिरा",       nameEn: "Mrigashira",      rashi: 1,  lord: "Ma", gana: "dev",      yoni: "Serpent",  yoniGender: "female", nadi: "madhya", varna: "vaishya"   },
  { id: 5,  nameHi: "आर्द्रा",       nameEn: "Ardra",           rashi: 1,  lord: "Ra", gana: "manush",   yoni: "Dog",      yoniGender: "female", nadi: "aadi",   varna: "shudra"    },
  // Mithun (Gemini)
  { id: 6,  nameHi: "पुनर्वसु",      nameEn: "Punarvasu",       rashi: 2,  lord: "Ju", gana: "dev",      yoni: "Cat",      yoniGender: "female", nadi: "aadi",   varna: "vaishya"   },
  { id: 7,  nameHi: "पुष्य",         nameEn: "Pushya",          rashi: 2,  lord: "Sa", gana: "dev",      yoni: "Sheep",    yoniGender: "male",   nadi: "madhya", varna: "kshatriya" },
  { id: 8,  nameHi: "आश्लेषा",       nameEn: "Ashlesha",        rashi: 2,  lord: "Me", gana: "rakshasa", yoni: "Cat",      yoniGender: "male",   nadi: "antya",  varna: "shudra"    },
  // Kark (Cancer)
  { id: 9,  nameHi: "मघा",           nameEn: "Magha",           rashi: 3,  lord: "Ke", gana: "rakshasa", yoni: "Rat",      yoniGender: "male",   nadi: "antya",  varna: "shudra"    },
  { id: 10, nameHi: "पूर्व फाल्गुनी",nameEn: "Purva Phalguni",  rashi: 3,  lord: "Ve", gana: "manush",   yoni: "Rat",      yoniGender: "female", nadi: "madhya", varna: "brahmin"   },
  { id: 11, nameHi: "उत्तर फाल्गुनी",nameEn: "Uttara Phalguni", rashi: 3,  lord: "Su", gana: "manush",   yoni: "Cow",      yoniGender: "male",   nadi: "aadi",   varna: "kshatriya" },
  // Singh (Leo)
  { id: 12, nameHi: "हस्त",          nameEn: "Hasta",           rashi: 4,  lord: "Mo", gana: "dev",      yoni: "Buffalo",  yoniGender: "female", nadi: "aadi",   varna: "vaishya"   },
  { id: 13, nameHi: "चित्रा",        nameEn: "Chitra",          rashi: 4,  lord: "Ma", gana: "rakshasa", yoni: "Tiger",    yoniGender: "female", nadi: "madhya", varna: "kshatriya" },
  { id: 14, nameHi: "स्वाती",        nameEn: "Swati",           rashi: 4,  lord: "Ra", gana: "dev",      yoni: "Buffalo",  yoniGender: "male",   nadi: "antya",  varna: "shudra"    },
  // Kanya (Virgo)
  { id: 15, nameHi: "विशाखा",        nameEn: "Vishakha",        rashi: 5,  lord: "Ju", gana: "rakshasa", yoni: "Tiger",    yoniGender: "male",   nadi: "antya",  varna: "shudra"    },
  { id: 16, nameHi: "अनुराधा",       nameEn: "Anuradha",        rashi: 5,  lord: "Sa", gana: "dev",      yoni: "Deer",     yoniGender: "female", nadi: "madhya", varna: "shudra"    },
  { id: 17, nameHi: "ज्येष्ठा",      nameEn: "Jyeshtha",        rashi: 5,  lord: "Me", gana: "rakshasa", yoni: "Deer",     yoniGender: "male",   nadi: "aadi",   varna: "vaishya"   },
  // Vrishchik (Scorpio)
  { id: 18, nameHi: "मूल",           nameEn: "Mula",            rashi: 6,  lord: "Ke", gana: "rakshasa", yoni: "Dog",      yoniGender: "male",   nadi: "aadi",   varna: "kshatriya" },
  { id: 19, nameHi: "पूर्वाषाढा",    nameEn: "Purva Ashadha",   rashi: 6,  lord: "Ve", gana: "manush",   yoni: "Monkey",   yoniGender: "male",   nadi: "madhya", varna: "brahmin"   },
  { id: 20, nameHi: "उत्तराषाढा",    nameEn: "Uttara Ashadha",  rashi: 6,  lord: "Su", gana: "manush",   yoni: "Mongoose", yoniGender: "female", nadi: "antya",  varna: "kshatriya" },
  // Dhanu (Sagittarius)
  { id: 21, nameHi: "श्रवण",         nameEn: "Shravana",        rashi: 7,  lord: "Mo", gana: "dev",      yoni: "Monkey",   yoniGender: "female", nadi: "antya",  varna: "shudra"    },
  { id: 22, nameHi: "धनिष्ठा",       nameEn: "Dhanishtha",      rashi: 7,  lord: "Ma", gana: "rakshasa", yoni: "Lion",     yoniGender: "female", nadi: "madhya", varna: "vaishya"   },
  { id: 23, nameHi: "शतभिषा",        nameEn: "Shatabhisha",     rashi: 7,  lord: "Ra", gana: "rakshasa", yoni: "Horse",    yoniGender: "female", nadi: "aadi",   varna: "shudra"    },
  // Makar (Capricorn)
  { id: 24, nameHi: "पूर्व भाद्रपद",nameEn: "Purva Bhadrapada", rashi: 8,  lord: "Ju", gana: "manush",   yoni: "Lion",     yoniGender: "male",   nadi: "aadi",   varna: "brahmin"   },
  { id: 25, nameHi: "उत्तर भाद्रपद",nameEn: "Uttara Bhadrapada",rashi: 8,  lord: "Sa", gana: "manush",   yoni: "Cow",      yoniGender: "female", nadi: "madhya", varna: "kshatriya" },
  // Kumbh (Aquarius)
  { id: 26, nameHi: "रेवती",         nameEn: "Revati",          rashi: 9,  lord: "Me", gana: "dev",      yoni: "Elephant", yoniGender: "male",   nadi: "antya",  varna: "shudra"    },
];

// ─── Planet lords → index ───────────────────────────────────────────────────

const PLANET_ORDER = ["Ke", "Ve", "Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me"];
// Graha Maitri (natural friendships)
const PLANET_FRIENDS: Record<string, string[]> = {
  Su: ["Mo", "Ma", "Ju"],
  Mo: ["Su", "Me"],
  Ma: ["Su", "Mo", "Ju"],
  Me: ["Su", "Ve"],
  Ju: ["Su", "Mo", "Ma"],
  Ve: ["Me", "Sa"],
  Sa: ["Me", "Ve"],
  Ra: ["Ve", "Sa"],
  Ke: ["Ve", "Sa"],
};
const PLANET_NEUTRAL: Record<string, string[]> = {
  Su: ["Me"],
  Mo: ["Ma", "Ju", "Ve", "Sa"],
  Ma: ["Ve", "Sa"],
  Me: ["Ma", "Ju", "Sa"],
  Ju: ["Sa"],
  Ve: ["Ma", "Ju", "Mo"],
  Sa: ["Ju"],
  Ra: ["Ju"],
  Ke: ["Ju"],
};

function getPlanetRelation(a: string, b: string): "friend" | "neutral" | "enemy" {
  if (PLANET_FRIENDS[a]?.includes(b)) return "friend";
  if (PLANET_NEUTRAL[a]?.includes(b)) return "neutral";
  return "enemy";
}

// ─── Nakshatra from Moon's sidereal longitude ───────────────────────────────

export function nakshatraFromMoonDeg(moonSiderealDeg: number): number {
  // Each nakshatra spans 13°20' (800 arcmin = 13.333...°)
  const idx = Math.floor(((moonSiderealDeg % 360) + 360) % 360 / (360 / 27));
  return Math.min(idx, 26);
}

// ─── Koot calculations ───────────────────────────────────────────────────────

export interface KootResult {
  name: string;
  nameHi: string;
  score: number;
  maxScore: number;
  description: string;
  descriptionHi: string;
  status: "excellent" | "good" | "average" | "poor";
  groomValue: string;
  brideValue: string;
}

// 1. Varna (1 pt) — spiritual/caste compatibility
const VARNA_ORDER = ["shudra", "vaishya", "kshatriya", "brahmin"];
function calcVarna(g: Nakshatra, b: Nakshatra): KootResult {
  const gv = VARNA_ORDER.indexOf(g.varna);
  const bv = VARNA_ORDER.indexOf(b.varna);
  const score = gv >= bv ? 1 : 0;
  return {
    name: "Varna", nameHi: "वर्ण",
    score, maxScore: 1,
    groomValue: g.varna, brideValue: b.varna,
    description: score === 1 ? "Compatible spiritual levels" : "Groom's varna should be ≥ bride's",
    descriptionHi: score === 1 ? "आध्यात्मिक स्तर अनुकूल है" : "वर की वर्ण, वधू से ऊँची या समान होनी चाहिए",
    status: score === 1 ? "excellent" : "poor",
  };
}

// 2. Vashya (2 pts) — mutual control/attraction
const VASHYA_GROUPS: Record<string, string> = {
  mesh: "manav", vrishabh: "chatushpad", mithun: "manav", kark: "jalchar",
  singh: "vanchar", kanya: "manav", tula: "manav", vrishchik: "keeta",
  dhanu: "chatushpad", makar: "jalchar", kumbh: "manav", meen: "jalchar",
};
const RASHI_IDS = ["mesh","vrishabh","mithun","kark","singh","kanya","tula","vrishchik","dhanu","makar","kumbh","meen"];
function vashyaScore(r1: number, r2: number): number {
  const g1 = VASHYA_GROUPS[RASHI_IDS[r1]];
  const g2 = VASHYA_GROUPS[RASHI_IDS[r2]];
  if (g1 === g2) return 2;
  if ((g1 === "manav" && g2 === "chatushpad") || (g2 === "manav" && g1 === "chatushpad")) return 1;
  if ((g1 === "manav" && g2 === "jalchar") || (g2 === "manav" && g1 === "jalchar")) return 1;
  return 0;
}
function calcVashya(g: Nakshatra, b: Nakshatra): KootResult {
  const score = vashyaScore(g.rashi, b.rashi);
  return {
    name: "Vashya", nameHi: "वश्य",
    score, maxScore: 2,
    groomValue: VASHYA_GROUPS[RASHI_IDS[g.rashi]], brideValue: VASHYA_GROUPS[RASHI_IDS[b.rashi]],
    description: score === 2 ? "Strong mutual attraction" : score === 1 ? "Moderate attraction" : "Weak mutual control",
    descriptionHi: score === 2 ? "परस्पर आकर्षण उत्तम है" : score === 1 ? "सामान्य आकर्षण" : "नियंत्रण की कमी",
    status: score === 2 ? "excellent" : score === 1 ? "good" : "poor",
  };
}

// 3. Tara (3 pts) — birth star compatibility
function taraScore(gNak: number, bNak: number): number {
  const tara = ((bNak - gNak + 27) % 27) + 1; // 1-based
  const taraNum = ((tara - 1) % 9) + 1;
  // Auspicious taras: 1,3,5,7 (Janma, Vipat, Pratya, Naidhana are bad: 1,2,4,7,9 simplified)
  const goodTaras = [1, 3, 5, 7]; // simplified classic
  return goodTaras.includes(taraNum) ? 3 : 0;
}
function calcTara(g: Nakshatra, b: Nakshatra): KootResult {
  const score = Math.round((taraScore(g.id, b.id) + taraScore(b.id, g.id)) / 2);
  const finalScore = Math.min(score, 3);
  return {
    name: "Tara", nameHi: "तारा",
    score: finalScore, maxScore: 3,
    groomValue: g.nameHi, brideValue: b.nameHi,
    description: finalScore >= 2 ? "Favorable birth-star relationship" : finalScore === 1 ? "Moderate star harmony" : "Unfavorable star relationship",
    descriptionHi: finalScore >= 2 ? "जन्म नक्षत्र संबंध शुभ है" : finalScore === 1 ? "नक्षत्र संबंध सामान्य" : "जन्म नक्षत्र प्रतिकूल",
    status: finalScore === 3 ? "excellent" : finalScore === 2 ? "good" : finalScore === 1 ? "average" : "poor",
  };
}

// 4. Yoni (4 pts) — sexual/physical compatibility
const YONI_ENEMIES: Record<string, string> = {
  Horse: "Buffalo", Elephant: "Lion", Sheep: "Mongoose",
  Serpent: "Mongoose", Dog: "Deer", Cat: "Rat",
  Rat: "Cat", Cow: "Tiger", Buffalo: "Horse",
  Tiger: "Deer", Deer: "Dog", Monkey: "Sheep",
  Mongoose: "Serpent", Lion: "Elephant",
};
function calcYoni(g: Nakshatra, b: Nakshatra): KootResult {
  let score = 0;
  if (g.yoni === b.yoni) {
    score = g.yoniGender !== b.yoniGender ? 4 : 3; // same animal, opp gender = best
  } else if (YONI_ENEMIES[g.yoni] === b.yoni || YONI_ENEMIES[b.yoni] === g.yoni) {
    score = 0; // enemies
  } else {
    score = 2; // neutral
  }
  return {
    name: "Yoni", nameHi: "योनि",
    score, maxScore: 4,
    groomValue: `${g.yoni} (${g.yoniGender})`, brideValue: `${b.yoni} (${b.yoniGender})`,
    description: score === 4 ? "Ideal physical compatibility" : score === 3 ? "Good compatibility" : score === 2 ? "Average compatibility" : "Incompatible – Yoni Dosha",
    descriptionHi: score === 4 ? "शारीरिक अनुकूलता उत्तम" : score === 3 ? "अच्छी अनुकूलता" : score === 2 ? "सामान्य अनुकूलता" : "योनि दोष – अनुकूलता नहीं",
    status: score >= 3 ? "excellent" : score === 2 ? "good" : "poor",
  };
}

// 5. Graha Maitri (5 pts) — mental/friendship compatibility
function calcGrahaMaitri(g: Nakshatra, b: Nakshatra): KootResult {
  const rel1 = getPlanetRelation(g.lord, b.lord);
  const rel2 = getPlanetRelation(b.lord, g.lord);
  const points = (r: string) => r === "friend" ? 2 : r === "neutral" ? 1 : 0;
  const raw = points(rel1) + points(rel2); // 0–4
  const score = Math.round(raw * 5 / 4); // scale to 5
  const finalScore = Math.min(score, 5);
  return {
    name: "Graha Maitri", nameHi: "ग्रह मैत्री",
    score: finalScore, maxScore: 5,
    groomValue: g.lord, brideValue: b.lord,
    description: finalScore >= 4 ? "Excellent mental compatibility" : finalScore >= 3 ? "Good intellectual harmony" : finalScore >= 2 ? "Average friendship" : "Mental conflict possible",
    descriptionHi: finalScore >= 4 ? "मानसिक अनुकूलता उत्तम" : finalScore >= 3 ? "बौद्धिक सामंजस्य अच्छा" : finalScore >= 2 ? "सामान्य मित्रता" : "मानसिक संघर्ष संभव",
    status: finalScore >= 4 ? "excellent" : finalScore >= 3 ? "good" : finalScore >= 2 ? "average" : "poor",
  };
}

// 6. Gana (6 pts) — nature/temperament compatibility
const GANA_SCORE: Record<string, Record<string, number>> = {
  dev:      { dev: 6, manush: 5, rakshasa: 1 },
  manush:   { dev: 5, manush: 6, rakshasa: 0 },
  rakshasa: { dev: 1, manush: 0, rakshasa: 6 },
};
function calcGana(g: Nakshatra, b: Nakshatra): KootResult {
  const score = GANA_SCORE[g.gana][b.gana];
  const ganaNames: Record<string, string> = { dev: "देव", manush: "मानव", rakshasa: "राक्षस" };
  return {
    name: "Gana", nameHi: "गण",
    score, maxScore: 6,
    groomValue: ganaNames[g.gana], brideValue: ganaNames[b.gana],
    description: score === 6 ? "Perfect temperament match" : score >= 4 ? "Good nature compatibility" : score >= 1 ? "Some temperament differences" : "Significant nature conflict – Gana Dosha",
    descriptionHi: score === 6 ? "स्वभाव पूर्ण अनुकूल" : score >= 4 ? "स्वभाव में अच्छा मेल" : score >= 1 ? "स्वभाव में कुछ अंतर" : "गण दोष – प्रकृति में विरोध",
    status: score === 6 ? "excellent" : score >= 4 ? "good" : score >= 1 ? "average" : "poor",
  };
}

// 7. Bhakoot (7 pts) — love/family/prosperity compatibility
// Based on rashi positions from each other
const BHAKOOT_BAD_PAIRS = [[2,12],[12,2],[5,9],[9,5],[6,8],[8,6]]; // [from, to]
function calcBhakoot(g: Nakshatra, b: Nakshatra): KootResult {
  const gRashi = g.rashi + 1; // 1-based
  const bRashi = b.rashi + 1;
  const diff1 = ((bRashi - gRashi + 12) % 12) + 1;
  const diff2 = ((gRashi - bRashi + 12) % 12) + 1;
  const isBad = BHAKOOT_BAD_PAIRS.some(([x, y]) => (diff1 === x && diff2 === y) || (diff1 === y && diff2 === x));
  const score = isBad ? 0 : 7;
  return {
    name: "Bhakoot", nameHi: "भकूट",
    score, maxScore: 7,
    groomValue: RASHI_IDS[g.rashi], brideValue: RASHI_IDS[b.rashi],
    description: score === 7 ? "Excellent love & prosperity harmony" : "Bhakoot Dosha – may affect prosperity",
    descriptionHi: score === 7 ? "प्रेम और समृद्धि में उत्तम तालमेल" : "भकूट दोष – आर्थिक और पारिवारिक समृद्धि पर प्रभाव",
    status: score === 7 ? "excellent" : "poor",
  };
}

// 8. Nadi (8 pts) — health/progeny compatibility
function calcNadi(g: Nakshatra, b: Nakshatra): KootResult {
  const score = g.nadi !== b.nadi ? 8 : 0;
  const nadiNames: Record<string, string> = { aadi: "आदि", madhya: "मध्य", antya: "अंत्य" };
  return {
    name: "Nadi", nameHi: "नाड़ी",
    score, maxScore: 8,
    groomValue: nadiNames[g.nadi], brideValue: nadiNames[b.nadi],
    description: score === 8 ? "No Nadi Dosha – excellent health & progeny" : "Nadi Dosha – may affect health & progeny",
    descriptionHi: score === 8 ? "नाड़ी दोष नहीं – स्वास्थ्य और संतान शुभ" : "नाड़ी दोष – स्वास्थ्य और संतान पर प्रभाव संभव",
    status: score === 8 ? "excellent" : "poor",
  };
}

// ─── Main Ashtakoot function ─────────────────────────────────────────────────

export interface AshtakootResult {
  koots: KootResult[];
  totalScore: number;
  maxScore: number;    // always 36
  percentage: number;
  verdict: string;
  verdictHi: string;
  compatibility: "excellent" | "good" | "average" | "poor";
  groomNakshatra: Nakshatra;
  brideNakshatra: Nakshatra;
}

export function calcAshtakoot(
  groomMoonDeg: number,  // sidereal Moon longitude of groom
  brideMoonDeg: number,  // sidereal Moon longitude of bride
): AshtakootResult {
  const gIdx = nakshatraFromMoonDeg(groomMoonDeg);
  const bIdx = nakshatraFromMoonDeg(brideMoonDeg);
  const g = NAKSHATRAS[gIdx];
  const b = NAKSHATRAS[bIdx];

  const koots: KootResult[] = [
    calcVarna(g, b),
    calcVashya(g, b),
    calcTara(g, b),
    calcYoni(g, b),
    calcGrahaMaitri(g, b),
    calcGana(g, b),
    calcBhakoot(g, b),
    calcNadi(g, b),
  ];

  const totalScore = koots.reduce((s, k) => s + k.score, 0);
  const percentage = Math.round((totalScore / 36) * 100);

  let verdict: string;
  let verdictHi: string;
  let compatibility: AshtakootResult["compatibility"];

  if (totalScore >= 31) {
    verdict = "Exceptional match — highly auspicious for marriage";
    verdictHi = "अत्यंत शुभ — विवाह के लिए अति उत्तम योग";
    compatibility = "excellent";
  } else if (totalScore >= 25) {
    verdict = "Good match — auspicious for a happy marriage";
    verdictHi = "शुभ मिलान — सुखी वैवाहिक जीवन का योग";
    compatibility = "good";
  } else if (totalScore >= 18) {
    verdict = "Average match — marriage possible with mutual effort";
    verdictHi = "सामान्य मिलान — परस्पर प्रयास से सुखी जीवन संभव";
    compatibility = "average";
  } else {
    verdict = "Weak match — consult a learned astrologer before proceeding";
    verdictHi = "अशुभ मिलान — विद्वान ज्योतिषी से परामर्श अवश्य लें";
    compatibility = "poor";
  }

  return { koots, totalScore, maxScore: 36, percentage, verdict, verdictHi, compatibility, groomNakshatra: g, brideNakshatra: b };
}
