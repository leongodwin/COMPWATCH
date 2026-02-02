const axios = require('axios');
const config = require('./config');

const API_URL = 'https://api.perplexity.ai/chat/completions';

async function generateExecutiveSummary(reportData) {
    console.log("[Executive Summary] Analyzing report data...");

    // Build context from all companies
    const context = reportData.companies
        .filter(c => c.status === "SUCCESS")
        .map(c => {
            const activityCount = (c.campaigns?.length || 0) + (c.events?.length || 0) + (c.news?.length || 0);
            return `${c.company}: ${activityCount} activities - ${c.summary}`;
        })
        .join('\n');

    const prompt = `You are analyzing competitive intelligence data for Cloud Direct's leadership team.

**DATA OVERVIEW:**
${context}

**YOUR TASK:**
Generate exactly 3 strategic insights that Cloud Direct's executives need to know RIGHT NOW.

**RULES:**
1. Focus on ACTIONABLE intelligence (not just facts)
2. Identify threats, opportunities, or market shifts
3. Be specific with company names and details
4. Each insight should be 15-25 words max
5. Prioritize Microsoft-related activities (Cloud Direct is a Microsoft partner)

Return ONLY a JSON object:
{
    "insights": [
        "Insight 1...",
        "Insight 2...",
        "Insight 3..."
    ],
    "top_mover": "Company name with most activity",
    "recommended_action": "One specific action Cloud Direct should take this week"
}`;

    try {
        const response = await axios.post(API_URL, {
            model: config.MODEL,
            messages: [
                { role: "system", content: "You are a strategic analyst for Cloud Direct. Be concise and actionable." },
                { role: "user", content: prompt }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${config.PERPLEXITY_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const content = response.data.choices[0].message.content;
        let cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
        const firstBrace = cleanContent.indexOf('{');
        const lastBrace = cleanContent.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            cleanContent = cleanContent.substring(firstBrace, lastBrace + 1);
        }

        return JSON.parse(cleanContent);

    } catch (error) {
        console.error("Error generating executive summary:", error.message);
        return {
            insights: ["Executive summary generation failed"],
            top_mover: "Unknown",
            recommended_action: "Manual analysis required"
        };
    }
}

module.exports = { generateExecutiveSummary };
