import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/layout/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import VayuBot from './pages/VayuBot';
import Simulator from './pages/Simulator';
import MapView from './pages/MapView';
import About from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-carbon-bg text-white font-rajdhani">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chatbot" element={<VayuBot />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0d1f17',
              color: '#fff',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              fontFamily: 'Share Tech Mono',
              fontSize: '12px',
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}
