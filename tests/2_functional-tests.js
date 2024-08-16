const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    this.timeout(5000);
    // Test: Viewing one stock
    test('Viewing one stock: GET request to /api/stock-prices/', function(done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'GOOG' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body.stockData, 'Stock data should be an object');
          assert.property(res.body.stockData, 'stock', 'Stock data should contain stock');
          assert.property(res.body.stockData, 'price', 'Stock data should contain price');
          assert.property(res.body.stockData, 'likes', 'Stock data should contain likes');
          done();
        });
    });
  
    // Test: Viewing one stock and liking it
    test('Viewing one stock and liking it: GET request to /api/stock-prices/', function(done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'GOOG', like: 'true' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body.stockData, 'Stock data should be an object');
          assert.property(res.body.stockData, 'stock', 'Stock data should contain stock');
          assert.property(res.body.stockData, 'price', 'Stock data should contain price');
          assert.property(res.body.stockData, 'likes', 'Stock data should contain likes');
          assert.isAbove(res.body.stockData.likes, 0, 'Likes should be greater than 0');
          done();
        });
    });
  
    // Test: Viewing the same stock and liking it again
    test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', function(done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'GOOG', like: 'true' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body.stockData, 'Stock data should be an object');
          assert.property(res.body.stockData, 'stock', 'Stock data should contain stock');
          assert.property(res.body.stockData, 'price', 'Stock data should contain price');
          assert.property(res.body.stockData, 'likes', 'Stock data should contain likes');
          // Assuming the previous like was from the same IP, likes should not increase.
          assert.isAtMost(res.body.stockData.likes, 1, 'Likes should not increase for the same IP');
          done();
        });
    });
  
    // Test: Viewing two stocks
    test('Viewing two stocks: GET request to /api/stock-prices/', function(done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: ['GOOG', 'MSFT'] })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData, 'Stock data should be an array');
          assert.lengthOf(res.body.stockData, 2, 'Stock data should contain two stocks');
          assert.property(res.body.stockData[0], 'stock', 'First stock data should contain stock');
          assert.property(res.body.stockData[0], 'price', 'First stock data should contain price');
          assert.property(res.body.stockData[0], 'rel_likes', 'First stock data should contain rel_likes');
          assert.property(res.body.stockData[1], 'stock', 'Second stock data should contain stock');
          assert.property(res.body.stockData[1], 'price', 'Second stock data should contain price');
          assert.property(res.body.stockData[1], 'rel_likes', 'Second stock data should contain rel_likes');
          done();
        });
    });
  
    // Test: Viewing two stocks and liking them
    test('Viewing two stocks and liking them: GET request to /api/stock-prices/', function(done) {
      chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: ['GOOG', 'MSFT'], like: 'true' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData, 'Stock data should be an array');
          assert.lengthOf(res.body.stockData, 2, 'Stock data should contain two stocks');
          assert.property(res.body.stockData[0], 'stock', 'First stock data should contain stock');
          assert.property(res.body.stockData[0], 'price', 'First stock data should contain price');
          assert.property(res.body.stockData[0], 'rel_likes', 'First stock data should contain rel_likes');
          assert.property(res.body.stockData[1], 'stock', 'Second stock data should contain stock');
          assert.property(res.body.stockData[1], 'price', 'Second stock data should contain price');
          assert.property(res.body.stockData[1], 'rel_likes', 'Second stock data should contain rel_likes');
          done();
        });
    });
  
  });
  
