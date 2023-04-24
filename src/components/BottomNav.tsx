import { useState } from 'react';
import { FaHome, FaSearch, FaHeart, FaUser } from 'react-icons/fa';

interface NavItemProps {
  icon: JSX.Element;
  active: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, active, onClick }: NavItemProps) => {
  const activeClass = active ? 'text-gray-900 dark:text-white' : 'text-gray-500';
  return (
    <button
      className={`flex flex-col items-center justify-center h-full w-full text-sm ${activeClass}`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

const BottomNav = () => {
  const [activeNav, setActiveNav] = useState<string>('Home');
  const navItems = [
    { name: 'Home', icon: <FaHome size={24} /> },
    { name: 'Search', icon: <FaSearch size={24} /> },
    { name: 'Activity', icon: <FaHeart size={24} /> },
    { name: 'Profile', icon: <FaUser size={24} /> },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-between border-t border-gray-700 border-t
       bg-black py-4 ">

        {navItems.map((item) => (
          <NavItem
            key={item.name}
            icon={item.icon}
            active={activeNav === item.name}
            onClick={() => setActiveNav(item.name)}
          />
        ))}
      </nav>
    </>
  );
};

export default BottomNav;
