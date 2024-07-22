import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../config/firebase';
import app from '../config/firebase';

const UserQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserQuizzes = async () => {
      const db = getFirestore(app);
      const user = auth.currentUser;
      if (user) {
        // Fetch quizzes created by the current user
        const quizzesQuery = query(collection(db, 'quizzes'), where('creatorEmail', '==', user.email));
        const quizzesSnapshot = await getDocs(quizzesQuery);
        const userQuizzes = quizzesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setQuizzes(userQuizzes);

        // Fetch submissions for each quiz
        const newSubmissions = {};
        for (const quiz of userQuizzes) {
          const submissionsQuery = query(collection(db, 'results'), where('quizId', '==', quiz.id));
          const submissionsSnapshot = await getDocs(submissionsQuery);
          newSubmissions[quiz.id] = submissionsSnapshot.docs.map(doc => doc.data());
        }

        setSubmissions(newSubmissions);
      }
      setLoading(false);
    };

    fetchUserQuizzes();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl mb-4 font-bold">Your Quizzes</h1>
      {quizzes.length === 0 ? (
        <p>You have not created any quizzes yet.</p>
      ) : (
        quizzes.map(quiz => (
          <div key={quiz.id} className="mb-4 p-4 border rounded bg-white w-full max-w-lg">
            <h2 className="text-xl font-semibold">{quiz.title}</h2>
            <h3 className="text-lg font-medium mt-2">Submissions:</h3>
            {submissions[quiz.id].length === 0 ? (
              <p>No submissions yet.</p>
            ) : (
              <ul className="mt-2">
                {submissions[quiz.id].map((submission, index) => (
                  <li key={index} className="mb-2 p-2 border rounded">
                    <p><strong>Email:</strong> {submission.userEmail}</p>
                    <p><strong>Score:</strong> {submission.score}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default UserQuizzes;
