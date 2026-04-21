const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the renderer directory
app.use(express.static(path.join(__dirname, 'renderer')));

// Serve firebase.js from root
app.use('/firebase.js', express.static(path.join(__dirname, 'firebase.js')));

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'renderer', 'dashboard.html'));
});

// Export the app for Vercel (this is the key change)
module.exports = app;

// Only listen locally when running directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Web app running at http://localhost:${PORT}`);
  });
}