# Quick Start Guide - JOB HOUSE PRODUCTION

Get the gospel music platform running in 5 minutes!

## Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm (pnpm recommended)

## Installation & Running

### 1. Install Dependencies (30 seconds)
```bash
pnpm install
```

### 2. Start Development Server (10 seconds)
```bash
pnpm dev
```

### 3. Open in Browser
Visit: http://localhost:3000

**That's it! The platform is now running with full mock data.**

## What You Can Try Right Now

### Navigate & Explore
- **Home Page**: See featured songs, artists, and services
- **Lyrics Page** (`/lyrics`): Browse 6 gospel songs
- **Artists Page** (`/artists`): View 4 artist profiles
- **News Page** (`/news`): Read 5 gospel music news articles

### Test Features
- **Search**: Use the search bar to find songs or artists
- **Song Details**: Click any song to see full lyrics
- **Artist Profiles**: Click any artist to view their bio and songs
- **Contact Form**: Try the contact page (`/contact`)
- **Studio Booking**: Fill out the multi-step form at `/studio`

### Mobile Preview
- Open DevTools (F12)
- Click the device toggle icon
- Resize to see responsive design

## Common Tasks

### Add New Songs
Edit `lib/mock-data.ts`:
```typescript
export const mockSongs = [
  {
    id: '7',
    title: 'Your Song Title',
    artist_name: 'Artist Name',
    language: 'Kinyarwanda',
    lyrics: `Your lyrics here...`,
    view_count: 0,
    created_at: '2024-02-26',
  },
  // ... add more songs
]
```

### Add New Artists
Edit `lib/mock-data.ts`:
```typescript
export const mockArtists = [
  {
    id: '5',
    name: 'New Artist',
    bio: 'Artist biography...',
    genre: 'Gospel',
    verified: false,
    // ... add other fields
  },
  // ... add more artists
]
```

### Change Colors (Navy & Gold Theme)
Edit `app/globals.css`:
```css
:root {
  --primary: 215 100% 12%;      /* Deep Navy */
  --secondary: 50 100% 50%;     /* Gold */
  /* ... other colors ... */
}
```

### Modify Navigation Links
Edit `components/Navbar.tsx`:
```typescript
const navItems = [
  { label: 'Home', href: '/' },
  { label: 'New Page', href: '/new-page' },
  // ... add your links
]
```

## File Structure Overview

```
📁 app/
  📄 page.tsx ..................... Home page
  📁 lyrics/ ...................... Songs pages
  📁 artists/ ..................... Artist pages
  📁 news/ ........................ News pages
  📁 studio/ ...................... Studio booking
  📁 api/ ......................... API endpoints

📁 components/
  📄 Navbar.tsx ................... Navigation
  📄 Footer.tsx ................... Footer
  📄 SongCard.tsx ................. Song display
  📄 ArtistCard.tsx ............... Artist display

📁 lib/
  📄 mock-data.ts ................. All sample data
  📄 utils-custom.ts .............. Helper functions
  📄 types.ts ..................... TypeScript types

📁 public/
  📄 robots.txt ................... SEO robots file
```

## Key Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build for production
pnpm start                  # Start production server
pnpm lint                   # Check code quality

# Development Tools
pnpm dev --turbo           # Use Turbopack (faster)
```

## Connecting to Database (Future)

When ready to use a real database:

1. **Set up Supabase** (or your database)
2. **Add environment variables** to `.env.local`
3. **Uncomment database code** in API routes
4. **Run SQL migrations** from `scripts/` folder
5. **Update mock data** calls to database calls

## Troubleshooting

### Port 3000 Already in Use
```bash
pnpm dev -- -p 3001        # Use different port
```

### Node Modules Issues
```bash
rm -rf node_modules
pnpm install
```

### Build Errors
```bash
pnpm clean                   # Clear build cache
pnpm install                 # Reinstall
pnpm build                   # Try building again
```

## Useful Resources

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Shadcn/UI**: https://ui.shadcn.com
- **TypeScript**: https://www.typescriptlang.org

## Customization Tips

### Change Logo Text
In `components/Navbar.tsx`:
```jsx
<div className="text-sm font-bold text-primary">YOUR TEXT</div>
```

### Add Social Links
In `components/Footer.tsx`:
```jsx
<a href="https://instagram.com/yourpage">Instagram</a>
```

### Update Company Info
Edit throughout:
- `app/about/page.tsx` - Company description
- `app/contact/page.tsx` - Contact details
- `app/layout.tsx` - SEO metadata

### Add Custom Fonts
In `app/layout.tsx`:
```typescript
import { YourFont } from 'next/font/google'

const yourFont = YourFont({ subsets: ['latin'] })
```

## Next Steps

1. **Explore the code** - Read comments and understand structure
2. **Try editing** - Change colors, text, add new content
3. **Test features** - Try all pages and interactions
4. **Customize** - Make it your own!
5. **Deploy** - Push to GitHub and deploy to Vercel

## Deploy to Vercel (1 Click)

1. Push your code to GitHub
2. Visit https://vercel.com
3. Click "New Project"
4. Select your repository
5. Click "Deploy"

Done! Your site is live.

## Get Help

- **Issues**: Check the code comments
- **Stuck?**: Review PLATFORM_SUMMARY.md
- **Questions?**: Visit Next.js Discord community

---

**Happy coding! 🚀**

Questions? Check PLATFORM_SUMMARY.md for detailed information.
