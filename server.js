const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Leaderboard data (In-memory for simplicity)
let leaderboard = [];

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Make sure your HTML file is named index.html
});

// API endpoint to get the leaderboard
app.get('/api/leaderboard', (req, res) => {
    res.json(leaderboard);
});

// API endpoint to submit a score
app.post('/api/leaderboard', (req, res) => {
    const { name, score } = req.body;

    // Add the new score to the leaderboard
    leaderboard.push({ name, score });

    // Sort the leaderboard by score (descending)
    leaderboard.sort((a, b) => b.score - a.score);

    // Keep only the top 10 scores
    leaderboard = leaderboard.slice(0, 10);

    res.json(leaderboard);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
