import { MetadataRoute } from 'next'
import { getSongs, getArtists, getNews } from '@/lib/server/db-actions'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://jobhouseproduction.com'

  // Static pages
  const staticPages = [
    { url: `${baseUrl}`, changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/lyrics`, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/artists`, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/news`, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/studio`, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/store`, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'yearly' as const, priority: 0.5 },
    { url: `${baseUrl}/terms`, changeFrequency: 'yearly' as const, priority: 0.5 },
  ]

  // Fetch dynamic content from database
  const [songs, artists, news] = await Promise.all([
    getSongs({ limit: 100 }),
    getArtists({ limit: 100 }),
    getNews({ limit: 50 })
  ])

  // Dynamic pages
  const songPages = songs.map((song) => ({
    url: `${baseUrl}/lyrics/${song.id}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    lastModified: new Date(song.created_at),
  }))

  const artistPages = artists.map((artist) => ({
    url: `${baseUrl}/artists/${artist.id}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    lastModified: new Date(artist.created_at),
  }))

  const newsPages = news.map((article) => ({
    url: `${baseUrl}/news/${article.id}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    lastModified: new Date(article.published_at || article.created_at),
  }))

  return [
    ...staticPages,
    ...songPages,
    ...artistPages,
    ...newsPages,
  ]
}
