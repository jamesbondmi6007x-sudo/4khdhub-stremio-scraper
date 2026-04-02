const axios = require('axios');

async function testBypasser() {
    console.log("Testing Bypasser APIs...");
    const testUrl = 'https://gadgetsweb.xyz/?id=Lzk5ekNhbC81bU5SWTE3QTNMUW92Ry9wRG9rTVc2TlJZeFpsU3c9PQ==';
    
    // Test 1: Bypass.city API
    try {
        console.log("-> bypass.city");
        const res = await axios.get(`https://bypass.city/api/bypass?url=${encodeURIComponent(testUrl)}`);
        console.log("Response:", res.data);
    } catch(e) {
        console.log("Fail 1:", e.response ? e.response.status : e.message);
    }

    try {
        console.log("-> api.bypass.vip");
        const res = await axios.post(`https://api.bypass.vip/`, { url: testUrl });
        console.log("Response:", res.data);
    } catch(e) {
        console.log("Fail 2:", e.response ? e.response.status : e.message);
    }
}
testBypasser();
