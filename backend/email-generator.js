const fs = require('fs');
const path = require('path');

/**
 * Email Generator
 * Creates HTML email template with formatted competitive intelligence changes
 */

class EmailGenerator {
    constructor() {
        this.brandColor = '#3b82f6';  // Cloud Direct blue
        this.dangerColor = '#ef4444';
        this.warningColor = '#f59e0b';
        this.infoColor = '#10b981';
    }

    /**
     * Generate HTML email from changes
     */
    generateHTML(changes, reportMeta) {
        const top5 = changes.slice(0, 5);
        const weekRange = this.getWeekRange();

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CompWatch Weekly Digest</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f3f4f6;
        }
        .container {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            background: ${this.brandColor};
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
        }
        .header p {
            margin: 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .summary {
            padding: 20px;
            background: #f9fafb;
            border-bottom: 2px solid #e5e7eb;
        }
        .summary p {
            margin: 0;
            font-size: 15px;
            line-height: 1.7;
        }
        .changes {
            padding: 20px;
        }
        .change-item {
            border-left: 4px solid #e5e7eb;
            padding: 15px;
            margin-bottom: 20px;
            background: #f9fafb;
            border-radius: 4px;
        }
        .change-item.high { border-left-color: ${this.dangerColor}; }
        .change-item.medium { border-left-color: ${this.warningColor}; }
        .change-item.low { border-left-color: ${this.infoColor}; }
        .change-number {
            display: inline-block;
            width: 28px;
            height: 28px;
            background: ${this.brandColor};
            color: white;
            border-radius: 50%;
            text-align: center;
            line-height: 28px;
            font-weight: bold;
            margin-right: 10px;
            font-size: 14px;
        }
        .change-icon {
            font-size: 20px;
            margin-right: 8px;
        }
        .change-title {
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 8px 0;
            color: #111827;
        }
        .change-impact {
            font-size: 13px;
            color: #6b7280;
            margin: 5px 0;
        }
        .change-action {
            font-size: 13px;
            color: #374151;
            margin: 5px 0;
            padding-left: 20px;
            border-left: 2px solid #d1d5db;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            padding: 20px;
            background: #f9fafb;
            border-top: 2px solid #e5e7eb;
        }
        .stat-item {
            text-align: center;
            padding: 15px;
            background: white;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
        }
        .stat-number {
            font-size: 32px;
            font-weight: bold;
            color: ${this.brandColor};
            margin: 0;
        }
        .stat-label {
            font-size: 13px;
            color: #6b7280;
            margin: 5px 0 0 0;
        }
        .cta {
            padding: 30px 20px;
            text-align: center;
            background: #f9fafb;
        }
        .cta-button {
            display: inline-block;
            padding: 12px 30px;
            background: ${this.brandColor};
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
        }
        .cta-button:hover {
            background: #2563eb;
        }
        .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>📊 CompWatch Weekly Digest</h1>
            <p>Week of ${weekRange}</p>
        </div>

        <!-- Executive Summary -->
        <div class="summary">
            <p><strong>Executive Summary:</strong> This week saw <strong>${changes.length} significant competitive moves</strong>. ${this.generateSummaryText(top5, reportMeta)}</p>
        </div>

        <!-- Top 5 Changes -->
        <div class="changes">
            <h2 style="margin-top: 0; color: #111827;">🎯 Top 5 Changes This Week</h2>
            ${top5.map((change, index) => this.renderChange(change, index + 1)).join('')}
        </div>

        <!-- Quick Stats -->
        <div class="stats">
            ${this.renderStats(reportMeta)}
        </div>

        <!-- Call to Action -->
        <div class="cta">
            <p style="margin-bottom: 15px; color: #374151;">View the full competitive intelligence dashboard for detailed analysis</p>
            <a href="http://localhost:5173/" class="cta-button">View Full Dashboard →</a>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>This digest is auto-generated by CompWatch AI every Monday at 7am.</p>
            <p style="margin-top: 10px;">To unsubscribe or change preferences, contact your administrator.</p>
        </div>
    </div>
</body>
</html>
        `.trim();
    }

    renderChange(change, number) {
        const impactClass = change.impact.toLowerCase().includes('high') ? 'high'
            : change.impact.toLowerCase().includes('medium') ? 'medium' : 'low';

        const icon = this.getChangeIcon(change.type);

        return `
        <div class="change-item ${impactClass}">
            <div class="change-title">
                <span class="change-number">${number}</span>
                <span class="change-icon">${icon}</span>
                ${change.description}
            </div>
            <div class="change-impact">
                <strong>Impact:</strong> ${change.impact}
            </div>
            <div class="change-action">
                <strong>→ Recommended Action:</strong> ${change.action}
            </div>
        </div>
        `;
    }

    getChangeIcon(type) {
        const icons = {
            partner_status_change: '🚨',
            new_specialization: '🎓',
            news: '📢',
            hiring_surge: '👥',
            new_campaign: '🎯',
            linkedin_surge: '📱',
            event_surge: '📅',
            new_competitor: '🆕'
        };
        return icons[type] || '📊';
    }

    generateSummaryText(top5, meta) {
        if (top5.length === 0) {
            return 'No significant changes detected this week. Market remains stable.';
        }

        const topCompanies = [...new Set(top5.slice(0, 3).map(c => c.company))];
        const highPriorityCount = top5.filter(c => c.priority >= 8).length;

        let summary = `Top movers: ${topCompanies.join(', ')}. `;

        if (highPriorityCount > 0) {
            summary += `<strong>${highPriorityCount} high-priority threat${highPriorityCount > 1 ? 's' : ''}</strong> detected. `;
        }

        if (meta && meta.analytics) {
            const { totalEvents, totalNews, totalHiringTrends, activeCampaigns } = meta.analytics;
            summary += `Market activity: ${totalEvents} events, ${totalNews} news items, ${activeCampaigns} campaigns, ${totalHiringTrends} hiring trends.`;
        }

        return summary;
    }

    renderStats(meta) {
        if (!meta || !meta.analytics) {
            return '<p>Statistics unavailable</p>';
        }

        const { totalEvents, totalNews, totalHiringTrends, activeCampaigns } = meta.analytics;

        return `
            <div class="stat-item">
                <p class="stat-number">${totalEvents}</p>
                <p class="stat-label">Events This Week</p>
            </div>
            <div class="stat-item">
                <p class="stat-number">${totalNews}</p>
                <p class="stat-label">News Items</p>
            </div>
            <div class="stat-item">
                <p class="stat-number">${activeCampaigns}</p>
                <p class="stat-label">Active Campaigns</p>
            </div>
            <div class="stat-item">
                <p class="stat-number">${totalHiringTrends}</p>
                <p class="stat-label">Hiring Trends</p>
            </div>
        `;
    }

    getWeekRange() {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const format = (date) => {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[date.getMonth()]} ${date.getDate()}`;
        };

