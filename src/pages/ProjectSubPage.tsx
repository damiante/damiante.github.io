import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { loadProjectSubPageVariant, loadProject, getProjectVariants } from "@/lib/posts";
import { ProjectSubPageTemplate } from "@/components/templates/ProjectSubPageTemplate";
import type { Post, PageContent } from "@/lib/markdown";

const ProjectSubPage = () => {
  const { slug, subpage } = useParams<{ slug: string; subpage: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [content, setContent] = useState<Post | null>(null);
  const [parentProject, setParentProject] = useState<Post | PageContent | null>(null);
  const [variants, setVariants] = useState<string[]>([]);
  const [currentVariant, setCurrentVariant] = useState<string>('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (slug && subpage) {
      // Get variant from URL query params or use default
      const variantParam = searchParams.get('variant');

      const loadData = async () => {
        try {
          // Load parent project to check template
          const projectContent = await loadProject(slug);
          setParentProject(projectContent);

          // Get variants
          const projectVariants = await getProjectVariants(slug);
          setVariants(projectVariants);

          // Determine which variant to use
          let variant: string | undefined;
          if (projectVariants.length > 0) {
            // Use variant from URL param if valid, otherwise use first variant
            variant = variantParam && projectVariants.includes(variantParam) ? variantParam : projectVariants[0];
            setCurrentVariant(variant);
          } else {
            variant = undefined;
          }

          // Load the sub-page content
          const subPageContent = await loadProjectSubPageVariant(slug, subpage, variant);

          if (subPageContent) {
            setContent(subPageContent);
          } else {
            setError(true);
          }
        } catch (err) {
          console.error('Error loading sub-page:', err);
          setError(true);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }
  }, [slug, subpage, searchParams]);

  const handleVariantChange = async (variant: string) => {
    if (!slug || !subpage) return;

    setLoading(true);
    setCurrentVariant(variant);

    // Update URL with variant parameter
    setSearchParams({ variant: variant });

    try {
      const subPageContent = await loadProjectSubPageVariant(slug, subpage, variant);
      if (subPageContent) {
        setContent(subPageContent);
      }
    } catch (err) {
      console.error('Error loading variant:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const getParentTitle = () => {
    if (!parentProject) return 'Project';
    // Handle both Post and PageContent types
    return 'metadata' in parentProject ? parentProject.metadata.title : parentProject.title;
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 pt-20 max-w-4xl">
        <Link to={`/projects/${slug}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {getParentTitle()}
          </Button>
        </Link>
      </div>
      <ProjectSubPageTemplate
        content={content}
        projectSlug={slug}
        variants={variants}
        currentVariant={currentVariant}
        onVariantChange={handleVariantChange}
      />
      <Footer />
    </div>
  );
};

export default ProjectSubPage;
