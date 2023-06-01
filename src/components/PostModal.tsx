import React, { useEffect } from "react";
import PostView from "./PostView";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

type PostModalProps = {
  closeModal: () => void;
  id: number;
};

const PostModal: React.FC<PostModalProps> = ({ closeModal, id }) => {

  const router = useRouter();


  const { data, isLoading } = api.posts.getPost.useQuery({
    id: id
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-50 w-full">
        <span
          className="absolute top-10 right-10 text-white text-5xl cursor-pointer"
          onClick={closeModal}
        >
          &times;
        </span>
        {isLoading ? (
          <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-6xl font-bold">
              Loading
              <span className="animate-pulse inline-flex h-3 w-3 rounded-full bg-white ml-2"></span>
              <span className="animate-pulse inline-flex h-3 w-3 rounded-full bg-white ml-2"></span>
              <span className="animate-pulse inline-flex h-3 w-3 rounded-full bg-white ml-2"></span>
            </h1>
          </div>
        ) : data ? (
          <PostView props={data} />
        ) : (
          <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-6xl font-bold text-red-500">
              Something went wrong
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostModal;
