import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, User, Bell, Shield, LogOut, ChevronRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully. Glow on! ✨');
    navigate('/login');
  };

  return (
    <div className="full-page page-with-nav" style={{ background: 'var(--gradient-warm)' }}>
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>Profile Settings</h1>
      </div>

      <div className="page-container">
        {/* User Card */}
        <div className="card text-center animate-fade-up" style={{ marginBottom: 24 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--gradient-primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, margin: '0 auto 12px', fontWeight: 800
          }}>
            {user?.name?.[0]?.toUpperCase() || 'B'}
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 900 }}>{user?.name || 'Bestie'}</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{user?.email}</p>
          <span className="badge badge-primary" style={{ textTransform: 'capitalize', fontSize: 11, padding: '4px 14px' }}>
            🌿 {user?.skinType || 'normal'} Skin Type
          </span>
        </div>

        {/* Menu list */}
        <div className="flex flex-col gap-3 animate-fade-up delay-100" style={{ marginBottom: 30 }}>
          
          <div
            className="card flex justify-between items-center"
            onClick={() => navigate('/settings/account')}
            style={{ cursor: 'pointer', padding: '16px 20px', border: '1px solid var(--border-light)' }}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <User size={18} className="text-primary-color" />
              <span style={{ fontSize: 14, fontWeight: 700 }}>Account Specifications</span>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>

          <div
            className="card flex justify-between items-center"
            onClick={() => navigate('/settings/notifications')}
            style={{ cursor: 'pointer', padding: '16px 20px', border: '1px solid var(--border-light)' }}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Bell size={18} className="text-accent" />
              <span style={{ fontSize: 14, fontWeight: 700 }}>Notification Toggles</span>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>

          <div
            className="card flex justify-between items-center"
            onClick={() => navigate('/settings/privacy')}
            style={{ cursor: 'pointer', padding: '16px 20px', border: '1px solid var(--border-light)' }}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Shield size={18} className="text-primary-color" />
              <span style={{ fontSize: 14, fontWeight: 700 }}>Privacy & Data Clearance</span>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </div>

          {/* Logout */}
          <div
            className="card flex justify-between items-center"
            onClick={handleLogout}
            style={{ cursor: 'pointer', padding: '16px 20px', border: '1.5px solid var(--danger-light)', background: 'rgba(235,87,87,0.02)' }}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--danger)' }}>
              <LogOut size={18} />
              <span style={{ fontSize: 14, fontWeight: 700 }}>Logout Profile</span>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--danger)' }} />
          </div>

        </div>
      </div>

      <BottomNav />
    </div>
  );
}
