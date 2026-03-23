import { useState } from "react";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Temple {
  id: string;
  nameHi: string;
  nameEn: string;
  locationHi: string;
  locationEn: string;
  deityHi: string;
  deityEn: string;
  descHi: string;
  descEn: string;
  emoji: string;
  state: string;
  type: string;
}

const TEMPLES: Temple[] = [
  { id: "kedarnath", nameHi: "केदारनाथ मंदिर", nameEn: "Kedarnath Temple", locationHi: "उत्तराखंड", locationEn: "Uttarakhand", deityHi: "भगवान शिव", deityEn: "Lord Shiva", descHi: "बारह ज्योतिर्लिंगों में से एक, हिमालय में स्थित अत्यंत पवित्र शिव धाम।", descEn: "One of the twelve Jyotirlingas, an extremely sacred Shiva shrine in the Himalayas.", emoji: "🏔️", state: "Uttarakhand", type: "Jyotirlinga" },
  { id: "tirupati", nameHi: "तिरुपति बालाजी", nameEn: "Tirupati Balaji", locationHi: "आंध्र प्रदेश", locationEn: "Andhra Pradesh", deityHi: "भगवान वेंकटेश्वर", deityEn: "Lord Venkateswara", descHi: "विश्व का सबसे अमीर और सबसे अधिक दर्शनार्थियों वाला हिंदू मंदिर।", descEn: "The richest and most visited Hindu temple in the world.", emoji: "🛕", state: "Andhra Pradesh", type: "Vaishnavite" },
  { id: "varanasi", nameHi: "काशी विश्वनाथ", nameEn: "Kashi Vishwanath", locationHi: "वाराणसी, उत्तर प्रदेश", locationEn: "Varanasi, Uttar Pradesh", deityHi: "भगवान शिव", deityEn: "Lord Shiva", descHi: "बारह ज्योतिर्लिंगों में से एक, गंगा के तट पर स्थित सबसे प्राचीन शिव मंदिर।", descEn: "One of the twelve Jyotirlingas, the most ancient Shiva temple on the banks of Ganga.", emoji: "🔱", state: "Uttar Pradesh", type: "Jyotirlinga" },
  { id: "jagannath", nameHi: "जगन्नाथ मंदिर", nameEn: "Jagannath Temple", locationHi: "पुरी, ओडिशा", locationEn: "Puri, Odisha", deityHi: "भगवान जगन्नाथ", deityEn: "Lord Jagannath", descHi: "चार धामों में से एक, प्रसिद्ध रथ यात्रा के लिए विख्यात।", descEn: "One of the Char Dham, famous for the grand Rath Yatra.", emoji: "🎪", state: "Odisha", type: "Char Dham" },
  { id: "somnath", nameHi: "सोमनाथ मंदिर", nameEn: "Somnath Temple", locationHi: "गुजरात", locationEn: "Gujarat", deityHi: "भगवान शिव", deityEn: "Lord Shiva", descHi: "प्रथम ज्योतिर्लिंग, कई बार विनाश और पुनर्निर्माण का प्रतीक।", descEn: "The first Jyotirlinga, a symbol of destruction and reconstruction many times.", emoji: "🌊", state: "Gujarat", type: "Jyotirlinga" },
  { id: "meenakshi", nameHi: "मीनाक्षी मंदिर", nameEn: "Meenakshi Temple", locationHi: "मदुरै, तमिलनाडु", locationEn: "Madurai, Tamil Nadu", deityHi: "देवी मीनाक्षी", deityEn: "Goddess Meenakshi", descHi: "दक्षिण भारत का सबसे प्रसिद्ध द्रविड़ शैली का मंदिर, अद्भुत गोपुरम के लिए विख्यात।", descEn: "South India's most famous Dravidian-style temple, renowned for its stunning gopurams.", emoji: "🌺", state: "Tamil Nadu", type: "Shakti Peeth" },
  { id: "golden-temple", nameHi: "स्वर्ण मंदिर", nameEn: "Golden Temple", locationHi: "अमृतसर, पंजाब", locationEn: "Amritsar, Punjab", deityHi: "श्री गुरु ग्रंथ साहिब", deityEn: "Sri Guru Granth Sahib", descHi: "सिख धर्म का सबसे पवित्र स्थान, सोने से मढ़ा हुआ अद्वितीय मंदिर।", descEn: "The holiest shrine of Sikhism, uniquely adorned with gold.", emoji: "✨", state: "Punjab", type: "Gurudwara" },
  { id: "badrinath", nameHi: "बद्रीनाथ मंदिर", nameEn: "Badrinath Temple", locationHi: "उत्तराखंड", locationEn: "Uttarakhand", deityHi: "भगवान विष्णु", deityEn: "Lord Vishnu", descHi: "चार धामों में से एक, हिमालय में स्थित भगवान विष्णु का पवित्र धाम।", descEn: "One of the Char Dham, a sacred abode of Lord Vishnu in the Himalayas.", emoji: "⛰️", state: "Uttarakhand", type: "Char Dham" },
  { id: "siddhivinayak", nameHi: "सिद्धिविनायक मंदिर", nameEn: "Siddhivinayak Temple", locationHi: "मुंबई, महाराष्ट्र", locationEn: "Mumbai, Maharashtra", deityHi: "श्री गणेश", deityEn: "Lord Ganesha", descHi: "मुंबई का सबसे प्रसिद्ध गणेश मंदिर, मनोकामना पूर्ण करने के लिए विख्यात।", descEn: "Mumbai's most famous Ganesha temple, renowned for fulfilling wishes.", emoji: "🐘", state: "Maharashtra", type: "Ganesh Temple" },
];

