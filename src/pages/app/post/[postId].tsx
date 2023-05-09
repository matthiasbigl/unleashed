import { useRouter } from "next/router";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { api, RouterOutputs } from "~/utils/api";
import AppLayout from "~/pages/app/AppLayout";
import ImageCarousel from "~/components/ImageCarousel";
import { Image as ImageType, Like } from ".prisma/client";
import { User } from "next-auth";
import Link from "next/link";
import Image from "next/image";

;

type PostData = RouterOutputs["posts"]["getPost"] & {
  post: {
    images?: ImageType[];
    likes?: Like[];
  }
}

const PostDetails = ({ props: postData }: { props: PostData }) => {

  const post = postData.post;
  const user = postData.user;


  const imageCarouselContainer = useRef<HTMLDivElement>(null);


  return (
    <div
      className="flex justify-center items-center min-h-screen w-full "
    >
      <div
        className="border-neutral-800 border bg-zinc-800/30 w-2/3 aspect-video flex rounded-lg p-2"
      >
        <div
          className={
            "w-2/3 h-full bg-green-500 rounded-l-md overflow-hidden relative"
          }
          ref={imageCarouselContainer}
        >
          {
            post.images && (
              <ImageCarousel
                images={post.images}
                containerRef={imageCarouselContainer}
                id={post.id}
                qualtiy={100}
              />
            )
          }
        </div>
        <div className="w-1/3 h-full flex flex-col justify-start items-center px-4 my-2">
          <div className="flex flex-row items-center justify-center w-full h-12 px-4 my-2">

            <Link href={"/app/profile/" + user.username}
                  className="text-lg font-semibold hover:underline">{user.username}</Link>
            <div
              className="flex flex-row items-center justify-end w-full h-full px-4 gap-x-4"
            >
              <Image
                //a circle avatar
                width={40}
                height={40}
                className="rounded-full border border-neutral-800 bg-zinc-800/30 w-10 h-10"
                src={user.profileImageUrl} alt={user.username} />
            </div>
          </div>
          <h2 className="text-xl font-semibold ">{post.caption}</h2>

        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <AppLayout>
    <div className="min-h-screen w-full flex flex-col justify-center items-center gap-6 text-center z-50">
      <h1 className="text-6xl font-bold">
        Loading
        <span className="animate-pulse inline-flex h-3 w-3 rounded-full bg-white ml-2"></span>
        <span className="animate-pulse inline-flex h-3 w-3 rounded-full bg-white ml-2"></span>
        <span className="animate-pulse inline-flex h-3 w-3 rounded-full bg-white ml-2"></span>
      </h1>
    </div>
  </AppLayout>
);

const ErrorMessage = ({ error }: { error: string }) => (
  <AppLayout>
    <div className="min-h-screen w-full flex flex-col justify-center items-center gap-6 text-center z-50">
      <h1 className="text-6xl font-bold text-red-500">
        {error}
      </h1>
    </div>
  </AppLayout>
);

export default function PostDetailed() {
  const router = useRouter();
  const { postId } = router.query;

  //check if the post id only contains numbers else return an error message
  const isValidID = (ID: string) => {
    return /^\d+$/.test(ID);
  };

  if (!isValidID(String(postId))) {
    return <ErrorMessage error="invalid ID" />;
  }

  const { data, isError, error, isLoading } = api.posts.getPost.useQuery({
    id: Number(postId)
  });

  if ((isError || !data) && !isLoading) {
    return <ErrorMessage error={
      error?.message || "Something went wrong"
    } />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const post = data as PostData;


  return <PostDetails props={post} />;
}
