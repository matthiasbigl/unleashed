import { type NextPage } from "next";
import Head from "next/head";
import Topbar from "~/components/topbar";
import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";


const Home: NextPage = () => {

  const user = useUser();


  return (
    <>
      <Head>
        <title>Unleashed</title>
        <meta name="description" content="The social media Platform that lets you unleash your creativity" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Topbar />

        <main className="flex min-h-screen flex-col items-center justify-center bg-black p-10">
          <div className="flex items-center justify-center">
            <div className="gradient z-10 absolute md:top-auto top-1/3 " />
            <div className="absolute z-20 w-full h-full">
              <div className="flex flex-col items-center justify-center
                shadow-2xl
                h-screen
               ">

                <div
                  className="mt-auto flex flex-col text-center justify-center items-center w-full gap-4">
                  <h2 className="md:text-5xl text-2xl font-semibold text-white">
                    Welcome to
                  </h2>
                  <h1 className="md:text-8xl text-5xl font-bold text-white">
                    Unleashed
                  </h1>

                  <a className="md:text-2xl text-md w-1/4 ">
                    the social media platform, that lets
                    <br />
                    you unleash your creativity
                  </a>
                  <div>
                    {
                      user.isSignedIn ? (
                        <Link
                          className="rounded-md bg-gradient-to-r from-blue-400 to-blue-600 w-32 h-14
                    hover:scale-105 hover:shadow-lg hover:from-blue-500 hover:to-blue-700 transition duration-150 ease-in-out
                    cursor-pointer
                    font-bold text-xl flex justify-center items-center "
                          href="/app"
                        >
                          Go to App
                        </Link>
                      ) : (
                        <div
                          className=" rounded-md bg-gradient-to-r from-blue-400 to-blue-600 w-32 h-14
                    hover:scale-105 hover:shadow-lg hover:from-blue-500 hover:to-blue-700 transition duration-150 ease-in-out
                    cursor-pointer
                    font-bold text-xl flex justify-center items-center"
                        >
                          <SignInButton />
                        </div>

                      )

                    }
                  </div>

                </div>
                <div
                  className={`
        flex flex-col gap-5 mt-auto 
        hover:scale-105 hover:translate-y-5 transition duration-300 ease-in-out
      
        `}
                >
                  <h3
                    className="text-2xl font-semibold text-white"
                  >
                    SCROLL DOWN
                  </h3>
                  <div className="flex justify-center h-16 p-2 mb-16

            ">
                    <div className="bg-white w-0.5"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 md:gap-4 gap-8 px-5 text-center md:grid-cols-3 md:mx-10">
                <div className="col-span-3 md:col-span-1 flex flex-col items-center justify-center gap-2">
                  <h3 className="text-2xl font-semibold">
                    No censorship:
                  </h3>
                  <p>
                    Unlike other social media platforms that impose strict content policies and often remove content
                    that doesn't fit their guidelines, Unleashed has no censorship. We believe that people should have
                    the freedom to express themselves in any way they choose, as long as it doesn't harm others.
                  </p>
                </div>
                <div className="col-span-3 md:col-span-1 flex flex-col items-center justify-center gap-2">
                  <h3 className="text-2xl font-semibold">
                    Creativity:
                  </h3>
                  <p>
                    Unleashed encourages creativity by providing a platform for users to share their unique perspectives
                    and talents. We believe that creativity should be celebrated, and our platform is designed to
                    showcase the creative work of our users.
                  </p>
                </div>
                <div className="col-span-3 md:col-span-1 flex flex-col items-center justify-center gap-2">
                  <h3 className="text-2xl font-semibold">
                    Community:
                  </h3>
                  <p>
                    Unleashed is a social media network that prioritizes community. We believe that social media should
                    be a place where people can connect and engage with others who share their interests and values. Our
                    platform is designed to foster a sense of community and to facilitate meaningful connections between
                    our users.
                  </p>
                </div>
              </div>


            </div>


          </div>


        </main>
      </div>
    </>

  );
};

export default Home;
