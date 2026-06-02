import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Heart } from 'lucide-react';

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-warm)', display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '40px 24px 20px', textAlign: 'center'
      }}>
        {/* Brand mark */}
        <div className="animate-float" style={{
          width: 120, height: 120, borderRadius: 36,
          background: 'linear-gradient(135deg, #00A86B, #8B5CF6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 56, marginBottom: 32, boxShadow: '0 20px 60px rgba(0,168,107,0.35)'
        }}>🌿</div>

        <div className="animate-fade-up">
          <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 16 }}>
            Your Skin Deserves<br />
            <span className="gradient-text">Better</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, maxWidth: 320 }}>
            Scan products, decode ingredients, and let AI be your personal skincare bestie. 
          </p>
        </div>

        {/* Feature pills */}
        <div className="animate-fade-up delay-200" style={{ display: 'flex', gap: 10, marginTop: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { icon: '🔬', text: 'AI Scanning' },
            { icon: '🛡️', text: 'Safety Reports' },
            { icon: '✨', text: 'Glow Tracking' },
          ].map(item => (
            <div key={item.text} className="chip" style={{ background: 'white' }}>
              {item.icon} {item.text}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="animate-fade-up delay-300" style={{
          display: 'flex', gap: 32, marginTop: 40,
          background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)',
          borderRadius: 20, padding: '20px 32px', border: '1px solid rgba(255,255,255,0.8)'
        }}>
          {[
            { value: '10K+', label: 'Products' },
            { value: '50K+', label: 'Users' },
            { value: '99%', label: 'Accuracy' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="animate-fade-up delay-400" style={{ padding: '0 24px 48px' }}>
        <button className="btn btn-primary btn-lg btn-block" onClick={() => navigate('/intro')}>
          Get Started <ArrowRight size={20} />
        </button>
        <button className="btn btn-ghost btn-block mt-3" onClick={() => navigate('/login')}
          style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Already have an account? <strong style={{ color: 'var(--primary)' }}> Login</strong>
        </button>
      </div>
    </div>
  );
}
