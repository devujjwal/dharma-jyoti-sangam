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
  date: string;
  daysLeft: number;
  deity: string;
  deityHi: string;
  descHi: string;
  descEn: string;
  color: string;
  emoji: string;
}

export const UPCOMING_FESTIVALS: Festival[] = [
  {
    id: "holi", nameHi: "होली", nameEn: "Holi",
    date: "14 मार्च 2025", daysLeft: 5, deity: "Krishna", deityHi: "श्री कृष्ण",
    descHi: "रंगों का त्यौहार, बुराई पर अच्छाई की विजय का प्रतीक",
    descEn: "Festival of colors, symbolizing victory of good over evil",
    color: "hsl(330 70% 55%)", emoji: "🎨",
  },
  {
    id: "ramnavami", nameHi: "राम नवमी", nameEn: "Ram Navami",
    date: "6 अप्रैल 2025", daysLeft: 28, deity: "Ram", deityHi: "श्री राम",
    descHi: "भगवान राम का जन्मोत्सव, चैत्र शुक्ल नवमी",
    descEn: "Birthday of Lord Rama, Chaitra Shukla Navami",
    color: "hsl(24 95% 48%)", emoji: "🏹",
  },
  {
    id: "hanumanjayanti", nameHi: "हनुमान जयंती", nameEn: "Hanuman Jayanti",
    date: "12 अप्रैल 2025", daysLeft: 34, deity: "Hanuman", deityHi: "श्री हनुमान",
    descHi: "हनुमान जी का जन्मोत्सव, बल और भक्ति का प्रतीक",
    descEn: "Birthday of Lord Hanuman, symbol of strength and devotion",
    color: "hsl(35 95% 50%)", emoji: "🐒",
  },
  {
    id: "akshayatritiya", nameHi: "अक्षय तृतीया", nameEn: "Akshaya Tritiya",
    date: "30 अप्रैल 2025", daysLeft: 52, deity: "Vishnu-Lakshmi", deityHi: "विष्णु-लक्ष्मी",
    descHi: "शुभ एवं अक्षय फलदायी दिन, सोने की खरीद शुभ",
    descEn: "Eternally auspicious day, gold purchase considered lucky",
    color: "hsl(43 95% 50%)", emoji: "✨",
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
