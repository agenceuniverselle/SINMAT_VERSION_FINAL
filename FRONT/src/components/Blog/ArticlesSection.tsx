import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Article {
  id: number | string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  category: string;
  created_at: string;
}

/** ✅ URLs dynamiques */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const ArticlesSection = () => {
  const { t } = useTranslation();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/blog-posts`)
      .then((res) => res.json())
      .then((data) => {
        const latest = data
          .sort(
            (a: Article, b: Article) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 3)
          .map((article: Article) => ({
            ...article,
            image: article.image?.startsWith("http")
              ? article.image
              : `${APP_BASE_URL}/storage/${article.image}`,
          }));

        setArticles(latest);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des articles :", err);
      });
  }, []);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {t("articles.sectionTitle").toUpperCase().replace(/ /g, " ")}
              <span className="text-[#ff6a00]"> </span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {t("articles.sectionSubtitle")}
            </p>
          </div>
          <Link
            to="/blog"
            className="mt-4 md:mt-0 text-sm font-semibold text-gray-800 border-b-2 border-[#ff6a00] hover:text-[#ff6a00] transition duration-200"
          >
            {t("articles.seeAll")}
          </Link>
        </div>

        {/* Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => {
            const formattedDate = new Date(
              article.created_at
            ).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });

            return (
              <Card
                key={article.id}
                className="group overflow-hidden border hover:shadow-xl transition-all flex flex-col"
              >
                <div className="relative overflow-hidden h-56">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                      {article.category}
                    </span>
                  </div>
                </div>

                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {article.author}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary group/btn mt-auto self-start"
                    asChild
                  >
                    <Link to={`/blog/${article.id}`}>
                      {t("articles.readMore")}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="hover:bg-primary hover:text-primary-foreground"
            asChild
          >
            <Link to="/blog">{t("articles.seeAll")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
