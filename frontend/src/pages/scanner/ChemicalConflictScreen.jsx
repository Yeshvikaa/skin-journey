import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { scanAPI, cabinetAPI } from '../../services/api';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, ShieldCheck, ShieldAlert, Sparkles, Clock, RefreshCw, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChemicalConflictScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [hasConflicts, setHasConflicts] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [advice, setAdvice] = useState('');

  useEffect(() => {
    const runConflictCheck = async () => {
      try {
        if (id === 'mock-id-123') {
          // Simulate demo conflicts
          setTimeout(() => {
            setHasConflicts(true);
            setConflicts(getMockConflicts());
            setAdvice('We advise using these products at different times of the day or on alternating nights to protect your skin barrier.');
            setLoading(false);
          }, 1200);
          return;
        }

        // Fetch report first
        const reportRes = await scanAPI.getReport(id);
        if (reportRes.data.success) {
          const report = reportRes.data.report;
          
          // Send report ingredients to conflict check
          const conflictRes = await scanAPI.conflictCheck({
            newProductIngredients: report.ingredientsAnalyzed?.map(i => i.name)?.join(', ') || '',
            newProductName: report.productName
          });

          if (conflictRes.data.success) {
            setHasConflicts(conflictRes.data.hasConflicts);
            setConflicts(conflictRes.data.conflicts || []);
            setAdvice(conflictRes.data.conflicts?.[0]?.aiAdvice || 'Products are fully compatible.');
          } else {
            setHasConflicts(true);
            setConflicts(getMockConflicts());
          }
        }
      } catch (err) {
        console.warn('Backend connection error. Showing simulated conflicts.');
        setHasConflicts(true);
        setConflicts(getMockConflicts());
        setAdvice('Alter the routine schedule to prevent active peeling or dryness.');
      } finally {
        setLoading(false);
      }
    };

    runConflictCheck();
  }, [id]);

  const getMockConflicts = () => [
    {
      cabinetProduct: 'Nightly Retinol Serum (1% Retinol)',
      hasConflict: true,
      conflicts: [
        {
          ingredient1: 'Salicylic Acid',
          ingredient2: 'Retinol',
          severity: 'high',
          reason: 'Using Salicylic Acid (BHA) alongside Retinol drastically increases skin peeling, severe scaling, dryness, and can trigger a compromised moisture barrier.',
          recommendation: 'Use Salicylic Acid strictly in the morning, or alternate nights (e.g., Retinol on Mon/Wed, BHA on Tue/Thu).',
          waitTime: 'Alternating days recommended',
          saferRoutine: 'AM: Calming Hydrator + Salicylic Acid. PM: Retinol + Heavy barrier ceramide cream.'
        }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="centered-page" style={{ background: 'var(--gradient-warm)' }}>
        <div className="spinner spinner-lg" style={{ marginBottom: 16 }} />
        <p style={{ fontWeight: 600 }}>Analyzing Active Cabinet Pairings...</p>
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
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>Routine Conflict Check</h1>
      </div>

      <div className="page-container">
        {hasConflicts ? (
          <div className="animate-fade-up">
            {/* Warning Shield */}
            <div className="card" style={{
              border: '2px solid var(--warning)',
              background: 'rgba(245, 158, 11, 0.04)',
              textAlign: 'center',
              padding: 24,
              marginBottom: 20
            }}>
              <div style={{
                display: 'inline-flex', padding: 12, borderRadius: '50%',
                background: 'var(--warning-light)', color: 'var(--warning)', marginBottom: 12
              }}>
                <ShieldAlert size={30} />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--warning)', marginBottom: 6 }}>Active Conflicts Found!</h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                This product contains ingredients that clash with active items inside your Cabinet.
              </p>
            </div>

            {/* List of conflicts */}
            {conflicts.map((conflict, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                {conflict.conflicts?.map((detail, dIdx) => (
                  <div key={dIdx} className="card flex flex-col gap-3" style={{ borderLeft: '4px solid var(--danger)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="badge badge-avoid" style={{ fontSize: 11 }}>
                        <AlertTriangle size={12} /> {detail.severity.toUpperCase()} SEVERITY
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                        vs {conflict.cabinetProduct}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 16, fontWeight: 800 }}>
                      {detail.ingredient1} ❌ {detail.ingredient2}
                    </h3>
                    
                    <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>
                      <strong>Reason: </strong> {detail.reason}
                    </p>

                    <div className="divider" style={{ margin: '8px 0' }} />

                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13 }}>
                      <Clock size={16} style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <strong>Safe Separation: </strong> {detail.waitTime}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13 }}>
                      <RefreshCw size={16} style={{ color: 'var(--primary)', marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <strong>Recommended Safe Routine: </strong> {detail.saferRoutine}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* CareBot Coach advice */}
            <div className="card-glass flex gap-3 items-start animate-fade-up delay-100" style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 24 }}>💬</div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>CareBot Bestie Tip</h4>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  "{advice || 'Be sure to schedule active retinoids and acids on alternating evenings so your skin can recharge and rebuild its moisture barrier.'}"
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-up" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{
              display: 'inline-flex', padding: 24, borderRadius: '50%',
              background: 'var(--success-light)', color: 'var(--success)', marginBottom: 24,
              animation: 'pulse 1.8s infinite'
            }}>
              <ShieldCheck size={48} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--success)', marginBottom: 12 }}>Routine Fully Safe!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 300, margin: '0 auto 32px', lineHeight: 1.6 }}>
              Awesome! This product contains zero reactive conflict ingredients and is 100% chemically compatible with your active digital cabinet products!
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/cabinet')}>
              View Product Cabinet
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
