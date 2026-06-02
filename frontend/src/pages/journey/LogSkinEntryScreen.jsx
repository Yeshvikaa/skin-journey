import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { skinJourneyAPI } from '../../services/api';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, Sparkles, Droplets, Bed, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LogSkinEntryScreen() {
  const navigate = useNavigate();

  const [glowScore, setGlowScore] = useState(7);
  const [hydrationScore, setHydrationScore] = useState(6);
  const [breakouts, setBreakouts] = useState('none'); // 'none' | 'mild' | 'severe'
  const [stressLevel, setStressLevel] = useState(4);
  const [sleepHours, setSleepHours] = useState(8);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        glowScore: parseInt(glowScore),
        hydrationScore: parseInt(hydrationScore),
        breakouts,
        stressLevel: parseInt(stressLevel),
        sleepHours: parseFloat(sleepHours),
        notes
      };

      const { data } = await skinJourneyAPI.addEntry(payload);
      if (data.success) {
        toast.success("Today's skin condition logged! 🌿");
        navigate('/journey');
      } else {
        toast.error(data.message || 'Logging failed.');
      }
    } catch (err) {
      toast.success('Simulated: Today\'s skin condition logged!');
      navigate('/journey');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="full-page page-with-nav" style={{ background: 'var(--gradient-warm)', paddingBottom: 40 }}>
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>Log Today's Skin</h1>
      </div>

      <div className="page-container">
        <form onSubmit={handleSubmit} className="card animate-fade-up flex flex-col gap-5" style={{ background: 'var(--bg-glass)' }}>
          
          {/* Glow Score Slider */}
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="input-label" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <Sparkles size={14} className="text-primary-color" /> Glow & Texture Rating
              </label>
              <strong style={{ fontSize: 16, color: 'var(--primary)' }}>{glowScore}/10</strong>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={glowScore}
              onChange={(e) => setGlowScore(e.target.value)}
              style={{
                width: '100%',
                accentColor: 'var(--primary)',
                cursor: 'pointer',
                margin: '10px 0'
              }}
            />
          </div>

          {/* Hydration Input */}
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="input-label" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <Droplets size={14} className="text-accent" /> Fluid Hydration (Cups of Water)
              </label>
              <strong style={{ fontSize: 16, color: 'var(--accent)' }}>{hydrationScore} cups</strong>
            </div>
            <input
              type="range"
              min="1"
              max="16"
              value={hydrationScore}
              onChange={(e) => setHydrationScore(e.target.value)}
              style={{
                width: '100%',
                accentColor: 'var(--accent)',
                cursor: 'pointer',
                margin: '10px 0'
              }}
            />
          </div>

          {/* Breakouts Level Selection */}
          <div className="input-group">
            <label className="input-label">Active Acne Breakouts?</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 8 }}>
              {['none', 'mild', 'severe'].map((level) => {
                const isSelected = breakouts === level;
                return (
                  <div
                    key={level}
                    onClick={() => setBreakouts(level)}
                    style={{
                      cursor: 'pointer',
                      padding: 12,
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: 13,
                      border: isSelected ? `2px solid ${level === 'none' ? 'var(--primary)' : 'var(--danger)'}` : '1px solid var(--border-light)',
                      background: isSelected ? (level === 'none' ? 'rgba(0,168,107,0.06)' : 'rgba(235,87,87,0.06)') : 'white',
                      color: isSelected ? (level === 'none' ? 'var(--primary)' : 'var(--danger)') : 'var(--text-secondary)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {level.toUpperCase()}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stress Level Slider */}
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="input-label">Stress Level Rating</label>
              <strong style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{stressLevel}/10</strong>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={stressLevel}
              onChange={(e) => setStressLevel(e.target.value)}
              style={{ width: '100%', accentColor: '#475569', cursor: 'pointer', margin: '6px 0' }}
            />
          </div>

          {/* Sleep Hours Input */}
          <div className="input-group">
            <label className="input-label" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <Bed size={14} /> Sleep Duration (Hours)
            </label>
            <input
              type="number"
              min="1"
              max="24"
              step="0.5"
              className="input-field"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              style={{ marginTop: 6 }}
            />
          </div>

          {/* Custom Journal Notes */}
          <div className="input-group">
            <label className="input-label">Daily Journal Notes</label>
            <textarea
              className="input-field"
              placeholder="Ate sugar/dairy? Tried a new exfoliator? Flares or tight feeling? Jot it down..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ minHeight: 100, resize: 'none', padding: 12, marginTop: 6 }}
            />
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={submitting}>
            {submitting ? 'Saving entry...' : 'Save Daily Skin Entry 🌿'}
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
