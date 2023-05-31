import { type AppType } from "next/app";
import { type Session } from "next-auth";


import { api } from "~/utils/api";

import "~/styles/globals.scss";

import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";

import "@uploadthing/react/styles.css";

const MyApp: AppType<{ session: Session | null }> = ({
                                                       Component,
                                                       pageProps: { session, ...pageProps }
                                                     }) => {
  return (
    <>
      <Head>
        <title>Unleashed</title>
        <meta name="description" content="The social media Platform that lets you unleash your creativity" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json"/>
      </Head>
      <ClerkProvider {...pageProps}>
        <Component {...pageProps} />
      </ClerkProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
