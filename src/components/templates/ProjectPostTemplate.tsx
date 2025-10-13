import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { formatDate, type PageContent, type PostMetadata } from '@/lib/markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText } from 'lucide-react';
import { loadProjectSubPages } from '@/lib/posts';

interface ProjectPostTemplateProps {
  content: PageContent;
}

export const ProjectPostTemplate = ({ content }: ProjectPostTemplateProps) => {
  const { slug } = useParams<{ slug: string }>();
  const [subPages, setSubPages] = useState<PostMetadata[]>([]);
  const [loadingSubPages, setLoadingSubPages] = useState(true);

  useEffect(() => {
    if (slug) {
      loadProjectSubPages(slug)
        .then(setSubPages)
        .catch(console.error)
        .finally(() => setLoadingSubPages(false));
    }
  }, [slug]);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl sm:text-4xl font-bold mb-4">
              {content.title}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(content.date)}</span>
              </div>
              {content.tags && content.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {content.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-p:my-4 prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80 prose-ul:my-4 prose-ol:my-4 prose-li:my-2">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {content.content || ''}
              </ReactMarkdown>
            </article>

            {!loadingSubPages && subPages.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <h2 className="text-2xl font-bold text-foreground mb-6">Related Pages</h2>
                <div className="grid gap-4">
                  {subPages.map((subPage) => (
                    <Link
                      key={subPage.slug}
                      to={`/projects/${slug}/${subPage.slug}`}
                      className="block"
                    >
                      <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                        <div className="flex items-start gap-4">
                          <FileText className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                              {subPage.title}
                            </h3>
                            {subPage.excerpt && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {subPage.excerpt}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {formatDate(subPage.date)}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
