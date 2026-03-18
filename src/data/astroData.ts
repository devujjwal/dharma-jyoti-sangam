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
  todayHi: string;
  todayEn: string;
}

export const RASHIS: Rashi[] = [
  {
    id: "mesh", nameHi: "मेष", nameEn: "Aries", symbol: "♈", element: "अग्नि",
    lord: "Mars", lordHi: "मंगल", color: "hsl(0 70% 55%)",
    luckyNum: [1, 9], 
    description: { hi: "साहसी, ऊर्जावान और नेतृत्वकारी स्वभाव", en: "Brave, energetic and natural leader" },
    todayHi: "आज आपके लिए कार्यक्षेत्र में नई संभावनाएं उभरेंगी। मंगल की शुभ दृष्टि से आत्मविश्वास बढ़ेगा।",
    todayEn: "New opportunities arise in your career. Mars's favorable position boosts confidence.",
  },
  {
    id: "vrishabh", nameHi: "वृषभ", nameEn: "Taurus", symbol: "♉", element: "पृथ्वी",
    lord: "Venus", lordHi: "शुक्र", color: "hsl(150 50% 38%)",
    luckyNum: [2, 6],
    description: { hi: "स्थिर, विश्वसनीय और सौंदर्य प्रेमी", en: "Stable, reliable and beauty-loving" },
    todayHi: "शुक्र की कृपा से आज प्रेम और धन दोनों में लाभ मिल सकता है।",
    todayEn: "Venus blesses both love and finances today with favorable outcomes.",
  },
  {
    id: "mithun", nameHi: "मिथुन", nameEn: "Gemini", symbol: "♊", element: "वायु",
    lord: "Mercury", lordHi: "बुध", color: "hsl(200 70% 48%)",
    luckyNum: [3, 5],
    description: { hi: "बुद्धिमान, जिज्ञासु और संवाद कुशल", en: "Intelligent, curious and communicative" },
    todayHi: "बुध की कृपा से आज संचार और व्यापार में सफलता मिलेगी।",
    todayEn: "Mercury favors communication and business matters today.",
  },
  {
    id: "kark", nameHi: "कर्क", nameEn: "Cancer", symbol: "♋", element: "जल",
    lord: "Moon", lordHi: "चंद्र", color: "hsl(220 60% 55%)",
    luckyNum: [2, 7],
    description: { hi: "भावुक, पालन-पोषण करने वाले और सहज ज्ञानी", en: "Emotional, nurturing and intuitive" },
    todayHi: "चंद्र की कृपा से आज परिवार में सुख और खुशियां रहेंगी।",
    todayEn: "Moon's blessings bring family happiness and domestic peace.",
  },
  {
    id: "singh", nameHi: "सिंह", nameEn: "Leo", symbol: "♌", element: "अग्नि",
    lord: "Sun", lordHi: "सूर्य", color: "hsl(35 95% 50%)",
    luckyNum: [1, 4],
    description: { hi: "राजसी, उदार और करिश्माई स्वभाव", en: "Regal, generous and charismatic" },
    todayHi: "सूर्य की शुभ स्थिति से आज नेतृत्व गुण उभरेंगे। सम्मान और यश मिलेगा।",
    todayEn: "Sun's strong position enhances leadership qualities, bringing honor.",
  },
  {
    id: "kanya", nameHi: "कन्या", nameEn: "Virgo", symbol: "♍", element: "पृथ्वी",
    lord: "Mercury", lordHi: "बुध", color: "hsl(120 45% 40%)",
    luckyNum: [3, 6],
    description: { hi: "विश्लेषणात्मक, परिश्रमी और व्यावहारिक", en: "Analytical, hardworking and practical" },
    todayHi: "आज विश्लेषण और सूक्ष्म कार्यों में सफलता मिलेगी। स्वास्थ्य का ध्यान रखें।",
    todayEn: "Success in analytical tasks today. Pay attention to health matters.",
  },
  {
    id: "tula", nameHi: "तुला", nameEn: "Libra", symbol: "♎", element: "वायु",
    lord: "Venus", lordHi: "शुक्र", color: "hsl(290 55% 48%)",
    luckyNum: [2, 7],
    description: { hi: "संतुलित, न्यायप्रिय और सौंदर्य प्रेमी", en: "Balanced, just and aesthetically inclined" },
    todayHi: "शुक्र की कृपा से आज संबंधों में मधुरता और व्यापार में लाभ मिलेगा।",
    todayEn: "Venus blesses relationships with sweetness and business with gains.",
  },
  {
    id: "vrishchik", nameHi: "वृश्चिक", nameEn: "Scorpio", symbol: "♏", element: "जल",
    lord: "Mars", lordHi: "मंगल", color: "hsl(345 70% 40%)",
    luckyNum: [1, 8],
    description: { hi: "रहस्यमय, तीव्र और परिवर्तनकारी", en: "Mysterious, intense and transformative" },
    todayHi: "आज गूढ़ विषयों में रुचि बढ़ेगी। अंतर्ज्ञान से काम लें, सफलता मिलेगी।",
    todayEn: "Interest in esoteric subjects increases. Follow your intuition.",
  },
  {
    id: "dhanu", nameHi: "धनु", nameEn: "Sagittarius", symbol: "♐", element: "अग्नि",
    lord: "Jupiter", lordHi: "बृहस्पति", color: "hsl(25 85% 48%)",
    luckyNum: [3, 9],
    description: { hi: "आशावादी, दार्शनिक और स्वतंत्रता प्रिय", en: "Optimistic, philosophical and freedom-loving" },
    todayHi: "बृहस्पति की कृपा से आज ज्ञान और आध्यात्म में वृद्धि होगी।",
    todayEn: "Jupiter's blessings enhance wisdom and spiritual growth today.",
  },
  {
    id: "makar", nameHi: "मकर", nameEn: "Capricorn", symbol: "♑", element: "पृथ्वी",
    lord: "Saturn", lordHi: "शनि", color: "hsl(240 30% 40%)",
    luckyNum: [6, 8],
    description: { hi: "अनुशासित, महत्वाकांक्षी और जिम्मेदार", en: "Disciplined, ambitious and responsible" },
    todayHi: "शनि की कृपा से आज कड़ी मेहनत का फल मिलेगा। व्यावसायिक लक्ष्य पूरे होंगे।",
    todayEn: "Saturn rewards hard work. Professional goals meet with success.",
  },
  {
    id: "kumbh", nameHi: "कुंभ", nameEn: "Aquarius", symbol: "♒", element: "वायु",
    lord: "Saturn", lordHi: "शनि", color: "hsl(190 65% 45%)",
    luckyNum: [4, 8],
    description: { hi: "प्रगतिशील, मानवतावादी और अभिनव", en: "Progressive, humanitarian and innovative" },
    todayHi: "आज नई सोच और तकनीक में रुचि बढ़ेगी। समाजसेवा में संतोष मिलेगा।",
    todayEn: "Innovation and new ideas flourish. Social work brings satisfaction.",
  },
  {
    id: "meen", nameHi: "मीन", nameEn: "Pisces", symbol: "♓", element: "जल",
    lord: "Jupiter", lordHi: "बृहस्पति", color: "hsl(170 55% 42%)",
    luckyNum: [3, 7],
    description: { hi: "सपनीला, सहानुभूतिपूर्ण और आध्यात्मिक", en: "Dreamy, empathetic and spiritual" },
    todayHi: "बृहस्पति की कृपा से आज आध्यात्मिक अनुभव गहरे होंगे। कल्पनाशक्ति का उपयोग करें।",
    todayEn: "Spiritual experiences deepen with Jupiter's grace. Use your imagination.",
  },
];

