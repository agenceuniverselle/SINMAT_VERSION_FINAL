import TopBar from "@/components/Nav/TopBar";
import Header from "@/components/Nav/Header";
import Navigation from "@/components/Nav/Navigation";
import HeroGrid from "@/components/Sections/HeroGrid";
import Footer from "@/components/Footer/Footer";
import Avantages from "@/components/Sections/Avantages";
import BestsellerProducts from "@/components/Produit/BestsellerProducts";
import GuideSection from "@/components/Sections/GuideSection";
import ArticlesSection from "@/components/Blog/ArticlesSection";
import NewsletterSection from "@/components/Newsletter/NewsletterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <Navigation />
      <main>
        <HeroGrid />
              <Avantages />
<BestsellerProducts/>
<GuideSection/>
<ArticlesSection/>
      </main>
      <NewsletterSection/>
      <Footer />
    </div>
  );
};

export default Index;
