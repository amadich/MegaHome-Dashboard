"use client";
export const runtime = 'edge';

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { gql } from "graphql-tag";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { ChevronRightIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import SotetelLogo from "@/assets/images/sotetel_logo.png";
import { TokenInfoUser } from "@/components/authUsers/TokenInfoUser";

const UPDATE_USER = gql`
  mutation UpdateUser($inputUpdate: UpdateUserInput!) {
    updateUser(inputUpdate: $inputUpdate) {
      id
      firstName
      lastName
      email
      role
    }
  }
`;

const GET_SINGLE_USER = gql`
  query user($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      email
      phoneNumber
      status
      birthDate
      role
    }
  }
`;

interface idProps {
  id: string;
}

const Updateuserget = ({ id }: idProps) => {
  const router = useRouter();
  const userInfo = TokenInfoUser();
  
  // State declarations
  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("FullTime");
  const [role, setRole] = useState("CLIENT");
  const [birthDate, setBirthDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Get user ID from token
  useEffect(() => {
    const GetuserId = userInfo?.id || "";
    setUserId(GetuserId);
  }, [userInfo]);

  // Query handling
  const { data, loading: queryLoading, error: queryError } = useQuery(GET_SINGLE_USER, {
    variables: { id },
    fetchPolicy: "network-only" // Ensures fresh data
  });

  // Update form state when data loads
  useEffect(() => {
    if (data?.user) {
      const user = data.user;
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhoneNumber(user.phoneNumber || "");
      setStatus(user.status);
      setRole(user.role);
      setBirthDate(user.birthDate || "");
      setIsLoading(false);
    }
  }, [data]);

  // Handle query errors
  useEffect(() => {
    if (queryError) {
      Swal.fire("خطأ!", "المستخدم غير موجود", "error");
      setTimeout(() => {
        router.push("/Dashboard/ManageUsers");
      }, 2000);
    }
  }, [queryError, router]);

  // Mutation handling
  const [updateUserMutation, { loading, error }] = useMutation(UPDATE_USER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updateData = {
      id,
      userId,
      firstName,
      lastName,
      email,
      password: password || undefined,
      phoneNumber: phoneNumber || null,
      status,
      role,
      birthDate: birthDate || null,
    };

    try {
      await updateUserMutation({
        variables: {
          inputUpdate: updateData,
        },
      });

      Swal.fire({
        title: "تم تحديث المستخدم بنجاح!",
        text: "تم تحديث تفاصيل المستخدم بنجاح",
        icon: "success",
        confirmButtonText: "حسنًا",
        customClass: {
          confirmButton: "bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition"
        }
      }).then(() => {
        location.href = "/Dashboard/ManageUsers";
      });
    } catch (err) {
      Swal.fire({
        title: "خطأ!",
        text: error?.message || "فشل في تحديث المستخدم",
        icon: "error",
        confirmButtonText: "حسنًا",
        customClass: {
          confirmButton: "bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition"
        }
      });
    }
  };

  // Status options with Arabic translations
  const statusOptions = [
    { value: "FullTime", label: "دوام كامل" },
    { value: "PartTime", label: "دوام جزئي" },
    { value: "Intern", label: "متدرب" },
    { value: "Freelancer", label: "مستقل" }
  ];

  // Role options with Arabic translations
  const roleOptions = [
    { value: "ADMIN", label: "مدير نظام" },
    { value: "MANAGER", label: "مدير" },
    { value: "CLIENT", label: "عميل" },
    { value: "TEAM", label: "فريق" },
    { value: "GUEST", label: "زائر" }
  ];

  if (isLoading || queryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">جاري تحميل بيانات المستخدم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
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
                تحديث بيانات المستخدم
              </h1>
              <p className="text-gray-500 mt-1">
                قم بتحديث معلومات المستخدم أدناه
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => router.push("/Dashboard/ManageUsers")}
            className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg border border-gray-200 shadow-sm transition duration-200"
          >
            <span>العودة إلى المستخدمين</span>
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <UserCircleIcon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">معلومات المستخدم</h2>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            {/* Personal Info Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                المعلومات الشخصية
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    الاسم الأول <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="first-name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="أدخل الاسم الأول"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    اسم العائلة <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="last-name"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="أدخل اسم العائلة"
                    />
                  </div>
                </div>
              </div>

              {/* Birth Date */}
              <div>
                <label htmlFor="birth-date" className="block text-sm font-medium text-gray-700 mb-1.5">
                  تاريخ الميلاد
                </label>
                <div className="relative">
                  <input
                    id="birth-date"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Contact Info Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                معلومات التواصل
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="example@company.com"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-1.5">
                    رقم الهاتف
                  </label>
                  <div className="relative">
                    <input
                      id="phone-number"
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="+966 5X XXX XXXX"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Info Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                معلومات الحساب
              </h3>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  كلمة المرور الجديدة (اختياري)
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="اتركه فارغًا للحفاظ على كلمة المرور الحالية"
                  />
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">اترك الحقل فارغًا إذا كنت لا تريد تغيير كلمة المرور</p>
              </div>
            </div>

            {/* Status & Role Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                  حالة المستخدم
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setStatus(option.value)}
                      className={`py-3 px-4 rounded-xl border transition duration-200 ${
                        status === option.value
                          ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Role */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                  دور المستخدم
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRole(option.value)}
                      className={`py-3 px-4 rounded-xl border transition duration-200 ${
                        role === option.value
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

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-lg transition duration-300 disabled:opacity-70 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري التحديث...
                  </>
                ) : (
                  "تحديث المستخدم"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Updateuserget;