'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import PomodoroTimer from '../components/PomodoroTimer';
import QuizSection from '../components/QuizSection';
import TopicSelector from '../components/TopicSelector';
import ProgressStats from '../components/ProgressStats';
import * as pdfjsLib from 'pdfjs-dist';

// Set workerSrc to CDN version for pdfjs-dist v3+
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function Home() {
  const [currentMode, setCurrentMode] = useState<'timer' | 'quiz'>('timer');
  const [selectedTopic, setSelectedTopic] = useState<string>('general');
  const [pdfText, setPdfText] = useState('');
  const [pdfName, setPdfName] = useState('');
  const [pdfError, setPdfError] = useState('');
  const [quiz, setQuiz] = useState<any[]>([]);
  const [quizReady, setQuizReady] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  // PDF upload and text extraction
  const handlePdfUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    setPdfError('');
    setPdfText('');
    setPdfName('');
    setQuiz([]);
    setQuizReady(false);
    setShowQuiz(false);
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setPdfError('Please upload a valid PDF file.');
      return;
    }
    setPdfName(file.name);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ') + '\n';
      }
      setPdfText(text);
      console.log('Extracted PDF text:', text);
      if (!text.trim()) {
        setPdfError('No text could be extracted from this PDF. Please try another file.');
      }
    } catch (err) {
      setPdfError('Failed to extract text from PDF.');
    }
  };

  const handleGenerateQuizFromPdf = async () => {
    setGeneratingQuiz(true);
    setPdfError('');
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
      if (!apiKey) {
        setPdfError('OpenAI API key is required.');
        setGeneratingQuiz(false);
        return;
      }
      const prompt = `Generate 5 multiple-choice quiz questions (with 4 options each, one correct answer, and a short explanation) based on the following text. Respond in JSON array format with fields: id, question, options, correctAnswer (index), explanation.\n\nText:\n${pdfText.slice(0, 4000)}`;
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1200,
          temperature: 0.7
        })
      });
      const data = await response.json();
      let quizArr: any[] = [];
      try {
        const content = data.choices?.[0]?.message?.content;
        quizArr = JSON.parse(content);
      } catch (e) {
        setPdfError('Failed to parse quiz from OpenAI response.');
        setGeneratingQuiz(false);
        return;
      }
      setQuiz(quizArr);
      setQuizReady(true);
    } catch (err) {
      console.error(err);
      setPdfError('Failed to generate quiz from OpenAI.');
    }
    setGeneratingQuiz(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Quizmodoro
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img
                  src="/default-avatar.svg"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Demo User
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto mt-8 mb-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <label className="block mb-2 font-semibold text-gray-900 dark:text-white">Upload PDF to study:</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handlePdfUpload}
          className="mb-2"
        />
        {pdfName && <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Selected: {pdfName}</div>}
        {pdfText && !quizReady && (
          <button
            onClick={handleGenerateQuizFromPdf}
            disabled={generatingQuiz}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 mb-2"
          >
            {generatingQuiz ? 'Generating Quiz...' : 'Generate Quiz from PDF'}
          </button>
        )}
        {quizReady && (
          <button
            onClick={() => setShowQuiz(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 mb-2"
          >
            Take Quiz
          </button>
        )}
        {pdfError && <div className="text-red-600 text-sm mt-2">{pdfError}</div>}
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => setCurrentMode('timer')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    currentMode === 'timer'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Pomodoro Timer
                </button>
                <button
                  onClick={() => setCurrentMode('quiz')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    currentMode === 'quiz'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Quiz Mode
                </button>
              </div>
            </div>

            {currentMode === 'timer' ? (
              <PomodoroTimer />
            ) : (
              showQuiz && quizReady ? (
                <QuizSection topic={selectedTopic} quiz={quiz} />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center text-gray-500 dark:text-gray-400">
                  Upload a PDF and generate a quiz to get started.
                </div>
              )
            )}
          </div>

          <div className="space-y-8">
            <TopicSelector
              selectedTopic={selectedTopic}
              onTopicChange={setSelectedTopic}
            />
            <ProgressStats userId="demo-user" />
          </div>
        </div>
      </main>
    </div>
  );
}
