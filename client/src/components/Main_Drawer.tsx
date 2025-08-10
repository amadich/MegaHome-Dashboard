'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { HomeIcon, CheckCircleIcon, CalendarIcon, BoltIcon, FolderIcon, ChartBarIcon, UserGroupIcon, UsersIcon, CogIcon , CurrencyDollarIcon, BanknotesIcon , PresentationChartBarIcon, DocumentCurrencyDollarIcon , BuildingOfficeIcon } from '@heroicons/react/24/outline';

const Icons = {
  HomeIcon,
  CheckCircleIcon,
  CalendarIcon,
  BoltIcon,
  FolderIcon,
  ChartBarIcon,
  UserGroupIcon,
  UsersIcon,
  CogIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  PresentationChartBarIcon,
  DocumentCurrencyDollarIcon,
  BuildingOfficeIcon
};

import navLinks from '@/data/navLinks.json'; // Import the JSON file
import SotetelLogo from '@/assets/images/logo_10.png';
import Main_Drawer_UserProfile from './Main_Drawer_UserProfile';
import { TokenInfoUser } from './authUsers/TokenInfoUser';
import Menu_Header_NotificationDropLeft from './Menu_Header_NotificationDropLeft';

export default function Main_Drawer() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  // Get user information (like role)
  const userInfo = TokenInfoUser();

  // Determine if user is ADMIN or MANAGER
  const isAdminOrManager = userInfo?.role === 'ADMIN' || userInfo?.role === 'MANAGER';

  // Filter links based on the user's role
  const filteredLinks = navLinks.filter((link) => {
    if (isAdminOrManager) {
      return true; // Show all links for ADMIN and MANAGER
    }
    return link.access === 0; // Only show links with access 0 for other roles
  });

  // Group links by category
  const groupedLinks = filteredLinks.reduce((acc: { [key: string]: typeof filteredLinks }, link) => {
    if (!acc[link.category]) acc[link.category] = [];
    acc[link.category].push(link);
    return acc;
  }, {});

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#fff] border-none shadow-sm">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <div className="flex items-center">
          <Image 
            src={SotetelLogo} 
            alt="Sotetel Logo" 
            width={100} 
            height={40} 
            draggable={false} 
            className="h-16 w-auto"
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 mx-4">
          <div className="flex justify-center space-x-1">
            {/* Render all categories horizontally */}
            {Object.entries(groupedLinks).map(([category, links]: [string, any]) => (
              <div key={category} className="flex items-center">
                {links.map((link: any) => {
                  const IconComponent = Icons[link.icon as keyof typeof Icons];
                  const isActive = pathname === link.href;
                  
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-slate-100 text-blue-950' 
                          : 'text-gray-900 hover:bg-slate-100 hover:text-black'
                      }`}
                    >
                      <IconComponent className={`h-5 w-5 ${isActive ? 'text-blue-500' : 'text-blue-500'}`} />
                      <span className="mt-1 text-xs">{link.title}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </nav>

          <div className="flex items-center">
            
            {/* <Menu_Header_NotificationDropDown /> */}
                    {
                      userInfo && <Menu_Header_NotificationDropLeft myID={userInfo.id} /> 
                    }
            {/* User Profile */}
            <div className="flex items-center">
              <Main_Drawer_UserProfile />
            </div>
          </div>
       
      </div>
    </div>
  );
}
