import BottomNav from "~/components/BottomNav";
import SideNav from "~/components/SideNav";
import React, { RefObject, useEffect, useRef } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: LayoutProps) => {


  return (
    <>

      <main className="flex w-full h-full md:p-4
      "
      >
        <div className="hidden md:flex fixed left-0 top-0 h-full z-50">
          <SideNav />
        </div>
        <div className="w-full md:flex md:mx-64 justify-center items-center z-30">
          {children}
        </div>
      </main>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>

    </>
  );
};

export default AppLayout;
