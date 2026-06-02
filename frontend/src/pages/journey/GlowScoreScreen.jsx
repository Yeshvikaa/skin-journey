import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, Sparkles, TrendingUp, Info } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const WEEK_DATA = [
  { name: 'Mon', score: 62 },
  { name: 'Tue', score: 65 },
  { name: 'Wed', score: 72 },
  { name: 'Thu', score: 69 },
  { name: 'Fri', score: 78 },
  { name: 'Sat', score: 75 },
  { name: 'Sun', score: 82 }
];

export default function GlowScoreScreen() {
  const navigate = useNavigate();
  const [data] = useState(WEEK_DATA);

  return (
    <div className="full-page page-with-nav" style={{ background: 'var(--gradient-warm)', paddingBottom: 40 }}>
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>Glow Score Analysis</h1>
      </div>

      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Stats card */}
        <div className="card flex items-center justify-between" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <TrendingUp size={24} className="text-primary-color" />
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 900 }}>Glow Up Trending!</h3>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>Skin health score rose by 12% this week</p>
            </div>
          </div>
          <span style={{ fontSize: 28, fontWeight: 900, color: 'var(--primary)' }}>+12%</span>
        </div>

        {/* Recharts Area Chart */}
        <div className="card" style={{ height: 260, padding: '20px 10px 10px', background: 'white' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis domain={[40, 100]} stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'white',
                  borderRadius: '12px',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  fontFamily: 'Outfit, sans-serif'
                }}
              />
              <Area type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Analysis Description */}
        <div className="card flex flex-col gap-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={16} className="text-primary-color" />
            <h4 style={{ fontSize: 14, fontWeight: 800 }}>Dermatology Analysis</h4>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Your Glow Score peaked on Sunday at <strong>82/100</strong>. This correlates directly with high sleep duration logged (9 hrs) and low stress levels. The minor dip on Thursday matches active acne purging after introducing the Glycolic Acid active. Barrier strength remains stable.
          </p>
        </div>

        <div className="card-glass flex gap-3 items-start">
          <Info size={18} className="text-primary-color" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            To sustain your glow index, avoid peeling physical scrubs and double down on hydration and SPF protection during exfoliating periods!
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
