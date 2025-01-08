import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import Select from "react-select";
import "react-quill/dist/quill.snow.css";
import CloudinaryUpload from "../../../global/CloudinaryUpload";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import {
  createOfflineEventDetail,
  editOfflineEventDetail,
  getAllActiveEventCategories,
  getOfflineEventDetail,
} from "../../../../redux/action/organizerActions";
import { OnlineEventContext } from "../../../../context/OnlineEventContext";
import { toast } from "react-toastify";
import { MoonLoader } from "react-spinners";
import LocationSelector from "./LocationSelector";

interface Category {
  id: string;
  name: string;
}

interface EventFormData {
  name: string;
  category: SelectOption | null;
  description: string;
  imageUrl: string | null;
  lat: number | null;
  lng: number | null;
  address: string;
}

interface SelectOption {
  value: string;
  label: string;
}

const OfflineEventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const onlineEventContext = useContext(OnlineEventContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    category: null,
    description: "",
    imageUrl: null,
    lat: null,
    lng: null,
    address: "",
  });

  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resultAction = await dispatch(
          getAllActiveEventCategories()
        ).unwrap();
        const options = resultAction.map((category: Category) => ({
          value: category.id,
          label: category.name,
        }));
        setCategoryOptions(options);
      } catch (error) {
        toast.error(
          "Failed to fetch categories. Please try again or refresh the page"
        );
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
          const response = await dispatch(getOfflineEventDetail(id)).unwrap();
          setFormData({
            name: response.name,
            category:
              categoryOptions.find(
                (option) => option.value === response.categoryId
              ) || null,
            description: response.description,
            imageUrl: response.imageUrl || null,
            lat: response.lat || null,
            lng: response.lng || null,
            address: response.address || "",
          });
          setLoading(false);
        } catch (error) {
          toast.error("Failed to fetch event information. Please try again.");
          console.error("Error fetching event data:", error);
        }
      };

      fetchEventData();
    }
  }, [id, categoryOptions]);

  const handleLocationSelect = (
    latLng: { lat: number; lng: number },
    selectedAddress: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      lat: latLng.lat,
      lng: latLng.lng,
      address: selectedAddress,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (selectedOption: SelectOption | null) => {
    setFormData((prev) => ({ ...prev, category: selectedOption }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleImageUploadSuccess = (url: string) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    if (!formData.category) {
      toast.error("Please select a category.");
      return;
    }

    if (!formData.lat || !formData.lng) {
      toast.error("Please select a location.");
      return;
    }

    const submitData = {
      id: id || undefined,
      name: formData.name,
      categoryId: formData.category?.value || "",
      description: formData.description,
      imageUrl: formData.imageUrl,
      lat: formData.lat,
      lng: formData.lng,
      address: formData.address,
    };

    try {
      let response = null;
      if (id) {
        response = await dispatch(editOfflineEventDetail(submitData)).unwrap();
      } else {
        response = await dispatch(
          createOfflineEventDetail(submitData)
        ).unwrap();
      }

      console.log("Form submitted:", response);

      onlineEventContext?.onlineEventDispatch({
        type: "SET_FORM_SUBMITTED_ID",
        payload: response,
      });

      onlineEventContext?.onlineEventDispatch({
        type: "SET_FORM_LEVEL",
        payload: 1,
      });

      navigate(`/organizer/offline-event/location-time/${response}`);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderColor: state.isFocused ? "#3B82F6" : "#D1D5DB",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
      "&:hover": {
        borderColor: "#3B82F6",
      },
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#3B82F6"
        : state.isFocused
        ? "#EFF6FF"
        : "transparent",
      color: state.isSelected ? "white" : "#374151",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#2563EB",
      },
    }),
    input: (base: any) => ({
      ...base,
      color: "#374151",
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: "0.375rem",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    }),
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            minLength={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <Select
            value={formData.category}
            onChange={handleCategoryChange}
            options={categoryOptions}
            styles={selectStyles}
            placeholder="Select Category"
            isClearable
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <ReactQuill
            value={formData.description}
            onChange={handleDescriptionChange}
            theme="snow"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Image
          </label>
          <CloudinaryUpload
            fixedSize={{ width: 16, height: 9 }}
            onUploadSuccess={(url) =>
              setFormData((prev) => ({ ...prev, imageUrl: url }))
            }
            uploadMessage="Click to Upload Image"
            uploadedImageUrl={formData.imageUrl ? formData.imageUrl : undefined}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <LocationSelector onLocationSelect={handleLocationSelect} />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            placeholder="Custom Address"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default OfflineEventDetails;
