import matter from 'gray-matter';

export interface PostMetadata {
  title: string;
  date: string;
  tags?: string[];
  slug: string;
  excerpt?: string;
}

export interface Post {
  metadata: PostMetadata;
  content: string;
}

export interface PageContent {
  [key: string]: any;
  content?: string;
}

/**
 * Parse markdown file content and extract frontmatter metadata
 */
export function parseMarkdown(markdownContent: string, filename: string): Post {
  const { data, content } = matter(markdownContent);

  // Extract slug from filename (remove .md or .markdown extension)
  const slug = filename.replace(/\.(md|markdown)$/, '');

  return {
    metadata: {
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString(),
      tags: data.tags ? (Array.isArray(data.tags) ? data.tags : data.tags.split(' ')) : [],
      slug,
      excerpt: data.excerpt,
    },
    content,
  };
}

/**
 * Parse markdown file and extract only metadata (with excerpt from content if not in frontmatter)
 * This is much faster than parseMarkdown as it doesn't process the full content
 */
export function parseMarkdownMetadata(markdownContent: string, filename: string): PostMetadata {
  const { data, content } = matter(markdownContent);

  // Extract slug from filename (remove .md or .markdown extension)
  const slug = filename.replace(/\.(md|markdown)$/, '');

  // Use excerpt from frontmatter, or extract first 150 chars from content
  const excerpt = data.excerpt || content.replace(/[#*`\n]/g, ' ').trim().substring(0, 150);

  return {
    title: data.title || 'Untitled',
    date: data.date || new Date().toISOString(),
    tags: data.tags ? (Array.isArray(data.tags) ? data.tags : data.tags.split(' ')) : [],
    slug,
    excerpt,
  };
}

/**
 * Format date string for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Sort posts by date (newest first)
 */
export function sortPostsByDate(posts: Post[]): Post[] {
  return posts.sort((a, b) => {
    const dateA = new Date(a.metadata.date);
    const dateB = new Date(b.metadata.date);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Sort post metadata by date (newest first)
 */
export function sortPostMetadataByDate(posts: PostMetadata[]): PostMetadata[] {
  return posts.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Parse page content from markdown file
 * Returns all frontmatter data plus optional content body
 */
export function parsePageContent(markdownContent: string): PageContent {
  const { data, content } = matter(markdownContent);

  return {
    ...data,
    content: content.trim() || undefined,
  };
}
