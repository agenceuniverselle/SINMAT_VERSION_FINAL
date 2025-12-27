"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Calendar, Clock, User, ArrowLeft, Share2 } from "lucide-react";

import TopBar from "@/components/Nav/TopBar";
import Header from "@/components/Nav/Header";
import Navigation from "@/components/Nav/Navigation";
import Footer from "@/components/Footer/Footer";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BlogCard, BlogArticle } from "@/components/Blog/BlogCard";

/* ================= API ================= */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function BlogPost() {
  const { t } = useTranslation();
  const { id } = useParams();

  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [related, setRelated] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const buildImageUrl = (img?: string | null) => {
    if (!img) return "/no-image.png";
    if (img.startsWith("http")) return img;
    return `https://sinmat.ma/storage/${img}`;
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_BASE_URL}/api/blog-posts/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();

        const formattedArticle: BlogArticle = {
          id: data.id.toString(),
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          image: buildImageUrl(data.image),
          category: data.category,
          author: data.author,
          read_time: data.read_time,
          created_at: data.created_at,
        };

        setArticle(formattedArticle);

        const allRes = await fetch(`${API_BASE_URL}/api/blog-posts`);
        const allData = await allRes.json();

        const relatedArticles: BlogArticle[] = allData
          .filter(
            (a: any) =>
              a.id.toString() !== id && a.category === data.category
          )
          .slice(0, 3)
          .map((a: any) => ({
            id: a.id.toString(),
            title: a.title,
            excerpt: a.excerpt,
            content: a.content,
            image: buildImageUrl(a.image),
            category: a.category,
            author: a.author,
            read_time: a.read_time,
            created_at: a.created_at,
          }));

        setRelated(relatedArticles);
      } catch {
        setArticle(null);
        setRelated([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;
    const title = article?.title || "SINMAT";

    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert(t("blog.copiedLink"));
      }
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t("blog.loading")}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-2xl font-bold mb-4">
            {t("blog.notFound")}
          </h1>
          <Button asChild>
            <Link to="/blog">{t("blog.backToList")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(article.created_at).toLocaleDateString(
    "fr-FR",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    /* 🔑 FIX GLOBAL HEADER HEIGHT */
    <div className="min-h-screen bg-background pt-[72px] sm:pt-[88px] lg:pt-0">
      <TopBar />
      <Header />
      <Navigation />

      {/* BACK BUTTON */}
      <div className="container mx-auto px-4 py-4">
        <Button variant="ghost" asChild>
          <Link to="/blog" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("blog.backToList")}
          </Link>
        </Button>
      </div>

      {/* HERO IMAGE */}
      <div className="container mx-auto px-4 mt-6 sm:mt-8 lg:mt-12 mb-10">
        <div className="relative h-[220px] sm:h-[300px] md:h-[400px] rounded-lg overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-primary text-primary-foreground">
            {article.category}
          </Badge>
        </div>
      </div>

      {/* CONTENT */}
      <article className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
            {article.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 sm:gap-6 mb-8 pb-8 border-b">
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

            <Button
              variant="outline"
              size="sm"
              className="sm:ml-auto"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              {t("blog.share")}
            </Button>
          </div>

          <div
            className="prose prose-base sm:prose-lg max-w-none mt-6"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <Card className="mt-12 bg-primary/5 border-primary/20">
            <CardContent className="p-6 sm:p-8 text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-3">
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
              <h2 className="text-2xl sm:text-3xl font-bold mb-8">
                {t("blog.related")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
