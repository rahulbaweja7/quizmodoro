'use client';

import { useState, useEffect } from 'react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizSectionProps {
  topic: string;
}

export default function QuizSection({ topic }: QuizSectionProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Mock questions for demonstration - in real app, these would come from OpenAI API
  const mockQuestions: Record<string, Question[]> = {
    general: [
      {
        id: '1',
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 2,
        explanation: 'Paris is the capital and largest city of France.'
      },
      {
        id: '2',
        question: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 1,
        explanation: 'Mars is called the Red Planet due to its reddish appearance.'
      },
      {
        id: '3',
        question: 'What is the largest ocean on Earth?',
        options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
        correctAnswer: 3,
        explanation: 'The Pacific Ocean is the largest and deepest ocean on Earth.'
      }
    ],
    science: [
      {
        id: '1',
        question: 'What is the chemical symbol for gold?',
        options: ['Ag', 'Au', 'Fe', 'Cu'],
        correctAnswer: 1,
        explanation: 'Au comes from the Latin word "aurum" meaning gold.'
      },
      {
        id: '2',
        question: 'What is the hardest natural substance on Earth?',
        options: ['Steel', 'Granite', 'Diamond', 'Quartz'],
        correctAnswer: 2,
        explanation: 'Diamond is the hardest known natural material.'
      }
    ],
    history: [
      {
        id: '1',
        question: 'In which year did World War II end?',
        options: ['1943', '1944', '1945', '1946'],
        correctAnswer: 2,
        explanation: 'World War II ended in 1945 with the surrender of Germany and Japan.'
      },
      {
        id: '2',
        question: 'Who was the first President of the United States?',
        options: ['John Adams', 'Thomas Jefferson', 'George Washington', 'Benjamin Franklin'],
        correctAnswer: 2,
        explanation: 'George Washington served as the first President from 1789 to 1797.'
      }
    ],
    technology: [
      {
        id: '1',
        question: 'What does CPU stand for?',
        options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Computer Processing Unit'],
        correctAnswer: 0,
        explanation: 'CPU stands for Central Processing Unit, the main processor of a computer.'
      },
      {
        id: '2',
        question: 'Which company developed the iPhone?',
        options: ['Samsung', 'Apple', 'Google', 'Microsoft'],
        correctAnswer: 1,
        explanation: 'Apple Inc. developed and released the first iPhone in 2007.'
      }
    ]
  };

  useEffect(() => {
    generateQuiz();
  }, [topic]);

  const generateQuiz = async () => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const topicQuestions = mockQuestions[topic] || mockQuestions.general;
    setQuestions(topicQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
    setLoading(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setIsAnswered(true);
    if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    generateQuiz();
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Generating quiz questions...</p>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Quiz Complete!
          </h2>
          <div className="mb-8">
            <div className="text-6xl font-bold text-indigo-600 mb-2">
              {percentage}%
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              You got {score} out of {questions.length} questions correct
            </p>
          </div>
          <div className="mb-8">
            {percentage >= 80 && (
              <div className="text-green-600 font-semibold mb-2">🎉 Excellent work!</div>
            )}
            {percentage >= 60 && percentage < 80 && (
              <div className="text-yellow-600 font-semibold mb-2">👍 Good job!</div>
            )}
            {percentage < 60 && (
              <div className="text-red-600 font-semibold mb-2">💪 Keep practicing!</div>
            )}
          </div>
          <button
            onClick={handleRestartQuiz}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">No questions available for this topic.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quiz: {topic.charAt(0).toUpperCase() + topic.slice(1)}
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {currentQuestion.question}
        </h3>
        
        {/* Answer Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedAnswer === index
                  ? isAnswered
                    ? index === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              } ${isAnswered ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedAnswer === index
                    ? isAnswered
                      ? index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-red-500 bg-red-500 text-white'
                      : 'border-indigo-500 bg-indigo-500 text-white'
                    : 'border-gray-300 dark:border-gray-500'
                }`}>
                  {selectedAnswer === index && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-gray-900 dark:text-white">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Explanation */}
      {isAnswered && currentQuestion.explanation && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Explanation:</h4>
          <p className="text-blue-800 dark:text-blue-200">{currentQuestion.explanation}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Score: {score}/{currentQuestionIndex + 1}
        </div>
        
        <div className="flex gap-3">
          {!isAnswered ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                selectedAnswer === null
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 