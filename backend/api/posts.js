const express = require('express');
const router = express.Router();

// Mock posts data storage (in production, this would be a database)
let posts = [
  {
    id: 1,
    author: 'Alex',
    authorId: 'user_alex',
    mood: 'creative',
    content: 'Just made this trippy video about painting in zero gravity! 🎨✨',
    videoUrl: 'https://example.com/video1.mp4',
    thumbnail: '🎨',
    likes: 23,
    comments: 5,
    remixes: 2,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    tags: ['creative', 'art', 'space']
  },
  {
    id: 2,
    author: 'Sam',
    authorId: 'user_sam',
    mood: 'excited',
    content: 'Dancing through the neon city streets! Energy is everything! ⚡',
    videoUrl: 'https://example.com/video2.mp4',
    thumbnail: '⚡',
    likes: 45,
    comments: 12,
    remixes: 8,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    tags: ['excited', 'dance', 'city']
  },
  {
    id: 3,
    author: 'Maya',
    authorId: 'user_maya',
    mood: 'calm',
    content: 'Meditation by the virtual lake. Finding peace in digital spaces 🧘',
    videoUrl: 'https://example.com/video3.mp4',
    thumbnail: '🧘',
    likes: 18,
    comments: 3,
    remixes: 1,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    tags: ['calm', 'meditation', 'nature']
  }
];

let nextPostId = 4;

// GET /api/posts/feed
router.get('/feed', (req, res) => {
  try {
    const { mood, filter = 'mood', userId = 'guest', limit = 10 } = req.query;
    
    let filteredPosts = [...posts];
    
    if (filter === 'mood' && mood) {
      // Show posts with same or complementary moods
      const complementaryMoods = getComplementaryMoods(mood);
      filteredPosts = posts.filter(post => 
        post.mood === mood || complementaryMoods.includes(post.mood)
      );
    } else if (filter === 'trending') {
      // Sort by engagement (likes + comments + remixes)
      filteredPosts.sort((a, b) => {
        const engagementA = a.likes + a.comments + a.remixes;
        const engagementB = b.likes + b.comments + b.remixes;
        return engagementB - engagementA;
      });
    } else if (filter === 'friends') {
      // Mock friends filter - in production, this would filter by user's friends
      filteredPosts = posts.filter(post => 
        ['user_alex', 'user_maya'].includes(post.authorId) // Mock friend list
      );
    }
    
    // Sort by timestamp (newest first) if not trending
    if (filter !== 'trending') {
      filteredPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    
    // Limit results
    filteredPosts = filteredPosts.slice(0, parseInt(limit));
    
    // Add relative timestamps
    filteredPosts = filteredPosts.map(post => ({
      ...post,
      timeAgo: getTimeAgo(post.timestamp)
    }));
    
    res.json({
      posts: filteredPosts,
      total: posts.length,
      filter,
      mood,
      message: `${filteredPosts.length} posts found for your ${mood || filter} feed ✨`
    });
    
  } catch (error) {
    console.error('Feed error:', error);
    res.status(500).json({
      error: 'Failed to load feed',
      message: error.message
    });
  }
});

// POST /api/posts
router.post('/', (req, res) => {
  try {
    const { 
      content, 
      mood, 
      videoUrl, 
      thumbnail, 
      author = 'Anonymous', 
      authorId = 'guest',
      tags = []
    } = req.body;
    
    if (!content || !mood) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['content', 'mood']
      });
    }
    
    const newPost = {
      id: nextPostId++,
      author,
      authorId,
      mood,
      content,
      videoUrl: videoUrl || `https://example.com/video${nextPostId}.mp4`,
      thumbnail: thumbnail || getMoodEmoji(mood),
      likes: 0,
      comments: 0,
      remixes: 0,
      timestamp: new Date().toISOString(),
      tags: Array.isArray(tags) ? tags : [mood]
    };
    
    posts.unshift(newPost); // Add to beginning of array
    
    console.log(`📝 New ${mood} post created by ${author}`);
    
    res.json({
      success: true,
      post: {
        ...newPost,
        timeAgo: 'Just now'
      },
      message: `Your ${mood} post has been shared! 🎉`
    });
    
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).json({
      error: 'Failed to create post',
      message: error.message
    });
  }
});

// POST /api/posts/:id/like
router.post('/:id/like', (req, res) => {
  try {
    const { id } = req.params;
    const { userId = 'guest' } = req.body;
    
    const post = posts.find(p => p.id === parseInt(id));
    
    if (!post) {
      return res.status(404).json({
        error: 'Post not found'
      });
    }
    
    post.likes += 1;
    
    console.log(`❤️ Post ${id} liked by ${userId}`);
    
    res.json({
      success: true,
      likes: post.likes,
      message: 'Post liked! 💜'
    });
    
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({
      error: 'Failed to like post',
      message: error.message
    });
  }
});

// POST /api/posts/:id/remix
router.post('/:id/remix', (req, res) => {
  try {
    const { id } = req.params;
    const { userId = 'guest', newContent, newMood } = req.body;
    
    const originalPost = posts.find(p => p.id === parseInt(id));
    
    if (!originalPost) {
      return res.status(404).json({
        error: 'Original post not found'
      });
    }
    
    // Create remix post
    const remixPost = {
      id: nextPostId++,
      author: 'Remixer', // In production, get from user profile
      authorId: userId,
      mood: newMood || originalPost.mood,
      content: newContent || `Remix of: ${originalPost.content}`,
      videoUrl: `https://example.com/remix${nextPostId}.mp4`,
      thumbnail: getMoodEmoji(newMood || originalPost.mood),
      likes: 0,
      comments: 0,
      remixes: 0,
      timestamp: new Date().toISOString(),
      tags: ['remix', originalPost.mood],
      originalPostId: originalPost.id,
      isRemix: true
    };
    
    posts.unshift(remixPost);
    originalPost.remixes += 1;
    
    console.log(`🔄 Post ${id} remixed by ${userId}`);
    
    res.json({
      success: true,
      remix: {
        ...remixPost,
        timeAgo: 'Just now'
      },
      originalPost: {
        ...originalPost,
        timeAgo: getTimeAgo(originalPost.timestamp)
      },
      message: 'Remix created! Your creative spin is live 🎨'
    });
    
  } catch (error) {
    console.error('Remix error:', error);
    res.status(500).json({
      error: 'Failed to create remix',
      message: error.message
    });
  }
});

// GET /api/posts/trending
router.get('/trending', (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // Calculate trending score based on recent engagement
    const trendingPosts = posts
      .map(post => {
        const age = Date.now() - new Date(post.timestamp).getTime();
        const ageHours = age / (1000 * 60 * 60);
        const engagement = post.likes + post.comments * 2 + post.remixes * 3;
        
        // Decay engagement score based on age
        const trendingScore = engagement / (1 + ageHours * 0.1);
        
        return {
          ...post,
          trendingScore,
          timeAgo: getTimeAgo(post.timestamp)
        };
      })
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, parseInt(limit));
    
    res.json({
      posts: trendingPosts,
      message: `Top ${trendingPosts.length} trending posts 🔥`
    });
    
  } catch (error) {
    console.error('Trending error:', error);
    res.status(500).json({
      error: 'Failed to load trending posts',
      message: error.message
    });
  }
});

// Helper functions
function getComplementaryMoods(mood) {
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
}

function getMoodEmoji(mood) {
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
}

function getTimeAgo(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now - time;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

module.exports = router;