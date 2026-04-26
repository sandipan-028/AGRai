import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import { Upload, Camera, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DiseaseScanner = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleScan = () => {
    setScanning(true);
    // Simulate API call
    setTimeout(() => {
      setResult({
        disease: "Powdery Mildew",
        severity: "High",
        confidence: "94.2%",
        treatment: "Spray organic neem oil or potassium bicarbonate. Improve air circulation and reduce humidity around the plant.",
        care: ["Prune infected leaves", "Avoid overhead watering", "Apply organic mulch"]
      });
      setScanning(false);
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold tracking-tight text-white"
        >
          AI <span className="text-luminous">Disease Scanner</span>
        </motion.h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Upload a photo of your plant's leaves to detect diseases instantly using our advanced computer vision model.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <GlassCard className="flex flex-col items-center justify-center min-h-[450px]">
          {selectedImage ? (
            <div className="relative w-full h-full flex flex-col items-center">
              <div className="relative rounded-3xl overflow-hidden border-2 border-white/10 group shadow-2xl">
                <img src={selectedImage} alt="Preview" className="max-h-[350px] object-cover transition-transform duration-700 group-hover:scale-105" />
                <AnimatePresence>
                  {scanning && (
                    <motion.div
                      initial={{ top: 0 }}
                      animate={{ top: '100%' }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-1.5 bg-luminous-green shadow-[0_0_30px_#00ff88] z-20"
                    />
                  )}
                </AnimatePresence>
                {scanning && (
                  <div className="absolute inset-0 bg-primary-600/10 backdrop-blur-[2px] animate-pulse" />
                )}
              </div>
              <div className="mt-8 flex gap-4 w-full">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 font-medium text-gray-300 hover:text-white"
                >
                  Change Photo
                </button>
                <button
                  onClick={handleScan}
                  disabled={scanning}
                  className="flex-[2] btn-luminous flex items-center justify-center gap-3 text-lg"
                >
                  {scanning ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </div>
                  ) : (
                    <><Zap size={20} className="fill-current"/> Start AI Analysis</>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer group py-16 px-8 text-center border-2 border-dashed border-white/10 rounded-3xl hover:border-primary-500/50 transition-all duration-500">
              <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              <div className="w-24 h-24 bg-primary-600/10 rounded-[2.5rem] flex items-center justify-center group-hover:bg-primary-600/20 group-hover:scale-110 transition-all duration-500 shadow-inner">
                <Camera size={40} className="text-primary-400 group-hover:text-luminous-green transition-colors" />
              </div>
              <p className="mt-6 font-bold text-2xl text-white group-hover:text-luminous-green transition-colors">Click to Upload Image</p>
              <p className="text-gray-500 mt-2">or drag and drop plant leaf photo here</p>
              
              <div className="mt-10 flex gap-8">
                <div className="flex items-center gap-2.5 text-sm text-gray-400 font-medium">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                  Fast Detection
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-400 font-medium">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  Expert Advice
                </div>
              </div>
            </label>
          )}
        </GlassCard>

        <div className="space-y-6 relative">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              >
                <GlassCard className="border-luminous-green/30">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <p className="text-xs font-black text-primary-400 uppercase tracking-[0.2em] mb-2">Diagnostic Report</p>
                      <h2 className="text-4xl font-bold text-white leading-tight">{result.disease}</h2>
                    </div>
                    <div className="bg-primary-500/10 px-4 py-2 rounded-2xl border border-primary-500/20">
                      <p className="text-[10px] font-bold text-primary-400 uppercase mb-1">Confidence</p>
                      <p className="text-2xl font-black text-luminous-green">{result.confidence}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-8 px-5 py-2.5 bg-red-500/10 rounded-2xl border border-red-500/20 w-fit">
                    <AlertCircle size={20} className="text-red-400" />
                    <span className="font-bold text-red-300">Severity: {result.severity}</span>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                      <h3 className="font-bold text-lg mb-3 flex items-center gap-3 text-white">
                        <ShieldCheck size={22} className="text-primary-400" />
                        Organic Treatment Plan
                      </h3>
                      <p className="text-gray-300 leading-relaxed">{result.treatment}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-white text-lg mb-4">Recommended Care Steps</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {result.care.map((step, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-colors"
                          >
                            <div className="w-8 h-8 bg-primary-600/20 rounded-lg flex items-center justify-center font-bold text-primary-400">
                              {i + 1}
                            </div>
                            <span className="text-gray-300 font-medium">{step}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <div key="placeholder" className="h-full">
                <GlassCard className="h-full flex flex-col items-center justify-center text-center py-24 bg-white/[0.02] border-dashed border-white/10">
                  <div className="relative">
                    <Upload size={56} className="text-gray-600 mb-6" />
                    <div className="absolute -inset-4 bg-primary-500/5 blur-2xl rounded-full" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-400">Waiting for Scan</h3>
                  <p className="text-gray-500 mt-4 max-w-[280px] leading-relaxed">
                    Upload a leaf photo and initiate a scan to get an AI-powered health diagnosis.
                  </p>
                </GlassCard>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};


export default DiseaseScanner;
