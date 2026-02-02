import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Users, Megaphone, Calendar } from 'lucide-react';
import { clsx } from 'clsx';

const CompanyDetail = ({ company, onClose }) => {
    const [activeTab, setActiveTab] = useState('overview');

    if (!company) return null;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: TrendingUp },
        { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
        { id: 'hiring', label: 'Hiring', icon: Users },
        { id: 'events', label: 'Events', icon: Calendar },
    ];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end"
                onClick={onClose}
            >
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    className="w-full max-w-2xl h-full glass-panel p-8 overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                {company.company}
                            </h2>
                            <p className="text-slate-400 mt-2 text-lg">{company.summary}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6 text-slate-400" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium whitespace-nowrap",
                                    activeTab === tab.id
                                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/50"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-6">
                        {/* CONTENT: CAMPAIGNS */}
                        {activeTab === 'campaigns' && (
                            <div className="space-y-4">
                                {company.campaigns?.map((c, i) => (
                                    <div key={i} className="glass-card p-4 rounded-xl border-l-4 border-l-purple-500">
                                        <h3 className="font-bold text-lg mb-1">{c.name}</h3>
                                        <p className="text-slate-300 text-sm">{c.description}</p>
                                        <span className="text-xs text-purple-400 mt-2 block font-mono">{c.date}</span>
                                    </div>
                                ))}
                                {company.campaigns?.length === 0 && <p className="text-slate-500 italic">No major campaigns detected.</p>}
                            </div>
                        )}

                        {/* CONTENT: HIRING */}
                        {activeTab === 'hiring' && (
                            <div className="space-y-4">
                                {company.hiring_trends?.map((h, i) => (
                                    <div key={i} className="glass-card p-4 rounded-xl border-l-4 border-l-green-500">
                                        <h3 className="font-bold text-white mb-1">{h.trend}</h3>
                                        <p className="text-slate-300 text-sm">{h.details}</p>
                                    </div>
                                ))}
                                {company.hiring_trends?.length === 0 && <p className="text-slate-500 italic">No hiring trends detected.</p>}
                            </div>
                        )}

                        {/* CONTENT: EVENTS & OVERVIEW can go here similarly */}
                        {activeTab === 'events' && (
                            <div className="space-y-4">
                                {company.events?.map((e, i) => (
                                    <div key={i} className="glass-card p-4 rounded-xl flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-white">{e.title}</h3>
                                            <p className="text-blue-400 text-xs font-mono mt-1">{e.date}</p>
                                        </div>
                                        {e.link && (
                                            <a href={e.link} target="_blank" className="text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20">
                                                Link ↗
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'overview' && (
                            <div>
                                <h3 className="text-lg font-bold mb-4 text-purple-300">Strategic News</h3>
                                <div className="space-y-3">
                                    {company.news?.map((n, i) => (
                                        <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/20 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-medium text-sm leading-tight">{n.title}</h4>
                                                <span className={clsx("text-[10px] px-2 py-0.5 rounded ml-2",
                                                    n.sentiment?.includes("Positive") ? "bg-green-900/50 text-green-400" : "bg-slate-800 text-slate-400"
                                                )}>
                                                    {n.sentiment}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-xs text-slate-500">{n.source}</span>
                                                <span className="text-xs text-slate-600 font-mono">{n.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CompanyDetail;
