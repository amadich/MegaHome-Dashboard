"use client";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { CREATE_PROJECT, GET_USERS } from "@/app/graphql/projectMutation";
import LoadingShow from "@/components/LoadingShow";
import Swal from "sweetalert2";
import { ChevronRightIcon, FolderPlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import SotetelLogo from "@/assets/images/sotetel_logo.png";
import { TokenInfoUser } from "@/components/authUsers/TokenInfoUser";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

const CreateProject = () => {
  const userInfo = TokenInfoUser();
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [selectedStatus, setSelectedStatus] = useState("ACTIVE");
  const [selectedPriority, setSelectedPriority] = useState("MEDIUM");
  const [startDate, setStartDate] = useState("2025-04-01");
  const [endDate, setEndDate] = useState("2025-06-30");
  const [teamMemberIds, setTeamMemberIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const GetuserId = userInfo?.id || "";
    setUserId(GetuserId);
  }, [userInfo]);

  const { data, loading, error } = useQuery(GET_USERS);

  const [createProject] = useMutation(CREATE_PROJECT, {
    variables: {
      project: {
        userId,
        title,
        description,
        status: selectedStatus,
        color: selectedColor,
        startDate,
        endDate,
        teamMemberIds,
      },
    },
  });

  if (loading) return <LoadingShow msg="جاري تحميل الأعضاء..." />;
  if (error) return <LoadingShow msg="خطأ في تحميل الأعضاء" />;

  const users = data?.users || [];

  const filteredUsers = users.filter(
    (user: User) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject();
      Swal.fire({
        icon: "success",
        title: "تم إنشاء المشروع بنجاح",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        location.href = "/Projects";
      }, 1000);
    } catch (error) {
      console.error("Error creating project", error);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء إنشاء المشروع",
      });
    }
  };

  const colorSwatches = [
    { hex: "#3B82F6", name: "أزرق" },
    { hex: "#EF4444", name: "أحمر" },
    { hex: "#10B981", name: "أخضر" },
    { hex: "#F59E0B", name: "برتقالي" },
    { hex: "#6366F1", name: "بنفسجي" },
    { hex: "#F5F5F5", name: "رمادي" },
  ];

  // Arabic translations
  const statusOptions = [
    { value: "ACTIVE", label: "نشط" },
    { value: "COMPLETED", label: "مكتمل" },
    { value: "ON_HOLD", label: "معلق" }
  ];

  const priorityOptions = [
    { value: "LOW", label: "منخفض" },
    { value: "MEDIUM", label: "متوسط" },
    { value: "HIGH", label: "عالي" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl shadow-sm">
              <Image 
                src={SotetelLogo} 
                alt="Sotetel Logo" 
                width={80} 
                height={80} 
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                إنشاء مشروع جديد
              </h1>
              <p className="text-gray-500 mt-1">
                املأ التفاصيل أدناه لبدء مشروع جديد
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => location.href = "/Projects"}
            className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg border border-gray-200 shadow-sm transition duration-200"
          >
            <span>العودة إلى المشاريع</span>
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <FolderPlusIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">تفاصيل المشروع</h2>
            </div>
          </div>
          
          <form onSubmit={handleCreateProject} className="p-6 md:p-8 space-y-8">
            {/* Basic Info Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                المعلومات الأساسية
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
                    عنوان المشروع <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="title"
                      type="text"
                      placeholder="مثال: لوحة تحكم جديدة"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Project Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                    وصف المشروع
                  </label>
                  <div className="relative">
                    <textarea
                      id="description"
                      placeholder="أدخل وصفًا للمشروع..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 min-h-[120px]"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                الجدول الزمني
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div>
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1.5">
                    تاريخ البدء <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="start-date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* End Date */}
                <div>
                  <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1.5">
                    تاريخ الانتهاء <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="end-date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Appearance Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                المظهر
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  لون المشروع
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                  {colorSwatches.map((color) => (
                    <div 
                      key={color.hex}
                      onClick={() => setSelectedColor(color.hex)}
                      className={`cursor-pointer flex flex-col items-center group ${
                        selectedColor === color.hex ? "ring-2 ring-blue-500 ring-offset-2" : ""
                      } rounded-lg p-1 transition-all duration-200`}
                    >
                      <div 
                        className="w-10 h-10 rounded-full border border-gray-200"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-xs mt-2 text-gray-600 group-hover:text-gray-900">
                        {color.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Status & Priority Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                  حالة المشروع
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelectedStatus(option.value)}
                      className={`py-3 px-4 rounded-xl border transition duration-200 ${
                        selectedStatus === option.value
                          ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                  أولوية المشروع
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {priorityOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelectedPriority(option.value)}
                      className={`py-3 px-4 rounded-xl border transition duration-200 ${
                        selectedPriority === option.value
                          ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                تقدم المشروع
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{progress}%</span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-3 text-xs flex rounded-xl bg-gray-200">
                    <div
                      style={{ width: `${progress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-indigo-600"
                    ></div>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Team Members Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                أعضاء الفريق
              </h3>
              
              <div>
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="ابحث عن الأعضاء..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-xl divide-y">
                  {filteredUsers.map((user: User) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition duration-150"
                    >
                      <input
                        type="checkbox"
                        value={user.id}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        checked={teamMemberIds.includes(user.id)}
                        onChange={(e) => {
                          const id = e.target.value;
                          setTeamMemberIds((prev) =>
                            prev.includes(id)
                              ? prev.filter((uid) => uid !== id)
                              : [...prev, id]
                          );
                        }}
                      />
                      <div className="flex-shrink-0">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 flex items-center justify-center text-gray-500 font-bold">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {user.role === "ADMIN" ? "مدير" : 
                         user.role === "MANAGER" ? "مسؤول" : 
                         user.role === "CLIENT" ? "عميل" : 
                         user.role === "TEAM" ? "فريق" : "زائر"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-lg transition duration-300 disabled:opacity-70 flex items-center justify-center"
              >
                <FolderPlusIcon className="h-5 w-5 mr-2" />
                إنشاء المشروع
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;