import React, { useState } from 'react';
import { Wallet, CreditCard, ArrowUpCircle, Link } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import { getAccountConnectingLink } from '../../../redux/action/organizerActions';
import { toast } from 'react-toastify';

// Mock data for payouts
const mockPayouts = [
  {
    id: 1,
    amount: 2500.00,
    status: 'completed',
    date: '2024-03-15',
    destination: '**** 4242',
    type: 'direct_deposit'
  },
  {
    id: 2,
    amount: 1800.50,
    status: 'pending',
    date: '2024-03-14',
    destination: '**** 5678',
    type: 'bank_transfer'
  },
  {
    id: 3,
    amount: 3200.75,
    status: 'completed',
    date: '2024-03-13',
    destination: '**** 9012',
    type: 'direct_deposit'
  },
  {
    id: 4,
    amount: 950.25,
    status: 'failed',
    date: '2024-03-12',
    destination: '**** 3456',
    type: 'bank_transfer'
  }
];

function OrganizerPayoutManagement() {
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleConnect = async () => {
    if(!isConnected){
      try {
        const response = await dispatch(getAccountConnectingLink()).unwrap();
        window.location.href = response;        
      } catch (error) {
        toast.error("Something went wrong. Please try again!");
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-blue-950 rounded-[5px] text-white py-6 px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Organizer Information */}
        <div>
          <h2 className="text-lg font-semibold">Stripe Account Connection</h2>
          <p className="text-sm text-gray-300">
            {isConnected
              ? "Your Stripe account is successfully connected. You can now receive payouts from Qorvia."
              : "Connect your Stripe account to enable payouts from the Qorvia platform."}
          </p>
        </div>

        {/* Connect Button */}
        <button
          onClick={handleConnect}
          className={`px-6 py-2 rounded-[10px] flex items-center space-x-2 ${
            isConnected 
              ? 'bg-green-700 hover:bg-green-800' 
              : 'bg-blue-800 hover:bg-blue-700'
          } transition-colors`}
        >
          {/* Add an Icon or Placeholder */}
          <Link className="h-5 w-5" />
          <span>{isConnected ? 'Connected' : 'Connect Account'}</span>
        </button>
      </div>
    </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-[5px] shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold text-blue-900">$12,450.50</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Wallet className="h-6 w-6 text-blue-900" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[5px] shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Pending Payouts</p>
                <p className="text-2xl font-bold text-blue-900">$1,800.50</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[5px] shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Paid Out</p>
                <p className="text-2xl font-bold text-blue-900">$45,280.75</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <ArrowUpCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Payouts List */}
        <div className="bg-white rounded-[5px] shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-blue-900">Recent Payouts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-blue-900">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-blue-900">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-blue-900">Destination</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-blue-900">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-blue-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-blue-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockPayouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-blue-50">
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(payout.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      ${payout.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {payout.destination}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {payout.type.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${payout.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          payout.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {payout.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm"'>
                      <button className='py-1 px-2 bg-blue-900 text-white font-semibold rounded-[5px]'>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrganizerPayoutManagement;