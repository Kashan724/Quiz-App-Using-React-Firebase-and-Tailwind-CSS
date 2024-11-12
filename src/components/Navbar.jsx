import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (err) {
      console.error(err);
      toast.error('Failed to sign out');
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 text-white p-4 z-20">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-500">
          Quiz App
        </Link>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className="w-8 h-8 text-gray-300 hover:text-gray-400 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Links for larger screens */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-gray-400">Home</Link>
          <Link to="/create-quiz" className="hover:text-gray-400">Create Quiz</Link>
          <Link to="/quizzes" className="hover:text-gray-400">Quizzes</Link>
          <Link to="/user-quizzes" className="hover:text-gray-400">Your Quizzes</Link>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Fullscreen Menu for Mobile */}
      <div
        className={`${
          isOpen ? 'flex' : 'hidden'
        } md:hidden fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center space-y-6 text-lg transition-opacity duration-300`}
      >
        <Link to="/" className="text-white hover:text-gray-400" onClick={() => setIsOpen(false)}>Home</Link>
        <Link to="/create-quiz" className="text-white hover:text-gray-400" onClick={() => setIsOpen(false)}>Create Quiz</Link>
        <Link to="/quizzes" className="text-white hover:text-gray-400" onClick={() => setIsOpen(false)}>Quizzes</Link>
        <Link to="/user-quizzes" className="text-white hover:text-gray-400" onClick={() => setIsOpen(false)}>Your Quizzes</Link>
        <button
          onClick={() => { logout(); setIsOpen(false); }}
          className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