export interface PanchangData {
  dateHi: string;
  dateEn: string;
  tithi: { hi: string; en: string };
  nakshatra: { hi: string; en: string };
  yoga: { hi: string; en: string };
  karana: { hi: string; en: string };
  sunrise: string;
  sunset: string;
  moonrise: string;
  auspicious: { hi: string; en: string };
  inauspicious: { hi: string; en: string };
  rahuKaal: string;
  paksha: { hi: string; en: string };
  masa: { hi: string; en: string };
  samvat: string;
  shubhMuhurat: { hi: string; en: string; time: string }[];
  vratToday: { hi: string; en: string }[];
}

// Dynamic date-based panchang (illustrative with real structure)
export const getTodayPanchang = (): PanchangData => {
  const today = new Date();
  const day = today.getDate();
  
  const tithis = [
    { hi: "प्रतिपदा", en: "Pratipada" }, { hi: "द्वितीया", en: "Dwitiya" },
    { hi: "तृतीया", en: "Tritiya" }, { hi: "चतुर्थी", en: "Chaturthi" },
    { hi: "पंचमी", en: "Panchami" }, { hi: "षष्ठी", en: "Shashthi" },
    { hi: "सप्तमी", en: "Saptami" }, { hi: "अष्टमी", en: "Ashtami" },
    { hi: "नवमी", en: "Navami" }, { hi: "दशमी", en: "Dashami" },
    { hi: "एकादशी", en: "Ekadashi" }, { hi: "द्वादशी", en: "Dwadashi" },
    { hi: "त्रयोदशी", en: "Trayodashi" }, { hi: "चतुर्दशी", en: "Chaturdashi" },
    { hi: "पूर्णिमा", en: "Purnima" },
  ];
  
  const nakshatras = [
    { hi: "अश्विनी", en: "Ashwini" }, { hi: "भरणी", en: "Bharani" },
    { hi: "कृत्तिका", en: "Krittika" }, { hi: "रोहिणी", en: "Rohini" },
    { hi: "मृगशिरा", en: "Mrigashira" }, { hi: "आर्द्रा", en: "Ardra" },
    { hi: "पुनर्वसु", en: "Punarvasu" }, { hi: "पुष्य", en: "Pushya" },
    { hi: "आश्लेषा", en: "Ashlesha" }, { hi: "मघा", en: "Magha" },
    { hi: "पूर्व फाल्गुनी", en: "Purva Phalguni" }, { hi: "उत्तर फाल्गुनी", en: "Uttara Phalguni" },
    { hi: "हस्त", en: "Hasta" }, { hi: "चित्रा", en: "Chitra" },
    { hi: "स्वाती", en: "Swati" }, { hi: "विशाखा", en: "Vishakha" },
    { hi: "अनुराधा", en: "Anuradha" }, { hi: "ज्येष्ठा", en: "Jyeshtha" },
    { hi: "मूल", en: "Mula" }, { hi: "पूर्वाषाढा", en: "Purva Ashadha" },
    { hi: "उत्तराषाढा", en: "Uttara Ashadha" }, { hi: "श्रवण", en: "Shravana" },
    { hi: "धनिष्ठा", en: "Dhanishtha" }, { hi: "शतभिषा", en: "Shatabhisha" },
    { hi: "पूर्व भाद्रपद", en: "Purva Bhadrapada" }, { hi: "उत्तर भाद्रपद", en: "Uttara Bhadrapada" },
    { hi: "रेवती", en: "Revati" },
  ];
  
  const yogas = [
    { hi: "विष्कुम्भ", en: "Vishkumbha" }, { hi: "प्रीति", en: "Preeti" },
    { hi: "आयुष्मान", en: "Ayushman" }, { hi: "सौभाग्य", en: "Saubhagya" },
    { hi: "शोभन", en: "Shobhana" }, { hi: "अतिगण्ड", en: "Atiganda" },
    { hi: "सुकर्मा", en: "Sukarma" }, { hi: "धृति", en: "Dhriti" },
    { hi: "शूल", en: "Shula" }, { hi: "गण्ड", en: "Ganda" },
    { hi: "वृद्धि", en: "Vriddhi" }, { hi: "ध्रुव", en: "Dhruva" },
    { hi: "व्याघात", en: "Vyaghata" }, { hi: "हर्षण", en: "Harshana" },
    { hi: "वज्र", en: "Vajra" }, { hi: "सिद्धि", en: "Siddhi" },
    { hi: "व्यतीपात", en: "Vyatipata" }, { hi: "वरीयान", en: "Variyana" },
    { hi: "परिघ", en: "Parigha" }, { hi: "शिव", en: "Shiva" },
    { hi: "सिद्ध", en: "Siddha" }, { hi: "साध्य", en: "Sadhya" },
    { hi: "शुभ", en: "Shubha" }, { hi: "शुक्ल", en: "Shukla" },
    { hi: "ब्रह्म", en: "Brahma" }, { hi: "इन्द्र", en: "Indra" },
    { hi: "वैधृति", en: "Vaidhriti" },
  ];

  const masas = [
    { hi: "चैत्र", en: "Chaitra" }, { hi: "वैशाख", en: "Vaishakha" },
    { hi: "ज्येष्ठ", en: "Jyeshtha" }, { hi: "आषाढ़", en: "Ashadha" },
    { hi: "श्रावण", en: "Shravana" }, { hi: "भाद्रपद", en: "Bhadrapada" },
    { hi: "आश्विन", en: "Ashwin" }, { hi: "कार्तिक", en: "Kartika" },
    { hi: "मार्गशीर्ष", en: "Margashirsha" }, { hi: "पौष", en: "Pausha" },
    { hi: "माघ", en: "Magha" }, { hi: "फाल्गुन", en: "Phalguna" },
  ];

  const ti = tithis[day % tithis.length];
  const na = nakshatras[day % nakshatras.length];
  const yo = yogas[day % yogas.length];
  const ma = masas[today.getMonth() % masas.length];

  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  return {
    dateHi: today.toLocaleDateString('hi-IN', dateOptions),
    dateEn: today.toLocaleDateString('en-IN', dateOptions),
    tithi: ti,
    nakshatra: na,
    yoga: yo,
    karana: { hi: "बव", en: "Bava" },
    sunrise: "06:18",
    sunset: "18:42",
    moonrise: "14:35",
    auspicious: { hi: "प्रातः 07:30 - 09:00", en: "07:30 AM - 09:00 AM" },
    inauspicious: { hi: "दोपहर 12:00 - 01:30", en: "12:00 PM - 01:30 PM" },
    rahuKaal: "15:00 - 16:30",
    paksha: day <= 15 ? { hi: "शुक्ल पक्ष", en: "Shukla Paksha" } : { hi: "कृष्ण पक्ष", en: "Krishna Paksha" },
    masa: ma,
    samvat: "विक्रम संवत २०८२",
    shubhMuhurat: [
      { hi: "अभिजित मुहूर्त", en: "Abhijit Muhurat", time: "11:54 - 12:44" },
      { hi: "विजय मुहूर्त", en: "Vijaya Muhurat", time: "14:24 - 15:13" },
    ],
    vratToday: day % 7 === 0 ? [{ hi: "रविवार व्रत", en: "Sunday Fast" }] : 
               day % 7 === 1 ? [{ hi: "सोमवार व्रत (शिव)", en: "Monday Fast (Shiva)" }] : [],
  };
};