const TemplesPage = () => {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState("all");

  const states = ["all", ...Array.from(new Set(TEMPLES.map(t => t.state)))];

  const filtered = TEMPLES.filter(t => {
    const matchesSearch = search === "" ||
      t.nameHi.includes(search) || t.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      t.locationHi.includes(search) || t.locationEn.toLowerCase().includes(search.toLowerCase());
    const matchesState = filterState === "all" || t.state === filterState;
    return matchesSearch && matchesState;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <div className="py-10 border-b border-border" style={{ background: "var(--gradient-sacred)" }}>
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full text-4xl mb-4" style={{ background: "hsl(var(--primary-foreground) / 0.15)" }}>🛕</div>
            <h1 className="text-3xl md:text-4xl font-devanagari-serif font-bold text-primary-foreground mb-2">
              {isHi ? "मंदिर निर्देशिका" : "Temple Directory"}
            </h1>
            <p className="text-primary-foreground/75 font-devanagari text-sm max-w-xl mx-auto">
              {isHi ? "भारत के प्रमुख तीर्थ स्थल और मंदिर" : "Major pilgrimage sites and temples of India"}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={isHi ? "मंदिर खोजें..." : "Search temples..."} className="pl-10 font-devanagari" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {states.map(s => (
                <button key={s} onClick={() => setFilterState(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-devanagari font-medium transition-colors border ${filterState === s ? "border-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/50"}`}
                  style={filterState === s ? { background: "var(--gradient-saffron)" } : {}}>
                  {s === "all" ? (isHi ? "सभी" : "All") : s}
                </button>
              ))}
            </div>
          </div>

          {/* Temple Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(temple => (
              <div key={temple.id} className="card-sacred rounded-2xl border border-border bg-card overflow-hidden">
                <div className="h-1.5 w-full" style={{ background: "var(--gradient-saffron)" }} />
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: "hsl(var(--primary) / 0.1)" }}>
                      {temple.emoji}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-devanagari-serif font-bold text-foreground text-base leading-tight">{isHi ? temple.nameHi : temple.nameEn}</h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-devanagari">{isHi ? temple.locationHi : temple.locationEn}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full font-devanagari font-medium" style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
                      {isHi ? temple.deityHi : temple.deityEn}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-devanagari">{temple.type}</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-devanagari leading-relaxed line-clamp-3">{isHi ? temple.descHi : temple.descEn}</p>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-devanagari">{isHi ? "कोई मंदिर नहीं मिला" : "No temples found"}</p>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default TemplesPage;
