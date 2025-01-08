

const AdminDashboard: React.FC = () => {

  return (
    <div>
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard title="Total events" value="5k" />
            <StatCard title="Events this week" value="123" />
            <StatCard title="Events today" value="29" />
          </div>

          <div className="mt-8 bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Quarterly Revenue Growth</h2>
              <div>
                <button className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-md mr-2">Filter</button>
                <button className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-md">Export</button>
              </div>
            </div>
            <div className="h-64 bg-gray-200 rounded-md flex items-center justify-center">
              <p className="text-gray-500">Chart Placeholder</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="px-4 py-5 sm:p-6">
      <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
      <dd className="mt-1 text-3xl font-semibold text-gray-900">{value}</dd>
    </div>
  </div>
);

export default AdminDashboard;
