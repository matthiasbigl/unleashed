import React, { useState, useEffect, useRef } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import NextImage from "next/image";
import { Image as ImageType } from "@prisma/client";
import { useSwipeable } from "react-swipeable";
import debounce from "lodash.debounce";

type ImageCarouselProps = {
  images: ImageType[];
};

type ImageDimension = {
  width: number;
  height: number;
};

const ImageCarousel = React.memo(({ images }: ImageCarouselProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dimensions, setDimensions] = useState<ImageDimension>({
    width: 0,
    height: 0,
  });



  useEffect(() => {
    if (!containerRef.current) return;

    const img = new Image();
    const firstImageUrl = images[0]?.url;
    if (firstImageUrl) {
      img.src = "https://unleashed-images.s3.eu-central-1.amazonaws.com/" + firstImageUrl;
      img.onload = () => {
        const { width, height } = img;
        setDimensions({ width, height });
      };
    }
  }, [images]);

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
    trackMouse: true,
  });

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div {...handlers} className={``}>
        <NextImage
          src={
            "https://unleashed-images.s3.eu-central-1.amazonaws.com/" +
            images[currentIndex]?.url ||
            "haha"
          }

          alt={`Image ${currentIndex + 1}`}
          width={dimensions.width}
          height={dimensions.height}
          className=""
          style={{ opacity: 1, transition: "opacity 0.5s ease-in-out" }}
          priority={true}
        />

        <div className="hidden md:block">
          <div className="absolute top-0 bottom-0 left-0 flex items-center">
            <button
              className="w-6 h-6 ml-2 text-white bg-gray-500 rounded-full"
              onClick={prevSlide}
            >
              <BsChevronCompactLeft className="w-3 h-3 m-auto" />
            </button>
          </div>
          <div className="absolute top-0 bottom-0 right-0 flex items-center">
            <button
              className="w-6 h-6 mr-2 text-white bg-gray-500 rounded-full"
              onClick={nextSlide}
            >
              <BsChevronCompactRight className="w-3 h-3 m-auto" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-
        0 right-0 flex items-center justify-center w-full h-12 bg-black bg-opacity-50">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 mx-1 text-white rounded-full ${
                index === currentIndex ? "bg-white" : "bg-gray-500"
              }`}
              onClick={() => goToSlide(index)}
            >
              <RxDotFilled className="w-3 h-3 m-auto" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export default ImageCarousel;