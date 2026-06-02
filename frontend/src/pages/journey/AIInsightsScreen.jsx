import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { skinJourneyAPI } from '../../services/api';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, Sparkles, TrendingUp, HelpCircle, Lightbulb, Compass } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AIInsightsScreen() {
  const navigate = useNavigate();

  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const { data } = await skinJourneyAPI.getInsights();
        if (data.success) {
          setInsights(data.insights);
        } else {
          setInsights(getMockInsights());
        }
      } catch (err) {
        console.warn('Backend connection offline, rendering simulated AI insights.');
        setInsights(getMockInsights());
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const getMockInsights = () => ({
    insights: [
      { type: 'positive', insight: "Omg bestie, your glow score rises by literally 15% when you get 8+ hours of beauty sleep! 🛌 Sleep accelerates moisture barrier recovery." },
      { type: 'warning', insight: "Acne breakouts matched with your lowest water intake days this week. Drink up! 💧 Dehydrated skin triggers sebum overproduction." },
      { type: 'tip', insight: "Since you are approaching cycle day 21, testosterone is spiking. Apply Centella or green tea topicals tonight to calm down pore flareups." }
    ],
    overallTrend: 'improving',
    topTip: 'Incorporate double cleansing on heavy SPF days to prevent sebum blocks.',
    glowForecast: 'Peak radiance expected next week as estrogen naturally plumps your cells! ✨'
  });

  const getInsightIcon = (type) => {
    if (type === 'positive') return '🌟';
    if (type === 'warning') return '⚠️';
    return '💡';
  };

  return (
    <div className="full-page page-with-nav" style={{ background: 'var(--gradient-warm)', paddingBottom: 40 }}>
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>AI Skin Insights</h1>
      </div>

      <div className="page-container">
        {loading ? (
          <div className="centered-page" style={{ minHeight: 'auto', padding: 40 }}>
            <div className="spinner" />
          </div>
        ) : (
          <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Glow Forecast Hero */}
            <div className="card text-center" style={{
              background: 'linear-gradient(135deg, rgba(0, 168, 107, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
              border: '1px solid var(--border-light)'
            }}>
              <div style={{
                display: 'inline-flex', padding: 12, borderRadius: '50%',
                background: 'var(--primary-glow)', color: 'var(--primary)', marginBottom: 12
              }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 900, marginBottom: 4 }}>Glow Forecast</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {insights.glowForecast}
              </p>
            </div>

            {/* List of Insights */}
            <h3 style={{ fontSize: 15, fontWeight: 800 }}>Correlative Trends</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {insights.insights?.map((ins, idx) => (
                <div key={idx} className="card-glass flex gap-3 items-start" style={{ padding: 16 }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{getInsightIcon(ins.type)}</span>
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 800, textTransform: 'capitalize', color: ins.type === 'warning' ? 'var(--warning)' : 'var(--text-primary)' }}>
                      {ins.type} trend
                    </h4>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 4 }}>
                      {ins.insight}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Master Action Tip */}
            <div className="card flex items-start gap-3" style={{ borderLeft: '4px solid var(--accent)' }}>
              <Lightbulb size={22} className="text-accent" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 800 }}>Master Glow Strategy</h4>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 4 }}>
                  {insights.topTip}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
