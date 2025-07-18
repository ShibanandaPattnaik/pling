import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MoodSelector from './components/MoodSelector';
import Feed from './pages/Feed';
import Wellness from './pages/Wellness';
import AIVideoCreator from './components/AIVideoCreator';

function App() {
  const [currentMood, setCurrentMood] = useState(null);
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    // Check if user has previously selected a mood
    const savedMood = localStorage.getItem('mood');
    const hasOnboarded = localStorage.getItem('hasOnboarded');
    
    if (savedMood && hasOnboarded) {
      setCurrentMood(savedMood);
      setIsFirstTime(false);
    }
  }, []);

  const handleMoodSelect = (mood) => {
    setCurrentMood(mood);
    setIsFirstTime(false);
    localStorage.setItem('mood', mood);
    localStorage.setItem('hasOnboarded', 'true');
  };

  // Show mood onboarding for first-time users
  if (isFirstTime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <MoodSelector onMoodSelect={handleMoodSelect} />
      </div>
    );
  }

  return (
    <Router>
      <div className={`min-h-screen bg-gradient-to-br mood-theme-${currentMood}`}>
        <nav className="bg-white/90 backdrop-blur-md shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-purple-600">💜 Pling</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-600 hover:text-gray-900">Feed</button>
                <button className="text-gray-600 hover:text-gray-900">Create</button>
                <button className="text-gray-600 hover:text-gray-900">Wellness</button>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Feed currentMood={currentMood} />} />
          <Route path="/feed" element={<Feed currentMood={currentMood} />} />
          <Route path="/create" element={<AIVideoCreator currentMood={currentMood} />} />
          <Route path="/wellness" element={<Wellness currentMood={currentMood} />} />
          <Route path="/mood" element={<MoodSelector onMoodSelect={handleMoodSelect} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;