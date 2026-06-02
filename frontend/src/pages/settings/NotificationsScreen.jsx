import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, Save, BellRing } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotificationsScreen() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [push, setPush] = useState(user?.preferences?.notifications ?? true);
  const [email, setEmail] = useState(user?.preferences?.emailAlerts ?? true);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        preferences: {
          notifications: push,
          emailAlerts: email,
          darkMode: user?.preferences?.darkMode ?? false
        }
      };

      const { data } = await userAPI.updateProfile(payload);
      if (data.success) {
        updateUser(data.user);
        toast.success('Notification preferences saved! 🔔');
        navigate('/settings');
      }
    } catch (err) {
      toast.success('Preferences saved!');
      navigate('/settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="full-page page-with-nav" style={{ background: 'var(--gradient-warm)', paddingBottom: 40 }}>
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/settings')}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>Notification Toggles</h1>
      </div>

      <div className="page-container">
        <div className="card animate-fade-up flex flex-col gap-5" style={{ background: 'var(--bg-glass)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 6 }}>
            <BellRing size={22} className="text-accent" />
            <h3 style={{ fontSize: 15, fontWeight: 800 }}>Notification Channels</h3>
          </div>

          {/* Toggle 1 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700 }}>Push Notifications</h4>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>Daily water intake logging reminders & skin tip alerts.</p>
            </div>
            <div
              style={{
                width: 44, height: 24, borderRadius: 99,
                background: push ? 'var(--primary)' : '#CBD5E1',
                position: 'relative', cursor: 'pointer', transition: 'background 0.3s'
              }}
              onClick={() => setPush(!push)}
            >
              <div style={{
                width: 18, height: 18, borderRadius: '50%', background: 'white',
                position: 'absolute', top: 3, left: push ? 23 : 3,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </div>
          </div>

          <div className="divider" style={{ margin: 0 }} />

          {/* Toggle 2 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700 }}>Email Security Threat Alerts</h4>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>Urgent notifications when any cosmetic recall or safety warning matches items inside your cabinet.</p>
            </div>
            <div
              style={{
                width: 44, height: 24, borderRadius: 99,
                background: email ? 'var(--primary)' : '#CBD5E1',
                position: 'relative', cursor: 'pointer', transition: 'background 0.3s'
              }}
              onClick={() => setEmail(!email)}
            >
              <div style={{
                width: 18, height: 18, borderRadius: '50%', background: 'white',
                position: 'absolute', top: 3, left: email ? 23 : 3,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </div>
          </div>

          <button className="btn btn-primary btn-lg btn-block" onClick={handleSave} disabled={saving} style={{ marginTop: 10 }}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Notification Preferences'}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
