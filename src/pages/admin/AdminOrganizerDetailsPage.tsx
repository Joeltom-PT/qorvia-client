import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { AppDispatch } from '../../redux/store';
import { changeOrganizerStatus, getOrganizerDetails } from '../../redux/action/adminActions';
import { IAdminSideOrganizerDetail, IAdminSideOrganizerDetailReponse } from '../../interfaces/admin';
import { useParams } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';

interface RouteParams {
  [key: string]: string | undefined;
  organizerId: string;
}

const AdminOrganizerDetailsPage = () => {
  const { organizerId } = useParams<RouteParams>();
  const decodedId = organizerId ? atob(organizerId) : "";

  const dispatch = useDispatch<AppDispatch>();
  const [organizer, setOrganizer] = useState<IAdminSideOrganizerDetail | null>(null);
  const [status, setStatus] = useState<string>('');
  const [registrationStatus, setRegistrationStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false); 

  useEffect(() => {
    const fetchOrganizerDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const resultAction = await dispatch(getOrganizerDetails({ id: Number(decodedId) }));
        if (getOrganizerDetails.fulfilled.match(resultAction)) {
          const response = resultAction.payload as IAdminSideOrganizerDetailReponse;
          if (response.statusCode === 200) {
            setOrganizer(response.data);
            setStatus(response.data.status);
            setRegistrationStatus(response.data.registrationStatus);
            console.log("Api response is ",response.data)
          } else {
            setError(response.message);
            console.error("Failed to fetch organizer details:", response.message);
          }
        } else {
          if (resultAction.payload) {
            const errorMessage = "Failed to fetch organizer details:";
            setError(errorMessage);
            console.error(errorMessage);
          } else {
            setError("Failed to fetch organizer details");
            console.error("Failed to fetch organizer details");
          }
        }
      } catch (error) {
        setError("Failed to fetch organizer details: " + error);
        console.error("Failed to fetch organizer details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizerDetails();
  }, [dispatch, decodedId]);

  const handleSaveChanges = async () => {
    setModalOpen(true);
  };

  const confirmSaveChanges = async () => {
    try {
      const updateParams = {
        status,
        registrationStatus,
      };

      const response = await dispatch(changeOrganizerStatus({ id: decodedId, data: updateParams }));

      if (response.meta.requestStatus === 'fulfilled') {
        console.log('Changes saved successfully:', response.payload);

        setOrganizer((prev) => ({
          ...prev!,
          status: updateParams.status,
          registrationStatus: updateParams.registrationStatus,
        }));

      } else {
        console.error('Failed to save changes.');
        setError('Failed to save changes.');
      }
    } catch (error) {
      console.error('Failed to save changes:', error);
      setError('Failed to save changes.');
    } finally {
      setModalOpen(false);
    }
  };

  const cancelSaveChanges = () => {
    setModalOpen(false); 
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <MoonLoader color="#1e3a8a" loading={loading} size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <h2 className="text-xl font-semibold">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100">
      {organizer ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md mb-4 p-4">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">Profile Information</h2>
              <img
                src={organizer.profileImage}
                alt={organizer.organizationName}
                className="w-full h-auto object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-blue-800 mb-1">{organizer.organizationName}</h3>
              <p className="text-gray-600 mb-2 break-words">{organizer.about}</p>
              <div className="flex flex-col space-y-2">
                <InfoItem icon={<Phone />} label="Phone" value={organizer.phone} />
                <InfoItem
                  icon={<MapPin />}
                  label="Address"
                  value={`${organizer.address}, ${organizer.city}, ${organizer.state}, ${organizer.country}`}
                />
                <InfoItem icon={<Mail />} label="Email" value={organizer.email} />
                <InfoItem icon={<Globe />} label="Website" value={organizer.website || 'N/A'} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md mb-4 p-4">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">Social Media</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <SocialMediaItem icon={<Facebook />} platform="Facebook" username={organizer.facebook || 'N/A'} />
                <SocialMediaItem icon={<Instagram />} platform="Instagram" username={organizer.instagram || 'N/A'} />
                <SocialMediaItem icon={<Twitter />} platform="Twitter" username={organizer.twitter || 'N/A'} />
                <SocialMediaItem icon={<Linkedin />} platform="LinkedIn" username={organizer.linkedin || 'N/A'} />
                <SocialMediaItem icon={<Youtube />} platform="YouTube" username={organizer.youtube || 'N/A'} />
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md mb-4 p-4">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">Statistics</h2>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Calendar className="mr-1 text-blue-800" />
                  <span className="text-gray-600">Total Events</span>
                </div>
                <span className="text-xl font-bold text-blue-900">{organizer.totalEvents}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="mr-1 text-blue-800" />
                  <span className="text-gray-600">Pending Events</span>
                </div>
                {/* <span className="text-xl font-bold text-blue-900">{organizer.pendingEvents}</span> */}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md mb-4 p-4">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">Status</h2>
              <div className="flex flex-col">
                <label className="mb-1 text-gray-600">Registration Status</label>
                <select
                  value={registrationStatus}
                  onChange={(e) => setRegistrationStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 mb-2"
                >
                  <option value="PENDING" selected={registrationStatus === "PENDING"}>PENDING</option>
                  <option value="APPROVED" selected={registrationStatus === "APPROVED"}>APPROVED</option>
                  <option value="REJECTED" selected={registrationStatus === "REJECTED"}>REJECTED</option>
                </select>

                <label className="mb-1 text-gray-600">Account Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 mb-2"
                >
                  <option value="ACTIVE" selected={status === "ACTIVE"}>ACTIVE</option>
                  <option value="BLOCKED" selected={status === "BLOCKED"}>BLOCK</option>
                </select>

                <button
                  onClick={handleSaveChanges}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-2"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold">Organizer Not Found</h2>
        </div>
      )}

 
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Confirm Changes</h2>
            <p className="mb-4">Are you sure you want to save these changes?</p>
            <div className="flex justify-between">
              <button onClick={cancelSaveChanges} className="bg-gray-400 text-white py-2 px-4 rounded-lg">Cancel</button>
              <button onClick={confirmSaveChanges} className="bg-blue-600 text-white py-2 px-4 rounded-lg">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface InfoItemProps {
  icon: React.ReactNode; 
  label: string;
  value: string;
}


const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
  <div className="flex items-center">
    <span className="text-blue-800 mr-2">{icon}</span>
    <span className="font-medium">{label}: </span>
    <span className="text-gray-700 ml-1">{value}</span>
  </div>
);

interface SocialMediaItemProps {
  icon: React.ReactNode; 
  platform: string;
  username: string;
}

const SocialMediaItem: React.FC<SocialMediaItemProps> = ({ icon, platform, username }) => (
  <div className="flex items-center">
    <span className="text-blue-800 mr-2">{icon}</span>
    <span className="font-medium">{platform}: </span>
    <span className="text-gray-700 ml-1">{username}</span>
  </div>
);


export default AdminOrganizerDetailsPage;
