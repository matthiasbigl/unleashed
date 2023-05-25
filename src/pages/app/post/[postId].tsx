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

;

type PostData = RouterOutputs["posts"]["getPost"]


const PostDetails = ({ props: postData }: { props: PostData }) => {

  const user = useUser();

  const post = postData.post;
  const postUser = postData.user;
  const postComments = postData.comments;


  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState(postComments);


  const { mutate } = api.posts.like.useMutation({});
  const commentMutation = api.posts.comment.useMutation({});

  useEffect(() => {
    //check if the user has liked this post
    setLikeCount(post.likeCount);
    if (post.likes) {
      const hasLiked = post.likes.find((like) => like.userId === user.user?.id);
      if (hasLiked) {
        setIsLiked(true);
      }
    }

    // @ts-ignore
    postComments && setComments(postComments);

  }, [user.user?.id]);


  const handleLikeClick = () => {
    if (user.isSignedIn)
      setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    mutate({
      postId: post.id
    });
  };


  const [comment, setComment] = useState("");

  const handleCommentSubmit = () => {
    if (comment.length === 0) return;
    //upload the comment get the response and add it to the comments array
    const commentResponse = commentMutation.mutateAsync(
      {
        postId: post.id,
        content: comment
      }
    ).then((response) => {
        setComments((prevComments) => [...prevComments, response]);
        setComment("");
      }
    );
  };


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
                quality={20}
              />
            )
          }
        </div>
        <div className="w-1/2 h-full flex flex-col justify-start items-center px-4 my-2 ">
          <div
            className="flex flex-row items-center justify-center w-full p-2 gap-2 border-b border-neutral-800 ">


            <Link href={"/app/profile/" + postUser?.username}
                  className="text-xl font-semibold hover:underline w-2/3 break-words">{postUser?.username}</Link>

            <div className="w-1/3">
              {
                postUser && (
                  <Image
                    //a circle avatar
                    width={40}
                    height={40}
                    className="rounded-full border border-neutral-800 bg-zinc-800/30 w-10 aspect-square ml-auto "
                    src={postUser.profileImageUrl}
                    alt="profile image"
                  />
                )
              }

            </div>


          </div>
          <div className="flex flex-row items-center w-full  py-2 gap-2 ">
            <h2 className="text-sm text-neutral-200 ">{post.caption}</h2>

            <button className="focus:outline-none ml-auto " onClick={handleLikeClick}>
              {isLiked ? (
                <BsHeartFill className="text-red-500 text-2xl" />
              ) : (
                <BsHeart className="text-gray-500 text-2xl" />
              )}
            </button>

          </div>
          <div className="flex flex-row items-center w-full  pb-2 gap-2 border-b border-neutral-800 ">
            <h2 className="text-xs text-neutral-200 ">{likeCount} likes</h2>
          </div>

          <div className="flex flex-col items-center justify-start w-full  py-2 gap-2 overflow-auto">
            {
              comments && comments.map((comment, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center justify-start w-full  py-2 gap-2 border-b border-neutral-800 ">
                  {
                    comment.user && (
                      <Link href={"/app/profile/" + comment.user.username}
                            className="flex items-center justify-start gap-2 "
                      >
                        <Image
                          //a circle avatar
                          width={40}
                          height={40}
                          className="rounded-full border border-neutral-800 bg-zinc-800/30 w-10 aspect-square  "
                          src={comment.user.profileImageUrl} alt="" />
                        <h2 className="text-sm font-semibold text-neutral-200 hover:underline">{comment.user.username}</h2>
                      </Link>
                    )
                  }

                  <h2 className="text-sm text-neutral-200 ">{comment.comment.text}</h2>
                </div>
              ))
            }
          </div>


          <div className="flex flex-row mt-auto justify-start w-full  py-2 gap-2"
          >
            <input
              className="w-full bg-zinc-800/30 rounded-md p-2 text-neutral-200 focus:outline-none"
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              onKeyDown={
                (e) => {
                  if (e.key === "Enter") {
                    handleCommentSubmit();
                  }
                }
              }


            />
            <button className="focus:outline-none ml-auto "
                    type={"submit"}
                    onClick={handleCommentSubmit}
            >
              <BsChat className="text-gray-500 text-2xl" />
            </button>

          </div>


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
