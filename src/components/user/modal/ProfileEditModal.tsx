import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import CloudinaryUpload from '../../global/CloudinaryUpload';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { toast } from 'react-toastify'; 
import { changeAboutInformation } from '../../../redux/action/userActions';

interface FormData {
    name?: string;
    about?: string;
    address?: string;
    profileImage?: string | null;
}

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user.user);
    const [formData, setFormData] = useState<FormData>({
        name: user?.username,
        about: user?.about || undefined,   
        address: user?.address || undefined,
        profileImage: user?.pro_img,
    });
    const email = useSelector((state: RootState) => state.user.user?.email);

    const uploadRef = useRef<any>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name || formData.name.trim().length === 0) {
            newErrors.name = 'Username cannot be empty.';
        }

        if (formData.address && formData.address.trim().length < 10) {
            newErrors.address = 'Address must be at least 10 characters.';
        }

        if (formData.about) {
            if (formData.about.length < 50) {
                newErrors.about = 'About must be at least 50 characters.';
            }
            if (formData.about.length > 250) {
                newErrors.about = 'About must not exceed 250 characters.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; 
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm() && email) {
            try {
                const userProfileUpdateRequest = {
                email: email,
                username: formData.name!, 
                about: formData.about || null,    
                address: formData.address || null,
                profile_img: formData.profileImage || null,
                };
                
                await dispatch(changeAboutInformation(userProfileUpdateRequest)).unwrap();

                toast.success('Profile updated successfully!');
                onClose(); 
            } catch (error) {
                toast.error('Failed to update profile. Please try again.');
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-[5px] w-96">
                <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter username"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-[5px] border-blue-900 border shadow-sm"
                        />
                        {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">About</label>
                        <textarea
                            name="about"
                            placeholder="About you...."
                            value={formData.about}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-[5px] border-blue-900 border shadow-sm"
                            rows={3}
                        />
                        {errors.about && <span className="text-red-500 text-sm">{errors.about}</span>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            name="address"
                            placeholder="Place, City, Country, Pin"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-[5px] border-blue-900 border shadow-sm"
                        />
                        {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                        <div className='w-1/2 mx-auto'>
                            <CloudinaryUpload
                                ref={uploadRef}
                                fixedSize={{ width: 1, height: 1 }}
                                onUploadSuccess={(url: string) => setFormData(prevData => ({ ...prevData, profileImage: url }))}
                                uploadMessage={formData.profileImage ? "Edit profile image" : "Upload profile image"}
                                uploadedImageUrl={user?.pro_img || undefined}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-400 bg-gray-50 rounded-[5px] text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-[5px] shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-950"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEditModal;
