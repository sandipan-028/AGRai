import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Sprout, Scan, Mic, LogOut, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/crop-predictor', icon: <Sprout size={20} />, label: 'Crop Predictor' },
    { path: '/disease-scanner', icon: <Scan size={20} />, label: 'Disease Scanner' },
    { path: '/voice-assistant', icon: <Mic size={20} />, label: 'Voice Assistant' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-white overflow-hidden relative">
      {/* Luminous Background Orbs */}
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="luminous-glass m-4 rounded-3xl flex flex-col transition-all duration-300 z-10"
      >
        <div className="p-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/40">
            <Sprout className="text-white" />
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-bold text-xl tracking-tight text-luminous"
              >
                AgriAI
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative group ${
                  isActive
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="min-w-[24px] relative z-10">{item.icon}</div>
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="whitespace-nowrap relative z-10 font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {/* Active Indicator Glow */}
                  {isActive && (
                    <div className="absolute inset-0 bg-primary-600/10 blur-sm rounded-xl" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 p-3 w-full rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all duration-300"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto relative z-0">
        <header className="mb-8 flex justify-between items-center bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
          >
            <Menu />
          </button>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white">Farmer Sandipan</p>
              <p className="text-xs text-primary-400/80">West Bengal, India</p>
            </div>
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-primary-500 to-blue-500">
              <div className="w-10 h-10 rounded-full bg-slate-900 overflow-hidden border-2 border-slate-900">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sandipan" alt="Avatar" />
              </div>
            </div>
          </div>
        </header>
        <div className="fade-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
};


export default Layout;
