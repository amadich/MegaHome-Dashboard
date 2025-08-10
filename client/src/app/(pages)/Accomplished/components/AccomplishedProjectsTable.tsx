'use client';

import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useState } from 'react';
import UpdateAccomplishedForm from './UpdateAccomplishedForm';
import Swal from "sweetalert2";

const GET_ACCOMPLISHED_PROJECTS_BY_PROJECT_ID = gql`
  query AccomplishedProjectsByProjectId($projectId: ID!) {
    accomplishedProjectsByProjectId(projectId: $projectId) {
      id
      propertyType
      nightAmperage
      dayAmperage
      numberOfSplits
      numberOfFridges
      numberOfFreezers
      numberOfCoolers
      coolerType
      numberOfColdRooms
      propertyArea
      isRoofExposed
      inverterLocation
      numberOfFloors
      numberOfFamilies
      createdAt
    }
  }
`;

const UPDATE_ACCOMPLISHED_PROJECT_MUTATION = gql`
  mutation UpdateAccomplishedProject($id: ID!, $project: UpdateAccomplishedProjectInput!) {
    updateAccomplishedProject(id: $id, project: $project) {
      id
    }
  }
`;

const DELETE_ACCOMPLISHED_PROJECT_MUTATION = gql`
  mutation DeleteAccomplishedProject($id: ID!) {
    deleteAccomplishedProject(id: $id)
  }
`;

interface AccomplishedProject {
  id: string;
  propertyType: string;
  nightAmperage?: number;
  dayAmperage?: number;
  numberOfSplits?: number;
  numberOfFridges?: number;
  numberOfFreezers?: number;
  numberOfCoolers?: number;
  coolerType?: string;
  numberOfColdRooms?: number;
  propertyArea?: number;
  isRoofExposed?: boolean;
  inverterLocation: string;
  numberOfFloors?: number;
  numberOfFamilies?: number;
  createdAt: string;
}

interface AccomplishedProjectsTableProps {
  projectId: string;
}

