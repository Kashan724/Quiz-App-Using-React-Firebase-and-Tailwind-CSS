import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import app from '../config/firebase';
import { auth } from '../config/firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [results, setResults] = useState([]);
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      const db = getFirestore(app);
      const quizDoc = doc(db, 'quizzes', id);
      const quizSnapshot = await getDoc(quizDoc);
      if (quizSnapshot.exists()) {
        setQuiz(quizSnapshot.data());
        setUserAnswers(quizSnapshot.data().questions.map(() => ''));
      }

      const user = auth.currentUser;
      if (user) {
        const resultsQuery = query(collection(db, 'results'), where('quizId', '==', id), where('userId', '==', user.uid));
        const resultsSnapshot = await getDocs(resultsQuery);
        if (!resultsSnapshot.empty) {
          setIsSubmitted(true);
        }
      }
    };

    fetchQuiz();
  }, [id]);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    let newScore = 0;
    const newResults = quiz.questions.map((question, index) => {
      const correct = question.correctAnswerIndex === parseInt(userAnswers[index], 10);
      if (correct) newScore += 1;
      return { question: question.question, correct };
    });
    setResults(newResults);
    setScore(newScore);

    newResults.forEach((result, index) => {
      if (result.correct) {
        toast.success(`Question ${index + 1}: Correct!`);
      } else {
        toast.error(`Question ${index + 1}: Incorrect!`);
      }
    });

    // Get the current user email
    const user = auth.currentUser;
    if (user) {
      const email = user.email;
      const uid = user.uid;
      // Store the results in Firestore
      const db = getFirestore(app);
      await addDoc(collection(db, 'results'), {
        quizId: id,
        score: newScore,
        userAnswers,
        userEmail: email,
        userId: uid,
        timestamp: new Date(),
      });
    }

    setIsSubmitted(true);
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h1 className="text-2xl mb-4 font-bold text-center">{quiz.title}</h1>
          <p className="text-center text-red-500">You have already submitted this quiz.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl mb-4 font-bold text-center">{quiz.title}</h1>
        {quiz.questions.map((question, index) => (
          <div key={index} className="mb-4">
            <p className="mb-2 text-blue-500"><strong>Question {index + 1}:</strong> {question.question}</p>
            {question.options.map((option, oIndex) => (
              <div key={oIndex} className="mb-2">
                <label className="flex items-center text-gray-700">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={oIndex}
                    checked={userAnswers[index] === oIndex.toString()}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    className="mr-2"
                  />
                  <span className="ml-2">{option}</span>
                </label>
              </div>
            ))}
          </div>
        ))}
        <button
          onClick={handleSubmit}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit Answers
        </button>
        {results.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-xl">Your Score: {score}</p>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default TakeQuiz;
