# CompWatch AI 🎯

**Real-time competitive intelligence platform for Cloud Direct**

Automates competitor research using AI, providing leadership with actionable insights in 30 seconds instead of 5 hours of manual work.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)

---

## 🚀 Features

### Core Intelligence
- **Real-time Data Collection**: Perplexity Sonar model searches 200+ live sources per company
- **Executive Summary**: Auto-generated top 3 strategic insights
- **Market Share Tracking**: Visual pie chart of competitive landscape
- **Cmd+K Search**: Instant intelligence retrieval across all data

### Competitor Tracking
- **Microsoft Partner Status**: Track certifications and specializations
- **LinkedIn Activity**: Post frequency, themes, and engagement metrics
- **Hiring Trends**: Expansion signals from job postings
- **Campaign Monitoring**: Go-to-market activities and themes
- **Event Calendar**: Webinars, conferences, and presentations
- **News Tracking**: Acquisitions, partnerships, major deals

### Leadership Tools (v6.0)
- **📧 Weekly Email Digest**: Automated Monday morning briefings
- **🎯 Change Detection**: Prioritized alerts on competitive moves
- **📊 Priority Scoring**: High/Medium/Low impact classification
- **📱 Mobile-Responsive**: Dashboard optimized for all devices

---

## 📈 Business Value

**Time Savings**: 5 hours/week → 30 seconds  
**Annual Value**: £26,000+ (time savings + faster threat response)  
**Data Coverage**: 100% (9/9 competitors with live 2025-2026 data)  
**Intelligence Depth**: 200+ sources per company via deep research

---

## 🛠️ Tech Stack

**Backend**:
- Node.js
- Perplexity API (Sonar model - real-time web access)
- Google Generative AI (Gemini 2.5-flash for structuring)
- SendGrid (email delivery)