        return `${format(weekAgo)} - ${format(now)}, ${now.getFullYear()}`;
    }

    /**
     * Generate plain text version (fallback)
     */
    generatePlainText(changes, reportMeta) {
        const top5 = changes.slice(0, 5);
        const weekRange = this.getWeekRange();

        let text = `CompWatch Weekly Digest - Week of ${weekRange}\n`;
        text += '='.repeat(60) + '\n\n';
        text += `This week saw ${changes.length} significant competitive moves.\n\n`;

        text += 'TOP 5 CHANGES:\n\n';
        top5.forEach((change, index) => {
            text += `${index + 1}. ${change.description}\n`;
            text += `   Impact: ${change.impact}\n`;
            text += `   Action: ${change.action}\n\n`;
        });

        if (reportMeta && reportMeta.analytics) {
            const { totalEvents, totalNews, totalHiringTrends, activeCampaigns } = reportMeta.analytics;
            text += '\nQUICK STATS:\n';
            text += `- Events: ${totalEvents}\n`;
            text += `- News Items: ${totalNews}\n`;
            text += `- Campaigns: ${activeCampaigns}\n`;
            text += `- Hiring Trends: ${totalHiringTrends}\n`;
        }

        text += '\n' + '-'.repeat(60) + '\n';
        text += 'View full dashboard: http://localhost:5173/\n';

        return text;
    }
}

module.exports = EmailGenerator;
