# Complete Architecture Guide

## How the Gospel Music Platform Works

### 1. Data Flow Architecture

```
User Request
    ↓
Next.js Page Component ('use client')
    ↓
Fetch API Route (/api/...)
    ↓
API Route Handler (calls db-actions)
    ↓
Database Actions (/lib/db-actions.ts)
    ↓
Mock Data (/lib/mock-data.ts) [or real database]
    ↓
Response → Component → Render UI
```

### 2. Type System

**Central Type Definitions** (`/types/index.ts`):
```typescript
Song {
  id: string
  title: string
  artist_name: string
  featured_artist?: string | null
  language?: string
  lyrics?: string
  view_count: number
  created_at: string
}

Artist {
  id: string
  name: string
  bio?: string
  genre: string
  verified: boolean
  image_url?: string
  email?: string
  phone?: string
  website?: string
  social_links?: {
    instagram?: string
    facebook?: string
    whatsapp?: string
  }
  founded_year?: number
  songs_count?: number
  followers?: number
  songs?: Song[]
}

NewsArticle {
  id: string
  title: string
  excerpt?: string
  content: string
  category?: string
  featured?: boolean
  published_date: string
}

StudioLead {
  id: string
  artist_name: string
  email: string
  phone?: string
  service_type: string
  genre?: string
  budget?: number | null
  description?: string
  timeline?: string
  status?: string
}

StudioService {
  id: string
  name: string
  description: string
  price?: number
  duration?: string
  features?: string[]
}

SearchResult {
  songs: Song[]
  artists: Artist[]
  news: NewsArticle[]
}
```

### 3. Database Actions Layer

**Purpose**: Single source of truth for all data operations

**Pattern**:
```typescript
export async function functionName(params): Promise<ReturnType> {
  // Logic here
  return result
}
```

**All Functions Are**:
- Explicitly exported (no default export)
- Async (return Promises)
- Properly typed with TypeScript
- Implement filtering, sorting, pagination
- Ready to swap with database queries

### 4. API Routes

**Convention**: All routes call db-actions functions

**Pattern for GET**:
```typescript
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const param = searchParams.get('name')
  
  const data = await dbAction(options)
  
  return NextResponse.json({
    success: true,
    data: data,
    pagination: { limit, offset }
  })
}
```

**Pattern for POST/PATCH**:
```typescript
export async function POST(request: NextRequest) {
  const data = await request.json()
  
  // Validate
  if (!required) {
    return NextResponse.json(
      { success: false, error: 'Missing fields' },
      { status: 400 }
    )
  }
  
  const result = await dbAction(data)
  
  return NextResponse.json({
    success: true,
    data: result
  })
}
```

### 5. Component Structure

**SongCard**:
```typescript
interface Props {
  song: Song
}

// Displays song with view count, artist link
// Navigates to /lyrics/[id]
```

**ArtistCard**:
```typescript
interface Props {
  artist: Artist
}

// Displays artist with verification badge
// Navigates to /artists/[id]
```

**MultiStepForm**:
- 3-step booking form
- Calls createStudioLead()
- Uses secondary color scheme

### 6. Page Structure

**Home Page** (`/`):
- Hero section with search
- Featured songs (trending)
- Featured artists (verified)
- Services overview
- News section
- CTA

**Lyrics Directory** (`/lyrics`):
- List all songs
- Filter by language
- Sort by trending/recent
- Pagination
- Links to detail page

**Song Detail** (`/lyrics/[id]`):
- Full lyrics display
- Artist information with link
- View counter increment
- Share buttons
- Copy functionality

**Artists Directory** (`/artists`):
- List all artists
- Filter by verification status
- Search functionality
- Pagination
- Links to detail page

**Artist Profile** (`/artists/[id]`):
- Artist bio and links
- Social media connections
- List of songs
- Contact information
- Verified badge

**News Listing** (`/news`):
- List articles by date
- Featured articles first
- Category filtering
- Pagination
- Links to detail page

**News Detail** (`/news/[id]`):
- Full article content
- Publication date
- Category tag
- Related articles

**Studio Services** (`/studio`):
- Service packages overview
- Multi-step booking form
- WhatsApp contact integration

**Search** (`/search`):
- Query from URL parameter
- Results grouped by type:
  - Songs
  - Artists
  - News
- Uses unified search API

