"use client";

import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import TopBar from "@/components/Nav/TopBar";
import Header from "@/components/Nav/Header";
import Navigation from "@/components/Nav/Navigation";
import Footer from "@/components/Footer/Footer";

import {
  Hammer,
  Shield,
  HardHat,
  BookOpen,
  Package,
  Calculator,
  Search,
} from "lucide-react";

import { BlogCard, BlogArticle } from "@/components/Blog/BlogCard";
import { BlogSidebar } from "@/components/Blog/BlogSidebar";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";

/* ================= API ================= */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Blog = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const articlesPerPage = 6;

  /* 🔍 Search (URL + input) */
  const searchTerm =
    searchQuery ||
    new URLSearchParams(location.search).get("search")?.toLowerCase() ||
    "";

  /* ---------------- CATEGORIES ---------------- */
  const blogCategories = useMemo(
    () => [
      { key: "material", icon: Hammer },
      { key: "safety", icon: Shield },
      { key: "structure", icon: HardHat },
      { key: "guides", icon: BookOpen },
      { key: "products", icon: Package },
      { key: "pricing", icon: Calculator },
    ],
    []
  );

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/blog-posts`)
      .then((res) => res.json())
      .then(setArticles)
      .catch(() =>
        console.error("Erreur lors du chargement des articles")
      );
  }, []);

  /* ---------------- FILTER ---------------- */
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm) ||
        article.excerpt.toLowerCase().includes(searchTerm);

      const matchesCategory =
        !selectedCategory || article.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [articles, searchTerm, selectedCategory]);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = filteredArticles.slice(
    startIndex,
    startIndex + articlesPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <Navigation />

      {/* ================= HERO ================= */}
     <section className="bg-gradient-to-br from-dark to-slate py-8 md:py-16">

        <div className="container mx-auto px-4 text-center">
         <h1 className="text-3xl md:text-5xl font-bold text-dark-foreground mb-2">
            {t("blog.title")}
          </h1>
<p className="text-base md:text-xl text-dark-foreground/80 max-w-2xl mx-auto mb-3">

            {t("blog.subtitle")}
          </p>

          {/* 🔍 SEARCH (VISIBLE MOBILE & DESKTOP) */}
          <div className="max-w-xl mx-auto relative mt-2">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("blog.searchPlaceholder")}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="pt-4 md:pt-6 pb-12 bg-card border-b">

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {blogCategories.map(({ key, icon: Icon }) => {
              const label = t(`blog.categories.${key}`);
              const isActive = selectedCategory === label;

              return (
                <button
                  key={key}
                  onClick={() =>
                    setSelectedCategory(isActive ? null : label)
                  }
                  className={`flex flex-col items-center gap-3 p-4 rounded-lg border transition-all
                  hover:border-primary hover:bg-primary/5 ${
                    isActive
                      ? "border-primary bg-primary/10"
                      : "border-border"
                  }`}
                >
                  <Icon
                    className={`h-7 w-7 ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-sm text-center font-medium ${
                      isActive ? "text-primary" : ""
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= ARTICLES ================= */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_350px] gap-8">
            {/* ARTICLES */}
            <div>
              {currentArticles.length === 0 ? (
                <p className="text-muted-foreground">
                  {t("blog.noResults")}
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {currentArticles.map((article) => (
                    <BlogCard key={article.id} article={article} />
                  ))}
                </div>
              )}

              {/* PAGINATION */}
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          onClick={() => setCurrentPage(i + 1)}
                          isActive={currentPage === i + 1}
                          className="cursor-pointer"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((p) =>
                            Math.min(totalPages, p + 1)
                          )
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>

            {/* SIDEBAR (DESKTOP ONLY) */}
            <div className="hidden lg:block">
              <BlogSidebar
                latestArticles={articles}
                onSearch={setSearchQuery}
                onCategoryClick={(cat) =>
                  setSelectedCategory(
                    cat === selectedCategory ? null : cat
                  )
                }
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
