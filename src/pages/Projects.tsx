import { Navigation } from "@/components/Navigation";
import { Projects } from "@/components/Projects";
import { Footer } from "@/components/Footer";

const ProjectsPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Projects />
      <Footer />
    </div>
  );
};

export default ProjectsPage;
