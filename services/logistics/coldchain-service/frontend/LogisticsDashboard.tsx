import React, { useState, useEffect } from 'react';
// Note: In production, substitute these with Lucide icons or FontAwesome
const IconDevice = () => <span className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">❄️</span>;
const IconTruck = () => <span className="p-2 bg-green-500/20 text-green-400 rounded-lg">🚚</span>;
const IconAlert = () => <span className="p-2 bg-red-500/20 text-red-400 rounded-lg">⚠️</span>;

/**
 * Premium Logistics Dashboard Component
 * Styled with Glassmorphism and High-Contrast Data Visualization
 */
const LogisticsDashboard = () => {
    const [trucks, setTrucks] = useState([
        { id: 'TRUCK-01', temp: 4.2, status: 'Stable', location: 'Dakar', risk: 5 },
        { id: 'TRUCK-02', temp: 8.5, status: 'Critical', location: 'Thiès', risk: 85 },
        { id: 'TRUCK-03', temp: 3.8, status: 'Stable', location: 'Saint-Louis', risk: 12 },
    ]);

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white p-8 font-sans">
            {/* Header */}
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        COMMAND CENTER
                    </h1>
                    <p className="text-gray-400 mt-2">AgriLogistic 4.0 - Cold Chain Monitoring</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-[#16161a] border border-white/5 px-6 py-2 rounded-full flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">LIVE DATA CLOUD</span>
                    </div>
                </div>
            </header>

            {/* Top Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <MetricCard title="Trucks Active" value="24" sub="98% Uptime" icon={<IconTruck />} />
                <MetricCard title="Avg Temperature" value="4.1°C" sub="-0.2° Deviation" icon={<IconDevice />} />
                <MetricCard title="Predictive Alerts" value="2" sub="Immediate Action" icon={<IconAlert />} color="text-red-400" />
                <MetricCard title="Energy Saved" value="12%" sub="Optimized Clusters" valueColor="text-green-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Real-time Truck Monitor */}
                <div className="lg:col-span-2 bg-[#121216] border border-white/5 rounded-3xl p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold">Fleet Management</h2>
                        <button className="text-blue-400 text-sm hover:underline">View Map View</button>
                    </div>
                    
                    <div className="space-y-4">
                        {trucks.map(truck => (
                            <div key={truck.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/[0.08] transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${truck.risk > 50 ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                        {truck.risk > 50 ? '🔥' : '🚛'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{truck.id}</h3>
                                        <p className="text-xs text-gray-500">{truck.location} • Active 4h</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-12">
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest">Temperature</p>
                                        <p className={`text-xl font-mono font-bold ${truck.temp > 6 ? 'text-red-400' : 'text-blue-400'}`}>
                                            {truck.temp}°C
                                        </p>
                                    </div>
                                    <div className="text-right w-32">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest">Predictive Risk</p>
                                        <div className="w-full bg-white/10 h-1.5 rounded-full mt-2">
                                            <div 
                                                className={`h-full rounded-full ${truck.risk > 50 ? 'bg-red-400' : 'bg-green-400'}`} 
                                                style={{ width: `${truck.risk}%` }} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Predictive Insight Side-panel */}
                <div className="bg-gradient-to-br from-indigo-900/40 to-black border border-indigo-500/20 rounded-3xl p-8">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                        <span>🤖</span> AI INSIGHTS
                    </h2>
                    
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-6">
                        <p className="text-sm text-indigo-300 font-medium mb-2 uppercase tracking-tighter">Anomaly Detected</p>
                        <p className="text-gray-300 leading-relaxed">
                            <span className="text-white font-bold">TRUCK-02</span> shows a pattern of pressure drop (-12%) correlating with a 2°C rise. Random Forest predicts 
                            <span className="text-red-400 font-bold ml-1">Failure within 4 hours.</span>
                        </p>
                        <button className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all font-bold">
                            Dispatch Technician
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Fleet Efficiency</span>
                            <span className="text-green-400">+5.2%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">ML Training Status</span>
                            <span className="text-blue-400">Optimized</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, sub, icon, color = "text-white", valueColor = "text-white" }) => (
    <div className="bg-[#121216] border border-white/5 p-6 rounded-3xl flex flex-col justify-between hover:border-white/20 transition-all cursor-default">
        <div className="flex justify-between items-start">
            <span className="text-gray-500 text-sm font-medium">{title}</span>
            {icon}
        </div>
        <div className="mt-4">
            <span className={`text-3xl font-bold ${valueColor}`}>{value}</span>
            <p className={`text-xs mt-1 ${color} opacity-70`}>{sub}</p>
        </div>
    </div>
);

export default LogisticsDashboard;
