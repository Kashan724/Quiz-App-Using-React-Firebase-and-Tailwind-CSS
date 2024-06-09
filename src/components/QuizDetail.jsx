import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../config/firebase';

const QuizDetail = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const db = getFirestore(app);
      const quizDoc = doc(db, 'quizzes', id);
      const quizSnapshot = await getDoc(quizDoc);
      if (quizSnapshot.exists()) {
        setQuiz({ id: quizSnapshot.id, ...quizSnapshot.data() });
      } else {
        console.log('No such document!');
      }
    };

    fetchQuiz();
  }, [id]);

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl mb-4 font-bold">{quiz.title}</h1>
      <div className="w-full max-w-lg">
        {quiz.questions.map((q, index) => (
          <div key={index} className="mb-4 p-4 border rounded bg-white">
            <h2 className="text-xl mb-2 font-semibold">Question {index + 1}</h2>
            <p className="mb-2"><strong>Question:</strong> {q.question}</p>
            <p><strong>Answer:</strong> {q.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizDetail;
