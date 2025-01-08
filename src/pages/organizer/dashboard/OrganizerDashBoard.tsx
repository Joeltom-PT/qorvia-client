import React from 'react';

interface StatCard {
  label: string;
  value: string;
}

interface Event {
  name: string;
  start: string;
  end: string;
  location: string;
}

const OrganizerDashboard: React.FC = () => {
  const statCards: StatCard[] = [
    { label: 'Total events', value: '8' },
    { label: 'Events this week', value: '2' },
    { label: 'Events today', value: '1' },
    { label: 'Published Blogs', value: '47' },
  ];

  const events: Event[] = [
    { name: 'Conference 2022', start: 'Oct 12, 9:00 AM', end: 'Oct 12, 6:00 PM', location: 'San Francisco' },
    { name: 'Webinar: Product Launch', start: 'Nov 15, 10:00 AM', end: 'Nov 15, 11:00 AM', location: 'Online' },
    { name: 'Workshop: Growth Hacking', start: 'Dec 5, 2:00 PM', end: 'Dec 5, 4:00 PM', location: 'Los Angeles' },
    { name: 'Seminar: Leadership Training', start: 'Jan 8, 1:00 PM', end: 'Jan 8, 5:00 PM', location: 'New York' },
    { name: 'Summit: Innovation Showcase', start: 'Feb 20, 11:00 AM', end: 'Feb 21, 3:00 PM', location: 'Austin' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-blue-950  text-white p-3 rounded-[5px] shadow-lg">
            <h2 className="text-md font-semibold">{stat.label}</h2>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow-sm shadow-blue-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-950 text-white">
              <tr>
                <th className="p-2 text-left">Event Name</th>
                <th className="p-2 text-left">Starts</th>
                <th className="p-2 text-left">Ends</th>
                <th className="p-2 text-left">Location</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-blue-100' : 'bg-white'}>
                  <td className="p-2">{event.name}</td>
                  <td className="p-2">{event.start}</td>
                  <td className="p-2">{event.end}</td>
                  <td className="p-2">{event.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
