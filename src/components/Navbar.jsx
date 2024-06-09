import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="fixed top-0 left-0 w-full p-4 bg-gray-800 text-white flex justify-center z-10">
    <div className="flex space-x-8 text-lg">
      <Link to="/" className="hover:text-gray-400">Home</Link>
      <Link to="/create-quiz" className="hover:text-gray-400">Create Quiz</Link>
      <Link to="/quizzes" className="hover:text-gray-400">Quizzes</Link>
      <Link to="/auth" className="hover:text-gray-400">Login</Link>
    </div>
  </nav>
);

export default Navbar;

