'use client';

import { useState } from 'react';
import PomodoroTimer from '@/components/PomodoroTimer';
import QuizSection from '@/components/QuizSection';
import TopicSelector from '@/components/TopicSelector';
import ProgressStats from '@/components/ProgressStats';

export default function Home() {
  const [currentMode, setCurrentMode] = useState<'timer' | 'quiz'>('timer');
  const [selectedTopic, setSelectedTopic] = useState<string>('general');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Timer and Quiz */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mode Toggle */}
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

            {/* Timer or Quiz Component */}
            {currentMode === 'timer' ? (
              <PomodoroTimer />
            ) : (
              <QuizSection topic={selectedTopic} />
            )}
          </div>

          {/* Right Column - Topic Selector and Stats */}
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
