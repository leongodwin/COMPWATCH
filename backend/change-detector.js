const fs = require('fs');
const path = require('path');

/**
 * Change Detector
 * Compares current report with previous week's report to identify significant changes
 */

class ChangeDetector {
    constructor() {
        this.changeWeights = {
            microsoft_partner_status: 10,  // High priority
            news: 8,                        // Acquisitions, partnerships
            hiring_trends: 7,               // Leading indicator
            campaigns: 6,                   // Go-to-market signals
            linkedin_activity: 5,           // Social engagement
            events: 4                       // Market presence
        };
    }

    /**
     * Load a report from file
     */
    loadReport(filename) {
        const reportPath = path.join(__dirname, '..', 'frontend', 'src', 'data', filename);
        if (!fs.existsSync(reportPath)) {
            return null;
        }
        return JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    }

    /**
     * Compare two reports and detect changes
     */
    detectChanges(currentReport, previousReport) {
        if (!previousReport) {
            return {
                changes: [],
                error: 'No previous report found for comparison'
            };
        }

        const changes = [];

        // Compare each company
        currentReport.companies.forEach(currentCompany => {
            const prevCompany = previousReport.companies.find(
                c => c.company === currentCompany.company
            );

            if (!prevCompany) {
                changes.push({
                    type: 'new_competitor',
                    company: currentCompany.company,
                    description: `New competitor tracked: ${currentCompany.company}`,
                    priority: 8,
                    category: 'market_entry'
                });
                return;
            }

            // Check Microsoft Partner Status changes
            const partnerChanges = this.detectPartnerChanges(currentCompany, prevCompany);
            changes.push(...partnerChanges);

            // Check News
            const newsChanges = this.detectNewsChanges(currentCompany, prevCompany);
            changes.push(...newsChanges);

            // Check Hiring Trends
            const hiringChanges = this.detectHiringChanges(currentCompany, prevCompany);
            changes.push(...hiringChanges);

            // Check Campaigns
            const campaignChanges = this.detectCampaignChanges(currentCompany, prevCompany);
            changes.push(...campaignChanges);

            // Check LinkedIn Activity
            const linkedinChanges = this.detectLinkedInChanges(currentCompany, prevCompany);
            changes.push(...linkedinChanges);

            // Check Events
            const eventChanges = this.detectEventChanges(currentCompany, prevCompany);
            changes.push(...eventChanges);
        });

        // Sort by priority (highest first)
        changes.sort((a, b) => b.priority - a.priority);

        return { changes };
    }

    detectPartnerChanges(current, previous) {
        const changes = [];

        if (current.microsoft_partner_status.current_level !== previous.microsoft_partner_status.current_level
            && current.microsoft_partner_status.current_level !== 'Unknown') {
            changes.push({
                type: 'partner_status_change',
                company: current.company,
                description: `${current.company} upgraded Microsoft Partner status: ${current.microsoft_partner_status.current_level}`,
                impact: 'High - Threatens competitive positioning',
                action: 'Review Cloud Direct certification roadmap',
                priority: this.changeWeights.microsoft_partner_status,
                category: 'certification'
            });
        }

        // Check for new specializations
        const newSpecializations = current.microsoft_partner_status.specializations.filter(
            spec => !previous.microsoft_partner_status.specializations.includes(spec)
        );

        if (newSpecializations.length > 0) {
            changes.push({
                type: 'new_specialization',
                company: current.company,
                description: `${current.company} earned new Microsoft specializations: ${newSpecializations.join(', ')}`,
                impact: 'Medium - Competitive differentiation',
                action: 'Evaluate if Cloud Direct should pursue same specializations',
                priority: this.changeWeights.microsoft_partner_status - 2,
                category: 'certification'
            });
        }

        return changes;
    }

    detectNewsChanges(current, previous) {
        const changes = [];
        const newNews = current.news.filter(
            newsItem => !previous.news.some(pn => pn.title === newsItem.title)
        );

        newNews.forEach(newsItem => {
            // Prioritize acquisitions and major deals
            const isHighPriority = newsItem.title.toLowerCase().includes('acquisition')
                || newsItem.title.toLowerCase().includes('acquires')
                || newsItem.title.toLowerCase().includes('£')
                || newsItem.title.toLowerCase().includes('contract');

            changes.push({
                type: 'news',
                company: current.company,
                description: newsItem.title,
                impact: isHighPriority ? 'High - Strategic move' : 'Medium - Market signal',
                action: isHighPriority ? 'Analyze impact on Cloud Direct market position' : 'Monitor for patterns',
                priority: isHighPriority ? this.changeWeights.news : this.changeWeights.news - 3,
                category: 'news'
            });
        });

        return changes;
    }

