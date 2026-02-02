const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('./config');

const genAI = new GoogleGenerativeAI(config.GOOGLE_API_KEY);

async function structureWithGemini(rawText, companyName) {
    console.log(`[Gemini] Structuring data for ${companyName}...`);

    // Use gemini-2.5-flash (current stable model replacing deprecated 1.5)
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash'
    });

    const prompt = `You are a data structuring AI. Extract the following competitive intelligence data into a strict JSON schema.

**RAW RESEARCH DATA:**
${rawText}

**REQUIRED JSON SCHEMA:**
{
    "company": "${companyName}",
    "summary": "Strategic summary from Cloud Direct's perspective",
    "linkedin_activity": {
        "post_frequency": "X posts/week or Unknown",
        "top_themes": ["theme1", "theme2", "theme3"],
        "notable_posts": ["brief description"]
    },
    "microsoft_partner_status": {
        "current_level": "...",
        "specializations": ["..."],
        "recent_changes": "..."
    },
    "campaigns": [ { "name": "...", "description": "...", "date": "YYYY-MM-DD" } ],
    "events": [ { "date": "YYYY-MM-DD", "title": "...", "link": "..." } ],
    "hiring_trends": [ { "trend": "...", "details": "..." } ],
    "news": [ { "title": "...", "date": "YYYY-MM-DD", "sentiment": "Positive|Neutral|Negative", "source": "..." } ]
}

**RULES:**
1. Extract data from the raw text above
2. If data is missing for a field, use empty arrays/objects or "Unknown"
3. Ensure dates are in YYYY-MM-DD format
4. Return ONLY the JSON object, no markdown fences, no explanations
5. The "company" field MUST be "${companyName}"`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        let jsonText = response.text();

        // Robust JSON extraction
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const firstBrace = jsonText.indexOf('{');
        const lastBrace = jsonText.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            jsonText = jsonText.substring(firstBrace, lastBrace + 1);
        }

        // Parse and validate
        const structured = JSON.parse(jsonText);

        // Add metadata
        structured.status = "SUCCESS";
        structured.lastUpdated = new Date().toISOString();

        console.log(`[Gemini] ✅ Structured data for ${companyName}`);
        return structured;

    } catch (error) {
        console.error(`[Gemini] Error structuring ${companyName}:`, error.message);
        throw error; // Re-throw so caller can handle
    }
}

module.exports = { structureWithGemini };
