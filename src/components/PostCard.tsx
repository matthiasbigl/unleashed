import React, { useEffect, useState } from "react";
import { Image, Like } from ".prisma/client";
import { RouterOutputs } from "~/utils/api";
import { BsChat, BsFillSendFill, BsHeart, BsHeartFill } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import ImageCarousel from "~/components/ImageCarousel";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";


type PostWithImagesAndUser = RouterOutputs["posts"]["getLatest"][number] & {
  post: {
    images?: Image[];
    likes?: Like[];
  };
};


export default function PostCard(props: PostWithImagesAndUser) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const user = useUser();

  useEffect(() => {
    //check if the user has liked this post
    if (props.post.likes) {
      setIsLiked(props.post.likes.some(like => like.userId === user.user?.id));
    }
    setLikeCount(props.post.likes?.length ?? 0);

  }, [props.post.likes, user.user?.id]);




  const { mutate } = api.posts.like.useMutation({
    onSuccess: () => {
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    }
  });


  const handleLikeClick = () => {
    if (user.isSignedIn)
      mutate({
        postId: props.post.id
      });

  };


  return (
    <div
      className="flex flex-col md:rounded-md md:border border-b border-neutral-800 bg-zinc-800/30 md:w-1/4  w-screen ">
      <div className="flex flex-row items-center justify-center w-full h-12 px-4 md:my-2 ">
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
        props.post.images ? (
            <ImageCarousel images={props.post.images} />
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
        <div className={`flex flex-row items-center justify-start gap-x-2`}>
          <span className="text-gray-500 text-sm font-semibold">{props.user.username}</span>
          <span className="text-gray-500 text-sm">{props.post.caption}</span>
        </div>
      </div>


    </div>
  );

}
