import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { IGetAllUsersResponse, UserData } from '../../interfaces/admin';
import { debounce } from '../../utils/debounce';
import { changeUserStatus, getAllUsers } from '../../redux/action/adminActions';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { MoonLoader } from 'react-spinners';
import { toast } from 'react-toastify'; // Import toast for notifications

const AdminUserManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const pageSize = 10;
  const isInitialMount = useRef(true);

  const fetchUsers = async (page: number, size: number, search: string) => {
    setLoading(true);
    try {
      const response = await dispatch(getAllUsers({ page, size, search })).unwrap();
      const data: IGetAllUsersResponse = response;

      if (data.data.users) {
        setUsers(data.data.users);
        setTotalPages(data.data.totalPages);
      } else {
        console.error('Users data is not available:', data);
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchUsers = useCallback(
    debounce((term: string) => {
      fetchUsers(currentPage - 1, pageSize, term);
    }, 600),
    [currentPage]
  );

  useEffect(() => {
    if (isInitialMount.current) {
      fetchUsers(currentPage - 1, pageSize, searchTerm);
      isInitialMount.current = false;
    } else {
      debouncedFetchUsers(searchTerm);
    }
  }, [currentPage, searchTerm, debouncedFetchUsers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusToggle = async (email: string) => {
    try {
      await dispatch(changeUserStatus(email)).unwrap();

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === email
            ? { ...user, status: user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
            : user
        )
      );

      toast.success(`User status Changed successfully.`);
    } catch (error) {
      console.error('Failed to change status of user:', error);
      toast.error('Failed to change user status. Please try again.');
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleMoreClick = (user: UserData) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const cancelStatusChange = () => {
    setSelectedUser(null);
    setIsModalVisible(false);
  };

  const confirmStatusChange = () => {
    if (selectedUser) {
      handleStatusToggle(selectedUser.email);
      cancelStatusChange();
    }
  };

  return (
    <>
      {isModalVisible && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-10 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Block/Unblock User</h2>
            <p className="mb-4">Are you sure you want to {selectedUser.status === 'ACTIVE' ? 'block' : 'unblock'} this user?</p>
            <div className="flex justify-between">
              <button onClick={cancelStatusChange} className="bg-slate-400 border border-1 text-white py-2 px-4 rounded-lg">Cancel</button>
              <button 
                onClick={confirmStatusChange} 
                className={`${
                  selectedUser.status === 'ACTIVE' ? 'bg-red-600' : 'bg-blue-900'
                } text-white py-2 px-4 rounded-lg`}>
                {selectedUser.status === 'ACTIVE' ? 'Block User' : 'Unblock User'}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto p-4 space-y-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-48">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-8 pr-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
              <Search className="h-4 w-4 text-gray-400 absolute left-2 top-2" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-indigo-700 text-white text-xs">
                <tr>
                  <th className="p-2 text-left rounded-tl-md w-16">No</th>
                  <th className="p-2 text-left w-32">Username</th>
                  <th className="p-2 text-left w-48">Email</th>
                  <th className="p-2 text-left w-24">Status</th>
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
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-500 py-2 text-sm">No users found.</td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user.username} className={index % 2 === 0 ? 'bg-indigo-50' : 'bg-white'}>
                      <td className="p-2">{index + 1 + (currentPage - 1) * pageSize}</td>
                      <td className="p-2 font-medium">{user.username}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.status}</td>
                      <td className="p-2">
                        <button
                          onClick={() => handleMoreClick(user)}
                          className={`text-sm rounded-lg ${
                            user.status === 'ACTIVE' ? 'bg-red-500' : 'bg-green-500'
                          } text-white px-2 py-1`}
                        >
                          {user.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className='flex justify-center'>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`relative inline-flex items-center px-3 py-1 border text-xs font-medium ${
                    currentPage === i + 1
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-500 hover:bg-gray-50 transition-colors duration-200'
                  }`}
                >
                  {i + 1}
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
    </>
  );
};

export default AdminUserManagement;
