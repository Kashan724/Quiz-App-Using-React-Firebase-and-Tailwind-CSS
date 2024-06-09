import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import CreateQuiz from './components/CreateQuiz';
import QuizList from './components/QuizList';
import Navbar from './components/Navbar';
import QuizDetail from './components/QuizDetail';
import TakeQuiz from './components/TakeQuiz';

const App = () => (
  <Router>
    <Navbar />
    <div className="pt-20"> {/* Adjusted padding to match the navbar height */}
      <Routes>
        <Route path="/" element={<QuizList />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/quizzes" element={<QuizList />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/quizzes/:id" element={<QuizDetail />} />
        <Route path="/quizzes/take-quiz/:id" element={<TakeQuiz />} />
      </Routes>
    </div>
  </Router>
);

export default App;
