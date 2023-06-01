import AppLayout from "~/pages/app/AppLayout";
import { useRouter } from "next/router";
import { api, RouterOutputs } from "~/utils/api";
import PostCard from "~/components/PostCard";
import { MutableRefObject, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { Image as ImageType } from ".prisma/client";
import ImageCarousel from "~/components/ImageCarousel";

type Post = RouterOutputs["posts"]["getMyPosts"] & {
  images?: ImageType[];
}


export default function UserProfilePage() {

  const router = useRouter();

  const user = useUser();


  const { data: posts, isLoading: postsLoading, isError: getPostsError } = api.posts.getMyPosts.useQuery<[Post]>();

  const {
    data: socialCon,
    isError: SocialConError,
    isLoading: loadingSocialCons
  } = api.user.getSocialConnections.useQuery(
    {
      userId: user.user ? user.user.id : ""
    }
  );

  const imageCarouselRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    if (getPostsError) {
      router.push("/404");
    }
  }, [getPostsError]);

  return (
    <AppLayout>
      <div className="flex flex-col md:gap-4 w-full items-center mb-24 ">
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

        <div className="grid grid-cols-3 gap-5 w-full">
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