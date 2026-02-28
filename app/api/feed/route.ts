import { NextResponse } from 'next/server'
import { getNews } from '@/lib/server/db-actions'

export async function GET() {
  const baseUrl = 'https://jobhouseproduction.com'

  // Fetch news from database
  const news = await getNews({ limit: 20 })

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>JOB HOUSE PRODUCTION - Gospel Music News</title>
    <link>${baseUrl}</link>
    <description>Latest news and updates about gospel music in Rwanda</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${news
      .map(
        (article) => `
    <item>
      <title>${article.title}</title>
      <link>${baseUrl}/news/${article.id}</link>
      <description>${article.excerpt || ''}</description>
      <category>${article.category || 'News'}</category>
      <pubDate>${new Date(article.published_at || article.created_at).toUTCString()}</pubDate>
      <guid>${baseUrl}/news/${article.id}</guid>
    </item>
    `
      )
      .join('')}
  </channel>
</rss>`

  return new NextResponse(feed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
