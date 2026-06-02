import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cycleSyncAPI, cabinetAPI, scanAPI } from '../../services/api';
import BottomNav from '../../components/BottomNav';

import {
  Settings,
  Sparkles,
  AlertCircle,
  Flame,
  History,
  Package
} from 'lucide-react';

import toast from 'react-hot-toast';

export default function DashboardScreen() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [cycleData, setCycleData] = useState(null);
  const [cabinetCount, setCabinetCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        await refreshUser();

        // Cycle Sync
        if (user?.periodSync?.enabled) {
          try {
            const { data } = await cycleSyncAPI.getPredictions();

            if (data.success) {
              setCycleData(data.prediction);
            }
          } catch (e) {
            console.warn('Cycle prediction failed:', e.message);
          }
        }

        // Cabinet
        try {
          const { data } = await cabinetAPI.getCabinet();

          if (data.success) {
            setCabinetCount(data.cabinet?.items?.length || 0);
          }
        } catch (e) {
          console.warn('Cabinet fetch failed');
        }

        // Scan History
        try {
          const { data } = await scanAPI.getHistory();

          if (data.success) {
            setHistoryCount(data.reports?.length || 0);
          }
        } catch (e) {
          console.warn('History fetch failed');
        }
      } catch (err) {
        console.error('Dashboard load error:', err);

        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const dailyTips = [
    'Always apply skincare from thinnest to thickest consistency.',
    'Use Retinoids only at night and apply SPF the next morning.',
    'Double cleansing removes sunscreen and makeup effectively.',
    'Niacinamide works beautifully with Hyaluronic Acid.'
  ];

  const [dailyTip] = useState(
    () => dailyTips[Math.floor(Math.random() * dailyTips.length)]
  );

  const glowScore = user?.glowScore || 72;
  const streak = user?.streakDays || 2;

  if (loading) {
    return (
      <div
        className="full-page"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div
      className="full-page page-with-nav"
      style={{
        background: 'var(--gradient-warm)',
        minHeight: '100vh'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 20px 12px',
          maxWidth: 480,
          margin: '0 auto',
          width: '100%'
        }}
      >
        <div>
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              fontWeight: 600
            }}
          >
            WELCOME BACK
          </p>

          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: '-0.5px'
            }}
          >
            Hey,{' '}
            <span className="gradient-text">
              {user?.name || 'Bestie'}
            </span>{' '}
            🌟
          </h1>
        </div>

        <button
          className="back-btn"
          style={{
            width: 44,
            height: 44
          }}
          onClick={() => navigate('/settings')}
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="page-container">
        {/* Glow Card */}
        <div
          className="card animate-fade-up"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,168,107,0.08) 0%, rgba(139,92,246,0.08) 100%)',
            border: '1px solid var(--border-light)',
            marginBottom: 20
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                className="badge badge-primary"
                style={{ marginBottom: 10 }}
              >
                <Sparkles size={12} />
                Glow Journey
              </div>

              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  marginBottom: 4
                }}
              >
                Your Glow Score
              </h2>

              <p
                style={{
                  fontSize: 13,
                  color: 'var(--text-secondary)'
                }}
              >
                Your skin is looking healthier!
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 12,
                  color: 'var(--warning)',
                  fontWeight: 700,
                  fontSize: 14
                }}
              >
                <Flame size={18} fill="currentColor" />
                {streak} Day Streak
              </div>
            </div>

            {/* Glow Ring */}
            <div
              className="glow-ring animate-pulse"
              style={{
                width: 100,
                height: 100,
                flexShrink: 0
              }}
            >
              <svg width="90" height="90">
                <circle
                  cx="45"
                  cy="45"
                  r="35"
                  stroke="rgba(0,0,0,0.05)"
                  strokeWidth="8"
                  fill="transparent"
                />

                <circle
                  cx="45"
                  cy="45"
                  r="35"
                  stroke="url(#glowGradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="220"
                  strokeDashoffset={
                    220 - (220 * glowScore) / 100
                  }
                  strokeLinecap="round"
                  style={{
                    transition: 'stroke-dashoffset 1s ease'
                  }}
                />

                <defs>
                  <linearGradient
                    id="glowGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--primary)"
                    />

                    <stop
                      offset="100%"
                      stopColor="var(--accent)"
                    />
                  </linearGradient>
                </defs>
              </svg>

              <div className="glow-ring-text">
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 900
                  }}
                >
                  {glowScore}
                </div>

                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: 'var(--text-muted)'
                  }}
                >
                  INDEX
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginBottom: 20
          }}
        >
          {/* Log Skin */}
          <div
            className="card animate-fade-up"
            onClick={() => navigate('/journey/log')}
            style={{
              cursor: 'pointer',
              padding: 16
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(0,168,107,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10
              }}
            >
              📝
            </div>

            <h3
              style={{
                fontSize: 14,
                fontWeight: 700
              }}
            >
              Log Skin
            </h3>

            <p
              style={{
                fontSize: 11,
                color: 'var(--text-secondary)'
              }}
            >
              Record your skin condition
            </p>
          </div>

          {/* Add Product */}
          <div
            className="card animate-fade-up"
            onClick={() => navigate('/cabinet/add')}
            style={{
              cursor: 'pointer',
              padding: 16
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(139,92,246,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10
              }}
            >
              ➕
            </div>

            <h3
              style={{
                fontSize: 14,
                fontWeight: 700
              }}
            >
              Add Product
            </h3>

            <p
              style={{
                fontSize: 11,
                color: 'var(--text-secondary)'
              }}
            >
              Save products to cabinet
            </p>
          </div>
        </div>

        {/* Cycle Sync */}
        {user?.periodSync?.enabled && (
          <div
            className="card"
            style={{
              borderLeft: '4px solid var(--accent)',
              marginBottom: 20
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 10
              }}
            >
              <span>🌸</span>

              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700
                }}
              >
                Cycle Sync Intelligence
              </h3>
            </div>

            <p
              style={{
                fontSize: 13,
                lineHeight: 1.5
              }}
            >
              {cycleData?.aiInsights ||
                'Skin may feel sensitive. Use calming ingredients.'}
            </p>
          </div>
        )}

        {/* AI Tip */}
        <div
          className="tip-card"
          style={{
            marginBottom: 20
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 12
            }}
          >
            <div style={{ fontSize: 24 }}>💡</div>

            <div>
              <h4
                style={{
                  fontSize: 14,
                  fontWeight: 800
                }}
              >
                AI SKIN TIP
              </h4>

              <p
                style={{
                  fontSize: 13,
                  marginTop: 4,
                  lineHeight: 1.5
                }}
              >
                {dailyTip}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginBottom: 20
          }}
        >
          {/* Cabinet */}
          <div
            className="card-glass"
            onClick={() => navigate('/cabinet')}
            style={{
              cursor: 'pointer',
              padding: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}
          >
            <Package size={20} />

            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800
                }}
              >
                {cabinetCount}
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: 'var(--text-muted)'
                }}
              >
                Cabinet Bottles
              </div>
            </div>
          </div>

          {/* History */}
          <div
            className="card-glass"
            onClick={() => navigate('/scan/history')}
            style={{
              cursor: 'pointer',
              padding: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}
          >
            <History size={20} />

            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800
                }}
              >
                {historyCount}
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: 'var(--text-muted)'
                }}
              >
                Scans Decoded
              </div>
            </div>
          </div>
        </div>

        {/* Community Alert */}
        <div
          className="card"
          style={{
            border: '1px dashed var(--danger)',
            background: 'rgba(235,87,87,0.03)',
            cursor: 'pointer',
            marginBottom: 30
          }}
          onClick={() => navigate('/community')}
        >
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start'
            }}
          >
            <AlertCircle size={22} />

            <div>
              <h4
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: 'var(--danger)'
                }}
              >
                Community Safety Alerts
              </h4>

              <p
                style={{
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  marginTop: 4
                }}
              >
                Active ingredient recalls and warnings.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}