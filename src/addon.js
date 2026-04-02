const { addonBuilder } = require('stremio-addon-sdk');
const { getTitleFromCinemeta, searchAndScrape } = require('./scraper');

const manifest = {
    id: 'org.4khdhub.scraper',
    version: '1.0.0',
    name: '4KHDHub Scraper',
    description: 'Scrapes 4khdhub.dad for movie and web series links.',
    catalogs: [],
    resources: ['stream'],
    types: ['movie', 'series'],
    idPrefixes: ['tt'],
    logo: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&w=500&q=60'
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async ({ type, id }) => {
    console.log(`Incoming request for type: ${type}, id: ${id}`);
    
    // 1. Get the title from Cinemeta using the TT ID
    const title = await getTitleFromCinemeta(type, id);
    if (!title) {
        return { streams: [] };
    }

    // Extract season and episode if it's a series (tt12345:1:2)
    let season, episode;
    if (type === 'series') {
        const parts = id.split(':');
        if (parts.length === 3) {
            season = parts[1];
            episode = parts[2];
        }
    }

    // 2. Search and Scrape 4KHDHub
    const streams = await searchAndScrape(title, type, season, episode);

    if (!streams || streams.length === 0) {
        return {
            streams: [
                {
                    name: "DEBUG INFO",
                    title: `Failed to find links.\nTitle parsed: ${title}\nType: ${type}`,
                    url: "http://localhost/"
                }
            ]
        };
    }

    return { streams };
});

module.exports = builder.getInterface();
