import React, { useState, useEffect } from 'react';

const Feed = ({ currentMood }) => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('mood'); // mood, friends, trending

  // Mock posts data - in a real app, this would come from an API
  const mockPosts = [
    {
      id: 1,
      author: 'Alex',
      mood: 'creative',
      content: 'Just made this trippy video about painting in zero gravity! 🎨✨',
      videoThumbnail: '🎨',
      likes: 23,
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      author: 'Sam',
      mood: 'excited',
      content: 'Dancing through the neon city streets! Energy is everything! ⚡',
      videoThumbnail: '⚡',
      likes: 45,
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      author: 'Maya',
      mood: 'calm',
      content: 'Meditation by the virtual lake. Finding peace in digital spaces 🧘',
      videoThumbnail: '🧘',
      likes: 18,
      timestamp: '6 hours ago'
    }
  ];

  useEffect(() => {
    // Filter posts based on current mood and filter type
    let filteredPosts = mockPosts;
    
    if (filter === 'mood') {
      // Show posts with same or complementary moods first
      filteredPosts = mockPosts.filter(post => 
        post.mood === currentMood || 
        getComplementaryMoods(currentMood).includes(post.mood)
      );
    }
    
    setPosts(filteredPosts);
  }, [currentMood, filter]);

  const getComplementaryMoods = (mood) => {
    const moodMap = {
      'creative': ['excited', 'happy'],
      'excited': ['creative', 'confident'],
      'calm': ['happy', 'neutral'],
      'confident': ['excited', 'creative'],
      'sad': ['calm', 'neutral'],
      'angry': ['excited', 'confident'],
      'happy': ['creative', 'excited', 'calm'],
      'neutral': ['calm', 'happy']
    };
    return moodMap[mood] || [];
  };

  const getMoodColor = (mood) => {
    const colors = {
      'creative': 'text-mood-creative',
      'excited': 'text-mood-excited',
      'calm': 'text-mood-calm',
      'confident': 'text-mood-confident',
      'sad': 'text-mood-sad',
      'angry': 'text-mood-angry',
      'happy': 'text-mood-happy',
      'neutral': 'text-mood-neutral'
    };
    return colors[mood] || 'text-gray-600';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Current Mood Indicator */}
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Your Current Vibe: <span className={getMoodColor(currentMood)}>
            {currentMood?.charAt(0).toUpperCase() + currentMood?.slice(1)}
          </span>
        </h2>
        <p className="text-gray-600">
          Discovering content that matches your {currentMood} energy ✨
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setFilter('mood')}
          className={`px-6 py-3 rounded-full font-medium transition-all ${
            filter === 'mood'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🧠 Your Vibe
        </button>
        <button
          onClick={() => setFilter('friends')}
          className={`px-6 py-3 rounded-full font-medium transition-all ${
            filter === 'friends'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          👯 Friends
        </button>
        <button
          onClick={() => setFilter('trending')}
          className={`px-6 py-3 rounded-full font-medium transition-all ${
            filter === 'trending'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🔥 Trending
        </button>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                  {post.author[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{post.author}</h3>
                  <p className="text-sm text-gray-500">{post.timestamp}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(post.mood)} bg-gray-100`}>
                {post.mood}
              </span>
            </div>

            <p className="text-gray-700 mb-4">{post.content}</p>

            {/* Video Thumbnail Placeholder */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-64 flex items-center justify-center mb-4">
              <div className="text-6xl">{post.videoThumbnail}</div>
            </div>

            <div className="flex items-center justify-between">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                <span>❤️</span>
                <span>{post.likes}</span>
              </button>
              <div className="flex space-x-4">
                <button className="text-gray-600 hover:text-purple-600 transition-colors">
                  💬 Comment
                </button>
                <button className="text-gray-600 hover:text-purple-600 transition-colors">
                  🔄 Remix
                </button>
                <button className="text-gray-600 hover:text-purple-600 transition-colors">
                  📤 Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create New Post Button */}
      <div className="fixed bottom-8 right-8">
        <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-105">
          <span className="text-2xl">+</span>
        </button>
      </div>
    </div>
  );
};

export default Feed;