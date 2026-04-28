import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { Sprout, Search, Thermometer, Droplets, FlaskConical, CloudRain, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const CropPredictor = () => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [formData, setFormData] = useState({
    n: 90, p: 42, k: 43,
    temperature: 20.8,
    humidity: 82.0,
    ph: 6.5,
    rainfall: 202.9,
    lat: 22.9,
    lon: 88.4
  });

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/predict/crop', formData);
      setPrediction(response.data);
      toast.success('Prediction generated!');
    } catch (error) {
      toast.error('Prediction failed. Using fallback data.');
      setPrediction({
        recommendations: ['Rice', 'Sugarcane', 'Maize'],
        confidence: '85%'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold tracking-tight text-white"
        >
          Smart <span className="text-luminous">Crop Predictor</span>
        </motion.h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Leverage machine learning to determine the most profitable crops for your specific soil composition and weather conditions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <GlassCard className="h-fit">
          <form onSubmit={handlePredict} className="space-y-8 p-2">
            <div className="space-y-6">
              <h3 className="text-sm font-black text-primary-400 uppercase tracking-widest border-l-2 border-primary-500 pl-4">Soil Nutrients</h3>
              <div className="grid grid-cols-3 gap-4">
                <InputGroup label="Nitrogen (N)" name="n" value={formData.n} onChange={(v) => setFormData({...formData, n: v})} icon={<FlaskConical size={14}/>} />
                <InputGroup label="Phosphorus (P)" name="p" value={formData.p} onChange={(v) => setFormData({...formData, p: v})} icon={<FlaskConical size={14}/>} />
                <InputGroup label="Potassium (K)" name="k" value={formData.k} onChange={(v) => setFormData({...formData, k: v})} icon={<FlaskConical size={14}/>} />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest border-l-2 border-blue-500 pl-4">Environmental Factors</h3>
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Temperature (°C)" name="temperature" value={formData.temperature} onChange={(v) => setFormData({...formData, temperature: v})} icon={<Thermometer size={14}/>} />
                <InputGroup label="Humidity (%)" name="humidity" value={formData.humidity} onChange={(v) => setFormData({...formData, humidity: v})} icon={<Droplets size={14}/>} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Soil pH" name="ph" value={formData.ph} onChange={(v) => setFormData({...formData, ph: v})} icon={<Search size={14}/>} />
                <InputGroup label="Rainfall (mm)" name="rainfall" value={formData.rainfall} onChange={(v) => setFormData({...formData, rainfall: v})} icon={<CloudRain size={14}/>} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-luminous w-full flex items-center justify-center gap-3 text-lg py-4"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Calculating...
                </div>
              ) : (
                <><Sprout size={22} className="fill-current"/> Predict Optimal Crop</>
              )}
            </button>
          </form>
        </GlassCard>

        <div className="space-y-6 relative">
          {prediction ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <GlassCard className="border-primary-500/30 bg-primary-500/[0.02]">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <TrendingUp size={28} className="text-primary-400" />
                    Top Matches
                  </h2>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">AI Confidence</p>
                    <p className="text-3xl font-black text-luminous-green">{prediction.confidence}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {prediction.recommendations.map((crop, i) => (
                    <motion.div
                      key={crop}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                        i === 0 
                        ? 'bg-primary-600/10 border-primary-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black ${
                          i === 0 ? 'bg-primary-600 text-white' : 'bg-white/10 text-gray-400'
                        }`}>
                          {i + 1}
                        </div>
                        <div>
                          <span className="text-2xl font-bold text-white capitalize">{crop}</span>
                          {i === 0 && <p className="text-xs font-bold text-primary-400 uppercase mt-0.5 tracking-widest">Recommended Choice</p>}
                        </div>
                      </div>
                      {i === 0 && (
                        <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                          <Sprout size={20} className="text-primary-400" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-10 p-6 bg-white/5 rounded-2xl border border-white/5">
                   <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">Why this recommendation?</h4>
                   <p className="text-gray-400 text-sm leading-relaxed">Based on your N-P-K levels and the current moisture content, these crops have a higher probability of healthy yield and pest resistance.</p>
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <div className="h-full">
              <GlassCard className="h-full flex flex-col items-center justify-center text-center py-32 bg-white/[0.02] border-dashed border-white/10">
                <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 relative">
                  <Sprout size={48} className="text-gray-600" />
                  <div className="absolute inset-0 bg-primary-500/5 blur-2xl rounded-full" />
                </div>
                <h3 className="text-2xl font-bold text-gray-400">Analysis Pending</h3>
                <p className="text-gray-500 mt-4 max-w-[280px] leading-relaxed mx-auto">
                  Provide your soil and environmental metrics to see the AI recommendations.
                </p>
              </GlassCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, name, value, onChange, icon }) => (
  <div className="space-y-3">
    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 ml-1">
      {icon} {label}
    </label>
    <div className="relative group">
      <input
        type="number"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white font-medium focus:outline-none focus:border-primary-500/50 focus:bg-white/[0.08] transition-all duration-300"
      />
      <div className="absolute inset-0 rounded-2xl bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  </div>
);


// const TrendingUp = ({ className, size }) => (
//   <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
// );

export default CropPredictor;
