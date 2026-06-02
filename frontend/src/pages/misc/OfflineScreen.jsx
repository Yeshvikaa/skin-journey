import { WifiOff, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OfflineScreen() {
  const handleRetry = () => {
    if (navigator.onLine) {
      toast.success('Connection restored! Reconnecting... 🟢');
      window.location.reload();
    } else {
      toast.error('Still offline. Please check your Wifi or cellular network. ⚠️');
    }
  };

  return (
    <div className="centered-page" style={{ background: 'var(--gradient-warm)', textCenter: 'center', textAlign: 'center' }}>
      <div style={{
        display: 'inline-flex', padding: 20, borderRadius: '50%',
        background: 'var(--danger-light)', color: 'var(--danger)', marginBottom: 24,
        animation: 'pulse 1.8s infinite'
      }}>
        <WifiOff size={48} />
      </div>

      <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Network Connection Disconnected</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 300, margin: '0 auto 32px', lineHeight: 1.6 }}>
        Skin Journey needs an active internet connection to query the Gemini safety database. Please check your Wifi settings and retry!
      </p>

      <button className="btn btn-primary" onClick={handleRetry} style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
        <RefreshCw size={16} /> Check Connection
      </button>
    </div>
  );
}
