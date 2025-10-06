import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { loadBlogPostsMetadata } from "@/lib/posts";
import { formatDate, type PostMetadata, type PageContent } from "@/lib/markdown";

interface BlogListTemplateProps {
  content: PageContent;
}

export const BlogListTemplate = ({ content }: BlogListTemplateProps) => {
  const [posts, setPosts] = useState<PostMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogPostsMetadata()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const title = content.title || "Blog";
  const description = content.description || "Thoughts on technology, projects, and personal learnings";

  if (loading) {
    return (
      <section id="blog" className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-muted-foreground">Loading posts...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">{title}</h2>
          <p className="text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {posts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`}>
              <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border cursor-pointer group h-full">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.date)}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}...
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center text-muted-foreground">
            No blog posts yet. Check back soon!
          </div>
        )}
      </div>
    </section>
  );
};
