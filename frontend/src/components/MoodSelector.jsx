import React, { useState } from 'react';

const moods = [
  { key: 'creative', emoji: '🎨', label: 'Creative', description: 'Ready to make something beautiful' },
  { key: 'excited', emoji: '⚡', label: 'Excited', description: 'Energy flowing through me' },
  { key: 'calm', emoji: '🧘', label: 'Calm', description: 'Peaceful and centered' },
  { key: 'confident', emoji: '💪', label: 'Confident', description: 'Ready to take on the world' },
  { key: 'sad', emoji: '😢', label: 'Sad', description: 'Need some emotional support' },
  { key: 'angry', emoji: '😤', label: 'Angry', description: 'Frustrated and need to vent' },
  { key: 'happy', emoji: '😊', label: 'Happy', description: 'Life is good right now' },
  { key: 'neutral', emoji: '😐', label: 'Neutral', description: 'Just going with the flow' }
];

const MoodSelector = ({ onMoodSelect }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(5);

  const handleMoodClick = (moodKey) => {
    setSelectedMood(moodKey);
  };

  const handleConfirm = () => {
    if (selectedMood) {
      onMoodSelect(selectedMood);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            How are you feeling?
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Your mood shapes your creative journey
          </p>
          <p className="text-lg text-gray-500">
            Choose what resonates with you right now ✨
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {moods.map((mood) => (
            <button
              key={mood.key}
              onClick={() => handleMoodClick(mood.key)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                selectedMood === mood.key
                  ? `border-mood-${mood.key} bg-mood-${mood.key}/10 shadow-lg`
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="text-4xl mb-3">{mood.emoji}</div>
              <div className="font-semibold text-gray-800 mb-1">{mood.label}</div>
              <div className="text-sm text-gray-500">{mood.description}</div>
            </button>
          ))}
        </div>

        {selectedMood && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              How intense is this feeling?
            </h3>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Light</span>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
                className={`flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mood-slider-${selectedMood}`}
              />
              <span className="text-sm text-gray-500">Intense</span>
            </div>
            <div className="text-center mt-2">
              <span className="text-2xl font-bold text-gray-700">{intensity}/10</span>
            </div>
          </div>
        )}

        {selectedMood && (
          <div className="text-center animate-fade-in">
            <button
              onClick={handleConfirm}
              className={`mood-button mood-${selectedMood} text-lg px-8 py-4 min-w-48`}
            >
              Start My Pling Journey 🚀
            </button>
            <p className="text-sm text-gray-500 mt-3">
              You can always change your mood later
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodSelector;