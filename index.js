const express = require('express');
const cors = require('cors');
const db = require('./firebase');

const app = express();
const port = process.env.PORT || 3000;

// Log environment info for debugging
console.log('Starting server with PORT:', port);
console.log('Node environment:', process.env.NODE_ENV);

app.use(express.json());

// Enable CORS for all routes - more permissive for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      // Add your Render frontend URL when deployed
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (process.env.NODE_ENV === 'production') {
      // In production, allow the deployed frontend URL
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

const feedbackCollection = db.collection('feedbacks');

// Validation helper
function validateFeedback(data, isCreate = true) {
  const errors = [];

  if (isCreate && !data.id) {
    errors.push('id is required');
  }

  if (!data.name || typeof data.name !== 'string') {
    errors.push('name is required and must be a string');
  }

  if (typeof data.age !== 'number' || data.age <= 0) {
    errors.push('age must be a positive number');
  }

  if (typeof data.rating !== 'number' || data.rating < 1 || data.rating > 10) {
    errors.push('rating must be a number between 1 and 10');
  }

  if (!data.description || typeof data.description !== 'string') {
    errors.push('description is required and must be a string');
  } else {
    const wordCount = data.description.trim().split(/\s+/).length;
    if (wordCount > 50) {
      errors.push('description must be under 50 words');
    }
  }

  return errors;
}

// CREATE (POST)
app.post('/feedbacks', async (req, res) => {
  try {
    const data = req.body;
    const errors = validateFeedback(data, true);
    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const docRef = feedbackCollection.doc(String(data.id));
    const existing = await docRef.get();
    if (existing.exists) {
      return res.status(409).json({ error: 'Feedback with this id already exists' });
    }

    await docRef.set({
      name: data.name,
      age: data.age,
      rating: data.rating,
      description: data.description,
    });

    res.status(201).json({ id: data.id, message: 'Feedback created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// READ ALL (GET)
app.get('/feedbacks', async (req, res) => {
  try {
    const snapshot = await feedbackCollection.get();
    const results = [];
    snapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// READ ONE (GET)
app.get('/feedbacks/:id', async (req, res) => {
  try {
    const docRef = feedbackCollection.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE (PUT)
app.put('/feedbacks/:id', async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    const errors = validateFeedback({ id, ...data }, false);
    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const docRef = feedbackCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    await docRef.update({
      name: data.name,
      age: data.age,
      rating: data.rating,
      description: data.description,
    });

    res.json({ id, message: 'Feedback updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE (DELETE)
app.delete('/feedbacks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const docRef = feedbackCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    await docRef.delete();
    res.json({ id, message: 'Feedback deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: port 
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Feedback API is running',
    endpoints: {
      'GET /feedbacks': 'Get all feedbacks',
      'GET /feedbacks/:id': 'Get specific feedback',
      'POST /feedbacks': 'Create feedback',
      'PUT /feedbacks/:id': 'Update feedback',
      'DELETE /feedbacks/:id': 'Delete feedback',
      'GET /health': 'Health check'
    }
  });
});
