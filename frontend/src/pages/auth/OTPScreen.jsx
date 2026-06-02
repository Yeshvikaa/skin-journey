import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function OTPScreen() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const refs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { userId, email, isNewUser } = location.state || {};

  useEffect(() => {
    refs.current[0]?.focus();
    const timer = setInterval(() => setCountdown(c => c > 0 ? c - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!userId) { navigate('/login'); return null; }

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
    if (next.every(d => d) && next.join('').length === 6) handleVerify(next.join(''));
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handleVerify = async (code) => {
    const pin = code || otp.join('');
    if (pin.length !== 6) return toast.error('Enter all 6 digits');
    setLoading(true);
    try {
      const { data } = await authAPI.verifyOTP({ userId, otp: pin });
      login(data.user, data.token);
      toast.success('Email verified! 🎉');
      navigate('/setup/skin-type');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      refs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setResending(true);
    try {
      await authAPI.resendOTP({ userId });
      toast.success('New OTP sent!');
      setCountdown(60);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend');
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-warm)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 24px' }}>
        <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 24px 48px' }}>
        <div className="animate-scale-in" style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 24,
            background: 'linear-gradient(135deg, #00A86B, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40, margin: '0 auto 24px', boxShadow: '0 12px 40px rgba(0,168,107,0.3)'
          }}>✉️</div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Check Your Email</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: 15, lineHeight: 1.6 }}>
            We sent a 6-digit code to<br />
            <strong style={{ color: 'var(--primary)' }}>{email}</strong>
          </p>
        </div>

        {/* OTP inputs */}
        <div className="animate-fade-up delay-100" style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
          {otp.map((d, i) => (
            <input
              key={i}
              ref={el => refs.current[i] = el}
              type="text" inputMode="numeric"
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              maxLength={1}
              style={{
                width: 48, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 700,
                borderRadius: 12, border: `2px solid ${d ? 'var(--primary)' : 'var(--border-light)'}`,
                background: d ? 'rgba(0,168,107,0.05)' : 'white',
                outline: 'none', fontFamily: 'Outfit, sans-serif',
                transition: 'all 0.2s', color: 'var(--text-primary)',
                boxShadow: d ? '0 0 0 3px var(--primary-glow)' : 'none'
              }}
            />
          ))}
        </div>

        <button
          className="btn btn-primary btn-lg"
          style={{ width: 240, marginBottom: 20 }}
          onClick={() => handleVerify()} disabled={loading || otp.join('').length !== 6}
        >
          {loading ? <div className="spinner spinner-sm" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} /> : 'Verify Code ✓'}
        </button>

        <button
          onClick={handleResend} disabled={countdown > 0 || resending}
          style={{
            background: 'none', border: 'none', cursor: countdown > 0 ? 'default' : 'pointer',
            color: countdown > 0 ? 'var(--text-muted)' : 'var(--primary)',
            fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6
          }}
        >
          <RefreshCw size={14} />
          {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
        </button>
      </div>
    </div>
  );
}
