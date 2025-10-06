import { useEffect, useState } from "react";
import { loadPageContent } from "@/lib/posts";
import type { PageContent } from "@/lib/markdown";
import { HeroTemplate } from "./templates/HeroTemplate";
import { AboutTemplate } from "./templates/AboutTemplate";
import { BlogListTemplate } from "./templates/BlogListTemplate";
import { ProjectsListTemplate } from "./templates/ProjectsListTemplate";
import { BlogPostTemplate } from "./templates/BlogPostTemplate";
import { ProjectPostTemplate } from "./templates/ProjectPostTemplate";

// Template registry - maps template names to their components
const TEMPLATES: Record<string, React.ComponentType<{ content: PageContent }>> = {
  hero: HeroTemplate,
  about: AboutTemplate,
  "blog-list": BlogListTemplate,
  "projects-list": ProjectsListTemplate,
  "blog-post": BlogPostTemplate,
  "project-post": ProjectPostTemplate,
};

interface MarkdownPageProps {
  pageName: string;
}

export const MarkdownPage = ({ pageName }: MarkdownPageProps) => {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPageContent(pageName)
      .then((data) => {
        if (!data) {
          setError(`Page "${pageName}" not found`);
        } else if (!data.template) {
          setError(`Page "${pageName}" is missing a "template" field in frontmatter`);
        } else if (!TEMPLATES[data.template]) {
          setError(`Unknown template "${data.template}". Available templates: ${Object.keys(TEMPLATES).join(', ')}`);
        } else {
          setContent(data);
        }
      })
      .catch((err) => {
        console.error(`Failed to load page: ${pageName}`, err);
        setError(`Failed to load page: ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, [pageName]);

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

  const TemplateComponent = TEMPLATES[content.template];
  return <TemplateComponent content={content} />;
};
