import { useRouter } from "next/router";
import { useEffect } from "react";

const Router = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname.startsWith("/app")) {
      router.push("/app/feed").then(r =>
        console.log("Redirected to /app/feed")
      );
    }
  }, [router]);

  return (
    <>

    </>
  );
};

export default Router;
