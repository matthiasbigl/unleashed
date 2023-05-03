import {
  createTRPCRouter,
  privateProcedure
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/api";
import { Post } from ".prisma/client";
import { env } from "~/env.mjs";
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

const getUserID = async (username: string) => {
  const user = await clerkClient.users.getUserList({
    username: [username],
  })
  if (user.length === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `User not found: ${username}`
    });
  }
  return user[0]?.id;
}


export const userRouter = createTRPCRouter({


  getPosts: privateProcedure.input(z.object({ username: z.string() })).query(async ({ ctx, input }) => {

    const { username } = input;
    const userId = await getUserID(username)
    console.log("userId", userId)
    const posts = await prisma.post.findMany({
      where: {
        userId: userId
      }
    }
    );
    return addUserDataToPosts(posts);

  }),

  getMyPosts: privateProcedure.query(async ({ ctx }) => {
    const posts = await prisma.post.findMany({
      where: {
        userId: ctx.userId
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return posts;
  })


});