export interface Festival {
  id: string;
  nameHi: string;
  nameEn: string;
  /** ISO date string: YYYY-MM-DD */
  isoDate: string;
  date: string;
  daysLeft: number;
  deity: string;
  deityHi: string;
  descHi: string;
  descEn: string;
  color: string;
  emoji: string;
  type: "tyohar" | "vrat" | "jayanti" | "auspicious";
  tithi?: string;
}

export const UPCOMING_FESTIVALS: Festival[] = [
  {
    id: "holi", nameHi: "होली", nameEn: "Holi", isoDate: "2025-03-14",
    date: "14 मार्च 2025", daysLeft: 5, deity: "Krishna", deityHi: "श्री कृष्ण",
    descHi: "रंगों का त्यौहार, बुराई पर अच्छाई की विजय का प्रतीक। इस दिन होलिका दहन के बाद धुलेंडी पर रंग खेले जाते हैं।",
    descEn: "Festival of colors, symbolizing victory of good over evil. Celebrated with Holika Dahan bonfire and playing colors.",
    color: "hsl(330 70% 55%)", emoji: "🎨", type: "tyohar", tithi: "फाल्गुन पूर्णिमा",
  },
  {
    id: "ramnavami", nameHi: "राम नवमी", nameEn: "Ram Navami", isoDate: "2025-04-06",
    date: "6 अप्रैल 2025", daysLeft: 28, deity: "Ram", deityHi: "श्री राम",
    descHi: "भगवान श्री राम का जन्मोत्सव, चैत्र शुक्ल नवमी को मनाया जाता है। इस दिन व्रत और रामायण पाठ का विशेष महत्व है।",
    descEn: "Birthday of Lord Rama on Chaitra Shukla Navami. Special significance of fasting and reciting Ramayana.",
    color: "hsl(24 95% 48%)", emoji: "🏹", type: "jayanti", tithi: "चैत्र शुक्ल नवमी",
  },
  {
    id: "hanumanjayanti", nameHi: "हनुमान जयंती", nameEn: "Hanuman Jayanti", isoDate: "2025-04-12",
    date: "12 अप्रैल 2025", daysLeft: 34, deity: "Hanuman", deityHi: "श्री हनुमान",
    descHi: "हनुमान जी का जन्मोत्सव। इस दिन हनुमान चालीसा पाठ, सुंदरकांड और लाल चोला चढ़ाने का विशेष महत्व है।",
    descEn: "Birthday of Lord Hanuman. Special significance of Hanuman Chalisa, Sundarkand, and vermilion offering.",
    color: "hsl(35 95% 50%)", emoji: "🐒", type: "jayanti", tithi: "चैत्र पूर्णिमा",
  },
  {
    id: "akshayatritiya", nameHi: "अक्षय तृतीया", nameEn: "Akshaya Tritiya", isoDate: "2025-04-30",
    date: "30 अप्रैल 2025", daysLeft: 52, deity: "Vishnu-Lakshmi", deityHi: "विष्णु-लक्ष्मी",
    descHi: "अत्यंत शुभ एवं अक्षय फलदायी दिन। इस दिन सोने की खरीद, नया कार्य आरंभ और दान-पुण्य का विशेष महत्व है।",
    descEn: "Highly auspicious day with eternal merit. Gold purchase, new ventures, and charity are especially blessed.",
    color: "hsl(43 95% 50%)", emoji: "✨", type: "auspicious", tithi: "वैशाख शुक्ल तृतीया",
  },
  {
    id: "buddhapoornima", nameHi: "बुद्ध पूर्णिमा", nameEn: "Buddha Purnima", isoDate: "2025-05-12",
    date: "12 मई 2025", daysLeft: 64, deity: "Buddha", deityHi: "गौतम बुद्ध",
    descHi: "भगवान गौतम बुद्ध की जयंती। वैशाख पूर्णिमा को बुद्ध जन्म, ज्ञान प्राप्ति और महापरिनिर्वाण तीनों हुए।",
    descEn: "Birthday of Lord Gautama Buddha. Vaishakha Purnima marks his birth, enlightenment, and parinirvana.",
    color: "hsl(200 60% 45%)", emoji: "☸️", type: "jayanti", tithi: "वैशाख पूर्णिमा",
  },
  {
    id: "nirjalekadashi", nameHi: "निर्जला एकादशी", nameEn: "Nirjala Ekadashi", isoDate: "2025-06-06",
    date: "6 जून 2025", daysLeft: 89, deity: "Vishnu", deityHi: "भगवान विष्णु",
    descHi: "वर्ष की सबसे महत्वपूर्ण एकादशी। इस दिन निर्जल (बिना पानी) व्रत रखने से सभी एकादशियों का फल मिलता है।",
    descEn: "The most important Ekadashi of the year. Observing a waterless fast grants merit of all 24 Ekadashis.",
    color: "hsl(220 60% 45%)", emoji: "🌊", type: "vrat", tithi: "ज्येष्ठ शुक्ल एकादशी",
  },
  {
    id: "gurupurnima", nameHi: "गुरु पूर्णिमा", nameEn: "Guru Purnima", isoDate: "2025-07-10",
    date: "10 जुलाई 2025", daysLeft: 123, deity: "Guru", deityHi: "गुरु",
    descHi: "गुरु की महिमा का पर्व। आषाढ़ पूर्णिमा को महर्षि वेद व्यास की जयंती और गुरु पूजन का दिन।",
    descEn: "Festival honoring the Guru lineage. Ashadha Purnima marks Maharishi Veda Vyasa's birthday.",
    color: "hsl(43 95% 50%)", emoji: "🙏", type: "tyohar", tithi: "आषाढ़ पूर्णिमा",
  },
  {
    id: "naagrpanchami", nameHi: "नाग पंचमी", nameEn: "Nag Panchami", isoDate: "2025-07-29",
    date: "29 जुलाई 2025", daysLeft: 142, deity: "Shiva-Naag", deityHi: "शिव-नाग",
    descHi: "नाग देवता की पूजा का पर्व। श्रावण शुक्ल पंचमी को नागों की पूजा करने से परिवार की रक्षा होती है।",
    descEn: "Festival of serpent worship. Worshipping Naga Devata on Shravana Shukla Panchami protects the family.",
    color: "hsl(150 50% 38%)", emoji: "🐍", type: "tyohar", tithi: "श्रावण शुक्ल पंचमी",
  },
  {
    id: "rakshabandhan", nameHi: "रक्षा बंधन", nameEn: "Raksha Bandhan", isoDate: "2025-08-09",
    date: "9 अगस्त 2025", daysLeft: 153, deity: "Vishnu", deityHi: "भगवान विष्णु",
    descHi: "भाई-बहन के अटूट प्रेम का पर्व। बहन भाई की कलाई पर राखी बाँधती है और भाई रक्षा का संकल्प लेता है।",
    descEn: "Festival of the unbreakable bond between siblings. Sisters tie Rakhi and brothers pledge protection.",
    color: "hsl(330 65% 55%)", emoji: "🪢", type: "tyohar", tithi: "श्रावण पूर्णिमा",
  },
  {
    id: "janmashtami", nameHi: "जन्माष्टमी", nameEn: "Janmashtami", isoDate: "2025-08-16",
    date: "16 अगस्त 2025", daysLeft: 160, deity: "Krishna", deityHi: "श्री कृष्ण",
    descHi: "भगवान श्री कृष्ण का जन्मोत्सव। भाद्रपद कृष्ण अष्टमी को रात्रि 12 बजे श्री कृष्ण जन्म मनाया जाता है।",
    descEn: "Birthday of Lord Krishna. Midnight celebration of Krishna's birth on Bhadrapada Krishna Ashtami.",
    color: "hsl(220 70% 48%)", emoji: "🪶", type: "jayanti", tithi: "भाद्रपद कृष्ण अष्टमी",
  },
  {
    id: "ganeshchaturthi", nameHi: "गणेश चतुर्थी", nameEn: "Ganesh Chaturthi", isoDate: "2025-08-27",
    date: "27 अगस्त 2025", daysLeft: 171, deity: "Ganesha", deityHi: "श्री गणेश",
    descHi: "भगवान गणेश के जन्मोत्सव का महापर्व। 10 दिन तक चलने वाले इस उत्सव में गणपति की प्रतिष्ठा और विसर्जन होता है।",
    descEn: "Grand festival of Lord Ganesha's birth. 10-day celebration with installation and immersion of Ganesha idol.",
    color: "hsl(35 95% 50%)", emoji: "🐘", type: "tyohar", tithi: "भाद्रपद शुक्ल चतुर्थी",
  },
  {
    id: "navratri-sharad", nameHi: "शारदीय नवरात्रि", nameEn: "Sharad Navratri", isoDate: "2025-09-22",
    date: "22 सितंबर 2025", daysLeft: 197, deity: "Durga", deityHi: "माँ दुर्गा",
    descHi: "माँ दुर्गा के नौ रूपों की पूजा का महापर्व। नौ दिनों तक विभिन्न देवियों का पूजन, व्रत और गरबा होता है।",
    descEn: "Grand festival worshipping nine forms of Goddess Durga. Nine days of puja, fasting, and Garba.",
    color: "hsl(355 75% 35%)", emoji: "🔱", type: "tyohar", tithi: "अश्विन शुक्ल प्रतिपदा",
  },
  {
    id: "dussehra", nameHi: "दशहरा", nameEn: "Dussehra", isoDate: "2025-10-02",
    date: "2 अक्टूबर 2025", daysLeft: 207, deity: "Ram-Durga", deityHi: "श्री राम-दुर्गा",
    descHi: "बुराई पर अच्छाई की विजय का पर्व। इस दिन रावण दहन होता है और माँ दुर्गा की विजय का उत्सव मनाया जाता है।",
    descEn: "Victory of good over evil. Ravana effigy burning and celebration of Goddess Durga's victory.",
    color: "hsl(24 95% 48%)", emoji: "🏹", type: "tyohar", tithi: "अश्विन शुक्ल दशमी",
  },
  {
    id: "karvachauth", nameHi: "करवा चौथ", nameEn: "Karva Chauth", isoDate: "2025-10-10",
    date: "10 अक्टूबर 2025", daysLeft: 215, deity: "Moon-Shiva", deityHi: "चंद्र-शिव",
    descHi: "सुहागिन स्त्रियों का व्रत। पत्नियाँ अपने पति की दीर्घायु के लिए निर्जल व्रत रखती हैं और चंद्रोदय के बाद व्रत तोड़ती हैं।",
    descEn: "Married women's vrat for husband's longevity. Waterless fast broken only after moonrise.",
    color: "hsl(43 95% 50%)", emoji: "🌙", type: "vrat", tithi: "कार्तिक कृष्ण चतुर्थी",
  },
  {
    id: "dhanteras", nameHi: "धनतेरस", nameEn: "Dhanteras", isoDate: "2025-10-20",
    date: "20 अक्टूबर 2025", daysLeft: 225, deity: "Lakshmi-Kuber", deityHi: "लक्ष्मी-कुबेर",
    descHi: "धन और समृद्धि का पर्व। इस दिन सोने-चाँदी और बर्तन खरीदना शुभ माना जाता है। यमराज के लिए दीपदान होता है।",
    descEn: "Festival of wealth and prosperity. Buying gold, silver, and utensils is auspicious. Lamps lit for Yama.",
    color: "hsl(43 95% 50%)", emoji: "💰", type: "tyohar", tithi: "कार्तिक कृष्ण त्रयोदशी",
  },
  {
    id: "diwali", nameHi: "दीपावली", nameEn: "Diwali", isoDate: "2025-10-20",
    date: "20 अक्टूबर 2025", daysLeft: 225, deity: "Lakshmi", deityHi: "माँ लक्ष्मी",
    descHi: "प्रकाश का महापर्व। इस दिन माँ लक्ष्मी और भगवान गणेश की पूजा होती है और दीप जलाकर अमावस्या की रात जगमगाई जाती है।",
    descEn: "Grand festival of lights. Lakshmi and Ganesha puja, lighting countless lamps on the new moon night.",
    color: "hsl(43 95% 50%)", emoji: "🪔", type: "tyohar", tithi: "कार्तिक अमावस्या",
  },
  {
    id: "chhathpuja", nameHi: "छठ पूजा", nameEn: "Chhath Puja", isoDate: "2025-10-28",
    date: "28 अक्टूबर 2025", daysLeft: 233, deity: "Surya", deityHi: "सूर्य देव",
    descHi: "सूर्य देव की उपासना का महापर्व। चार दिनों तक कठिन व्रत, नदी में अर्घ्य और सूर्योदय-सूर्यास्त पूजन होता है।",
    descEn: "Grand festival of Sun worship. Four days of strict fasting, river offerings, and sunrise-sunset puja.",
    color: "hsl(35 95% 50%)", emoji: "☀️", type: "tyohar", tithi: "कार्तिक शुक्ल षष्ठी",
  },
  {
    id: "kartikpurnima", nameHi: "कार्तिक पूर्णिमा", nameEn: "Kartik Purnima", isoDate: "2025-11-05",
    date: "5 नवंबर 2025", daysLeft: 241, deity: "Vishnu-Shiva", deityHi: "विष्णु-शिव",
    descHi: "देव दीपावली का पर्व। इस दिन गंगा स्नान और दीपदान का विशेष महत्व है। तुलसी विवाह भी इसी माह होता है।",
    descEn: "Dev Diwali festival. Sacred Ganga bath and lamp offering hold special significance.",
    color: "hsl(220 60% 45%)", emoji: "🌕", type: "tyohar", tithi: "कार्तिक पूर्णिमा",
  },
  {
    id: "geeta-jayanti", nameHi: "गीता जयंती", nameEn: "Gita Jayanti", isoDate: "2025-12-01",
    date: "1 दिसंबर 2025", daysLeft: 267, deity: "Krishna", deityHi: "श्री कृष्ण",
    descHi: "श्रीमद्भगवद्गीता के प्रकट होने का दिन। मार्गशीर्ष शुक्ल एकादशी को भगवान कृष्ण ने अर्जुन को गीता का उपदेश दिया।",
    descEn: "Day of Bhagavad Gita's revelation. Lord Krishna delivered the Gita teaching to Arjuna on this day.",
    color: "hsl(220 70% 48%)", emoji: "📖", type: "tyohar", tithi: "मार्गशीर्ष शुक्ल एकादशी",
  },
  {
    id: "makar-sankranti", nameHi: "मकर संक्रान्ति", nameEn: "Makar Sankranti", isoDate: "2026-01-14",
    date: "14 जनवरी 2026", daysLeft: 311, deity: "Surya", deityHi: "सूर्य देव",
    descHi: "सूर्य के मकर राशि में प्रवेश का पर्व। इस दिन तिल-गुड़ खाना, पतंग उड़ाना और पवित्र नदियों में स्नान शुभ है।",
    descEn: "Sun's transit into Capricorn. Eating til-gur, flying kites, and holy river bathing are auspicious.",
    color: "hsl(35 95% 50%)", emoji: "🪁", type: "tyohar", tithi: "मकर संक्रान्ति",
  },
  {
    id: "vasantpanchami", nameHi: "वसंत पंचमी", nameEn: "Vasant Panchami", isoDate: "2026-02-02",
    date: "2 फरवरी 2026", daysLeft: 330, deity: "Saraswati", deityHi: "माँ सरस्वती",
    descHi: "माँ सरस्वती की पूजा और वसंत ऋतु के आगमन का पर्व। इस दिन पीले वस्त्र पहनना और विद्या आरंभ करना शुभ है।",
    descEn: "Worship of Goddess Saraswati and arrival of spring. Wearing yellow and beginning education is auspicious.",
    color: "hsl(43 95% 50%)", emoji: "🌼", type: "jayanti", tithi: "माघ शुक्ल पंचमी",
  },
  {
    id: "mahashivratri", nameHi: "महाशिवरात्रि", nameEn: "Maha Shivratri", isoDate: "2026-02-26",
    date: "26 फरवरी 2026", daysLeft: 354, deity: "Shiva", deityHi: "भगवान शिव",
    descHi: "शिव की महान रात। इस रात्रि जागरण करके शिव पूजन, अभिषेक और महामृत्युंजय जाप का विशेष महत्व है।",
    descEn: "Great Night of Shiva. All-night vigil with Shiva puja, abhishek, and Mahamrityunjaya chanting.",
    color: "hsl(270 50% 40%)", emoji: "🔱", type: "tyohar", tithi: "फाल्गुन कृष्ण चतुर्दशी",
  },
];

