/**
 * North Indian style Kundali chart SVG renderer.
 * The classic diamond-grid layout with 12 houses.
 * Houses are fixed; planets placed by rashi.
 */

import { RASHIS } from "@/data/astroData";

export interface PlanetPlacement {
  planet: string;
  planetHi: string;
  house: number; // 1–12
  symbol: string;
}

interface Props {
  ascendant: number; // house index 1–12 (lagna)
  planets: PlanetPlacement[];
  size?: number;
}

// North Indian house positions (center x, center y, width, height as % of viewBox 540x540)
// Fixed house layout — house 1 is top-center diamond, going clockwise
const HOUSE_CELLS: { path: string; labelX: number; labelY: number; planetX: number; planetY: number }[] = [
  // House 1 — top center (lagna)
  {
    path: "M270,20 L400,150 L270,150 L140,150 Z",
    labelX: 270, labelY: 90, planetX: 270, planetY: 130,
  },
  // House 2 — top right
  {
    path: "M400,150 L520,20 L520,150 L520,280 Z",
    labelX: 460, labelY: 165, planetX: 460, planetY: 200,
  },
  // House 3 — right top
  {
    path: "M520,20 L520,150 L400,150 L520,280 Z",
    labelX: 460, labelY: 90, planetX: 460, planetY: 120,
  },
  // House 4 — right center
  {
    path: "M520,280 L400,150 L400,410 L520,280 Z",
    labelX: 460, labelY: 280, planetX: 460, planetY: 270,
  },
  // House 5 — right bottom
  {
    path: "M520,280 L520,410 L400,410 L520,280 Z",
    labelX: 460, labelY: 370, planetX: 460, planetY: 400,
  },
  // House 6 — bottom right
  {
    path: "M400,410 L520,410 L520,540 L270,540 Z",
    labelX: 460, labelY: 460, planetX: 460, planetY: 490,
  },
  // House 7 — bottom center
  {
    path: "M270,390 L140,390 L270,540 L400,390 Z",
    labelX: 270, labelY: 450, planetX: 270, planetY: 420,
  },
  // House 8 — bottom left
  {
    path: "M20,540 L270,540 L140,410 L20,410 Z",
    labelX: 130, labelY: 460, planetX: 115, planetY: 490,
  },
  // House 9 — left bottom
  {
    path: "M20,280 L140,410 L20,410 L20,280 Z",
    labelX: 95, labelY: 370, planetX: 80, planetY: 400,
  },
  // House 10 — left center
  {
    path: "M20,280 L140,150 L140,410 L20,280 Z",
    labelX: 95, labelY: 280, planetX: 80, planetY: 270,
  },
  // House 11 — left top
  {
    path: "M20,150 L140,150 L20,280 L20,150 Z",
    labelX: 95, labelY: 165, planetX: 80, planetY: 195,
  },
  // House 12 — top left
  {
    path: "M20,20 L20,150 L140,150 L270,20 Z",
    labelX: 130, labelY: 90, planetX: 115, planetY: 120,
  },
];

