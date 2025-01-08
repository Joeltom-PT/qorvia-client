import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-100 text-gray-600 mt-5 py-8 px-4 md:px-8 lg:px-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <img src="/primary_logo.svg" alt="Logo" className='mb-2' />
            <p className="text-sm">
              Qorvia is your all-in-one platform for seamless online and offline event booking and hosting. From small gatherings to large-scale events, we make it easy to find, book, and manage your perfect venue and services.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">SERVICES</h3>
            <ul className="text-sm space-y-1">
              <li>Book Events</li>
              <li>Become a hoster</li>
              <li>Pricing</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">SUPPORT</h3>
            <ul className="text-sm space-y-1">
              <li>Chat</li>
              <li>Email Support</li>
              <li>Help</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">RESOURCES</h3>
            <ul className="text-sm space-y-1">
              <li>Blog</li>
              <li>FAQs</li>
              <li>Why feature vote?</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">COMPANY</h3>
            <ul className="text-sm space-y-1">
              <li>About Us</li>
              <li>Privacy</li>
              <li>Terms</li>
              <li>Status</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-300 pt-4 flex flex-col sm:flex-row justify-between items-center text-sm">
          <div className="mb-2 sm:mb-0">
            Thanks for visit
          </div>
          <div>
            Copyright © {new Date().getFullYear()} Qorvia
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;