import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import 'react-quill/dist/quill.snow.css';
import CloudinaryUpload from '../../../global/CloudinaryUpload';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../redux/store';
import { createOnlineEventDetail, editOnlineEventDetail, getAllActiveEventCategories, getOnlineEventDetail } from '../../../../redux/action/organizerActions';
import { OnlineEventContext } from '../../../../context/OnlineEventContext';
import { toast } from 'react-toastify';
import { MoonLoader } from 'react-spinners';

interface EventType {
  id: string;
  name: string;
  image: string;
}

interface Category {
  id: string;
  name: string;
}

interface EventFormData {
  name: string;
  category: SelectOption | null;
  type: string; 
  description: string;
  imageUrl: string | null; 
}

interface SelectOption {
  value: string;
  label: string;
}

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const dispatch = useDispatch<AppDispatch>();
  const onlineEventContext = useContext(OnlineEventContext); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    category: null,
    type: '', 
    description: '',
    imageUrl: null
  });

  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);

  const eventTypes: EventType[] = [
    { id: 'CONFERENCE', name: 'CONFERENCE', image: '/organizer/event/type/online_classes_s.jpg' },
    { id: 'WORKSHOP', name: 'WORKSHOP', image: '/organizer/event/type/standard_webinar_s.jpg' },
    { id: 'WEBINAR', name: 'WEBINAR', image: '/organizer/event/type/talk_show_s.jpg' },
    { id: 'MEETUP', name: 'MEETUP', image: '/organizer/event/type/training_and_workshop_s.jpg' }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resultAction = await dispatch(getAllActiveEventCategories()).unwrap();
        const options = resultAction.map((category: Category) => ({
          value: category.id,
          label: category.name
        }));
        setCategoryOptions(options);
      } catch (error) {
        toast.error("Failed to fetch categories. Please try again or refresh the page");
        setCategoryOptions([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      const fetchEventData = async () => {
        try {
          setLoading(true);
          const response = await dispatch(getOnlineEventDetail(id)).unwrap();
          setFormData({
            name: response.name,
            category: categoryOptions.find(option => option.value === response.categoryId) || null,
            type: response.eventType,
            description: response.description,
            imageUrl: response.imageUrl || null 
          });
          setLoading(false);
        } catch (error) {
          toast.error("Failed to fetch event information. Please try again.");
          console.error('Error fetching event data:', error);
        }
      };

      fetchEventData();
    }
  }, [id, categoryOptions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (selectedOption: SelectOption | null) => {
    setFormData(prev => ({ ...prev, category: selectedOption }));
  };

  const handleTypeSelect = (typeId: string) => {
    setFormData(prev => ({ ...prev, type: typeId }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData(prev => ({ ...prev, description: value }));
  };

  const handleImageUploadSuccess = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.name.length < 2) {
      toast.error("Event name must be at least 2 characters long.");
      return;
    }
    
    if (!formData.description || formData.description.length < 100) {
      toast.error("Please provide a more detailed description.");
      return;
    }

    if (!formData.imageUrl) {
      toast.error("Please upload an event image.");
      return;
    }

    if (!formData.type) {
      toast.error("Please select an event type.");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category.");
      return;
    }

    const submitData = {
      id: id || undefined, 
      name: formData.name,
      categoryId: formData.category?.value || '',
      typeName: eventTypes.find(type => type.id === formData.type)?.name || '',
      description: formData.description,
      imageUrl: formData.imageUrl,
    };
  
    try {
       let response = null;
      if (id){
         response = await dispatch(editOnlineEventDetail(submitData)).unwrap();
      } else {
         response = await dispatch(createOnlineEventDetail(submitData)).unwrap();
      }
      
      console.log('Form submitted:', response);

      onlineEventContext?.onlineEventDispatch({
        type: 'SET_FORM_SUBMITTED_ID',
        payload: response
      });

      onlineEventContext?.onlineEventDispatch({
        type: 'SET_FORM_LEVEL',
        payload: 1
      });

      navigate(`/organizer/online-event/time-slots/${response}`);

    } catch (error) {
      console.error('Error submitting form:', error); 
    }
  };
  
  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderColor: state.isFocused ? '#3B82F6' : '#D1D5DB',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
      '&:hover': {
        borderColor: '#3B82F6'
      }
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? '#3B82F6' 
        : state.isFocused 
          ? '#EFF6FF'
          : 'transparent',
      color: state.isSelected ? 'white' : '#374151',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#2563EB'
      }
    }),
    input: (base: any) => ({
      ...base,
      color: '#374151'
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: '0.375rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    })
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <MoonLoader color="#1E3A8A" loading={true} size={50} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Category
          </label>
          <Select
            value={formData.category}
            onChange={handleCategoryChange}
            options={categoryOptions}
            styles={selectStyles}
            placeholder="Search categories..."
            isClearable
            isSearchable
            className="text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Type
          </label>
          <div className="grid grid-cols-4 gap-4">
            {eventTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className={`cursor-pointer border rounded-lg p-4 text-center transition duration-200 
                  ${formData.type === type.id ? 'border-blue-500 bg-blue-100' : 'border-gray-300'}`}
              >
                <img
                  src={type.image}
                  alt={type.name}
                  className="w-full h-24 object-cover mb-2 rounded-lg"
                />
                <p className="text-center text-sm font-medium">{type.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <ReactQuill
            value={formData.description}
            onChange={handleDescriptionChange}
            placeholder="Enter event description"
            theme="snow"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Event Image
          </label>
          <CloudinaryUpload
            fixedSize={{ width: 16, height: 9 }}
            onUploadSuccess={handleImageUploadSuccess}
            uploadMessage="Click to Upload Image"
            uploadedImageUrl={formData.imageUrl ? formData.imageUrl : undefined}
          /> 
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Save & Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventDetails;


