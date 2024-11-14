import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import app, { auth } from '../config/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import ReactJoyride from 'react-joyride';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [submittedQuizzes, setSubmittedQuizzes] = useState([]);
  const [run, setRun] = useState(true); // Initialize run to true to auto-start the tour
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const db = getFirestore(app);
      const quizzesCollection = collection(db, 'quizzes');
      const snapshot = await getDocs(quizzesCollection);
      const quizzesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuizzes(quizzesList);

      const user = auth.currentUser;
      if (user) {
        const resultsQuery = query(collection(db, 'results'), where('userId', '==', user.uid));
        const resultsSnapshot = await getDocs(resultsQuery);
        const resultsList = resultsSnapshot.docs.map(doc => doc.data().quizId);
        setSubmittedQuizzes(resultsList);
      }
    };

    fetchQuizzes();
  }, []);

  const handleQuizClick = (id) => {
    navigate(`/take-quiz/${id}`);
  };

  const steps = [
    {
      target: "h1", // This should be a valid selector for your heading element
      content: "Welcome! Here you can view all available quizzes.",
      disableBeacon: true, // Disable the beacon for auto-started tours
    },
    {
      target: ".grid", // Selector for the quiz grid container
      content: "Browse through the quizzes available for you to take.",
    },
    {
      target: ".bg-green-500", // Selector for the Take Quiz button
      content: "Click here to start a quiz.",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-12">
      <ReactJoyride
        steps={steps}
        continuous
        showSkipButton
        run={run} // Set to true to start the tour automatically
        styles={{
          options: {
            arrowColor: "#e3f2fd",
            backgroundColor: "#e3f2fd",
            primaryColor: "#1976d2",
            textColor: "#0d47a1",
            zIndex: 1000,
          },
        }}
        callback={(data) => {
          const { status } = data;
          if (status === "finished" || status === "skipped") {
            setRun(false); // Stop running the tour after it completes or is skipped
          }
        }}
      />
      
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-7xl">
        
        {/* Header with pulsing animation */}
        <motion.h1
          className="text-4xl mb-10 font-bold text-center text-blue-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          whileHover={{
            scale: 1.1,
            color: "#1d4ed8",
          }}
        >
          Available Quizzes
        </motion.h1>

        {/* Loading Spinner */}
        {quizzes.length === 0 ? (
          <motion.div
            className="flex items-center justify-center text-blue-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
          >
            Loading Quizzes...
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
                hidden: {},
              }}
            >
              {quizzes.map(quiz => (
                <motion.div
                  key={quiz.id}
                  className={`p-6 border rounded-lg shadow-md ${submittedQuizzes.includes(quiz.id) ? 'bg-gray-200' : 'bg-gray-50'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: '#f0f4f8',
                    filter: submittedQuizzes.includes(quiz.id) ? 'brightness(0.9)' : 'brightness(1.1)',
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <motion.h2
                    className="text-xl font-semibold text-blue-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{
                      scale: 1.05,
                      color: '#2563eb',
                    }}
                  >
                    {quiz.title}
                  </motion.h2>
                  {submittedQuizzes.includes(quiz.id) ? (
                    <motion.p
                      className="mt-2 text-red-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      You have already submitted this quiz.
                    </motion.p>
                  ) : (
                    <motion.button
                      onClick={() => handleQuizClick(quiz.id)}
                      className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600"
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: '#34d399',
                        rotate: 2,
                      }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      Take Quiz
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default QuizList;
