import { type AppType } from "next/app";
import { type Session } from "next-auth";


import { api } from "~/utils/api";

import "~/styles/globals.scss";
import Layout from "~/components/Layout";
import { ClerkProvider } from "@clerk/nextjs";

const MyApp: AppType<{ session: Session | null }> = ({
                                                       Component,
                                                       pageProps: { session, ...pageProps }
                                                     }) => {
  return (
   <ClerkProvider {...pageProps}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ClerkProvider>

  );
};

export default api.withTRPC(MyApp);