// Corrected, clean North Indian grid using actual intersecting lines
// Using a proper diamond-within-square grid
const HOUSE_DEFS = [
  // H1 - top center triangle (lagna)
  { path: "M270,20 L400,150 L140,150 Z", lx: 270, ly: 100, px: 270, py: 125 },
  // H2 - top right
  { path: "M400,150 L520,20 L520,150 Z", lx: 460, ly: 105, px: 460, py: 130 },
  // H3 - top right outer
  { path: "M520,20 L400,150 L520,150 L520,280 Z", lx: 480, ly: 190, px: 480, py: 215 },
  // H4 - right center triangle
  { path: "M520,280 L400,150 L400,410 Z", lx: 455, ly: 280, px: 455, py: 295 },
  // H5 - bottom right outer
  { path: "M520,280 L400,410 L520,410 L520,280 Z", lx: 480, ly: 365, px: 480, py: 390 },
  // H6 - bottom right
  { path: "M400,410 L520,410 L520,540 Z", lx: 460, ly: 450, px: 460, py: 475 },
  // H7 - bottom center triangle
  { path: "M270,540 L140,410 L400,410 Z", lx: 270, ly: 455, px: 270, py: 435 },
  // H8 - bottom left
  { path: "M140,410 L20,540 L20,410 Z", lx: 108, ly: 450, px: 95, py: 475 },
  // H9 - bottom left outer
  { path: "M20,280 L140,410 L20,410 L20,280 Z", lx: 87, ly: 365, px: 72, py: 390 },
  // H10 - left center triangle
  { path: "M20,280 L140,410 L140,150 Z", lx: 112, ly: 280, px: 112, py: 295 },
  // H11 - top left outer
  { path: "M20,280 L140,150 L20,150 L20,280 Z", lx: 87, ly: 190, px: 72, py: 215 },
  // H12 - top left
  { path: "M140,150 L20,20 L20,150 Z", lx: 108, ly: 105, px: 95, py: 130 },
];

const PLANET_COLORS: Record<string, string> = {
  Su: "hsl(35 95% 45%)",
  Mo: "hsl(220 60% 55%)",
  Ma: "hsl(0 70% 50%)",
  Me: "hsl(120 50% 38%)",
  Ju: "hsl(43 95% 42%)",
  Ve: "hsl(290 55% 48%)",
  Sa: "hsl(240 30% 40%)",
  Ra: "hsl(20 30% 30%)",
  Ke: "hsl(155 35% 32%)",
  As: "hsl(24 95% 48%)",
};

