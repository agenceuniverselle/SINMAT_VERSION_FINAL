"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
} from "lucide-react";

import TopBar from "@/components/Nav/TopBar";
import Header from "@/components/Nav/Header";
import Navigation from "@/components/Nav/Navigation";
import Footer from "@/components/Footer/Footer";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BlogCard, BlogArticle } from "@/components/Blog/BlogCard";

export default function BlogPost() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [related, setRelated] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/blog-posts/${id}`);
        if (!res.ok) throw new Error();

        const data = await res.json();

        const formattedArticle: BlogArticle = {
          id: data.id.toString(),
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          image: data.image?.startsWith("http")
            ? data.image
            : `http://localhost:8000/storage/${data.image}`,
          category: data.category,
          author: data.author,
          read_time: data.read_time,
          created_at: data.created_at,
        };

        setArticle(formattedArticle);

        const allRes = await fetch("http://localhost:8000/api/blog-posts");
        const allData = await allRes.json();

        const relatedArticles: BlogArticle[] = allData
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((a: any) => a.id.toString() !== id && a.category === data.category)
          .slice(0, 3)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((a: any) => ({
            id: a.id.toString(),
            title: a.title,
            excerpt: a.excerpt,
            content: a.content,
            image: a.image?.startsWith("http")
              ? a.image
              : `http://localhost:8000/storage/${a.image}`,
            category: a.category,
            author: a.author,
            read_time: a.read_time,
            created_at: a.created_at,
          }));

        setRelated(relatedArticles);
      } catch {
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t("blog.loading")}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">{t("blog.notFound")}</h1>
          <Button asChild>
            <Link to="/blog">{t("blog.backToList")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(article.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <Navigation />

      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" asChild>
          <Link to="/blog" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("blog.backToList")}
          </Link>
        </Button>
      </div>

      <div className="container mx-auto px-4 mb-8">
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className="absolute top-6 left-6 bg-primary text-primary-foreground">
            {article.category}
          </Badge>
        </div>
      </div>

      <article className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="text-sm">{article.author}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {article.read_time} {t("blog.minutes")}
              </span>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              <Share2 className="h-4 w-4 mr-2" />
              {t("blog.share")}
            </Button>
          </div>

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <Card className="mt-12 bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-3">
                {t("blog.cta.title")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("blog.cta.subtitle")}
              </p>
              <Button size="lg" asChild>
                <Link to="/Contact">{t("blog.cta.button")}</Link>
              </Button>
            </CardContent>
          </Card>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-8">
                {t("blog.related")}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {related.map((a) => (
                  <BlogCard key={a.id} article={a} />
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
}
