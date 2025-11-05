require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import models
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/roomus', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from multiple directories
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));  // Serve files from root directory
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/app', express.static(path.join(__dirname, 'app')));

// Middleware to check if user is authenticated
const requireAuth = async (req, res, next) => {
  try {
    const userEmail = req.headers['x-user-email'];
    if (!userEmail) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Middleware to check if user has premium access
const checkPremium = async (req, res, next) => {
  try {
    const userEmail = req.headers['x-user-email'];
    if (!userEmail) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.isPremium) {
      return res.status(403).json({ error: 'Premium feature requires subscription' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Premium check error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// API Routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Roomus API!' });
});

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    // In a real app, hash the password before saving
    const user = new User({
      email,
      name,
      password, // Note: In production, hash the password before saving
      isPremium: false
    });
    
    await user.save();
    
    // In a real app, send a verification email
    res.status(201).json({ 
      message: 'User registered successfully',
      user: { email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Save compatibility test results
app.post('/api/compatibility/save', requireAuth, async (req, res) => {
  try {
    console.log('Received compatibility save request:', req.body);
    const { answers } = req.body;
    const user = req.user;
    
    if (!answers || !Array.isArray(answers)) {
      console.error('Invalid answers format:', answers);
      return res.status(400).json({ error: 'Invalid answers format' });
    }
    
    // Update user's compatibility answers
    user.compatibilityAnswers = answers.map((answer, index) => {
      const answerValue = parseInt(answer);
      if (isNaN(answerValue)) {
        console.error(`Invalid answer at index ${index}:`, answer);
        throw new Error(`Invalid answer at index ${index}`);
      }
      return {
        questionId: index,
        answer: answerValue
      };
    });
    
    console.log('Saving user with answers:', user.compatibilityAnswers);
    await user.save();
    
    console.log('Compatibility test saved successfully for user:', user.email);
    res.json({ 
      success: true, 
      message: 'Compatibility test saved successfully',
      answers: user.compatibilityAnswers
    });
  } catch (error) {
    console.error('Save compatibility error:', error);
    res.status(500).json({ 
      error: 'Failed to save compatibility test',
      details: error.message 
    });
  }
});

// Get compatible matches
app.get('/api/matches', requireAuth, async (req, res) => {
  try {
    const currentUser = req.user;
    
    // Get all users except the current one
    const users = await User.find({ _id: { $ne: currentUser._id } });
    
    // Calculate compatibility scores
    const matches = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      score: currentUser.calculateCompatibility(user)
    }))
    .filter(match => match.score > 0) // Only include matches with some compatibility
    .sort((a, b) => b.score - a); // Sort by score (highest first)
    
    res.json({ matches });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: 'Failed to get matches' });
  }
});

// Check premium status
app.get('/api/premium/check', requireAuth, (req, res) => {
  res.json({ isPremium: req.user.isPremium });
});

// Protected premium endpoint example
app.get('/api/premium/feature', checkPremium, (req, res) => {
  res.json({ 
    message: 'This is a premium feature!',
    data: 'Premium content here' 
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Specific route for compatibility test
app.get('/compatibility-test.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'compatibility-test.html'));
});

// Route for matches page
app.get('/matches.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/matches.html'));
});

// Handle all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Serving static files from: ${__dirname}`);
});
