"use client";

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PROJECTS, GET_USERS } from '@/app/graphql/projectMutation';
import { GET_ALL_TASKS_STATUS } from '@/app/graphql/Taskqueries';
import ProjectAnalyticsTasks from "@/app/components/Dashboard/ProjectAnalyticsTasks";
import StatsCards from "@/app/components/Dashboard/StatsCards";
import { PlusIcon } from "@heroicons/react/24/outline";
import LoadingShow from '@/components/LoadingShow';
import Link from 'next/link';
import WelcomeMedia from "@/assets/images/welcome_media.png";
import Image from 'next/image';

export default function DashboardPage() {
  const [total, setTotal] = useState({ 
    totalProjects: 0, 
    totalUsers: 0, 
    totalTasks: 0, 
    doneTasks: 0, 
    todoTasks: 0, 
    inProgressTasks: 0, 
    inReviewTasks: 0 
  });

  // Get data from the GET_PROJECTS and GET_USERS queries
  const { loading: projectsLoading, error, data: projectsData } = useQuery(GET_PROJECTS);
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS);
  const { data: tasksData, loading: tasksLoading } = useQuery(GET_ALL_TASKS_STATUS);


  // Combine loading states
  const loading = projectsLoading || usersLoading || tasksLoading;

  useEffect(() => {
    if (projectsData && usersData && tasksData) {
      const totalProjects = projectsData.projects.length;
      const totalUsers = usersData.users.length;
  
      // Count tasks by status
      const tasks = tasksData.tasks;
      const statusCounts = tasks.reduce((acc: any, task: any) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {});
  
      setTotal({
        totalProjects,
        totalUsers,
        totalTasks: tasks.length,
        doneTasks: statusCounts['DONE'] || 0,
        todoTasks: statusCounts['TODO'] || 0,
        inProgressTasks: statusCounts['IN_PROGRESS'] || 0,
        inReviewTasks: statusCounts['IN_REVIEW'] || 0,
      });
    }
  }, [projectsData, usersData, tasksData]);
  

  // Handle loading and error states
  if (loading) return <LoadingShow msg="Loading Projects..." />;
  if (error) return <LoadingShow msg={`Error! ${error.message}`} />;

  // Extract projects data from GraphQL response
  const projects = projectsData ? projectsData.projects : [];

  return (
    <div className="p-6 bg-transparent rounded-lg">
      {/* Dashboard Contents */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/Projects/CreateProject">
            <button className="flex items-center justify-around btn bg-gradient-to-br from-blue-950 to-blue-700 text-white">
              <PlusIcon className="w-4 h-4" /> إضافة مشروع
            </button>
          </Link>
          <Link href="/Products">
            <button className="btn bg-transparent text-blue-950 border border-blue-950 duration-150 hover:bg-slate-50">
              استيراد البيانات
            </button>
          </Link>
        </div>
        
        <div className="text-right">
          <h1 className="text-3xl text-blue-950 font-semibold">لوحة القيادة</h1>
          <p className="text-sm text-gray-600">مرحبًا بك في لوحة القيادة الخاصة بك.</p>
        </div>
        
      </div>

      <div>
        <div className="my-8 p-6 rounded-xl bg-gradient-to-br from-blue-100 via-blue-50 to-white shadow-lg border border-blue-200">
          <div className='flex justify-between'>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">حول ‏شركة ميكا هوم للطاقة الشمسية المتجددة‏</h2>
            <Image src={WelcomeMedia} alt="Welcome Media" width={150} height={150}/>
          </div>
          <p className="text-blue-900 mb-4 font-semibold">
            شركة ميكا هوم للتجارة العامة والمواد الكهربائية والانشائية والصحية ولتصفية ومعالجة المياه وأجهزة التدفئة والتبريد ومنظومات RO
          </p>
          <ul className="list-decimal list-inside space-y-2 text-blue-800 font-medium">
            <li>
              صناعة الجلرات الخاصة بمعامل البلاستك والحديد ومعامل المشروبات الغازية ومعامل تعبئة المياه وال PVC
            </li>
            <li>
              صناعة ونصب المخازن المبردة لمكاتب بيع اللحوم والمثلجات
            </li>
            <li>
              صناعة عارضات المواد الغذائية للاسواق والمولات
            </li>
            <li>
              صناعة المبادلات الحرارية
            </li>
            <li>
              صناعة برادات الماء بمختلف احجامها للمدارس والجوامع والمناطق العامة وحسب الطلب ولنا بصمات في تجهيز ونصب اجهزة التبريد المركزي والبكجات للابنية ذات الطوابق المتعددة للمستشفيات واجهزة فريش اير لقاعات العمليات الجراحية
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 ">
          {/* Stats Cards */}
            <StatsCards totalStateCards={total} />
 
         
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
             
              {/* Project Analytics */}
              <ProjectAnalyticsTasks totalStateCards={total} />
              {/* Team Collaboration */}
              
            </div>
      </div>


    </div>
  );
}
