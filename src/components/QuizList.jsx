import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from '../config/firebase';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const db = getFirestore(app);
      const quizzesCollection = collection(db, 'quizzes');
      const snapshot = await getDocs(quizzesCollection);
      const quizzesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuizzes(quizzesList);
    };

    fetchQuizzes();
  }, []);

  const handleQuizClick = (id) => {
    navigate(`quizzes/take-quiz/${id}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl mb-4 font-bold text-center">Available Quizzes</h1>
        <ul>
          {quizzes.map(quiz => (
            <li key={quiz.id} className="mb-4 p-4 border rounded">
              <h2 className="text-xl text-blue-600">
                {quiz.title}
              </h2>
              <button
                onClick={() => handleQuizClick(quiz.id)}
                className="mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Take Quiz
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuizList;

