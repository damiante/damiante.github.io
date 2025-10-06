import { Leaf, Code, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { PageContent } from "@/lib/markdown";

const iconMap: Record<string, any> = {
  Leaf,
  Code,
  Lightbulb,
};

interface AboutTemplateProps {
  content: PageContent;
}

export const AboutTemplate = ({ content }: AboutTemplateProps) => {
  const title = content.title || "About";
  const intro = content.intro || "";
  const values = content.values || [];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">{title}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {intro}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {values.map((value: any) => {
            const IconComponent = iconMap[value.icon] || Lightbulb;
            return (
              <Card
                key={value.title}
                className="p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 bg-card border-border"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
