# Dynamic Content Roadmap

This document lists sections currently using hardcoded/static data that could be converted to database-driven dynamic content.

---

## Priority Matrix

| # | Section | Effort | Impact | Priority |
|---|---------|--------|--------|----------|
| 1 | Horoscope Detail Text | Low | High | 🔥 Quick Win |
| 2 | Panchang API | Medium | High | 🔥 High |
| 3 | Festivals | Low | Medium | ⚡ Medium |
| 4 | Articles CMS | Medium | Medium | ⚡ Medium |
| 5 | Temples | Medium | Medium | ⚡ Medium |
| 6 | Bhajans Audio | Medium | High | ⚡ Medium |
| 7 | Vrat Calendar | Medium | Medium | 📋 Normal |
| 8 | Payments | High | High | 📋 Normal |
| 9 | Contact Form | Low | Low | 📋 Normal |

---

## 1. Horoscope Detail Text — 🔥 Quick Win

**Current**: `/horoscope/:rashiId` displays `RASHIS[].todayHi` / `todayEn` — hardcoded prediction text.

**Opportunity**: The `daily_horoscopes` table **already exists** with AI-generated daily content per rashi. The `DailyHoroscope` homepage widget already uses it.

**Implementation**:
- In `HoroscopePage.tsx`, when `rashiId` param is present, query `daily_horoscopes` for today's content
- Fall back to static text if no DB entry exists
- Estimated effort: **~1 hour**

---

## 2. Panchang — Real API Integration

**Current**: `getTodayPanchang()` uses `day % array.length` rotation — not astronomically accurate.

**Options**:
- **Prokerala Panchang API** — Indian astrology API with tithi, nakshatra, yoga, karana, sunrise/sunset by location
- **VedicRishi API** — Comprehensive Vedic astrology data
- **Open-source Swiss Ephemeris** — Astronomical computation library (would need a backend function)

**Implementation**:
- Create an edge function that calls the API with user's location/date
- Cache results in a `panchang_cache` table (key: `date + location`)
- Frontend calls edge function instead of `getTodayPanchang()`
- Add geolocation for auto-detecting user's city
- Estimated effort: **~1-2 days**

---

## 3. Festivals — Database-Driven

**Current**: `UPCOMING_FESTIVALS` array with hardcoded 2025-2026 dates.

**Problems**: Dates expire, manual updates needed yearly, no admin interface.

**Implementation**:
- Create `festivals` table: `id, name_hi, name_en, date, description_hi, description_en, significance, category, image_url`
- Admin interface or edge function to seed/manage festival data
- Auto-calculate `daysLeft` from DB date
- Support multiple years, recurring festivals
- Estimated effort: **~1 day**

---

## 4. Articles — CMS-Style

**Current**: Hardcoded array in `ArticlesPage.tsx`.

**Implementation**:
- Create `articles` table: `id, title_hi, title_en, content_hi, content_en, category, author, published_at, image_url, slug`
- Rich text content (store as markdown or HTML)
- Category/tag filtering from DB
- Pagination for large article sets
- Optional: Admin editor page for content management
- Estimated effort: **~2 days**

---

## 5. Temples — Database + User Content

**Current**: ~9 temples hardcoded in `TemplesPage.tsx`.

**Implementation**:
- Create `temples` table: `id, name_hi, name_en, location, deity, description_hi, description_en, latitude, longitude, image_url, category`
- Add user reviews/ratings: `temple_reviews` table
- Photo gallery using file storage
- Map integration with GPS coordinates
- Estimated effort: **~2 days**

---

## 6. Bhajans — Audio Streaming

**Current**: 6 bhajans with text only, bookmarking is dynamic.

**Implementation**:
- Move bhajan data to `bhajans` table
- Upload audio files to file storage
- Audio player component with play/pause, progress, volume
- Play count tracking, recently played
- Lyrics display with auto-scroll
- Estimated effort: **~2-3 days**

---

## 7. Vrat Calendar — Panchang-Linked

**Current**: Static list of vrat information.

**Implementation**:
- Create `vrats` table linking vrat types to tithi/nakshatra conditions
- When Panchang becomes dynamic (item #2), auto-calculate upcoming vrat dates
- Push notifications for upcoming vrats (requires service worker)
- Estimated effort: **~1-2 days** (depends on Panchang API)

---

## 8. Payment Integration

**Current**: `SubscribePage.tsx` shows plans but has no payment processing.

**Options**:
- **Razorpay** — Popular in India, supports UPI, cards, net banking
- **Stripe** — International support, Lovable has native Stripe integration

**Implementation**:
- Create `subscriptions` table: `user_id, plan, status, started_at, expires_at, payment_id`
- Edge function for payment verification webhook
- On successful payment → add AI credits to `profiles.ai_credits`
- Log in `credit_transactions` with `type: "purchase"`
- Estimated effort: **~3-4 days**

---

## 9. Contact Form — Database + Notifications

**Current**: Static contact page with no form submission.

**Implementation**:
- Create `contact_submissions` table: `id, name, email, subject, message, created_at, status`
- Edge function to send email notification on submission
- Admin view to manage/respond to submissions
- Estimated effort: **~half day**

---

## Architecture Notes

When converting static → dynamic, follow this pattern:

```
1. Create DB table via migration
2. Add RLS policies (public read for content, auth for user-specific data)
3. Seed initial data from existing static arrays
4. Update page component to query DB (useQuery + supabase.from().select())
5. Keep static data as fallback during transition
6. Remove static data once DB is stable
```
