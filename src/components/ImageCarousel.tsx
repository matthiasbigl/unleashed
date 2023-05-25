import React, { useState, useRef, useEffect } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import NextImage from "next/image";
import { Image as ImageType } from "@prisma/client";
import { useSwipeable } from "react-swipeable";
import debounce from "lodash.debounce";
import Link from "next/link";

type ImageCarouselProps = {
  images: ImageType[];
  caption?: string;
  id: number;
  containerRef: React.RefObject<HTMLDivElement>

  quality?: number;


};


const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, caption, id, containerRef ,quality}) => {

  if (!images) return null;

  if (quality === undefined) quality = 10;

  const dragableRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
//get the height of the container
  const [height, setHeight] = useState(0);
  useEffect(() => {
      if (containerRef.current) {
        setHeight(containerRef.current.clientHeight);
      }
    }
    , [containerRef.current]);


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

    <div {...handlers}
      //set the height of the container
      className={`relative overflow-hidden`}
         style={{ height: `${height}px` }}
         ref={dragableRef}>

      {images.map((image, index) => (

        <Link
          href={`/app/post/${id}`}
          key={image.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-150 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >

          <NextImage
            src={`https://unleashed-images.s3.eu-central-1.amazonaws.com/${image.url}`}
            alt={caption ? caption : ""}
            fill
            quality={quality}
            priority={index === currentIndex}
            className="object-contain z-10 backdrop-blur-2xl shadow-2xl"
          />
          <NextImage
            src={`https://unleashed-images.s3.eu-central-1.amazonaws.com/${image.url}`}
            alt={caption ? caption : ""}
            fill
            quality={1}
            className="object-cover"
          />
        </Link>
      ))}


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

  );
};

export default ImageCarousel;