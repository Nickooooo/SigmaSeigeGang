const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Leaderboard data
let leaderboardAllTime = [];
let leaderboardToday = [];
let today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Make sure your HTML file is named index.html
});

// API endpoint to get the leaderboard
app.get('/api/leaderboard', (req, res) => {
    res.json({
        allTime: leaderboardAllTime,
        today: leaderboardToday,
    });
});

// API endpoint to submit a score
app.post('/api/leaderboard', (req, res) => {
    const { name, score } = req.body;

    // Update today's leaderboard
    updateLeaderboard(leaderboardToday, name, score);
    
    // Update all-time leaderboard
    updateLeaderboard(leaderboardAllTime, name, score);
    
    // Send back the updated leaderboard
    res.json({
        today: leaderboardToday,
        allTime: leaderboardAllTime,
    });
});

// Function to update the leaderboard
function updateLeaderboard(leaderboard, name, score) {
    // Check if the leaderboard is for today
    if (leaderboard === leaderboardToday) {
        // Reset today's leaderboard if it's a new day
        const currentDay = new Date().toISOString().slice(0, 10);
        if (today !== currentDay) {
            leaderboard.length = 0; // Clear the leaderboard
            today = currentDay; // Update today's date
        }
    }

    // Add the new score to the leaderboard
    leaderboard.push({ name, score });

    // Sort the leaderboard by score (descending)
    leaderboard.sort((a, b) => b.score - a.score);

    // Keep only the top 5 scores
    leaderboard.splice(5);
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
