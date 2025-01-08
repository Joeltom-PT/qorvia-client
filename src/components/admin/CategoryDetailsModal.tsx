import React, { useState } from 'react';
import { IEventCategory } from '../../interfaces/admin';

interface CategoryDetailsModalProps {
  category: IEventCategory | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryId: string, status: string) => void;
}

const CategoryDetailsModal: React.FC<CategoryDetailsModalProps> = ({
  category,
  isOpen,
  onClose,
  onSave,
}) => {
  const [status, setStatus] = useState(category?.status || '');

  if (!isOpen || !category) return null;

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
};


  const handleSave = () => {
    console.log('Saving status:', status); // Add this line
    onSave(category.id, status);
};

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-2">{category.name}</h2>
        <p className="mb-4">{category.description}</p>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
          className="w-full border border-blue-900 rounded-md p-2"
         value={status ? status : category.status}
         onChange={handleStatusChange}>
           <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="PENDING">PENDING</option>
          <option value="REJECTED">REJECTED</option>
          </select>


        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-2 bg-blue-900 text-white rounded-md ${
              status !== category.status ? 'opacity-100' : 'opacity-50'
            }`}
            disabled={status === category.status}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailsModal;
