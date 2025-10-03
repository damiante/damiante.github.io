import matter from 'gray-matter';

export interface PostMetadata {
  title: string;
  date: string;
  tags?: string[];
  slug: string;
}

export interface Post {
  metadata: PostMetadata;
  content: string;
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
    },
    content,
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
