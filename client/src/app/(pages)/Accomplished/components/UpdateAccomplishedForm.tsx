'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import Swal from "sweetalert2";

const UPDATE_ACCOMPLISHED_PROJECT_MUTATION = gql`
  mutation UpdateAccomplishedProject($id: ID!, $project: UpdateAccomplishedProjectInput!) {
    updateAccomplishedProject(id: $id, project: $project) {
      id
    }
  }
`;

interface DefaultFormValues {
  propertyType: string;
  nightAmperage: number | null;
  dayAmperage: number | null;
  numberOfSplits: number | null;
  numberOfFridges: number | null;
  numberOfFreezers: number | null;
  numberOfCoolers: number | null;
  coolerType: string;
  numberOfColdRooms: number | null;
  propertyArea: number | null;
  isRoofExposed: boolean;
  inverterLocation: string;
  numberOfFloors: number | null;
  numberOfFamilies: number | null;
}

const DEFAULT_VALUES: DefaultFormValues = {
  propertyType: 'HOME',
  nightAmperage: null,
  dayAmperage: null,
  numberOfSplits: null,
  numberOfFridges: null,
  numberOfFreezers: null,
  numberOfCoolers: null,
  coolerType: 'IRANI',
  numberOfColdRooms: null,
  propertyArea: null,
  isRoofExposed: false,
  inverterLocation: 'INSIDE',
  numberOfFloors: null,
  numberOfFamilies: null,
};

interface UpdateAccomplishedFormProps {
  project: any;
  onClose: () => void;
  onUpdate: () => void;
}

