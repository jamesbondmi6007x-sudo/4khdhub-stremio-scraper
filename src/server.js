const express = require('express');
const cors = require('cors');
const path = require('path');
const { getRouter } = require('stremio-addon-sdk');
const addonInterface = require('./addon');

const app = express();
app.use(cors());

// Serve Configure UI
app.use(express.static(path.join(__dirname, '../public')));

const addonRouter = getRouter(addonInterface);

// Use SDK router for Stremio manifest and streams
app.use('/', addonRouter);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
    console.log(`[4KHDHub Scraper] Addon running at: http://127.0.0.1:${PORT}`);
    console.log(`[4KHDHub Scraper] Manifest URL: http://127.0.0.1:${PORT}/manifest.json`);
    console.log(`[4KHDHub Scraper] Configure UI: http://127.0.0.1:${PORT}/`);
});
