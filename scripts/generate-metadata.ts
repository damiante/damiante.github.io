import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface PostMetadata {
  title: string;
  date: string;
  slug: string;
  excerpt: string;
  tags?: string[];
}

interface ProjectWithSubPages {
  slug: string;
  subPages: PostMetadata[];
}

/**
 * Parse markdown file and extract metadata
 */
function parseMarkdownMetadata(filePath: string, filename: string): PostMetadata {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  const slug = filename.replace(/\.md$/, '');
  const excerpt = data.excerpt || content.replace(/[#*`\n]/g, ' ').trim().substring(0, 150);

  // Normalize tags to array
  let tags: string[] = [];
  if (data.tags) {
    if (Array.isArray(data.tags)) {
      tags = data.tags;
    } else if (typeof data.tags === 'string') {
      tags = data.tags.split(' ').filter(Boolean);
    }
  }

  return {
    title: data.title || 'Untitled',
    date: data.date || new Date().toISOString(),
    slug,
    excerpt,
    tags,
  };
}

/**
 * Get all blog posts metadata
 */
function getBlogPostsMetadata(): PostMetadata[] {
  const blogPostsDir = path.join(process.cwd(), 'content', 'blog-posts');
  const files = fs.readdirSync(blogPostsDir);

  const metadata: PostMetadata[] = [];

  files.forEach(file => {
    if (file.endsWith('.md')) {
      const filePath = path.join(blogPostsDir, file);
      metadata.push(parseMarkdownMetadata(filePath, file));
    }
  });

  // Sort by date (newest first)
  return metadata.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get all projects metadata
 */
function getProjectsMetadata(): PostMetadata[] {
  const projectsDir = path.join(process.cwd(), 'content', 'projects');
  const items = fs.readdirSync(projectsDir);

  const metadata: PostMetadata[] = [];

  items.forEach(item => {
    const itemPath = path.join(projectsDir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isFile() && item.endsWith('.md')) {
      // Flat markdown file
      metadata.push(parseMarkdownMetadata(itemPath, item));
    } else if (stat.isDirectory()) {
      // Directory structure - look for index.md
      const indexPath = path.join(itemPath, 'index.md');
      if (fs.existsSync(indexPath)) {
        metadata.push(parseMarkdownMetadata(indexPath, `${item}.md`));
      }
    }
  });

  // Sort by date (newest first)
  return metadata.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get sub-pages for a specific project
 */
function getProjectSubPages(projectSlug: string): PostMetadata[] {
  const projectDir = path.join(process.cwd(), 'content', 'projects', projectSlug);

  // Check if directory exists
  if (!fs.existsSync(projectDir) || !fs.statSync(projectDir).isDirectory()) {
    return [];
  }

  const files = fs.readdirSync(projectDir);
  const subPages: PostMetadata[] = [];

  files.forEach(file => {
    const filePath = path.join(projectDir, file);
    const stat = fs.statSync(filePath);

    // Only include markdown files that are not index.md
    if (stat.isFile() && file.endsWith('.md') && file !== 'index.md') {
      subPages.push(parseMarkdownMetadata(filePath, file));
    } else if (stat.isDirectory()) {
      // Handle variant directories (like language variants)
      const variantFiles = fs.readdirSync(filePath);
      variantFiles.forEach(variantFile => {
        const variantFilePath = path.join(filePath, variantFile);
        const variantStat = fs.statSync(variantFilePath);
        if (variantStat.isFile() && variantFile.endsWith('.md')) {
          subPages.push(parseMarkdownMetadata(variantFilePath, variantFile));
        }
      });
    }
  });

  // Sort by date (newest first)
  return subPages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get all projects with their sub-pages
 */
function getProjectsWithSubPages(): ProjectWithSubPages[] {
  const projectsDir = path.join(process.cwd(), 'content', 'projects');
  const items = fs.readdirSync(projectsDir);

  const projectsWithSubPages: ProjectWithSubPages[] = [];

  items.forEach(item => {
    const itemPath = path.join(projectsDir, item);
    const stat = fs.statSync(itemPath);

    // Only process directories (projects with potential sub-pages)
    if (stat.isDirectory()) {
      const subPages = getProjectSubPages(item);
      if (subPages.length > 0) {
        projectsWithSubPages.push({
          slug: item,
          subPages,
        });
      }
    }
  });

  return projectsWithSubPages;
}

// Generate all metadata files
const publicDir = path.join(process.cwd(), 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate blog posts metadata
const blogPostsMetadata = getBlogPostsMetadata();
fs.writeFileSync(
  path.join(publicDir, 'blog-posts-metadata.json'),
  JSON.stringify(blogPostsMetadata, null, 2)
);

// Generate projects metadata
const projectsMetadata = getProjectsMetadata();
fs.writeFileSync(
  path.join(publicDir, 'projects-metadata.json'),
  JSON.stringify(projectsMetadata, null, 2)
);

// Generate projects with sub-pages metadata
const projectsWithSubPages = getProjectsWithSubPages();
fs.writeFileSync(
  path.join(publicDir, 'projects-subpages-metadata.json'),
  JSON.stringify(projectsWithSubPages, null, 2)
);

console.log('✅ Metadata files generated successfully!');
console.log(`   - Blog posts: ${blogPostsMetadata.length}`);
console.log(`   - Projects: ${projectsMetadata.length}`);
console.log(`   - Projects with sub-pages: ${projectsWithSubPages.length}`);
projectsWithSubPages.forEach(project => {
  console.log(`     • ${project.slug}: ${project.subPages.length} sub-pages`);
});
