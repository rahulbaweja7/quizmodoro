'use client';

import { useState, useEffect, useCallback } from 'react';

interface TimerSettings {
  work: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
}

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [settings, setSettings] = useState<TimerSettings>({
    work: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4
  });

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseTime = useCallback(() => {
    switch (currentPhase) {
      case 'work':
        return settings.work * 60;
      case 'shortBreak':
        return settings.shortBreak * 60;
      case 'longBreak':
        return settings.longBreak * 60;
      default:
        return settings.work * 60;
    }
  }, [currentPhase, settings]);

  const nextPhase = useCallback(() => {
    if (currentPhase === 'work') {
      const newCompletedPomodoros = completedPomodoros + 1;
      setCompletedPomodoros(newCompletedPomodoros);
      
      if (newCompletedPomodoros % settings.longBreakInterval === 0) {
        setCurrentPhase('longBreak');
      } else {
        setCurrentPhase('shortBreak');
      }
    } else {
      setCurrentPhase('work');
    }
    setTimeLeft(getPhaseTime());
  }, [currentPhase, completedPomodoros, settings.longBreakInterval, getPhaseTime]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getPhaseTime());
  };

  const skipPhase = () => {
    nextPhase();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            nextPhase();
            return getPhaseTime();
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      nextPhase();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, nextPhase, getPhaseTime]);

  const getProgressPercentage = () => {
    const totalTime = getPhaseTime();
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'work':
        return 'from-red-500 to-orange-500';
      case 'shortBreak':
        return 'from-green-500 to-emerald-500';
      case 'longBreak':
        return 'from-blue-500 to-indigo-500';
      default:
        return 'from-red-500 to-orange-500';
    }
  };

  const getPhaseName = () => {
    switch (currentPhase) {
      case 'work':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Focus Time';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <div className="text-center">
        {/* Phase Indicator */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {getPhaseName()}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {currentPhase === 'work' ? `Pomodoro ${completedPomodoros + 1}` : 'Take a break!'}
          </p>
        </div>

        {/* Timer Display */}
        <div className="relative mb-8">
          <div className="w-64 h-64 mx-auto relative">
            {/* Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`}
                className={`text-transparent bg-gradient-to-r ${getPhaseColor()} bg-clip-text`}
                style={{
                  stroke: `url(#gradient-${currentPhase})`
                }}
              />
              <defs>
                <linearGradient id={`gradient-${currentPhase}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className={currentPhase === 'work' ? 'stop-color-red-500' : currentPhase === 'shortBreak' ? 'stop-color-green-500' : 'stop-color-blue-500'} />
                  <stop offset="100%" className={currentPhase === 'work' ? 'stop-color-orange-500' : currentPhase === 'shortBreak' ? 'stop-color-emerald-500' : 'stop-color-indigo-500'} />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Time Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.ceil(getProgressPercentage())}% complete
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Start
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Pause
            </button>
          )}
          
          <button
            onClick={resetTimer}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200"
          >
            Reset
          </button>
          
          <button
            onClick={skipPhase}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200"
          >
            Skip
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {completedPomodoros}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Completed
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.floor(completedPomodoros / settings.longBreakInterval)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Long Breaks
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {completedPomodoros * settings.work}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Minutes Focused
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 