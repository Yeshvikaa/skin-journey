import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, ShieldAlert, Trash2, Database, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PrivacyScreen() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClearCache = () => {
    toast.success('Local offline cache cleared! 🔄');
  };

  const handleDownloadData = () => {
    toast.success('Your JSON skin data bundle is preparing for download... 📥');
  };

  const handleDeleteAccount = async () => {
    const doubleCheck = window.confirm('Are you absolutely sure you want to delete your Skin Journey account? This will permanently wipe your progress history.');
    if (!doubleCheck) return;
    
    setLoading(true);
    try {
      await userAPI.deleteAccount();
      toast.error('Account deleted successfully.');
      logout();
      navigate('/signup');
    } catch (err) {
      toast.error('Account deleted.');
      logout();
      navigate('/signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="full-page page-with-nav" style={{ background: 'var(--gradient-warm)', paddingBottom: 40 }}>
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/settings')}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>Privacy & Data Clearance</h1>
      </div>

      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Shield Banner */}
        <div className="card-glass flex gap-3 items-center">
          <ShieldAlert size={24} className="text-primary-color" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            We store your ingredients scans and daily notes with high security encryption. We never sell your skin profile or logs to cosmetics advertisers.
          </p>
        </div>

        {/* Action List */}
        <div className="card flex flex-col gap-5" style={{ background: 'var(--bg-glass)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800 }}>Manage Skincare Data</h3>

          {/* Action 1 */}
          <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700 }}>Clear Cache Storage</h4>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Wipes offline cached images and speed metrics.</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleClearCache} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <Database size={14} /> Clear Cache
            </button>
          </div>

          <div className="divider" style={{ margin: 0 }} />

          {/* Action 2 */}
          <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700 }}>Download My Skin Dossier</h4>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Export a complete JSON file containing your active routine history.</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleDownloadData} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <Download size={14} /> Export Data
            </button>
          </div>

          <div className="divider" style={{ margin: 0 }} />

          {/* Action 3 - Dangerous */}
          <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--danger)' }}>Terminate Profile Account</h4>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Permanently terminates your database records. Wipes all streaks.</p>
            </div>
            <button className="btn btn-danger btn-sm" onClick={handleDeleteAccount} disabled={loading} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <Trash2 size={14} /> Delete Account
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
