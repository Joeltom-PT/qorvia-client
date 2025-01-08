import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { IEventApproval, IEventApprovalResponse } from '../../interfaces/admin';
import { MoonLoader } from 'react-spinners';
import { getAllEventApprovalRequest } from '../../redux/action/adminActions';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const EventControl: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [approvalRequest, setApprovalRequest] = useState<IEventApproval[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const isInitialMount = useRef(true);

  const fetchApprovals = async (page: number, size: number) => {
    setLoading(true);
    try {
      const response = await dispatch(getAllEventApprovalRequest({ page, size })).unwrap();
      const data: IEventApprovalResponse = response;

      if (data.eventApproval) {
        setApprovalRequest(data.eventApproval);
        setTotalPages(data.totalPages);
      } else {
        console.error('Approval data is not available:', data);
        setApprovalRequest([]);
      }
    } catch (error) {
      console.error('Failed to fetch approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      fetchApprovals(currentPage - 1, pageSize);
      isInitialMount.current = false;
    }
  }, []);

  useEffect(() => {
    fetchApprovals(currentPage - 1, pageSize);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-indigo-700 text-white text-xs">
              <tr>
                <th className="p-2 text-left rounded-tl-md w-16">No</th>
                <th className="p-2 text-left">Event Name</th>
                <th className="p-2 text-left">Event Type</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className='flex justify-center'>  
                <MoonLoader className='self-center' color="#4f46e5" size={32} />
                </tr>
              ) : approvalRequest.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-2 text-sm">
                    No Approval Requests found.
                  </td>
                </tr>
              ) : (
                approvalRequest.map((approval, index) => (
                  <tr key={approval.eventId} className={`${index % 2 === 0 ? 'bg-indigo-50' : 'bg-white'}`}>
                    <td className="p-2">{index + 1 + (currentPage - 1) * pageSize}</td>
                    <td >{approval.eventName.length > 30 ? approval.eventName.substring(0,30) + '...' : approval.eventName}</td>
                    <td className="p-2 font-medium">{approval.online ? "Online" : "Venue"}</td>
                    <td className="p-2">
                      <Link
                        to={`/admin/event/${approval.eventId}`}
                        className="px-2 py-1 bg-blue-900 text-white hover:bg-blue-800 rounded-md text-xs font-medium transition-colors duration-200"
                      >
                        More
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-3 py-1 border text-xs font-medium ${
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
                className="relative inline-flex items-center px-2 py-1 rounded-r-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventControl;
