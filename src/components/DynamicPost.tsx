import { useEffect, useState } from "react";
import type { PageContent } from "@/lib/markdown";
import { BlogPostTemplate } from "./templates/BlogPostTemplate";
import { ProjectPostTemplate } from "./templates/ProjectPostTemplate";
import { parsePageContent } from "@/lib/markdown";

interface DynamicPostProps {
  type: "blog" | "project";
  slug: string;
}

export const DynamicPost = ({ type, slug }: DynamicPostProps) => {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const basePath = type === "blog" ? "blog-posts" : "projects";
        const modules = import.meta.glob('../../content/**/*.md', {
          eager: false,
          query: '?raw',
          import: 'default'
        });

        let found = false;
        for (const path in modules) {
          const filename = path.split('/').pop() || '';
          const pathType = path.includes('/blog-posts/') ? 'blog' : path.includes('/projects/') ? 'project' : null;

          if (pathType === type && filename === `${slug}.md`) {
            const module = await modules[path]() as string;
            const parsedContent = parsePageContent(module);

            // Add default template if not specified
            if (!parsedContent.template) {
              parsedContent.template = type === "blog" ? "blog-post" : "project-post";
            }

            setContent(parsedContent);
            found = true;
            break;
          }
        }

        if (!found) {
          setError(`${type === "blog" ? "Blog post" : "Project"} not found`);
        }
      } catch (err: any) {
        console.error(`Failed to load ${type} post:`, err);
        setError(`Failed to load post: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [type, slug]);

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-muted-foreground">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !content) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-red-500">{error || "Failed to load content"}</p>
          </div>
        </div>
      </section>
    );
  }

  const Template = type === "blog" ? BlogPostTemplate : ProjectPostTemplate;
  return <Template content={content} />;
};
