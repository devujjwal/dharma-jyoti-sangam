# 🚀 Divya Jyoti — Launch Readiness Checklist

## BLOCKERS (Must fix before launch)

- [x] **RLS: credit_transactions** — Remove user INSERT policy (privilege escalation fix)
- [x] **RLS: Tighten public→authenticated** — bookmarked_bhajans, saved_kundalis, credit_transactions, profiles
- [x] **HIBP password protection** — Enable leaked password checking
- [x] **Admin noindex** — Prevent search engines from indexing /admin routes
- [x] **BhajanPlayer forwardRef** — Fix console warning for function component refs
- [x] **Global search fix** — Fixed RPC function (sort_rank alias, subquery wrapping)
- [x] **Share buttons** — Added to festival and vrat detail pages

## NON-BLOCKERS (Should fix, not launch-blocking)

### Security
- [x] Content sanitization via DOMPurify on all admin-generated HTML
- [x] ErrorBoundary wrapping entire app
- [ ] Rate limiting for contact form (consider edge function proxy)
- [ ] Premium bhajan content gating when audio_url exists for is_free=false items
- [ ] CAPTCHA/honeypot for contact form spam prevention

### SEO
- [x] useSeo hook with title, description, canonical, OG, Twitter cards
- [x] JSON-LD structured data (Article, HinduTemple, Event)
- [x] Dynamic XML sitemap via edge function
- [x] Admin routes noindex via useEffect
- [x] Breadcrumb component on detail pages
- [ ] Verify all pages have unique meta descriptions (content team task)

### Performance
- [x] Admin routes lazy-loaded
- [x] TempleMap lazy-loaded within detail pages
- [x] React Query stale times configured per entity
- [x] Image loading with graceful fallbacks
- [ ] Consider image CDN/optimization for user-uploaded images

### Admin Quality
- [x] ContentQualityBar with missing field/translation warnings
- [x] Auto slug generation (AdminSlugField)
- [x] AI Editor Assistant for bilingual content
- [x] Bulk translate support
- [ ] Add "last reviewed at" field for evergreen content freshness tracking

### User Experience
- [x] Hindi/English bilingual support throughout
- [x] Dark mode support
- [x] Mobile-responsive at 375px
- [x] Share buttons on all detail pages
- [x] Global search (⌘K/Ctrl+K)
- [x] Personalized dashboard for logged-in users
- [x] Reminder system for festivals and vrats
- [x] PWA installability (manifest.json)

### Infrastructure
- [x] Automated daily horoscope generation (pg_cron)
- [x] Panchang cache pre-warming
- [x] AI astrologer with streaming and conversation history
- [ ] Set up error monitoring service (Sentry/equivalent)
- [ ] Configure custom domain
- [ ] Set up Razorpay when ready for payments

## POST-LAUNCH

- [ ] Analytics integration
- [ ] A/B testing for key conversion flows
- [ ] Push notification delivery for reminders
- [ ] Offline bhajan playback (PWA service worker)
- [ ] Multi-city Panchang pre-warming expansion
