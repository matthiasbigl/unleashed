import { GetObjectCommand, PutObjectCommand, UploadPartCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { env } from "~/env.mjs";
import { TRPCError } from "@trpc/server";
import {v4 as uuidv4} from 'uuid';

export const s3Router = createTRPCRouter({



  // ...
  getStandardUploadPresignedUrl: privateProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { key } = input;
      const { s3 } = ctx;
      const userId = ctx.userId;
      const uuid = uuidv4();
      const uniqueKey = `${userId}/${uuid}/${key}`;


      const putObjectCommand = new PutObjectCommand({
        Bucket: env.BUCKET_NAME,
        Key: uniqueKey
      });

      const url = await getSignedUrl(s3, putObjectCommand);

      return {
        url,
        key: uniqueKey
      }

    }),

  uploadObjects: privateProcedure
    .input(z.array(z.object({ key: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const { s3 } = ctx;

      const urls: Promise<{ url: string; key: string }>[] = [];

      for (const { key } of input) {
        const putObjectCommand = new PutObjectCommand({
          Bucket: env.BUCKET_NAME,
          Key: key,
        });

        const url = getSignedUrl(s3, putObjectCommand).then((url) => ({
          url,
          key
        }));

        urls.push(url);
      }
      return await Promise.all(urls);
    }),

  getObjects: privateProcedure.input(z.array(z.object({ key: z.string() }))).query(async ({ ctx, input }) => {
    const { s3 } = ctx;

    const keys = input.map((input) => input.key);

    const objects = await s3
      .send(
        new GetObjectCommand({
          Bucket: env.BUCKET_NAME,
          Key: keys[0]
        })
      )
      .then((response) => {
        if (!response.Body) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Could not get objects"
          });
        }
        return response.Body;
      });

    return objects;
  }),


  getMultipartUploadPresignedUrl: privateProcedure
    .input(z.object({ key: z.string(), filePartTotal: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { key, filePartTotal } = input;
      const { s3 } = ctx;

      const uploadId = (
        await s3.createMultipartUpload({
          Bucket: env.BUCKET_NAME,
          Key: key
        })
      ).UploadId;

      if (!uploadId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create multipart upload"
        });
      }

      const urls: Promise<{ url: string; partNumber: number }>[] = [];

      for (let i = 1; i <= filePartTotal; i++) {
        const uploadPartCommand = new UploadPartCommand({
          Bucket: env.BUCKET_NAME,
          Key: key,
          UploadId: uploadId,
          PartNumber: i
        });

        const url = getSignedUrl(s3, uploadPartCommand).then((url) => ({
          url,
          partNumber: i
        }));

        urls.push(url);
      }

      return {
        uploadId,
        urls: await Promise.all(urls)
      };
    }),

  completeMultipartUpload: privateProcedure
    .input(
      z.object({
        key: z.string(),
        uploadId: z.string(),
        parts: z.array(
          z.object({
            ETag: z.string(),
            PartNumber: z.number()
          })
        )
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { key, uploadId, parts } = input;
      const { s3 } = ctx;

      const completeMultipartUploadOutput = await s3.completeMultipartUpload({
        Bucket: env.BUCKET_NAME,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: parts
        }
      });
      return completeMultipartUploadOutput;
    })
});
