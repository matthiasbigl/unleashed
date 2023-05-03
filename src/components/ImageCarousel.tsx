import React, { useState, useRef } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import NextImage from "next/image";
import { Image as ImageType } from "@prisma/client";
import { useSwipeable } from "react-swipeable";
import debounce from "lodash.debounce";

type ImageCarouselProps = {
  images: ImageType[];
  caption?: string;
};


const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, caption }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const isFirstSlide = prevIndex === 0;
      return isFirstSlide ? images.length - 1 : prevIndex - 1;
    });
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const isLastSlide = prevIndex === images.length - 1;
      return isLastSlide ? 0 : prevIndex + 1;
    });
  };

  const handlers = useSwipeable({
    onSwipedRight: debounce(prevSlide, 300),
    onSwipedLeft: debounce(nextSlide, 300),
    trackMouse: true
  });

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div {...handlers} className={"relative h-96"}>
        <div>
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-150 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <NextImage
                src={`https://unleashed-images.s3.eu-central-1.amazonaws.com/${image.url}`}
                alt={caption ? caption : ""}
                placeholder="blur"
                fill
                quality={30}
                priority={index === currentIndex}
                className="object-contain z-10 backdrop-blur-lg"
              />
              <NextImage
                src={`https://unleashed-images.s3.eu-central-1.amazonaws.com/${image.url}`}
                alt={caption ? caption : ""}
                fill
                quality={1}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {
          images.length > 1 && (
            <>
              <div className="hidden md:flex absolute top-0 bottom-0 left-0 flex justify-center z-10">
                <button
                  className="w-6 h-6 ml-2 mt-auto mb-auto text-white bg-gray-500 rounded-full"
                  onClick={prevSlide}
                >
                  <BsChevronCompactLeft className="w-3 h-3 m-auto" />
                </button>
              </div>
              <div className="hidden md:flex absolute top-0 bottom-0 right-0 flex justify-center z-10">
                <button
                  className="w-6 h-6 mr-2 mt-auto mb-auto text-white bg-gray-500 rounded-full"
                  onClick={nextSlide}
                >
                  <BsChevronCompactRight className="w-3 h-3 m-auto" />
                </button>
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 flex items-center justify-center w-full h-12 bg-black bg-opacity-50 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3
              h-3 mx-1
              text-white rounded-full
              ${index === currentIndex ? "bg-white" : "bg-gray-500"}`}
                    onClick={() => goToSlide(index)}
                  >
                    <RxDotFilled className="w-full h-full m-auto" />
                  </button>
                ))}
              </div>
            </>
          )
        }


      </div>
    </div>
  );
};

export default ImageCarousel;