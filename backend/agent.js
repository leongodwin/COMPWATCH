const axios = require('axios');
const config = require('./config');
const { structureWithGemini } = require('./gemini-structurer');

const API_URL = 'https://api.perplexity.ai/chat/completions';

async function researchCompany(companyName) {
    console.log(`[Perplexity] Researching ${companyName}...`);

    // Load competitor URLs for targeted research
    const competitorUrls = require('./competitor-urls.json');
    const urls = competitorUrls[companyName] || {};

    // Stage 1: Let Perplexity research in natural language (no strict JSON requirement)
    const researchPrompt = `You are a Tier-1 Competitive Intelligence Analyst for Cloud Direct, tracking competitor "${companyName}" in the UK cloud services market.

**CRITICAL: Focus on 2025-2026 data only. Search for the most recent information available.**

**Target Sources (prioritize these URLs):**
${urls.news_page ? `- News: ${urls.news_page}` : ''}
${urls.linkedin ? `- LinkedIn: ${urls.linkedin}` : ''}
${urls.careers ? `- Careers: ${urls.careers}` : ''}
${urls.website ? `- Website: ${urls.website}` : ''}

Research and provide detailed information about:
    
1. **LinkedIn Activity** (check their LinkedIn company page directly)
   - How often do they post? (estimate posts per week in 2025-2026)
   - What are their top 3 content themes? (e.g., AI/ML, Security, Microsoft Copilot)
   - Any notable viral or high-engagement posts in 2025-2026?

2. **Microsoft Partner Status**
   - Current partner level (Solutions Partner, Gold, etc.)
   - Any specializations or designations?
   - Recent upgrades or changes in 2025-2026?

3. **Marketing Campaigns**
   - Named campaigns in 2025-2026 (e.g., "Summer of Cloud 2025")
   - Campaign themes and target industries

4. **Events & Webinars**
   - Recent or upcoming events in 2025-2026 (with dates)
   - Topics and target audiences

5. **Hiring Trends**
   - Are they hiring aggressively in any area? (AI, sales, etc.)
   - New executive hires or leadership changes in 2025-2026?

6. **Strategic News**
   - Partnerships, acquisitions, product launches in 2025-2026
   - Is this good or bad news for Cloud Direct?

**Search Strategy:**
- Use site:linkedin.com/company/${companyName.toLowerCase().replace(/ /g, '-')} for LinkedIn data
- Check their news page for recent announcements
- Look for press releases and industry publications from 2025-2026

Provide as much detail as possible. You can respond in natural language - you don't need to format as JSON.`;

    try {
        // Stage 1: Perplexity Research
        const response = await axios.post(API_URL, {
            model: config.MODEL,
            messages: [
                { role: "system", content: "You are an elite competitive intelligence analyst. Be thorough and specific." },
                { role: "user", content: researchPrompt }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${config.PERPLEXITY_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const rawResearch = response.data.choices[0].message.content;
        console.log(`[Perplexity] ✅ Research complete for ${companyName}`);

        // Stage 2: Gemini Structuring
        const structuredData = await structureWithGemini(rawResearch, companyName);

        return structuredData;

    } catch (error) {
        console.error(`[Pipeline] Error for ${companyName}:`, error.message);

        // Return structured error
        return {
            company: companyName,
            status: "ERROR",
            error_code: error.response ? `API_${error.response.status}` : "PIPELINE_FAILED",
            error_msg: error.message,
            summary: "Two-stage pipeline failed. Manual review required.",
            linkedin_activity: {},
            microsoft_partner_status: {},
            campaigns: [], events: [], hiring_trends: [], news: []
        };
    }
}

module.exports = { researchCompany };
