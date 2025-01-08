
interface TicketOption {
  id: string;
  type: string;
  price: number;
  available: number;
}

const ticketOptions: TicketOption[] = [
  { id: '1', type: 'Standard', price: 15, available: 45 },
  { id: '2', type: 'Premium', price: 25, available: 20 },
  { id: '3', type: 'VIP', price: 40, available: 10 },
];

export default function TicketSection() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Select Tickets</h2>
      
      <div className="space-y-4">
        {ticketOptions.map((ticket) => (
          <div 
            key={ticket.id}
            className="bg-white rounded-lg p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow
                       flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <h3 className="font-semibold text-lg">{ticket.type}</h3>
              <p className="text-gray-600 text-sm">{ticket.available} tickets left</p>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <span className="text-xl font-bold">${ticket.price}</span>
              <button 
                className="flex-1 md:flex-none px-6 py-2 bg-blue-600 text-white rounded-lg
                          hover:bg-blue-700 transition-colors font-medium"
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Important Information</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Tickets cannot be refunded or exchanged</li>
          <li>• Please arrive 15 minutes before showtime</li>
          <li>• Valid ID may be required for entry</li>
        </ul>
      </div>
    </div>
  );
}