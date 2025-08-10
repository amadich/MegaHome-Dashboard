'use client';

import { useQuery } from '@apollo/client';
import { GET_ACTIVITIES } from '@/app/graphql/activitiesQueries';
import { format, isValid } from 'date-fns';
import { 
  UserPlusIcon, 
  UserMinusIcon, 
  FolderPlusIcon, 
  FolderMinusIcon, 
  DocumentPlusIcon,
  DocumentMinusIcon,
  CubeIcon,
  UserIcon,
  ClockIcon,
  CalendarIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import SotetelLogo from "@/assets/images/sotetel_logo.png";

interface ActivityUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Activity {
  id: string;
  actionType: string;
  entityType: string;
  entityId: string;
  details?: Record<string, unknown>;
  timestamp: string;
  user?: ActivityUser;
}

// ... (formatDateSafe function remains the same) ...

export default function ActivitiesPage() {
  const { loading, error, data } = useQuery<{ activities: Activity[] }>(GET_ACTIVITIES);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="rounded-full bg-gray-200 h-16 w-16 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-64"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-bold text-red-800 mb-2">خطأ في تحميل الأنشطة</h3>
        <p className="text-red-600">{error.message}</p>
      </div>
    </div>
  );

  const getActionBadge = (actionType: string) => {
    const baseClass = 'badge badge-sm font-medium flex items-center gap-1';
    switch (actionType) {
      case 'CREATE': return <div className={`${baseClass} bg-green-100 text-green-800 border-green-200`}>
        <FolderPlusIcon className="h-4 w-4" />
        إنشاء
      </div>;
      case 'UPDATE': return <div className={`${baseClass} bg-yellow-100 text-yellow-800 border-yellow-200`}>
        <FolderMinusIcon className="h-4 w-4" />
        تحديث
      </div>;
      case 'DELETE': return <div className={`${baseClass} bg-red-100 text-red-800 border-red-200`}>
        <UserMinusIcon className="h-4 w-4" />
        حذف
      </div>;
      case 'LOGIN': return <div className={`${baseClass} bg-blue-100 text-blue-800 border-blue-200`}>
        <UserPlusIcon className="h-4 w-4" />
        تسجيل دخول
      </div>;
      case 'ADD_TEAM_MEMBER': return <div className={`${baseClass} bg-indigo-100 text-indigo-800 border-indigo-200`}>
        <UserPlusIcon className="h-4 w-4" />
        إضافة عضو
      </div>;
      case 'REMOVE_TEAM_MEMBER': return <div className={`${baseClass} bg-purple-100 text-purple-800 border-purple-200`}>
        <UserMinusIcon className="h-4 w-4" />
        إزالة عضو
      </div>;
      default: return <div className={`${baseClass} bg-gray-100 text-gray-800 border-gray-200`}>{actionType}</div>;
    }
  };

  const getEntityIcon = (entityType: string) => {
    const iconClass = "h-5 w-5";
    switch (entityType) {
      case 'USER': return <UserIcon className={`${iconClass} text-blue-500`} />;
      case 'PROJECT': return <FolderPlusIcon className={`${iconClass} text-green-500`} />;
      case 'DOCUMENT': return <DocumentPlusIcon className={`${iconClass} text-amber-500`} />;
      case 'TASK': return <CubeIcon className={`${iconClass} text-purple-500`} />;
      default: return <InformationCircleIcon className={`${iconClass} text-gray-500`} />;
    }
  };

  const getEntityLabel = (entityType: string) => {
    switch (entityType) {
      case 'USER': return 'مستخدم';
      case 'PROJECT': return 'مشروع';
      case 'DOCUMENT': return 'مستند';
      case 'TASK': return 'مهمة';
      default: return entityType;
    }
  };

  function formatDateSafe(timestamp: string): { formattedDate: string; formattedTime: string; isValid: boolean } {
    const date = new Date(timestamp);
    const valid = isValid(date);
    return {
      formattedDate: valid ? format(date, 'dd MMM yyyy') : 'تاريخ غير صالح',
      formattedTime: valid ? format(date, 'HH:mm') : '--:--',
      isValid: valid,
    };
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <img 
              src={SotetelLogo.src} 
              alt="Sotetel Logo" 
              className="w-16 h-16 md:w-20 md:h-20 object-contain bg-white rounded-xl p-2 shadow-sm border border-gray-200" 
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-2">
                سجل الأنشطة
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {data?.activities.length || 0}
                </span>
              </h1>
              <p className="text-gray-600 mt-2 max-w-2xl">
                هنا جميع الأنشطة التي تمت في النظام، يمكنك تتبع التغييرات والإجراءات التي قام بها المستخدمون
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center gap-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <CalendarIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">آخر تحديث</p>
              <p className="font-medium">{format(new Date(), 'dd MMM yyyy')}</p>
            </div>
          </div>
        </div>

        {/* Activity Cards */}
        {!data?.activities.length ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="mx-auto max-w-md">
              <div className="bg-gray-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <InformationCircleIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد أنشطة</h3>
              <p className="text-gray-500">
                لم يتم تسجيل أي أنشطة في النظام بعد. ستظهر هنا أي أنشطة تحدث في النظام.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.activities.map((activity) => {
              const { formattedDate, formattedTime, isValid } = formatDateSafe(activity.timestamp);
              
              return (
                <div 
                  key={activity.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-lg">
                          {getEntityIcon(activity.entityType)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800">
                              {getEntityLabel(activity.entityType)}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                              ID: {activity.entityId.slice(0, 6)}
                            </span>
                          </div>
                          {getActionBadge(activity.actionType)}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4" />
                          <span>{formattedTime}</span>
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                          {formattedDate}
                        </div>
                      </div>
                    </div>
                    
                    {/* User Info */}
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                      <div className="avatar placeholder">
                        <div className={`rounded-full w-10 h-10 flex items-center justify-center ${
                          activity.user ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {activity.user ? (
                            <span className="font-bold">
                              {activity.user.firstName?.[0]}{activity.user.lastName?.[0]}
                            </span>
                          ) : (
                            <UserIcon className="h-5 w-5" />
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">
                          {activity.user ? 
                            `${activity.user.firstName} ${activity.user.lastName}` : 
                            <span className="text-gray-500">مستخدم محذوف</span>
                          }
                        </div>
                        <div className="text-sm text-gray-500">
                          {activity.user?.email || 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Details */}
                    {activity.details && Object.keys(activity.details).length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <InformationCircleIcon className="h-5 w-5 text-gray-500" />
                          التفاصيل
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-3 text-sm">
                          <div className="space-y-2">
                            {Object.entries(activity.details).map(([key, value]) => (
                              <div key={key} className="flex flex-wrap gap-1">
                                <span className="font-medium text-gray-800">{key}:</span>
                                <span className="text-gray-600 break-all">
                                  {typeof value === 'object' 
                                    ? JSON.stringify(value) 
                                    : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}