import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';

export default function PeriodSyncScreen() {
  const [enabled, setEnabled] = useState(false);
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const navigate = useNavigate();

  const handleNext = () => {
    const periodSyncData = {
      enabled,
      lastPeriodDate: enabled ? lastPeriodDate : null,
      cycleLength: enabled ? parseInt(cycleLength) : 28
    };
    localStorage.setItem('sj_setup_periodSync', JSON.stringify(periodSyncData));
    navigate('/setup/loading');
  };

  return (
    <div className="full-page" style={{ background: 'var(--gradient-warm)', paddingBottom: 40 }}>
      {/* Header Progress */}
      <div style={{ padding: '24px 20px 10px', maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>STEP 5 OF 5</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Skin Profile</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '100%' }} />
        </div>
      </div>

      <div className="page-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Back Button */}
        <div style={{ marginBottom: 16 }}>
          <button className="back-btn" onClick={() => navigate('/setup/health')}>
            <ArrowLeft size={18} />
          </button>
        </div>

        <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            display: 'inline-flex', padding: 12, borderRadius: '50%',
            background: 'var(--primary-glow)', color: 'var(--primary)', marginBottom: 12
          }}>
            <Calendar size={24} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Hormonal Cycle Syncing?</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Hormones directly impact sebum, hydration, and skin sensitivity. We can track your cycle to predict flares and tailor your routine.
          </p>
        </div>

        {/* Enable card */}
        <div className="card animate-fade-up delay-100" style={{
          marginBottom: 24,
          border: enabled ? '2px solid var(--primary)' : '1px solid var(--border-light)',
          background: enabled ? 'rgba(0,168,107,0.02)' : 'white',
          cursor: 'pointer'
        }} onClick={() => setEnabled(!enabled)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 28 }}>🌸</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Enable Hormonal Syncing</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Predict oily/dry phases, hormonal acne breakouts, and cycle-specific ingredients.</p>
            </div>
            <div style={{
              width: 44, height: 24, borderRadius: 99,
              background: enabled ? 'var(--primary)' : '#CBD5E1',
              position: 'relative',
              transition: 'background 0.3s'
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%', background: 'white',
                position: 'absolute', top: 3, left: enabled ? 23 : 3,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </div>
          </div>
        </div>

        {/* Inputs */}
        {enabled && (
          <div className="flex flex-col gap-4 animate-scale-in" style={{ marginBottom: 24 }}>
            <div className="input-group">
              <label className="input-label">Last Period Start Date</label>
              <input
                type="date"
                className="input-field"
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                style={{ fontFamily: 'var(--font-primary)' }}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Typical Cycle Length (Days)</label>
              <input
                type="number"
                min="20"
                max="45"
                className="input-field"
                value={cycleLength}
                onChange={(e) => setCycleLength(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Action */}
        <div className="animate-fade-up delay-200">
          <button
            className="btn btn-primary btn-lg btn-block"
            disabled={enabled && !lastPeriodDate}
            onClick={handleNext}
          >
            Finish Profile Setup <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
