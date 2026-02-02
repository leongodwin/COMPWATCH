import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AnalyticsCharts = ({ data }) => {
    // Transform companies data into chart-ready format
    const chartData = data.companies
        .filter(c => c.status === "SUCCESS")
        .map(c => ({
            name: c.company,
            Activity: (c.events?.length || 0) + (c.news?.length || 0) + (c.campaigns?.length || 0),
            Hiring: c.hiring_trends?.length || 0
        }))
        .sort((a, b) => b.Activity - a.Activity)
        .slice(0, 10); // Top 10

    return (
        <div className="glass-card rounded-2xl p-6 mb-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>

            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                MARKET ACTIVITY VOLUME
            </h3>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis
                            dataKey="name"
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                            }}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar dataKey="Activity" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`url(#colorGradient-${index})`} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Gradient definition hack for Recharts */}
            <svg style={{ height: 0 }}>
                <defs>
                    <linearGradient id="colorGradient-0" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.8} />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

export default AnalyticsCharts;
