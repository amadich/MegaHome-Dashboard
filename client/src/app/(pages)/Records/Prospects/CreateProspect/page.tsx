"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_PROSPECT, GET_ALL_PROSPECTS } from "@/app/graphql/prospectOperations";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import SotetelLogo from "@/assets/images/sotetel_logo.png";
import Image from "next/image";
import { TokenInfoUser } from "@/components/authUsers/TokenInfoUser";

const CreateProspect = () => {
  const userInfo = TokenInfoUser();
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [contactStatus, setContactStatus] = useState<"NOT_CONTACTED" | "CONTACTED" | "CLOSED">("NOT_CONTACTED");

  useEffect(() => {
    const GetuserId = userInfo?.id || "";
    setUserId(GetuserId);
  }, [userInfo]);

  const [createProspectMutation, { loading, error }] = useMutation(CREATE_PROSPECT);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const prospectData = {
      fullName,
      phone,
      address,
      contactStatus
    };

    try {
      await createProspectMutation({
        variables: { input: prospectData },
        refetchQueries: [{ query: GET_ALL_PROSPECTS }],
      });

      Swal.fire({
        title: "تمت الإضافة!",
        text: "تم إنشاء العميل المحتمل بنجاح",
        icon: "success",
      });

      setTimeout(() => {
        router.push("/Records/Prospects");
      }, 1500);
    } catch (err) {
      Swal.fire({
        title: "خطأ!",
        text: error?.message || "حدث خطأ أثناء الإضافة",
        icon: "error",
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Image src={SotetelLogo} alt="Sotetel Logo" width={100} height={100} />
          <h1 className="text-2xl font-semibold text-gray-800">إضافة <span className="text-blue-500">عميل محتمل جديد</span></h1>
        </div>
        <button 
          onClick={() => router.push("/Records/Prospects")} 
          className="text-gray-600 hover:text-gray-900"
        >
          <p className="flex items-center gap-2">
            <span>العودة إلى العملاء المحتملين</span> <ChevronRightIcon className="h-6 w-6" />
          </p>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Status */}
          <div>
            <label className="block text-sm font-medium text-gray-600">حالة التواصل</label>
            <div className="mt-2 flex gap-2 flex-wrap">
              {[
                { value: "NOT_CONTACTED", label: "لم يتم التواصل" },
                { value: "CONTACTED", label: "تم التواصل" },
                { value: "CLOSED", label: "تم الإغلاق" }
                ].map((option) => (
                <span
                    key={option.value}
                    onClick={() => setContactStatus(option.value as any)}
                    className={`cursor-pointer px-4 py-2 rounded-full text-sm ${
                    contactStatus === option.value
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                    } transition duration-300`}
                >
                    {option.label}
                </span>
                ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-600">
              الاسم الكامل
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-600">
              الهاتف
            </label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-600">
              العنوان
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#000] text-white rounded-lg shadow-lg hover:bg-[#333] transition-colors duration-200 disabled:opacity-50"
        >
          {loading ? "جاري الإضافة..." : "إضافة عميل محتمل"}
        </button>
      </form>
    </div>
  );
};

export default CreateProspect;