import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
export interface BlogArticle {
  id: string | number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  read_time: string;
  created_at: string;
}

interface BlogCardProps {
  article: BlogArticle;
}

export function BlogCard({ article }: BlogCardProps) {
  const { t } = useTranslation();
  const imageUrl = article.image?.startsWith("http")
    ? article.image
    : `http://localhost:8000/storage/${article.image}`;

  const formattedDate = new Date(article.created_at).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
            {article.category}
          </Badge>
        </div>
      </CardHeader>

      {/* Flex-grow sur CardContent pour pousser le footer vers le bas */}
      <CardContent className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-3 line-clamp-2 hover:text-primary transition-colors">
          <Link to={`/blog/${article.id}`}>{article.title}</Link>
        </h3>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {article.excerpt}
        </p>

        <div className="mt-auto space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-gray-500">•</span>
            <span>{article.read_time} min</span>
          </div>
        </div>
      </CardContent>

     <CardFooter className="p-6 pt-0 mt-auto">
  <Button asChild variant="outline" className="w-full">
    <Link to={`/blog/${article.id}`}>
      {t("blog.readArticle")}
    </Link>
  </Button>
</CardFooter>

    </Card>
  );
}
