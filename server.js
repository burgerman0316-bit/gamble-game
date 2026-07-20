const express = require('express');
const { state, generatePlayerId } = require('./config');
const { isAdmin, checkPlayerStatus } = require('./middleware');

// Import Controller Route Actions
const adminController = require('./controllers/adminController');
const economyController = require('./controllers/economyController');
const gameController = require('./controllers/gameController');

const app = express();
const PORT = 3000;

app.use(express.json());

// --- PLAYER ACCOUNT INITIALIZATION ---
app.post('/api/auth/register-or-login', (req, res) => {
    const { email, googleId, username } = req.body;
    
    let player = Object.values(state.players).find(p => p.email === email || (googleId && p.googleId === googleId));
    
    if (!player) {
        const newId = generatePlayerId();
        state.players[newId] = {
            id: newId,
            username: username || 'HighRoller',
            email: email,
            googleId: googleId || null,
            isBanned: false,
            wallet: {
                balance: 5000, 
                totalSpent: 0,
                totalWon: 0
            },
            assets: {
                stocks: {},      
                properties: []   
            }
        };
        player = state.players[newId];
    }
    
    res.json({ message: 'Authentication successful', player });
});

// --- ROUTE ATTACHMENTS ---

// Administrative Panel Routes
app.get('/api/admin/dashboard', isAdmin, adminController.getDashboard);
app.post('/api/admin/adjust-balance', isAdmin, adminController.adjustBalance);
app.post('/api/admin/set-ban-status', isAdmin, adminController.setBanStatus);
app.post('/api/admin/manage-privileges', isAdmin, adminController.managePrivileges);
app.post('/api/admin/trigger-event', isAdmin, adminController.triggerEvent);

// Game Function Routes
app.post('/api/games/slots', checkPlayerStatus, gameController.playSlots);

// Economic Subsystems & Global Tracking
app.post('/api/economy/buy-stock', checkPlayerStatus, economyController.buyStock);
app.get('/api/leaderboards', economyController.getLeaderboards);

app.listen(PORT, () => {
    console.log(`Modular Game Engine serving live traffic on port ${PORT}`);
});
