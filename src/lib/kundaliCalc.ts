/**
 * Simplified Vedic astrology calculations.
 * Uses approximate tropical-to-sidereal conversion (Lahiri ayanamsha).
 * For production, use a full Jyotish ephemeris library.
 */

import { PlanetPlacement } from "@/components/NorthIndianChart";

// Rashi IDs in order (0 = Mesh/Aries ... 11 = Meen/Pisces)
export const RASHI_ORDER = [
  "mesh", "vrishabh", "mithun", "kark",
  "singh", "kanya", "tula", "vrishchik",
  "dhanu", "makar", "kumbh", "meen",
];

// Approximate planet mean longitude offsets (degrees, epoch J2000)
// These are simplified for demo; real apps need Swiss Ephemeris
function julianDay(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate() + (date.getUTCHours() + date.getUTCMinutes() / 60) / 24;
  const A = Math.floor((14 - m) / 12);
  const Y = y + 4800 - A;
  const M = m + 12 * A - 3;
  return d + Math.floor((153 * M + 2) / 5) + 365 * Y + Math.floor(Y / 4)
    - Math.floor(Y / 100) + Math.floor(Y / 400) - 32045;
}

function lahiriAyanamsha(jd: number): number {
  // Simplified Lahiri ayanamsha approximation
  const T = (jd - 2451545.0) / 36525.0;
  return 23.85 + 0.01396 * T;
}

interface PlanetData {
  planet: string;
  planetHi: string;
  symbol: string;
  // mean motion degrees/day
  meanMotion: number;
  // mean longitude at J2000 (degrees)
  l0: number;
}

const PLANETS: PlanetData[] = [
  { planet: "Su", planetHi: "सूर्य",  symbol: "☀",  meanMotion: 0.9856,   l0: 280.46 },
  { planet: "Mo", planetHi: "चंद्र",  symbol: "☽",  meanMotion: 13.1764,  l0: 218.32 },
  { planet: "Ma", planetHi: "मंगल",  symbol: "♂",  meanMotion: 0.5240,   l0: 355.45 },
  { planet: "Me", planetHi: "बुध",   symbol: "☿",  meanMotion: 4.0923,   l0: 168.65 },
  { planet: "Ju", planetHi: "बृहस्पति", symbol: "♃", meanMotion: 0.0831,  l0: 34.40  },
  { planet: "Ve", planetHi: "शुक्र",  symbol: "♀",  meanMotion: 1.6021,   l0: 212.50 },
  { planet: "Sa", planetHi: "शनि",   symbol: "♄",  meanMotion: 0.0335,   l0: 49.94  },
];

function mod360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function longToRashi(deg: number): number {
  // Returns 0-based rashi index (0=Mesh ... 11=Meen)
  return Math.floor(deg / 30) % 12;
}

export interface KundaliResult {
  ascendant: number;       // 1-based rashi (1=Mesh ... 12=Meen)
  ascendantName: string;   // rashi id
  planets: PlanetPlacement[];
  rahuKetu: { rahuHouse: number; ketuHouse: number };
  lagnaHouseNum: number;   // always 1
}

export function calculateKundali(
  dob: string, // "YYYY-MM-DD"
  tob: string, // "HH:MM"
  pob: string, // city name (unused in simplified calc, kept for API future)
): KundaliResult {
  const [year, month, day] = dob.split("-").map(Number);
  const [hour, minute] = tob.split(":").map(Number);

  const birthDate = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const jd = julianDay(birthDate);
  const ayanamsha = lahiriAyanamsha(jd);
  const T = jd - 2451545.0; // days since J2000

  // Calculate planet sidereal longitudes
  const placements: PlanetPlacement[] = PLANETS.map((pd) => {
    const tropLong = mod360(pd.l0 + pd.meanMotion * T);
    const sidLong = mod360(tropLong - ayanamsha);
    const rashiIdx = longToRashi(sidLong);
    return {
      planet: pd.planet,
      planetHi: pd.planetHi,
      symbol: pd.symbol,
      // house = rashi index + 1 (before ascendant adjustment — adjusted later)
      house: rashiIdx + 1,
    };
  });

  // Approximate lagna (ascendant) using sidereal time + birth time
  // Simplified: use sun position + time offset
  const sunLong = mod360(280.46 + 0.9856 * T - ayanamsha);
  const timeOffset = (hour + minute / 60) / 24;
  const lagnaLong = mod360(sunLong + timeOffset * 360 + (day * 13.17) + (month * 28.5));
  const lagnaRashiIdx = longToRashi(lagnaLong);
  const ascendantRashi = lagnaRashiIdx + 1; // 1-based

  // Re-map planet houses relative to ascendant
  const planetsMapped: PlanetPlacement[] = placements.map(p => {
    const house = ((p.house - ascendantRashi + 12) % 12) + 1;
    return { ...p, house };
  });

  // Rahu/Ketu (mean nodes, always opposite)
  const rahuMeanLong = mod360(125.04 - 0.052954 * T - ayanamsha);
  const rahuRashi = longToRashi(rahuMeanLong) + 1;
  const rahuHouse = ((rahuRashi - ascendantRashi + 12) % 12) + 1;
  const ketuHouse = ((rahuHouse - 1 + 6) % 12) + 1;

  planetsMapped.push(
    { planet: "Ra", planetHi: "राहु", symbol: "☊", house: rahuHouse },
    { planet: "Ke", planetHi: "केतु", symbol: "☋", house: ketuHouse },
  );

  return {
    ascendant: ascendantRashi,
    ascendantName: RASHI_ORDER[lagnaRashiIdx],
    planets: planetsMapped,
    rahuKetu: { rahuHouse, ketuHouse },
    lagnaHouseNum: 1,
  };
}

export const PLANET_LABELS: Record<string, { hi: string; full: string }> = {
  Su: { hi: "सूर्य", full: "Sun" },
  Mo: { hi: "चंद्र", full: "Moon" },
  Ma: { hi: "मंगल", full: "Mars" },
  Me: { hi: "बुध", full: "Mercury" },
  Ju: { hi: "बृहस्पति", full: "Jupiter" },
  Ve: { hi: "शुक्र", full: "Venus" },
  Sa: { hi: "शनि", full: "Saturn" },
  Ra: { hi: "राहु", full: "Rahu" },
  Ke: { hi: "केतु", full: "Ketu" },
};
