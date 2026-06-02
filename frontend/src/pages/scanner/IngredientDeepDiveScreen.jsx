import { useLocation, useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, Sparkles, CheckCircle2, ShieldAlert, Award, Compass } from 'lucide-react';

export default function IngredientDeepDiveScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve ingredient from state or fall back to default
  const { ingredient } = location.state || {
    ingredient: {
      name: 'Niacinamide (Vitamin B3)',
      riskLevel: 'safe',
      concern: null,
      benefit: 'Significantly improves skin elasticity, dramatically fades dark spots, regulates sebum production, and calms acne redness.'
    }
  };

  const getScore = (risk) => {
    if (risk === 'safe') return 1;
    if (risk === 'caution') return 4;
    return 8;
  };
  const score = getScore(ingredient.riskLevel);

  const getBadgeStyle = (risk) => {
    if (risk === 'safe') return 'badge-safe';
    if (risk === 'caution') return 'badge-caution';
    return 'badge-avoid';
  };

  return (
    <div className="full-page page-with-nav" style={{ background: 'var(--gradient-warm)' }}>
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>Ingredient Deep Dive</h1>
      </div>

      <div className="page-container">
        {/* Title Card */}
        <div className="card animate-fade-up" style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            display: 'inline-flex', padding: 14, borderRadius: '50%',
            background: 'var(--primary-glow)', color: 'var(--primary)', marginBottom: 14,
            fontSize: 24
          }}>
            🔬
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 6 }}>{ingredient.name}</h2>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 10 }}>
            <span className={`badge ${getBadgeStyle(ingredient.riskLevel)}`} style={{ textTransform: 'capitalize', fontSize: 12, padding: '6px 14px' }}>
              {ingredient.riskLevel} rating
            </span>
            <span className="badge badge-primary" style={{ fontSize: 12, padding: '6px 14px' }}>
              Score {score} / 10
            </span>
          </div>
        </div>

        {/* Hazard score bar */}
        <div className="card animate-fade-up delay-100" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Dermatological Hazard Index</h3>
          <div className="risk-bar" style={{ marginBottom: 8 }}>
            <div className={`risk-bar-fill ${ingredient.riskLevel}`} style={{ width: `${(score / 10) * 100}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
            <span>SAFE (0-2)</span>
            <span>CAUTION (3-6)</span>
            <span>AVOID (7-10)</span>
          </div>
        </div>

        {/* Benefits Card */}
        {ingredient.benefit && (
          <div className="card animate-fade-up delay-200" style={{
            borderLeft: '4px solid var(--success)',
            marginBottom: 20
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--success)' }}>
              <CheckCircle2 size={18} />
              <h3 style={{ fontSize: 15, fontWeight: 800 }}>Skin Benefits</h3>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {ingredient.benefit}
            </p>
          </div>
        )}

        {/* Concerns Card */}
        {ingredient.riskLevel !== 'safe' && (
          <div className="card animate-fade-up delay-200" style={{
            borderLeft: '4px solid var(--danger)',
            marginBottom: 20
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--danger)' }}>
              <ShieldAlert size={18} />
              <h3 style={{ fontSize: 15, fontWeight: 800 }}>Safety Concerns</h3>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {ingredient.concern || 'May trigger skin barrier compromise, contact dermatitis, or peeling if used in high percentages without proper barrier creams.'}
            </p>
          </div>
        )}

        {/* Chemistry Facts */}
        <div className="card animate-fade-up delay-300" style={{ marginBottom: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Compass size={18} className="text-accent" />
            <h3 style={{ fontSize: 15, fontWeight: 800 }}>Derm Facts & Pairings</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Molecular Function</span>
              <strong style={{ textAlign: 'right' }}>Barrier Humectant / Sebum Calmer</strong>
            </div>
            <div className="divider" style={{ margin: 0 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Best Paired With</span>
              <strong style={{ color: 'var(--success)', textAlign: 'right' }}>Hyaluronic Acid, Ceramides</strong>
            </div>
            <div className="divider" style={{ margin: 0 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Avoid Pairing With</span>
              <strong style={{ color: 'var(--danger)', textAlign: 'right' }}>Pure Low-pH Vitamin C (L-Ascorbic)</strong>
            </div>
            <div className="divider" style={{ margin: 0 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Usage Frequency</span>
              <strong style={{ textAlign: 'right' }}>Safe for Morning & Night</strong>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
