import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { formatDate, type PageContent } from '@/lib/markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

interface BlogPostTemplateProps {
  content: PageContent;
}

export const BlogPostTemplate = ({ content }: BlogPostTemplateProps) => {
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
            <article className="prose prose-lg max-w-none dark:prose-invert">
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
