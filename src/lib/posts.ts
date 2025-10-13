import { parseMarkdown, parseMarkdownMetadata, parsePageContent, sortPostsByDate, sortPostMetadataByDate, type Post, type PostMetadata, type PageContent } from './markdown';

/**
 * Load all blog posts metadata (without full content) - fast for listing pages
 */
export async function loadBlogPostsMetadata(): Promise<PostMetadata[]> {
  const posts: PostMetadata[] = [];

  // Use Vite's glob import feature to load all markdown files
  const modules = import.meta.glob('../../content/blog-posts/*.md', {
    query: '?raw',
    import: 'default'
  });

  console.log('Blog post modules found:', Object.keys(modules));

  for (const path in modules) {
    const filename = path.split('/').pop() || '';
    const module = await modules[path]() as string;
    const metadata = parseMarkdownMetadata(module, filename);
    posts.push(metadata);
  }

  console.log('Blog posts metadata loaded:', posts.length);
  return sortPostMetadataByDate(posts);
}

/**
 * Load all blog posts from the content/blog-posts directory (with full content)
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
 * Load all project metadata (without full content) - fast for listing pages
 */
export async function loadProjectsMetadata(): Promise<PostMetadata[]> {
  const posts: PostMetadata[] = [];

  // Load flat markdown files
  const fileModules = import.meta.glob('../../content/projects/*.md', {
    eager: false,
    query: '?raw',
    import: 'default'
  });

  for (const path in fileModules) {
    const filename = path.split('/').pop() || '';
    const module = await fileModules[path]() as string;
    const metadata = parseMarkdownMetadata(module, filename);
    posts.push(metadata);
  }

  // Load directory-based projects (index.md files)
  const dirModules = import.meta.glob('../../content/projects/*/index.md', {
    eager: false,
    query: '?raw',
    import: 'default'
  });

  for (const path in dirModules) {
    // Extract directory name as the slug (e.g., "cooking" from "cooking/index.md")
    const parts = path.split('/');
    const dirName = parts[parts.length - 2] || '';
    const filename = `${dirName}.md`; // Use directory name as filename for slug generation
    const module = await dirModules[path]() as string;
    const metadata = parseMarkdownMetadata(module, filename);
    posts.push(metadata);
  }

  return sortPostMetadataByDate(posts);
}

/**
 * Load all project posts from the content/projects directory (with full content)
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
 * Supports both flat files (slug.md) and directory structure (slug/index.md)
 */
export async function loadProject(slug: string): Promise<Post | null> {
  const modules = import.meta.glob('../../content/projects/**/*.md', {
    eager: false,
    query: '?raw',
    import: 'default'
  });

  for (const path in modules) {
    // Check for flat file: projects/slug.md
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

    // Check for directory structure: projects/slug/index.md
    const pathParts = path.split('/');
    const parentDir = pathParts[pathParts.length - 2];
    if (parentDir === slug && filename === 'index.md') {
      try {
        const module = await modules[path]() as string;
        return parseMarkdown(module, `${slug}.md`);
      } catch (error) {
        console.error(`Failed to load project: ${slug}`, error);
        return null;
      }
    }
  }

  return null;
}

/**
 * Load sub-pages for a specific project
 * Returns metadata for all markdown files in content/projects/slug/ (excluding index.md)
 */
export async function loadProjectSubPages(projectSlug: string): Promise<PostMetadata[]> {
  const subPages: PostMetadata[] = [];

  const modules = import.meta.glob('../../content/projects/**/*.md', {
    eager: false,
    query: '?raw',
    import: 'default'
  });

  for (const path in modules) {
    const pathParts = path.split('/');
    const parentDir = pathParts[pathParts.length - 2];
    const filename = pathParts[pathParts.length - 1];

    // Only include files in the project's directory, excluding index.md
    if (parentDir === projectSlug && filename !== 'index.md') {
      try {
        const module = await modules[path]() as string;
        const metadata = parseMarkdownMetadata(module, filename);
        subPages.push(metadata);
      } catch (error) {
        console.error(`Failed to load sub-page: ${path}`, error);
      }
    }
  }

  return sortPostMetadataByDate(subPages);
}

/**
 * Load a specific project sub-page
 */
export async function loadProjectSubPage(projectSlug: string, subPageSlug: string): Promise<Post | null> {
  const modules = import.meta.glob('../../content/projects/**/*.md', {
    eager: false,
    query: '?raw',
    import: 'default'
  });

  for (const path in modules) {
    const pathParts = path.split('/');
    const parentDir = pathParts[pathParts.length - 2];
    const filename = pathParts[pathParts.length - 1];

    if (parentDir === projectSlug && filename === `${subPageSlug}.md`) {
      try {
        const module = await modules[path]() as string;
        return parseMarkdown(module, filename);
      } catch (error) {
        console.error(`Failed to load sub-page: ${projectSlug}/${subPageSlug}`, error);
        return null;
      }
    }
  }

  return null;
}

/**
 * Load page content from the content/pages directory
 */
export async function loadPageContent(pageName: string): Promise<PageContent | null> {
  const modules = import.meta.glob('../../content/pages/*.md', {
    eager: false,
    query: '?raw',
    import: 'default'
  });

  for (const path in modules) {
    const filename = path.split('/').pop() || '';
    if (filename === `${pageName}.md`) {
      try {
        const module = await modules[path]() as string;
        return parsePageContent(module);
      } catch (error) {
        console.error(`Failed to load page content: ${pageName}`, error);
        return null;
      }
    }
  }

  return null;
}
