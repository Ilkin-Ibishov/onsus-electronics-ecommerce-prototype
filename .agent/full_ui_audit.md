# Full UI/UX Audit: Local vs. Reference (onsusnextjs)

This document outlines the problems and mismatches found during a simultaneous side-by-side review of `http://localhost:3001` and `https://onsusnextjs.vercel.app/`.

## 🏛️ Architectural Mismatches

### 1. Home Page Structure
- **Reference**: The "All Departments" sidebar is **fixed and visible** on the left side of the Home Page (1/4 width layout). It only becomes a popover on other pages.
- **Local**: The sidebar is always a popover triggered by the NavBar button.
- **Impact**: High. The fixed sidebar is a hallmark of the Onsus "Showroom" look.

### 2. Mobile Bottom Navigation
- **Reference**: Persistent bottom navigation bar containing (Shop, Account, Search, Wishlist, Cart).
- **Local**: Missing. Standard mobile hamburger menu only.
- **Impact**: Medium (Critical for Mobile UX).

---

## 🎨 Visual Fidelity Gaps

### 1. Header & Components
| Feature | Reference Style | Local App Problem | Priority |
| :--- | :--- | :--- | :--- |
| **Search Button** | Circular, Deep Red Circle icon | Rectangular, Orange | Low |
| **Category Selector** | Semi-transparent background, red accent | Bordered box, grey accent | Low |
| **Sticky Transition** | Aggressive height reduction, logo shrink | Simple fixed positioning | Medium |

### 2. Product Presentation Cards
- **Mismatch**: **Action Icons** (Eye, Heart, etc.) in reference are vertically aligned on the right of the image area with a semi-transparent background. Local icons are top-right.
- **Mismatch**: **Badge Style**. Reference uses "SALE 20%" badges in a rounded-pill format. Local uses square-rounded badges.
- **Missing**: **Stock Status Bar** on all items (not just Deal of Day). Reference shows small "In Stock" dots.

---

## 🛠️ Functional Gaps

### 1. Search Intelligence
- **Mismatch**: Reference results dropdown includes **Categories** and **Popular Searches** in addition to Products.
- **Local**: Only shows Products.

### 2. Sidebars (Cart/Wishlist)
- **Problem**: Local drawers use basic CSS transitions. Reference uses highly polished **Framer Motion** "Spring" animations with a blurred backdrop.

---

## 📍 Actionable Recommendations

1.  **Harden Home Layout**: Move the "All Departments" to a fixed sidebar on the homepage and adjust the Hero/Grid width to compensate.
2.  **Style Alignment**: Update the search button to the circular red icon and refine the product card action bar placement.
3.  **Animation Polish**: Use Framer Motion for the Cart/Wishlist drawers to match the "Premium" feel.
4.  **Mobile Polish**: Implement the persistent mobile bottom nav.

---

*Audit Date: 2026-04-18*