export default function UpdateAccomplishedForm({ 
  project, 
  onClose,
  onUpdate
}: UpdateAccomplishedFormProps) {
  const [formData, setFormData] = useState<DefaultFormValues>(DEFAULT_VALUES);
  const [isLoading, setIsLoading] = useState(true);

  const [updateProject, { loading }] = useMutation(
    UPDATE_ACCOMPLISHED_PROJECT_MUTATION,
    {
      onCompleted: () => {
        Swal.fire({
          title: 'تم بنجاح',
          text: 'تم تحديث المشروع بنجاح!',
          icon: 'success',
          confirmButtonText: 'موافق'
        });
        onUpdate();
        onClose();
      },
      onError: (error) => {
        Swal.fire({
          title: 'خطأ',
          text: `حدث خطأ أثناء تحديث المشروع: ${error.message}`,
          icon: 'error',
          confirmButtonText: 'موافق'
        });
      },
    }
  );

  useEffect(() => {
    if (project) {
      setFormData({
        propertyType: project.propertyType || 'HOME',
        nightAmperage: project.nightAmperage ?? null,
        dayAmperage: project.dayAmperage ?? null,
        numberOfSplits: project.numberOfSplits ?? null,
        numberOfFridges: project.numberOfFridges ?? null,
        numberOfFreezers: project.numberOfFreezers ?? null,
        numberOfCoolers: project.numberOfCoolers ?? null,
        coolerType: project.coolerType || 'IRANI',
        numberOfColdRooms: project.numberOfColdRooms ?? null,
        propertyArea: project.propertyArea ?? null,
        isRoofExposed: project.isRoofExposed || false,
        inverterLocation: project.inverterLocation || 'INSIDE',
        numberOfFloors: project.numberOfFloors ?? null,
        numberOfFamilies: project.numberOfFamilies ?? null,
      });
      setIsLoading(false);
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? value === '' ? null : parseFloat(value)
          : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key, 
        value === null ? 0 : value
      ])
    );

    updateProject({
      variables: {
        id: project.id,
        project: submitData
      }
    });
  };

  if (isLoading) {
    return (
      <div className="modal-box max-w-4xl flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="modal-box max-w-4xl">
      <h3 className="font-bold text-xl text-indigo-800 mb-4">تعديل تفاصيل المشروع</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto p-2">
        {/* نوع العقار */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-gray-700">نوع العقار</span>
          </label>
          <select 
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            className="select select-bordered w-full bg-gray-50"
          >
            <option value="HOME">منزل</option>
            <option value="COMMERCIAL">تجاري</option>
            <option value="FARM">مزرعة</option>
          </select>
        </div>

        {/* قسم الأمبير */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-gray-700">أمبير الليل</span>
          </label>
          <input
            type="number"
            name="nightAmperage"
            value={formData.nightAmperage ?? ''}
            onChange={handleChange}
            className="input input-bordered w-full bg-gray-50"
            min="0"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-gray-700">أمبير النهار</span>
          </label>
          <input
            type="number"
            name="dayAmperage"
            value={formData.dayAmperage ?? ''}
            onChange={handleChange}
            className="input input-bordered w-full bg-gray-50"
            min="0"
          />
        </div>

        {/* عدد الأجهزة */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-gray-700">عدد المكيفات</span>
          </label>
          <input
            type="number"
            name="numberOfSplits"
            value={formData.numberOfSplits ?? ''}
            onChange={handleChange}
            className="input input-bordered w-full bg-gray-50"
            min="0"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-gray-700">عدد الثلاجات</span>
          </label>
          <input
            type="number"
            name="numberOfFridges"
            value={formData.numberOfFridges ?? ''}
            onChange={handleChange}
            className="input input-bordered w-full bg-gray-50"
            min="0"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-gray-700">عدد المجمدات</span>
          </label>
          <input
            type="number"
            name="numberOfFreezers"
            value={formData.numberOfFreezers ?? ''}
            onChange={handleChange}
            className="input input-bordered w-full bg-gray-50"
            min="0"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-gray-700">عدد المبردات</span>
          </label>
          <input
            type="number"
            name="numberOfCoolers"
            value={formData.numberOfCoolers ?? ''}
            onChange={handleChange}
            className="input input-bordered w-full bg-gray-50"
            min="0"
          />
        </div>

        {/* نوع المبرد */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-gray-700">نوع المبرد</span>
          </label>
          <select 
            name="coolerType"
            value={formData.coolerType}
            onChange={handleChange}
            className="select select-bordered w-full bg-gray-50"
          >
            <option value="IRANI">إيراني</option>
            <option value="CENTRAL">مركزي</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-gray-700">عدد غرف التبريد</span>
          </label>
          <input
            type="number"
            name="numberOfColdRooms"
            value={formData.numberOfColdRooms ?? ''}
            onChange={handleChange}
            className="input input-bordered w-full bg-gray-50"
            min="0"
          />
        </div>

        {/* تفاصيل العقار */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-gray-700">مساحة العقار (م²)</span>
          </label>
          <input
            type="number"
            name="propertyArea"
            value={formData.propertyArea ?? ''}
            onChange={handleChange}
            className="input input-bordered w-full bg-gray-50"
            min="0"
            step="0.1"
          />
        </div>

        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-4">
            <span className="label-text font-semibold text-gray-700">هل السطح معرض للشمس؟</span>
            <input
              type="checkbox"
              name="isRoofExposed"
              checked={formData.isRoofExposed}
              onChange={handleChange}
              className="toggle toggle-primary"
            />
          </label>
        </div>

        {/* موقع العاكس */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-gray-700">موقع العاكس</span>
          </label>
          <select 
            name="inverterLocation"
            value={formData.inverterLocation}
            onChange={handleChange}
            className="select select-bordered w-full bg-gray-50"
          >
            <option value="INSIDE">داخل</option>
            <option value="OUTSIDE">خارج</option>
          </select>
        </div>

        {/* تفاصيل المبنى */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-gray-700">عدد الطوابق</span>
          </label>
          <input
            type="number"
            name="numberOfFloors"
            value={formData.numberOfFloors ?? ''}
            onChange={handleChange}
            className="input input-bordered w-full bg-gray-50"
            min="0"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-gray-700">عدد العائلات</span>
          </label>
          <input
            type="number"
            name="numberOfFamilies"
            value={formData.numberOfFamilies ?? ''}
            onChange={handleChange}
            className="input input-bordered w-full bg-gray-50"
            min="0"
          />
        </div>

        {/* زر الإرسال */}
        <div className="md:col-span-2 mt-4 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="btn btn-outline btn-error"
          >
            إلغاء
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
          >
            {loading ? 'جارٍ التحديث...' : 'تحديث المشروع'}
          </button>
        </div>
      </form>
    </div>
  );
}