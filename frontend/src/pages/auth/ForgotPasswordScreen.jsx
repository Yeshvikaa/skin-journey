import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email) return toast.error('Enter your email');
    setLoading(true);
    try {
      const { data } = await authAPI.forgotPassword({ email });
      setSent(true);
      toast.success('Reset code sent!');
      setTimeout(() => navigate('/otp', { state: { userId: data.userId, email, isReset: true } }), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-warm)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 24px' }}>
        <button className="back-btn" onClick={() => navigate('/login')}><ArrowLeft size={20} /></button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px 60px' }}>
        <div className="animate-scale-in" style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🔐</div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Forgot Password?</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: 15, lineHeight: 1.6 }}>
            No worries! Enter your email and we'll send a reset code.
          </p>
        </div>

        {!sent ? (
          <div className="card animate-fade-up delay-100" style={{ width: '100%', maxWidth: 380, padding: 28 }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input type="email" className="input-field" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
                {loading ? <div className="spinner spinner-sm" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} /> : 'Send Reset Code'}
              </button>
            </form>
          </div>
        ) : (
          <div className="animate-scale-in" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <p style={{ color: 'var(--primary)', fontWeight: 600 }}>Code sent! Redirecting…</p>
          </div>
        )}

        <Link to="/login" style={{ marginTop: 24, color: 'var(--text-secondary)', fontSize: 14 }}>
          Back to <strong style={{ color: 'var(--primary)' }}>Login</strong>
        </Link>
      </div>
    </div>
  );
}
