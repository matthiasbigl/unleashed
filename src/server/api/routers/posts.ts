
import {
  createTRPCRouter,
  privateProcedure
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const postsRouter = createTRPCRouter({

  getAll: privateProcedure.query(async ({  }) => {
    return await prisma.post.findMany();
  })

});