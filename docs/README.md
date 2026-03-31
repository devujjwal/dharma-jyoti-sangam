# Divya Jyoti — Project Documentation

**Divya Jyoti** (दिव्य ज्योति) is a production-ready Hindu spiritual and Vedic astrology platform built with React 18, Vite 5, TypeScript, Tailwind CSS, shadcn/ui, and Lovable Cloud.

All content is **fully dynamic and admin-managed** via a database-backed CMS. The application provides Panchang, Rashifal (horoscopes), Kundali generation, Kundali matching, an AI-powered Vedic astrologer, festival calendars, temple guides, bhajans, vrat information, and articles — all with bilingual Hindi/English support.

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Tech stack, project structure, provider hierarchy, auth flow, edge functions, database schema, admin panel |
| [PAGES.md](./PAGES.md) | Page-by-page breakdown — route, data source, dynamic classification |
| [DATA-LOGIC.md](./DATA-LOGIC.md) | Business logic deep-dive — Panchang, Kundali, Ashtakoot, AI credits, i18n, content sanitization |

---

## Quick Start

```bash
npm install
npm run dev
```

## Key URLs

### Public Pages

| Route | Page |
|-------|------|
| `/` | Homepage |
| `/panchang` | Daily Panchang (AI-generated, cached) |
| `/horoscope` | Rashifal — 12 Rashi Grid |
| `/horoscope/:rashiId` | Rashi Detail (AI-generated daily horoscope) |
| `/ai-astrologer` | AI Vedic Astrologer (requires login) |
| `/kundali` | Kundali Generator |
| `/kundali-matching` | Ashtakoot Kundali Matching |
| `/festivals` | Hindu Festival Calendar (DB-driven) |
| `/festivals/:slug` | Festival Detail |
| `/temples` | Famous Temples Directory (DB-driven) |
| `/temples/:slug` | Temple Detail |
| `/bhajans` | Bhajan & Chalisa Collection (DB-driven) |
| `/vrat` | Vrat & Upvas Guide (DB-driven) |
| `/articles` | Spiritual Articles (DB-driven) |
| `/articles/:slug` | Article Detail |
| `/subscribe` | Subscription Plans (DB-driven, payment coming soon) |
| `/profile` | User Profile, Credits & Saved Data |
| `/contact` | Contact Form (submissions saved to DB) |

### Admin Panel (requires `super_admin` or `editor` role)

| Route | Page |
|-------|------|
| `/admin` | Dashboard with content counts |
| `/admin/festivals` | Manage Festivals |
| `/admin/articles` | Manage Articles |
| `/admin/temples` | Manage Temples |
| `/admin/bhajans` | Manage Bhajans |
| `/admin/vrats` | Manage Vrats |
| `/admin/plans` | Manage Subscription Plans |
| `/admin/contacts` | Manage Contact Submissions |
| `/admin/settings` | Site Settings (key-value) |
| `/admin/panchang` | Panchang Cache Viewer |

### Static Pages

| Route | Page |
|-------|------|
| `/about` | About |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/ads-policy` | Ads Policy |
| `/support` | Support |
