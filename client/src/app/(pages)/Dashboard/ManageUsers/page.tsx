"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS, DELETE_USER } from "@/app/graphql/userMutation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingShow from "@/components/LoadingShow";
import { 
  FunnelIcon, 
  PlusIcon, 
  EllipsisVerticalIcon, 
  MagnifyingGlassIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  BriefcaseIcon,
  UserGroupIcon,
  TrashIcon,
  PencilSquareIcon
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import Image from "next/image";
import iconSotetel from "@/assets/images/sotetel_logo.png";
import { TokenInfoUser } from "@/components/authUsers/TokenInfoUser";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  status: string;
  role: string;
  birthDate: string | null;
}

const ManageUsers = () => {
  const userInfo = TokenInfoUser();
  const [userIdme, setUserId] = useState("");

  useEffect(() => {
    const GetuserId = userInfo?.id || "";
    setUserId(GetuserId);
  }, [userInfo]);

  const { data, loading, error, refetch } = useQuery(GET_USERS);
  const [deleteUser] = useMutation(DELETE_USER);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");

  if (loading) return <LoadingShow msg="جاري تحميل المستخدمين..." />;
  if (error) return <LoadingShow msg="خطأ في تحميل المستخدمين" />;

  const users = data?.users || [];

  // Filter users
  const filteredUsers = users.filter((user: User) => {
    const matchesSearchQuery = 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRoleFilter = roleFilter ? user.role === roleFilter : true;
    return matchesSearchQuery && matchesRoleFilter;
  });

  const handleDeleteUser = async (userId: string) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "لا يمكن التراجع عن هذا الإجراء!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذفه!',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (result.isConfirmed) {
      await deleteUser({
        variables: {
          inputDelete: {
            userId: userIdme,
            id: userId,
          },
        },
        refetchQueries: [{ query: GET_USERS }],
      });
      Swal.fire('تم الحذف!', 'تم حذف المستخدم بنجاح.', 'success');
      refetch();
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClass = "badge badge-sm flex items-center gap-1";
    switch (status) {
      case "FullTime": 
        return <span className={`${baseClass} bg-green-100 text-green-800 border-green-200`}>
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          دوام كامل
        </span>;
      case "PartTime": 
        return <span className={`${baseClass} bg-yellow-100 text-yellow-800 border-yellow-200`}>
          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
          دوام جزئي
        </span>;
      case "Intern": 
        return <span className={`${baseClass} bg-blue-100 text-blue-800 border-blue-200`}>
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          متدرب
        </span>;
      case "Freelancer": 
        return <span className={`${baseClass} bg-red-100 text-red-800 border-red-200`}>
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          مستقل
        </span>;
      default:
        return <span className={`${baseClass} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  const getRoleBadge = (role: string) => {
    const baseClass = "badge badge-sm flex items-center gap-1";
    switch (role) {
      case "ADMIN": 
        return <span className={`${baseClass} bg-red-100 text-red-800 border-red-200`}>
          <UserCircleIcon className="w-4 h-4" />
          مدير
        </span>;
      case "MANAGER": 
        return <span className={`${baseClass} bg-purple-100 text-purple-800 border-purple-200`}>
          <BriefcaseIcon className="w-4 h-4" />
          مدير فريق
        </span>;
      case "CLIENT": 
        return <span className={`${baseClass} bg-gray-100 text-gray-800 border-gray-200`}>
          <UserGroupIcon className="w-4 h-4" />
          عميل
        </span>;
      case "TEAM": 
        return <span className={`${baseClass} bg-cyan-100 text-cyan-800 border-cyan-200`}>
          <UserGroupIcon className="w-4 h-4" />
          فريق
        </span>;
      case "GUEST": 
        return <span className={`${baseClass} bg-yellow-100 text-yellow-800 border-yellow-200`}>
          <UserCircleIcon className="w-4 h-4" />
          زائر
        </span>;
      default:
        return <span className={`${baseClass} bg-gray-100 text-gray-800`}>{role}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200">
              <Image
                src={iconSotetel}
                alt="Sotetel"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                إدارة المستخدمين
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {filteredUsers.length}
                </span>
              </h1>
              <p className="text-gray-600 mt-2">
                إدارة جميع المستخدمين في نظامك في مكان واحد
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/Dashboard/ManageUsers/CreateUser")}
            className="btn btn-info text-white flex items-center gap-2 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <PlusIcon className="w-5 h-5" />
            إنشاء مستخدم جديد
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border-none border-gray-200 p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ابحث بالاسم أو البريد الإلكتروني"
                className="input  w-full pl-10 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>

            <div className="flex items-center gap-4">
              <div className="dropdown dropdown-bottom dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-outline border-none flex items-center gap-2 rounded-xl">
                  <FunnelIcon className="w-5 h-5" />
                  <span>تصفية حسب الدور</span>
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 p-2 shadow-lg w-52">
                  <li><span onClick={() => setRoleFilter("")}>الكل</span></li>
                  <li>
                    <span onClick={() => setRoleFilter("ADMIN")} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500"></span>
                      مدير
                    </span>
                  </li>
                  <li>
                    <span onClick={() => setRoleFilter("MANAGER")} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                      مدير فريق
                    </span>
                  </li>
                  <li>
                    <span onClick={() => setRoleFilter("CLIENT")} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                      عميل
                    </span>
                  </li>
                  <li>
                    <span onClick={() => setRoleFilter("TEAM")} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                      فريق
                    </span>
                  </li>
                  <li>
                    <span onClick={() => setRoleFilter("GUEST")} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                      زائر
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <div className="bg-yellow-300 rounded-2xl shadow-sm border-none border-gray-200 p-12 text-center">
            <div className="mx-auto max-w-md">
              <div className="bg-gray-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <UserGroupIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">لا يوجد مستخدمون</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || roleFilter 
                  ? "لم يتم العثور على مستخدمين تطابق معايير البحث الخاصة بك" 
                  : "لم يتم إنشاء أي مستخدمين بعد. ابدأ بإنشاء المستخدم الأول!"}
              </p>
              <button
                onClick={() => router.push("/Dashboard/ManageUsers/CreateUser")}
                className="btn btn-primary gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                إنشاء مستخدم جديد
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user: User) => (
              <div 
                key={user.id}
                className="bg-white rounded-2xl shadow-sm border-none border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <div className="p-5">
                  {/* User Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-14 h-14 rounded-full">
                          <img
                            src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="rounded-full border-2 border-white shadow-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <h3 
                          className="font-bold text-lg text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => router.push(`/Profile/${user.id}`)}
                        >
                          {user.firstName} {user.lastName}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.status)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="dropdown dropdown-end">
                      <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                        <EllipsisVerticalIcon className="w-5 h-5 text-gray-500" />
                      </div>
                      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 p-2 shadow w-40">
                        <li>
                          <button 
                            onClick={() => router.push(`/Dashboard/ManageUsers/UpdateUser/${user.id}`)}
                            className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md"
                          >
                            <PencilSquareIcon className="w-4 h-4 text-gray-700" />
                            تعديل
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="flex items-center gap-2 text-red-500 hover:bg-red-50 p-2 rounded-md"
                          >
                            <TrashIcon className="w-4 h-4" />
                            حذف
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* User Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <EnvelopeIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                        <p className="text-gray-800 font-medium break-all">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <PhoneIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">رقم الهاتف</p>
                        <p className="text-gray-800 font-medium">{user.phoneNumber || "غير متوفر"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Footer */}
                <div 
                  className="bg-blue-50 p-4 border-t border-blue-100 text-center cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => router.push(`/Profile/${user.id}`)}
                >
                  <div className="text-blue-600 font-medium flex items-center justify-center gap-2">
                    <span>عرض الملف الشخصي</span>
                    <UserCircleIcon className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;