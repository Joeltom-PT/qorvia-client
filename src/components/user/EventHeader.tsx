import { motion } from 'framer-motion';
import { useState } from 'react';
import Select, { SingleValue } from 'react-select';

interface Option {
  value: string;
  label: string;
}

const EventHeader = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Option | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Option | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<Option | null>(null);
  const [selectedDate, setSelectedDate] = useState('');

  // Mock data for the select options
  const categoryOptions: Option[] = [
    { value: 'category1', label: 'Category 1' },
    { value: 'category2', label: 'Category 2' },
    { value: 'category3', label: 'Category 3' },
  ];

  const eventOptions: Option[] = [
    { value: 'event1', label: 'Event 1' },
    { value: 'event2', label: 'Event 2' },
    { value: 'event3', label: 'Event 3' },
  ];

  const organizationOptions: Option[] = [
    { value: 'org1', label: 'Organization 1' },
    { value: 'org2', label: 'Organization 2' },
    { value: 'org3', label: 'Organization 3' },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto relative">
        <motion.div
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="text-center space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-700">
              Explore & Book Events Tailored for You
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-blue-800"
          >
            Experience every event as a unique journey, whether it's a
            physical gathering or a virtual celebration—our platform is
            designed to make each moment special.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="max-w-xl mx-auto"
          >
            <div className="relative group">
              <input
                type="text"
                placeholder="Search for events..."
                className="w-full px-6 py-4 rounded-full border border-blue-200 bg-white shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-blue-900"
              />
              <motion.button
                className="absolute top-1/2 right-2 rounded-full -translate-y-1/2 px-6 py-2 bg-blue-900 text-white hover:bg-blue-800 transition-colors duration-300"
              >
                Search
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-2xl mx-auto"
          >
            here I need the search 
          </motion.div>

        </motion.div>
      </div>
    </motion.header>
  );
};

export default EventHeader;