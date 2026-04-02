const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://4khdhub.dad';
const CINEMETA_URL = 'https://v3-cinemeta.strem.io/meta';

async function getTitleFromCinemeta(type, id) {
    try {
        // id is usually in the format tt1234567
        // Series might be tt1234567:1:2 (id:season:episode)
        const pureId = id.split(':')[0];
        const res = await axios.get(`${CINEMETA_URL}/${type}/${pureId}.json`);
        return res.data.meta.name;
    } catch (err) {
        console.error('Error fetching Cinemeta:', err.message);
        return null;
    }
}

async function searchAndScrape(title, type = 'movie', season = null, episode = null) {
    try {
        let searchQuery = title;
        // If it's a specific episode, some sites use "S01E05" or "EP05" formats.
        if (type === 'series' && season && episode) {
            // zero pad episode, e.g. 1 -> 01
            const epPad = episode.padStart(2, '0');
            searchQuery = `${title} EP${epPad}`;
        }
        
        console.log(`Searching 4KHDHub for: ${searchQuery}`);
        const searchUrl = `${BASE_URL}/?s=${encodeURIComponent(searchQuery)}`;
        const searchRes = await axios.get(searchUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        
        const $ = cheerio.load(searchRes.data);
        
        // Find the first article/post link that matches our search roughly
        // The articles usually have a class like "post-item" or are inside an <article>
        // Depending on the exact HTML, let's look for standard WordPress links inside standard wrappers.
        let movieUrl = null;
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && (href.includes('-movie-') || href.includes('-series-') || href.includes('-ep')) && href.toLowerCase().includes(title.toLowerCase().replace(/[^a-z0-9]/g, '-'))) {
                if (type === 'series' && episode) {
                    const epPad = episode.padStart(2, '0');
                    if (href.includes(`-ep${epPad}-`) || $(el).text().includes(`EP${epPad}`)) {
                        movieUrl = href.startsWith('http') ? href : BASE_URL + href;
                        return false;
                    }
                } else {
                    movieUrl = href.startsWith('http') ? href : BASE_URL + href;
                    return false; // break
                }
            }
        });

        // Fallback: Just grab the first search result link
        if (!movieUrl) {
            const firstResult = $('h3 a').first().attr('href') || $('article a').first().attr('href') || $('.post-item a').first().attr('href');
            if (firstResult) {
                movieUrl = firstResult.startsWith('http') ? firstResult : BASE_URL + firstResult;
            }
        }

        if (!movieUrl) {
            console.log('No movie page found for', title);
            return [];
        }

        console.log(`Found movie page: ${movieUrl}`);
        
        // Fetch the movie page
        const moviePageRes = await axios.get(movieUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $$ = cheerio.load(moviePageRes.data);

        const streams = [];

        // In the parsed HTML from our earlier view_file, links are like:
        // 18.22 GB Hindi, Tamil ... WEB-DL -> inside a code block or standard text
        // Followed by <a href="https://gadgetsweb.xyz/?id=...">Download HubCloud</a>
        
        let currentInfo = "1080p"; // Default fallback
        $$('*').each((i, el) => {
            const text = $$(el).text().trim();
            // Look for size/quality info text (e.g. "GB" and "WEB-DL")
            if (text.includes(' GB ') || text.includes(' MB ') || text.includes('1080p') || text.includes('2160p') || text.includes('720p')) {
                // Ignore huge texts
                if (text.length < 200) {
                     currentInfo = text.replace(/[\r\n]+/g, ' ');
                }
            }

            if (el.tagName === 'a') {
                const href = $$(el).attr('href');
                if (href && href.includes('gadgetsweb.xyz')) {
                    const hosterName = text || 'Ext Link';
                    streams.push({
                        name: `4KHDHub\n${hosterName}`,
                        title: currentInfo,
                        externalUrl: href
                    });
                }
            }
        });

        // Return unique streams (sometimes duplicate buttons exist)
        const uniqueStreams = [];
        const seenUrls = new Set();
        for (const s of streams) {
            if (!seenUrls.has(s.externalUrl)) {
                seenUrls.add(s.externalUrl);
                uniqueStreams.push(s);
            }
        }
        
        return uniqueStreams;
    } catch (err) {
        console.error('Error scraping 4KHDHub:', err.message);
        return [];
    }
}

module.exports = { getTitleFromCinemeta, searchAndScrape };
