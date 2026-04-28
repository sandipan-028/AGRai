import React, { useState, useRef } from 'react';
import GlassCard from '../components/GlassCard';
import { Mic, MicOff, Send, Volume2, Globe, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'ai', text: 'Namaste! I am your AgriAI assistant. How can I help you today?', lang: 'en' }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedLang, setSelectedLang] = useState('English');

  const languages = ['English', 'Hindi', 'Kannada', 'Tamil'];

  const recognitionRef = useRef(null);

  const langMap = {
    'English': 'en-US',
    'Hindi': 'hi-IN',
    'Kannada': 'kn-IN',
    'Tamil': 'ta-IN'
  };

  const speak = (text, lang) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langMap[lang] || 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = langMap[selectedLang];
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast.error('Voice recognition failed.');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleSend(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSend = async (text) => {
    const message = text || inputText;
    if (!message) return;

    setMessages(prev => [...prev, { type: 'user', text: message }]);
    setInputText('');

    try {
      const response = await fetch('http://localhost:8000/voice/process-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: message,
          target_lang: selectedLang
        })
      });

      if (!response.ok) throw new Error('Failed to fetch response');

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        type: 'ai',
        text: data.ai_response,
        lang: selectedLang
      }]);
      speak(data.ai_response, selectedLang);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get response from AgriAI.');
      setMessages(prev => [...prev, {
        type: 'ai',
        text: 'Sorry, I am having trouble connecting to the brain. Please try again.',
        lang: 'English'
      }]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-180px)] flex flex-col gap-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold flex items-center gap-4 justify-center md:justify-start">
            Agri<span className="text-luminous">Assistant</span> 
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <Sparkles className="text-primary-400" />
            </motion.div>
          </h1>
          <p className="text-gray-400 mt-1 font-medium">Multilingual support for your farming needs</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl">
          {languages.map(lang => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 ${
                selectedLang === lang 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' 
                : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden bg-white/[0.02] border-white/5">
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex ${msg.type === 'ai' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[85%] relative group ${
                msg.type === 'ai' ? 'pr-10' : 'pl-10'
              }`}>
                <div className={`p-5 rounded-3xl ${
                  msg.type === 'ai' 
                    ? 'bg-white/10 rounded-tl-none border border-white/10 text-white shadow-xl backdrop-blur-md' 
                    : 'bg-primary-600/90 rounded-tr-none text-white shadow-2xl shadow-primary-600/20 font-medium'
                }`}>
                  <p className="text-md leading-relaxed">{msg.text}</p>
                  {msg.type === 'ai' && (
                    <button 
                      onClick={() => speak(msg.text, msg.lang)}
                      className="mt-4 px-4 py-2 bg-primary-600/20 hover:bg-primary-600/30 border border-primary-500/20 rounded-xl text-primary-300 flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all"
                    >
                      <Volume2 size={16} /> Listen in {selectedLang}
                    </button>
                  )}
                </div>
                <div className={`absolute top-0 ${msg.type === 'ai' ? 'left-[-12px]' : 'right-[-12px]'}`}>
                   <div className={`w-3 h-3 rounded-full ${msg.type === 'ai' ? 'bg-primary-500' : 'bg-blue-500'} blur-[4px] animate-pulse`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-8 bg-white/5 border-t border-white/5 backdrop-blur-3xl">
          <div className="flex items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMicClick}
              className={`w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all duration-500 relative ${
                isListening 
                  ? 'bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.6)]' 
                  : 'btn-luminous'
              }`}
            >
              {isListening ? <MicOff size={28} /> : <Mic size={28} />}
              {isListening && (
                 <div className="absolute inset-[-8px] border-2 border-red-500/30 rounded-[2.2rem] animate-ping" />
              )}
            </motion.button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Ask in ${selectedLang}...`}
                className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 text-lg text-white font-medium focus:outline-none focus:border-primary-500/50 focus:bg-white/[0.08] pr-16 transition-all duration-300"
              />
              <button
                onClick={() => handleSend()}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary-600/20 rounded-xl flex items-center justify-center text-primary-400 hover:text-luminous-green hover:bg-primary-600/40 transition-all duration-300"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-center gap-2 mt-6"
              >
                {[1, 2, 3, 4, 5].map(i => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 24, 8] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                    className="w-1 bg-luminous-green rounded-full shadow-[0_0_10px_#00ff88]"
                  />
                ))}
                <span className="text-[10px] font-black text-primary-400 ml-4 uppercase tracking-[0.3em]">Processing Voice Input</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassCard>
    </div>
  );
};


export default VoiceAssistant;
