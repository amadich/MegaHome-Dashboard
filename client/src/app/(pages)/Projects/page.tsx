"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PROJECTS, DELETE_PROJECT } from "@/app/graphql/projectMutation";
import { useRouter } from "next/navigation";
import LoadingShow from "@/components/LoadingShow";
import Image from "next/image";
import iconSotetel from "@/assets/icons/cropped-favicon-32x32.png";
import LogoSotetel from "@/assets/images/sotetel_logo.png";
import Swal from "sweetalert2";
import { 
  FunnelIcon, 
  PlusIcon, 
  EllipsisVerticalIcon, 
  MagnifyingGlassIcon,
  ClockIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  PauseCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  teamMembers: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
}

const ProjectsMainPage = () => {
  const { data, loading, error, refetch } = useQuery(GET_PROJECTS);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [DELETE_PROJECT_NOW] = useMutation(DELETE_PROJECT);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.id);
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  if (loading) return <LoadingShow msg="جاري تحميل المشاريع..." />;
  if (error) return <LoadingShow msg="خطأ في تحميل المشاريع" />;

  const projects = data?.projects || [];

  const filteredProjects = projects.filter((project: Project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? project.status === statusFilter : true;
    const hasAccess = userRole === "MANAGER" || userRole === "ADMIN" 
      ? true 
      : project.teamMembers.some(member => member.id === userId);

    return matchesSearch && matchesStatus && hasAccess;
  });

  const handleEditProject = (projectId: string) => {
    router.push(`/Projects/UpdateProject/${projectId}`);
  };

  const handleDeleteProject = async (projectId: string) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "لا يمكن التراجع عن هذا الإجراء!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذفه!',
      cancelButtonText: 'إلغاء',
    });

    if (result.isConfirmed) {
      await DELETE_PROJECT_NOW({
        variables: {
          inputDelete: {
            userId: userId,
            id: projectId,
          },
        },
      });
      Swal.fire('تم الحذف!', 'تم حذف المشروع بنجاح.', 'success');
      refetch();
    }
  };

  const isAdminOrManager = userRole === "MANAGER" || userRole === "ADMIN";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="badge bg-green-100 text-green-800 border-green-200 flex items-center">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            نشط
          </span>
        );
      case 'ON_HOLD':
        return (
          <span className="badge bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center">
            <PauseCircleIcon className="h-4 w-4 mr-1" />
            قيد الانتظار
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="badge bg-red-100 text-red-800 border-red-200 flex items-center">
            <XCircleIcon className="h-4 w-4 mr-1" />
            مكتمل
          </span>
        );
      default:
        return <span className="badge bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getDateInfo = (dateString: string) => {
    const date = new Date(dateString);
    return {
      formattedDate: date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' }),
      year: date.getFullYear()
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200">
              <Image
                src={LogoSotetel}
                alt="Sotetel"
                width={80}
                height={80}
                className="object-contain"
                draggable={false}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                مشاريع شركة ميكا هوم
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {filteredProjects.length}
                </span>
              </h1>
              <p className="text-gray-600 mt-2">
                إدارة وتتبع جميع مشاريعك في مكان واحد
              </p>
            </div>
          </div>

          {isAdminOrManager && (
            <button
              onClick={() => router.push("/Projects/CreateProject")}
              className="btn btn-info flex items-center gap-2 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              إنشاء مشروع جديد
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-slate-100 rounded-2xl shadow-sm border-none border-gray-200 p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="ابحث عن مشروع..."
                className="input input-bordered w-full pl-10 rounded-xl bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>

            <div className="flex items-center gap-4">
              <div className="dropdown dropdown-bottom dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-outline flex items-center gap-2 rounded-xl">
                  <FunnelIcon className="w-5 h-5" />
                  <span>تصفية الحالة</span>
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 p-2 shadow-lg w-52">
                  <li><span onClick={() => setStatusFilter("")}>الكل</span></li>
                  <li><span className="flex justify-between items-center" onClick={() => setStatusFilter("ACTIVE")}> 
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      <span>نشط</span>
                    </div>
                    <span className="badge badge-sm bg-green-100 text-green-800 border-0">نشط</span>
                  </span></li>
                  <li><span className="flex justify-between items-center" onClick={() => setStatusFilter("ON_HOLD")}> 
                    <div className="flex items-center gap-2">
                      <PauseCircleIcon className="w-4 h-4 text-yellow-500" />
                      <span>قيد الانتظار</span>
                    </div>
                    <span className="badge badge-sm bg-yellow-100 text-yellow-800 border-0">انتظار</span>
                  </span></li>
                  <li><span className="flex justify-between items-center" onClick={() => setStatusFilter("COMPLETED")}> 
                    <div className="flex items-center gap-2">
                      <XCircleIcon className="w-4 h-4 text-red-500" />
                      <span>مكتمل</span>
                    </div>
                    <span className="badge badge-sm bg-red-100 text-red-800 border-0">مكتمل</span>
                  </span></li>
                </ul>
              </div>

              <button 
                onClick={() => refetch()}
                className="btn btn-ghost rounded-xl"
              >
                <ArrowPathIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="mx-auto max-w-md">
              <div className="bg-gray-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <DocumentTextIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد مشاريع</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || statusFilter 
                  ? "لم يتم العثور على مشاريع تطابق معايير البحث الخاصة بك" 
                  : "لم يتم إنشاء أي مشاريع بعد. ابدأ بإنشاء مشروعك الأول!"}
              </p>
              {isAdminOrManager && (
                <button
                  onClick={() => router.push("/Projects/CreateProject")}
                  className="btn btn-primary gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  إنشاء مشروع جديد
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: Project) => {
              const startDate = getDateInfo(project.startDate);
              const endDate = getDateInfo(project.endDate);
              
              return (
                <div 
                  key={project.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  <div className="p-5">
                    {/* Project Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-lg">
                          <Image
                            src={iconSotetel}
                            alt="Sotetel"
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h3 
                            className="font-bold text-lg text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => router.push(`/Projects/${project.id}`)}
                          >
                            {project.title}
                          </h3>
                          <div className="mt-1">
                            {getStatusBadge(project.status)}
                          </div>
                        </div>
                      </div>
                      
                      {isAdminOrManager && (
                        <div className="dropdown dropdown-end">
                          <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                            <EllipsisVerticalIcon className="w-5 h-5 text-gray-500" />
                          </div>
                          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 p-2 shadow w-40">
                            <li>
                              <button onClick={() => handleEditProject(project.id)} className="hover:bg-gray-100 p-2 rounded-md">
                                تعديل المشروع
                              </button>
                            </li>
                            <li>
                              <button onClick={() => handleDeleteProject(project.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-md">
                                حذف المشروع
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    {/* Project Description */}
                    <div className="mb-6">
                      <p className="text-gray-600 text-sm">
                        {project.description.substring(0, 120)}
                        {project.description.length > 120 && '...'}
                      </p>
                    </div>
                    
                    {/* Project Timeline */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-center">
                        <div className="text-xs text-gray-500">تاريخ البدء</div>
                        <div className="font-bold">{startDate.formattedDate}</div>
                        <div className="text-xs text-gray-400">{startDate.year}</div>
                      </div>
                      
                      <div className="h-0.5 bg-gray-200 flex-grow mx-2 relative">
                        <div className="absolute top-[-5px] left-0 right-0 flex justify-center">
                          <ClockIcon className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xs text-gray-500">تاريخ الانتهاء</div>
                        <div className="font-bold">{endDate.formattedDate}</div>
                        <div className="text-xs text-gray-400">{endDate.year}</div>
                      </div>
                    </div>
                    
                    {/* Team Members */}
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <UserGroupIcon className="h-4 w-4" />
                          <span>أعضاء الفريق</span>
                          <span className="bg-gray-100 text-gray-800 rounded-full px-2 py-0.5 text-xs">
                            {project.teamMembers.length}
                          </span>
                        </div>
                        <button 
                          className="text-xs text-blue-600 hover:underline"
                          onClick={() => router.push(`/Projects/${project.id}`)}
                        >
                          عرض الجميع
                        </button>
                      </div>
                      
                      <div className="flex -space-x-2">
                        {project.teamMembers.slice(0, 5).map((member) => (
                          <div 
                            key={member.id}
                            className="avatar tooltip" 
                            data-tip={`${member.firstName} ${member.lastName}`}
                          >
                            <div className="w-9 h-9 rounded-full border-2 border-white">
                              <img
                                src={`https://ui-avatars.com/api/?name=${member.firstName}+${member.lastName}&background=random`}
                                alt={member.firstName}
                                className="rounded-full"
                              />
                            </div>
                          </div>
                        ))}
                        {project.teamMembers.length > 5 && (
                          <div className="avatar placeholder">
                            <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-700 border-2 border-white">
                              <span className="text-xs">+{project.teamMembers.length - 5}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Project Footer */}
                  <div 
                    className="bg-gray-50 p-4 border-t border-gray-100 text-center cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => router.push(`/Projects/${project.id}`)}
                  >
                    <div className="text-blue-600 font-medium flex items-center justify-center gap-2">
                      <span>عرض تفاصيل المشروع</span>
                      <ChartBarIcon className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsMainPage;