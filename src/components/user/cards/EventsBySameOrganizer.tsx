import React from "react";
import { Link } from "react-router-dom";

const EventsBySameOrganizer : React.FC<{ eventId: string; organizerId: number }> = ({ eventId, organizerId }) =>{

   const sample = () => {
    console.log(eventId, organizerId)
   }

  return (
    <div className="w-full md:w-72 border-l border-gray-300 p-4">
      {/* <div className="mb-6">
        <h3 className="font-bold text-lg mb-2">Organizer</h3>
        <div className="bg-purple-900 h-24 rounded-[8px] mb-4 flex items-center justify-center">
          <div className="text-white text-lg font-semibold">
            Product Design World Summit XII
          </div>
        </div>
        <div className="text-lg font-semibold mb-2">Acme Events</div>
        
        <div className="flex justify-between mb-4">
          <div className="text-center">
            <div className="font-bold">1.2K</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-bold">234</div>
            <div className="text-sm text-gray-600">Events</div>
          </div>
          <div className="text-center">
            <div className="font-bold">3</div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>
        </div>
        
        <div className="flex gap-2 mb-6">
          <button className="w-1/2 bg-blue-900 text-white py-2 rounded-[6px] hover:bg-blue-800 transition-colors">
            Follow
          </button>
          <button className="w-1/2 border border-blue-900 text-blue-900 py-2 rounded-[6px] hover:bg-blue-50 transition-colors">
            View Profile
          </button>
        </div>
      </div> */}

      <div className="">
        <h4 className="font-bold mb-3">Up coming events</h4>
        <div className="bg-gray-50 rounded-[8px] p-4">
          <div className="mb-4">
            <img
              src="/api/placeholder/320/200"
              alt="Event illustration"
              className="w-full rounded-[8px] mb-3"
            />
            <h5 className="font-semibold mb-2">
              The Future of Work: A Fireside Chat with Slack's CEO and CPO
            </h5>
            <div className="text-sm text-gray-600 mb-1">
              Date: Wed, Jun 16, 2024
            </div>
            <div className="text-sm text-gray-600 mb-3">
              Type: Online
            </div>
            <button className="w-full bg-blue-900 text-white py-2 rounded-[6px] hover:bg-blue-800 transition-colors mb-3">
              Book It Now
            </button>
          </div>
        </div>
        <Link to="/explore">
        <button className="w-full border border-blue-900 text-blue-900 py-2 rounded-[6px] hover:bg-blue-50 transition-colors">
          View More
        </button>
        </Link>
      </div>
    </div>
  );
};

export default EventsBySameOrganizer;