# L1st.ai - Smart Shopping Lists

A frontend-only Next.js application for intelligent shopping list management. Upload images of your fridge, receipts, or recipes, and let AI extract products automatically. The system learns your shopping patterns to optimize future lists.

## Features

- **User Authentication**: Secure login/registration with mock backend
- **Mobile App Downloads**: Dedicated page for iOS and Android apps
- **AI-Assisted Extraction**: Upload images and automatically extract products
- **Credit-Based System**: Cost-effective at 5 credits per image
- **Learning Algorithm**: Lists reorder based on your shopping behavior after 2+ trips
- **Shop Mode**: Fullscreen, distraction-free shopping experience
- **Offline-First**: All data persists to localStorage

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state management)
- React Dropzone
- Lucide React (icons)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Application Flow

1. **Landing Page**: Learn about features, access Download page or Launch App
2. **Authentication**: Register/login to access the web app
3. **Download Page**: View mobile app information and download links
4. **Upload Images**: Select type (fridge/receipt/recipe) and upload
5. **Pick List**: Review extracted products, add to shopping list
6. **Shopping List**: View optimized list (learns from your patterns)
7. **Shop Mode**: Check off items while shopping, save trip data

## Design Philosophy

- Monochromatic color scheme (whites, grays, blacks)
- System fonts only
- Minimal animations
- Mobile-first responsive design
- High accessibility standards

## Project Structure

```
/app
  /app           - Protected application routes (requires auth)
  /download      - Mobile app download page
  page.tsx       - Landing page with auth modals
/components      - Reusable UI components (includes auth modals)
/store          - Zustand state management (with auth)
/types          - TypeScript type definitions
/lib            - Utilities, mock data, and auth helpers
```

## Mock Implementation

This is a frontend-only demo using mock implementations:

**Mock AI Processing:**
1. Replace `mockAIExtraction` in `lib/mockData.ts` with actual API calls
2. Update Zustand store actions to include API mutations

**Mock Authentication:**
1. Replace `mockLogin` and `mockRegister` in `lib/mockAuth.ts` with real API calls
2. Update auth actions in Zustand store
3. Add JWT tokens or session management
4. Implement proper password hashing (currently plain text for demo)

## License

MIT

## Notes

- All data is stored in localStorage (including user credentials)
- Mock authentication stores passwords in plain text (demo only - NOT production-ready)
- 100 starting credits per user (demo purposes)
- Learning algorithm activates after 2+ shopping trips
- All `/app/*` routes are protected and require authentication
- No backend or database required for demo
