import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { formatDate, type Post } from '@/lib/markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

interface ProjectSubPageTemplateProps {
  content: Post;
  projectSlug: string;
}

export const ProjectSubPageTemplate = ({ content }: ProjectSubPageTemplateProps) => {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl sm:text-4xl font-bold mb-4">
              {content.metadata.title}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(content.metadata.date)}</span>
              </div>
              {content.metadata.tags && content.metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {content.metadata.tags.map((tag: string) => (
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
