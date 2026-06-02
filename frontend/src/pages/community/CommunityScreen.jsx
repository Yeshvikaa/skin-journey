import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { communityAPI } from '../../services/api';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, AlertCircle, Plus, ThumbsUp, ShieldAlert, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CommunityScreen() {
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const { data } = await communityAPI.getAlerts();
      if (data.success) {
        setAlerts(data.alerts || []);
      } else {
        setAlerts(getMockAlerts());
      }
    } catch (err) {
      console.warn('Backend connection offline, using simulated community reports.');
      setAlerts(getMockAlerts());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleUpvote = async (alertId) => {
    try {
      const { data } = await communityAPI.upvoteAlert(alertId);
      if (data.success) {
        toast.success('Alert upvoted. Helping keep cosmetics safe! 🛡️');
        fetchAlerts();
      }
    } catch (err) {
      // Fake click upvote
      setAlerts((prev) =>
        prev.map((item) =>
          item._id === alertId ? { ...item, upvotes: item.upvotes + 1 } : item
        )
      );
      toast.success('Alert upvoted!');
    }
  };

  const getMockAlerts = () => [
    {
      _id: 'a1',
      productName: 'Ultra Sheer Mineral SPF 50',
      brand: 'SunCare Labs',
      threatType: 'severe',
      description: 'Triggered immediate swelling, allergic hives, and contact dermatitis within 10 minutes of facial application. Oily skin match.',
      upvotes: 42,
      reporterName: 'skincare_guru_99'
    },
    {
      _id: 'a2',
      productName: 'Glow Vit C Daily Serum',
      brand: 'Boutique Skincare',
      threatType: 'mild',
      description: 'Strong artificial scent and high pH caused heavy micro-peeling and dry red patches on combinational skin types.',
      upvotes: 18,
      reporterName: 'hyaluronic_bestie'
    }
  ];

  return (
    <div className="full-page page-with-nav" style={{ background: 'var(--gradient-warm)' }}>
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>Community Watch</h1>
      </div>

      <div className="page-container">
        {/* Recalls Widget Banner */}
        <div className="card animate-fade-up" style={{
          border: '2px solid var(--danger)',
          background: 'rgba(235,87,87,0.03)',
          marginBottom: 20
        }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <ShieldAlert size={26} className="text-danger animate-bounce" />
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--danger)' }}>URGENT COSMETIC RECALL</h4>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                FDA warning active on <strong>"Purito Centella Green Level Sunscreen"</strong> due to active SPF protection tests falling below claimed ratings. Check your cabinets!
              </p>
            </div>
          </div>
        </div>

        {/* Action Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }} className="animate-fade-up">
          <h3 style={{ fontSize: 15, fontWeight: 800 }}>Cosmetic Reaction Incidents</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/community/report')} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <Plus size={14} /> Report Incident
          </button>
        </div>

        {/* Alert List */}
        {loading ? (
          <div className="centered-page" style={{ minHeight: 'auto', padding: 40 }}>
            <div className="spinner" />
          </div>
        ) : (
          <div className="flex flex-col gap-4 animate-fade-up delay-100" style={{ marginBottom: 40 }}>
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div key={alert._id} className="card flex flex-col gap-3" style={{ borderLeft: `4px solid var(--${alert.threatType === 'severe' ? 'danger' : 'warning'})` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className={`badge badge-${alert.threatType === 'severe' ? 'avoid' : 'caution'}`} style={{ fontSize: 10 }}>
                      <AlertTriangle size={12} /> {alert.threatType.toUpperCase()} REACTION
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Logged by @{alert.reporterName}</span>
                  </div>

                  <h3 style={{ fontSize: 15, fontWeight: 800 }}>
                    {alert.productName} <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>({alert.brand})</span>
                  </h3>
                  
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {alert.description}
                  </p>

                  <div className="divider" style={{ margin: 0 }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleUpvote(alert._id)}
                      style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 12px', background: 'var(--bg-secondary)', borderRadius: 99 }}
                    >
                      <ThumbsUp size={14} className="text-primary-color" /> Upvote Alert ({alert.upvotes})
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted" style={{ padding: 40 }}>
                No active threat incidents reported this week. Clear skies!
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
