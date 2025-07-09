'use client';

import { useState, useEffect } from 'react';

interface ProgressStatsProps {
  userId: string;
}

interface UserStats {
  totalPomodoros: number;
  totalMinutes: number;
  totalQuizzes: number;
  averageQuizScore: number;
  currentStreak: number;
  bestStreak: number;
  topicsCompleted: string[];
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export default function ProgressStats({ userId }: ProgressStatsProps) {
  const [stats, setStats] = useState<UserStats>({
    totalPomodoros: 0,
    totalMinutes: 0,
    totalQuizzes: 0,
    averageQuizScore: 0,
    currentStreak: 0,
    bestStreak: 0,
    topicsCompleted: [],
    achievements: [
      {
        id: 'first-pomodoro',
        name: 'First Focus',
        description: 'Complete your first Pomodoro session',
        icon: '🎯',
        unlocked: false
      },
      {
        id: 'quiz-master',
        name: 'Quiz Master',
        description: 'Score 100% on any quiz',
        icon: '🏆',
        unlocked: false
      },
      {
        id: 'streak-7',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        unlocked: false
      },
      {
        id: 'topic-explorer',
        name: 'Topic Explorer',
        description: 'Try quizzes in 5 different topics',
        icon: '🗺️',
        unlocked: false
      },
      {
        id: 'time-master',
        name: 'Time Master',
        description: 'Complete 50 Pomodoro sessions',
        icon: '⏰',
        unlocked: false
      }
    ]
  });

  useEffect(() => {
    // In a real app, this would fetch data from Firebase
    // For now, we'll simulate some progress
    const mockStats: UserStats = {
      totalPomodoros: 12,
      totalMinutes: 300,
      totalQuizzes: 8,
      averageQuizScore: 78,
      currentStreak: 3,
      bestStreak: 5,
      topicsCompleted: ['general', 'science', 'technology'],
      achievements: [
        {
          id: 'first-pomodoro',
          name: 'First Focus',
          description: 'Complete your first Pomodoro session',
          icon: '🎯',
          unlocked: true,
          unlockedAt: new Date('2024-01-15')
        },
        {
          id: 'quiz-master',
          name: 'Quiz Master',
          description: 'Score 100% on any quiz',
          icon: '🏆',
          unlocked: true,
          unlockedAt: new Date('2024-01-20')
        },
        {
          id: 'streak-7',
          name: 'Week Warrior',
          description: 'Maintain a 7-day streak',
          icon: '🔥',
          unlocked: false
        },
        {
          id: 'topic-explorer',
          name: 'Topic Explorer',
          description: 'Try quizzes in 5 different topics',
          icon: '🗺️',
          unlocked: false
        },
        {
          id: 'time-master',
          name: 'Time Master',
          description: 'Complete 50 Pomodoro sessions',
          icon: '⏰',
          unlocked: false
        }
      ]
    };
    setStats(mockStats);
  }, [userId]);

  const unlockedAchievements = stats.achievements.filter(a => a.unlocked);
  const lockedAchievements = stats.achievements.filter(a => !a.unlocked);

  return (
    <div className="space-y-6">
      {/* Today's Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Today's Progress
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {Math.floor(stats.totalMinutes / 25)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Pomodoros
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.currentStreak}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Day Streak
            </div>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Overall Stats
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Total Pomodoros</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {stats.totalPomodoros}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Total Minutes</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {stats.totalMinutes}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Quizzes Taken</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {stats.totalQuizzes}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Avg Quiz Score</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {stats.averageQuizScore}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Best Streak</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {stats.bestStreak} days
            </span>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Achievements
        </h3>
        <div className="space-y-3">
          {unlockedAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg"
            >
              <div className="text-2xl mr-3">{achievement.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 dark:text-green-100">
                  {achievement.name}
                </h4>
                <p className="text-sm text-green-700 dark:text-green-200">
                  {achievement.description}
                </p>
                {achievement.unlockedAt && (
                  <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                    Unlocked {achievement.unlockedAt.toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
          
          {lockedAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg opacity-60"
            >
              <div className="text-2xl mr-3 grayscale">{achievement.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-500 dark:text-gray-400">
                  {achievement.name}
                </h4>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {achievement.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topics Completed */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Topics Explored
        </h3>
        <div className="flex flex-wrap gap-2">
          {stats.topicsCompleted.map((topic) => (
            <span
              key={topic}
              className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-medium"
            >
              {topic.charAt(0).toUpperCase() + topic.slice(1)}
            </span>
          ))}
          {stats.topicsCompleted.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No topics explored yet. Start your first quiz!
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 