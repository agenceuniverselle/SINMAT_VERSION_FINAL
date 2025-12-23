import TopBar from "@/components/Nav/TopBar";
import Header from "@/components/Nav/Header";
import Navigation from "@/components/Nav/Navigation";
import Footer from "@/components/Footer/Footer";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Header />
      <Navigation />

      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-navy to-navy/80 flex items-center justify-center">
<div className="absolute inset-0 bg-[url('/images/cover-droguerie.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl text-black font-bold mb-2">{t("about.heroTitle")}</h1>
          <p className="text-lg text-black">
          {t("about.heroBreadcrumb")}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">{t("about.sectionTitle")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
            {t("about.p1")}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
             {t("about.p2")}
            </p>
            <p className="text-muted-foreground leading-relaxed">
             {t("about.p3")}
            </p>
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg">
           <img
  src="/images/produits-droguerie.jpg"
  alt="À propos de Sinmat"
  className="w-full h-full object-cover"
/>

          </div>
        </div>
        
      </div>
      
      {/* Info Section */}
      <div className="w-full px-4 pb-10 text-center">
        <p className="text-lg text-muted-foreground mb-2">
        {t("about.infoText")}
        </p>
<p className="text-lg text-orange-500 font-bold text-center">
  {t("about.catalogueCtaPrefix")}{" "}
  <a
    href="/catalogue"
    className="underline hover:text-orange-600 transition-colors"
  >
    {t("about.catalogueCtaLink")}
  </a>
  {" "}!
</p>

      </div>
{/* Map Section */}
<div className="w-full px-4 pb-16">
  <h2 className="text-2xl font-bold mb-12 text-center text-foreground">{t("about.mapTitle")}</h2>
<div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
    <iframe
src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3238.7414378429708!2d-5.855303!3d35.732577000000006!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0b878418c1c6ed%3A0x54a7dddfc406ada0!2sSINMAT%20SARL!5e0!3m2!1sfr!2sma!4v1764066789952!5m2!1sfr!2sma"      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</div>

      <Footer />
    </div>
  );
};

export default About;
