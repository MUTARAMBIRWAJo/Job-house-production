# JOB HOUSE PRODUCTION - Gospel Music Platform

A comprehensive platform for gospel music in Rwanda featuring artist profiles, lyrics management, studio services, and community engagement.

## Features

- **Gospel Lyrics Database**: Browse and search for gospel songs in Kinyarwanda and English
- **Artist Directory**: Discover verified gospel artists and their music
- **Studio Services**: Book professional recording, mixing, and mastering services
- **News & Updates**: Stay updated with gospel music industry news
- **Artist Profiles**: Detailed profiles with artist bio, songs, and contact information
- **Search Functionality**: Full-text search across songs, artists, and news
- **Responsive Design**: Mobile-first design for all devices
- **SEO Optimized**: Sitemaps, meta tags, and structured data for better search visibility

## Tech Stack

- **Frontend**: Next.js 16 with React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **Data**: Mock data (easily replaceable with database)
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Deployment**: Vercel-ready

## Project Structure

```
├── app/
│   ├── page.tsx                 # Home page
│   ├── layout.tsx               # Root layout with nav/footer
│   ├── globals.css              # Global styles with design tokens
│   ├── (pages)/
│   │   ├── lyrics/              # Lyrics listing and detail pages
│   │   ├── artists/             # Artist directory and profiles
│   │   ├── news/                # News articles
│   │   ├── studio/              # Studio services booking
│   │   ├── search/              # Search results
│   │   ├── about/               # About page
│   │   ├── contact/             # Contact form
│   │   ├── privacy/             # Privacy policy
│   │   └── terms/               # Terms of service
│   └── api/
│       ├── songs/               # Songs API endpoints
│       ├── artists/             # Artists API endpoints
│       ├── news/                # News API endpoints
│       ├── studio/              # Studio services API
│       └── feed/                # RSS feed
│
├── components/
│   ├── Navbar.tsx               # Navigation bar
│   ├── Footer.tsx               # Footer
│   ├── SongCard.tsx             # Song display card
│   ├── ArtistCard.tsx           # Artist display card
│   ├── MultiStepForm.tsx        # Studio booking form
│   ├── VerifiedBadge.tsx        # Verified artist badge
│   ├── WhatsAppButton.tsx       # WhatsApp contact button
│   └── ui/                      # shadcn/ui components
│
├── lib/
│   ├── mock-data.ts             # Sample data
│   ├── types.ts                 # TypeScript interfaces
│   ├── utils.ts                 # Utility functions
│   ├── utils-custom.ts          # Custom utilities
│   ├── supabase-client.ts       # Supabase client (optional)
│   ├── supabase-server.ts       # Supabase server (optional)
│   └── db-actions.ts            # Database actions (optional)
│
├── public/
│   └── robots.txt               # SEO robots file
│
└── scripts/
    ├── supabase-schema.sql      # Database schema (optional)
    └── database-functions.sql   # Database functions (optional)
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd job-house-production
```

2. Install dependencies
```bash
pnpm install
```

3. Run the development server
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

### Environment Variables

Currently, the application uses mock data and doesn't require environment variables. To enable Supabase integration:

1. Add Supabase credentials to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

2. Update API routes to use database instead of mock data
3. Run the SQL migrations from `scripts/`

### Design System

The application uses a Navy & Gold color scheme:

- **Primary**: Deep Navy (#001f3f)
- **Secondary**: Gold (#D4AF37)
- **Neutrals**: White, Grays, Black variants

Design tokens are defined in `app/globals.css` for easy customization.

## API Endpoints

### Songs
- `GET /api/songs` - List all songs with pagination
- `GET /api/songs/[id]` - Get song details
- `POST /api/songs` - Increment view count

### Artists
- `GET /api/artists` - List all artists with filters
- `GET /api/artists/[id]` - Get artist details with songs

### News
- `GET /api/news` - List news articles
- `GET /api/news/[id]` - Get article details

### Studio Services
- `GET /api/studio` - List available services
- `POST /api/studio` - Submit studio request

### Feed
- `GET /api/feed` - RSS feed of news articles

## Pages

### Public Pages
- `/` - Home page with hero, featured content, and CTA
- `/lyrics` - Gospel lyrics directory with search
- `/lyrics/[id]` - Lyrics detail page with full song text
- `/artists` - Artist directory with filtering
- `/artists/[id]` - Artist profile with songs and contact
- `/news` - Gospel music news articles
- `/news/[id]` - Article detail page
- `/studio` - Studio services booking with multi-step form
- `/search` - Search results page
- `/about` - About company page
- `/contact` - Contact form
- `/privacy` - Privacy policy
- `/terms` - Terms of service

## Features Explained

### Multi-Step Form
The studio booking form uses React state management with validation and error handling.

### Search Functionality
Full-text search across songs, artists, and news with real-time filtering.

### Responsive Design
Mobile-first approach with breakpoints for tablet and desktop.

### SEO
- Dynamic sitemap generation
- RSS feed for news
- Meta tags and Open Graph
- Structured heading hierarchy

## Customization

### Adding New Content
1. Update mock data in `lib/mock-data.ts`
2. Or connect to a database by updating API routes

### Styling
- Modify colors in `tailwind.config.ts`
- Update design tokens in `app/globals.css`
- Use Tailwind classes directly in components

### Adding Pages
1. Create new directory in `app/`
2. Add `page.tsx` component
3. Update navbar links if needed

## Building for Production

```bash
pnpm build
pnpm start
```

## Deployment

The application is optimized for Vercel:

1. Connect your GitHub repository to Vercel
2. Vercel will auto-detect Next.js configuration
3. Deploy with a single push to main branch

## Future Enhancements

- [ ] User authentication and accounts
- [ ] Favorite/bookmark functionality
- [ ] Collaboration messaging system
- [ ] Artist analytics dashboard
- [ ] Payment integration for studio services
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Dark/light theme toggle
- [ ] Community comments and reviews
- [ ] Social sharing optimization

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software of JOB HOUSE PRODUCTION.

## Support

For support, email: support@jobhouseproduction.com

---

**Built with ❤️ for Gospel Music in Rwanda**
