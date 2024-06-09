import React, { useState } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ question: '', answer: '' }]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', answer: '' }]);
  };

  const handleCreateQuiz = async () => {
    try {
      const docRef = await addDoc(collection(db, 'quizzes'), {
        title,
        questions
      });
      console.log('Quiz created with ID:', docRef.id);
      // Clear the form after successful submission
      setTitle('');
      setQuestions([{ question: '', answer: '' }]);
    } catch (e) {
      console.error('Error adding document:', e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl mb-4 font-bold text-center">Create a New Quiz</h1>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Quiz Title"
          className="mb-4 p-2 border rounded w-full"
        />
        {questions.map((q, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              value={q.question}
              onChange={(e) => {
                const newQuestions = [...questions];
                newQuestions[index].question = e.target.value;
                setQuestions(newQuestions);
              }}
              placeholder="Question"
              className="mb-2 p-2 border rounded w-full"
            />
            <input
              type="text"
              value={q.answer}
              onChange={(e) => {
                const newQuestions = [...questions];
                newQuestions[index].answer = e.target.value;
                setQuestions(newQuestions);
              }}
              placeholder="Answer"
              className="p-2 border rounded w-full"
            />
          </div>
        ))}
        <button onClick={handleAddQuestion} className="mb-4 p-2 bg-green-500 text-white rounded w-full">
          Add Question
        </button>
        <button onClick={handleCreateQuiz} className="p-2 bg-blue-500 text-white rounded w-full">
          Create Quiz
        </button>
      </div>
    </div>
  );
};

export default CreateQuiz;