export interface Bhajan {
  id: string;
  titleHi: string;
  titleEn: string;
  deity: string;
  deityHi: string;
  duration: string;
  category: string;
  firstLineHi: string;
  plays: number;
  isFree: boolean;
}

export const BHAJANS: Bhajan[] = [
  {
    id: "hanuman-chalisa", titleHi: "हनुमान चालीसा", titleEn: "Hanuman Chalisa",
    deity: "Hanuman", deityHi: "हनुमान", duration: "8:30", category: "चालीसा",
    firstLineHi: "श्री गुरु चरन सरोज रज निज मन मुकुरु सुधारि...",
    plays: 1245000, isFree: true,
  },
  {
    id: "om-jai-jagdish", titleHi: "ॐ जय जगदीश हरे", titleEn: "Om Jai Jagdish Hare",
    deity: "Vishnu", deityHi: "विष्णु", duration: "5:20", category: "आरती",
    firstLineHi: "ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे...",
    plays: 980000, isFree: true,
  },
  {
    id: "durga-chalisa", titleHi: "दुर्गा चालीसा", titleEn: "Durga Chalisa",
    deity: "Durga", deityHi: "दुर्गा माँ", duration: "7:15", category: "चालीसा",
    firstLineHi: "नमो नमो दुर्गे सुख करनी। नमो नमो अम्बे दुःख हरनी...",
    plays: 756000, isFree: true,
  },
  {
    id: "shiv-tandav", titleHi: "शिव तांडव स्तोत्रम्", titleEn: "Shiv Tandav Stotram",
    deity: "Shiva", deityHi: "शिव", duration: "6:45", category: "स्तोत्र",
    firstLineHi: "जटाटवीगलज्जलप्रवाहपावितस्थले...",
    plays: 623000, isFree: false,
  },
  {
    id: "ganesh-aarti", titleHi: "गणेश आरती", titleEn: "Ganesh Aarti",
    deity: "Ganesha", deityHi: "गणेश", duration: "4:10", category: "आरती",
    firstLineHi: "जय गणेश जय गणेश जय गणेश देवा...",
    plays: 567000, isFree: true,
  },
  {
    id: "saraswati-vandana", titleHi: "सरस्वती वंदना", titleEn: "Saraswati Vandana",
    deity: "Saraswati", deityHi: "सरस्वती", duration: "3:45", category: "वंदना",
    firstLineHi: "या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता...",
    plays: 432000, isFree: true,
  },
];

