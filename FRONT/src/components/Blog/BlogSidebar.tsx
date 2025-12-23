import { Search, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { BlogArticle } from "./BlogCard";
import { useTranslation } from "react-i18next";
interface BlogSidebarProps {
  latestArticles: BlogArticle[];
  onSearch: (query: string) => void;
  onCategoryClick: (category: string) => void;
}

const categories = [
  "Matériel BTP",
  "Chantier & Sécurité",
  "Construction & Gros œuvre",
  "Guides & Conseil Pro",
  "Nouveaux produits",
  "Études de prix",
];

export function BlogSidebar({ latestArticles, onSearch, onCategoryClick }: BlogSidebarProps) {
   const { t } = useTranslation();
  return (
    <div className="space-y-6 sticky top-6">
      {/* Recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            {t("blog.sidebar.searchTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input
              type="search"
              placeholder="Rechercher un article..."
              className="pr-10"
              onChange={(e) => onSearch(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      {/* Catégories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Tag className="h-5 w-5" />
           {t("blog.sidebar.categories")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => onCategoryClick(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
          {/* Derniers articles */}
<Card>
  <CardHeader>
    <CardTitle className="text-lg">{t("blog.sidebar.latest")}</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {latestArticles
      .sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime())
      .slice(0, 3)
      .map((article) => (
        <Link
          key={article.id}
          to={`/blog/${article.id}`}
          className="flex gap-3 group"
        >
          <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
            <img
              src={
                article.image?.startsWith("http")
                  ? article.image
                  : `http://localhost:8000/storage/${article.image}`
              }
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              {article.author} • {article.read_time} min
            </p>
          </div>
        </Link>
      ))}
  </CardContent>
</Card>


      {/* CTA */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6 text-center space-y-3">
          <h3 className="font-semibold text-lg">{t("blog.sidebar.ctaTitle")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("blog.sidebar.ctaDescription")}
          </p>
          <Button asChild className="w-full">
            <Link to="/Contact">{t("blog.sidebar.ctaButton")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
