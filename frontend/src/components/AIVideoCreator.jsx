import React, { useState } from 'react';

const AIVideoCreator = ({ currentMood }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [step, setStep] = useState('prompt'); // prompt, generating, preview, share

  const moodPrompts = {
    'creative': [
      'Painting in a cosmic art studio',
      'Sculpting with rainbow clay',
      'Dancing paintbrushes creating magic'
    ],
    'excited': [
      'Lightning dancing through neon city',
      'Rocket ship adventure through stars',
      'Celebration confetti explosion'
    ],
    'calm': [
      'Meditation in floating garden',
      'Peaceful waterfall in forest',
      'Gentle waves on quiet beach'
    ],
    'confident': [
      'Superhero flying through clouds',
      'Mountain climbing to the top',
      'Powerful lion walking through savanna'
    ],
    'sad': [
      'Rain drops on window creating art',
      'Gentle healing light in darkness',
      'Flowers blooming after storm'
    ],
    'angry': [
      'Volcano creating new islands',
      'Thunder transforming into music',
      'Fire becoming beautiful phoenix'
    ],
    'happy': [
      'Sunshine dancing with flowers',
      'Puppies playing in meadow',
      'Rainbow bridge over waterfall'
    ],
    'neutral': [
      'Clouds slowly forming shapes',
      'Leaves falling in gentle breeze',
      'Peaceful lake reflecting sky'
    ]
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setStep('generating');

    // Simulate API call to video generation service
    try {
      // In a real app, this would call Runway API or similar
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setGeneratedVideo({
        id: Date.now(),
        prompt: prompt,
        mood: currentMood,
        thumbnail: getMoodEmoji(currentMood),
        duration: 30,
        status: 'ready'
      });
      
      setStep('preview');
    } catch (error) {
      console.error('Failed to generate video:', error);
    } finally {
      setIsGenerating(false);
    }
  };

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
      'creative': 'from-pink-500 to-purple-600',
      'excited': 'from-yellow-400 to-orange-500',
      'calm': 'from-teal-400 to-blue-500',
      'confident': 'from-orange-500 to-red-500',
      'sad': 'from-blue-400 to-indigo-600',
      'angry': 'from-red-500 to-pink-600',
      'happy': 'from-green-400 to-blue-500',
      'neutral': 'from-gray-400 to-gray-600'
    };
    return colors[mood] || 'from-purple-400 to-pink-500';
  };

  if (step === 'generating') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-8">
            <div className={`w-full h-full rounded-full bg-gradient-to-br ${getMoodColor(currentMood)} animate-pulse flex items-center justify-center`}>
              <span className="text-4xl">{getMoodEmoji(currentMood)}</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Creating your {currentMood} video...</h2>
          <p className="text-gray-600 mb-8">AI is bringing your vision to life ✨</p>
          <div className="w-64 mx-auto bg-gray-200 rounded-full h-2">
            <div className={`bg-gradient-to-r ${getMoodColor(currentMood)} h-2 rounded-full animate-pulse`} style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'preview') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your video is ready! 🎉</h1>
          <p className="text-gray-600">Share your {currentMood} creation with the world</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          {/* Video Preview */}
          <div className={`bg-gradient-to-br ${getMoodColor(currentMood)} rounded-xl h-96 flex items-center justify-center mb-6`}>
            <div className="text-center text-white">
              <div className="text-8xl mb-4">{getMoodEmoji(currentMood)}</div>
              <p className="text-xl font-semibold">30s AI Video</p>
              <p className="opacity-80">"{prompt}"</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-800">{prompt}</h3>
              <p className="text-sm text-gray-500">Mood: {currentMood} • Duration: 30s</p>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-medium transition-colors">
              ▶️ Play
            </button>
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={() => setStep('share')}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-full font-medium transition-colors"
            >
              📤 Share to Feed
            </button>
            <button 
              onClick={() => setStep('prompt')}
              className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-full font-medium transition-colors"
            >
              🔄 Create Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Create Your {currentMood?.charAt(0).toUpperCase() + currentMood?.slice(1)} Video
        </h1>
        <p className="text-gray-600">
          Describe what you want to see, and AI will create a 30-second video for you ✨
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What do you want to create?
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Describe your ${currentMood} vision... (e.g., "A magical forest where trees grow music notes")`}
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={4}
          />
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            {currentMood?.charAt(0).toUpperCase() + currentMood?.slice(1)} Inspiration:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {moodPrompts[currentMood]?.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setPrompt(suggestion)}
                className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-purple-300 transition-colors"
              >
                <span className="text-sm text-gray-700">{suggestion}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
            prompt.trim() && !isGenerating
              ? `bg-gradient-to-r ${getMoodColor(currentMood)} hover:opacity-90 transform hover:scale-105`
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {isGenerating ? 'Generating...' : `🎬 Generate ${currentMood?.charAt(0).toUpperCase() + currentMood?.slice(1)} Video`}
        </button>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>✨ Your mood influences the AI's creative interpretation</p>
        <p>🎥 Videos are 30 seconds long and optimized for sharing</p>
      </div>
    </div>
  );
};

export default AIVideoCreator;