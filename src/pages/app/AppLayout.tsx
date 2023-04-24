import BottomNav from '~/components/BottomNav';
import SideNav from '~/components/SideNav';

interface LayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <main className="flex flex-row items-center justify-center w-full h-full md:p-4">
        <div className="hidden md:flex fixed left-0 top-0 h-full w-full">
          <SideNav />
        </div>
        <div className="w-full ">
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
