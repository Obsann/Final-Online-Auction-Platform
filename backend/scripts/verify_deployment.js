const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const CLIENT_URL = 'http://localhost:3000';

async function runTests() {
    console.log('🚀 Starting Verification Tests...\n');

    // 1. Test Frontend Accessibility
    try {
        const res = await axios.get(CLIENT_URL);
        console.log(`✅ Frontend accessible (${res.status})`);
    } catch (err) {
        console.error(`❌ Frontend check failed: ${err.message}`);
    }

    // 2. Test Backend Health
    try {
        const res = await axios.get(`${API_URL}/test`);
        console.log(`✅ Backend accessible: ${JSON.stringify(res.data)}`);
    } catch (err) {
        console.error(`❌ Backend check failed: ${err.message}`);
    }

    // 3. Test Login (with seeded user)
    let token;
    try {
        const res = await axios.post(`${API_URL}/auth/login`, {
            email: 'bidder@example.com',
            password: 'password123'
        });
        console.log(`✅ Login successful! Code: ${res.status}`);
        token = res.data.token;
    } catch (err) {
        console.error(`❌ Login failed: ${err.response ? err.response.data.message : err.message}`);
        process.exit(1);
    }

    // 4. Test Protected Route (Get User Profile)
    try {
        const res = await axios.get(`${API_URL}/auth/checkUser`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ Auth check successful! User: ${res.data.username}, Role: ${res.data.role}`);
    } catch (err) {
        console.error(`❌ Auth check failed: ${err.message}`);
    }

    // 5. Test Auction Fetching
    try {
        const res = await axios.get(`${API_URL}/auctions`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ Create/Fetch Auctions successful! Found ${res.data.length} auctions.`);
        if (res.data.length > 0) {
            console.log(`   - Auction 1 Item: ${res.data[0].itemId.title} [$${res.data[0].highestBid || res.data[0].finalPrice}]`);
        }
    } catch (err) {
        console.error(`❌ Auction fetch failed: ${err.message}`);
    }

    console.log('\n✨ Verification Complete!');
}

runTests();
