import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Shield, CheckCircle, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

const GuideSection = () => {
  const { t } = useTranslation();

  const guides = [
    {
      icon: Wrench,
      title: t("guide.items.tool.title"),
      description: t("guide.items.tool.description"),
    },
    {
      icon: Shield,
      title: t("guide.items.safety.title"),
      description: t("guide.items.safety.description"),
    },
    {
      icon: CheckCircle,
      title: t("guide.items.quality.title"),
      description: t("guide.items.quality.description"),
    },
    {
      icon: Award,
      title: t("guide.items.expert.title"),
      description: t("guide.items.expert.description"),
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-2">
            {t("guide.sectionTitle")}
          </h2>
          <p className="text-muted-foreground">
            {t("guide.sectionSubtitle")}
          </p>
        </div>

        {/* GUIDES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((guide, index) => {
            const Icon = guide.icon;
            return (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow border-2 hover:border-primary/50"
              >
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {guide.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {guide.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-4">
                {t("guide.cta.title")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("guide.cta.description")}
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>{t("guide.cta.benefits.consultation")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>{t("guide.cta.benefits.quote")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>{t("guide.cta.benefits.support")}</span>
                </li>
              </ul>
            </div>

            <div className="relative h-64 lg:h-full min-h-[300px]">
              <img
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600"
                alt="Expert consultation"
                className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default GuideSection;
