const axios = require('axios');

async function debug2() {
    try {
        console.log("Hitting Live Render for Dune (tt1160419) and Crime 101 (tt32430579)...");
        const urls = [
            'https://stremio-4khdhub-scraper.onrender.com/stream/movie/tt32430579.json',
            'https://stremio-4khdhub-scraper.onrender.com/stream/series/tt10986410:1:1.json'
        ];

        for (const u of urls) {
            console.log(`\nGET ${u}`);
            try {
                const res = await axios.get(u);
                console.log(`Status: ${res.status}`);
                console.log(`Streams found: ${res.data.streams ? res.data.streams.length : 0}`);
                if (res.data.streams && res.data.streams.length > 0) {
                    console.log(`First Stream:`, res.data.streams[0]);
                }
            } catch (err) {
                 console.log(`Request Failed! ${err.message}`);
                 if (err.response) {
                     console.log(err.response.data);
                 }
            }
        }
    } catch(e) {
        console.error("Critical error", e.message);
    }
}
debug2();
