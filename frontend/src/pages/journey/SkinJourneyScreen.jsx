import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { skinJourneyAPI } from '../../services/api';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, Sparkles, Plus, Image, Droplets, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SkinJourneyScreen() {
  const navigate = useNavigate();

  const [journeyData, setJourneyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const { data } = await skinJourneyAPI.getJourney();
        if (data.success) {
          setJourneyData(data.journey || { entries: [] });
        } else {
          setJourneyData({ entries: getMockEntries() });
        }
      } catch (err) {
        console.warn('Backend connection offline. Loading simulated skin logs.');
        setJourneyData({ entries: getMockEntries() });
      } finally {
        setLoading(false);
      }
    };

    fetchJourney();
  }, []);

  const getMockEntries = () => [
    {
      _id: '1',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      glowScore: 8,
      hydrationScore: 7,
      breakouts: 'none',
      notes: 'Skin felt extremely plump today. The Ceramide balm is doing wonders! Ate healthy.'
    },
    {
      _id: '2',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      glowScore: 6,
      hydrationScore: 4,
      breakouts: 'mild',
      notes: 'Felt a small acne spot on forehead. Estrogen dropping as luteal phase starts.'
    }
  ];

  return (
    <div className="full-page page-with-nav" style={{ background: 'var(--gradient-warm)' }}>
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>Skin Diary & Logs</h1>
      </div>

      <div className="page-container">
        {/* Quick Journey Navigation Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div
            className="card flex flex-col items-center justify-center text-center gap-2 animate-fade-up"
            onClick={() => navigate('/journey/log')}
            style={{ cursor: 'pointer', padding: 20 }}
          >
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,168,107,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: 20, justifyContent: 'center' }}>
              📝
            </div>
            <h4 style={{ fontSize: 13, fontWeight: 800 }}>Log Skin</h4>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Daily tracker</span>
          </div>

          <div
            className="card flex flex-col items-center justify-center text-center gap-2 animate-fade-up"
            onClick={() => navigate('/journey/hydration')}
            style={{ cursor: 'pointer', padding: 20 }}
          >
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(14,165,233,0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: 20, justifyContent: 'center' }}>
              💧
            </div>
            <h4 style={{ fontSize: 13, fontWeight: 800 }}>Hydration</h4>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Log water intake</span>
          </div>

          <div
            className="card flex flex-col items-center justify-center text-center gap-2 animate-fade-up delay-100"
            onClick={() => navigate('/journey/progress')}
            style={{ cursor: 'pointer', padding: 20 }}
          >
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: 20, justifyContent: 'center' }}>
              🖼️
            </div>
            <h4 style={{ fontSize: 13, fontWeight: 800 }}>Progress Logs</h4>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Before/After slider</span>
          </div>

          <div
            className="card flex flex-col items-center justify-center text-center gap-2 animate-fade-up delay-100"
            onClick={() => navigate('/journey/insights')}
            style={{ cursor: 'pointer', padding: 20 }}
          >
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(245,158,11,0.1)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: 20, justifyContent: 'center' }}>
              🔬
            </div>
            <h4 style={{ fontSize: 13, fontWeight: 800 }}>AI Insights</h4>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Deep cycle trends</span>
          </div>
        </div>

        {/* Glow Score detailed chart shortcut */}
        <div
          className="card flex items-center justify-between animate-fade-up delay-200"
          onClick={() => navigate('/journey/glow-score')}
          style={{ cursor: 'pointer', marginBottom: 24, padding: '16px 20px', borderLeft: '4px solid var(--primary)' }}
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <TrendingUp size={22} className="text-primary-color" />
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 800 }}>Analyze Glow Trend</h3>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>View weekly graph & score distribution</p>
            </div>
          </div>
          <ArrowRight size={18} style={{ color: 'var(--text-muted)' }} />
        </div>

        {/* Chronological logs */}
        <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }} className="animate-fade-up delay-200">Previous Journal Entries</h3>
        {loading ? (
          <div className="centered-page" style={{ minHeight: 'auto', padding: 40 }}>
            <div className="spinner" />
          </div>
        ) : (
          <div className="flex flex-col gap-3 animate-fade-up delay-300" style={{ marginBottom: 40 }}>
            {journeyData?.entries?.length > 0 ? (
              journeyData.entries.map((entry) => (
                <div key={entry._id} className="card flex flex-col gap-2" style={{ padding: 16, border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                      <Calendar size={12} /> {new Date(entry.date).toLocaleDateString()}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span className="badge badge-primary" style={{ fontSize: 10 }}>Glow: {entry.glowScore}/10</span>
                      <span className="badge badge-accent" style={{ fontSize: 10 }}>Hydrate: {entry.hydrationScore} cups</span>
                    </div>
                  </div>
                  
                  {entry.notes && (
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 4 }}>
                      "{entry.notes}"
                    </p>
                  )}
                  
                  {entry.breakouts && entry.breakouts !== 'none' && (
                    <span className="badge badge-avoid" style={{ width: 'fit-content', fontSize: 9, marginTop: 4 }}>
                      🚨 {entry.breakouts.toUpperCase()} BREAKOUTS ACTIVE
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-muted" style={{ padding: 40 }}>
                No skin diary logs recorded yet. Hit "Log Skin" to record your first day!
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
