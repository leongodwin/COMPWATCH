import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#a855f7'];

const MarketShareChart = ({ data }) => {
    if (!data || !data.analytics || !data.analytics.marketShare) return null;

    const chartData = Object.entries(data.analytics.marketShare)
        .map(([name, value]) => ({
            name,
            value: parseFloat(value)
        }))
        .filter(item => item.value > 0)
        .sort((a, b) => b.value - a.value);

    if (chartData.length === 0) {
        return (
            <div className="glass-card rounded-2xl p-8 mb-8">
                <p className="text-slate-400 text-center">No market share data available yet</p>
            </div>
        );
    }

    return (
        <div className="glass-card rounded-2xl p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 opacity-50"></div>

            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                MARKET SHARE OF VOICE
            </h3>
            <p className="text-xs text-slate-500 mb-4">Based on total activity volume (Events + Campaigns + News)</p>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                            }}
                            formatter={(value) => `${value}%`}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            wrapperStyle={{ fontSize: '12px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MarketShareChart;
