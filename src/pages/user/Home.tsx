import { Link } from "react-router-dom";
import Slider from "../../components/user/Slider";
import { motion } from "framer-motion";
import { FaBusinessTime, FaLaptop, FaTicketAlt, FaHandshake, FaArrowRight } from "react-icons/fa";
import { BsFillCalendarEventFill, BsGraphUpArrow } from "react-icons/bs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const Home = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      icon: <FaBusinessTime className="text-4xl text-blue-800" />,
      title: "Professional Seminars",
      description: "Access high-impact business seminars and workshops conducted by industry experts and thought leaders"
    },
    {
      icon: <FaLaptop className="text-4xl text-blue-800" />,
      title: "Virtual Conferences",
      description: "Participate in interactive online conferences with global networking opportunities"
    },
    {
      icon: <FaTicketAlt className="text-4xl text-blue-800" />,
      title: "Seamless Booking",
      description: "Hassle-free registration and ticket management for both virtual and in-person events"
    },
    {
      icon: <FaHandshake className="text-4xl text-blue-800" />,
      title: "Business Networking",
      description: "Connect with industry professionals and build meaningful business relationships"
    }
  ];

  const chartData = [
    { month: 'Jan', events: 320 },
    { month: 'Feb', events: 450 },
    { month: 'Mar', events: 410 },
    { month: 'Apr', events: 550 },
    { month: 'May', events: 480 },
    { month: 'Jun', events: 680 },
    { month: 'Jul', events: 720 },
    { month: 'Aug', events: 880 },
    { month: 'Sep', events: 950 },
    { month: 'Oct', events: 1020 },
    { month: 'Nov', events: 1180 },
    { month: 'Dec', events: 1400 },
  ];

  const benefits = [
    {
      image: "user/bg/post-1-min.jpg",
      title: "Corporate Events",
      description: "From executive summits to team-building workshops"
    },
    {
      image: "user/bg/post-2-min.jpg",
      title: "Industry Conferences",
      description: "Large-scale professional gatherings and exhibitions"
    },
    {
      image: "user/bg/post-3-min.jpg",
      title: "Training Sessions",
      description: "Skill development and certification programs"
    }
  ];

  return (
    <>
      <Slider />
      
      {/* Hero Section */}
      <div className="relative min-h-screen w-full">
  {/* Top Gradient */}
  <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-white to-white z-0"></div>

  {/* Main Content Container */}
  <motion.div
    className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 z-10"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    {/* Background Pattern */}
    <div
      className="absolute inset-0 bg-[url('user/bg/home-bg-1.png')] bg-cover bg-center opacity-10 z-10"
      style={{ backgroundBlendMode: 'soft-light' }}
    />

    {/* Hero Section */}
    <motion.div className="max-w-5xl mx-auto text-center space-y-6 z-20">
      {/* Title */}
      <motion.h1
        className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
        {...fadeIn}
      >
        <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-600 bg-clip-text text-transparent">
          Where Professional
          <br className="hidden sm:block" />
          Events Come Alive
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="font-body text-base md:text-lg text-slate-700 max-w-xl mx-auto leading-relaxed"
        {...fadeIn}
      >
        Your premier platform for discovering, hosting, and participating in
        professional events that drive growth and innovation
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-6 z-20"
        {...fadeIn}
      >
        <Link
          to="/explore"
          className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-2 border-blue-600 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-102 flex items-center justify-center gap-2"
        >
          Explore Events <FaArrowRight className="text-xs" />
        </Link>
        <Link
          to="/about"
          className="w-full sm:w-auto bg-white text-slate-800 border-2 border-blue-600 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-slate-50 hover:border-slate-300"
        >
          Learn More
        </Link>
      </motion.div>
    </motion.div>

    {/* Decorative Elements */}
    <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-white to-transparent pointer-events-none z-0" />
    <div className="absolute top-20 left-20 w-48 h-48 bg-indigo-200/60 rounded-full mix-blend-multiply filter blur-xl animate-blob z-0" />
    <div className="absolute top-20 right-20 w-48 h-48 bg-sky-200/60 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000 z-0" />
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-violet-200/60 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000 z-0" />
  </motion.div>
</div>

      {/* Upcoming Events Preview */}
      <div className="bg-white py-20 px-4">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl text-blue-900 mb-4">Featured Events</h2>
            <p className="font-body text-gray-600 max-w-2xl mx-auto">
              Discover upcoming events that align with your professional goals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((item, index) => (
              <motion.div
                key={index}
                className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-heading text-xl text-blue-900 mb-2">{item.title}</h3>
                  <p className="font-body text-gray-600 mb-4">{item.description}</p>
                  <Link 
                    to="/details" 
                    className="text-blue-800 font-display flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    Learn More <FaArrowRight />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-blue-50 py-20 px-4">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl text-blue-900 mb-4">Why Choose Our Platform</h2>
            <p className="font-body text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions for all your professional event needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center p-8 rounded-xl bg-white shadow-md hover:shadow-xl transition duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="font-heading text-xl text-blue-900 mb-3">{feature.title}</h3>
                <p className="font-body text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stats Section with Graphics */}
      <div className="bg-white py-20 px-4">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-4xl text-blue-900 mb-6">Growing Together</h2>
              <p className="font-body text-gray-600 mb-8">
                Join thousands of professionals who trust our platform for their event needs
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <BsFillCalendarEventFill className="text-3xl text-blue-800" />
                    <span className="font-heading text-3xl text-blue-900">10K+</span>
                  </div>
                  <p className="font-body text-gray-600">Events Hosted</p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <BsGraphUpArrow className="text-3xl text-blue-800" />
                    <span className="font-heading text-3xl text-blue-900">95%</span>
                  </div>
                  <p className="font-body text-gray-600">Success Rate</p>
                </div>
              </div>
            </div>
            <div className="relative">
              {/* Add your statistics graph/chart image here */}
              <div className="h-[400px] w-full bg-white p-4 rounded-xl shadow-lg">
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart
      data={chartData}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis 
        dataKey="month" 
        stroke="#1e3a8a"
        tick={{ fill: '#1e3a8a' }}
      />
      <YAxis 
        stroke="#1e3a8a"
        tick={{ fill: '#1e3a8a' }}
      />
      <Tooltip 
        contentStyle={{ 
          backgroundColor: '#fff',
          border: '1px solid #1e3a8a',
          borderRadius: '8px'
        }}
      />
      <Area 
        type="monotone" 
        dataKey="events" 
        stroke="#1e3a8a" 
        fill="#1e3a8a" 
        fillOpacity={0.2}
      />
    </AreaChart>
  </ResponsiveContainer>
</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div 
        className="bg-blue-900 text-white py-20 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-5xl mb-6">Ready to Host Your Next Event?</h2>
          <p className="font-body text-xl mb-10 opacity-90">
            Transform your event ideas into reality with our comprehensive hosting platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/host" 
              className="inline-block bg-white text-blue-900 font-display px-8 py-4 rounded-lg hover:bg-blue-50 transition duration-300"
            >
              Start Hosting
            </Link>
            <Link 
              to="/contact" 
              className="inline-block bg-transparent border-2 border-white text-white font-display px-8 py-4 rounded-lg hover:bg-blue-800 transition duration-300"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <div className="bg-gray-50 py-20 px-4">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-heading text-3xl text-blue-900 text-center mb-16">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                className="bg-white p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: item * 0.2 }}
              >
                <p className="font-body text-gray-600 mb-4">
                  "The platform made our corporate event management seamless and professional. Highly recommended!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-heading text-blue-900">John Doe</h4>
                    <p className="font-body text-gray-500 text-sm">CEO, Tech Corp</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-white py-20 px-4">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-heading text-3xl text-blue-900 mb-4">Stay Updated</h2>
          <p className="font-body text-gray-600 mb-8">
            Subscribe to our newsletter for the latest events and industry insights
          </p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-900"
            />
            <button
              type="submit"
              className="bg-blue-900 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default Home;