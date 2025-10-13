import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface Post {
  title: string;
  date: string;
  slug: string;
  excerpt?: string;
  tags?: string[];
  type?: 'blog' | 'project';
}

const SITE_URL = 'https://damiantesta.com';
const SITE_TITLE = 'Damian Testa - Blog';
const SITE_DESCRIPTION = 'Thoughts on technology, projects, and personal learnings';

function getAllPosts(dir: string, type: 'blog' | 'project'): Post[] {
  const postsDirectory = path.join(process.cwd(), 'content', dir);
  const items = fs.readdirSync(postsDirectory);

  const posts: Post[] = [];

  items.forEach(item => {
    const itemPath = path.join(postsDirectory, item);
    const stat = fs.statSync(itemPath);

    if (stat.isFile() && item.endsWith('.md')) {
      // Handle flat markdown files
      const fileContents = fs.readFileSync(itemPath, 'utf8');
      const { data, content } = matter(fileContents);

      const slug = item.replace(/\.md$/, '');
      const excerpt = data.excerpt || content.replace(/[#*`\n]/g, ' ').trim().substring(0, 150);

      // Normalize tags to array
      let tags: string[] = [];
      if (data.tags) {
        if (Array.isArray(data.tags)) {
          tags = data.tags;
        } else if (typeof data.tags === 'string') {
          tags = data.tags.split(' ');
        }
      }

      posts.push({
        title: data.title || 'Untitled',
        date: data.date || new Date().toISOString(),
        slug,
        excerpt,
        tags,
        type,
      });
    } else if (stat.isDirectory()) {
      // Handle directory structure - only include index.md (not sub-pages)
      const indexPath = path.join(itemPath, 'index.md');
      if (fs.existsSync(indexPath)) {
        const fileContents = fs.readFileSync(indexPath, 'utf8');
        const { data, content } = matter(fileContents);

        const slug = item;
        const excerpt = data.excerpt || content.replace(/[#*`\n]/g, ' ').trim().substring(0, 150);

        // Normalize tags to array
        let tags: string[] = [];
        if (data.tags) {
          if (Array.isArray(data.tags)) {
            tags = data.tags;
          } else if (typeof data.tags === 'string') {
            tags = data.tags.split(' ');
          }
        }

        posts.push({
          title: data.title || 'Untitled',
          date: data.date || new Date().toISOString(),
          slug,
          excerpt,
          tags,
          type,
        });
      }
    }
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function generateRSSItem(post: Post): string {
  const type = post.type || 'blog';
  const url = `${SITE_URL}/${type}/${post.slug}`;
  const pubDate = new Date(post.date).toUTCString();

  // Add type as a category so readers can filter
  const allCategories = [type, ...(post.tags || [])];
  const tags = allCategories.map(tag => `<category>${tag}</category>`).join('\n      ');

  return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      ${tags}
    </item>`;
}

function generateRSS(posts: Post[]): string {
  const feedUrl = `${SITE_URL}/rss.xml`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>Blog posts and projects from Damian Testa</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    ${posts.map(post => generateRSSItem(post)).join('\n')}
  </channel>
</rss>`;
}

// Generate combined feed
const blogPosts = getAllPosts('blog-posts', 'blog');
const projects = getAllPosts('projects', 'project');

// Combine and sort by date
const allPosts = [...blogPosts, ...projects].sort((a, b) =>
  new Date(b.date).getTime() - new Date(a.date).getTime()
);

const rss = generateRSS(allPosts);

// Write to public directory
const publicDir = path.join(process.cwd(), 'public');
fs.writeFileSync(path.join(publicDir, 'rss.xml'), rss);

console.log('✅ RSS feed generated successfully!');
console.log(`   - Total items: ${allPosts.length} (${blogPosts.length} blog posts, ${projects.length} projects)`);
