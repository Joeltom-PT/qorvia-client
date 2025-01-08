import React, { useState } from 'react';
import { Calendar, Globe, Building, Tag, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import { toast } from 'react-toastify'; 
import { IEventCategoryReqeust } from '../../../interfaces/organizer';
import { eventCategoryReqeust } from '../../../redux/action/organizerActions';
import { MoonLoader } from 'react-spinners';

const EventCreationModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryDescription, setCategoryDescription] = useState<string>('');
  const [isCategoryRequestVisible, setIsCategoryRequestVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const [loading, setLoading] = useState<boolean>(false); 
  const dispatch = useDispatch<AppDispatch>();

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setCategoryName('');
    setCategoryDescription('');
    setIsCategoryRequestVisible(false);
    setErrors({});
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    if (target.classList.contains('overlay')) {
      closeModal();
    }
  };

  const validateForm = () => {
    const newErrors: { name?: string; description?: string } = {};
    if (categoryName.length < 4) {
      newErrors.name = 'Category name must be at least 4 characters long.';
    }
    const wordCount = categoryDescription.trim().split(/\s+/).length; 
    if (wordCount < 15) {
      newErrors.description = 'Category description must be at least 15 words.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return; 

    const requestData: IEventCategoryReqeust = {
      name: categoryName,
      description: categoryDescription,
    };

    try {
      setLoading(true); 
      const response = await dispatch(eventCategoryReqeust(requestData)).unwrap();
      console.log('Category Created:', response);
      toast.success('Category request submitted successfully!'); 
    } catch (error) {
      console.error('Failed to create category:', error);
      toast.error(error as string || 'Category creation failed. Try again.'); 
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const toggleCategoryRequest = () => {
    setIsCategoryRequestVisible(true); 
  };

  return (
    <div className="font-san">
      <button
        onClick={openModal}
        className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-950 transition-colors flex items-center space-x-2"
      >
        <Calendar size={18} />
        <span>Create Event and More</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-75 flex items-center justify-center overlay"
          onClick={handleOverlayClick}
        >
          <div className="bg-slate-100 rounded-xl shadow-xl p-8 w-96 border border-blue-900 transition-transform transform duration-300 ease-in-out">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">
                {isCategoryRequestVisible ? 'Category Request' : 'Create Event'}
              </h2>
              <button onClick={closeModal} className="text-blue-900 hover:text-blue-950">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              {!isCategoryRequestVisible && (
                <>
                  <Link
                    to="/organizer/online-event"
                    className="w-full bg-blue-900 text-white px-5 py-3 rounded-xl hover:bg-blue-950 transition-colors flex items-center justify-center space-x-2 shadow-md"
                    onClick={closeModal}
                  >
                    <Globe size={20} />
                    <span className="font-medium">Create Online Event</span>
                  </Link>
                  <Link
                    to="/organizer/offline-event"
                    className="w-full bg-blue-900 text-white px-5 py-3 rounded-xl hover:bg-blue-950 transition-colors flex items-center justify-center space-x-2 shadow-md"
                    onClick={closeModal}
                  >
                    <Building size={20} />
                    <span className="font-medium">Create Offline Event</span>
                  </Link>
                  <button
                    onClick={toggleCategoryRequest}
                    className="w-full bg-blue-900 text-white px-5 py-3 rounded-xl hover:bg-blue-950 transition-colors flex items-center justify-center space-x-2 shadow-md"
                  >
                    <Tag size={20} />
                    <span className="font-medium">Event Category Request</span>
                  </button>
                </>
              )}

              {isCategoryRequestVisible && (
                <div className="mt-4 transition-opacity duration-300 ease-in-out opacity-100">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
                        Category Name
                      </label>
                      <input
                        type="text"
                        id="categoryName"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className={`mt-1 block w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-blue-900'}`}
                      />
                      {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700">
                        Category Description
                      </label>
                      <textarea 
                        id="categoryDescription"
                        value={categoryDescription}
                        onChange={(e) => setCategoryDescription(e.target.value)}
                        className={`mt-1 block w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-blue-900'}`}
                        rows={3}
                      />
                      {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-900 text-white px-5 py-2 rounded-xl hover:bg-blue-950 transition-colors"
                      disabled={loading} 
                    >
                      {loading ? (
                        <div className="flex justify-center">
                          <MoonLoader size={20} color="#ffffff" /> 
                        </div>
                      ) : (
                        'Submit Category Request'
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCreationModal;
