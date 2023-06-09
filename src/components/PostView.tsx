import { useEffect, useRef, useState } from "react";
import { api, RouterOutputs } from "~/utils/api";
import { BsChat, BsHeart, BsHeartFill } from "react-icons/bs";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import ImageCarousel from "~/components/ImageCarousel";
import Image from "next/image";



type PostData = RouterOutputs["posts"]["getPost"]
const PostView = ({ props: postData }: { props: PostData }) => {

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
      className="flex md:justify-center md:items-center min-h-screen w-full "
    >
      <div
        className="border-neutral-800 w-full md:border bg-zinc-950 md:w-2/3 aspect-video flex flex-col md:flex-row md:rounded-lg md:p-2 "
      >
        <div
          className={
            "md:w-2/3 h-full md:rounded-l-md overflow-hidden relative"
          }
          ref={imageCarouselContainer}
        >
          {
            post.images && (
              <ImageCarousel
                images={post.images}
                containerRef={imageCarouselContainer}
                id={post.id}
                quality={100}
              />
            )
          }
        </div>
        <div className="md:w-1/2 h-full flex flex-col justify-start items-center px-4 my-2 ">

          <div
            className="flex flex-row items-center justify-center w-full p-2 gap-2 border-b border-neutral-800 ">




            <div
            className="flex gap-x-2 w-full items-center justify-start"
            >
              <Link href={"/app/profile/" + postUser?.username}
                    className="text-xl font-semibold hover:underline  break-words">{postUser?.username}</Link>
              {
                postUser && (
                  <Image
                    //a circle avatar
                    width={20}
                    height={20}
                    className="rounded-full border border-neutral-800 bg-zinc-800/30 w-8 aspect-square "
                    src={postUser.profileImageUrl}
                    alt="profile image"
                  />
                )
              }
              <div className="flex flex-row items-center gap-x-4 ml-auto">
                <button className="focus:outline-none" onClick={handleLikeClick}>
                  {isLiked ? (
                    <BsHeartFill className="text-red-500 text-2xl" />
                  ) : (
                    <BsHeart className="text-gray-500 text-2xl" />
                  )}
                </button>
              </div>


            </div>


          </div>

          <div className="flex flex-row items-center w-full  py-2 gap-2 border-b border-neutral-800  ">
            <h2 className="text-sm font-semibold text-neutral-200 ">{post.caption}</h2>
            <h2 className="text-xs text-neutral-200 ">{likeCount} likes</h2>
          </div>

          <div className="flex flex-col items-center justify-start w-full  py-2 gap-2 overflow-auto">
            {
              comments && comments.map((comment, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start justify-center w-full  py-1 gapx-2 border-b border-neutral-800 ">
                  {
                    comment.user && (
                      <Link href={"/app/profile/" + comment.user.username}
                            className="flex items-center justify-start gap-2 "
                      >
                        <Image
                          //a circle avatar
                          width={40}
                          height={40}
                          className="rounded-full border border-neutral-800 bg-zinc-800/30 w-5 aspect-square  "
                          src={comment.user.profileImageUrl} alt="" />
                        <h2 className="text-sm font-semibold text-neutral-200 hover:underline">{comment.user.username}</h2>

                      </Link>
                    )

                  }

                  <h2 className="text-sm text-neutral-200 ml-7">{comment.comment.text}</h2>
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

export default PostView;