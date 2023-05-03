import React, { PropsWithChildren, useEffect, useState } from "react";
import { Image as ImageType, Like } from ".prisma/client";
import { RouterOutputs } from "~/utils/api";
import { BsChat, BsFillSendFill, BsHeart, BsHeartFill } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import ImageCarousel from "~/components/ImageCarousel";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import Image from "next/image"
import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import { Props } from "next/script";
import { classNames } from "@react-buddy/ide-toolbox/dist/util/classNames";
import Link from "next/link";





type PostWithImagesAndUser = RouterOutputs["posts"]["getLatest"][number] & {
  post: {
    images?: ImageType[];
    likes?: Like[];
  };
};


export default function PostCard(props: PostWithImagesAndUser) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const user = useUser();

  useEffect(() => {
    //check if the user has liked this post
    setLikeCount(props.post.likeCount);
    if (props.post.likes) {
      const hasLiked = props.post.likes.find((like) => like.userId === user.user?.id);
      if (hasLiked) {
        setIsLiked(true);
      }
    }

  }, [user.user?.id]);


  const { mutate } = api.posts.like.useMutation({});


  const handleLikeClick = () => {
    if (user.isSignedIn)
      setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    mutate({
      postId: props.post.id
    });

  };


  return (
    <div
      className="flex flex-col md:rounded-md md:border border-b border-neutral-800 bg-zinc-800/30 md:w-1/4  w-screen ">
      <div className="flex flex-row items-center justify-center w-full h-12 px-4 my-2">

        <Link href={"/app/profile/"+props.user.username} className="text-lg font-semibold hover:underline">{props.user.username}</Link>
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
        props.post.images ? (
          <ImageCarousel images={props.post.images} caption={props.post.caption?props.post.caption:""} />
          )
          : null
      }
      <div className="flex flex-row items-center justify-between px-4 py-2">
        <div className="flex flex-row items-center gap-x-4">
          <button className="focus:outline-none" onClick={handleLikeClick}>
            {isLiked ? (
              <BsHeartFill className="text-red-500 text-2xl" />
            ) : (
              <BsHeart className="text-gray-500 text-2xl" />
            )}
          </button>
          <button className="focus:outline-none">
            <BsChat className="text-gray-500 text-2xl" />
          </button>

        </div>

      </div>
      <div className="flex flex-col items-start justify-start px-4 py-2">
        <span className="text-gray-500 text-sm">{likeCount} likes</span>
        <div className={`flex flex-row items-start justify-start gap-x-2`}>
          <span className="text-gray-500 text-sm font-semibold  ">{props.user.username}</span>
          <span className="text-gray-500 text-sm">{props.post.caption}</span>
        </div>
      </div>


    </div>
  );

}


// @ts-ignore