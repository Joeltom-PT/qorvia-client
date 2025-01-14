import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowUpRight 
} from 'react-icons/fi';

interface Slide {
  image: string;
  heading: string;
  content: string;
}

const slides: Slide[] = [
  {
    image: 'user/bg/banner-bg-1.jpg',
    heading: 'Slide 1 Heading',
    content: 'Slide 1 content goes here.'
  },
  {
    image: 'user/bg/banner-bg-2.jpg',
    heading: 'Slide 2 Heading',
    content: 'Slide 2 content goes here.'
  },
  {
    image: 'user/bg/banner-bg-3.jpg',
    heading: 'Slide 2 Heading',
    content: 'Slide 2 content goes here.'
  },
];



const Slider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"
        animate={{
          background: [
            "linear-gradient(to bottom right, rgba(30,64,175,0.2), rgba(147,51,234,0.2))",
            "linear-gradient(to bottom right, rgba(147,51,234,0.2), rgba(30,64,175,0.2))",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <AnimatePresence initial={false}>
        {slides.map((slide, index) => (
          currentSlide === index && (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-900/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-transparent to-blue-900/40" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(17,24,39,0.9)_100%)]" />
              <div className="absolute inset-0 opacity-10 bg-[url('user/bg/slider-bg.svg')] mix-blend-overlay" />
              <div className="relative h-full container mx-auto px-6 lg:px-8 flex flex-col justify-center">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="relative z-10 max-w-3xl"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "5rem" }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="h-1 bg-gradient-to-r from-blue-400 to-blue-500 mb-6"
                  />
                  <motion.h1
                    className="font-heading text-5xl md:text-7xl font-bold text-white mb-8 leading-tight"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    {slide.heading}
                  </motion.h1>
                  <motion.p
                    className="font-body text-xl md:text-2xl text-blue-100/90 mb-10"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    {slide.content}
                  </motion.p>
                  <motion.button
                    className="font-body group px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg
                              transform transition-all duration-300 hover:scale-105 hover:shadow-lg
                              hover:shadow-blue-500/25 active:scale-95 flex items-center gap-2"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  >
                    Learn More
                    <FiArrowUpRight className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>
      <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-white/20 
                    animate-[spin_10s_linear_infinite]" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-white/20 
                    animate-[spin_10s_linear_infinite]" />
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-4">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            className={`group relative w-4 h-4 rounded-full transition-all duration-300 
                      ${currentSlide === index 
                        ? 'bg-gradient-to-r from-blue-400 to-blue-500 shadow-lg shadow-blue-400/50' 
                        : 'bg-white/30 hover:bg-white/50'}`}
            whileHover={{ scale: 1.2 }}
            onClick={() => handleSlideChange(index)}
          >
            {currentSlide === index && (
              <span className="absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-blue-400" />
            )}
          </motion.button>
        ))}
      </div>
      <div className="absolute bottom-8 right-8 text-white/70 font-medium">
        <span className="text-2xl text-blue-400">{currentSlide + 1}</span>
        <span className="mx-2">/</span>
        <span>{slides.length}</span>
      </div>
    </div>
  );
};

export default Slider;