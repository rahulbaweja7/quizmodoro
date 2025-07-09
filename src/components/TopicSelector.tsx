'use client';

interface TopicSelectorProps {
  selectedTopic: string;
  onTopicChange: (topic: string) => void;
}

const topics = [
  {
    id: 'general',
    name: 'General Knowledge',
    description: 'Mixed topics and trivia',
    icon: '🌍',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Physics, chemistry, biology',
    icon: '🔬',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'history',
    name: 'History',
    description: 'World history and events',
    icon: '📚',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'Computers, programming, tech',
    icon: '💻',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Numbers, equations, logic',
    icon: '📐',
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'literature',
    name: 'Literature',
    description: 'Books, authors, poetry',
    icon: '📖',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'geography',
    name: 'Geography',
    description: 'Countries, capitals, maps',
    icon: '🗺️',
    color: 'from-teal-500 to-cyan-500'
  },
  {
    id: 'art',
    name: 'Art & Culture',
    description: 'Paintings, music, culture',
    icon: '🎨',
    color: 'from-yellow-500 to-orange-500'
  }
];

export default function TopicSelector({ selectedTopic, onTopicChange }: TopicSelectorProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Choose a Topic
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Select a learning topic for your quiz questions
      </p>
      
      <div className="grid grid-cols-1 gap-3">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onTopicChange(topic.id)}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              selectedTopic === topic.id
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${topic.color} flex items-center justify-center text-2xl mr-4`}>
                {topic.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {topic.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {topic.description}
                </p>
              </div>
              {selectedTopic === topic.id && (
                <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          💡 Pro Tip
        </h4>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Switch topics between Pomodoro sessions to keep your learning diverse and engaging!
        </p>
      </div>
    </div>
  );
} 