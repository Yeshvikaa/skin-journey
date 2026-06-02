import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scanAPI } from '../../services/api';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, Calendar, ShieldAlert, Check, AlertTriangle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ScanHistoryScreen() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await scanAPI.getHistory();
        if (data.success) {
          setHistory(data.reports || []);
        } else {
          setHistory(getMockHistory());
        }
      } catch (err) {
        console.warn('Backend connection offline, using simulated scan history.');
        setHistory(getMockHistory());
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getMockHistory = () => [
    {
      _id: 'mock-id-123',
      productName: 'Aqua Youth Hydra-Boost Serum',
      overallRisk: 'caution',
      riskScore: 5.5,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'mock-id-456',
      productName: 'CeraVe PM Moisturizing Lotion',
      overallRisk: 'safe',
      riskScore: 1.2,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const getBadgeStyle = (risk) => {
    if (risk === 'safe') return 'badge-safe';
    if (risk === 'caution') return 'badge-caution';
    return 'badge-avoid';
  };

  return (
    <div className="full-page page-with-nav" style={{ background: 'var(--gradient-warm)' }}>
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>Scan History</h1>
      </div>

      <div className="page-container">
        {loading ? (
          <div className="centered-page" style={{ minHeight: 'auto', padding: 40 }}>
            <div className="spinner" />
          </div>
        ) : (
          <div className="flex flex-col gap-3 animate-fade-up" style={{ marginBottom: 40 }}>
            {history.length > 0 ? (
              history.map((scan) => (
                <div
                  key={scan._id}
                  className="card flex justify-between items-center"
                  onClick={() => navigate(`/scan/result/${scan._id}`)}
                  style={{ cursor: 'pointer', padding: '16px 20px', border: '1.5px solid var(--border-light)' }}
                >
                  <div style={{ flex: 1, minWidth: 0, marginRight: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, color: 'var(--text-muted)', fontSize: 11 }}>
                      <Calendar size={12} /> {new Date(scan.createdAt).toLocaleDateString()}
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {scan.productName}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                      <span className={`badge ${getBadgeStyle(scan.overallRisk)}`} style={{ textTransform: 'capitalize', fontSize: 10 }}>
                        {scan.overallRisk}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>Score {scan.riskScore}</span>
                    </div>
                    <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted" style={{ padding: 40 }}>
                No safety scans completed yet. Point your camera at a bottle to start!
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
