import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundScreen() {
  const navigate = useNavigate();

  return (
    <div className="centered-page" style={{ background: 'var(--gradient-warm)', textCenter: 'center', textAlign: 'center' }}>
      <div style={{
        fontSize: 88, fontWeight: 900, letterSpacing: '-2px',
        background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent', marginBottom: 16
      }}>
        404
      </div>
      
      <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Cosmetic Page Lost! 🧪</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 280, margin: '0 auto 28px', lineHeight: 1.6 }}>
        Looks like this skincare page hasn't been formulated yet or the molecular bond was broken!
      </p>

      <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={16} /> Return to Dashboard
      </button>
    </div>
  );
}
