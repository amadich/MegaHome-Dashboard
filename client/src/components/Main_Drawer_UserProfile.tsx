"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDownIcon, ChevronUpIcon , ArrowLeftStartOnRectangleIcon, UserIcon } from "@heroicons/react/24/outline";
import Avatar from "@/assets/images/sotetel_logo.png"; // Replace with your actual avatar
import { jwtDecode } from "jwt-decode";

// Define an interface for the user info
interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function Main_Drawer_UserProfile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null); // State to store user info
  const [isClient, setIsClient] = useState(false); // Flag to track if it's running on the client side

  useEffect(() => {
    // This ensures the code only runs on the client
    setIsClient(true);

    // Check if the token exists in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode the token to get user info
        const decoded: any = jwtDecode(token);
        setUserInfo({
          id: decoded.id,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          role: decoded.role,
        }); // Set the decoded user info
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  // Handle toggling the dropdown menu
  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Handle logout
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    
    // Reset the user info state
    setUserInfo(null);

    // Optionally, you can redirect the user to a login page after logging out
    window.location.href = "/"; // Adjust this URL to your actual login route
  };

  // Prevent hydration mismatch by rendering conditionally based on client-side
  if (!isClient) {
    return null; // Render nothing until the component is hydrated on the client
  }

  return (
    <div className=" w-full  m-auto rounded-xl border-none relative bg-transparent mb-3" style={userInfo ? { display: "block" } : { display: "none" }}>
      {/* Profile Box */}
      <div
        className="flex items-center cursor-pointer space-x-4 p-3 bg-blue-50 hover:bg-blue-50 rounded-xl"
        onClick={handleMenuToggle} // Toggle the menu when the profile box is clicked
      >
        <Image
          src={Avatar} // Replace with your avatar image
          alt="User Avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex-1 relative">
          {/* Left Arrow Icon */}
          {isMenuOpen ? (
            <ChevronUpIcon
              className="h-3 w-3 text-blue-900 float-right"
              style={{ strokeWidth: 2 }}
            />
          ) : (
            <ChevronDownIcon
              className="h-3 w-3 text-blue-900 float-right"
              style={{ strokeWidth: 2 }}
            />
          )}

          {/* User Info */}
          {userInfo ? (
            <>
              <div className="flex text-xs font-semibold relative z-10 space-x-2 pr-2 text-blue-900">
                <span>{userInfo.firstName} {userInfo.lastName}</span>
                <span
                  className={`text-xs rounded-xl w-4 text-white tooltip tooltip-left ${
                    userInfo.role === "ADMIN"
                      ? "bg-[#ff00008c]"
                      : userInfo.role === "MANAGER"
                      ? "bg-[#0059ff]"
                      : userInfo.role === "TEAM"
                      ? "bg-[#ff8c00]"
                      : userInfo.role === "CLIENT"
                      ? "bg-[#1a9e1a]"
                      : ""
                  }`}
                  data-tip={userInfo.role}
                >
                  {userInfo.role.charAt(0)}
                </span>
              </div>
              <div className=" flex items-center text-xs text-blue-900 relative z-10">
                <span>{userInfo.email} </span>
                
              </div>
            </>
          ) : (
            <div className="text-xs font-semibold text-gray-500 relative z-10">
              جاري التحميل...
            </div>
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className=" absolute left-0 mb-2 w-48 bg-gradient-to-b from-blue-950 to-blue-600 shadow-lg rounded-lg z-10">
          <ul className="py-2">
            <li>
              <a href={`/Profile/${userInfo?.id}`} className="block px-4 py-2 text-sm text-gray-100 hover:bg-black">
                الملف الشخصي
                <UserIcon className="h-5 w-5 text-gray-100 float-right" />
              </a>
              
            </li>
            <li>
              <a
                onClick={handleLogout}
                className="block px-4 py-2 text-sm text-gray-100 hover:bg-black cursor-pointer"
              >
                تسجيل الخروج
                <ArrowLeftStartOnRectangleIcon className="h-5 w-5 text-gray-100 float-right" />
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
