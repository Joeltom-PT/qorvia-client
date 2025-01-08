import React from 'react';
import { Calendar, Users, TrendingUp, Shield, LucideProps } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  Icon: React.ComponentType<LucideProps>;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ Icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
    <Icon className="w-12 h-12 text-blue-800 mb-4" />
    <h3 className="text-xl font-semibold mb-2 text-blue-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const OrganizerLandingPage: React.FC = () => {
  const features: FeatureCardProps[] = [
    {
      Icon: Calendar,
      title: "Intuitive Event Creation",
      description: "Design and launch your events effortlessly with our user-friendly interface."
    },
    {
      Icon: Users,
      title: "Comprehensive Attendee Management",
      description: "Streamline registrations, check-ins, and attendee communication all in one place."
    },
    {
      Icon: TrendingUp,
      title: "Actionable Analytics",
      description: "Leverage real-time insights to optimize your events and boost attendance."
    },
    {
      Icon: Shield,
      title: "Enterprise-Grade Security",
      description: "Protect your data and attendees with our robust, reliable security measures."
    }
  ];

  return (

    <div className="bg-[url('/organizer/bg/bg_events_collection.png')]  bg-center min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Elevate Your Events with Our Platform
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Join the ranks of successful event organizers. Create, manage, and scale your events with our powerful suite of tools and unparalleled support.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to='/register-organizer' className="bg-white text-blue-900 hover:bg-blue-100 transition-colors duration-300 px-8 py-3 rounded-full font-semibold text-lg">
              Get Started
            </Link>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-900 transition-colors duration-300 px-8 py-3 rounded-full font-semibold text-lg">
              Learn More
            </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-100 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-blue-900">
            Why Leading Organizers Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </div>

      {/* Login Prompt Section */}
      <div className="w-full h-[300px] bg-cover bg-center bg-[url('/user/bg/event-explore-search-bg.png')]">
        <div 
          style={{
            background: 'linear-gradient(90deg, rgba(0,3,56,1) 0%, rgba(0,6,116,0.4908088235294118) 50%, rgba(0,3,56,1) 100%)',
          }}
          className="w-full h-full flex justify-center items-center"
        >
          <div className="text-center text-white">
            <div className='text-left p-4 bg-blue-900 shadow-md'>
            <h2 className="text-2xl font-bold mb-2">Ready to Manage Your Events?</h2>
            <p className="mb-4">If you already have an account, log in to access your dashboard and start organizing!</p>
            <Link to="/login-organizer" className="bg-white text-blue-900 hover:bg-blue-100 transition-colors duration-300 px-6 py-2 rounded-full font-semibold">
              Log In
            </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerLandingPage;
