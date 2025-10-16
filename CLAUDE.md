# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

L1st.ai is a frontend-only Next.js application for smart shopping list management. Users can upload images (fridge, receipts, recipes), extract products via mock AI, curate shopping lists, and use a fullscreen shop mode. The system learns from shopping patterns to optimize list order over time.

**Tech Stack:**
- Next.js 14+ (App Router)
- TypeScript (strict mode)
- Tailwind CSS (monochromatic/neutral design)
- Zustand with persist middleware
- React Dropzone
- Lucide React icons

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# Opens at http://localhost:3000

# Build for production
npm run build

# Start production server
npm start

# Type checking
npx tsc --noEmit
```

## Architecture

### Directory Structure

```
/app                    # Next.js App Router pages
  /app                  # Application routes (protected)
    /upload            # Image upload page
    /picklist          # Product selection page
    /shopping-list     # Shopping list view
    /shop-mode         # Fullscreen shopping interface
  /download            # Mobile app download page
  layout.tsx           # Root layout
  page.tsx             # Landing page with auth modals
  globals.css          # Global styles with animations

/components            # Reusable UI components
  Button.tsx           # Button with variants (primary, secondary, ghost)
  Input.tsx            # Form input with label and error states
  Checkbox.tsx         # Checkbox with sizes (md, lg)
  Modal.tsx            # Modal with focus trap
  Header.tsx           # App header (landing + nav, app + user menu)
  ProductCard.tsx      # Expandable product card
  LoginModal.tsx       # Login form modal
  RegisterModal.tsx    # Registration form modal

/store                 # Zustand state management
  index.ts             # Global store with persist middleware

/types                 # TypeScript type definitions
  index.ts             # All application types (including User)

/lib                   # Utility functions
  mockData.ts          # Mock products and AI extraction
  mockAuth.ts          # Mock authentication helpers
  authGuard.ts         # Auth protection hook for routes
  learningAlgorithm.ts # Shopping pattern learning logic
```

### State Management (Zustand)

The application uses a single Zustand store with localStorage persistence:

**State:**
- `products`: Array of all products
- `uploadedImages`: Uploaded but not yet processed images
- `shoppingTrips`: Historical shopping trips for learning
- `credits`: User credits (starts at 100)
- `isShopMode`: Boolean for shop mode state
- `user`: Current authenticated user (or null)
- `isAuthenticated`: Boolean authentication status

**Actions:**
- Product management: `addProduct`, `updateProduct`, `deleteProduct`
- Shopping list: `toggleProductInList`, `checkOffProduct`
- Images: `addImage`, `removeImage`
- Learning: `addShoppingTrip`
- Credits: `useCredits`
- Authentication: `login`, `register`, `logout`, `checkAuth`

**Persistence:** All state automatically saves to localStorage under key `l1st-storage`

### User Flow

1. **Landing Page (/)**: Marketing page with hero, features, how-it-works, navigation to Download page and Launch App (requires auth)
2. **Authentication**: Register or login via modals (email/password, 6+ chars), mock validation stored in localStorage
3. **Download Page (/download)**: Mobile app info, App Store/Google Play links, feature comparison table, FAQ
4. **Upload (/app/upload)** [Protected]: Select image type (fridge/receipt/recipe), upload images, process for 5 credits each
5. **Pick List (/app/picklist)** [Protected]: Review AI-extracted products, add/remove from shopping list, manual entry
6. **Shopping List (/app/shopping-list)** [Protected]: View curated list, reordered by learning algorithm after 2+ trips
7. **Shop Mode (/app/shop-mode)** [Protected]: Fullscreen mode with large checkboxes, tracks check-off order

### Learning Algorithm

Located in `lib/learningAlgorithm.ts`:

- Requires minimum 2 shopping trips to activate
- Calculates average check-off order for each product across all trips
- Sorts shopping list by learned patterns
- Products without history appear at the end
- Displays "List optimized based on your shopping patterns" indicator when active

### Mock AI Processing

Located in `lib/mockData.ts`:

- Simulates 2-second processing delay
- Returns different product sets based on image type:
  - **Fridge**: Dairy and cold items (milk, cheese, eggs, butter)
  - **Receipt**: Mixed groceries (bread, chicken, tomatoes, spinach, bananas)
  - **Recipe**: Ingredients and pantry items (pasta, olive oil, garlic, parmesan, basil)

### Design System

**Colors (Monochromatic):**
- Background: White (#ffffff)
- Text: Near-black (#1a1a1a)
- Border: Light gray (#e5e5e5)
- Accent: Medium gray (#4a5568)

**Typography:**
- System fonts only (no custom fonts)
- Font sizes: sm (14px), base (16px), lg (18px), xl (20px), 2xl (24px)

**Components:**
- 8px border radius
- Subtle shadows on hover
- Minimal animations (fade, slide, zoom)
- Mobile-first responsive design

### Key Implementation Details

**Shop Mode Completion Flow:**
- When all items checked, show completion modal
- Save shopping trip with check-off order data
- Clear checked state on exit
- Confirmation dialog if exiting with unchecked items

**Credits System:**
- Displayed in app header (top right)
- Each image costs 5 credits
- Check available credits before processing
- Alert if insufficient credits

**Responsive Breakpoints:**
- Mobile: Single column, large touch targets (min 44x44px)
- Tablet (md): 2 columns where appropriate
- Desktop (lg): 3-4 columns, max-width containers

### Future Backend Integration

The app is designed to easily connect to a real API:
- Mock AI extraction in `lib/mockData.ts` can be replaced with actual API calls
- All data structures (Product, ShoppingTrip, etc.) are API-ready
- Zustand store actions can be updated to include API mutations
- Authentication can be added to the store and headers

### Authentication System

**Mock Implementation (No Real Backend):**
- User credentials stored in localStorage under key `l1st-users`
- Login validates email/password against stored users
- Register creates new user if email doesn't exist
- Password minimum 6 characters, email format validation
- Session persists via Zustand persist middleware
- All `/app/*` routes protected with `useAuthGuard()` hook

**Auth Flow:**
1. User clicks "Get Started" or "Launch App" on homepage
2. Shows Register modal (Get Started) or Login modal (Launch App)
3. After successful auth, redirects to `/app/upload`
4. User menu appears in app header (name, email, logout)
5. Logout redirects to homepage

**Components:**
- `LoginModal`: Email/password form with error handling
- `RegisterModal`: Email/password/name form with error handling
- `useAuthGuard()`: Hook that redirects to `/` if not authenticated

### Important Notes

- All data persists to localStorage (no backend/database)
- Mock AI extraction has a 2-second delay to simulate processing
- Mock authentication stores passwords in plain text (demo only)
- Learning algorithm only activates after 2+ shopping trips
- Design is intentionally minimal (no colors, no custom branding)
- Type safety is enforced throughout (strict TypeScript)
- Accessibility: ARIA labels, keyboard navigation, focus management
