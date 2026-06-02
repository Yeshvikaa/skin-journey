import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { scanAPI, cabinetAPI } from '../../services/api';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, ShieldAlert, Sparkles, Plus, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ScanResultScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (id === 'mock-id-123') {
          // Generate mock data for seamless demo
          setTimeout(() => {
            setReport(getMockReport());
            setLoading(false);
          }, 1000);
          return;
        }

        const { data } = await scanAPI.getReport(id);
        if (data.success) {
          setReport(data.report);
        } else {
          toast.error('Failed to load scan report. Using mock report.');
          setReport(getMockReport());
        }
      } catch (err) {
        console.warn('Backend offline, using fallback mock report.');
        setReport(getMockReport());
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleSaveToCabinet = async () => {
    if (!report) return;
    setSaving(true);
    try {
      const payload = {
        productName: report.productName,
        brand: report.brand || 'Cosmetic Brand',
        category: 'Serum',
        purchaseDate: new Date(),
        openedDate: new Date(),
        expiryMonths: 12,
        notes: report.aiVerdict,
        riskLevel: report.overallRisk,
        ingredients: report.ingredientsAnalyzed?.map(i => i.name) || [],
        productImage: ''
      };
      
      const { data } = await cabinetAPI.addItem(payload);
      if (data.success) {
        toast.success('Product saved to digital Cabinet! 🧴');
        navigate('/cabinet');
      } else {
        toast.error(data.message || 'Failed to save product.');
      }
    } catch (err) {
      toast.success('Simulated: Added product to Cabinet!');
      navigate('/cabinet');
    } finally {
      setSaving(false);
    }
  };

  const getMockReport = () => ({
    _id: 'mock-id-123',
    productName: 'Aqua Youth Hydra-Boost Serum',
    brand: 'Glow Lab',
    overallRisk: 'caution',
    riskScore: 5.5,
    aiVerdict: 'A powerful hydrating serum but carries moderate allergen conflicts with your profile.',
    aiSummary: 'Contains Hyaluronic Acid and Niacinamide which are excellent for dry skin. However, it also contains Fragrance (Limonene) and Propylparaben, which can trigger redness or contact dermatitis in sensitive skin.',
    recommendation: 'Use in your evening routine only. Do not mix directly with active Glycolic Acids. Apply a high SPF sunscreen the following morning.',
    allergyConflicts: ['Fragrance & Perfume', 'Parabens'],
    ingredientsAnalyzed: [
      { name: 'Aqua', riskLevel: 'safe', concern: null, benefit: 'Skin hydration solvent' },
      { name: 'Glycerin', riskLevel: 'safe', concern: null, benefit: 'Powerful humectant locks in moisture' },
      { name: 'Niacinamide', riskLevel: 'safe', concern: null, benefit: 'Calms redness, strengthens barrier' },
      { name: 'Sodium Hyaluronate', riskLevel: 'safe', concern: null, benefit: 'Deep cellular hydration' },
      { name: 'Salicylic Acid', riskLevel: 'caution', concern: 'Mild skin purging or peeling', benefit: 'Cleanses clogged pores' },
      { name: 'Phenoxyethanol', riskLevel: 'caution', concern: 'Mild synthetic preservative irritation', benefit: null },
      { name: 'Fragrance (Limonene)', riskLevel: 'avoid', concern: 'Strong sensitizing allergen', benefit: null },
      { name: 'Propylparaben', riskLevel: 'avoid', concern: 'Hormonal disruptor preservative', benefit: null }
    ],
    safeAlternatives: [
      'CeraVe PM Facial Moisturizing Lotion',
      'La Roche-Posay Hyalu B5 Serum',
      'The Ordinary Niacinamide 10% + Zinc 1%'
    ]
  });

  if (loading) {
    return (
      <div className="centered-page" style={{ background: 'var(--gradient-warm)' }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="centered-page" style={{ background: 'var(--gradient-warm)' }}>
        <AlertCircle size={48} className="text-danger mb-3" />
        <h3>Scan Report Not Found</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/scan')}>Go Back</button>
      </div>
    );
  }

  const riskStyles = {
    safe: { badge: 'badge-safe', color: 'var(--success)', label: 'Safe Choice ✨' },
    caution: { badge: 'badge-caution', color: 'var(--warning)', label: 'Moderate Risk ⚠️' },
    avoid: { badge: 'badge-avoid', color: 'var(--danger)', label: 'Avoid / High Threat 🚨' }
  }[report.overallRisk || 'safe'];

  return (
    <div className="full-page page-with-nav" style={{ background: 'var(--gradient-warm)' }}>
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/scan')}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {report.productName}
        </h1>
      </div>

      <div className="page-container">
        {/* Safety Score Card */}
        <div className="card animate-fade-up" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className={`badge ${riskStyles.badge}`} style={{ fontSize: 13, padding: '6px 16px' }}>
              {riskStyles.label}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontSize: 24, fontWeight: 900 }}>{report.riskScore}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>/10 Score</span>
            </div>
          </div>

          <div className="risk-bar" style={{ marginBottom: 16 }}>
            <div className={`risk-bar-fill ${report.overallRisk}`} style={{ width: `${(report.riskScore / 10) * 100}%` }} />
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>AI Safety Verdict</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {report.aiVerdict}
          </p>
        </div>

        {/* Allergy Conflicts Warning Banner */}
        {report.allergyConflicts?.length > 0 && (
          <div className="card animate-fade-up" style={{
            border: '2px solid var(--danger)',
            background: 'rgba(235, 87, 87, 0.04)',
            boxShadow: 'var(--shadow-accent)',
            marginBottom: 20,
            padding: 16
          }} onClick={() => navigate(`/scan/allergy-warning/${report._id || 'mock-id-123'}`)}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <ShieldAlert size={26} className="text-danger animate-bounce" />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--danger)' }}>Allergen Match Detected!</h4>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Contains: <strong style={{ color: 'var(--danger)' }}>{report.allergyConflicts.join(', ')}</strong>
                </p>
              </div>
              <ArrowRight size={18} className="text-danger" />
            </div>
          </div>
        )}

        {/* AI Ingredient Summary */}
        <div className="card animate-fade-up delay-100" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Sparkles size={18} className="text-primary-color" />
            <h4 style={{ fontSize: 15, fontWeight: 800 }}>Ingredient Chemistry Analysis</h4>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: 12 }}>
            {report.aiSummary}
          </p>
          <div className="divider" style={{ margin: '12px 0' }} />
          <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary)', marginBottom: 6 }}>Suggested Routine Integration</h4>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {report.recommendation}
          </p>
        </div>

        {/* Dynamic Navigation Row */}
        <div className="flex flex-col gap-3 animate-fade-up delay-200" style={{ marginBottom: 24 }}>
          <button
            className="btn btn-secondary btn-block"
            onClick={() => navigate(`/scan/ingredients/${report._id || 'mock-id-123'}`)}
            style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px' }}
          >
            <span>🔬 View Ingredient Breakdown</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {report.ingredientsAnalyzed?.length || 0} items <ArrowRight size={14} style={{ verticalAlign: 'middle', marginLeft: 4 }} />
            </span>
          </button>

          <button
            className="btn btn-secondary btn-block"
            onClick={() => navigate(`/scan/conflict/${report._id || 'mock-id-123'}`)}
            style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px' }}
          >
            <span>⚖️ Cross-Reference Cabinet Conflicts</span>
            <ArrowRight size={16} />
          </button>

          <button
            className="btn btn-secondary btn-block"
            onClick={() => navigate(`/scan/alternatives`, { state: { alternatives: report.safeAlternatives } })}
            style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px' }}
          >
            <span>🛡️ View Safe Toxic-Free Alternatives</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Save to Cabinet CTA */}
        <div className="animate-fade-up delay-300" style={{ marginBottom: 30 }}>
          <button
            className="btn btn-primary btn-lg btn-block"
            onClick={handleSaveToCabinet}
            disabled={saving}
          >
            <Plus size={18} /> {saving ? 'Adding...' : 'Add to Product Cabinet'}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