export const SUBSCRIPTION_PLANS = [
  {
    id: "basic", nameHi: "बेसिक", nameEn: "Basic",
    priceMonthly: 0, priceYearly: 0,
    questionsPerDay: 2,
    features: {
      hi: ["2 AI प्रश्न/दिन", "दैनिक राशिफल", "पंचांग", "भजन (चुनिंदा)"],
      en: ["2 AI questions/day", "Daily horoscope", "Panchang", "Bhajans (selected)"],
    },
    highlighted: false, badge: null,
  },
  {
    id: "premium", nameHi: "प्रीमियम", nameEn: "Premium",
    priceMonthly: 99, priceYearly: 999,
    questionsPerDay: -1,
    features: {
      hi: ["असीमित AI प्रश्न", "विस्तृत कुंडली", "कुंडली मिलान", "सभी भजन-चालीसा", "वार्षिक राशिफल", "वात/त्यौहार कैलेंडर"],
      en: ["Unlimited AI questions", "Detailed Kundali", "Kundali Matching", "All Bhajans & Chalisa", "Annual horoscope", "Vrat/Festival calendar"],
    },
    highlighted: true, badge: "Most Popular",
  },
  {
    id: "question-pack-10", nameHi: "10 प्रश्न पैक", nameEn: "10 Question Pack",
    priceMonthly: 49, priceYearly: 49,
    questionsPerDay: 0,
    totalQuestions: 10,
    features: {
      hi: ["10 AI प्रश्न", "6 महीने वैध", "GST रसीद"],
      en: ["10 AI questions", "Valid 6 months", "GST receipt"],
    },
    highlighted: false, badge: "₹4.9/सवाल",
  },
  {
    id: "question-pack-50", nameHi: "50 प्रश्न पैक", nameEn: "50 Question Pack",
    priceMonthly: 199, priceYearly: 199,
    questionsPerDay: 0,
    totalQuestions: 50,
    features: {
      hi: ["50 AI प्रश्न", "1 साल वैध", "GST रसीद", "प्राथमिकता उत्तर"],
      en: ["50 AI questions", "Valid 1 year", "GST receipt", "Priority responses"],
    },
    highlighted: false, badge: "₹3.98/सवाल",
  },
];
