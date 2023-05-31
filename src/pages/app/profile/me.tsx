import AppLayout from "~/pages/app/AppLayout";
import { useRouter } from 'next/router'
import { api } from "~/utils/api";
import PostCard from "~/components/PostCard";
import { useEffect } from "react";

export default function UserProfilePage() {

  const router = useRouter()



  const { data: posts, isLoading, isError } = api.posts.getMyPosts.useQuery();

  useEffect(() => {
    if (isError) {
      router.push("/404")
    }
  }, [isError])

  return (
    <AppLayout>
      <div className="flex flex-col md:gap-4 w-full items-center mb-24 ">
        {isLoading && (
          <div className="min-h-screen w-full flex flex-col justify-center items-center gap-6 text-center z-50">
            <h1 className="text-6xl font-bold">
              Loading
              <span className="animate-pulse inline-flex h-3 w-3 rounded-full bg-white ml-2"></span>
              <span className="animate-pulse inline-flex h-3 w-3 rounded-full bg-white ml-2"></span>
              <span className="animate-pulse inline-flex h-3 w-3 rounded-full bg-white ml-2"></span>

            </h1>
          </div>
        )}
        {posts?.map((post,id) => (
          <PostCard key={id} {...post} />
        ))}
      </div>
    </AppLayout>
  );
}