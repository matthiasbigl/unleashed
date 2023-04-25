import { type NextPage } from "next";
import { api } from "~/utils/api";
import { SignInButton, useUser } from "@clerk/nextjs";
import React, { lazy, Suspense } from 'react';
import AppLayout from "~/pages/app/AppLayout";

const PostCard = lazy(() => import('~/components/PostCard'));

const Feed: NextPage = () => {
  const user = useUser();

  if (!user.isSignedIn&&user.isLoaded) {
    return (
      <AppLayout>
        <div className="min-h-screen w-full flex flex-col justify-center items-center gap-6 text-center z-50">
          <h1 className="text-6xl font-bold">
            It looks like you're not signed in
          </h1>
          <h2 className="text-3xl font-semibold">Sign in to view your feed</h2>
          <div
            className={`flex flex-row items-center justify-center rounded-md bg-gradient-to-r from-blue-400 to-blue-600 w-24 h-10 hover:scale-105 hover:shadow-lg hover:from-blue-500 hover:to-blue-700 transition duration-150 ease-in-out cursor-pointer font-semibold text-lg`}
          >
            <SignInButton />
          </div>
        </div>
      </AppLayout>
    );
  }

  const { data,isLoading } = api.posts.getLatest.useQuery();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen w-full flex flex-col justify-center items-center gap-6 text-center z-50">
          <h1 className="text-6xl font-bold">
            Loading...
          </h1>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col md:gap-4 w-full items-center">
        <Suspense fallback={<div>Loading...</div>}>
          {data?.map((post,id) => (
            <PostCard key={id} {...post} />
          ))}
        </Suspense>
      </div>
    </AppLayout>
  );
};

export default Feed;
