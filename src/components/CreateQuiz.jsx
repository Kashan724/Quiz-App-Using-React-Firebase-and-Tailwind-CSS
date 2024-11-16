import React, { useState } from 'react';
import { db, auth } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import Joyride from 'react-joyride';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const MODEL_NAME = 'gemini-1.0-pro';
const API_KEY = 'AIzaSyDZGWUpNM0b30xtiAn7XrAIvfoV92OL1i4'; // Replace with your actual API key

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]);
  const [generateTitle, setGenerateTitle] = useState('');
  const [numQuestions, setNumQuestions] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false); // Loading indicator state
  const [showPopup, setShowPopup] = useState(false); // Popup for quiz submission confirmation
  const [joyrideState, setJoyrideState] = useState({ run: true }); // Automatically start the tour

  // Tour steps
  const steps = [
    {
      target: '#quiz-title',
      content: 'Enter a title for your quiz here.',
    },
    {
      target: '#question-input',
      content: 'This is where you add your questions and answer options.',
    },
    {
      target: '#generate-questions-section',
      content: 'You can generate AI-based questions here.',
    },
    {
      target: '#add-question-button',
      content: 'Click here to add more questions.',
    },
    {
      target: '#create-quiz-button',
      content: 'Once ready, click here to create your quiz!',
    },
  ];

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]);
  };

  const handleCreateQuiz = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, 'quizzes'), {
          title,
          questions,
          creatorEmail: user.email,
        });
        setTitle('');
        setQuestions([{ question: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]);
        setShowPopup(true); // Show popup on successful quiz submission
        setTimeout(() => setShowPopup(false), 3000); // Auto-hide popup after 3 seconds
      } else {
        console.error('No user is logged in');
      }
    } catch (e) {
      console.error('Error adding document:', e);
    }
  };

  const handleGenerateQuestions = async () => {
    setIsGenerating(true); // Start loading
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const generationConfig = { temperature: 0.9, topK: 1, topP: 1, maxOutputTokens: 2048 };
    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];
    const chat = model.startChat({ generationConfig, safetySettings, history: [] });
    try {
      const result = await chat.sendMessage(`Generate ${numQuestions} multiple-choice quiz questions about ${generateTitle}. Each question should have 4 options, and the correct answer should be indicated with an asterisk (*).`);
      const responseText = await result.response.text();
      const parsedQuestions = parseResponseText(responseText);
      setQuestions(parsedQuestions);
      setTitle(generateTitle);
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setIsGenerating(false); // Stop loading
    }
  };

  const parseResponseText = (text) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const questions = [];
    let currentQuestion = '';
    let currentOptions = [];
    let correctAnswerIndex = -1;
    lines.forEach(line => {
      if (line.startsWith('**Question')) {
        if (currentQuestion) {
          questions.push({ question: currentQuestion.trim(), options: currentOptions, correctAnswerIndex });
        }
        currentQuestion = '';
        currentOptions = [];
        correctAnswerIndex = -1;
      } else if (line.startsWith('(')) {
        const match = line.match(/\((\w)\)\s*(.*)/);
        if (match) {
          const optionText = match[2].replace('*', '').trim();
          if (match[2].includes('*')) {
            correctAnswerIndex = currentOptions.length;
          }
          currentOptions.push(optionText);
        }
      } else {
        currentQuestion += line + ' ';
      }
    });
    if (currentQuestion) {
      questions.push({ question: currentQuestion.trim(), options: currentOptions, correctAnswerIndex });
    }
    return questions;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Joyride
        steps={steps}
        run={joyrideState.run}
        continuous
        showSkipButton
        showProgress
        disableOverlayClose // Prevent clicking outside to close the tour
        spotlightPadding={10} // Highlight padding for target elements
        callback={(data) => {
          if (data.status === 'finished' || data.status === 'skipped') {
            setJoyrideState({ ...joyrideState, run: false });
          }
        }}
      />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl mb-4 font-bold text-center">Create a New Quiz</h1>
        <input
          type="text"
          id="quiz-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Quiz Title"
          className="mb-4 p-2 border rounded w-full"
        />
        {questions.map((q, qIndex) => (
          <div key={qIndex} id="question-input" className="mb-4">
            <input
              type="text"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
              placeholder="Question"
              className="mb-2 p-2 border rounded w-full"
            />
            {q.options.map((option, oIndex) => (
              <input
                key={oIndex}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                placeholder={`Option ${oIndex + 1}`}
                className="mb-2 p-2 border rounded w-full"
              />
            ))}
          </div>
        ))}
        <button id="add-question-button" onClick={handleAddQuestion} className="mb-4 p-2 bg-green-500 text-white rounded w-full">
          Add Question
        </button>
        <button id="create-quiz-button" onClick={handleCreateQuiz} className="p-2 bg-blue-500 text-white rounded w-full">
          Create Quiz
        </button>
        
        <div id="generate-questions-section" className="mt-8">
          <h2 className="text-xl mb-4 font-bold text-center">Generate Questions</h2>
          <input
            type="text"
            value={generateTitle}
            onChange={(e) => setGenerateTitle(e.target.value)}
            placeholder="Enter title for AI-generated questions"
            className="mb-4 p-2 border rounded w-full"
          />
          <input
            type="number"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            placeholder="Number of questions"
            className="mb-4 p-2 border rounded w-full"
          />
          <button onClick={handleGenerateQuestions} className="p-2 bg-purple-500 text-white rounded w-full">
            {isGenerating ? 'Generating...' : 'Generate Questions'}
          </button>
        </div>
      </div>

      {/* Popup modal for quiz submission confirmation */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold text-green-500">Quiz Submitted!</h2>
            <p>Your quiz has been successfully created.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQuiz;
