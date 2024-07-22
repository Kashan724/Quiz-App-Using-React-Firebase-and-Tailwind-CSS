import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import app from '../config/firebase';
import { auth } from '../config/firebase';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [submittedQuizzes, setSubmittedQuizzes] = useState([]);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl mb-4 font-bold text-center">Available Quizzes</h1>
        <ul>
          {quizzes.map(quiz => (
            <li key={quiz.id} className="mb-4 p-4 border rounded">
              <h2 className="text-xl text-blue-600">{quiz.title}</h2>
              {submittedQuizzes.includes(quiz.id) ? (
                <p className="mt-2 text-red-500">You have already submitted this quiz.</p>
              ) : (
                <button
                  onClick={() => handleQuizClick(quiz.id)}
                  className="mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Take Quiz
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuizList;

