import { useState } from "react";
import { ZoomIn } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      <div className="flex flex-col gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
              selectedImage === index
                ? "border-[#ff6a00]"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <img
              src={image}
              alt={`${productName} ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 relative group">
        <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 border">
          <img
            src={images[selectedImage]}
            alt={productName}
            className="w-full h-full object-cover"
          />
        </div>
        <button className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100">
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default ProductGallery;
