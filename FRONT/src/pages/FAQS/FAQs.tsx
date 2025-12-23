"use client";

import { useTranslation } from "react-i18next";
import TopBar from "@/components/Nav/TopBar";
import Header from "@/components/Nav/Header";
import Navigation from "@/components/Nav/Navigation";
import Footer from "@/components/Footer/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * Helper pour corriger l’affichage RTL
 * (numéros + emails toujours en LTR)
 */
const formatTextWithLTR = (text: string) => {
  const regex = /(\+212[\d\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

  return text.split(regex).map((part, index) => {
    if (regex.test(part)) {
      return (
        <span
          key={index}
          dir="ltr"
          style={{ unicodeBidi: "bidi-override" }}
          className="inline-block"
        >
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

const FAQs = () => {
  const { t } = useTranslation();

  const shoppingFaqs = t("faqs.shopping", {
    returnObjects: true,
  }) as { q: string; a: string }[];

  const paymentFaqs = t("faqs.payment", {
    returnObjects: true,
    phone: "+212 6 61 23 45 67",
    email: "contact@sinmat.ma",
  }) as { q: string; a: string }[];

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Header />
      <Navigation />

      {/* Hero Section (image conservée ✅) */}
      <div className="relative h-64 bg-gradient-to-r from-navy to-navy/80 flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 text-center text-black">
          <h1 className="text-5xl font-bold mb-2">
            {t("faqs.title")}
          </h1>
          <p className="text-lg">
            <a href="/" className="hover:text-primary transition-colors">
              {t("faqs.breadcrumb.home")}
            </a>
            {" / "}
            <span>{t("faqs.breadcrumb.faqs")}</span>
          </p>
        </div>
      </div>

      {/* FAQs Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Shopping Information */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              {t("faqs.shoppingTitle")}
            </h2>

            <Accordion type="single" collapsible className="space-y-4">
              {shoppingFaqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`shopping-${index}`}
                  className="border border-border rounded-lg px-4"
                >
                  <AccordionTrigger className="text-right hover:text-primary hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {formatTextWithLTR(faq.a)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Payment Information */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              {t("faqs.paymentTitle")}
            </h2>

            <Accordion type="single" collapsible className="space-y-4">
              {paymentFaqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`payment-${index}`}
                  className="border border-border rounded-lg px-4"
                >
                  <AccordionTrigger className="text-right hover:text-primary hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {formatTextWithLTR(faq.a)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQs;
