import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../config/firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TakeQuiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      const db = getFirestore(app);
      const quizDoc = doc(db, 'quizzes', id);
      const quizSnapshot = await getDoc(quizDoc);
      if (quizSnapshot.exists()) {
        setQuiz(quizSnapshot.data());
        setUserAnswers(quizSnapshot.data().questions.map(() => ''));
      }
    };

    fetchQuiz();
  }, [id]);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const newResults = quiz.questions.map((question, index) => ({
      question: question.question,
      correct: question.answer === userAnswers[index],
    }));
    setResults(newResults);

    newResults.forEach((result, index) => {
      if (result.correct) {
        toast.success(`Question ${index + 1}: Correct!`);
      } else {
        toast.error(`Question ${index + 1}: Incorrect!`);
      }
    });
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl mb-4 font-bold text-center">{quiz.title}</h1>
        {quiz.questions.map((question, index) => (
          <div key={index} className="mb-4">
            <p className="mb-2">{question.question}</p>
            <input
              type="text"
              value={userAnswers[index]}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              className={`p-2 border rounded w-full ${results[index]?.correct ? 'bg-green-200' : ''}`}
            />
          </div>
        ))}
        <button
          onClick={handleSubmit}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit Answers
        </button>
        <ToastContainer />
      </div>
    </div>
  );
};

export default TakeQuiz;
