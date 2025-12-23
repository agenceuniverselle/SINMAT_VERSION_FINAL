"use client";

import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductTabsProps {
  product: {
    description: string;
    additionalInfo: { label: string; value: string }[];
  };
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue="description" className="w-full">

      {/* TABS HEADER */}
      <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">

        <TabsTrigger
          value="description"
          className="rounded-none border-b-2 border-transparent
          data-[state=active]:border-[#ff6a00]
          data-[state=active]:bg-transparent
          px-6 py-3"
        >
          {t("productTabs.descriptionTab")}
        </TabsTrigger>

        <TabsTrigger
          value="additional"
          className="rounded-none border-b-2 border-transparent
          data-[state=active]:border-[#ff6a00]
          data-[state=active]:bg-transparent
          px-6 py-3"
        >
          {t("productTabs.additionalTab")}
        </TabsTrigger>

        <TabsTrigger
          value="reviews"
          className="rounded-none border-b-2 border-transparent
          data-[state=active]:border-[#ff6a00]
          data-[state=active]:bg-transparent
          px-6 py-3"
        >
          {t("productTabs.reviewsTab", { count: 0 })}
        </TabsTrigger>

        <TabsTrigger
          value="shipping"
          className="rounded-none border-b-2 border-transparent
          data-[state=active]:border-[#ff6a00]
          data-[state=active]:bg-transparent
          px-6 py-3"
        >
          {t("productTabs.shippingTab")}
        </TabsTrigger>

      </TabsList>

      {/* DESCRIPTION */}
      <TabsContent value="description" className="py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              {t("productTabs.descriptionTitle")}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </TabsContent>

      {/* ADDITIONAL INFO */}
      <TabsContent value="additional" className="py-8">
        <div className="max-w-2xl">
          {product.additionalInfo.length > 0 ? (
            <table className="w-full">
              <tbody>
                {product.additionalInfo.map((info, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 font-semibold text-sm w-1/3">
                      {info.label}
                    </td>
                    <td
                      dir="ltr"
                      className="py-3 text-sm text-muted-foreground"
                    >
                      {info.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("productTabs.noAdditionalInfo")}
            </p>
          )}
        </div>
      </TabsContent>

      {/* REVIEWS */}
      <TabsContent value="reviews" className="py-8">
        <p className="text-muted-foreground">
          {t("productTabs.noReviews")}
        </p>
      </TabsContent>

      {/* SHIPPING */}
      <TabsContent value="shipping" className="py-8">
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {t("productTabs.shippingText")}
        </p>
      </TabsContent>

    </Tabs>
  );
};

export default ProductTabs;
