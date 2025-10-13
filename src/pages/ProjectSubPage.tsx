import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { loadProjectSubPage, loadProject } from "@/lib/posts";
import { ProjectSubPageTemplate } from "@/components/templates/ProjectSubPageTemplate";
import type { Post } from "@/lib/markdown";

const ProjectSubPage = () => {
  const { slug, subpage } = useParams<{ slug: string; subpage: string }>();
  const [content, setContent] = useState<Post | null>(null);
  const [parentProject, setParentProject] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (slug && subpage) {
      Promise.all([
        loadProjectSubPage(slug, subpage),
        loadProject(slug)
      ])
        .then(([subPageContent, projectContent]) => {
          if (subPageContent) {
            setContent(subPageContent);
            setParentProject(projectContent);
          } else {
            setError(true);
          }
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
  }, [slug, subpage]);

  if (!slug || !subpage) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <Link to="/projects">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 text-center">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <Link to={`/projects/${slug}`}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Project
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 pt-20 max-w-4xl">
        <Link to={`/projects/${slug}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {parentProject?.title || 'Project'}
          </Button>
        </Link>
      </div>
      <ProjectSubPageTemplate content={content} projectSlug={slug} />
      <Footer />
    </div>
  );
};

export default ProjectSubPage;
