import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { followOrganizer, getOrganizerProfileData } from '../../redux/action/userActions';
import { AppDispatch } from '../../redux/store';
import { IOrganizerProfileData } from '../../interfaces/organizer';

interface Event {
  id: number;
  title: string;
  date: string;
  type: string;
  description: string;
  image: string;
}

const SocialLink = ({ url, platform }: { url?: string; platform: string }) => {
    if (!url) return null;
    
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
      >
        <span className="text-sm">{platform}</span>
      </a>
    );
  };

const OrganizerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const organizerId = Number(id);
  const [activeTab, setActiveTab] = useState<'Events' | 'Blogs'>('Events');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: any) => state.user);
  const [organizer, setOrganizer] = useState<IOrganizerProfileData | null>(null);
  const [loadingFollow, setLoadingFollow] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrganizerData = async () => {
      try {
        const response = await dispatch(getOrganizerProfileData({ id: organizerId })).unwrap();
        setOrganizer(response);
      } catch (error) {
        console.error('Failed to fetch organizer data:', error);
      }
    };

    fetchOrganizerData();
  }, [dispatch, organizerId]);

  const toggleFollow = async (organizerId: number, isFollowing: boolean) => {
    if (!user.isLogged) {
      navigate("/login");
      return;
    }

    try {
      setLoadingFollow(organizerId);
      await dispatch(followOrganizer({ organizerId, isFollowing })).unwrap();
      setOrganizer((prev) => (prev ? { ...prev, isFollowing: !prev.isFollowing, totalFollowers: prev.isFollowing ? prev.totalFollowers - 1 : prev.totalFollowers + 1 } : prev));
    } catch (err) {
      console.error("Failed to toggle follow status:", err);
      toast.error("Failed request. Please try again");
    } finally {
      setLoadingFollow(null);
    }
  };

  if (!organizer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-5 p-3 sm:p-4 md:p-6">
       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header Section */}
      <div className="relative h-32 bg-gradient-to-r from-blue-100 to-blue-200">
        <div className="absolute -bottom-16 left-8">
          <img
            src={organizer.profileImage || '/api/placeholder/128/128'}
            alt={organizer.organizationName}
            className="w-32 h-32 rounded-lg border-4 border-white shadow-md"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-8 pb-8">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {organizer.organizationName}
            </h1>
            <p className="text-gray-600 mb-4 max-w-2xl">
              {organizer.about || 'No description provided'}
            </p>
          </div>
          <button
            onClick={() => toggleFollow(organizer.id, organizer.isFollowing)}
            disabled={loadingFollow !== null}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all
              ${organizer.isFollowing 
                ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
              } ${loadingFollow !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {organizer.isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-6 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{organizer.totalFollowers}</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
          {/* <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{organizer.totalEvents}</div>
            <div className="text-sm text-gray-600">Events</div>
          </div> */}
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
            <div className="space-y-2">
              {organizer.website && (
                <p className="text-sm">
                  <span className="text-gray-600">Website:</span>{' '}
                  <a href={organizer.website} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:underline">
                    {organizer.website}
                  </a>
                </p>
              )}
              <p className="text-sm">
                <span className="text-gray-600">Address:</span>{' '}
                {organizer.address}
                {organizer.address2 && `, ${organizer.address2}`}
              </p>
              <p className="text-sm">
                <span className="text-gray-600">Location:</span>{' '}
                {`${organizer.city}, ${organizer.state}, ${organizer.country}`}
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Social Media</h2>
            <div className="flex flex-wrap gap-2">
              <SocialLink url={organizer.facebook} platform="Facebook" />
              <SocialLink url={organizer.instagram} platform="Instagram" />
              <SocialLink url={organizer.twitter} platform="Twitter" />
              <SocialLink url={organizer.linkedin} platform="LinkedIn" />
              <SocialLink url={organizer.youtube} platform="YouTube" />
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* <div className="flex gap-2 sm:gap-4 mb-6">
        <button
          className={`px-4 sm:px-6 py-2 rounded-[5px] font-medium transition-colors ${activeTab === 'Events' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          onClick={() => setActiveTab('Events')}
        >
          Events
        </button>
        <button
          className={`px-4 sm:px-6 py-2 rounded-[5px] font-medium transition-colors ${activeTab === 'Blogs' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          onClick={() => setActiveTab('Blogs')}
        >
          Blogs
        </button>
      </div> */}

      {/* <div className="space-y-4">
        {mockEvents.map(event => (
          <div key={event.id} className="bg-white rounded-[5px] p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <img
                src={event.image}
                alt={event.title}
                className="w-full sm:w-64 h-48 sm:h-40 rounded-[5px] object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{event.title}</h3>
                <div className="text-sm text-gray-600 mb-2">
                  <div>Date: {event.date}</div>
                  <div>Type: {event.type}</div>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-4">{event.description}</p>
                <button className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-[5px] hover:bg-blue-700 transition-colors">
                  Booking and More Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div> */}

      {/* <div className="flex justify-center gap-2 mt-8">
        <button className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 hover:bg-gray-100 rounded-[5px]">
          Before
        </button>
        {[7, 8, 9].map(page => (
          <button
            key={page}
            className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-[5px] ${page === 8 ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {page}
          </button>
        ))}
        <button className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 hover:bg-gray-100 rounded-[5px]">
          After
        </button>
      </div> */}
    </div>
  );
}

export default OrganizerProfilePage;
