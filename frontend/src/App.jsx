import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CropPredictor from './pages/CropPredictor'
import DiseaseScanner from './pages/DiseaseScanner'
import VoiceAssistant from './pages/VoiceAssistant'
import Layout from './components/Layout'

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="crop-predictor" element={<CropPredictor />} />
          <Route path="disease-scanner" element={<DiseaseScanner />} />
          <Route path="voice-assistant" element={<VoiceAssistant />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default App
