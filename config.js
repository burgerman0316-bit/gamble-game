const crypto = require('crypto');

const state = {
    // Array of user IDs authorized to access the admin panel
    admins: ['admin_user_1', 'creator_id_99'],
    
    // Global game modifiers triggered by admins
    globalEvents: {
        luckMultiplier: 1.0,
        payoutMultiplier: 1.0,
        currentEventName: 'Normal Operations'
    },
    
    // Simulated market values
    economy: {
        stocks: {
            'MEGACORP': { price: 100, stability: 'stable' },
            'SHADOWTECH': { price: 50, stability: 'volatile' }
        },
        properties: {
            'DOWNTOWN_PENTHOUSE': { price: 500000, supply: 10 },
            'CASINO_HOTEL_SUITE': { price: 1200000, supply: 5 }
        }
    },
    
    // Player registry
    players: {}
};

function generatePlayerId() {
    return 'PLY-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

module.exports = {
    state,
    generatePlayerId
};
