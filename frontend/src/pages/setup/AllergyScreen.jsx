import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';

const COMMON_ALLERGENS = [
  'Parabens', 'Sulfates', 'Fragrance & Perfume', 'Synthetic Colors',
  'Essential Oils', 'Salicylic Acid', 'Benzoyl Peroxide', 'Retinol / Retinoids',
  'Glycolic Acid', 'Nut Extracts / Almond Oil', 'Coconut Oil / Derivatives', 'Silicones'
];

export default function AllergyScreen() {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const toggleAllergy = (allergy) => {
    if (selected.includes(allergy)) {
      setSelected(selected.filter(item => item !== allergy));
    } else {
      setSelected([...selected, allergy]);
    }
  };

  const handleNext = () => {
    localStorage.setItem('sj_setup_allergies', JSON.stringify(selected));
    navigate('/setup/medications');
  };

  return (
    <div className="full-page" style={{ background: 'var(--gradient-warm)', paddingBottom: 40 }}>
      {/* Header Progress */}
      <div style={{ padding: '24px 20px 10px', maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>STEP 2 OF 5</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Skin Profile</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '40%' }} />
        </div>
      </div>

      <div className="page-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Back Button */}
        <div style={{ marginBottom: 16 }}>
          <button className="back-btn" onClick={() => navigate('/setup/skin-type')}>
            <ArrowLeft size={18} />
          </button>
        </div>

        <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', padding: 12, borderRadius: '50%',
            background: 'var(--danger-light)', color: 'var(--danger)', marginBottom: 12
          }}>
            <ShieldAlert size={24} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Cosmetic Allergies?</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Select any ingredients or common irritants you prefer to avoid. We will highlight these in your safety scans.
          </p>
        </div>

        {/* Multi-select Grid */}
        <div className="animate-fade-up delay-100" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32
        }}>
          {COMMON_ALLERGENS.map((allergy) => {
            const isSelected = selected.includes(allergy);
            return (
              <div
                key={allergy}
                onClick={() => toggleAllergy(allergy)}
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
                {allergy}
              </div>
            );
          })}
        </div>

        {/* Action */}
        <div className="animate-fade-up delay-200" style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleNext}>
            Skip Allergies
          </button>
          <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleNext}>
            Continue <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
