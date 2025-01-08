import React, { useState, useEffect } from 'react';
import './Slider.css';
import { TfiAngleDoubleDown } from 'react-icons/tfi';

interface Slide {
  image: string;
  heading: string;
  slogan: string;
}

const slides: Slide[] = [
  {
    image: '/user/bg/banner-bg-1.jpg',
    heading: 'Big Conference & Work Shop',
    slogan: 'Join us for an immersive experience',
  },
  {
    image: '/user/bg/banner-bg-2.jpg',
    heading: 'Another Event',
    slogan: 'Don’t miss out on this event',
  },
  {
    image: '/user/bg/banner-bg-3.jpg',
    heading: 'Another Event',
    slogan: 'Don’t miss out on this event',
  },
  {
    image: 'https://www.eventbookings.com/wp-content/uploads/2018/03/event-ideas-for-party-eventbookings.jpg',
    heading: 'Another Event',
    slogan: 'Don’t miss out on this event',
  },
];

const Slider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-blue-900">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 slider-background ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(90deg, rgba(0,3,56,1) 0%, rgba(0,6,116,0.4908088235294118) 50%, rgba(0,3,56,1) 100%)',
            }}
            className="slide-content flex flex-col items-center justify-center h-full text-white bg-opacity-70 p-6"
          >
            <div className="flex-grow flex flex-col items-center justify-center text-center">
              <h2 className="text-4xl font-bold mb-4">{slide.heading}</h2>
              <p className="text-lg mb-4">{slide.slogan}</p>
            </div>
            <div className="w-full flex items-center justify-center mb-4">
              <TfiAngleDoubleDown size={50} className={`icon-animation transition-opacity duration-1000 ${index === currentSlide ? 'mt-4' : 'mt-7'}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Slider;
