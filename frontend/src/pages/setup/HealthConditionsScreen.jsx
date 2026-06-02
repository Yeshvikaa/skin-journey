import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Heart } from 'lucide-react';

const COMMON_CONDITIONS = [
  'Rosacea', 'Eczema / Dermatitis', 'Psoriasis',
  'Acne Vulgaris', 'Hyperpigmentation', 'Pregnancy / Breastfeeding',
  'Severely Dehydrated', 'Sun Damaged', 'Melasma'
];

export default function HealthConditionsScreen() {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const toggleCondition = (condition) => {
    if (selected.includes(condition)) {
      setSelected(selected.filter(item => item !== condition));
    } else {
      setSelected([...selected, condition]);
    }
  };

  const handleNext = () => {
    localStorage.setItem('sj_setup_healthConditions', JSON.stringify(selected));
    navigate('/setup/period');
  };

  return (
    <div className="full-page" style={{ background: 'var(--gradient-warm)', paddingBottom: 40 }}>
      {/* Header Progress */}
      <div style={{ padding: '24px 20px 10px', maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>STEP 4 OF 5</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Skin Profile</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '80%' }} />
        </div>
      </div>

      <div className="page-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Back Button */}
        <div style={{ marginBottom: 16 }}>
          <button className="back-btn" onClick={() => navigate('/setup/medications')}>
            <ArrowLeft size={18} />
          </button>
        </div>

        <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', padding: 12, borderRadius: '50%',
            background: 'var(--danger-light)', color: 'var(--danger)', marginBottom: 12
          }}>
            <Heart size={24} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Skin & Body Conditions</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Do you have any specific skin conditions or are you currently pregnant/breastfeeding? Some ingredients are strictly unsafe for specific conditions.
          </p>
        </div>

        {/* Multi-select Grid */}
        <div className="animate-fade-up delay-100" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32
        }}>
          {COMMON_CONDITIONS.map((cond) => {
            const isSelected = selected.includes(cond);
            return (
              <div
                key={cond}
                onClick={() => toggleCondition(cond)}
                style={{
                  cursor: 'pointer',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'rgba(235, 87, 87, 0.06)' : 'white',
                  border: isSelected ? '2px solid var(--danger)' : '1px solid var(--border-light)',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: 13,
                  color: isSelected ? 'var(--danger)' : 'var(--text-secondary)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 64
                }}
              >
                {cond}
              </div>
            );
          })}
        </div>

        {/* Action */}
        <div className="animate-fade-up delay-200" style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleNext}>
            None of these
          </button>
          <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleNext}>
            Continue <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