export function NorthIndianChart({ ascendant = 1, planets = [], size = 480 }: Props) {
  // Group planets by house
  const byHouse: Record<number, PlanetPlacement[]> = {};
  for (let i = 1; i <= 12; i++) byHouse[i] = [];
  planets.forEach(p => {
    if (p.house >= 1 && p.house <= 12) byHouse[p.house].push(p);
  });

  // House number label = house index relative to ascendant
  const getHouseNum = (houseIndex: number) => {
    // houseIndex is 0-based position in HOUSE_DEFS
    const rawNum = ((houseIndex - (ascendant - 1) + 12) % 12) + 1;
    return rawNum;
  };

  const rashiAtHouse = (houseIdx: number) => {
    // houseIdx 0-based; ascendant is 1-based rashi index
    const rashiIdx = ((ascendant - 1) + houseIdx) % 12;
    return RASHIS[rashiIdx];
  };

  return (
    <svg
      viewBox="0 0 540 560"
      width={size}
      height={size}
      className="w-full max-w-[480px] mx-auto"
      style={{ filter: "drop-shadow(0 4px 24px hsl(24 95% 48% / 0.2))" }}
    >
      {/* Background */}
      <rect x="0" y="0" width="540" height="560" rx="16" fill="hsl(38 80% 96%)" />
      <rect x="20" y="20" width="500" height="500" rx="8" fill="none" stroke="hsl(24 95% 48%)" strokeWidth="2" />

      {/* Outer border */}
      <rect x="8" y="8" width="524" height="544" rx="14" fill="none" stroke="hsl(43 95% 50%)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />

      {/* Center diamond */}
      <polygon
        points="270,150 400,280 270,410 140,280"
        fill="hsl(43 95% 50% / 0.07)"
        stroke="hsl(24 95% 48%)"
        strokeWidth="1.5"
      />

      {/* Inner diagonal lines forming the grid */}
      <line x1="20" y1="20" x2="270" y2="150" stroke="hsl(24 95% 48%)" strokeWidth="1.2" opacity="0.7" />
      <line x1="520" y1="20" x2="270" y2="150" stroke="hsl(24 95% 48%)" strokeWidth="1.2" opacity="0.7" />
      <line x1="520" y1="520" x2="270" y2="410" stroke="hsl(24 95% 48%)" strokeWidth="1.2" opacity="0.7" />
      <line x1="20" y1="520" x2="270" y2="410" stroke="hsl(24 95% 48%)" strokeWidth="1.2" opacity="0.7" />
      <line x1="140" y1="280" x2="20" y2="20" stroke="hsl(24 95% 48%)" strokeWidth="1.2" opacity="0.7" />
      <line x1="400" y1="280" x2="520" y2="20" stroke="hsl(24 95% 48%)" strokeWidth="1.2" opacity="0.7" />
      <line x1="400" y1="280" x2="520" y2="520" stroke="hsl(24 95% 48%)" strokeWidth="1.2" opacity="0.7" />
      <line x1="140" y1="280" x2="20" y2="520" stroke="hsl(24 95% 48%)" strokeWidth="1.2" opacity="0.7" />

      {/* Draw each house cell */}
      {HOUSE_DEFS.map((cell, idx) => {
        const houseNum = getHouseNum(idx);
        const rashi = rashiAtHouse(idx);
        const planetsHere = byHouse[houseNum] ?? [];
        const isLagna = houseNum === 1;

        return (
          <g key={idx}>
            {/* House fill */}
            <path
              d={cell.path}
              fill={isLagna ? "hsl(24 95% 48% / 0.08)" : "transparent"}
              stroke="none"
            />

            {/* Rashi symbol */}
            <text
              x={cell.lx}
              y={cell.ly - 8}
              textAnchor="middle"
              fontSize="10"
              fill="hsl(20 40% 55%)"
              fontFamily="'Noto Sans Devanagari', sans-serif"
              opacity="0.75"
            >
              {rashi.symbol}
            </text>

            {/* House number */}
            <text
              x={cell.lx}
              y={cell.ly + 5}
              textAnchor="middle"
              fontSize="9"
              fill={isLagna ? "hsl(24 95% 35%)" : "hsl(20 25% 50%)"}
              fontFamily="'Lato', sans-serif"
              fontWeight={isLagna ? "700" : "400"}
              opacity="0.8"
            >
              {houseNum}
            </text>

            {/* Rashi name abbreviated */}
            <text
              x={cell.lx}
              y={cell.ly + 17}
              textAnchor="middle"
              fontSize="7.5"
              fill="hsl(20 40% 45%)"
              fontFamily="'Noto Sans Devanagari', sans-serif"
              opacity="0.7"
            >
              {rashi.nameHi.slice(0, 4)}
            </text>

            {/* Lagna marker */}
            {isLagna && (
              <text
                x={cell.lx}
                y={cell.ly - 18}
                textAnchor="middle"
                fontSize="7"
                fill="hsl(24 95% 40%)"
                fontFamily="'Lato', sans-serif"
                fontWeight="700"
                letterSpacing="1"
              >
                ASC
              </text>
            )}

            {/* Planets */}
            {planetsHere.slice(0, 3).map((pl, pi) => {
              const offX = pi === 0 ? 0 : pi === 1 ? -12 : 12;
              const offY = pi === 0 ? 0 : 11;
              return (
                <text
                  key={pl.planet}
                  x={cell.px + offX}
                  y={cell.py + offY}
                  textAnchor="middle"
                  fontSize="10"
                  fill={PLANET_COLORS[pl.planet] ?? "hsl(20 40% 30%)"}
                  fontFamily="'Lato', sans-serif"
                  fontWeight="700"
                >
                  {pl.planet}
                </text>
              );
            })}
          </g>
        );
      })}

      {/* Center decoration */}
      <text x="270" y="272" textAnchor="middle" fontSize="18" fill="hsl(24 95% 48%)" opacity="0.25">ॐ</text>
      <text x="270" y="292" textAnchor="middle" fontSize="8" fill="hsl(20 40% 45%)" fontFamily="'Noto Sans Devanagari', sans-serif" opacity="0.5">
        दिव्य ज्योति
      </text>
    </svg>
  );
}
