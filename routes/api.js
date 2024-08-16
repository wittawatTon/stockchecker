'use strict';

module.exports = function (app) {

  const express = require('express');
  const axios = require('axios');
  const mongoose = require('mongoose');
  const crypto = require('crypto');
  
  // Connect to MongoDB
  mongoose.connect(process.env.MONGO_URI, {});
  
  // Stock schema and model
  const stockSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    likes: { type: Number, default: 0 },
    ipAddresses: { type: [String], default: [] } // Store anonymized IP addresses
  });
  
  const Stock = mongoose.model('Stock', stockSchema);
  
  // Function to anonymize IP address
  function anonymizeIp(ip) {
    return crypto.createHash('sha256').update(ip).digest('hex');
  }
  
  // Utility function to fetch stock price
  const fetchStockPrice = async (stock) => {
    try {
      const response = await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`);
      return response.data.latestPrice;
    } catch (error) {
      console.error(`Error fetching stock price for ${stock}:`, error.message);
      return null;
    }
  };
  
  // Route to get stock prices
  app.get('/api/stock-prices', async (req, res) => {
    const { stock, like } = req.query;
    const userIp = anonymizeIp(req.ip); // Anonymize the user's IP address
  
    if (Array.isArray(stock)) {
      // Handling multiple stocks
      const stockData = await Promise.all(stock.map(async (symbol) => {
        const price = await fetchStockPrice(symbol);
        let stockDoc = await Stock.findOne({ symbol });
  
        if (!stockDoc) {
          stockDoc = new Stock({ symbol });
        }
  
        if (like === 'true' && !stockDoc.ipAddresses.includes(userIp)) {
          stockDoc.likes += 1;
          stockDoc.ipAddresses.push(userIp); // Save the anonymized IP
          await stockDoc.save();
        }
  
        return { stock: symbol, price, likes: stockDoc.likes };
      }));
  
      const rel_likes = stockData[0].likes - stockData[1].likes;
  
      res.json({
        stockData: [
          { ...stockData[0], rel_likes },
          { ...stockData[1], rel_likes: -rel_likes }
        ]
      });
    } else {
      // Handling single stock
      const price = await fetchStockPrice(stock);
      let stockDoc = await Stock.findOne({ symbol: stock });
  
      if (!stockDoc) {
        stockDoc = new Stock({ symbol: stock });
      }
  
      if (like === 'true' && !stockDoc.ipAddresses.includes(userIp)) {
        stockDoc.likes += 1;
        stockDoc.ipAddresses.push(userIp); // Save the anonymized IP
        await stockDoc.save();
      }
  
      res.json({
        stockData: {
          stock: stock,
          price: price,
          likes: stockDoc.likes
        }
      });
    }
  });
  
 
    
};
