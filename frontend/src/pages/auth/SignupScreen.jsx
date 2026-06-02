import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';

export default function SignupScreen() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', age: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill in all fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const { data } = await authAPI.signup({ name: form.name, email: form.email, password: form.password, age: form.age ? parseInt(form.age) : undefined });
      toast.success('Account created! Check your email for OTP ✉️');
      navigate('/otp', { state: { userId: data.userId, email: form.email, isNewUser: true } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--gradient-warm)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ padding: '20px 24px' }}>
        <button className="back-btn" onClick={() => navigate('/intro')}><ArrowLeft size={20} /></button>
      </div>

      <div style={{ flex: 1, padding: '0 24px 48px' }}>
        <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>✨</div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Create Account</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: 14 }}>
            Join thousands glowing smarter
          </p>
        </div>

        <div className="card animate-fade-up delay-100" style={{ padding: 28 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input type="text" name="name" className="input-field" placeholder="Your name" value={form.name} onChange={handleChange} />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Email</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input type="email" name="email" className="input-field" placeholder="your@email.com" value={form.email} onChange={handleChange} />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Age <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
              <div className="input-wrapper">
                <Calendar size={18} className="input-icon" />
                <input type="number" name="age" className="input-field" placeholder="Your age" value={form.age} onChange={handleChange} min="10" max="100" />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input type={showPw ? 'text' : 'password'} name="password" className="input-field" placeholder="Min 6 characters" value={form.password} onChange={handleChange} />
                <button type="button" className="input-icon-right" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Confirm Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input type="password" name="confirmPassword" className="input-field" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} />
              </div>
            </div>

            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>

            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
              {loading ? <><div className="spinner spinner-sm" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />Creating…</> : 'Create Account 🌿'}
            </button>
          </form>
        </div>

        <p className="animate-fade-up delay-200" style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
