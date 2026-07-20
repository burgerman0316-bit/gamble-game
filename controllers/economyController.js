const { state } = require('../config');

exports.buyStock = (req, res) => {
    const { playerId, ticker, quantity } = req.body;
    const player = state.players[playerId];
    const stock = state.economy.stocks[ticker];
    
    if (!stock) return res.status(404).json({ error: 'Asset symbol not found.' });
    
    const cost = stock.price * quantity;
    if (player.wallet.balance < cost) return res.status(400).json({ error: 'Insufficient funds for stock purchase.' });
    
    player.wallet.balance -= cost;
    player.assets.stocks[ticker] = (player.assets.stocks[ticker] || 0) + quantity;
    
    res.json({ message: 'Stock asset purchased successfully.', assets: player.assets, balance: player.wallet.balance });
};

exports.getLeaderboards = (req, res) => {
    const rankings = Object.values(state.players)
        .map(p => ({
            id: p.id,
            username: p.username,
            balance: p.wallet.balance,
            totalSpent: p.wallet.totalSpent
        }))
        .sort((a, b) => b.balance - a.balance)
        .slice(0, 10);
        
    res.json({ leaderboard: rankings });
};
