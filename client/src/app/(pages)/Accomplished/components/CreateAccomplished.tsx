'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import Swal from "sweetalert2";

const CREATE_ACCOMPLISHED_PROJECT_MUTATION = gql`
  mutation CreateAccomplishedProject($project: AccomplishedProjectInput!) {
    createAccomplishedProject(project: $project) {
      id
    }
  }
`;

interface CreateAccomplishedProps {
  projectId: string;
  onClose: () => void;
}

export default function CreateAccomplished({ projectId, onClose }: CreateAccomplishedProps) {
  const [formData, setFormData] = useState({
    propertyType: 'HOME',
    nightAmperage: 0,
    dayAmperage: 0,
    numberOfSplits: 0,
    numberOfFridges: 0,
    numberOfFreezers: 0,
    numberOfCoolers: 0,
    coolerType: 'IRANI',
    numberOfColdRooms: 0,
    propertyArea: 0,
    isRoofExposed: false,
    inverterLocation: 'INSIDE',
    numberOfFloors: 0,
    numberOfFamilies: 0,
  });

  const [createProject, { loading }] = useMutation(
    CREATE_ACCOMPLISHED_PROJECT_MUTATION,
    {
      onCompleted: () => {
        Swal.fire({
          title: 'نجاح',
          text: 'تم حفظ تفاصيل المشروع بنجاح!',
          icon: 'success',
          confirmButtonText: 'موافق'
        });
        // Reset form and close modal
        setFormData({
          propertyType: 'HOME',
          nightAmperage: 0,
          dayAmperage: 0,
          numberOfSplits: 0,
          numberOfFridges: 0,
          numberOfFreezers: 0,
          numberOfCoolers: 0,
          coolerType: 'IRANI',
          numberOfColdRooms: 0,
          propertyArea: 0,
          isRoofExposed: false,
          inverterLocation: 'INSIDE',
          numberOfFloors: 0,
          numberOfFamilies: 0,
        });
        onClose();
        location.reload(); // Refresh the page to show the new project
      },
      onError: (error) => {
        Swal.fire({
          title: 'خطأ',
          text: `حدث خطأ أثناء حفظ المشروع: ${error.message}`,
          icon: 'error',
          confirmButtonText: 'موافق'
        });
      },
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number' 
          ? parseFloat(value) || 0 
          : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProject({
      variables: {
        project: {
          ...formData,
          projectId
        }
      }
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto p-2">
        {/* Property Type */}
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

        {/* Amperage Section */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-gray-700">أمبير الليل</span>
          </label>
          <input
            type="number"
            name="nightAmperage"
            value={formData.nightAmperage}
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
            value={formData.dayAmperage}
            onChange={handleChange}
            className="input input-bordered w-full bg-gray-50"
            min="0"
          />
        </div>

        {/* Appliances Count */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-gray-700">عدد المكيفات</span>
          </label>
          <input
            type="number"
            name="numberOfSplits"
            value={formData.numberOfSplits}
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
            value={formData.numberOfFridges}
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
            value={formData.numberOfFreezers}
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
            value={formData.numberOfCoolers}
            onChange={handleChange}
            className="input input-bordered w-full bg-gray-50"
            min="0"
          />
        </div>

        {/* Cooler Type */}
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
            value={formData.numberOfColdRooms}
            onChange={handleChange}
            className="input input-bordered w-full bg-gray-50"
            min="0"
          />
        </div>

        {/* Property Details */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-gray-700">مساحة العقار (م²)</span>
          </label>
          <input
            type="number"
            name="propertyArea"
            value={formData.propertyArea}
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

        {/* Inverter Location */}
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

        {/* Building Details */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-gray-700">عدد الطوابق</span>
          </label>
          <input
            type="number"
            name="numberOfFloors"
            value={formData.numberOfFloors}
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
            value={formData.numberOfFamilies}
            onChange={handleChange}
            className="input input-bordered w-full bg-gray-50"
            min="0"
          />
        </div>

        {/* Form Actions */}
        <div className="md:col-span-2 mt-4 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="btn btn-ghost"
            disabled={loading}
          >
            إلغاء
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
          >
            {loading ? 'جارٍ الحفظ...' : 'حفظ'}
          </button>
        </div>
      </form>
    </div>
  );
}