# Page Content System

This directory contains markdown files that define the content for each page on the site.

## How It Works

Each markdown file uses **frontmatter** (YAML metadata at the top) to specify:
1. Which **template** to use for rendering
2. The **content data** that template needs

This is similar to Jekyll's layout system - the markdown file declares its template, and the system renders it accordingly.

## Adding a New Page

To create a new page:

1. **Create a markdown file** in this directory (e.g., `gallery.md`)

2. **Add frontmatter** specifying the template and content:
```yaml
---
template: "gallery"
title: "My Photo Gallery"
photos:
  - url: "/images/photo1.jpg"
    caption: "Sunset over mountains"
  - url: "/images/photo2.jpg"
    caption: "City skyline"
---
```

3. **Create the template component** (if it doesn't exist):
   - Add a new file: `src/components/templates/GalleryTemplate.tsx`
   - Implement how the template should render the content
   - Register it in `src/components/MarkdownPage.tsx`

4. **Add a route** (if needed) in `src/App.tsx`

## Available Templates

Current templates registered in the system:

### Page Templates (for content/pages/)
- **`hero`** - Landing page hero section with title, subtitle, image, and button
- **`about`** - About page with intro text and value cards with icons
- **`blog-list`** - Blog listing page that loads and displays all blog posts
- **`projects-list`** - Projects listing page that loads and displays all projects

### Post Templates (for content/blog-posts/ and content/projects/)
- **`blog-post`** - Individual blog post with title, date, tags, and markdown content
- **`project-post`** - Individual project post with title, date, tags, and markdown content

**Note:** Blog posts and project posts automatically use their respective templates if no `template` field is specified in frontmatter.

## Example: Current Pages

### home.md
```yaml
---
template: "hero"
title: "Building the Future Today"
subtitle: "Where technology meets nature..."
buttonText: "Explore More"
---
```

### about.md
```yaml
---
template: "about"
title: "About"
intro: "I'm a creator at the intersection..."
values:
  - icon: "Leaf"
    title: "Sustainable"
    description: "Creating solutions..."
---
```

## Template Development

Templates are located in `src/components/templates/` and receive a `content` prop containing all frontmatter data from the markdown file. See existing templates for examples.
