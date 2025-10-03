import { Navigation } from "@/components/Navigation";
import { Blog } from "@/components/Blog";
import { Footer } from "@/components/Footer";

const BlogPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Blog />
      <Footer />
    </div>
  );
};

export default BlogPage;
