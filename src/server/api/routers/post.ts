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


export const postsRouter = createTRPCRouter({


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
                userId: ctx.userId,
              },
              {
              },
            ],
          },
        },
      },
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
                userId: ctx.userId,
              },
              {

              },
            ],
          },
        },
      },
    });
    return await addUserDataToPosts(posts);
  }),

  like: privateProcedure
    .input(
      z.object({
        postId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      //check if the user has already liked the post if so delete the like
      const foundLike = await ctx.prisma.like.findFirst({
        where: {
          userId,
          postId: input.postId,
        },
      });

      if (foundLike) {
        await ctx.prisma.like.delete({
          where: {
            id: foundLike.id,
          },
        });
        return null;
      }

      const like = await ctx.prisma.like.create({
        data: {
          userId,
          postId: input.postId,
        },
      });

      await ctx.prisma.post.update({
        where: {
          id: input.postId,
        },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      });

      return like;
    })


});
