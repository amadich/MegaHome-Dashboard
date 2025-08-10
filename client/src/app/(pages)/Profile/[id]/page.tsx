"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { 
  UserCircleIcon, 
  BriefcaseIcon, 
  CalendarDaysIcon,
  EnvelopeIcon,
  CakeIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const GET_FOR_PROFILE_PROJECTS = gql`
  query GetForProfileProjects {
    projects {
      id
      title
      description
      status
      color
      startDate
      endDate
      teamMembers {
        id
        firstName
        lastName
        email
        role
        status
        birthDate
      }
    }
  }
`;

interface DecodedToken {
  id: string;
  [key: string]: any;
}

const ProfileID = () => {
  const router = useRouter();
  const { id: userId } = useParams();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  
  const { data, loading, error } = useQuery(GET_FOR_PROFILE_PROJECTS);

  useEffect(() => {
    if (data && userId) {
      const allMembers = data.projects.flatMap((p: any) => p.teamMembers);
      const foundUser = allMembers.find((m: any) => m.id === userId);
      
      if (foundUser) {
        setCurrentUser(foundUser);
        
        // Filter projects where the user is a member
        const userProjects = data.projects.filter((project: any) =>
          project.teamMembers.some((member: any) => member.id === userId)
        );
        
        setUserProjects(userProjects);
      }
    }
  }, [data, userId]);

  if (!userId) {
    return <p className="text-center mt-10 text-gray-600">معرف المستخدم مفقود في الرابط</p>;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-indigo-600 border-solid rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-indigo-800 font-medium">جاري تحميل ملفك الشخصي...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">حدث خطأ</h2>
          <p className="text-red-500 mb-6">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="bg-yellow-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <UserCircleIcon className="h-10 w-10 text-yellow-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">المستخدم غير موجود</h2>
          <p className="text-gray-600 mb-6">
            لم يتم العثور على المستخدم في أي مشروع. قد يكون المستخدم غير نشط أو تم حذفه.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'on leave': return 'bg-blue-100 text-blue-800';
      default: return 'bg-indigo-100 text-indigo-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pb-16">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-10 left-20 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-40 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <div className="w-40 h-40 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-1 shadow-xl">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                  <UserCircleIcon className="h-24 w-24 text-indigo-300" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(currentUser?.status)}`}>
                  {currentUser?.status}
                </div>
              </div>
            </div>
            
            <div className="text-center md:text-left text-white">
              <h1 className="text-3xl md:text-4xl font-bold">
                {currentUser?.firstName} {currentUser?.lastName}
              </h1>
              <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                <div className="bg-indigo-600 bg-opacity-50 px-3 py-1 rounded-full text-sm flex items-center">
                  <BriefcaseIcon className="h-4 w-4 mr-1" />
                  {currentUser?.role}
                </div>
                {currentUser?.birthDate && (
                  <div className="bg-indigo-600 bg-opacity-50 px-3 py-1 rounded-full text-sm flex items-center">
                    <CakeIcon className="h-4 w-4 mr-1" />
                    {new Date(currentUser.birthDate).toLocaleDateString()}
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 mr-2 text-indigo-300" />
                  <span>{currentUser?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Projects Section */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  مشاريعك <span className="text-indigo-600">الشخصية</span>
                </h2>
                <p className="text-gray-600 mt-2 max-w-2xl">
                  هنا قائمة المشاريع التي تشارك فيها حاليًا. انقر على المشروع لعرض المزيد من التفاصيل.
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center">
                <span className="text-gray-500 mr-2">عدد المشاريع:</span>
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-bold">
                  {userProjects.length}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProjects.length > 0 ? (
                userProjects.map((project: any) => (
                  <div 
                    key={project.id}
                    className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                    onClick={() => router.push(`/Projects/${project.id}`)}
                  >
                    <div 
                      className="h-2 w-full" 
                      style={{ backgroundColor: project.color || "#4C6EF5" }}
                    ></div>
                    
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-gray-800">{project.title}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          {project.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mt-3 text-sm line-clamp-2">
                        {project.description}
                      </p>
                      
                      <div className="flex items-center mt-4 text-sm text-gray-500">
                        <CalendarDaysIcon className="h-4 w-4 mr-1" />
                        <span>
                          {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <button className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium">
                          عرض التفاصيل
                          <ChevronRightIcon className="h-4 w-4 mr-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <div className="mx-auto bg-indigo-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <BriefcaseIcon className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">لا توجد مشاريع</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    أنت لست جزءًا من أي مشروع حتى الآن. سيتم إضافتك إلى مشاريع قريبًا.
                  </p>
                  <button 
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    onClick={() => router.push('/Projects')}
                  >
                    تصفح المشاريع
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="bg-gray-50 border-t border-gray-200 p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">إحصائيات المستخدم</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="text-gray-500 text-sm mb-2">المشاريع النشطة</div>
                <div className="text-3xl font-bold text-indigo-600">
                  {userProjects.filter((p: any) => p.status === 'Active').length}
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="text-gray-500 text-sm mb-2">المشاريع المكتملة</div>
                <div className="text-3xl font-bold text-green-600">
                  {userProjects.filter((p: any) => p.status === 'Completed').length}
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="text-gray-500 text-sm mb-2">المشاريع المستقبلية</div>
                <div className="text-3xl font-bold text-yellow-600">
                  {userProjects.filter((p: any) => p.status === 'Pending').length}
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="text-gray-500 text-sm mb-2">المشاريع المتأخرة</div>
                <div className="text-3xl font-bold text-red-600">
                  {userProjects.filter((p: any) => p.status === 'Delayed').length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ProfileID;