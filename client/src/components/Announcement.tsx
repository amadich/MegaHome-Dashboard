"use client";
import { useState, useEffect } from "react";
import AnnouncementIcon from "@/assets/icons/announcement.svg";
import Image from "next/image";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS } from "@/app/graphql/projectMutation";
import { CREATE_ANNOUNCEMENT } from "@/app/graphql/AnnouncementMutation";
import { jwtDecode } from "jwt-decode";
import { 
  XMarkIcon,
  UserGroupIcon,
  UserIcon,
  PaperAirplaneIcon 
} from '@heroicons/react/24/outline';

interface token {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function Announcement() {
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementText, setAnnouncementText] = useState("");
  const [selectedVisibility, setSelectedVisibility] = useState("all");
  const [teamMemberIds, setTeamMemberIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [senderId, setSenderId] = useState<string | null>(null);

  const { data, loading, error } = useQuery(GET_USERS);
  const [createAnnouncement, { loading: submitting }] = useMutation(CREATE_ANNOUNCEMENT);

  const users = data?.users || [];

  const filteredUsers = users.filter(
    (user: User) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<token>(token);
        setSenderId(decodedToken.id);
      } catch (err) {
        console.error("❌ Error decoding token:", err);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senderId) {
      console.error("❌ No sender ID found");
      return;
    }

    try {
      const response = await createAnnouncement({
        variables: {
          input: {
            title: announcementTitle,
            content: announcementText,
            senderId: senderId,
            visibility: selectedVisibility,
            visibleTo: selectedVisibility === "specific" ? teamMemberIds : [],
          },
        },
      });

      console.log("✅ Announcement created:", response.data.createAnnouncement);
    } catch (err) {
      console.error("❌ Error creating announcement:", err);
    }

    (document.getElementById("announcement_modal") as HTMLDialogElement).close();

    // Reset form
    setAnnouncementTitle("");
    setAnnouncementText("");
    setSelectedVisibility("all");
    setTeamMemberIds([]);
    setSearchTerm("");
  };

  if (loading) return null;
  if (error) return <p className="text-red-500">فشل تحميل المستخدمين</p>;

  return (
    <>
      <button
        className="fixed flex items-center justify-center left-6 bottom-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg z-50 text-white transition-all hover:scale-105"
        onClick={() =>
          (document.getElementById("announcement_modal") as HTMLDialogElement).showModal()
        }
      >
        <Image 
          src={AnnouncementIcon} 
          alt="Announcement" 
          width={24} 
          height={24} 
          className="w-8 h-8 filter invert" 
        />
      </button>

      <dialog id="announcement_modal" className="modal backdrop-blur-sm overflow-auto">
        <div className="modal-box p-0 max-w-2xl rounded-xl border border-gray-200 shadow-2xl overflow-auto">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  إنشاء إعلان جديد
                </h3>
                <p className="text-gray-600 mt-1">
                  شارك التحديثات الهامة مع فريقك
                </p>
              </div>
              <button
                className="btn btn-ghost btn-circle text-gray-500 hover:bg-gray-200"
                onClick={() => (document.getElementById("announcement_modal") as HTMLDialogElement).close()}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                عنوان الإعلان
              </label>
              <input
                type="text"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                placeholder="أدخل عنواناً واضحاً..."
                className="input input-bordered w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                محتوى الإعلان
              </label>
              <textarea
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="اكتب التفاصيل الكاملة للإعلان هنا..."
                className="textarea textarea-bordered w-full h-40 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5" />
                إعدادات الرؤية
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedVisibility === "all" 
                      ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100" 
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedVisibility("all")}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      selectedVisibility === "all" 
                        ? "bg-emerald-500" 
                        : "border border-gray-300"
                    }`}>
                      {selectedVisibility === "all" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium">الجميع</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">الإعلان سيكون مرئياً لجميع المستخدمين</p>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedVisibility === "specific" 
                      ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100" 
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedVisibility("specific")}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      selectedVisibility === "specific" 
                        ? "bg-emerald-500" 
                        : "border border-gray-300"
                    }`}>
                      {selectedVisibility === "specific" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium">محدد</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">اختر أعضاء معينين يمكنهم رؤية الإعلان</p>
                </div>
              </div>
            </div>

            {selectedVisibility === "specific" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اختر الأعضاء
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ابحث بالأسم..."
                      className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-emerald-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <UserIcon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                
                {teamMemberIds.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                    {users
                      .filter((user: User) => teamMemberIds.includes(user.id))
                      .map((user: User) => (
                      <div 
                        key={user.id}
                        className="flex items-center bg-emerald-100 rounded-full py-1 pl-3 pr-2"
                      >
                        <span className="text-sm text-emerald-800">
                        {user.firstName} {user.lastName}
                        </span>
                        <button 
                        type="button"
                        className="ml-2 text-emerald-700 hover:text-emerald-900"
                        onClick={() => setTeamMemberIds((prev: string[]) => prev.filter((id: string) => id !== user.id))}
                        >
                        <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                      ))}
                    </div>
                )}

                <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                  {filteredUsers.map((user: User) => (
                    <div 
                      key={user.id} 
                      className={`flex items-center gap-4 p-3 border-b border-gray-100 last:border-0 transition-colors ${
                        teamMemberIds.includes(user.id) 
                          ? "bg-emerald-50" 
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setTeamMemberIds(prev => 
                        prev.includes(user.id) 
                          ? prev.filter(id => id !== user.id) 
                          : [...prev, user.id]
                      )}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        teamMemberIds.includes(user.id) 
                          ? "border-emerald-500 bg-emerald-500" 
                          : "border-gray-300"
                      }`}>
                        {teamMemberIds.includes(user.id) && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <img
                        src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`}
                        alt={user.firstName}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="btn bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-700 hover:to-teal-800 shadow-md flex items-center gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <PaperAirplaneIcon className="w-5 h-5" />
                )}
                {submitting ? "جاري الإرسال..." : "نشر الإعلان"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}