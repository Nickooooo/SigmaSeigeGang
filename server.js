const express = require('express');
const app = express();
const path = require('path');

// Serve the static files
app.use(express.static('public'));

// Middleware to get the user's IP
app.use((req, res, next) => {
    const userIP = req.ip || req.connection.remoteAddress;
    res.locals.userIP = userIP;
    next();
});

// Route to serve the HTML file with IP detection
app.get('/', (req, res) => {
    const userIP = req.ip || req.connection.remoteAddress;
    const adminIP = '180.150.65.85';

    // Send the HTML page
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
