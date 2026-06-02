import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const SKIN_TYPES = [
  { id: 'dry', label: 'Dry Skin', desc: 'Feels tight, flakey, needs deep hydration', emoji: '💧' },
  { id: 'oily', label: 'Oily Skin', desc: 'Excess shine, enlarged pores, acne-prone', emoji: '⚡' },
  { id: 'combination', label: 'Combination', desc: 'Oily T-zone, dry or normal cheeks', emoji: '⚖️' },
  { id: 'sensitive', label: 'Sensitive Skin', desc: 'Easily irritated, prone to redness', emoji: '🛡️' },
  { id: 'normal', label: 'Normal Skin', desc: 'Balanced hydration, few blemishes', emoji: '✨' },
];

export default function SkinTypeScreen() {
  const [selected, setSelected] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (!selected) return;
    localStorage.setItem('sj_setup_skinType', selected);
    navigate('/setup/allergies');
  };

  return (
    <div className="full-page" style={{ background: 'var(--gradient-warm)', paddingBottom: 40 }}>
      {/* Header Progress */}
      <div style={{ padding: '24px 20px 10px', maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>STEP 1 OF 5</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Skin Profile</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '20%' }} />
        </div>
      </div>

      <div className="page-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', padding: 12, borderRadius: '50%',
            background: 'var(--primary-glow)', color: 'var(--primary)', marginBottom: 12
          }}>
            <Sparkles size={24} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>What's your skin type?</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            This helps our AI personalize safety reports and recommend routine builders.
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3 animate-fade-up delay-100">
          {SKIN_TYPES.map((type) => {
            const isSelected = selected === type.id;
            return (
              <div
                key={type.id}
                className="card"
                onClick={() => setSelected(type.id)}
                style={{
                  cursor: 'pointer',
                  padding: '16px 20px',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                  background: isSelected ? 'rgba(0, 168, 107, 0.04)' : 'var(--gradient-card)',
                  transform: isSelected ? 'scale(1.01)' : 'none',
                  boxShadow: isSelected ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16
                }}
              >
                <div style={{ fontSize: 28 }}>{type.emoji}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
                    {type.label}
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{type.desc}</p>
                </div>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--text-muted)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isSelected ? 'var(--primary)' : 'transparent',
                  transition: 'all 0.2s'
                }}>
                  {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action */}
        <div className="animate-fade-up delay-300" style={{ marginTop: 40 }}>
          <button
            className="btn btn-primary btn-lg btn-block"
            disabled={!selected}
            onClick={handleNext}
          >
            Continue <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
