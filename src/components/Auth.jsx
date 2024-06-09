import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signed in");
    } catch (err) {
      console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Signed in with Google");
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      alert("Signed out");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <input
          type="email"
          placeholder="Email"
          className="mb-4 p-2 w-full border rounded"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 p-2 w-full border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={signIn}
          className="mb-4 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sign In
        </button>
        <button
          onClick={signInWithGoogle}
          className="mb-4 w-full p-2 flex items-center justify-center bg-red-500 text-white rounded hover:bg-red-600"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google logo"
            className="w-5 h-5 mr-2"
          />
          Sign In with Google
        </button>
        <button
          onClick={logout}
          className="w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Auth;
