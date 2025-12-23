import { FaCreditCard, FaHeadset, FaTruck } from 'react-icons/fa';
import { ReactElement } from 'react';
import { useTranslation } from "react-i18next";

type Feature = {
  icon: ReactElement;
  title: string;
  description: string;
};

export default function Avantages() {
  const { t } = useTranslation();

  const features: Feature[] = [
    {
      icon: <FaCreditCard className="text-primary text-3xl" />,
      title: t("advantages.onlinePayment.title"),
      description: t("advantages.onlinePayment.description"),
    },
    {
      icon: <FaHeadset className="text-primary text-3xl" />,
      title: t("advantages.support.title"),
      description: t("advantages.support.description"),
    },
    {
      icon: <FaTruck className="text-primary text-3xl" />,
      title: t("advantages.freeDelivery.title"),
      description: t("advantages.freeDelivery.description"),
    },
  ];

  return (
    <section className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-300 bg-gray-50"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
