'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import PomodoroTimer from '../components/PomodoroTimer';
import QuizSection from '../components/QuizSection';
import TopicSelector from '../components/TopicSelector';
import ProgressStats from '../components/ProgressStats';

function BreakTimer({ breakLength, onBreakEnd }: { breakLength: number; onBreakEnd: () => void }) {
  const [timeLeft, setTimeLeft] = useState(breakLength);
  useEffect(() => {
    if (timeLeft <= 0) {
      onBreakEnd();
      return;
    }
    const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, onBreakEnd]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Break Time</h2>
      <div className="text-5xl font-bold text-green-600 mb-2">{`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`}</div>
      <p className="text-gray-600 dark:text-gray-400">Relax and recharge! Your next session will start soon.</p>
    </div>
  );
}

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
  const [sessionPhase, setSessionPhase] = useState<'study' | 'quiz' | 'break'>('study');
  const [lastQuizScore, setLastQuizScore] = useState<number | null>(null);
  const [breakLength, setBreakLength] = useState(300); // default 5 min

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

      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ') + '\n';
      }
      setPdfText(text);
      if (!text.trim()) {
        setPdfError('No text could be extracted from this PDF. Please try another file.');
      }
    } catch (err: any) {
      setPdfError('Failed to extract text from PDF.');
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

  function handleQuizComplete(score: number) {
    setLastQuizScore(score);
    let breakSec = 300;
    if (score >= 80) breakSec = 900;
    else if (score >= 60) breakSec = 600;
    setBreakLength(breakSec);
    setSessionPhase('break');
  }

  function handleBreakEnd() {
    setSessionPhase('study');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl mx-auto mt-8 mb-4">
        <div className="relative bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 transition-all duration-300">
          {/* PDF Upload Section */}
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
            Upload PDF to study
          </h2>
          <div className="border-2 border-dashed border-blue-500 rounded-xl p-6 text-center relative hover:bg-blue-50 dark:hover:bg-gray-700 transition">
            <input
              type="file"
              accept=".pdf"
              onChange={handlePdfUpload}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <p className="text-gray-700 dark:text-gray-300">Drag & drop or click to select a PDF</p>
          </div>
          {pdfError && <p className="mt-2 text-red-500 text-sm text-center">{pdfError}</p>}
          {pdfText && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                PDF uploaded: <strong>{pdfName}</strong>
              </p>
              <button
                onClick={handleGenerateQuizFromPdf}
                disabled={generatingQuiz}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {generatingQuiz ? 'Generating Quiz...' : 'Generate Quiz from PDF'}
              </button>
            </div>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {sessionPhase === 'study' && (
              <PomodoroTimer onSessionComplete={() => setSessionPhase('quiz')} />
            )}
            {sessionPhase === 'quiz' && quizReady && (
              <QuizSection topic={selectedTopic} quiz={quiz} onQuizComplete={handleQuizComplete} />
            )}
            {sessionPhase === 'break' && (
              <BreakTimer breakLength={breakLength} onBreakEnd={handleBreakEnd} />
            )}
          </div>
          <div className="space-y-8">
            <TopicSelector selectedTopic={selectedTopic} onTopicChange={setSelectedTopic} />
            <ProgressStats userId="demo-user" />
          </div>
        </div>
      </main>
    </div>
  );
}
