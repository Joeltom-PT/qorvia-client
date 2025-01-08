import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { IGetAllOrganizersResponse, OrganizerData } from '../../interfaces/admin';
import { debounce } from '../../utils/debounce';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { MoonLoader } from 'react-spinners';
import { getAllOrganizers } from '../../redux/action/adminActions';
import { Link } from 'react-router-dom';

const AdminOrganizerManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [organizers, setOrganizes] = useState<OrganizerData[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const pageSize = 10;
  const isInitialMount = useRef(true);

  const fetchOrganizers = async (page: number, size: number, search: string, status: string) => {
    setLoading(true);
    try {
      const response = await dispatch(getAllOrganizers({ page, size, search, status })).unwrap();
      const data: IGetAllOrganizersResponse = response;

      if (data.data.organizers) {
        setOrganizes(data.data.organizers);
        setTotalPages(data.data.totalPages);
      } else {
        console.error('Users data is not available:', data);
        setOrganizes([]);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchUsers = useCallback(
    debounce((term: string, status: string) => {
      fetchOrganizers(currentPage - 1, pageSize, term, status);
    }, 600),
    [currentPage] 
  );

  useEffect(() => {
    if (isInitialMount.current) {
      fetchOrganizers(currentPage - 1, pageSize, searchTerm, filterStatus);
      isInitialMount.current = false;
    } else {
      debouncedFetchUsers(searchTerm, filterStatus); 
    }
  }, [currentPage, searchTerm, filterStatus, debouncedFetchUsers]); 

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value); 
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value);
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-48">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-8 pr-3 py-1 border border-blue-900 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
            <Search className="h-4 w-4 text-gray-400 absolute left-2 top-2" />
          </div>
          <div className="relative flex">
            <select
              className="select border border-blue-900 select-sm w-full max-w-xs"
              value={filterStatus}
              onChange={handleFilterChange}
            >
              <option value="">Filter by approval status</option>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-indigo-700 text-white text-xs">
              <tr>
                <th className="p-2 text-left rounded-tl-md w-16">No</th>
                <th className="p-2 text-left w-32">Name</th>
                <th className="p-2 text-left w-48">Total events</th>
                <th className="p-2 text-left w-32">Approval Status</th>
                <th className="p-2 rounded-tr-md text-left w-32">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center">
                    <div className="flex justify-center items-center">
                      <MoonLoader color="#4f46e5" size={32} />
                    </div>
                  </td>
                </tr>
              ) : organizers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-2 text-sm">No Organizers found.</td>
                </tr>
              ) : (
                organizers.map((organizer, index) => (
                  <tr key={organizer.email} className={index % 2 === 0 ? 'bg-indigo-50' : 'bg-white'}>
                    <td className="p-2">{index + 1 + (currentPage - 1) * pageSize}</td>
                    <td className="p-2 font-medium">{organizer.name}</td>
                    <td className="p-2">{organizer.email}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        organizer.registerRequestStatus === 'APPROVED' ? 'bg-green-200 text-green-800' :
                        organizer.registerRequestStatus === 'PENDING' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-red-200 text-red-800'
                      }`}>
                        {organizer.registerRequestStatus}
                      </span>
                    </td>
                    <td className="p-2 flex space-x-2">
                      <Link  to={`/admin/organizerDetails/${btoa(organizer.id.toString())}`} className="px-2 py-1 bg-blue-900 text-white hover:bg-blue-800 rounded-md text-xs font-medium transition-colors duration-200">
                        More
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-3 py-1 border text-xs font-medium transition-colors duration-200 ${
                    currentPage === page
                      ? 'z-10 bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-1 rounded-r-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrganizerManagement;
