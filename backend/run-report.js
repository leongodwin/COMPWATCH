const fs = require('fs');
const path = require('path');
const { researchCompany } = require('./agent');
const { generateExecutiveSummary } = require('./executive-summary');
const companies = require('./companies');

const OUTPUT_DIR = path.join(__dirname, '../frontend/src/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'latest-report.json');

async function run() {
    console.log("🚀 Starting Tier 1 Intelligence Report Generation...");

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const results = [];

    // Analytics Aggregation
    const stats = {
        totalEvents: 0,
        totalHiringTrends: 0,
        totalNews: 0,
        activeCampaigns: 0,
        linkedInActivity: 0,
        marketShare: {}
    };

    // Process companies with retry logic
    for (const company of companies) {
        let data = await researchCompany(company.name);

        if (data.status === "ERROR") {
            console.log(`[Retry] Retrying ${company.name} once...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            data = await researchCompany(company.name);
        }

        if (data.status === "SUCCESS") {
            stats.totalEvents += (data.events?.length || 0);
            stats.totalHiringTrends += (data.hiring_trends?.length || 0);
            stats.totalNews += (data.news?.length || 0);
            stats.activeCampaigns += (data.campaigns?.length || 0);

            // Calculate activity score for market share
            const activityScore = (data.events?.length || 0) +
                (data.campaigns?.length || 0) +
                (data.news?.length || 0);
            stats.marketShare[company.name] = activityScore;
        }

        results.push(data);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Convert market share to percentages
    const totalActivity = Object.values(stats.marketShare).reduce((a, b) => a + b, 0);
    if (totalActivity > 0) {
        Object.keys(stats.marketShare).forEach(company => {
            stats.marketShare[company] = ((stats.marketShare[company] / totalActivity) * 100).toFixed(1);
        });
    }

    // Generate executive summary
    console.log("📊 Generating Executive Summary...");
    const executiveSummary = await generateExecutiveSummary({ companies: results });

    const finalReport = {
        generatedAt: new Date().toISOString(),
        analytics: stats,
        executiveSummary: executiveSummary,
        companies: results
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalReport, null, 2));
    console.log(`✅ Report generated successfully! Saved to ${OUTPUT_FILE}`);
    console.log(`📈 Top Insights:`);
    executiveSummary.insights?.forEach((insight, i) => {
        console.log(`   ${i + 1}. ${insight}`);
    });
}

run();
