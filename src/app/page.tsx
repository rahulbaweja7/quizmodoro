'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import PomodoroTimer from '../components/PomodoroTimer';
import QuizSection from '../components/QuizSection';
import TopicSelector from '../components/TopicSelector';
import ProgressStats from '../components/ProgressStats';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

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
  const [debugInfo, setDebugInfo] = useState<string>('');

  // PDF upload and text extraction
  const handlePdfUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    setPdfError('');
    setPdfText('');
    setPdfName('');
    setQuiz([]);
    setQuizReady(false);
    setShowQuiz(false);
    setDebugInfo('');
    const file = e.target.files?.[0];
    if (!file) {
      setDebugInfo('No file selected.');
      return;
    }
    setDebugInfo('File selected: ' + file.name);
    if (file.type !== 'application/pdf') {
      setPdfError('Please upload a valid PDF file.');
      setDebugInfo('File type is not PDF: ' + file.type);
      return;
    }
    setPdfName(file.name);
    try {
      if (typeof window === 'undefined') {
        setPdfError('PDF extraction only works in the browser.');
        setDebugInfo('Not running in browser environment.');
        return;
      }
      setDebugInfo('Reading file as arrayBuffer...');
      const arrayBuffer = await file.arrayBuffer();
      setDebugInfo('arrayBuffer loaded. Loading PDF...');
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setDebugInfo('PDF loaded. Number of pages: ' + pdf.numPages);
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        setDebugInfo(prev => prev + `\nExtracting text from page ${i}...`);
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ') + '\n';
      }
      setPdfText(text);
      setDebugInfo(prev => prev + '\nExtraction complete. Text length: ' + text.length);
      console.log('Extracted PDF text:', text);
      if (!text.trim()) {
        setPdfError('No text could be extracted from this PDF. Please try another file.');
        setDebugInfo(prev => prev + '\nNo text extracted.');
      }
    } catch (err: any) {
      setPdfError('Failed to extract text from PDF.');
      setDebugInfo(prev => prev + '\nError: ' + (err?.message || err));
      console.error('PDF extraction error:', err);
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

      <div className="max-w-2xl mx-auto mt-8 mb-4">
        <div className="relative bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 transition-all duration-300">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-center w-full">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-200 to-indigo-400 dark:from-indigo-700 dark:to-indigo-900 shadow-lg mb-4">
                <svg className="w-8 h-8 text-indigo-700 dark:text-indigo-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              </div>
              <label className="block mb-2 font-bold text-2xl text-gray-900 dark:text-white tracking-tight">Upload PDF to study</label>
              <label htmlFor="pdf-upload" className="w-full cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-indigo-400 dark:border-indigo-600 rounded-xl py-8 px-4 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all duration-200 mb-2">
                <span className="text-indigo-700 dark:text-indigo-200 font-medium mb-2">Drag & drop or click to select a PDF</span>
                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
              </label>
              {pdfName && <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Selected: <span className="font-semibold">{pdfName}</span></div>}
              {debugInfo && <pre className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-900 rounded p-2 mt-2 overflow-x-auto max-h-32">{debugInfo}</pre>}
              {pdfError && <div className="text-red-600 text-sm mt-2 animate-pulse-glow">{pdfError}</div>}
              {pdfText && !quizReady && (
                <button
                  onClick={handleGenerateQuizFromPdf}
                  disabled={generatingQuiz}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-200 mb-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 17l-4 4m0 0l-4-4m4 4V3" /></svg>
                  {generatingQuiz ? 'Generating Quiz...' : 'Generate Quiz from PDF'}
                </button>
              )}
              {quizReady && (
                <button
                  onClick={() => setShowQuiz(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-200 mb-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg>
                  Take Quiz
                </button>
              )}
            </div>
          </div>
        </div>
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
