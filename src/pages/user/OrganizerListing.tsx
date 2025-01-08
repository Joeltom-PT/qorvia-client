import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { followOrganizer, getAllOrganizers } from "../../redux/action/userActions";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
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
      if(isFollowing != null && isFollowing != undefined){
         await dispatch(followOrganizer({ organizerId, isFollowing })).unwrap();
         setOrganizers((prevOrganizers) =>
          prevOrganizers.map((org) =>
            org.id === organizerId
              ? { 
                  ...org, 
                  isFollowing: !org.isFollowing, 
                  stats: { 
                    ...org.stats, 
                    followers: org.stats.followers + (org.isFollowing ? -1 : 1) 
                  } 
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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold">Organizers</h1>
        <div className="flex w-full sm:w-auto gap-2">
          <input
            type="search"
            placeholder="Search events"
            value={searchTerm}
            onChange={handleSearch}
            className="flex-1 sm:w-64 px-4 py-2 border border-blue-900 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
          />
          <button className="px-6 py-2 bg-blue-800 text-white rounded-[5px] hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2">
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {loading
          ? Array.from({ length: itemsPerPage }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-[5px] border border-blue-900 shadow-lg overflow-hidden flex flex-col"
              >
                <div className="relative h-48">
                  <Skeleton height="100%" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <Skeleton count={1} height={30} width="60%" className="mb-4" />
                  <div className="flex justify-between mb-6">
                    <div className="text-center">
                      <Skeleton height={20} width={40} />
                      <div className="text-sm text-gray-600">Followers</div>
                    </div>
                    <div className="text-center">
                      <Skeleton height={20} width={40} />
                      <div className="text-sm text-gray-600">Events</div>
                    </div>
                    <div className="text-center">
                      <Skeleton height={20} width={40} />
                      <div className="text-sm text-gray-600">Posts</div>
                    </div>
                  </div>
                  <Skeleton count={3} className="mb-6" />
                  <div className="flex justify-between mt-auto pt-4 border-t border-gray-100">
                    <Skeleton height={36} width={100} />
                    <Skeleton height={36} width={100} />
                  </div>
                </div>
              </div>
            ))
          : organizers.map((organizer) => (
              <div
                key={organizer.id}
                className="bg-white rounded-[5px] border border-blue-900 shadow-lg overflow-hidden flex flex-col"
              >
                <div className="relative h-48">
                  <img
                    src={organizer.imageUrl}
                    alt={organizer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-bold mb-4">{organizer.name}</h2>
                  <div className="flex justify-between mb-6">
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {formatNumber(organizer.stats.followers)}
                      </div>
                      <div className="text-sm text-gray-600">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {organizer.stats.events}
                      </div>
                      <div className="text-sm text-gray-600">Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">
                        {organizer.stats.posts}
                      </div>
                      <div className="text-sm text-gray-600">Posts</div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-6 line-clamp-4">
                    {organizer.description}
                  </p>

                  <div className="flex justify-between mt-auto pt-4 border-t border-gray-100">
                    <button
                      onClick={() => toggleFollow(organizer.id, organizer.isFollowing)}
                      className={`px-6 py-2 rounded-[5px] transition-colors font-semibold ${
                        loadingFollow === organizer.id
                          ? "bg-gray-500 cursor-not-allowed"
                          : organizer.isFollowing
                          ? "border border-blue-900 text-blue-900 hover:bg-gray-50"
                          : "bg-blue-800 text-white hover:bg-blue-900"
                      }`}
                      disabled={loadingFollow === organizer.id}
                    >
                      {loadingFollow === organizer.id ? "Loading..." : organizer.isFollowing ? "Unfollow" : "Follow"}
                    </button>
                    <Link to={`/host/profile/${organizer.id}`} className="px-6 py-2 text-blue-900 border border-blue-900 rounded-[5px] font-semibold hover:bg-gray-50">
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => changePage("prev")}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index + 1}
                onClick={() => changePage("current", index + 1)}
                className={`w-10 h-10 rounded-lg ${
                  currentPage === index + 1
                    ? "bg-blue-700 text-white"
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
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default OrganizerListing;
