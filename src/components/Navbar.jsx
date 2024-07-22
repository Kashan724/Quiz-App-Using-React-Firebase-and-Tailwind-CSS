import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const navigate = useNavigate();

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
    <nav className="fixed top-0 left-0 w-full p-4 bg-gray-800 text-white flex justify-between items-center z-10">
      <div className="text-lg flex justify-center items-center w-full">
        <Link to="/" className="hover:text-gray-400 mx-4 text-white">Home</Link>
        <Link to="/create-quiz" className="hover:text-gray-400 mx-4 text-white">Create Quiz</Link>
        <Link to="/quizzes" className="hover:text-gray-400 mx-4 text-white">Quizzes</Link>
        <Link to="/user-quizzes" className="hover:text-gray-400 mx-4 text-white">Your Quizzes</Link>
      </div>
      <div className="hover:text-gray-400 text-lg text-white cursor-pointer" onClick={logout}>
      Logout
    </div>
    </nav>
  );
};

export default Navbar;

