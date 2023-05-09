import {
  createTRPCRouter,
  privateProcedure
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/api";
import { Post } from ".prisma/client";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";
import axios from "axios";

const addUserDataToPosts = async (posts: Post[]) => {
  const userId = posts.map((post) => post.userId);
  const users = (
    await clerkClient.users.getUserList({
      userId: userId,
      limit: 110
    })
  ).map(filterUserForClient);

  return posts.map((post) => {
    const author = users.find((user) => user.id === post.userId);

    if (!author) {
      console.error("AUTHOR NOT FOUND", post);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for post not found. POST ID: ${post.id}, USER ID: ${post.userId}`
      });
    }
    if (!author.username) {
      // user the ExternalUsername
      if (!author.externalUsername) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Author has no GitHub Account: ${author.id}`
        });
      }
      author.username = author.externalUsername;
    }
    return {
      post,
      user: {
        ...author,
        username: author.username ?? "(username not found)"
      }
    };
  });
};
const getUserID = async (username: string) => {
  const user = await clerkClient.users.getUserList({
    username: [username]
  });
  if (user.length === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `User not found: ${username}`
    });
  }
  return user[0]?.id;
};


export const postsRouter = createTRPCRouter({

  getPostsByUsername: privateProcedure.input(z.object({ username: z.string() })).query(async ({ ctx, input }) => {
    const userId = await getUserID(input.username);
    const posts = await ctx.prisma.post.findMany({
      where: {
        userId
      },
      include: {
        images: true,
        likes: {
          where: {
            OR: [
              {
                userId: ctx.userId
              },
              {}
            ]
          }
        }
      }
    });
    return await addUserDataToPosts(posts);
  }),


  getNext: privateProcedure.input(z.object({
    id: z.number()
  })).query(async ({ ctx, input }) => {


    const posts = await ctx.prisma.post.findMany({
      take: 10,
      skip: input.id,
      orderBy: {
        id: "desc"
      },
      include: {
        images: true,
        likes: {
          where: {
            OR: [
              {
                userId: ctx.userId
              },
              {}
            ]
          }
        }
      }
    });
    return await addUserDataToPosts(posts);
  }),

  //get the 10 latest posts in descending order
  getLatest: privateProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 10,
      orderBy: {
        id: "desc"
      },
      include: {
        images: true,
        likes: {
          where: {
            OR: [
              {
                userId: ctx.userId
              },
              {}
            ]
          }
        }
      }
    });
    return await addUserDataToPosts(posts);
  }),

  getPost: privateProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    if (!input.id) throw new Error("No ID provided"
    );

    const post = await ctx.prisma.post.findUnique({
      where: {
        id: input.id
      },
      include: {
        images: true,
        likes: true
      }
    });
    if (!post) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Post not found: ${input.id}`
      });
    }
    return await addUserDataToPosts([post]).then((posts) => posts[0]);
  }),


  like: privateProcedure
    .input(
      z.object({
        postId: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      //check if the user has already liked the post if so delete the like
      const foundLike = await ctx.prisma.like.findFirst({
        where: {
          userId,
          postId: input.postId
        }
      });

      if (foundLike) {
        await ctx.prisma.like.delete({
          where: {
            id: foundLike.id
          }
        });
        await ctx.prisma.post.update({
          where: {
            id: input.postId
          },
          data: {
            likeCount: {
              increment: -1
            }
          }
        });

        return null;
      }

      const like = await ctx.prisma.like.create({
        data: {
          userId,
          postId: input.postId
        }
      });

      await ctx.prisma.post.update({
        where: {
          id: input.postId
        },
        data: {
          likeCount: {
            increment: 1
          }
        }
      });

      return like;
    }),

  create: privateProcedure
    .input(z.object({
      caption: z.string(),
      images: z.array(z.string())
    })).mutation(async ({ ctx, input }) => {
      //create the post then create each image url and add it to the post
      const post = await ctx.prisma.post.create({
        data: {
          caption: input.caption,
          userId: ctx.userId
        }
      });


      const images = await Promise.all(

        input.images.map(async (image) => {
          //classify the images using imagga

          const labels = axios.get(`https://api.imagga.com/v2/tags?image_url=${`https://unleashed-images.s3.eu-central-1.amazonaws.com/${image}`}`, {
            headers: {

            }
          });

            const url = await ctx.prisma.image.create({
              data: {
                url: image,
                postId: post.id
              }
            });
            return url;
          }
        )

      );


      return {
        post
      };
    })
});
