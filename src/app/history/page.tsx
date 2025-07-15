"use client";
import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = JSON.parse(localStorage.getItem("quizHistory") || "[]");
      setHistory(data);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sticky glassy header */}
      <div className="sticky top-0 z-10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center px-4 py-3 mb-8">
        <button
          className="mr-4 px-3 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200 font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-800 transition"
          onClick={() => window.location.href = "/"}
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz History</h2>
      </div>
      <div className="max-w-3xl mx-auto py-6 px-4">
        {history.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-center mt-16">No quiz history yet. Complete a quiz to see it here!</div>
        ) : (
          <div className="grid gap-8">
            {history.map((entry, idx) => (
              <div
                key={idx}
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 transition-transform duration-200 hover:scale-[1.02] hover:shadow-2xl"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="font-semibold text-lg text-indigo-700 dark:text-indigo-300">{entry.topic.charAt(0).toUpperCase() + entry.topic.slice(1)}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(entry.date).toLocaleString()}</div>
                  </div>
                  <span className={`inline-block px-4 py-1 rounded-full text-white font-bold text-lg shadow ${entry.score >= 80 ? 'bg-green-500' : entry.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}>{entry.score}%</span>
                  <button
                    className="ml-4 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors"
                    onClick={() => setSelected(selected === idx ? null : idx)}
                  >
                    {selected === idx ? "Close" : "Review"}
                  </button>
                </div>
                {/* Modal for review */}
                {selected === idx && (
                  <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
                      <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold"
                        onClick={() => setSelected(null)}
                        aria-label="Close"
                      >
                        ×
                      </button>
                      <h3 className="text-xl font-bold mb-6 text-indigo-700 dark:text-indigo-300">Quiz Review</h3>
                      <div className="space-y-4">
                        {entry.questions.map((q: any, qidx: number) => (
                          <div key={q.id} className="p-4 rounded border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
                            <div className="font-medium text-gray-900 dark:text-white mb-1">Q{qidx + 1}: {q.question}</div>
                            <div className="mb-1">
                              <span className="font-medium">Your answer: </span>
                              <span className={entry.userAnswers[qidx] === q.correctAnswer ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                {entry.userAnswers[qidx] !== null ? q.options[entry.userAnswers[qidx]] : 'No answer'}
                              </span>
                              {entry.userAnswers[qidx] !== q.correctAnswer && (
                                <span className="ml-2 text-gray-500">(Correct: <span className="text-green-600">{q.options[q.correctAnswer]}</span>)</span>
                              )}
                            </div>
                            {q.explanation && (
                              <div className="text-xs text-blue-800 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-2">
                                <span className="font-semibold">Explanation: </span>{q.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 