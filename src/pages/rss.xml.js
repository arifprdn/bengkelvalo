import { blogPosts } from '../data/blogPosts.js'

const SITE = 'https://bengkelvalo.com'

function escapeXml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
}

function toRfc822(pubDate) {
    const [year, month, day] = pubDate.split('-').map(Number)
    const date = new Date(Date.UTC(year, month - 1, day))
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const weekday = weekdays[date.getUTCDay()]
    const monthName = months[date.getUTCMonth()]
    const dd = String(date.getUTCDate()).padStart(2, '0')
    return `${weekday}, ${dd} ${monthName} ${year} 00:00:00 +0700`
}

export async function GET() {
    const items = blogPosts
        .map((post) => {
            const url = `${SITE}${post.href}`
            return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.desc)}</description>
      <pubDate>${toRfc822(post.pubDate)}</pubDate>
    </item>`
        })
        .join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>BengkelValo Blog</title>
    <link>${SITE}/blog/</link>
    <description>Panduan rank, tips naik rank, dan info seputar joki Valorant dari tim BengkelValo.</description>
    <language>id</language>
${items}
  </channel>
</rss>
`

    return new Response(xml, {
        headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
    })
}
