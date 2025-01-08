import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { toast } from "react-toastify";
import CloudinaryUpload from "../../../components/global/CloudinaryUpload";
import { getOrganizerProfile, updateOrganizerProfile } from "../../../redux/action/organizerActions";
import { IOrganizerProfileView } from "../../../interfaces/organizer";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const INITIAL_FORM_DATA: IOrganizerProfileView = {
  organizationName: "",
  phone: BigInt(0),
  website: "",
  address: "",
  address2: "",
  city: "",
  country: "",
  state: "",
  facebook: "",
  instagram: "",
  twitter: "",
  linkedin: "",
  youtube: "",
  profileImage: "",
  about: "",
};

const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validateSocialMedia = (url: string, platform: string): string | null => {
  if (!url) return null;
  if (!validateUrl(url)) return "Invalid URL format";
  if (!url.toLowerCase().includes(platform.toLowerCase()))
    return `Invalid ${platform} URL`;
  return null;
};

const OrganizerProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [profile, setProfile] = useState<IOrganizerProfileView | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const organizerInfo = useSelector((state : RootState) => state.organizer.profile);
  const uploadRef = useRef<any>(null);

  useEffect(() => {
    const fetchOrganizerProfile = async () => {
      try {
        const response = await dispatch(getOrganizerProfile()).unwrap();
        setProfile(response);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to fetch profile");
      }
    };

    fetchOrganizerProfile();
  }, [dispatch]);

  const validationSchema = Yup.object().shape({
    organizationName: Yup.string().required("Organization name is required"),
    phone: Yup.number()
      .required("Phone number is required")
      .test(
        "len",
        "Phone number must be 10 digits",
        (val) => val.toString().length == 10
      ),
    website: Yup.string().url("Invalid website URL"),
    address: Yup.string().required("Address is required"),
    address2: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State/Region is required"),
    about: Yup.string().min(50, "About section must be at least 50 characters"),
    facebook: Yup.string().test(
      "facebook",
      "Invalid Facebook URL",
      (value) => !value || validateSocialMedia(value, "facebook") === null
    ),
    instagram: Yup.string().test(
      "instagram",
      "Invalid Instagram URL",
      (value) => !value || validateSocialMedia(value, "instagram") === null
    ),
    twitter: Yup.string().test(
      "twitter",
      "Invalid Twitter URL",
      (value) => !value || validateSocialMedia(value, "twitter") === null
    ),
    linkedin: Yup.string().test(
      "linkedin",
      "Invalid LinkedIn URL",
      (value) => !value || validateSocialMedia(value, "linkedin") === null
    ),
    youtube: Yup.string().test(
      "youtube",
      "Invalid YouTube URL",
      (value) => !value || validateSocialMedia(value, "youtube") === null
    ),
  });

  const handleSubmit = async (values: IOrganizerProfileView) => {
    try {
      const profileImageUrl = uploadRef.current?.getCroppedImage();
      const updatedFormData: IOrganizerProfileView = {
        ...values,
        profileImage: profileImageUrl || values.profileImage || "",
      };
  
      await dispatch(updateOrganizerProfile(updatedFormData)).unwrap();
  
      setProfile(updatedFormData);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };
  
  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 flex justify-center p-6">
            {isEditing ? (
              <CloudinaryUpload
              ref={uploadRef}
              fixedSize={{ width: 16, height: 9 }}
              onUploadSuccess={(url: string) => setProfileImg(url)}
              uploadMessage="Upload Profile Image"
              uploadedImageUrl={profileImg ? profileImg : profile.profileImage}
            />
            
            ) : (
              <div className="mt-4">
              <img
                src={profileImg ? profileImg : profile.profileImage || "/default-profile.jpg"}
                alt="Profile"
                className="w-full h-40 rounded-[5px] object-cover"
              />
            </div>
            
            )}
          </div>

          <div className="md:w-2/3 p-6">
            <Formik
              initialValues={profile}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, errors, handleChange, setFieldValue }) => (
                <Form>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                      {isEditing ? (
                        <Field
                          type="text"
                          name="organizationName"
                          className="w-full border p-2 rounded"
                          placeholder="Organization Name"
                        />
                      ) : (
                        profile.organizationName
                      )}
                    </h1>
                    <button disabled={isEditing}
                      type="button"
                      onClick={() => setIsEditing(!isEditing)}
                      className={`px-4 py-2 transition ${isEditing ? 'bg-gray-400 text-white rounded' : 'bg-blue-900 text-white rounded hover:bg-blue-950'}`}
                    >
                      {isEditing ? "Save" : "Edit"}
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex flex-col mb-4">
                      <label className="font-medium text-gray-700 mb-1">
                        Organization Name
                      </label>
                      <Field
                        type="text"
                        name="organizationName"
                        className={`w-full border p-2 rounded ${
                          errors.organizationName ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter organization name"
                        disabled={!isEditing}
                      />
                      <ErrorMessage
                        name="organizationName"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="flex flex-col mb-4">
                      <label className="font-medium text-gray-700 mb-1">
                        Email : 
                      </label>
                      <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={organizerInfo?.email}
                        disabled
                      />
                      {isEditing && 
                       <p className="text-blue-900 text-sm font-bold ml-1">
                        Email is not able to edit
                      </p>
                      }
                    </div>
                    <div className="flex flex-col mb-4">
                      <label className="font-medium text-gray-700 mb-1">Phone</label>
                      <Field
                        type="number"
                        name="phone"
                        className={`w-full border p-2 rounded ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter phone number"
                        disabled={!isEditing}
                      />
                      <ErrorMessage
                        name="phone"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div className="flex flex-col mb-4">
                      <label className="font-medium text-gray-700 mb-1">Website</label>
                      <Field
                        type="url"
                        name="website"
                        className={`w-full border p-2 rounded ${
                          errors.website ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter website URL"
                        disabled={!isEditing}
                      />
                      <ErrorMessage
                        name="website"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="flex flex-col mb-4">
                      <label className="font-medium text-gray-700 mb-1">Address</label>
                      <Field
                        type="text"
                        name="address"
                        className={`w-full border p-2 rounded ${
                          errors.address ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter address"
                        disabled={!isEditing}
                      />
                      <ErrorMessage
                        name="address"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="flex flex-col mb-4">
                      <label className="font-medium text-gray-700 mb-1">
                        Address 2
                      </label>
                      <Field
                        type="text"
                        name="address2"
                        className="w-full border p-2 rounded border-gray-300"
                        placeholder="Enter address 2"
                        disabled={!isEditing}
                      />
                       <ErrorMessage
                        name="address2"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="flex flex-col mb-4">
                      <label className="font-medium text-gray-700 mb-1">City</label>
                      <Field
                        type="text"
                        name="city"
                        className="w-full border p-2 rounded border-gray-300"
                        placeholder="Enter city"
                        disabled={!isEditing}
                      />
                       <ErrorMessage
                        name="city"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="flex flex-col mb-4">
                      <label className="font-medium text-gray-700 mb-1">Country</label>
                      <CountryDropdown
                        value={values.country}
                        onChange={(val) => setFieldValue("country", val)}
                        disabled={!isEditing}
                        // className="w-full border p-2 rounded border-gray-300"
                      />
                    </div>
                    <div className="flex flex-col mb-4">
                      <label className="font-medium text-gray-700 mb-1">
                        State/Region
                      </label>
                      <RegionDropdown
                        country={values.country}
                        value={values.state}
                        onChange={(val) => setFieldValue("state", val)}
                        disabled={!isEditing}
                        // className="w-full border p-2 rounded border-gray-300"
                      />
                    </div>
                    <div className="flex flex-col mb-4">
                      <label className="font-medium text-gray-700 mb-1">
                        Facebook
                      </label>
                      <Field
                        type="url"
                        name="facebook"
                        className={`w-full border p-2 rounded ${
                          errors.facebook ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter Facebook URL"
                        disabled={!isEditing}
                      />
                      <ErrorMessage
                        name="facebook"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="flex flex-col mb-4">
                      <label className="font-medium text-gray-700 mb-1">
                        Instagram
                      </label>
                      <Field
                        type="url"
                        name="instagram"
                        className={`w-full border p-2 rounded ${
                          errors.instagram ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter Instagram URL"
                        disabled={!isEditing}
                      />
                      <ErrorMessage
                        name="instagram"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="flex flex-col mb-4">
                      <label className="font-medium text-gray-700 mb-1">
                        Twitter
                      </label>
                      <Field
                        type="url"
                        name="twitter"
                        className={`w-full border p-2 rounded ${
                          errors.twitter ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter Twitter URL"
                        disabled={!isEditing}
                      />
                      <ErrorMessage
                        name="twitter"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="flex flex-col mb-4">
                      <label className="font-medium text-gray-700 mb-1">
                        LinkedIn
                      </label>
                      <Field
                        type="url"
                        name="linkedin"
                        className={`w-full border p-2 rounded ${
                          errors.linkedin ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter LinkedIn URL"
                        disabled={!isEditing}
                      />
                      <ErrorMessage
                        name="linkedin"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="flex flex-col mb-4">
                      <label className="font-medium text-gray-700 mb-1">
                        YouTube
                      </label>
                      <Field
                        type="url"
                        name="youtube"
                        className={`w-full border p-2 rounded ${
                          errors.youtube ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter YouTube URL"
                        disabled={!isEditing}
                      />
                      <ErrorMessage
                        name="youtube"
                        component="p"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col mb-4">
                    <label className="font-medium text-gray-700 mb-1">
                      About
                    </label>
                    <Field
                      as="textarea"
                      name="about"
                      className={`w-full border p-2 rounded ${
                        errors.about ? "border-red-500" : "border-gray-300"
                      }`}
                      rows={5}
                      placeholder="Write about your organization"
                      disabled={!isEditing}
                    />
                    <ErrorMessage
                      name="about"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {isEditing && (
                    <div className="mt-6">
                      <button
                        type="submit"
                        className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-950 transition"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerProfile;
