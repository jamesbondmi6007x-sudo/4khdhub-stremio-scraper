const express = require('express');
const cors = require('cors');
const path = require('path');
const { getRouter } = require('stremio-addon-sdk');
const addonInterface = require('./addon');

const app = express();
app.use(cors());

// Serve the static configuration page
app.use(express.static(path.join(__dirname, '../public')));

// Set up the Stremio Addon routes (/manifest.json, /catalog/..., /stream/...)
const addonRouter = getRouter(addonInterface);
app.use('/', addonRouter);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
    console.log(`[4KHDHub Scraper] Addon running at: http://127.0.0.1:${PORT}`);
    console.log(`[4KHDHub Scraper] Manifest URL: http://127.0.0.1:${PORT}/manifest.json`);
    console.log(`[4KHDHub Scraper] Configure UI: http://127.0.0.1:${PORT}/`);
});
