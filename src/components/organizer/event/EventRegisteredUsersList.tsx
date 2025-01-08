import { useState, useEffect } from "react";
import { IBookedUsers } from "../../../interfaces/booking";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { fetchBookedUsersList } from "../../../redux/action/organizerActions";

interface EventRegisteredUsersListProps {
  eventId: string;
}

const EventRegisteredUsersList: React.FC<EventRegisteredUsersListProps> = ({ eventId }) => {
  const [bookedUsers, setBookedUsers] = useState<IBookedUsers[]>([]);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<IBookedUsers | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const pageSize = 10; 

  useEffect(() => {
    const fetchBookedUsers = async () => {
      setLoading(true);
      try {
        const response = await dispatch(fetchBookedUsersList({ pageNumber: currentPage - 1, pageSize, eventId })).unwrap();
        setBookedUsers(response.bookedUsers);
        setTotalElements(response.totalElements);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error fetching booked users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedUsers();
  }, [currentPage, eventId]);

  const handleViewUser = (user: IBookedUsers) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-white border border-blue-900 rounded-xl shadow-sm mt-6">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Registered Users</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Username</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
              <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-3">Loading...</td>
              </tr>
            ) : (
              bookedUsers?.map((user) => (
                <tr key={user.userId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-3 px-4">{user.userName}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      className="px-4 py-2 bg-blue-800 text-white rounded-[5px] hover:bg-blue-900"
                      onClick={() => handleViewUser(user)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center py-4">
        <button
          className="px-4 py-2 bg-blue-800 text-white rounded-[5px] hover:bg-blue-900 disabled:bg-gray-300"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="mx-4 text-lg font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-blue-800 text-white rounded-[5px] hover:bg-blue-900 disabled:bg-gray-300"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {selectedUser && (
  <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
    <div className="bg-white p-6 rounded-xl shadow-xl w-96">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">User Details</h3>
      <p><strong>Name:</strong> {selectedUser.userName}</p>
      <p><strong>Email:</strong> {selectedUser.email}</p>
      <p><strong>Address:</strong> {selectedUser.address}</p>
      <p><strong>Country:</strong> {selectedUser.country}</p>
      <p><strong>State:</strong> {selectedUser.state}</p>
      <p><strong>City:</strong> {selectedUser.city}</p>
      <p><strong>Zip Code:</strong> {selectedUser.zipCode}</p>
      
      <div className="mt-4">
        <h4 className="text-lg font-semibold">Tickets</h4>
        <ul className="space-y-2">
            
          {selectedUser.tickets?.map((ticket, index) => (
            <li key={index} className="bg-blue-50 p-2 rounded-[5px] shadow">
              <p><strong>Ticket Name:</strong> {ticket.name}</p>
              <p><strong>Quantity:</strong> {ticket.quantity}</p>
              <p><strong>Price:</strong> ${ticket.price}</p>
              {ticket.discountPrice && (
                <p><strong>Discount Price:</strong> ${ticket.discountPrice}</p>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          className="px-4 py-2 bg-orange-500 text-white rounded-[5px] hover:bg-orange-600"
          onClick={handleCloseModal}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default EventRegisteredUsersList;
