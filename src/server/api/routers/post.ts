import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { prisma } from "~/server/db";



export const postRouter = createTRPCRouter(
  {
    getPost: protectedProcedure.input(z.object({ id: z.number() })).query(
      async ({ input }) => {
        const post = await prisma.post.findUnique({
          where: {
            id: input.id
          }
        });
        return post;
      }
    ),
    getNextNPosts: protectedProcedure.input(z.object({ n: z.number() })).query(
      async ({ input }) => {
        //get the input number of posts sorted by date
        const posts = await prisma.post.findMany({
            orderBy: {
              createdAt: "desc"
            },
            take: input.n
          }
        );
        return posts;
      }
    )

  }
);