require('dotenv').config();

const config = {
    PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    MODEL: "sonar"  // Real-time web access, no knowledge cutoff
};

module.exports = config;
