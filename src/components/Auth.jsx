import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Failed to sign in');
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Failed to sign in with Google');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl flex">
        {/* Left Column - Image */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <img
            src="https://img.freepik.com/free-photo/still-life-device-table_23-2150994337.jpg"
            alt="Authentication Image"
            className="w-full max-h-full object-cover"
          />
        </div>

        {/* Right Column - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-4xl font-bold mb-8 text-center text-blue-500">Welcome Back!</h1>
          <input
            type="email"
            placeholder="Email"
            className="mb-6 p-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="mb-6 p-4 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={signIn}
            className="mb-6 w-full p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none text-lg"
          >
            Sign In
          </button>
          <button
            onClick={signInWithGoogle}
            className="mb-4 w-full p-4 flex items-center justify-center bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none text-lg"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google logo"
              className="w-6 h-6 mr-2"
            />
            Sign In with Google
          </button>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={true} />
    </div>
  );
};

export default Auth;