export default function AccomplishedProjectsTable({ projectId }: AccomplishedProjectsTableProps) {
  const { loading, error, data, refetch } = useQuery(GET_ACCOMPLISHED_PROJECTS_BY_PROJECT_ID, {
    variables: { projectId },
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<AccomplishedProject | null>(null);

  const [updateProject] = useMutation(UPDATE_ACCOMPLISHED_PROJECT_MUTATION);
  const [deleteProject] = useMutation(DELETE_ACCOMPLISHED_PROJECT_MUTATION);

  const formatDate = (dateString: string) => {
    const date = new Date(Number(dateString));
    return isNaN(date.getTime())
      ? 'تاريخ غير صالح'
      : date.toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
  };

  const formatBoolean = (value?: boolean) => {
    return value ? 'نعم' : 'لا';
  };

  const formatPropertyType = (type: string) => {
    switch (type) {
      case 'HOME': return 'منزل';
      case 'COMMERCIAL': return 'تجاري';
      case 'FARM': return 'مزرعة';
      default: return type;
    }
  };

  const handleEditClick = (project: AccomplishedProject) => {
    setSelectedProject(project);
    setEditModalOpen(true);
  };

  const handleUpdate = async (id: string, updatedData: any) => {
    try {
      await updateProject({
        variables: {
          id,
          project: updatedData
        }
      });
      Swal.fire({
        title: 'نجاح',
        text: 'تم تحديث المشروع بنجاح!',
        icon: 'success',
        confirmButtonText: 'موافق'
      });
      refetch();
      setEditModalOpen(false);
    } catch (err: any) {
      Swal.fire({
        title: 'خطأ',
        text: `حدث خطأ أثناء تحديث المشروع: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'موافق'
      });
    }
  };

const handleDelete = async (id: string) => {
  const result = await Swal.fire({
    title: 'هل أنت متأكد؟',
    text: 'سيتم حذف هذا المشروع نهائياً!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'نعم، احذف',
    cancelButtonText: 'إلغاء'
  });

  if (!result.isConfirmed) return;

  try {
    await deleteProject({ variables: { id } });

    Swal.fire({
      title: 'نجاح',
      text: 'تم حذف المشروع بنجاح!',
      icon: 'success',
      confirmButtonText: 'موافق'
    });

    refetch();
  } catch (err: any) {
    Swal.fire({
      title: 'خطأ',
      text: `حدث خطأ أثناء حذف المشروع: ${err.message}`,
      icon: 'error',
      confirmButtonText: 'موافق'
    });
  }
};


  if (loading) return <div className="text-center py-8"><span className="loading loading-spinner loading-lg"></span></div>;

  if (error) return <div className="alert alert-error">حدث خطأ أثناء تحميل المشاريع: {error.message}</div>;

  const projects = data?.accomplishedProjectsByProjectId || [];

  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">لم يتم العثور على تفاصيل المشروع</h3>
        <p className="text-gray-500">قم بإضافة تفاصيل المشروع باستخدام النموذج أعلاه</p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-indigo-800">تفاصيل المشاريع المحفوظة</h2>
        <button 
          onClick={() => refetch()} 
          className="btn btn-sm btn-outline btn-primary"
        >
          تحديث
        </button>
      </div>

      {/* نافذة التعديل */}
      {editModalOpen && selectedProject && (
            <div className="modal modal-open">
                <div className="modal-box max-w-4xl relative">
                <button 
                    onClick={() => setEditModalOpen(false)}
                    className="btn btn-sm btn-circle absolute right-2 top-2"
                >
                    ✕
                </button>
                <UpdateAccomplishedForm 
                    project={selectedProject}
                    onClose={() => setEditModalOpen(false)}
                    onUpdate={refetch}  // سيتم تحديث الجدول بعد التعديل
                />
                </div>
            </div>
        )}

      {/* جدول النظرة العامة */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="table table-zebra">
          <thead className="bg-indigo-50 text-indigo-800">
            <tr>
              <th>النوع</th>
              <th>المساحة (م²)</th>
              <th>عدد الطوابق</th>
              <th>عدد العائلات</th>
              <th>السطح معرض للشمس</th>
              <th>موقع العاكس</th>
              <th>تاريخ الإنشاء</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project: AccomplishedProject) => (
              <tr key={project.id}>
                <td>
                  <div className="font-medium">{formatPropertyType(project.propertyType)}</div>
                  <div className="text-xs opacity-70">
                    {project.coolerType ? `نوع المبرد: ${project.coolerType}` : ''}
                  </div>
                </td>
                <td>{project.propertyArea?.toLocaleString() || 'غير متوفر'}</td>
                <td>{project.numberOfFloors || 'غير متوفر'}</td>
                <td>{project.numberOfFamilies || 'غير متوفر'}</td>
                <td>{formatBoolean(project.isRoofExposed)}</td>
                <td>{project.inverterLocation}</td>
                <td>{formatDate(project.createdAt)}</td>
                <td className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(project)}
                    className="btn btn-sm btn-outline btn-primary"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="btn btn-sm btn-outline btn-error"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* جدول التفاصيل */}
      <div className="mt-8 bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="table">
          <thead className="bg-indigo-50 text-indigo-800">
            <tr>
              <th>الأجهزة</th>
              <th>عدد المكيفات</th>
              <th>عدد الثلاجات</th>
              <th>عدد المجمدات</th>
              <th>عدد المبردات</th>
              <th>عدد غرف التبريد</th>
              <th>الأمبير (ليل/نهار)</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project: AccomplishedProject) => (
              <tr key={project.id}>
                <td></td>
                <td>{project.numberOfSplits || '0'}</td>
                <td>{project.numberOfFridges || '0'}</td>
                <td>{project.numberOfFreezers || '0'}</td>
                <td>{project.numberOfCoolers || '0'}</td>
                <td>{project.numberOfColdRooms || '0'}</td>
                <td>
                  {project.nightAmperage || '0'} / {project.dayAmperage || '0'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}