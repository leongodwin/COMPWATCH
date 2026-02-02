import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ChevronRight, Activity, Globe, Cpu } from 'lucide-react';
import AnalyticsCharts from './AnalyticsCharts';
import CompanyDetail from './CompanyDetail';
import ExecutiveSummary from './ExecutiveSummary';
import MarketShareChart from './MarketShareChart';
import SearchBar from './SearchBar';
import { clsx } from 'clsx';

function App() {
    const [report, setReport] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Note: In Vite, dynamic imports of JSON outside of build are tricky if not monitored.
                // A simple path is to use a relative import
                const data = await import('./data/latest-report.json');
                setReport(data.default);
            } catch (e) {
                console.error("No report found. Run backend script.", e);
            }
        };
        loadData();
        // Poll for changes
        const interval = setInterval(loadData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (!report) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center relative">
                    <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
                    <h1 className="text-4xl font-black mb-4 tracking-tighter text-glow">COMPWATCH AI</h1>
                    <p className="text-blue-400 font-mono text-sm animate-pulse">INITIALIZING NEURAL LINK...</p>
                </div>
            </div>
        );
    }

    // Calculate high-level stats
    const totalInsights = report.companies.reduce((acc, c) =>
        acc + (c.events?.length || 0) + (c.news?.length || 0) + (c.campaigns?.length || 0), 0);
    const activeCompetitors = report.companies.filter(c => c.status === "SUCCESS").length;

    return (
        <div className="min-h-screen p-8 pb-32">
            {/* Search Bar */}
            <SearchBar
                data={report}
                onResultClick={(result) => {
                    const company = report.companies.find(c => c.company === result.company);
                    if (company) setSelectedCompany(company);
                }}
            />

            {/* HEADER */}
            <header className="mb-12 flex flex-col md:flex-row items-end justify-between border-b border-white/5 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
                        <span className="text-xs font-mono text-green-500 tracking-widest">SYSTEM ONLINE</span>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-white text-glow">
                        COMPWATCH <span className="font-thin text-white/50">v3.0</span>
                    </h1>
                    <p className="text-slate-400 text-sm mt-2">Executive Intelligence for Cloud Direct Leadership</p>
                </div>

                <div className="flex gap-8 text-right mt-6 md:mt-0">
                    <div>
                        <p className="text-xs text-slate-500 font-mono mb-1 uppercase">Total Insights</p>
                        <p className="text-3xl font-bold text-white">{totalInsights}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-mono mb-1 uppercase">Active Targets</p>
                        <p className="text-3xl font-bold text-blue-400">{activeCompetitors}<span className="text-sm text-slate-600">/{report.companies.length}</span></p>
                    </div>
                </div>
            </header>

            {/* EXECUTIVE SUMMARY */}
            <ExecutiveSummary data={report} />

            {/* ANALYTICS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <AnalyticsCharts data={report} />
                <MarketShareChart data={report} />
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {report.companies.map((company, idx) => {
                    const isError = company.status === "ERROR";

                    return (
                        <motion.div
                            key={idx}
                            layoutId={`card-${company.company}`}
                            onClick={() => !isError && setSelectedCompany(company)}
                            className={clsx(
                                "group relative p-6 rounded-2xl transition-all cursor-pointer border hover:-translate-y-1 duration-300",
                                isError
                                    ? "bg-red-950/10 border-red-500/30 hover:bg-red-950/20" // Red Room Style
                                    : "glass-card border-white/5 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                            )}
                        >
                            {/* Status Indicator */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                    {isError ? <AlertTriangle className="text-red-500" /> : <Globe className="text-blue-400" />}
                                </div>
                                {isError && <span className="text-[10px] font-mono bg-red-500/20 text-red-400 px-2 py-1 rounded">OFFLINE</span>}
                            </div>

                            <h2 className="text-2xl font-bold mb-2 text-white group-hover:text-blue-200 transition-colors">{company.company}</h2>

                            {isError ? (
                                <div className="text-red-400/80 text-sm font-mono mt-4">
                                    <p>CONNECTION_LOST</p>
                                    <p className="text-xs opacity-50 mt-1">{company.error_msg}</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-slate-400 text-sm mb-6 line-clamp-2 h-10 leading-relaxed">
                                        {company.summary || "Pending analysis..."}
                                    </p>

                                    {/* Mini stats */}
                                    <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-4">
                                        <div className="text-center">
                                            <div className="text-xs text-slate-600 mb-1">CMPGN</div>
                                            <div className="font-mono text-purple-400">{company.campaigns?.length || 0}</div>
                                        </div>
                                        <div className="text-center border-l border-white/5">
                                            <div className="text-xs text-slate-600 mb-1">HIRE</div>
                                            <div className="font-mono text-green-400">{company.hiring_trends?.length || 0}</div>
                                        </div>
                                        <div className="text-center border-l border-white/5">
                                            <div className="text-xs text-slate-600 mb-1">NEWS</div>
                                            <div className="font-mono text-blue-400">{company.news?.length || 0}</div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {!isError && (
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight className="text-blue-400" />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* DETAIL MODAL */}
            <CompanyDetail company={selectedCompany} onClose={() => setSelectedCompany(null)} />
        </div>
    )
}

export default App
