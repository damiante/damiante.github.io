import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { DynamicPost } from "@/components/DynamicPost";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProjectPost = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
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

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 pt-20 max-w-4xl">
        <Link to="/projects">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      </div>
      <DynamicPost type="project" slug={slug} />
      <Footer />
    </div>
  );
};

export default ProjectPost;
