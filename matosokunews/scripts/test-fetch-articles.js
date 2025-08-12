// テスト用スクリプト
const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:3001/api/cron/fetch-articles';
const API_KEY = process.env.CRON_SECRET || 'your-secret-key-here';

async function testFetchArticles() {
  console.log('Testing fetch-articles API...');
  
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    if (response.status >= 400) {
      console.error('API request failed with status:', response.status);
      process.exit(1);
    }
    
    console.log('API test completed successfully!');
    process.exit(0);
  } catch (error) {
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

testFetchArticles();