### 7. API Endpoints Reference

**Songs**
- `GET /api/songs?limit=10&offset=0&sort=trending&language=en&search=term`
- `PATCH /api/songs` (increment view count)
- `GET /api/songs/[id]`

**Artists**
- `GET /api/artists?limit=10&offset=0&verified=true&search=term`
- `GET /api/artists/[id]`

**News**
- `GET /api/news?limit=10&offset=0&search=term`
- `GET /api/news/[id]`

**Search**
- `GET /api/search?q=query`

**Studio**
- `POST /api/studio` (submit booking)
- `GET /api/studio?limit=10&offset=0`

### 8. State Management

**No Global State Needed** (currently):
- Each page manages its own state with `useState`
- Data fetched from API routes
- Could add Redux/Zustand for complex state later

**Example Pattern**:
```typescript
const [songs, setSongs] = useState<Song[]>([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
  const fetch = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/endpoint')
      const data = await res.json()
      setSongs(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  fetch()
}, [])
```

### 9. Adding New Features

**Example: Add a new endpoint**

1. **Add to db-actions**:
```typescript
export async function getNewFeature(options) {
  // Implementation
  return result
}
```

2. **Create API route** (`/api/feature/route.ts`):
```typescript
export async function GET(request: NextRequest) {
  const data = await getNewFeature(options)
  return NextResponse.json({ success: true, data })
}
```

3. **Use in component**:
```typescript
const [data, setData] = useState([])
useEffect(() => {
  fetch('/api/feature')
    .then(res => res.json())
    .then(json => setData(json.data))
}, [])
```

### 10. Migration to Database

**Step 1**: Update `/lib/db-actions.ts`
```typescript
import { createServerClient } from '@/lib/supabase-server'

export async function getSongs() {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('songs')
    .select('*')
  return data
}
```

**Step 2**: Install dependencies
```bash
npm install @supabase/supabase-js
```

**Step 3**: Set environment variables
```
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_KEY=xxx
```

**Everything else remains the same!**
- API routes don't change
- Components don't change
- Types don't change
- Only db-actions implementation changes

### 11. Error Handling Patterns

**API Route**:
```typescript
try {
  const data = await dbAction()
  return NextResponse.json({ success: true, data })
} catch (error) {
  console.error('[v0] Error:', error)
  return NextResponse.json(
    { success: false, error: 'Failed to fetch' },
    { status: 500 }
  )
}
```

**Component**:
```typescript
try {
  const res = await fetch('/api/endpoint')
  if (!res.ok) throw new Error('API error')
  const data = await res.json()
  setData(data.data)
} catch (error) {
  console.error('[v0] Error:', error)
  setError(error.message)
}
```

### 12. Performance Considerations

**Currently Implemented**:
- Pagination on all list endpoints
- Server-side filtering and sorting
- Optimized component rendering
- No unnecessary re-renders

**Future Optimizations**:
- Add Redis caching layer
- Implement ISR (Incremental Static Regeneration)
- Add image optimization
- Implement service workers
- Add database indexes

### 13. File Organization

```
/app
  /api - API routes
  /lyrics - Songs pages
  /artists - Artist pages
  /news - News pages
  /studio - Services pages
  /search - Search page
  /about - Static pages
  layout.tsx - Root layout

/components
  - Reusable UI components
  - Cards for data display
  - Forms

/lib
  db-actions.ts - Data operations
  mock-data.ts - Sample data
  types.ts - (DEPRECATED, use /types)
  utils.ts - Helper functions

/types
  index.ts - Centralized type definitions

/public
  robots.txt - SEO
  favicon files
```

### 14. Testing the API

**Test GET endpoint**:
```bash
curl http://localhost:3000/api/songs?limit=5
```

**Test POST endpoint**:
```bash
curl -X POST http://localhost:3000/api/studio \
  -H "Content-Type: application/json" \
  -d '{"artist_name":"Test","email":"test@test.com",...}'
```

### 15. Debugging Tips

**Enable debug logging**:
```typescript
console.log('[v0] Debug message:', variable)
```

**Check browser DevTools**:
- Network tab - see API responses
- Console - see error messages
- React DevTools - inspect component state

**Check server logs**:
- Terminal running `npm run dev`
- Shows API errors and server-side logs

---

**This architecture ensures clean code, easy maintenance, and simple database migration when needed.**
