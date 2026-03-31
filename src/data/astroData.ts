export interface Rashi {
  id: string;
  nameHi: string;
  nameEn: string;
  symbol: string;
  element: string;
  lord: string;
  lordHi: string;
  color: string;
  luckyNum: number[];
  description: { hi: string; en: string };
}

export const RASHIS: Rashi[] = [
  {
    id: "mesh", nameHi: "मेष", nameEn: "Aries", symbol: "♈", element: "अग्नि",
    lord: "Mars", lordHi: "मंगल", color: "hsl(0 70% 55%)",
    luckyNum: [1, 9],
    description: { hi: "साहसी, ऊर्जावान और नेतृत्वकारी स्वभाव", en: "Brave, energetic and natural leader" },
  },
  {
    id: "vrishabh", nameHi: "वृषभ", nameEn: "Taurus", symbol: "♉", element: "पृथ्वी",
    lord: "Venus", lordHi: "शुक्र", color: "hsl(150 50% 38%)",
    luckyNum: [2, 6],
    description: { hi: "स्थिर, विश्वसनीय और सौंदर्य प्रेमी", en: "Stable, reliable and beauty-loving" },
  },
  {
    id: "mithun", nameHi: "मिथुन", nameEn: "Gemini", symbol: "♊", element: "वायु",
    lord: "Mercury", lordHi: "बुध", color: "hsl(200 70% 48%)",
    luckyNum: [3, 5],
    description: { hi: "बुद्धिमान, जिज्ञासु और संवाद कुशल", en: "Intelligent, curious and communicative" },
  },
  {
    id: "kark", nameHi: "कर्क", nameEn: "Cancer", symbol: "♋", element: "जल",
    lord: "Moon", lordHi: "चंद्र", color: "hsl(220 60% 55%)",
    luckyNum: [2, 7],
    description: { hi: "भावुक, पालन-पोषण करने वाले और सहज ज्ञानी", en: "Emotional, nurturing and intuitive" },
  },
  {
    id: "singh", nameHi: "सिंह", nameEn: "Leo", symbol: "♌", element: "अग्नि",
    lord: "Sun", lordHi: "सूर्य", color: "hsl(35 95% 50%)",
    luckyNum: [1, 4],
    description: { hi: "राजसी, उदार और करिश्माई स्वभाव", en: "Regal, generous and charismatic" },
  },
  {
    id: "kanya", nameHi: "कन्या", nameEn: "Virgo", symbol: "♍", element: "पृथ्वी",
    lord: "Mercury", lordHi: "बुध", color: "hsl(120 45% 40%)",
    luckyNum: [3, 6],
    description: { hi: "विश्लेषणात्मक, परिश्रमी और व्यावहारिक", en: "Analytical, hardworking and practical" },
  },
  {
    id: "tula", nameHi: "तुला", nameEn: "Libra", symbol: "♎", element: "वायु",
    lord: "Venus", lordHi: "शुक्र", color: "hsl(290 55% 48%)",
    luckyNum: [2, 7],
    description: { hi: "संतुलित, न्यायप्रिय और सौंदर्य प्रेमी", en: "Balanced, just and aesthetically inclined" },
  },
  {
    id: "vrishchik", nameHi: "वृश्चिक", nameEn: "Scorpio", symbol: "♏", element: "जल",
    lord: "Mars", lordHi: "मंगल", color: "hsl(345 70% 40%)",
    luckyNum: [1, 8],
    description: { hi: "रहस्यमय, तीव्र और परिवर्तनकारी", en: "Mysterious, intense and transformative" },
  },
  {
    id: "dhanu", nameHi: "धनु", nameEn: "Sagittarius", symbol: "♐", element: "अग्नि",
    lord: "Jupiter", lordHi: "बृहस्पति", color: "hsl(25 85% 48%)",
    luckyNum: [3, 9],
    description: { hi: "आशावादी, दार्शनिक और स्वतंत्रता प्रिय", en: "Optimistic, philosophical and freedom-loving" },
  },
  {
    id: "makar", nameHi: "मकर", nameEn: "Capricorn", symbol: "♑", element: "पृथ्वी",
    lord: "Saturn", lordHi: "शनि", color: "hsl(240 30% 40%)",
    luckyNum: [6, 8],
    description: { hi: "अनुशासित, महत्वाकांक्षी और जिम्मेदार", en: "Disciplined, ambitious and responsible" },
  },
  {
    id: "kumbh", nameHi: "कुंभ", nameEn: "Aquarius", symbol: "♒", element: "वायु",
    lord: "Saturn", lordHi: "शनि", color: "hsl(190 65% 45%)",
    luckyNum: [4, 8],
    description: { hi: "प्रगतिशील, मानवतावादी और अभिनव", en: "Progressive, humanitarian and innovative" },
  },
  {
    id: "meen", nameHi: "मीन", nameEn: "Pisces", symbol: "♓", element: "जल",
    lord: "Jupiter", lordHi: "बृहस्पति", color: "hsl(170 55% 42%)",
    luckyNum: [3, 7],
    description: { hi: "सपनीला, सहानुभूतिपूर्ण और आध्यात्मिक", en: "Dreamy, empathetic and spiritual" },
  },
];
