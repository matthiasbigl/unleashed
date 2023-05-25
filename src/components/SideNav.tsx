import { useState } from 'react';
import { FaHome, FaSearch, FaHeart, FaUser, FaPlus } from "react-icons/fa";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { mockSession } from "next-auth/client/__tests__/helpers/mocks";

import Image from "next/image";
import { useRouter } from "next/navigation";


interface NavItemProps {
  icon: JSX.Element;
  active: boolean;
  onClick: () => void;
}

interface NavItemProps {
  icon: JSX.Element;
  name: string;
  active: boolean;
  onClick: () => void;

}

const NavItem = ({ icon, name, active, onClick }: NavItemProps) => {



  const activeClass = active ? 'text-gray-900 dark:text-white' : 'text-gray-500';
  return (
    <button
      className={`flex flex-col items-center justify-around my-4 w-full text-sm ${activeClass}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center">
        {icon}
        <h2 className="ml-3 font-semibold text-lg">{name}</h2>
      </div>
    </button>
  );
};
const SideNav = () => {

  const router = useRouter();

  const [activeNav, setActiveNav] = useState<string>('Home');

  const user = useUser();



  const navItems = [
    { name: 'Home', icon: <FaHome size={24} />, link: "/app" },
    { name: 'Search', icon: <FaSearch size={24}/>, link: "search" },
    {name: 'new Post', icon: <FaPlus size={24} />, link: "newpost"},
    { name: 'Activity', icon: <FaHeart size={24} />, link: "activity" },
    { name: 'Profile', icon: <FaUser size={24} />, link: "profile"},

  ];

  const handleClick=(name:string,link:string)=>{
    setActiveNav(name)
    router.push(link)
  }

  return (
    <div className=" border-r border-gray-700 w-64 flex flex-col h-full  bg-gradient-to-b bg-zinc-800/30 z-20 gap-y-4">
      <div className="h-24 flex items-center justify-center text-2xl font-bold text-white border-b border-neutral-800">
        <Link
        href={"/"}
        >unleashed</Link>
      </div>

      <nav className="flex-grow flex flex-col justify-center h-full ">

          {navItems.map((item) => (
            <NavItem
              key={item.name}
              icon={item.icon}
              name={item.name}
              active={activeNav === item.name}
              onClick={() => handleClick(item.name, item.link)

            }
            />
          ))}
      </nav>
      {
        !user.isSignedIn ? (
          <div
            className={
              `flex flex-row items-center justify-center rounded-md bg-gradient-to-r from-blue-400 to-blue-600 w-24 h-10
                    hover:scale-105 hover:shadow-lg hover:from-blue-500 hover:to-blue-700 transition duration-150 ease-in-out 
                    cursor-pointer
                    font-semibold text-lg 
                    `
            }>
            <SignInButton />
          </div>) : (
          <>
            <div className="hidden md:flex  flex-col items-center justify-end my-4 gap-4">
              <Link className="flex flex-row items-center-center gap-2 text-lg py-1 px-2  rounded-md
                  hover:scale-105 hover:shadow-lg hover:bg-zinc-800/50 transition duration-150 ease-in-out"
                    href={"/app/profile"}>

                <h2 className="my-auto">
                  {user.user.fullName}
                </h2>
                <div
                  //a circle avatar
                  className={`rounded-full cursor-pointer
                    `}
                >
                  <img src={user.user.profileImageUrl} alt="avatar" className="rounded-full w-10 h-10" />

                </div>
              </Link>

              <div
                className={`flex flex-row items-center  justify-center rounded-md border border-neutral-800 bg-zinc-800/30 w-24 h-10
                hover:scale-105 hover:shadow-lg hover:bg-zinc-800/50 transition duration-150 ease-in-out
                cursor-pointer
                text-lg font-semibold 
                `}>
                <SignOutButton />
              </div>
            </div>
          </>
        )}

    </div>
  );
};

export default SideNav;
