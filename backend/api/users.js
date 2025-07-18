const express = require('express');
const router = express.Router();

// Mock user data storage (in production, this would be a database)
let users = {};
let userMoodHistory = {};

// POST /api/users/mood
router.post('/mood', (req, res) => {
  try {
    const { userId = 'guest', mood, intensity = 5 } = req.body;
    
    if (!mood) {
      return res.status(400).json({
        error: 'Mood is required'
      });
    }
    
    const moodEntry = {
      mood,
      intensity: parseInt(intensity),
      timestamp: new Date().toISOString(),
      date: new Date().toDateString()
    };
    
    // Initialize user mood history if not exists
    if (!userMoodHistory[userId]) {
      userMoodHistory[userId] = [];
    }
    
    // Add mood entry
    userMoodHistory[userId].push(moodEntry);
    
    // Update user's current mood
    if (!users[userId]) {
      users[userId] = {
        id: userId,
        currentMood: mood,
        moodHistory: [],
        streakDays: 0,
        totalPosts: 0,
        createdAt: new Date().toISOString()
      };
    }
    
    users[userId].currentMood = mood;
    users[userId].lastMoodUpdate = moodEntry.timestamp;
    
    // Calculate streak
    const streak = calculateMoodStreak(userMoodHistory[userId]);
    users[userId].streakDays = streak;
    
    console.log(`😊 User ${userId} mood updated to: ${mood} (intensity: ${intensity})`);
    
    res.json({
      success: true,
      mood: moodEntry,
      user: users[userId],
      message: `Mood updated to ${mood}! Keep expressing yourself ✨`
    });
    
  } catch (error) {
    console.error('Mood update error:', error);
    res.status(500).json({
      error: 'Failed to update mood',
      message: error.message
    });
  }
});

// GET /api/users/:id/mood-history
router.get('/:id/mood-history', (req, res) => {
  const { id } = req.params;
  const { days = 7 } = req.query;
  
  if (!userMoodHistory[id]) {
    return res.json({
      moodHistory: [],
      message: 'No mood history found'
    });
  }
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
  
  const recentHistory = userMoodHistory[id]
    .filter(entry => new Date(entry.timestamp) >= cutoffDate)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  res.json({
    moodHistory: recentHistory,
    totalEntries: userMoodHistory[id].length,
    streak: users[id]?.streakDays || 0
  });
});

// GET /api/users/:id/wellness
router.get('/:id/wellness', (req, res) => {
  const { id } = req.params;
  
  const user = users[id];
  const moodHistory = userMoodHistory[id] || [];
  
  if (!user) {
    return res.json({
      usageStats: {
        todayMinutes: 0,
        weeklyAverage: 0,
        streakDays: 0
      },
      moodHistory: [],
      insights: []
    });
  }
  
  // Calculate usage stats (mock data for now)
  const usageStats = {
    todayMinutes: Math.floor(Math.random() * 60) + 15,
    weeklyAverage: Math.floor(Math.random() * 45) + 30,
    streakDays: user.streakDays || 0
  };
  
  // Generate mood insights
  const insights = generateMoodInsights(moodHistory, user.currentMood);
  
  res.json({
    usageStats,
    moodHistory: moodHistory.slice(-7), // Last 7 entries
    insights,
    recommendations: getWellnessRecommendations(user.currentMood, usageStats)
  });
});

// POST /api/users/:id/wellness/break
router.post('/:id/wellness/break', (req, res) => {
  const { id } = req.params;
  const { type = 'creative-reset' } = req.body;
  
  const breakSession = {
    id: `break_${Date.now()}`,
    type,
    startTime: new Date().toISOString(),
    duration: type === 'creative-reset' ? 120 : 300, // 2 or 5 minutes
    userId: id
  };
  
  console.log(`🧘 User ${id} starting ${type} break`);
  
  res.json({
    success: true,
    breakSession,
    message: 'Enjoy your mindful break! 🌟',
    tips: [
      'Take deep breaths',
      'Look away from the screen',
      'Stretch your body',
      'Think about something you\'re grateful for'
    ]
  });
});

// Helper functions
function calculateMoodStreak(moodHistory) {
  if (!moodHistory || moodHistory.length === 0) return 0;
  
  const today = new Date().toDateString();
  let streak = 0;
  let currentDate = new Date();
  
  // Count consecutive days with mood entries
  for (let i = 0; i < 30; i++) { // Check up to 30 days
    const checkDate = currentDate.toDateString();
    const hasEntry = moodHistory.some(entry => entry.date === checkDate);
    
    if (hasEntry) {
      streak++;
    } else if (streak > 0) {
      break; // Streak broken
    }
    
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return streak;
}

function generateMoodInsights(moodHistory, currentMood) {
  if (!moodHistory || moodHistory.length === 0) {
    return ['Start tracking your mood to get personalized insights!'];
  }
  
  const insights = [];
  
  // Most common mood
  const moodCounts = {};
  moodHistory.forEach(entry => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
  });
  
  const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => 
    moodCounts[a] > moodCounts[b] ? a : b
  );
  
  insights.push(`Your most frequent mood is ${mostCommonMood} 💫`);
  
  // Current mood insight
  if (currentMood) {
    const moodMessages = {
      'creative': 'Perfect time for artistic expression! 🎨',
      'excited': 'Channel that energy into something amazing! ⚡',
      'calm': 'Great mindset for mindful creation 🧘',
      'confident': 'You\'re ready to take on any creative challenge! 💪',
      'sad': 'Art can be healing - express what you\'re feeling 💙',
      'angry': 'Transform that intensity into powerful creativity 🔥',
      'happy': 'Spread those good vibes through your creations! 😊',
      'neutral': 'A balanced mood opens up all creative possibilities ⚖️'
    };
    
    insights.push(moodMessages[currentMood] || 'Keep creating! ✨');
  }
  
  return insights;
}

function getWellnessRecommendations(currentMood, usageStats) {
  const recommendations = [];
  
  // Usage-based recommendations
  if (usageStats.todayMinutes > 60) {
    recommendations.push({
      type: 'break',
      title: 'Time for a break!',
      message: 'You\'ve been creating for a while. How about a 5-minute mindful break?',
      action: 'Take Break'
    });
  }
  
  // Mood-based recommendations
  const moodRecommendations = {
    'creative': {
      title: 'Creative Flow',
      message: 'Try experimenting with a new artistic style today!',
      action: 'Explore'
    },
    'excited': {
      title: 'High Energy',
      message: 'Great time for collaborative projects or remixing!',
      action: 'Collaborate'
    },
    'calm': {
      title: 'Peaceful Vibes',
      message: 'Perfect for creating meditative or nature-inspired content',
      action: 'Create'
    },
    'sad': {
      title: 'Emotional Expression',
      message: 'Art can be therapeutic. Express what you\'re feeling.',
      action: 'Express'
    }
  };
  
  if (currentMood && moodRecommendations[currentMood]) {
    recommendations.push({
      type: 'mood',
      ...moodRecommendations[currentMood]
    });
  }
  
  return recommendations;
}

module.exports = router;