import React, { useState } from 'react';
import EventControl from '../../components/admin/EventControl';
import EventCategoryManagement from '../../components/admin/EventCategoryManagement';
import ApprovedEventManagement from '../../components/admin/ApprovedEventManagement';

const AdminEventManagement: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>('eventManagement');

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <button
          className={`px-4 mx-2 py-4 w-[33.33%] border border-blue-700 font-semibold rounded ${activeComponent === 'eventManagement' ? 'bg-indigo-800 text-white hover:bg-indigo-900 hover:text-white' : 'bg-slate-300 hover:bg-indigo-900 hover:text-white shadow-md'}`}
          onClick={() => setActiveComponent('eventManagement')}
        >
          Event Management
        </button>
        <button
          className={`px-4 mx-2 py-4 w-[33.33%] border border-blue-700 font-semibold rounded ${activeComponent === 'eventApprovalManagement' ? 'bg-indigo-800 text-white hover:bg-indigo-900 hover:text-white' : 'bg-slate-300 hover:bg-indigo-900 hover:text-white shadow-md'}`}
          onClick={() => setActiveComponent('eventApprovalManagement')}
        >
          Event Approval Request
        </button>
        <button
          className={`px-4 mx-2 py-4 w-[33.33%] border border-blue-700 font-semibold rounded ${activeComponent === 'eventCategoryManagement' ? 'bg-indigo-800 text-white hover:bg-indigo-900 hover:text-white' : 'bg-slate-300 hover:bg-indigo-900 hover:text-white shadow-md'}`}
          onClick={() => setActiveComponent('eventCategoryManagement')}
        >
          Event Category Management
        </button>
      </div>
      <div>
        {activeComponent === 'eventManagement' && <ApprovedEventManagement />}
        {activeComponent === 'eventApprovalManagement' && <EventControl />}
        {activeComponent === 'eventCategoryManagement' && <EventCategoryManagement />}
      </div>
    </div>
  );
};

export default AdminEventManagement;
