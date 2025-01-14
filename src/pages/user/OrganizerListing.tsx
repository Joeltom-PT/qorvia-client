import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { followOrganizer, getAllOrganizers } from "../../redux/action/userActions";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface OrganizerStats {
  followers: number;
  events: number;
  posts: number;
}

interface Organizer {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  stats: OrganizerStats;
  isFollowing?: boolean;
}

export interface IOrganizerList {
  organizers: Organizer[];
  totalPages: number;
  totalElements: number;
  pageNumber?: number;
  pageSize?: number;
}

const OrganizerListing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingFollow, setLoadingFollow] = useState<number | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const fetchAllOrganizers = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        getAllOrganizers({
          currentPage: currentPage - 1,
          itemsPerPage: itemsPerPage,
        })
      ).unwrap();
      const data: IOrganizerList = response;
      setOrganizers(data.organizers);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching organizers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrganizers();
  }, [currentPage]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const formatNumber = (num: number) => {
    return num >= 1000 ? (num / 1000).toFixed(1) + "K" : num.toString();
  };

  const toggleFollow = async (organizerId: number, isFollowing?: boolean) => {
    if (!user.isLogged) {
      navigate("/login");
      return;
    }

    try {
      setLoadingFollow(organizerId);
      if (isFollowing != null && isFollowing != undefined) {
        await dispatch(followOrganizer({ organizerId, isFollowing })).unwrap();
        setOrganizers((prevOrganizers) =>
          prevOrganizers.map((org) =>
            org.id === organizerId
              ? {
                  ...org,
                  isFollowing: !org.isFollowing,
                  stats: {
                    ...org.stats,
                    followers: org.stats.followers + (org.isFollowing ? -1 : 1),
                  },
                }
              : org
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle follow status:", err);
      toast.error("Failed request. Please try again");
    } finally {
      setLoadingFollow(null);
    }
  };

  function changePage(dir: "prev" | "next" | "current", pageNumber?: number) {
    switch (dir) {
      case "next":
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
        break;
      case "prev":
        setCurrentPage((prev) => Math.max(prev - 1, 1));
        break;
      default:
        if (pageNumber) {
          setCurrentPage(pageNumber);
          break;
        }
    }
  }

  const totalReturn = (organizers: Organizer[]): number => {
    return organizers.reduce((total, organizer) => {
      return total + organizer.stats.followers + organizer.stats.events + organizer.stats.posts;
    }, 0);
  };

  return (
    <div className="container mx-auto px-4 py-12 font-body bg-gray-50">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
        <h1 className="text-3xl font-heading font-bold text-gray-900">Organizers</h1>
        <div className="flex w-full sm:w-auto gap-2">
          <input
            type="search"
            placeholder="Search events"
            value={searchTerm}
            onChange={handleSearch}
            className="flex-1 sm:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-body"
          />
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-body font-semibold transition-colors duration-200">
            Search
          </button>
        </div>
      </div>
  
      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading Skeletons
          Array.from({ length: itemsPerPage }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
            >
              <div className="relative h-32">
                <Skeleton height="100%" />
                <div className="absolute -bottom-12 left-4 w-24 h-24 rounded-full border-4 border-white overflow-hidden">
                  <Skeleton circle height="100%" />
                </div>
              </div>
              
              <div className="pt-14 px-4 pb-4">
                <Skeleton height={24} width="70%" className="mb-2" />
                <Skeleton count={2} className="mb-4" />
                
                <div className="flex justify-between mb-4 bg-gray-50 rounded-lg p-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="text-center">
                      <Skeleton height={24} width={40} />
                      <Skeleton height={16} width={50} />
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Skeleton height={40} width="50%" />
                  <Skeleton height={40} width="50%" />
                </div>
              </div>
            </div>
          ))
        ) : (
          // Actual Content
          organizers.map((organizer) => (
            <div
              key={organizer.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              {/* Header Section with Cover Image and Profile Picture */}
              <div
  className="relative h-32 bg-cover"
  style={{ backgroundImage: `url('${organizer.imageUrl}')` }}
>
                <div className="absolute -bottom-12 left-4 w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-lg">
                  <img
                    src={organizer.imageUrl}
                    alt={organizer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
  
              {/* Content Section */}
              <div className="pt-14 px-4 pb-4 flex-1 flex flex-col">
                {/* Profile Info */}
                <div className="mb-4">
                  <h2 className="text-lg font-heading font-bold text-gray-900">{organizer.name}</h2>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{organizer.description}</p>
                </div>
  
                {/* Stats Section */}
                <div className="flex justify-between mb-4 bg-gray-50 rounded-lg p-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {formatNumber(organizer.stats.followers)}
                    </div>
                    <div className="text-xs text-gray-600">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{organizer.stats.events}</div>
                    <div className="text-xs text-gray-600">Events</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{organizer.stats.posts}</div>
                    <div className="text-xs text-gray-600">Posts</div>
                  </div>
                </div>
  
                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => toggleFollow(organizer.id, organizer.isFollowing)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      loadingFollow === organizer.id
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : organizer.isFollowing
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    disabled={loadingFollow === organizer.id}
                  >
                    {loadingFollow === organizer.id ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Loading...
                      </span>
                    ) : (
                      organizer.isFollowing ? "Following" : "Follow"
                    )}
                  </button>
                  <Link
                    to={`/host/profile/${organizer.id}`}
                    className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors duration-200 text-center"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
  
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 font-display mt-12">
          <button
            onClick={() => changePage("prev")}
            disabled={currentPage === 1}
            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Previous
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index + 1}
                onClick={() => changePage("current", index + 1)}
                className={`w-10 h-10 rounded-lg transition-colors duration-200 ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => changePage("next")}
            disabled={currentPage === totalPages}
            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next
          </button>
        </div>
      )}
  
      {/* Total Return Section */}
      <div className="mt-8 text-right">
        <p className="text-gray-700">
          Total Return: <span className="font-bold text-blue-600">{formatNumber(totalReturn(organizers))}</span>
        </p>
      </div>
    </div>
  );
};

export default OrganizerListing;