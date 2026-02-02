import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, Target } from 'lucide-react';

const ExecutiveSummary = ({ data }) => {
    if (!data || !data.executiveSummary) return null;

    const { insights, top_mover, recommended_action } = data.executiveSummary;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-8 mb-8 border-l-4 border-l-blue-500 relative overflow-hidden"
        >
            {/* Animated background accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                            <TrendingUp className="w-6 h-6 text-blue-400" />
                            EXECUTIVE SUMMARY
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">Top intelligence for Cloud Direct leadership</p>
                    </div>
                    <div className="px-4 py-2 bg-blue-500/10 rounded-lg border border-blue-500/30">
                        <p className="text-xs text-blue-400 font-mono">TOP MOVER</p>
                        <p className="text-lg font-bold text-white">{top_mover || 'N/A'}</p>
                    </div>
                </div>

                {/* Key Insights */}
                <div className="space-y-3 mb-6">
                    {insights?.map((insight, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-blue-500/50 transition-colors group"
                        >
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-500/30 transition-colors">
                                <span className="text-blue-400 font-bold text-sm">{idx + 1}</span>
                            </div>
                            <p className="text-slate-200 leading-relaxed flex-1">{insight}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Recommended Action */}
                {recommended_action && (
                    <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/30">
                        <div className="flex items-start gap-3">
                            <Target className="w-5 h-5 text-purple-400 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">Recommended Action</p>
                                <p className="text-white text-sm">{recommended_action}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ExecutiveSummary;
