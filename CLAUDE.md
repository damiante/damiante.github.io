# Claude Code Documentation

This repository contains a **custom static site generator** built with **React + Vite + TypeScript** that mimics Jekyll-style markdown rendering. The site is hosted on GitHub Pages and automatically deploys on push to the master branch.

## 🏗️ Architecture Overview

### Build System
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Markdown Processing**: `gray-matter` for frontmatter parsing, `react-markdown` with `remark-gfm` and `rehype-raw` for rendering
- **Routing**: React Router DOM with client-side routing
- **Deployment**: GitHub Actions → GitHub Pages (on push to `master`)

### Custom Rendering Methodology

Unlike traditional static site generators that pre-render HTML at build time, this site uses a **hybrid approach**:

1. **Build time**:
   - Vite bundles the React app
   - RSS feed is generated via `scripts/generate-rss.ts`
   - Markdown files are processed by Vite's glob imports

2. **Runtime** (in the browser):
   - React Router handles navigation
   - Markdown files are loaded dynamically using Vite's `import.meta.glob()`
   - `gray-matter` parses frontmatter + content
   - `react-markdown` renders markdown to React components

This means the site is technically a **Single Page Application (SPA)** that dynamically loads and renders markdown content, rather than a traditional static site with pre-rendered HTML pages.

## 📁 Repository Structure

```
.
├── .github/workflows/deploy.yml    # GitHub Actions deployment workflow
├── content/                        # All markdown content
│   ├── blog-posts/                # Blog posts (flat structure)
│   │   └── *.md                   # Each file = one blog post
│   ├── projects/                  # Project posts
│   │   ├── *.md                   # Flat project files
│   │   └── project-name/          # Directory-based projects (support sub-pages)
│   │       ├── index.md           # Main project page
│   │       └── subpage.md         # Sub-pages (e.g., recipes, tutorials)
│   └── pages/                     # Static pages (home, about, etc.)
│       └── *.md
├── public/                        # Static assets + generated RSS
│   └── rss.xml                    # Auto-generated RSS feed
├── scripts/
│   └── generate-rss.ts            # Build-time RSS generation
├── src/
│   ├── components/                # React components
│   │   ├── DynamicPost.tsx        # Renders blog/project posts
│   │   ├── Navigation.tsx         # Site navigation
│   │   ├── Footer.tsx             # Site footer
│   │   └── ui/                    # shadcn/ui components
│   ├── lib/
│   │   ├── markdown.ts            # Markdown parsing utilities
│   │   └── posts.ts               # Content loading functions
│   ├── pages/                     # React Router pages
│   │   ├── Index.tsx              # Home page
│   │   ├── Blog.tsx               # Blog listing
│   │   ├── BlogPost.tsx           # Individual blog post
│   │   ├── Projects.tsx           # Projects listing
│   │   ├── ProjectPost.tsx        # Individual project
│   │   └── ProjectSubPage.tsx     # Project sub-pages
│   ├── App.tsx                    # Router configuration
│   └── index.css                  # Global styles + CSS variables
├── tailwind.config.ts             # Tailwind configuration
├── vite.config.ts                 # Vite build configuration
└── package.json                   # Dependencies and scripts
```

## 📝 Content Structure

### Frontmatter Format

All markdown files use YAML frontmatter with these standard fields:

```yaml
---
title: "Post Title"
date: 2025-10-10 12:00:00 +0000
tags: ["tag1", "tag2"]              # Can be array or space-separated string
excerpt: "Optional excerpt"          # If omitted, first 150 chars used
categories: blog                     # Legacy field (not heavily used)
template: project-post               # Legacy field (not used in rendering)
---
```

### Content Types

#### 1. Blog Posts (`content/blog-posts/*.md`)
- **Location**: Flat files in `content/blog-posts/`
- **URL Pattern**: `/blog/:slug`
- **Slug**: Derived from filename (e.g., `2025-10-10-new-blog.md` → slug: `2025-10-10-new-blog`)
- **Loaded by**: [src/lib/posts.ts](src/lib/posts.ts) - `loadBlogPosts()`, `loadBlogPost(slug)`

#### 2. Project Posts (`content/projects/`)
- **Location**: Either flat files OR directories with `index.md`
- **URL Pattern**: `/projects/:slug`
- **Slug**:
  - Flat file: `music.md` → slug: `music`
  - Directory: `cooking/index.md` → slug: `cooking`
- **Loaded by**: [src/lib/posts.ts](src/lib/posts.ts) - `loadProjects()`, `loadProject(slug)`

#### 3. Project Sub-Pages (`content/projects/:slug/*.md`)
- **Location**: Any `.md` file in a project directory (excluding `index.md`)
- **URL Pattern**: `/projects/:slug/:subpage`
- **Example**: `content/projects/cooking/homemade-pasta.md` → `/projects/cooking/homemade-pasta`
- **Loaded by**: [src/lib/posts.ts](src/lib/posts.ts) - `loadProjectSubPages(slug)`, `loadProjectSubPage(slug, subpage)`
- **Use case**: Breaking down large projects into sub-topics (e.g., individual recipes, tutorials)

