"use client";

import { useState } from "react";
import Image from "next/image";
import iconNotification from "@/assets/icons/notification-alarm.svg";
import { CheckCircleIcon, RectangleGroupIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { gql, useQuery } from "@apollo/client";
import { formatDistanceToNow } from "date-fns"; // Importing formatDistanceToNow from date-fns
import { useRouter } from "next/navigation";

// GraphQL Query to fetch announcements
const GET_ANNOUNCEMENTS = gql`
  query Announcement {
    announcements {
      id
      title
      content
      senderId
      sender {
        id
        email
        firstName
        lastName
        role
      }
      visibility
      visibleTo
      createdAt
    }
  }
`;

interface Notification {
  id: string;
  title: string;
  content: string;
  senderId: string;
  sender: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  visibility: "all" | "specific";
  visibleTo: string[];
  createdAt: string;
}

export default function Menu_Header_NotificationDropLeft({ myID }: { myID: string }) {

  const router = useRouter();

  // State to manage if the drawer is open or closed
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | "all">("all"); // Role filter state

  // Toggle drawer open/close
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Fetch announcements from the server
  const { data, loading, error } = useQuery(GET_ANNOUNCEMENTS);

  if (loading) return <p>جاري التحميل...</p>;
  if (error) return <p>خطأ في جلب الإعلانات: {error.message}</p>;

  // Filter notifications based on visibility and whether `myID` is in `visibleTo`
  const notifications = (data?.announcements || []).filter((notification: Notification) => {
    if (notification.visibility === "all") {
      return true; // Show all notifications if visibility is "all"
    }
    if (notification.visibility === "specific") {
      return notification.visibleTo.includes(myID); // Show notification if `myID` is in `visibleTo`
    }
    return false; // Do not show the notification for other visibility types
  });

  // Filter notifications based on the selected role
  const filteredNotifications = notifications.filter((notification: Notification) => {
    if (selectedRole === "all") return true; // No role filter, show all
    return notification.sender.role === selectedRole; // Filter by selected role
  });

  // Sort notifications based on `createdAt` in descending order
  const sortedNotifications = filteredNotifications.sort((a: Notification, b: Notification) => {
    return new Date(parseInt(b.createdAt)).getTime() - new Date(parseInt(a.createdAt)).getTime();
  });

  const notificationCount = sortedNotifications.length;

  // Handle role filter changes
  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
  };

  return (
    <div className="relative p-4">
      {/* Notification Icon */}
      <div 
        className="relative flex items-center justify-center cursor-pointer"
        onClick={handleDrawerToggle}
      >
        <Image
          src={iconNotification}
          width={32}
          height={32}
          alt="الإشعارات"
          className="bg-green-100 rounded-full p-[6px]"
        />
        {!drawerOpen && notificationCount > 0 && (
          <span className="absolute top-0 right-0 badge badge-sm bg-green-300 border-none">
            {notificationCount}
          </span>
        )}
      </div>

      {/* Bottom Drawer */}
      <div 
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={handleDrawerToggle}
        ></div>
        
        {/* Drawer Content */}
        <div className="absolute bottom-0 w-full bg-white rounded-t-2xl shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">الإشعارات</h2>
              <button 
                onClick={handleDrawerToggle}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600">
                {`لديك ${notificationCount} إشعار جديد${notificationCount > 1 ? "ات" : ""}`}
              </p>
            </div>
            
            {/* Tabs */}
            <div className="flex items-center space-x-4 mb-4 border-b border-gray-300 pb-2">
              <p className="text-black font-medium border-b-2 border-green-500 pb-2">
                النشاط
              </p>
              <p className="text-gray-500 pb-2">الأرشيف</p>
            </div>

            {/* Role Filter */}
            <div className="dropdown mb-4">
              <div tabIndex={0} role="button" className="flex items-center rounded-lg text-center bg-gray-200 space-x-2 p-2">
                <RectangleGroupIcon className="w-4 h-4" />
                <p>تصفية</p>
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                <li>
                    <span onClick={() => handleRoleChange("all")}>الكل</span>
                  </li>
                  <li>
                    <span onClick={() => handleRoleChange("ADMIN")}>
                      <p>مدير</p>
                      {selectedRole === "ADMIN" && (
                        <div className="relative flex items-center justify-center">
                          <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75 animate-ping"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </div>
                      )}
                    </span>
                  </li>
                  <li>
                    <span onClick={() => handleRoleChange("MANAGER")}>
                      <p>مدير فريق</p>
                      {selectedRole === "MANAGER" && (
                        <div className="relative flex items-center justify-center">
                          <span className="absolute inline-flex h-3 w-3 rounded-full bg-purple-400 opacity-75 animate-ping"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                        </div>
                      )}
                    </span>
                  </li>
                  <li>
                    <span onClick={() => handleRoleChange("TEAM")}>
                      <p>فريق</p>
                      {selectedRole === "TEAM" && (
                        <div className="relative flex items-center justify-center">
                          <span className="absolute inline-flex h-3 w-3 rounded-full bg-cyan-400 opacity-75 animate-ping"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </div>
                      )}
                    </span>
                  </li>
                  <li>
                    <span onClick={() => handleRoleChange("CLIENT")}>
                      <p>عميل</p>
                      {selectedRole === "CLIENT" && (
                        <div className="relative flex items-center justify-center">
                          <span className="absolute inline-flex h-3 w-3 rounded-full bg-teal-400 opacity-75 animate-ping"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                        </div>
                      )}
                    </span>
                  </li>
              </ul>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {sortedNotifications.map((notification: Notification) => {
                const formattedTime = notification.createdAt
                  ? formatDistanceToNow(new Date(parseInt(notification.createdAt)))
                  : "وقت غير معروف";

                return (
                  <div
                    key={notification.id}
                    className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <img
                          src={`https://ui-avatars.com/api/?name=${notification.sender.firstName}+${notification.sender.lastName}&background=random`}
                          alt={`${notification.sender.firstName} ${notification.sender.lastName}`}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        </div>
                        
                        <div className="mt-1">
                          <p className="text-gray-600">{notification.content}</p>
                        </div>
                        
                        <div className="mt-2 flex justify-between">
                          <span className="text-sm text-gray-500">
                            {notification.sender.firstName} {notification.sender.lastName}
                          </span>
                          <span className="text-sm text-gray-400">
                            {formattedTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
