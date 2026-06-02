import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, Droplet, Plus, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HydrationTrackerScreen() {
  const navigate = useNavigate();
  const [cups, setCups] = useState(5);
  const targetCups = 8;

  const handleAddCup = () => {
    if (cups >= 16) return;
    setCups((prev) => prev + 1);
    toast.success('Gulp gulp! Hydration logged 💧');
  };

  const handleReset = () => {
    setCups(0);
    toast('Tracker reset to zero.', { icon: '🔄' });
  };

  const pct = Math.min((cups / targetCups) * 100, 100);

  return (
    <div className="full-page page-with-nav" style={{ background: 'var(--gradient-warm)', paddingBottom: 40 }}>
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>Hydration Tracker</h1>
      </div>

      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
        
        {/* Animated Droplet Cup Jar Visual */}
        <div className="relative animate-float" style={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          border: '4px solid var(--border)',
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(12px)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {/* Water level fill */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${pct}%`,
            background: 'linear-gradient(180deg, #38BDF8 0%, #0284C7 100%)',
            transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 1
          }} />

          {/* Text overlays */}
          <div style={{ zIndex: 10, textAlign: 'center', color: pct > 45 ? 'white' : 'var(--text-primary)' }}>
            <Droplet size={36} fill={pct > 45 ? 'white' : '#0284C7'} stroke={pct > 45 ? 'white' : '#0284C7'} style={{ margin: '0 auto 8px' }} />
            <h2 style={{ fontSize: 32, fontWeight: 900 }}>{cups} / {targetCups}</h2>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', opacity: 0.8 }}>Cups logged</p>
          </div>
        </div>

        {/* Liters conversion */}
        <div className="card text-center" style={{ width: '100%', padding: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>
            Total Intake: <strong>{(cups * 0.25).toFixed(2)} Liters</strong> ({(cups * 8.4).toFixed(0)} fl. oz)
          </span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12, width: '100%' }}>
          <button className="btn btn-secondary" onClick={handleReset} style={{ flexShrink: 0, width: 56, height: 56, padding: 0 }}>
            <RefreshCw size={20} />
          </button>
          <button className="btn btn-primary btn-lg" onClick={handleAddCup} style={{ flex: 1, display: 'flex', gap: 8, justifyCenter: 'center', alignItems: 'center' }}>
            <Plus size={18} /> Add 1 Cup (250ml)
          </button>
        </div>

        {/* AI Insight */}
        <div className="card-glass flex gap-3 items-start" style={{ width: '100%' }}>
          <span style={{ fontSize: 24 }}>💡</span>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 800 }}>Hydration Fact</h4>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 2 }}>
              Water plumps skin cells internally. Proper hydration accelerates cell turnover and reduces sebum thickness, leading to fewer clogged pores!
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
