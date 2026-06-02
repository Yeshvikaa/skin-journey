import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, Sparkles, Scale, AlertCircle } from 'lucide-react';

export default function ProductComparisonScreen() {
  const navigate = useNavigate();

  const [p1, setP1] = useState('Aqua Youth Hydra Serum');
  const [p2, setP2] = useState('Ordinary Hyaluronic Acid');

  // Hardcoded comparison metrics for beautiful demo
  const compData = {
    p1: { name: 'Aqua Youth Hydra Serum', riskScore: 5.5, riskLevel: 'caution', allergens: 2, actives: 'Niacinamide, Salicylic Acid' },
    p2: { name: 'Ordinary Hyaluronic Acid', riskScore: 1.2, riskLevel: 'safe', allergens: 0, actives: 'Hyaluronic Acid, Vitamin B5' }
  };

  return (
    <div className="full-page page-with-nav" style={{ background: 'var(--gradient-warm)' }}>
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>Product Comparison</h1>
      </div>

      <div className="page-container">
        {/* Comparison Hero Header */}
        <div className="card animate-fade-up text-center" style={{ marginBottom: 20 }}>
          <div style={{
            display: 'inline-flex', padding: 12, borderRadius: '50%',
            background: 'var(--primary-glow)', color: 'var(--primary)', marginBottom: 12
          }}>
            <Scale size={24} />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Side-by-Side Chemistry Check</h2>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Compare safety score, active ingredients, and allergy matches to make the best skincare purchase.
          </p>
        </div>

        {/* Side-by-Side Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {/* Product 1 */}
          <div className="card flex flex-col gap-3 animate-fade-up delay-100" style={{ borderTop: `4px solid ${compData.p1.riskLevel === 'safe' ? 'var(--success)' : 'var(--warning)'}` }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, minHeight: 40 }}>{compData.p1.name}</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontSize: 24, fontWeight: 900 }}>{compData.p1.riskScore}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>/10</span>
            </div>
            <span className={`badge badge-${compData.p1.riskLevel}`} style={{ textTransform: 'capitalize', fontSize: 11, width: 'fit-content' }}>
              {compData.p1.riskLevel}
            </span>
          </div>

          {/* Product 2 */}
          <div className="card flex flex-col gap-3 animate-fade-up delay-100" style={{ borderTop: `4px solid ${compData.p2.riskLevel === 'safe' ? 'var(--success)' : 'var(--warning)'}` }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, minHeight: 40 }}>{compData.p2.name}</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontSize: 24, fontWeight: 900 }}>{compData.p2.riskScore}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>/10</span>
            </div>
            <span className={`badge badge-${compData.p2.riskLevel}`} style={{ textTransform: 'capitalize', fontSize: 11, width: 'fit-content' }}>
              {compData.p2.riskLevel}
            </span>
          </div>
        </div>

        {/* Detail Comparison Table */}
        <div className="card animate-fade-up delay-200" style={{ marginBottom: 30 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>Detailed Specifications</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Row 1 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{compData.p1.actives}</span>
              <strong style={{ flex: 1, textTransform: 'uppercase', color: 'var(--text-muted)', fontSize: 11, textAlign: 'center' }}>Actives</strong>
              <span style={{ color: 'var(--text-secondary)', flex: 1, textAlign: 'right' }}>{compData.p2.actives}</span>
            </div>
            <div className="divider" style={{ margin: 0 }} />
            
            {/* Row 2 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: compData.p1.allergens > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 700, flex: 1 }}>
                {compData.p1.allergens} Matches
              </span>
              <strong style={{ flex: 1, textTransform: 'uppercase', color: 'var(--text-muted)', fontSize: 11, textAlign: 'center' }}>Allergies</strong>
              <span style={{ color: compData.p2.allergens > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 700, flex: 1, textAlign: 'right' }}>
                {compData.p2.allergens} Matches
              </span>
            </div>
            <div className="divider" style={{ margin: 0 }} />

            {/* Row 3 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ flex: 1 }}>PM Routine</span>
              <strong style={{ flex: 1, textTransform: 'uppercase', color: 'var(--text-muted)', fontSize: 11, textAlign: 'center' }}>Best Used</strong>
              <span style={{ flex: 1, textAlign: 'right' }}>AM & PM Routine</span>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
