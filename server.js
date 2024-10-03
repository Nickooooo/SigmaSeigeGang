const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;

// List of banned IPs
let bannedIPs = [];

// Function to send IP to Discord webhook
const sendIPToDiscord = (ip) => {
    const webhookUrl = "https://discord.com/api/webhooks/1291437248486703134/T3fO_YIKnCnHluD9J2zA6cMBpcbSoc2YIQr02h0oiMeOpmC_HG3GfbqQnHrptoIKiscZ";
    axios.post(webhookUrl, {
        content: `Admin Panel Accessed from IP: ${ip}`
    }).then(() => {
        console.log(`IP ${ip} sent to Discord webhook.`);
    }).catch(err => {
        console.error('Error sending to Discord webhook:', err.message);
    });
};

// Middleware to get client IP
app.use((req, res, next) => {
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    console.log(`Incoming request from IP: ${clientIP}`); // Log the incoming IP

    // Check if IP is banned
    if (bannedIPs.includes(clientIP)) {
        console.log(`Access denied for banned IP: ${clientIP}`); // Log the banned IP
        return res.status(403).send("Access denied. Your IP is banned.");
    }

    req.clientIP = clientIP;
    next();
});

// Admin panel access endpoint
app.get('/admin-access', (req, res) => {
    const clientIP = req.clientIP;
    
    // Send IP to Discord webhook
    sendIPToDiscord(clientIP);
    
    // Respond indicating access was granted
    res.send("Admin panel accessed. IP sent to Discord.");
});

// Route to ban an IP
app.post('/ban-ip', express.json(), (req, res) => {
    const ipToBan = req.body.ip;
    if (!ipToBan) {
        return res.status(400).send("IP address is required.");
    }

    // Add IP to banned list
    bannedIPs.push(ipToBan);
    res.send(`IP ${ipToBan} is now banned.`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
