const express = require('express');
const app = express();
const port = 8000;

// Simple health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Rewards API is running',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Simple API endpoints for testing
app.get('/rewards/options', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        type: 'cashback',
        name: 'Cashback',
        description: 'Convert points to cash rewards',
        minPoints: 100,
        conversionRate: 0.01,
        maxRedemption: 10000,
      },
      {
        type: 'voucher_amazon',
        name: 'Amazon Gift Card',
        description: 'Amazon shopping voucher',
        minPoints: 500,
        conversionRate: 0.01,
        maxRedemption: 5000,
      },
      {
        type: 'voucher_starbucks',
        name: 'Starbucks Gift Card',
        description: 'Starbucks coffee voucher',
        minPoints: 250,
        conversionRate: 0.01,
        maxRedemption: 2500,
      },
      {
        type: 'discount_coupon',
        name: 'Discount Coupon',
        description: 'Platform discount coupon',
        minPoints: 50,
        conversionRate: 0.02,
        maxRedemption: 1000,
      },
    ]
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Simple server running on http://0.0.0.0:${port}`);
});