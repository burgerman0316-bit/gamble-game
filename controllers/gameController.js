const { state } = require('../config');

exports.playSlots = (req, res) => {
    const { playerId, betAmount } = req.body;
    const player = state.players[playerId];
    
    if (player.wallet.balance < betAmount) {
        return res.status(400).json({ error: 'Insufficient funds for this wager.' });
    }
    
    player.wallet.balance -= betAmount;
    player.wallet.totalSpent += betAmount;
    
    const symbols = ['🍒', '🍋', '🍊', '🔔', '💎', '7️⃣'];
    const reel1 = symbols[Math.floor(Math.random() * symbols.length)];
    const reel2 = symbols[Math.floor(Math.random() * symbols.length)];
    const reel3 = symbols[Math.floor(Math.random() * symbols.length)];
    
    let isWin = false;
    let baseWinMultiplier = 0;
    
    const winChanceRoll = Math.random() * state.globalEvents.luckMultiplier;
    
    if (reel1 === reel2 && reel2 === reel3) {
        isWin = true;
        baseWinMultiplier = reel1 === '7️⃣' ? 50 : 15;
    } else if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
        if (winChanceRoll > 1.4) {
            isWin = true;
            baseWinMultiplier = 3;
        }
    }
    
    let netPayout = 0;
    if (isWin) {
        netPayout = Math.floor(betAmount * baseWinMultiplier * state.globalEvents.payoutMultiplier);
        player.wallet.balance += netPayout;
        player.wallet.totalWon += netPayout;
    }
    
    res.json({
        reels: [reel1, reel2, reel3],
        won: isWin,
        payout: netPayout,
        currentBalance: player.wallet.balance
    });
};
