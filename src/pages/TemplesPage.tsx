import { useState, useCallback } from "react";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTemples } from "@/hooks/use-temples";
import { MapPin, Search, Loader2, Navigation as NavIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const TemplesPage = () => {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const { data: temples, isLoading } = useTemples();

  const states = ["all", ...Array.from(new Set((temples || []).map(t => t.state).filter(Boolean) as string[]))];
  const types = ["all", ...Array.from(new Set((temples || []).map(t => t.type).filter(Boolean) as string[]))];

  const handleNearMe = useCallback(() => {
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoadingLocation(false);
        toast({ title: isHi ? "स्थान मिला" : "Location found" });
      },
      () => {
        setLoadingLocation(false);
        toast({ title: isHi ? "स्थान नहीं मिला" : "Location not available", variant: "destructive" });
      },
      { timeout: 10000 }
    );
  }, [isHi]);

  let filtered = (temples || []).filter(t => {
    const matchSearch = !search || t.name_hi.includes(search) || t.name_en.toLowerCase().includes(search.toLowerCase());
    const matchState = filterState === "all" || t.state === filterState;
    const matchType = filterType === "all" || t.type === filterType;
    return matchSearch && matchState && matchType;
  });

  // Sort by distance if user location is available
  if (userLocation) {
    filtered = [...filtered].sort((a, b) => {
      const distA = a.latitude && a.longitude ? haversine(userLocation.lat, userLocation.lng, Number(a.latitude), Number(a.longitude)) : Infinity;
      const distB = b.latitude && b.longitude ? haversine(userLocation.lat, userLocation.lng, Number(b.latitude), Number(b.longitude)) : Infinity;
      return distA - distB;
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <div className="py-10 border-b border-border" style={{ background: "var(--gradient-sacred)" }}>
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full text-4xl mb-4" style={{ background: "hsl(var(--primary-foreground) / 0.15)" }}>🛕</div>
            <h1 className="text-3xl md:text-4xl font-devanagari-serif font-bold text-primary-foreground mb-2">{isHi ? "मंदिर निर्देशिका" : "Temple Directory"}</h1>
            <p className="text-primary-foreground/75 font-devanagari text-sm max-w-xl mx-auto">{isHi ? "भारत के प्रमुख तीर्थ स्थल और मंदिर" : "Major pilgrimage sites and temples of India"}</p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 max-w-5xl">
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
          {isLoading ? <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" /></div> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(temple => (
                <Link key={temple.id} to={`/temples/${temple.slug}`} className="card-sacred rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30">
                  <div className="h-1.5 w-full" style={{ background: "var(--gradient-saffron)" }} />
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: "hsl(var(--primary) / 0.1)" }}>{temple.emoji || "🛕"}</div>
                      <div className="min-w-0">
                        <h3 className="font-devanagari-serif font-bold text-foreground text-base leading-tight">{isHi ? temple.name_hi : temple.name_en}</h3>
                        <div className="flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3 text-muted-foreground" /><span className="text-xs text-muted-foreground font-devanagari">{temple.city}{temple.state ? `, ${temple.state}` : ""}</span></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {(temple.deity_hi || temple.deity_en) && <span className="text-xs px-2 py-0.5 rounded-full font-devanagari font-medium" style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>{isHi ? temple.deity_hi : temple.deity_en}</span>}
                      {temple.type && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-devanagari">{temple.type}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground font-devanagari leading-relaxed line-clamp-3">{isHi ? (temple.short_description_hi || temple.description_hi) : (temple.short_description_en || temple.description_en)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {!isLoading && !filtered.length && <div className="text-center py-12"><p className="text-muted-foreground font-devanagari">{isHi ? "कोई मंदिर नहीं मिला" : "No temples found"}</p></div>}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default TemplesPage;
