const express = require('express');
const router = express.Router();
const apiRouter = require('./api');
const path = require('path');

// **Use the API Router for All /api Routes**
router.use('/api', apiRouter);

// **Development-Only Test Route**
if (process.env.NODE_ENV !== 'production') {
  router.get('/hello/world', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken()); // Set CSRF token in cookies
    res.status(200).json({ message: 'Hello World!' });
  });
}

// **Root Route for the API**
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Luxury Car Service API!',
    status: 'Running',
  });
});

// **Serve React Build Files in Production**
if (process.env.NODE_ENV === 'production') {
  // Serve the frontend's index.html file at the root route
  router.get('/', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    return res.sendFile(
      path.resolve(__dirname, '../../frontend', 'dist', 'index.html')
    );
  });

  // Serve the static assets in the frontend's build folder
  router.use(express.static(path.resolve('../frontend/dist')));

  // Serve the frontend's index.html file for all other routes NOT starting with /api
  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    return res.sendFile(
      path.resolve(__dirname, '../../frontend', 'dist', 'index.html')
    );
  });
}

// **Restore CSRF Token (Development Only)**
if (process.env.NODE_ENV !== 'production') {
  router.get('/api/csrf/restore', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken()); // Set CSRF token in cookies
    return res.json({}); // Send an empty JSON response
  });
}

// **Temporary Test Route for CSRF Testing**
router.post('/api/test', (req, res) => {
  return res.json({ requestBody: req.body });
});

module.exports = router;