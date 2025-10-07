export const runtime = 'edge';

"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_PROSPECTS, GET_PROSPECT_BY_ID, UPDATE_PROSPECT } from "@/app/graphql/prospectOperations";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import SotetelLogo from "@/assets/images/sotetel_logo.png";
import Image from "next/image";
import { TokenInfoUser } from "@/components/authUsers/TokenInfoUser";
import LoadingShow from "@/components/LoadingShow";

const UpdateProspect = () => {
  const { id } = useParams();
  const userInfo = TokenInfoUser();
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [contactStatus, setContactStatus] = useState<"NOT_CONTACTED" | "CONTACTED" | "CLOSED">("NOT_CONTACTED");
  
  const router = useRouter();

  // جلب بيانات العميل المحتمل الحالية
  const { data, loading: queryLoading, error: queryError } = useQuery(GET_PROSPECT_BY_ID, {
    variables: { id },
    skip: !id,
  });

  useEffect(() => {
    if (data?.getProspectById) {
      const prospect = data.getProspectById;
      setFullName(prospect.fullName);
      setPhone(prospect.phone);
      setAddress(prospect.address);
      setContactStatus(prospect.contactStatus);
    }
  }, [data]);

  useEffect(() => {
    const GetuserId = userInfo?.id || "";
    setUserId(GetuserId);
  }, [userInfo]);

  const [updateProspectMutation, { loading, error }] = useMutation(UPDATE_PROSPECT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const prospectData = {
      fullName,
      phone,
      address,
      contactStatus
    };

    try {
      await updateProspectMutation({
        variables: { id, input: prospectData },
        refetchQueries: [
          { query: GET_PROSPECT_BY_ID, variables: { id } },
          { query: GET_ALL_PROSPECTS }
        ],
      });

      Swal.fire({
        title: "تم التحديث!",
        text: "تم تحديث العميل المحتمل بنجاح",
        icon: "success",
      });

      setTimeout(() => {
        router.push("/Records/Prospects");
      }, 1500);
    } catch (err) {
      Swal.fire({
        title: "خطأ!",
        text: error?.message || "حدث خطأ أثناء التحديث",
        icon: "error",
      });
    }
  };

  if (queryLoading) return <LoadingShow msg="جاري تحميل بيانات العميل المحتمل..." />;
  if (queryError) return <LoadingShow msg="خطأ في تحميل بيانات العميل المحتمل" />;

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-xl space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Image 
            src={SotetelLogo} 
            alt="Sotetel Logo" 
            width={100} 
            height={100} 
            className="rounded-lg"
          />
          <h1 className="text-2xl font-semibold text-gray-800">
            تحديث <span className="text-blue-500">العميل المحتمل</span>
          </h1>
        </div>
        <button 
          onClick={() => router.push("/Records/Prospects")} 
          className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          <span>العودة إلى العملاء المحتملين</span>
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* حالة التواصل */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              حالة التواصل
            </label>
            <div className="mt-2 flex flex-col gap-2">
              {[
                { value: "NOT_CONTACTED", label: "لم يتم التواصل", color: "bg-gray-200 text-gray-800" },
                { value: "CONTACTED", label: "تم التواصل", color: "bg-blue-200 text-blue-800" },
                { value: "CLOSED", label: "تم الإغلاق", color: "bg-green-200 text-green-800" }
              ].map((option) => (
                <div
                  key={option.value}
                  onClick={() => setContactStatus(option.value as any)}
                  className={`cursor-pointer p-3 rounded-lg transition duration-300 flex items-center ${
                    contactStatus === option.value
                      ? `${option.color} border-2 border-blue-500`
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full mr-3 ${
                    contactStatus === option.value 
                      ? "bg-blue-500 border-2 border-white" 
                      : "bg-white border border-gray-300"
                  }`}></div>
                  <span className="font-medium">{option.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* الاسم الكامل */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-600 mb-2">
              الاسم الكامل
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* الهاتف */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-2">
              الهاتف
            </label>
            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>

          {/* العنوان */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-600 mb-2">
              العنوان
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>
        </div>

        {/* زر التحديث */}
        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={() => router.push("/Records/Prospects")}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <span>جاري التحديث...</span>
                <div className="ml-2 w-4 h-4 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
              </>
            ) : (
              "تحديث العميل المحتمل"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProspect;