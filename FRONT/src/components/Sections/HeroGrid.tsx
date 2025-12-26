import { Button } from "@/components/ui/button";
import lawnMowerImg from "/images/scie-circulaire.jpg";
import safetyEquipmentImg from "@/assets/safety-equipment.jpg";
import vacuumCleanerImg from "/images/souffleur.jpg";
import circularSawImg from "/images/perceuse-visseuse.jpg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HeroGrid = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isRTL = document.documentElement.dir === "rtl";

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ===== Featured Circular Saw ===== */}
        <div className="lg:col-span-2 bg-muted rounded-lg overflow-hidden group cursor-pointer">
          <div
            className={`relative min-h-[360px] md:min-h-[420px] lg:h-[500px]
            flex flex-col lg:flex-row items-center justify-between
            p-6 md:p-8 lg:p-12 ${isRTL ? "lg:flex-row-reverse" : ""}`}
          >
            {/* Texte */}
            <div
              className={`z-10 max-w-full lg:max-w-md ${
                isRTL ? "text-right lg:pe-6" : "text-left lg:ps-6"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                {t("heroGrid.specialOffer")}
              </p>

              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {t("heroGrid.circularSawTitle")}
              </h2>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t("heroGrid.circularSawDescription")}
              </p>

              <Button
                variant="link"
                className="text-foreground text-base md:text-lg p-0 h-auto font-medium"
                onClick={() => navigate("/catalogue")}
              >
                {t("heroGrid.discoverCatalog")}
                <span className="ml-2">→</span>
              </Button>
            </div>

            {/* Image */}
            <img
              src={lawnMowerImg}
              alt="Scie circulaire"
              className={`w-full max-w-[280px] sm:max-w-[360px] lg:w-[60%]
              h-auto lg:h-full object-contain transition-transform duration-500
              group-hover:scale-105 ${
                isRTL ? "lg:order-first lg:me-6" : "lg:order-last lg:ms-6"
              }`}
            />
          </div>
        </div>

        {/* ===== Safety Equipment ===== */}
        <div className="bg-muted rounded-lg overflow-hidden group cursor-pointer">
          <div className="relative min-h-[360px] md:min-h-[420px] lg:h-[500px] flex flex-col justify-between p-6 md:p-8">
            <div className={`${isRTL ? "text-right" : "text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                {t("heroGrid.safetyEquipmentDescription")}
              </p>

              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {t("heroGrid.safetyEquipmentTitle")}
              </h3>

              <Button
                variant="link"
                className="text-foreground text-base md:text-lg p-0 h-auto font-medium"
                onClick={() => navigate("/catalogue")}
              >
                {t("heroGrid.discoverCatalog")}
                <span className="ml-2">→</span>
              </Button>
            </div>

            <img
              src={safetyEquipmentImg}
              alt="Safety Equipment"
              className={`mx-auto w-full max-w-[260px] sm:max-w-[320px]
              object-contain transition-transform duration-500
              group-hover:scale-105 ${
                isRTL ? "self-start" : "self-end"
              }`}
            />
          </div>
        </div>

        {/* ===== Vacuum Cleaner ===== */}
        <div className="bg-muted rounded-lg overflow-hidden group cursor-pointer">
          <div className="relative min-h-[360px] md:min-h-[420px] lg:h-[500px] flex flex-col justify-between p-6 md:p-8">
            <div className={`${isRTL ? "text-right" : "text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                SOUFFLEURS-ASPIRATEURS
              </p>

              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {t("heroGrid.vacuumCleanerTitle")}
              </h3>

              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {t("heroGrid.vacuumCleanerDescription")}
              </p>
            </div>

            <img
              src={vacuumCleanerImg}
              alt="Vacuum Cleaner"
              className={`mx-auto w-full max-w-[260px] sm:max-w-[320px]
              object-contain transition-transform duration-500
              group-hover:scale-105 ${
                isRTL ? "self-start" : "self-end"
              }`}
            />
          </div>
        </div>

        {/* ===== Cordless Drill ===== */}
        <div className="lg:col-span-2 bg-muted rounded-lg overflow-hidden group cursor-pointer">
          <div
            className={`relative min-h-[360px] md:min-h-[420px] lg:h-[500px]
            flex flex-col lg:flex-row items-center justify-between
            p-6 md:p-8 lg:p-12 ${isRTL ? "lg:flex-row-reverse" : ""}`}
          >
            {/* Texte */}
            <div
              className={`z-10 max-w-full lg:max-w-md ${
                isRTL ? "text-right lg:pe-6" : "text-left lg:ps-6"
              }`}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                {t("heroGrid.newItems")}
              </p>

              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                {t("heroGrid.cordlessDrillTitle")}
              </h3>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t("heroGrid.cordlessDrillDescription")}
              </p>

              <Button
                variant="link"
                className="text-foreground text-base md:text-lg p-0 h-auto font-medium"
                onClick={() => navigate("/catalogue")}
              >
                {t("heroGrid.discoverCatalog")}
                <span className="ml-2">→</span>
              </Button>
            </div>

            {/* Image */}
            <img
              src={circularSawImg}
              alt="Cordless Drill"
              className={`w-full max-w-[280px] sm:max-w-[360px] lg:w-[50%]
              h-auto lg:h-full object-contain transition-transform duration-500
              group-hover:scale-105 ${
                isRTL ? "lg:order-first lg:me-6" : "lg:order-last lg:ms-6"
              }`}
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroGrid;
