import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";
import { loadProjectsMetadata } from "@/lib/posts";
import { formatDate, type PostMetadata, type PageContent } from "@/lib/markdown";

const colorClasses = [
  "bg-primary/10",
  "bg-secondary/10",
  "bg-accent/10",
];

interface ProjectsListTemplateProps {
  content: PageContent;
}

export const ProjectsListTemplate = ({ content }: ProjectsListTemplateProps) => {
  const [projects, setProjects] = useState<PostMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjectsMetadata()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const title = content.title || "Projects";
  const description = content.description || "Personal projects and hobby explorations";

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">{title}</h2>
          <p className="text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <Link key={project.slug} to={`/projects/${project.slug}`}>
              <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card border-border group cursor-pointer h-full">
                <div className={`w-full h-2 rounded-full mb-6 ${colorClasses[index % colorClasses.length]}`}></div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="h-4 w-4" />
                  {formatDate(project.date)}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3 flex items-center justify-between">
                  {project.title}
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                  {project.excerpt}...
                </p>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-muted text-foreground text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center text-muted-foreground">
            No projects yet. Check back soon!
          </div>
        )}
      </div>
    </section>
  );
};
