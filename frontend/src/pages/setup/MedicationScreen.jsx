import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Pill } from 'lucide-react';

const COMMON_MEDS = [
  'Tretinoin (Retin-A)', 'Isotretinoin (Accutane)', 'Adapalene (Differin)',
  'Benzoyl Peroxide', 'Clindamycin (Topical)', 'Azelaic Acid',
  'Hydroquinone', 'Salicylic Acid (Rx strength)', 'Oral Spironolactone'
];

export default function MedicationScreen() {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const toggleMed = (med) => {
    if (selected.includes(med)) {
      setSelected(selected.filter(item => item !== med));
    } else {
      setSelected([...selected, med]);
    }
  };

  const handleNext = () => {
    localStorage.setItem('sj_setup_medications', JSON.stringify(selected));
    navigate('/setup/health');
  };

  return (
    <div className="full-page" style={{ background: 'var(--gradient-warm)', paddingBottom: 40 }}>
      {/* Header Progress */}
      <div style={{ padding: '24px 20px 10px', maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>STEP 3 OF 5</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Skin Profile</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '60%' }} />
        </div>
      </div>

      <div className="page-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Back Button */}
        <div style={{ marginBottom: 16 }}>
          <button className="back-btn" onClick={() => navigate('/setup/allergies')}>
            <ArrowLeft size={18} />
          </button>
        </div>

        <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', padding: 12, borderRadius: '50%',
            background: 'var(--accent-glow)', color: 'var(--accent)', marginBottom: 12
          }}>
            <Pill size={24} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Active Medications?</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Are you using any active prescription skin medications? We'll flag any products that might interfere or cause severe peeling/irritation.
          </p>
        </div>

        {/* Multi-select Grid */}
        <div className="animate-fade-up delay-100" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32
        }}>
          {COMMON_MEDS.map((med) => {
            const isSelected = selected.includes(med);
            return (
              <div
                key={med}
                onClick={() => toggleMed(med)}
                style={{
                  cursor: 'pointer',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--accent-glow)' : 'white',
                  border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border-light)',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: 13,
                  color: isSelected ? 'var(--accent)' : 'var(--text-secondary)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 64
                }}
              >
                {med}
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
