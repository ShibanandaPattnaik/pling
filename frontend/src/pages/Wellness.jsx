import React, { useState, useEffect } from 'react';

const Wellness = ({ currentMood }) => {
  const [moodHistory, setMoodHistory] = useState([]);
  const [usageStats, setUsageStats] = useState({
    todayMinutes: 45,
    weeklyAverage: 52,
    streakDays: 3
  });
  const [showBreakSuggestion, setShowBreakSuggestion] = useState(false);

  useEffect(() => {
    // Load mood history from localStorage or API
    const savedMoodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    
    // Add today's mood if not already recorded
    const today = new Date().toDateString();
    const todayMood = savedMoodHistory.find(entry => entry.date === today);
    
    if (!todayMood && currentMood) {
      const newEntry = {
        date: today,
        mood: currentMood,
        timestamp: new Date().toISOString()
      };
      const updatedHistory = [...savedMoodHistory, newEntry];
      setMoodHistory(updatedHistory);
      localStorage.setItem('moodHistory', JSON.stringify(updatedHistory));
    } else {
      setMoodHistory(savedMoodHistory);
    }

    // Check if user should take a break
    const lastBreak = localStorage.getItem('lastBreakTime');
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    if (!lastBreak || now - parseInt(lastBreak) > oneHour) {
      setTimeout(() => setShowBreakSuggestion(true), 5000);
    }
  }, [currentMood]);

  const getMoodEmoji = (mood) => {
    const emojis = {
      'creative': '🎨',
      'excited': '⚡',
      'calm': '🧘',
      'confident': '💪',
      'sad': '😢',
      'angry': '😤',
      'happy': '😊',
      'neutral': '😐'
    };
    return emojis[mood] || '✨';
  };

  const getMoodColor = (mood) => {
    const colors = {
      'creative': 'bg-mood-creative',
      'excited': 'bg-mood-excited',
      'calm': 'bg-mood-calm',
      'confident': 'bg-mood-confident',
      'sad': 'bg-mood-sad',
      'angry': 'bg-mood-angry',
      'happy': 'bg-mood-happy',
      'neutral': 'bg-mood-neutral'
    };
    return colors[mood] || 'bg-purple-500';
  };

  const getStreakMessage = () => {
    const { streakDays } = usageStats;
    if (streakDays >= 7) return "You're glowing! ✨🎉 Amazing wellness streak!";
    if (streakDays >= 3) return "You're on fire! 🔥 Keep the positive vibes flowing!";
    if (streakDays >= 1) return "Great start! 🌱 Building healthy habits!";
    return "Welcome to your wellness journey! 🌟";
  };

  const takeBreak = () => {
    localStorage.setItem('lastBreakTime', Date.now().toString());
    setShowBreakSuggestion(false);
    alert('Take a 2-minute creative reset! 🧘‍♀️✨');
  };

  const dismissBreak = () => {
    setShowBreakSuggestion(false);
  };

  const recentMoods = moodHistory.slice(-7).reverse();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Wellness Dashboard</h1>
        <p className="text-gray-600">Track your mood journey and maintain healthy creative habits ✨</p>
      </div>

      {/* Break Suggestion Modal */}
      {showBreakSuggestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">🧘‍♀️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Time for a mindful break?</h3>
            <p className="text-gray-600 mb-6">
              You've been creating for a while. How about a 2-minute creative reset to recharge your energy?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={takeBreak}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-full font-medium transition-colors"
              >
                Yes, let's reset! 🌟
              </button>
              <button
                onClick={dismissBreak}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-full font-medium transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Mood & Streak */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Vibe</h2>
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-full ${getMoodColor(currentMood)} flex items-center justify-center text-2xl`}>
                {getMoodEmoji(currentMood)}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 capitalize">{currentMood}</h3>
                <p className="text-gray-600">{getStreakMessage()}</p>
              </div>
            </div>
          </div>

          {/* Mood History Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Mood Trend (Last 7 Days)</h2>
            <div className="flex items-end space-x-2 h-32">
              {recentMoods.map((entry, index) => {
                const date = new Date(entry.date);
                const dayName = date.toLocaleDateString('en', { weekday: 'short' });
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-8 ${getMoodColor(entry.mood)} rounded-t-lg flex items-end justify-center`}
                      style={{ height: `${60 + Math.random() * 40}px` }}
                    >
                      <span className="text-white text-sm pb-1">{getMoodEmoji(entry.mood)}</span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{dayName}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Your mood journey shows patterns that help you understand your creative cycles
            </p>
          </div>
        </div>

        {/* Usage Stats & Tips */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Usage Today</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Creative Time</span>
                  <span>{usageStats.todayMinutes}min</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${Math.min((usageStats.todayMinutes / 60) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">Weekly Average</div>
                <div className="text-2xl font-bold text-gray-800">{usageStats.weeklyAverage}min</div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">Wellness Streak</div>
                <div className="text-2xl font-bold text-purple-600">{usageStats.streakDays} days 🔥</div>
              </div>
            </div>
          </div>

          {/* Wellness Tips */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Wellness Tips</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span>💡</span>
                  <span className="font-medium text-blue-800">Mood Insight</span>
                </div>
                <p className="text-sm text-blue-700">
                  Your {currentMood} energy is perfect for creative exploration today!
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span>🌱</span>
                  <span className="font-medium text-green-800">Growth Tip</span>
                </div>
                <p className="text-sm text-green-700">
                  Try expressing different moods to expand your creative range.
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span>🧘</span>
                  <span className="font-medium text-purple-800">Mindful Moment</span>
                </div>
                <p className="text-sm text-purple-700">
                  Take breaks between creations to reset your creative energy.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <span>🎭</span>
                  <span className="text-sm">Change your mood</span>
                </div>
              </button>
              
              <button 
                onClick={takeBreak}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span>⏸️</span>
                  <span className="text-sm">Take a mindful break</span>
                </div>
              </button>
              
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <span>📊</span>
                  <span className="text-sm">View detailed stats</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wellness;