import { parseMarkdown, sortPostsByDate, type Post } from './markdown';

/**
 * Load all blog posts from the content/blog-posts directory
 */
export async function loadBlogPosts(): Promise<Post[]> {
  const posts: Post[] = [];

  // Use Vite's glob import feature to load all markdown files
  const modules = import.meta.glob('../../content/blog-posts/*.md', {
    query: '?raw',
    import: 'default'
  });

  console.log('Blog post modules found:', Object.keys(modules));

  for (const path in modules) {
    const filename = path.split('/').pop() || '';
    const module = await modules[path]() as string;
    console.log('Loading blog post:', filename, 'content length:', module?.length);
    const post = parseMarkdown(module, filename);
    posts.push(post);
  }

  console.log('Blog posts loaded:', posts.length);
  return sortPostsByDate(posts);
}

/**
 * Load all project posts from the content/projects directory
 */
export async function loadProjects(): Promise<Post[]> {
  const posts: Post[] = [];

  // Use Vite's glob import feature to load all markdown files
  const modules = import.meta.glob('../../content/projects/*.md', {
    eager: false,
    query: '?raw',
    import: 'default'
  });

  for (const path in modules) {
    const filename = path.split('/').pop() || '';
    const module = await modules[path]() as string;
    const post = parseMarkdown(module, filename);
    posts.push(post);
  }

  return sortPostsByDate(posts);
}

/**
 * Load a specific blog post by slug
 */
export async function loadBlogPost(slug: string): Promise<Post | null> {
  const modules = import.meta.glob('../../content/blog-posts/*.md', {
    eager: false,
    query: '?raw',
    import: 'default'
  });

  for (const path in modules) {
    const filename = path.split('/').pop() || '';
    if (filename === `${slug}.md`) {
      try {
        const module = await modules[path]() as string;
        return parseMarkdown(module, filename);
      } catch (error) {
        console.error(`Failed to load blog post: ${slug}`, error);
        return null;
      }
    }
  }

  return null;
}

/**
 * Load a specific project by slug
 */
export async function loadProject(slug: string): Promise<Post | null> {
  const modules = import.meta.glob('../../content/projects/*.md', {
    eager: false,
    query: '?raw',
    import: 'default'
  });

  for (const path in modules) {
    const filename = path.split('/').pop() || '';
    if (filename === `${slug}.md`) {
      try {
        const module = await modules[path]() as string;
        return parseMarkdown(module, filename);
      } catch (error) {
        console.error(`Failed to load project: ${slug}`, error);
        return null;
      }
    }
  }

  return null;
}
