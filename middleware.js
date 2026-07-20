// middleware.js
const { state } = require('./config');

// Forces Vercel to treat this as a standard Serverless function instead of an Edge function
export const config = {
    runtime: 'nodejs'
};

// Middleware to check if a user is in the admin array
function isAdmin(req, res, next) {
    const userId = req.headers['x-user-id'];
    if (!userId || !state.admins.includes(userId)) {
        return res.status(403).json({ error: 'Access Denied: You do not possess administrative clearance.' });
    }
    next();
}

// Middleware to check if player is banned or exists
function checkPlayerStatus(req, res, next) {
    const playerId = req.body.playerId || req.query.playerId;
    if (!playerId || !state.players[playerId]) {
        return res.status(404).json({ error: 'Player account not found.' });
    }
    if (state.players[playerId].isBanned) {
        return res.status(403).json({ error: 'This account has been permanently suspended.' });
    }
    next();
}

module.exports = {
    isAdmin,
    checkPlayerStatus
};
