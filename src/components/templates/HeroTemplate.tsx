import { ArrowDown } from "lucide-react";
import type { PageContent } from "@/lib/markdown";

interface HeroTemplateProps {
  content: PageContent;
}

export const HeroTemplate = ({ content }: HeroTemplateProps) => {
  const scrollToAbout = () => {
    const aboutSection = document.querySelector("#about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const title = content.title || "Building the Future Today";
  const subtitle = content.subtitle || "Where technology meets nature in harmonious innovation.";
  const buttonText = content.buttonText;
  const image = content.image || "/images/hero-solarpunk.jpg";
  const imageAlt = content.imageAlt || "Hero image";

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
              {title.split(' ').slice(0, 2).join(' ')}
              <span className="block text-primary mt-2">{title.split(' ').slice(2).join(' ')}</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
              {subtitle}
            </p>
            {buttonText && (
              <button
                onClick={scrollToAbout}
                className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-all duration-300 group"
              >
                <span className="text-lg font-medium">{buttonText}</span>
                <ArrowDown className="h-5 w-5 animate-bounce group-hover:translate-y-1 transition-transform" />
              </button>
            )}
          </div>

          {/* Image */}
          <div className="animate-fade-in order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={image}
                alt={imageAlt}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