    detectHiringChanges(current, previous) {
        const changes = [];

        if (current.hiring_trends.length > previous.hiring_trends.length) {
            const newTrends = current.hiring_trends.filter(
                trend => !previous.hiring_trends.some(pt => pt.trend === trend.trend)
            );

            newTrends.forEach(trend => {
                const isAggressive = trend.details.toLowerCase().includes('aggressively')
                    || trend.details.match(/\d{2,}\+/);  // 20+ roles pattern

                changes.push({
                    type: 'hiring_surge',
                    company: current.company,
                    description: `${current.company} hiring trend: ${trend.trend} - ${trend.details.substring(0, 100)}`,
                    impact: isAggressive ? 'High - Signals expansion' : 'Medium - Talent acquisition',
                    action: isAggressive ? 'Expect new service launch or market expansion' : 'Monitor for service capability growth',
                    priority: isAggressive ? this.changeWeights.hiring_trends : this.changeWeights.hiring_trends - 2,
                    category: 'hiring'
                });
            });
        }

        return changes;
    }

    detectCampaignChanges(current, previous) {
        const changes = [];
        const newCampaigns = current.campaigns.filter(
            campaign => !previous.campaigns.some(pc => pc.name === campaign.name)
        );

        newCampaigns.forEach(campaign => {
            changes.push({
                type: 'new_campaign',
                company: current.company,
                description: `${current.company} launched campaign: ${campaign.name} - ${campaign.description.substring(0, 80)}`,
                impact: 'Medium - Go-to-market activity',
                action: 'Review campaign messaging and target verticals',
                priority: this.changeWeights.campaigns,
                category: 'marketing'
            });
        });

        return changes;
    }

    detectLinkedInChanges(current, previous) {
        const changes = [];

        // Detect significant post frequency changes
        if (current.linkedin_activity.post_frequency !== 'Unknown'
            && previous.linkedin_activity.post_frequency !== 'Unknown') {

            const currentFreq = this.parseFrequency(current.linkedin_activity.post_frequency);
            const prevFreq = this.parseFrequency(previous.linkedin_activity.post_frequency);

            if (currentFreq > prevFreq * 1.3) {  // 30% increase
                changes.push({
                    type: 'linkedin_surge',
                    company: current.company,
                    description: `${current.company} increased LinkedIn activity: ${current.linkedin_activity.post_frequency} (was ${previous.linkedin_activity.post_frequency})`,
                    impact: 'Low-Medium - Brand awareness push',
                    action: 'Review content themes for market positioning signals',
                    priority: this.changeWeights.linkedin_activity,
                    category: 'social_media'
                });
            }
        }

        return changes;
    }

    detectEventChanges(current, previous) {
        const changes = [];
        const newEvents = current.events.filter(
            event => !previous.events.some(pe => pe.title === event.title)
        );

        if (newEvents.length >= 3) {  // 3+ new events = significant
            changes.push({
                type: 'event_surge',
                company: current.company,
                description: `${current.company} scheduled ${newEvents.length} new events (e.g., ${newEvents[0].title})`,
                impact: 'Medium - Market presence expansion',
                action: 'Consider attending or monitoring for competitive positioning',
                priority: this.changeWeights.events,
                category: 'events'
            });
        }

        return changes;
    }

    /**
     * Parse post frequency string to numeric value for comparison
     */
    parseFrequency(freqStr) {
        const match = freqStr.match(/(\d+)-?(\d+)?/);
        if (!match) return 0;
        const min = parseInt(match[1]);
        const max = match[2] ? parseInt(match[2]) : min;
        return (min + max) / 2;  // Average
    }

    /**
     * Get top N changes
     */
    getTopChanges(changes, n = 5) {
        return changes.slice(0, n);
    }
}

module.exports = ChangeDetector;
