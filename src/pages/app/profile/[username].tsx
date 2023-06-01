import AppLayout from "~/pages/app/AppLayout";
import { useRouter } from "next/router";
import { api, RouterOutputs } from "~/utils/api";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { Image as ImageType } from ".prisma/client";
import ImageCarousel from "~/components/ImageCarousel";
import Link from "next/link";
import Image from "next/image";

type Post = RouterOutputs["posts"]["getMyPosts"] & {
  images?: ImageType[];

}


export default function UserProfilePage() {

  const router = useRouter();


  const { username } = router.query;




  const { data: posts, isLoading:postsLoading, isError:getPostsError } = api.posts.getPostsByUsername.useQuery({ username: username as string});

  const {
    data: userInfo,
    isError: userInfoError,
    isLoading: loadingUserInfo
  } = api.user.getUserInfo.useQuery(
    {
      username: username as string
    }
  );
  console.log(userInfo);

  const imageCarouselRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    if (getPostsError) {
      router.push("/404");
    }
  }, [getPostsError]);

  return (
    <AppLayout>
      <div className="flex flex-col md:gap-4 w-full items-center mb-24 px-5 md:px-0 ">
        {postsLoading && (
          <div className="min-h-screen w-full flex flex-col justify-center items-center gap-6 text-center z-10">
            <h1 className="text-6xl font-bold">
              Loading
              <span className="animate-pulse inline-flex h-3 w-3 rounded-full bg-white ml-2"></span>
              <span className="animate-pulse inline-flex h-3 w-3 rounded-full bg-white ml-2"></span>
              <span className="animate-pulse inline-flex h-3 w-3 rounded-full bg-white ml-2"></span>

            </h1>
          </div>
        )}

        <div
        className={
          "w-full flex  items-center gap-4 p-2 my-4 border-b border-neutral-800 "
        }
        >
          {
            userInfo?.user?.profileImageUrl && (

              <>

                <div className={
                  " flex flex-col gap-y-2"
                }>
                  <Image
                    //a circle avatar
                    width={50}
                    height={50}
                    className="rounded-full border border-neutral-800 bg-zinc-800/30 w-10 md:w-20 aspect-square  "
                    src={userInfo.user.profileImageUrl} alt="" />
                  <h1 className="text-md font-semibold text-neutral-200 hover:underline">{userInfo.user.username}</h1>
                  <button
                    className={
                      "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-semibold md:mx-0 text-md "
                    }
                  >
                    Follow
                  </button>

                </div>
              </>

            )
          }
          <div
          className="ml-auto flex flex-row gap-4 items-center
          "
          >


            <div
            className={
              "flex flex-col gap-1 items-center"
            }
            >
              <h1 className="text-sm font-semibold text-neutral-200">{posts?.length}</h1>
              <h1 className="text-xs font-semibold text-neutral-400">Posts</h1>
            </div>
            <div
            className={
              "flex flex-col gap-1 items-center"
            }
            >
              <h1 className="text-sm font-semibold text-neutral-200">{userInfo?userInfo?.followers?.length:0}</h1>
              <h1 className="text-xs font-semibold text-neutral-400">Followers</h1>
          </div>
          <div
          className={
            "flex flex-col gap-1 items-center"
          }
          >
            <h1 className="text-sm font-semibold text-neutral-200">{userInfo?userInfo?.following?.length:0}</h1>
            <h1 className="text-xs font-semibold text-neutral-400">Following</h1>

          </div>

        </div>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full ">
          {posts?.map((post) => {
              if (post.post.images?.length < 1) {
                return;
              }
              return (
                <div
                  key={post.post.id}
                  className="w-full aspect-square bg-gray-200 rounded-lg overflow-hidden"
                  ref={
                    imageCarouselRef
                  }
                >
                  <ImageCarousel
                    images={
                      post.post.images
                    }
                    containerRef={
                      imageCarouselRef
                    }
                    id={
                      post.post.id
                    }
                  />

                </div>
              );

            }
          )}
        </div>
      </div>

    </AppLayout>
  );
}