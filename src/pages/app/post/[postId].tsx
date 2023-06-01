import { useRouter } from "next/router";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { api, RouterOutputs } from "~/utils/api";
import AppLayout from "~/pages/app/AppLayout";
import ImageCarousel from "~/components/ImageCarousel";
import { Image as ImageType, Like } from ".prisma/client";
import { User } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import { BsChat, BsHeart, BsHeartFill } from "react-icons/bs";
import { useUser } from "@clerk/nextjs";
import PostView from "~/components/PostView";

;

type PostData = RouterOutputs["posts"]["getPost"]



const LoadingSpinner = () => (
  <AppLayout>
    <div className="min-h-screen w-full flex flex-col justify-center items-center gap-6 text-center z-10">
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
    <div className="min-h-screen w-full flex flex-col justify-center items-center gap-6 text-center z-10">
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


  return <PostView props={post} />;
}
