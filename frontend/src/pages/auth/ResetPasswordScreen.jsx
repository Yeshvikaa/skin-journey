import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';

export default function ResetPasswordScreen() {
  const [form, setForm] = useState({ otp: '', newPassword: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) return toast.error('Passwords do not match');
    if (form.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await authAPI.resetPassword({ userId, otp: form.otp, newPassword: form.newPassword });
      toast.success('Password reset! Please login 🎉');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-warm)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 24px' }}>
        <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px 60px' }}>
        <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🔑</div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Reset Password</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: 14 }}>Enter the OTP from your email</p>
        </div>

        <div className="card animate-fade-up delay-100" style={{ width: '100%', maxWidth: 380, padding: 28 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="input-group">
              <label className="input-label">OTP Code</label>
              <input type="text" className="input-field" placeholder="6-digit code" value={form.otp}
                onChange={e => setForm(p => ({ ...p, otp: e.target.value }))} maxLength={6} inputMode="numeric" />
            </div>
            <div className="input-group">
              <label className="input-label">New Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input type={showPw ? 'text' : 'password'} className="input-field" placeholder="New password"
                  value={form.newPassword} onChange={e => setForm(p => ({ ...p, newPassword: e.target.value }))} />
                <button type="button" className="input-icon-right" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Confirm Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input type="password" className="input-field" placeholder="Repeat password"
                  value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
              {loading ? <div className="spinner spinner-sm" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} /> : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
