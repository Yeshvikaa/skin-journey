import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { scanAPI } from '../../services/api';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, ShieldAlert, HeartCrack, Check } from 'lucide-react';

export default function AllergyWarningScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (id === 'mock-id-123') {
          setReport(getMockReport());
          setLoading(false);
          return;
        }

        const { data } = await scanAPI.getReport(id);
        if (data.success) {
          setReport(data.report);
        } else {
          setReport(getMockReport());
        }
      } catch (err) {
        setReport(getMockReport());
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const getMockReport = () => ({
    productName: 'Aqua Youth Hydra-Boost Serum',
    allergyConflicts: ['Fragrance & Perfume', 'Parabens']
  });

  if (loading) {
    return (
      <div className="centered-page" style={{ background: 'var(--gradient-warm)' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="full-page page-with-nav" style={{ background: 'var(--gradient-warm)' }}>
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800 }} className="text-danger">Allergy Alert!</h1>
      </div>

      <div className="page-container">
        {/* Giant Caution Card */}
        <div className="card animate-fade-up" style={{
          border: '2px solid var(--danger)',
          background: 'rgba(235, 87, 87, 0.04)',
          textAlign: 'center',
          padding: 30,
          boxShadow: 'var(--shadow-accent)',
          marginBottom: 20
        }}>
          <div style={{
            display: 'inline-flex', padding: 16, borderRadius: '50%',
            background: 'var(--danger-light)', color: 'var(--danger)', marginBottom: 16,
            animation: 'pulse 1.5s infinite'
          }}>
            <ShieldAlert size={36} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--danger)', marginBottom: 6 }}>Allergen Clash!</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            This cosmetic contains active ingredients that clash with your saved allergy profile.
          </p>
        </div>

        {/* List of Matched Allergens */}
        <div className="card animate-fade-up delay-100" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--danger)', marginBottom: 12 }}>Matched Allergens</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {report?.allergyConflicts?.map((allergy) => (
              <div key={allergy} style={{
                background: 'var(--danger-light)',
                border: '1px solid rgba(235, 87, 87, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontWeight: 700,
                color: 'var(--danger)',
                fontSize: 13
              }}>
                <HeartCrack size={18} /> {allergy}
              </div>
            ))}
          </div>
        </div>

        {/* AI Medical/Derm Advice */}
        <div className="card animate-fade-up delay-200" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>CareBot Safety Insight</h3>
          <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>
            "Hey bestie! Since you marked <strong>{report?.allergyConflicts?.join(' and ')}</strong> as allergens during onboarding, using <strong>{report?.productName}</strong> is highly likely to break down your moisture barrier, cause severe contact irritation, micro-redness, or dry flakey patches. I highly recommend opting for our allergen-free alternatives!"
          </p>
        </div>

        {/* Safe Actions */}
        <div className="animate-fade-up delay-300">
          <button className="btn btn-primary btn-lg btn-block" onClick={() => navigate('/scan/alternatives', { state: { alternatives: ['La Roche-Posay Toleriane Double Repair', 'CeraVe PM Facial Lotion'] } })}>
            View Safe Alternatives
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
