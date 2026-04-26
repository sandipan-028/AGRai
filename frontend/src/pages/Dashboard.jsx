import React from 'react';
import GlassCard from '../components/GlassCard';
import { CloudSun, Droplets, Thermometer, MapPin, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const stats = [
    { label: 'Current Temp', value: '28°C', icon: <Thermometer className="text-orange-400" />, color: 'from-orange-500/20' },
    { label: 'Humidity', value: '65%', icon: <Droplets className="text-blue-400" />, color: 'from-blue-500/20' },
    { label: 'Rainfall', value: '120mm', icon: <CloudSun className="text-yellow-400" />, color: 'from-yellow-500/20' },
    { label: 'Soil Health', value: 'Good', icon: <TrendingUp className="text-green-400" />, color: 'from-green-500/20' },
  ];

  return (
    <div className="space-y-12">
      <div className="relative">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Welcome back, <span className="text-luminous">Sandipan!</span>
          </h1>
          <p className="text-gray-400 flex items-center gap-2 font-medium">
            <MapPin size={16} className="text-primary-400" /> Nadia District, West Bengal
          </p>
        </motion.div>
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary-500/10 blur-3xl rounded-full pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <GlassCard key={stat.label} delay={i * 0.1} className="group hover:border-primary-500/30">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-primary-500/10 transition-colors duration-500">
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <GlassCard className="lg:col-span-2" delay={0.4}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Recent Crop Analysis</h2>
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-primary-400 text-xs font-bold uppercase tracking-widest transition-all">View All History</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((item, i) => (
              <motion.div 
                key={item} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-primary-500/20 hover:bg-white/[0.07] transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-primary-600/10 rounded-2xl flex items-center justify-center border border-primary-500/10 group-hover:scale-110 transition-transform">
                    <Sprout className="text-primary-400" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-white">Rice Prediction</p>
                    <p className="text-sm text-gray-500">Kharif Season • {i + 1} day ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-luminous-green">92% Match</p>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter">High Confidence</p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard delay={0.5} className="border-red-500/30 bg-red-500/[0.02]">
            <div className="flex items-center gap-3 mb-8 text-red-400">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <h2 className="text-2xl font-bold">Active Alerts</h2>
            </div>
            <div className="space-y-5">
              <div className="p-5 bg-red-500/5 rounded-2xl border border-red-500/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                </div>
                <p className="font-bold text-red-200 text-lg">Stem Borer Alert</p>
                <p className="text-sm text-red-300/60 mt-2 leading-relaxed">High risk detected in Nadia district. Immediate monitoring of paddy fields is advised.</p>
                <button className="mt-5 w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-xs font-black text-red-400 uppercase tracking-widest transition-all">Get Organic Solution</button>
              </div>
            </div>
          </GlassCard>

          <GlassCard delay={0.6} className="bg-blue-500/[0.02] border-blue-500/20">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                 <CloudSun size={20} className="text-blue-400" />
               </div>
               <h2 className="text-xl font-bold text-white">Weather Insight</h2>
             </div>
             <p className="text-gray-400 text-sm leading-relaxed">Showers expected in next 48 hours. Postpone fertilizer application to avoid runoff.</p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};


// Dummy component for icons not imported
const Sprout = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5 0 5.5-18 0-18"/><path d="M14 20c-5.5 0-5.5-18 0-18"/></svg>
);

export default Dashboard;
