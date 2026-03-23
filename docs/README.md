# Divya Jyoti — Project Documentation

**Divya Jyoti** (दिव्य ज्योति) is a comprehensive Hindu spiritual and Vedic astrology platform built with React, Vite, TypeScript, Tailwind CSS, and Lovable Cloud.

The application provides Panchang, Rashifal (horoscopes), Kundali generation, Kundali matching, an AI-powered Vedic astrologer, festival calendars, temple guides, bhajans, vrat information, and articles — all with bilingual Hindi/English support.

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Tech stack, project structure, provider hierarchy, auth flow, edge functions, database schema |
| [PAGES.md](./PAGES.md) | Page-by-page breakdown — route, data source, static vs dynamic classification |
| [DATA-LOGIC.md](./DATA-LOGIC.md) | Business logic deep-dive — Panchang, Kundali, Ashtakoot, AI credits, i18n |
| [DYNAMIC-ROADMAP.md](./DYNAMIC-ROADMAP.md) | Roadmap for converting static sections to database-driven dynamic content |

---

## Quick Start

```bash
npm install
npm run dev
```

## Key URLs

| Route | Page |
|-------|------|
| `/` | Homepage |
| `/panchang` | Daily Panchang |
| `/horoscope` | Rashifal (12 rashis) |
| `/ai-astrologer` | AI Vedic Astrologer (requires login) |
| `/kundali` | Kundali Generator |
| `/kundali-matching` | Ashtakoot Kundali Matching |
| `/festivals` | Hindu Festival Calendar |
| `/temples` | Famous Temples Guide |
| `/bhajans` | Bhajan Collection |
| `/vrat` | Vrat & Upvas Guide |
| `/articles` | Spiritual Articles |
| `/profile` | User Profile & Credits |