#### 4. Static Pages (`content/pages/*.md`)
- **Location**: `content/pages/`
- **Loaded by**: [src/lib/posts.ts](src/lib/posts.ts) - `loadPageContent(pageName)`
- **Example**: `home.md`, `about.md`

### Creating New Content

#### Add a Blog Post
1. Create a new file: `content/blog-posts/YYYY-MM-DD-slug.md`
2. Add frontmatter with `title`, `date`, `tags`
3. Write content in markdown (supports GFM, inline HTML)
4. Commit and push → site rebuilds automatically

#### Add a Simple Project
1. Create a new file: `content/projects/project-name.md`
2. Add frontmatter
3. Write content
4. Commit and push

#### Add a Project with Sub-Pages
1. Create directory: `content/projects/project-name/`
2. Create `index.md` as the main project page
3. Add sub-pages as separate `.md` files in the same directory
4. Sub-pages automatically appear in the project's navigation
5. Commit and push

## 🛠️ Key Files Explained

### [src/lib/posts.ts](src/lib/posts.ts)
Core content loading logic using Vite's `import.meta.glob()`:

- `loadBlogPostsMetadata()` - Fast metadata-only loading for listing pages
- `loadBlogPosts()` - Full content loading with parsed markdown
- `loadBlogPost(slug)` - Load single blog post by slug
- `loadProjectsMetadata()` - Handles both flat files and directory-based projects
- `loadProject(slug)` - Load single project (supports both structures)
- `loadProjectSubPages(slug)` - Get all sub-pages for a project
- `loadProjectSubPage(slug, subpage)` - Load specific sub-page
- `loadPageContent(name)` - Load static pages

**Important**: Uses Vite's glob imports with `?raw` query to import markdown as strings at build time.

### [src/lib/markdown.ts](src/lib/markdown.ts)
Markdown parsing utilities:

- `parseMarkdown()` - Parse frontmatter + content into Post object
- `parseMarkdownMetadata()` - Extract only metadata (faster for listings)
- `parsePageContent()` - Parse page content with all frontmatter fields
- `formatDate()` - Format ISO dates for display
- `sortPostsByDate()` - Sort posts newest-first

### [src/components/DynamicPost.tsx](src/components/DynamicPost.tsx)
Renders individual blog/project posts:

- Loads post content dynamically based on `type` (blog/project) and `slug`
- Displays title, date, tags
- Renders markdown content using `react-markdown`
- For projects: Shows sub-page navigation if sub-pages exist
- Configured with `remark-gfm` (GitHub Flavored Markdown) and `rehype-raw` (allow inline HTML)

### [scripts/generate-rss.ts](scripts/generate-rss.ts)
Build-time RSS feed generator:

- Runs before `vite build` (see `package.json` build script)
- Scans `content/blog-posts/` and `content/projects/`
- Generates combined RSS feed at `public/rss.xml`
- Includes both blog posts and projects, sorted by date
- Outputs: Title, link, pubDate, description, categories (tags)

### [vite.config.ts](vite.config.ts)
Vite configuration:

- Uses `@vitejs/plugin-react-swc` for fast React compilation
- Includes `vite-plugin-markdown` for markdown import support
- Path alias: `@` → `./src`
- Dev server runs on port 8080
- **Important**: Base path is `/` (root domain) - change if deploying to subdirectory

### [.github/workflows/deploy.yml](.github/workflows/deploy.yml)
GitHub Actions deployment:

- Triggers on push to `master` branch
- Steps: Checkout → Install Node 20 → Install deps → Build → Deploy to GitHub Pages
- Build command: `npm run build` (which runs RSS generation + Vite build)
- Deploys `./dist` directory to GitHub Pages

## 🎨 Styling System

### Tailwind + CSS Variables
- **Config**: [tailwind.config.ts](tailwind.config.ts)
- **Global styles**: [src/index.css](src/index.css)
- **Theme system**: CSS custom properties in `:root` and `.dark` classes
- **Dark mode**: Class-based (`class` strategy in Tailwind config)

### Customizing Styles
Colors and fonts are centralized using CSS variables:

1. **Colors**: Edit CSS variables in [src/index.css](src/index.css) (search for `:root` and `.dark`)
   - Variables like `--background`, `--foreground`, `--primary`, etc.
   - Dark mode variants in `.dark` selector

2. **Typography**: Edit Tailwind config or global CSS
   - Font families defined in [src/index.css](src/index.css)
   - Prose styles (markdown rendering) use `@tailwindcss/typography`

3. **Component styles**: shadcn/ui components in [src/components/ui/](src/components/ui/)
   - Configured via [components.json](components.json)

## 🚀 Development Workflow