**Frontend**:
- React 18 + Vite
- Recharts (data visualization)
- Glassmorphism UI design
- Auto-refresh (5s interval)

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Perplexity API key ([Get one here](https://www.perplexity.ai/))
- Google AI API key ([Get one here](https://makersuite.google.com/app/apikey))
- SendGrid API key ([Get one here](https://signup.sendgrid.com/)) - *Optional for email digest*

### Setup

1. **Clone the repository**:
```bash
git clone https://github.com/leongodwin/COMPWATCH.git
cd COMPWATCH
```

2. **Install dependencies**:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Configure environment variables**:

Create `backend/.env`:
```env
# Required: AI APIs
PERPLEXITY_API_KEY=your_perplexity_key_here
GOOGLE_API_KEY=your_google_ai_key_here

# Optional: Email Digest
SENDGRID_API_KEY=your_sendgrid_key_here
SENDGRID_FROM_EMAIL=compwatch@yourdomain.com
DIGEST_RECIPIENTS=email1@example.com,email2@example.com
```

4. **Generate first report**:
```bash
cd backend
npm start
```

5. **Start the dashboard**:
```bash
cd frontend
npm run dev
```

6. **Access the app**:
Open http://localhost:5173/

---

## 💻 Usage

### Quick Start Scripts

**Windows**:
```bash
# Start all services
.\start.bat

# Stop all services
.\stop.bat
```

**Manual**:
```bash
# Generate fresh intelligence report
cd backend
npm start

# Start dashboard
cd frontend
npm run dev

# Send weekly email digest
cd backend
npm run send-digest

# Test email configuration
npm run test-email your@email.com
```

---

## 📊 Sample Output

### Executive Summary
```
Top Insights:
1. ANS's Microsoft partner upgrades threaten 10-15% Azure market share erosion; 
   accelerate Cloud Direct AI certs.

2. Coeo's AI Guardian and CloudWales acquisition undercut UK public/security 
   verticals; prioritize Copilot certifications this week.

3. Advania's Azure Expert MSP status erodes differentiation; highlight 
   multi-cloud strengths in pitches.

Top Mover: Advania
Recommended Action: Initiate targeted searches on SCC, Transparity, Node4 
owned channels for 2025-2026 Microsoft activities by EOD Tuesday.
```

### Competitor Analytics
- **Total Events**: 18
- **Hiring Trends**: 14
- **News Items**: 17
- **Active Campaigns**: 8
- **Market Share**: ANS (30.2%), Coeo (37.2%), Advania (30.2%)

---

## 🔄 How It Works

### Two-Stage AI Pipeline

```
Company Name
    ↓
Perplexity Sonar (real-time research)
  - Executes 20-50 targeted queries
  - Searches billions of live web pages
  - Draws from 200+ sources
    ↓
Gemini 2.5-flash (JSON structuring)
  - Extracts structured data
  - Validates schema
  - Handles edge cases
    ↓
Executive Summary Generator
  - Analyzes all company data
  - Generates top 3 insights
  - Recommends actions
    ↓
latest-report.json
  - Frontend auto-refreshes
  - Dashboard updates live
```

---

## 📧 Email Digest (v6.0 Feature)

Automated weekly briefings delivered to leadership every Monday at 7am.

**What's Included**:
1. **Executive Summary**: Week overview with threat count
2. **Top 5 Changes**: Prioritized competitive moves
3. **Quick Stats**: Events, news, campaigns, hiring
4. **Recommended Actions**: Specific next steps

**Setup** (5 minutes):
1. Get SendGrid API key
2. Configure `.env` with recipients
3. Verify sender email in SendGrid
4. Test: `npm run test-email your@email.com`
5. Send: `npm run send-digest`

**Automation** (optional):
- Windows Task Scheduler: Monday 7am
- Linux/Mac Cron: `0 7 * * 1 cd /path/to/backend && node send-digest.js`

---

## 📁 Project Structure

```
CompWatchAI/
├── backend/
│   ├── config.js              # API keys, model config
│   ├── agent.js               # Perplexity research logic
│   ├── gemini-structurer.js   # Gemini JSON structuring
│   ├── run-report.js          # Main report generator
│   ├── change-detector.js     # Weekly change detection
│   ├── email-generator.js     # HTML email templates
│   ├── email-sender.js        # SendGrid integration
│   ├── send-digest.js         # Email digest orchestrator
│   ├── competitor-urls.json   # Target URLs for research
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main dashboard
│   │   ├── components/
│   │   │   ├── ExecutiveSummary.jsx
│   │   │   ├── MarketShareChart.jsx
│   │   │   └── SearchBar.jsx
│   │   └── data/
│   │       └── latest-report.json
│   └── package.json
├── start.bat                  # Quick start (Windows)
├── stop.bat                   # Quick stop (Windows)
└── README.md
```

---

## 🎯 Roadmap

### Phase 7 (Planned)
- [ ] Slack/Teams bot integration
- [ ] Natural language query interface
- [ ] Automated battlecards for sales
- [ ] CRM integration (Salesforce/HubSpot)

### Phase 8 (Future)
- [ ] Win/loss analysis
- [ ] One-click PowerPoint export
- [ ] Historical trend tracking
- [ ] Predictive intelligence (hiring → revenue forecasting)

See [leadership_improvements.md](docs/leadership_improvements.md) for full 20-feature roadmap.

---

## 🐛 Troubleshooting

### "Failed to fetch" errors
- Ensure backend is running: `cd backend && npm start`
- Check API keys in `.env`
- Verify Perplexity API key is `sonar` model compatible

### Sparse data / "Unknown" fields
- Ensure using `sonar` model (not `sonar-reasoning-pro`)
- Check `.env` has correct model: `MODEL=sonar`
- Verify API keys are active

### Email digest not sending
- Check SendGrid API key in `.env`
- Verify sender email in SendGrid dashboard
- Test configuration: `npm run test-email your@email.com`
- Check SendGrid Activity Feed for errors

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

For issues or questions:
- Open a GitHub issue
- Check documentation in `/docs` folder
- Review troubleshooting section above

---

## 🏆 Achievements

- ✅ **v1.0**: Basic competitor tracking
- ✅ **v2.0**: AI integration (Perplexity)
- ✅ **v3.0**: Leadership tools (Executive Summary, Market Share, Search)
- ✅ **v4.0**: Two-stage pipeline (eliminated JSON errors)
- ✅ **v5.0**: Sonar model (100% data coverage with real-time intelligence)
- ✅ **v6.0**: Automated email digest (zero-effort intelligence consumption)

---

**Built with ❤️ for Cloud Direct Leadership**

*Turning 5 hours of competitive research into 30 seconds of actionable intelligence.*
