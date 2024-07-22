import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
//import './Layout.css'; // Import the CSS file

const Layout = ({ children }) => {
  const location = useLocation();
  const excludeNavbarPaths = ['/auth'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Conditionally render Navbar */}
      {!excludeNavbarPaths.includes(location.pathname) && <Navbar />}
      {children}
    </div>
  );
};

export default Layout;