### Local Development
```bash
npm install           # Install dependencies
npm run dev           # Start dev server on http://localhost:8080
```

### Building
```bash
npm run build         # Generate RSS + build for production
npm run build:dev     # Build in development mode
npm run preview       # Preview production build
```

### Adding Dependencies
```bash
npm install <package>         # Add runtime dependency
npm install -D <package>      # Add dev dependency
```

**Common packages used**:
- `gray-matter` - Frontmatter parsing
- `react-markdown` - Markdown rendering
- `remark-gfm` - GitHub Flavored Markdown support
- `rehype-raw` - Allow HTML in markdown

### Deployment
**Automatic**: Push to `master` branch → GitHub Actions builds and deploys

**Manual**: Can trigger via GitHub Actions UI (workflow_dispatch)

## 🔍 Common Tasks

### Adding a New Route
1. Create page component in [src/pages/](src/pages/)
2. Add route in [src/App.tsx](src/App.tsx) (before the `*` catch-all route)
3. Update [src/components/Navigation.tsx](src/components/Navigation.tsx) if needed

### Modifying Markdown Rendering
Edit [src/components/DynamicPost.tsx](src/components/DynamicPost.tsx):
- Change `ReactMarkdown` component props
- Add/remove remark/rehype plugins
- Customize component renderers (e.g., custom code blocks, headings)

### Changing Site Metadata
- **Title/Description**: Edit [index.html](index.html) `<head>` section
- **RSS feed info**: Edit constants in [scripts/generate-rss.ts](scripts/generate-rss.ts)
- **Domain**: Set `SITE_URL` in [scripts/generate-rss.ts](scripts/generate-rss.ts)

### Adding Static Assets
Place files in [public/](public/) directory:
- Images: `public/images/`
- Reference in markdown: `![Alt text](/images/photo.jpg)`
- Files in `public/` are served at root path

### Debugging Build Issues
1. Check RSS generation: `npm run generate-rss`
2. Check Vite build: `npm run build:dev` (shows more details)
3. Check glob imports: Add `console.log()` in [src/lib/posts.ts](src/lib/posts.ts) loader functions
4. Inspect frontmatter parsing: Check `gray-matter` output in browser console

## 📋 Important Notes

### URL Structure
- Blog posts: `/blog/:slug`
- Projects: `/projects/:slug`
- Project sub-pages: `/projects/:slug/:subpage`
- Static pages: `/:page` (e.g., `/about`)

### Client-Side Routing Caveats
This is an SPA, so:
- **Direct URL access** requires server configuration (GitHub Pages handles this with 404 fallback)
- **SEO**: Content not pre-rendered - consider meta tags or SSR if SEO is critical
- **Loading states**: Markdown loads asynchronously - DynamicPost handles this

### Markdown Features
Supported via `remark-gfm` and `rehype-raw`:
- Tables
- Task lists
- Strikethrough
- Autolinks
- Inline HTML (use cautiously)
- Code blocks with syntax highlighting (via CSS classes)

### Git Workflow
- Main branch: `master` (deploys to production)
- Commit markdown changes → auto-rebuild
- Check GitHub Actions tab for deployment status

## 🐛 Troubleshooting

### "Post not found" errors
- Check filename matches slug exactly
- Verify frontmatter is valid YAML
- Check file is in correct directory
- Inspect browser console for glob import errors

### RSS feed not updating
- RSS generation runs during `npm run build`
- Check `public/rss.xml` exists after build
- Verify [scripts/generate-rss.ts](scripts/generate-rss.ts) runs without errors

### Styling issues
- Check CSS variable definitions in [src/index.css](src/index.css)
- Verify Tailwind classes are not being purged (check `content` in [tailwind.config.ts](tailwind.config.ts))
- Check browser console for CSS errors
- Clear Vite cache: `rm -rf node_modules/.vite`

### Build failures in GitHub Actions
- Check Node version (currently uses Node 20)
- Verify `package-lock.json` is committed
- Check build logs in GitHub Actions tab
- Test build locally: `npm run build`

## 🔗 Related Documentation

- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [gray-matter](https://github.com/jonschlinkert/gray-matter)
- [react-markdown](https://github.com/remarkjs/react-markdown)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## 🎯 Project-Specific Conventions

### File Naming
- Blog posts: `YYYY-MM-DD-descriptive-slug.md` (date prefix helps with sorting)
- Projects: `descriptive-slug.md` or `descriptive-slug/index.md`
- Sub-pages: Any descriptive filename (slug extracted from filename)

### Content Organization
- Keep related project files in same directory
- Use sub-pages for multi-part projects (e.g., recipe collections)
- Static assets in `public/` with organized subdirectories

### Code Style
- TypeScript with strict mode
- React functional components + hooks
- Tailwind for styling (avoid inline styles)
- ESLint configured (run `npm run lint`)

---

**Last Updated**: October 2025
**Site Owner**: Damian Testa
**Domain**: https://damiantesta.com
