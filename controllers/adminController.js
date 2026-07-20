const { state } = require('../config');

exports.getDashboard = (req, res) => {
    res.json({
        totalPlayers: Object.keys(state.players).length,
        adminsList: state.admins,
        currentEvents: state.globalEvents,
        economyStatus: state.economy,
        players: state.players
    });
};

exports.adjustBalance = (req, res) => {
    const { targetPlayerId, amount, action } = req.body;
    const player = state.players[targetPlayerId];
    
    if (!player) return res.status(404).json({ error: 'Target player not found.' });
    
    if (action === 'grant') {
        player.wallet.balance += Number(amount);
    } else if (action === 'take') {
        player.wallet.balance = Math.max(0, player.wallet.balance - Number(amount));
    } else {
        return res.status(400).json({ error: 'Invalid action configuration.' });
    }
    
    res.json({ message: `Successfully executed ${action} of $${amount}`, player });
};

exports.setBanStatus = (req, res) => {
    const { targetPlayerId, isBanned } = req.body;
    const player = state.players[targetPlayerId];
    
    if (!player) return res.status(404).json({ error: 'Target player not found.' });
    
    player.isBanned = isBanned;
    res.json({ message: `Player ban status adjusted to: ${isBanned}`, player });
};

exports.managePrivileges = (req, res) => {
    const { targetPlayerId, action } = req.body;
    
    if (action === 'promote') {
        if (!state.admins.includes(targetPlayerId)) {
            state.admins.push(targetPlayerId);
        }
    } else if (action === 'demote') {
        state.admins = state.admins.filter(id => id !== targetPlayerId);
    } else {
        return res.status(400).json({ error: 'Invalid privilege command.' });
    }
    
    res.json({ message: `Privilege adjustment executed. Current admins:`, admins: state.admins });
};

exports.triggerEvent = (req, res) => {
    const { eventType } = req.body;
    
    switch(eventType) {
        case 'LUCK_BOOST':
            state.globalEvents.luckMultiplier = 2.0;
            state.globalEvents.payoutMultiplier = 1.2;
            state.globalEvents.currentEventName = 'Lady Luck Smiles Event';
            break;
            
        case 'PAYOUT_FRENZY':
            state.globalEvents.luckMultiplier = 1.0;
            state.globalEvents.payoutMultiplier = 2.5;
            state.globalEvents.currentEventName = 'Double Payout Madness';
            break;
            
        case 'STOCK_CRASH':
            state.globalEvents.currentEventName = 'Market Panic: Stocks Crash!';
            for (let ticker in state.economy.stocks) {
                state.economy.stocks[ticker].price = Math.floor(state.economy.stocks[ticker].price * 0.3);
            }
            break;
            
        case 'PROPERTY_CRASH':
            state.globalEvents.currentEventName = 'Housing Bubble Burst!';
            for (let prop in state.economy.properties) {
                state.economy.properties[prop].price = Math.floor(state.economy.properties[prop].price * 0.5);
            }
            break;
            
        case 'RESET_NORMAL':
            state.globalEvents.luckMultiplier = 1.0;
            state.globalEvents.payoutMultiplier = 1.0;
            state.globalEvents.currentEventName = 'Normal Operations';
            break;
            
        default:
            return res.status(400).json({ error: 'Unknown system event identifier.' });
    }
    
    res.json({ message: 'Global event successfully synchronized.', systemState: state.globalEvents, economy: state.economy });
};
