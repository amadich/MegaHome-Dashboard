"use client";
import LoadingShow from '@/components/LoadingShow';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

// Define the type for props to be received by the ProjectAnalytics component
interface ProjectAnalyticsProps {
  totalStateCards: {
    totalProjects: number;
    totalUsers: number;
    totalTasks: number;
    doneTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    inReviewTasks: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ProjectAnalytics = ({ totalStateCards }: ProjectAnalyticsProps) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ name: string; Tasks: number }[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setData([
        { name: 'المهام القادمة', Tasks: totalStateCards.todoTasks },
        { name: 'قيد التنفيذ', Tasks: totalStateCards.inProgressTasks },
        { name: 'قيد المراجعة', Tasks: totalStateCards.inReviewTasks },
        { name: 'منجز', Tasks: totalStateCards.doneTasks },
      ]);
      setLoading(false);
    }, 2000);
  }, [totalStateCards]);

  return (
    <>
      {loading ? (
        <div className="w-full m-auto table">
          <LoadingShow msg="جاري تحميل تحليلات المشاريع..." />
        </div>
      ) : (
        <div className="mt-10 w-full flex justify-center items-center gap-10">
          <div className="w-96">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Tasks" fill="#1e40af" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="w-96">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="Tasks"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectAnalytics;
