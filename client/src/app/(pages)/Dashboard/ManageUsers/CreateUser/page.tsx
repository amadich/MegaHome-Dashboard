"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "graphql-tag";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { ChevronRightIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import SotetelLogo from "@/assets/images/sotetel_logo.png";
import Image from "next/image";
import { TokenInfoUser } from "@/components/authUsers/TokenInfoUser";

const CREATE_USER = gql`
  mutation createUser($user: UserInput!) {
    createUser(user: $user) {
      token
    }
  }
`;

const CreateUser = () => {
  const userInfo = TokenInfoUser();
  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("FullTime");
  const [role, setRole] = useState("CLIENT");
  const [birthDate, setBirthDate] = useState("");

  useEffect(() => {
    const GetuserId = userInfo?.id || "";
    setUserId(GetuserId);
  }, [userInfo]);

  const [createUserMutation, { loading, error }] = useMutation(CREATE_USER);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      userId,
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      status,
      role,
      birthDate: birthDate || null,
    };

    try {
      const response = await createUserMutation({
        variables: {
          user: userData,
        },
      });

      const token = response?.data?.createUser?.token;

      if (token) {
        Swal.fire({
          title: "تم إنشاء المستخدم بنجاح!",
          text: "تم إنشاء المستخدم وتم إنشاء رمز مميز.",
          icon: "success",
        });
        setTimeout(() => {
          location.href = "/Dashboard/ManageUsers";
        }, 2000);
      }
    } catch (err) {
      Swal.fire({
        title: "خطأ!",
        text: error?.message || "حدث خطأ ما!",
        icon: "error",
      });
    }
  };

  // Status and role options with Arabic translations
  const statusOptions = [
    { value: "FullTime", label: "دوام كامل" },
    { value: "PartTime", label: "دوام جزئي" },
    { value: "Intern", label: "متدرب" },
    { value: "Freelancer", label: "مستقل" }
  ];

  const roleOptions = [
    { value: "ADMIN", label: "مدير نظام" },
    { value: "MANAGER", label: "مدير" },
    { value: "CLIENT", label: "عميل" },
    { value: "TEAM", label: "فريق" },
    { value: "GUEST", label: "زائر" }
  ];

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
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
                إنشاء مستخدم جديد
              </h1>
              <p className="text-gray-500 mt-1">
                أضف معلومات المستخدم لإنشاء حساب جديد
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
                <UserPlusIcon className="h-6 w-6 text-white" />
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
              <div className="max-w-md">
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

            {/* Account Info Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                معلومات الحساب
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

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                    كلمة المرور <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div className="max-w-md">
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
                    placeholder="+964 7X XXX XXXX"
                  />
                </div>
              </div>
            </div>

            {/* Role & Status Section */}
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
                    جاري الإنشاء...
                  </>
                ) : (
                  "إنشاء المستخدم"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;