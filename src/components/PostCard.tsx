import React, { useState } from "react";
import { Image, Post } from ".prisma/client";
import { RouterOutputs } from "~/utils/api";
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';


// extend the Post type with an array of images
type PostWithImagesAndUser = RouterOutputs["posts"]["getLatest"][number]
//
export default function PostCard(props: PostWithImagesAndUser) {
  console.log(props);
  return (
    <div className="flex flex-col rounded-md border border-neutral-800 bg-zinc-800/30 w-2/3 ">
      <div className="flex flex-row items-center justify-center w-full h-12 px-4 my-2 ">
        <h1 className="text-lg font-semibold">{props.user.username}</h1>
        <div
          className="flex flex-row items-center justify-end w-full h-full px-4 gap-x-4"
        >
          <img
            //a circle avatar
            className="rounded-full border border-neutral-800 bg-zinc-800/30 w-10 h-10"
            src={props.user.profileImageUrl} />
        </div>
      </div>
      {
        props.post.images?(
            <ImageCarousel images={props.post.images} />
        )
          : null
      }


    </div>
  );

}

function ImageCarousel ({images}: {images: Image[]}) {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className='max-w-[1400px] h-[600px] w-full m-auto pt-2 pb-16 px-4 relative group'>
      <div
        style={{ backgroundImage: `url(${images[currentIndex].url})` }}
        className='w-full h-full rounded-sm bg-center bg-contain duration-300'
      ></div>
      {/* Left Arrow */}
      <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
        <BsChevronCompactLeft onClick={prevSlide} size={30} />
      </div>
      {/* Right Arrow */}
      <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
        <BsChevronCompactRight onClick={nextSlide} size={30} />
      </div>
      <div className='flex top-4 justify-center py-2'>

        {
          images.map((image, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className='text-2xl cursor-pointer'
          >
            <RxDotFilled />
          </div>
        ))}
      </div>
    </div>
  );
}
