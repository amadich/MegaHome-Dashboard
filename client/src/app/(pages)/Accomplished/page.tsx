'use client';

import CreateAccomplished from './components/CreateAccomplished';
import AccomplishedProjectsTable from './components/AccomplishedProjectsTable';
import { useState } from 'react';
import { TrophyIcon } from '@heroicons/react/24/outline';
import { useRouter } from "next/navigation";

interface ProjectProps {
  params: {
    projectId: string;
  };
}

export default function AccomplishedPage({ params }: ProjectProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const Router = useRouter();

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-2">
            
          </h1>
          <p className="text-gray-600">
            
          </p>
        </header>
        
        {/* Add Button to Open Modal */}
        <div className="mb-6 flex justify-end space-x-2">
          <button className=" flex items-center bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 text-xs space-x-2" onClick={() => {Router.push(`/Projects`)}}> <TrophyIcon className=" w-4 h-4 " /> <span>المشاريع</span></button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn bg-transparent border-indigo-600 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-700 hover:text-indigo-700 btn-sm"
          >
            + إضافة مشروع مكتمل
          </button>
        </div>

        {/* Modal */}
        <dialog open={isModalOpen} className="modal modal-bottom sm:modal-middle">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-lg mb-4">إضافة مشروع مكتمل</h3>
            <CreateAccomplished 
              projectId={params.projectId} 
              onClose={() => setIsModalOpen(false)} 
            />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setIsModalOpen(false)}>إغلاق</button>
          </form>
        </dialog>

        <AccomplishedProjectsTable projectId={params.projectId} />
      </div>
    </div>
  );
}