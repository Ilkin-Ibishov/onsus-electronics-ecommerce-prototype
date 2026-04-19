# Advanced UI Libraries & Tool Explorations

To achieve visual and functional parity with the reference site, the following tools and implementation patterns have been identified for Phase 4.

## 1. Carousels & Sliders (Swiper.js)
The reference site uses high-performance sliders for the Hero section and "Flash Sales".
- **Implementation Strategy**: Integrate `swiper/react`.
- **Key Modules**: `Autoplay`, `Pagination`, `Navigation`, `Thumbs` (for product galleries).
- **Benefit**: Smooth touch support and responsive breakpoints.

## 2. Animations (Framer Motion)
Subtle entrance animations and hover transitions make the site feel premium.
- **Implementation Strategy**: Wrap components in `<motion.div>`.
- **Usage**:
  - `AnimatePresence` for search suggestion dropdowns.
  - Layout transitions for the "Shop" view (Grid to List).
  - Spring-based hover scales on product cards.

## 3. Accessible Primitives (Radix UI)
The navigation and sidebar require robust accessible components.
- **Currently Using**: Partially implemented via `headlessui` or custom logic.
- **Recommended Migration**: Standardize on Radix UI (or `@shadcn/ui` components built on Radix) for:
  - `NavigationMenu` (Mega Menu logic).
  - `Slider` (Price range filtering).
  - `Dialog` (Quick View Modal).

## 4. Search Engine (Custom Predictive logic)
The reference search includes thumbnails and category scoping.
- **Pattern**: Debounced Supabase search querying both `products` and `categories`.
- **UI**: Absolute positioned dropdown with `z-index` management and "Focus" tracking.

## 5. Comparison Engine (State Coordination)
Tracking products for comparison across sessions.
- **Pattern**: `CartContext` expansion to handle `comparisonItems`.
- **UI**: Bottom-fixed "Drawer" component that slides up when items are added.
