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
      limit: 110,
    })
  ).map(filterUserForClient);

  return posts.map((post) => {
    const author = users.find((user) => user.id === post.userId);

    if (!author) {
      console.error("AUTHOR NOT FOUND", post);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for post not found. POST ID: ${post.id}, USER ID: ${post.userId}`,
      });
    }
    if (!author.username) {
      // user the ExternalUsername
      if (!author.externalUsername) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Author has no GitHub Account: ${author.id}`,
        });
      }
      author.username = author.externalUsername;
    }
    return {
      post,
      user: {
        ...author,
        username: author.username ?? "(username not found)",
      },
    };
  });
};
export const postsRouter = createTRPCRouter({

    getNext: privateProcedure.input(z.object({
      id: z.number()
    })).query(async ({ input }) => {
      //find the next 10 posts in descending order
      // for example if the input is 15 get the post 15 to 5
      // and get the associated images for each post

      const posts = await prisma.post.findMany({
        take: 10,
        skip: input.id,
        orderBy: {
          id: "desc"
        },
        include: {
          images: true
        }
      });
      return await addUserDataToPosts(posts);
    }),

    //get the 10 latest posts in descending order
    getLatest: privateProcedure.query(async () => {
      const posts = await prisma.post.findMany({
        take: 10,
        orderBy: {
          id: "desc"
        },
        include: {
          images: true
        }
      });
      return await addUserDataToPosts(posts);

    })
  }
);