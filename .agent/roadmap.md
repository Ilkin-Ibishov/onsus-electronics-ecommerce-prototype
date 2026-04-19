# Technical Overview: Onsus eCommerce Clone

## Stack
- **Framework**: Next.js 13 (App Router)
- **Database/Auth**: Supabase
- **Styling**: Tailwind CSS
- **Components**: Radix UI, Lucide React, Shadcn/UI (partial)
- **State Management**: React Context (`CartContext`, `LanguageContext`)

## Key Patterns
- **i18n**: Client-side context using `lib/translations.ts`. Database fields are suffixed with `_en`, `_az`, `_ru`.
- **Data Fetching**: Server-side fetching in Page components with client-side hydration for stateful elements (Cart, Auth).
- **Styling**: Utility-first CSS with Tailwind. Custom animations via `tailwindcss-animate`.

---

# Development Roadmap

## Phase 1: Supabase & Core Logic (Current)
- [ ] Connect Supabase client with local env.
- [ ] Implement search, filter, and pagination logic in `lib/supabase.ts`.
- [ ] Enable Supabase Auth for user sign-in/up.
- [ ] Persist Cart and Wishlist to `localStorage` or Database.

## Phase 2: Storefront Expansion
- [ ] Implement dynamic routing for `/shop`.
- [ ] Build `/products/[id]` detail pages with image gallery and reviews.
- [ ] Create `/categories/[slug]` filtered views.

## Phase 3: Checkout & Accounts
- [ ] Build functional Checkout flow.
- [ ] User profile page with order history.
- [ ] Address management.

## Phase 4: Polish & Performance
- [ ] SEO audit and optimization.
- [ ] Performance tuning (Image optimization, Caching).
- [ ] Multi-currency support (USD/EUR toggle logic).
