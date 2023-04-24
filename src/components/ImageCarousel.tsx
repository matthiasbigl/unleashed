import { useState, useEffect, useRef } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import NextImage from "next/image";
import { Image as ImageType } from "@prisma/client";
import { useSwipeable } from "react-swipeable";

type ImageCarouselProps = {
  images: ImageType[];
};

type ImageDimension = {
  width: number;
  height: number;
};

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dimensions, setDimensions] = useState<ImageDimension>({
    width: 0,
    height: 0
  });


  const handlers = useSwipeable({
    onSwipedRight: () => prevSlide(),
    onSwipedLeft: () => nextSlide(),
    trackMouse: true

  });

  useEffect(() => {
    if (!containerRef.current) return;
    const img = new Image();
    images[0]?.url && (img.src = images[0].url);
    console.log(img.src);
    img.onload = () => {
      setDimensions({
          width: img.width,
          height: img.height
        }
      );
    };
  }, [images, containerRef.current]);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      <div {...handlers}>
        <NextImage
          src={images[currentIndex]?.url || ""}
          alt={`Image ${currentIndex + 1}`}
          width={dimensions.width}
          height={dimensions.height}
          className="transition-opacity duration-500 ease-out"
          style={{ opacity: 1, transition: "opacity 0.5s ease-in-out" }}
        />

        <div className="hidden md:block">
          <div className="absolute top-0 bottom-0 left-0 flex items-center">
            <button
              className="w-6 h-6 ml-2 text-white bg-gray-500 rounded-full"
              onClick={() => prevSlide()}
            >
              <BsChevronCompactLeft className="w-3 h-3 m-auto" />
            </button>
          </div>
          <div className="absolute top-0 bottom-0 right-0 flex items-center">
            <button
              className="w-6 h-6 mr-2 text-white bg-gray-500 rounded-full"
              onClick={() => nextSlide()}
            >
              <BsChevronCompactRight className="w-3 h-3 m-auto" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 mb-4">
          <div className="w-full flex justify-center items-center">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-1 mx-1 rounded-full ${index === currentIndex ? "bg-blue-500" : "bg-white"}`}
                onClick={() => goToSlide(index)}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );


}