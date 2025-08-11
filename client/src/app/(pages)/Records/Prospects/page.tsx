"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_PROSPECTS, DELETE_PROSPECT } from "@/app/graphql/prospectOperations";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingShow from "@/components/LoadingShow";
import { FunnelIcon, PlusIcon, EllipsisVerticalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import Image from "next/image";
import iconSotetel from "@/assets/icons/cropped-favicon-32x32.png";
import "@/assets/styles/Main_Projects.css";
import { TokenInfoUser } from "@/components/authUsers/TokenInfoUser";
import img_not_found_trash from "@/assets/images/not_found_trash.svg";

interface Prospect {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  contactStatus: 'not_contacted' | 'contacted' | 'closed';
}

const ManageProspects = () => {
  const userInfo = TokenInfoUser();
  const [userId, setUserId] = useState("");
  const { data, loading, error, refetch } = useQuery(GET_ALL_PROSPECTS);
  const [deleteProspect] = useMutation(DELETE_PROSPECT);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    const GetuserId = userInfo?.id || "";
    setUserId(GetuserId);
  }, [userInfo]);

  if (loading) return <LoadingShow msg="جاري تحميل العملاء المحتملين..." />;
  if (error) return <LoadingShow msg="خطأ في تحميل العملاء المحتملين" />;

  const prospects = data?.getAllProspects || [];

  // Filter prospects
  const filteredProspects = prospects.filter((prospect: Prospect) => {
    const matchesSearch = 
      prospect.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      prospect.phone.includes(searchQuery) ||
      prospect.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? prospect.contactStatus === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteProspect = async (id: string) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "لا يمكن التراجع عن هذا الإجراء!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذفه!',
      cancelButtonText: 'إلغاء',
    });

    if (result.isConfirmed) {
      await deleteProspect({
        variables: { id },
        refetchQueries: [{ query: GET_ALL_PROSPECTS }],
      });
      Swal.fire('تم الحذف!', 'تم حذف العميل المحتمل بنجاح.', 'success');
    }
  };

  // Status badge styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'not_contacted': return "bg-gray-100 text-gray-800";
      case 'contacted': return "bg-blue-100 text-blue-800";
      case 'closed': return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Translate status for display
  const translateStatus = (status: string) => {
    switch (status) {
      case 'not_contacted': return "لم يتم التواصل";
      case 'contacted': return "تم التواصل";
      case 'closed': return "تم الإغلاق";
      default: return status;
    }
  };

  return (
    <div className="mx-auto h-full p-6 space-y-6 bg-bg-white rounded-lg">
      <div className="flex items-center justify-between select-none">
        <div className="flex items-center space-x-2">
          <Image
            src={iconSotetel}
            alt="Sotetel"
            width={32}
            height={32}
            className="mask mask-squircle"
            draggable={false}
          />
          <p className="text-gray-500">إدارة العملاء المحتملين</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="ابحث بالاسم أو الهاتف أو العنوان"
            className="input input-bordered w-full md:w-[800px] max-w-xs pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute right-3 w-5 h-5 text-gray-500" />
        </div>
        
        <div className="relative flex items-center space-x-4 z-30">
          {/* Status Filter */}
          <div className="dropdown dropdown-start">
            <div tabIndex={0} role="button" className="flex items-center btn rounded-lg m-1">
              <FunnelIcon className="w-6 h-6" />
              <p>تصفية حسب الحالة</p>
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
              <li><span onClick={() => setStatusFilter("")}>الكل</span></li>
              <li><span onClick={() => setStatusFilter("not_contacted")}>لم يتم التواصل</span></li>
              <li><span onClick={() => setStatusFilter("contacted")}>تم التواصل</span></li>
              <li><span onClick={() => setStatusFilter("closed")}>تم الإغلاق</span></li>
            </ul>
          </div>

          <button
            onClick={() => router.push("/Records/Prospects/CreateProspect")}
            className="btn py-3 font-semibold rounded-md shadow-md bg-white text-[#333] border-[#333] duration-300 hover:text-white hover:bg-[#333]"
          >
            <PlusIcon className="w-4 h-4" /> إضافة عميل محتمل
          </button>
        </div>
      </div>

      {/* Prospects Table */}
      <div className="scroll-container">
        <table className="table w-full text-left">
          <thead>
            <tr>
              <th className="text-gray-700">الاسم الكامل</th>
              <th className="text-gray-700">الهاتف</th>
              <th className="text-gray-700">العنوان</th>
              <th className="text-gray-700">حالة التواصل</th>
              <th className="text-gray-700">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredProspects.length > 0 ? (
              filteredProspects.map((prospect: Prospect) => (
                <tr key={prospect.id}>
                  <td>{prospect.fullName}</td>
                  <td>{prospect.phone}</td>
                  <td>{prospect.address}</td>
                  <td>
                    <span className={`badge ${getStatusStyle(prospect.contactStatus)}`}>
                      {translateStatus(prospect.contactStatus)}
                    </span>
                  </td>
                  <td className="flex items-center justify-center gap-3">
                    <div className="dropdown dropdown-left">
                      <button className="btn btn-ghost btn-xs" tabIndex={0}>
                        <EllipsisVerticalIcon className="w-5 h-5 text-gray-700" />
                      </button>
                      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-white rounded-box w-40">
                        <li>
                          <button 
                            className="hover:bg-[whitesmoke] hover:text-black p-2 rounded-md w-full text-left"
                            onClick={() => router.push(`/Records/Prospects/UpdateProspect/${prospect.id}`)}
                          >
                            تعديل
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleDeleteProspect(prospect.id)}
                            className="text-error hover:bg-error hover:text-white p-2 rounded-md w-full text-left"
                          >
                            حذف
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-500">
                  <Image
                    src={img_not_found_trash}
                    alt="No Prospects Found"
                    width={100}
                    height={100}
                    draggable={false}
                    className="mx-auto mb-4"
                  />
                  لا توجد عملاء محتملين.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProspects;