"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_PROJECTS } from "@/app/graphql/projectMutation";
import { useRouter } from "next/navigation";
import LoadingShow from "@/components/LoadingShow";
import Image from "next/image";
import LogoSotetel from "@/assets/images/sotetel_logo.png";
import { FunnelIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import "@/assets/styles/Main_Projects.css";
import Snowflakes from "@/components/Snowflakes";

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  color: string;
  startDate: string;
  endDate: string;
  teamMembers: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
}

const TeamPage = () => {
  const { data, loading, error } = useQuery(GET_PROJECTS);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<Project["teamMembers"]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return <LoadingShow msg="جاري تحميل المشاريع..." />;
  }

  if (error) {
    return <LoadingShow msg="خطأ في تحميل المشاريع" />;
  }

  const projects = data?.projects || [];

  // Filter projects based on the search query and status filter
  const filteredProjects = projects.filter((project: Project) => {
    const matchesSearchQuery = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatusFilter = statusFilter ? project.status === statusFilter : true;
    return matchesSearchQuery && matchesStatusFilter;
  });

  const handleTeamMemberClick = (team: Project["teamMembers"]) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const statusBadges = {
    ACTIVE: "bg-emerald-100 text-emerald-800",
    ON_HOLD: "bg-amber-100 text-amber-800",
    COMPLETED: "bg-rose-100 text-rose-800"
  };

  return (
    <>
      <Snowflakes />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Modern Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pt-4">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <Image 
                  src={LogoSotetel} 
                  alt="Sotetel" 
                  width={80} 
                  height={80} 
                  draggable={false}
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">مشاريع الفريق</h1>
                <p className="text-gray-500 mt-1">شركة ميكا هوم - إدارة المشاريع</p>
              </div>
            </div>
            
            <div className="flex-1 max-w-lg w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث عن المشاريع..."
                  className="w-full p-4 pr-12 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <MagnifyingGlassIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </header>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-white rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">تصفية:</span>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setStatusFilter("")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!statusFilter ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  الكل
                </button>
                <button 
                  onClick={() => setStatusFilter("ACTIVE")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${statusFilter === "ACTIVE" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  نشط
                </button>
                <button 
                  onClick={() => setStatusFilter("ON_HOLD")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${statusFilter === "ON_HOLD" ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  معلق
                </button>
                <button 
                  onClick={() => setStatusFilter("COMPLETED")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${statusFilter === "COMPLETED" ? "bg-rose-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  مكتمل
                </button>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <FunnelIcon className="w-4 h-4 mr-1" />
              <span>تم العثور على {filteredProjects.length} مشروع</span>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project: Project) => (
                <div 
                  key={project.id} 
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                >
                  {/* Card Header */}
                  <div 
                    className="p-5 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50"
                    onClick={() => router.push(`/Projects/${project.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div 
                            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md"
                            style={{ backgroundColor: project.color }}
                          >
                            {project.title.charAt(0).toUpperCase()}
                          </div>
                          <h3 className="font-bold text-lg text-gray-800 truncate">{project.title}</h3>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadges[project.status as keyof typeof statusBadges]}`}>
                        {project.status === "ACTIVE" && "نشط"}
                        {project.status === "ON_HOLD" && "معلق"}
                        {project.status === "COMPLETED" && "مكتمل"}
                      </span>
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm">
                        <div className="text-gray-500">تاريخ البدء:</div>
                        <div className="font-medium">{new Date(project.startDate).toLocaleDateString()}</div>
                      </div>
                      <div className="text-sm text-right">
                        <div className="text-gray-500">تاريخ الانتهاء:</div>
                        <div className="font-medium text-rose-600">{new Date(project.endDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <div className="mb-5">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">أعضاء الفريق:</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {project.teamMembers.length} عضو
                        </span>
                      </div>
                      <div className="flex -space-x-2">
                        {project.teamMembers.slice(0, 5).map((member) => (
                          <div 
                            key={member.id} 
                            className="relative group cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/Profile/${member.id}`);
                            }}
                          >
                            <img
                              src={`https://ui-avatars.com/api/?name=${member.firstName}+${member.lastName}&background=random`}
                              alt="Avatar"
                              className="w-10 h-10 rounded-full border-2 border-white shadow"
                              draggable={false}
                            />
                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                              {member.firstName} {member.lastName}
                            </div>
                          </div>
                        ))}
                        {project.teamMembers.length > 5 && (
                          <div className="bg-gray-100 text-gray-600 rounded-full w-10 h-10 flex items-center justify-center text-xs border-2 border-white">
                            +{project.teamMembers.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTeamMemberClick(project.teamMembers);
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg"
                    >
                      عرض فريق العمل
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 py-20 text-center">
                <div className="bg-white p-12 rounded-2xl shadow-sm">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">لا توجد مشاريع</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    لم يتم العثور على أي مشاريع تطابق معايير البحث الخاصة بك.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modern Team Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">أعضاء الفريق</h3>
                <button 
                  onClick={closeModal}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto">
                {selectedTeam.map((member) => (
                  <div 
                    key={member.id} 
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/Profile/${member.id}`)}
                  >
                    <img
                      src={`https://ui-avatars.com/api/?name=${member.firstName}+${member.lastName}&background=random`}
                      alt="Avatar"
                      className="w-14 h-14 rounded-full border-2 border-white shadow"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 truncate">{member.firstName} {member.lastName}</h4>
                      <p className="text-sm text-gray-500 truncate">{member.email}</p>
                    </div>
                    <div className="bg-blue-50 text-blue-600 rounded-full px-3 py-1 text-xs font-medium">
                      عضو
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-5 border-t border-gray-100">
                <button 
                  onClick={closeModal}
                  className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl text-sm font-medium transition-all"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TeamPage;