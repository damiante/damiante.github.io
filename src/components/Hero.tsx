import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/hero-solarpunk.jpg";

export const Hero = () => {
  const scrollToAbout = () => {
    const aboutSection = document.querySelector("#about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center pt-20 pb-12"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="animate-fade-in order-2 lg:order-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Building the
              <span className="block text-primary mt-2">Future Today</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
              Where technology meets nature in harmonious innovation.
              A software engineer, architect, and professional generalist
              exploring the intersection of sustainable tech and creative solutions.
            </p>
            <button
              onClick={scrollToAbout}
              className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-all duration-300 group"
            >
              <span className="text-lg font-medium">Explore More</span>
              <ArrowDown className="h-5 w-5 animate-bounce group-hover:translate-y-1 transition-transform" />
            </button>
          </div>

          {/* Image */}
          <div className="animate-fade-in order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="Solarpunk futuristic landscape"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
