import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { carebotAPI } from '../../services/api';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, Sparkles, Sun, Moon, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const GOALS = [
  { id: 'acne', label: 'Clear Acne & Blemishes', desc: 'Reduce active pimples, target blackheads, and prevent clogged pores.', emoji: '🧼' },
  { id: 'glow', label: 'Boost Skin Glow', desc: 'Fade dark spots, improve skin radiance, and even tone.', emoji: '✨' },
  { id: 'antiaging', label: 'Anti-Aging & Plumping', desc: 'Smoothen fine lines, stimulate collagen, and plump sagging areas.', emoji: '⏳' },
  { id: 'barrier', label: 'Rebuild Moisture Barrier', desc: 'Calm redness, heal eczema irritation, and locks moisture.', emoji: '🛡️' }
];

export default function RoutineBuilderScreen() {
  const navigate = useNavigate();

  const [selectedGoal, setSelectedGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [routine, setRoutine] = useState(null);
  const [activeTab, setActiveTab] = useState('morning'); // 'morning' | 'evening'

  const handleGenerate = async () => {
    if (!selectedGoal) return;
    setLoading(true);
    try {
      const { data } = await carebotAPI.buildRoutine({ goals: selectedGoal });
      if (data.success) {
        setRoutine(data.routine);
      } else {
        setRoutine(getMockRoutine(selectedGoal));
      }
    } catch (err) {
      console.warn('Backend build-routine offline. Triggering mock builder.');
      setTimeout(() => {
        setRoutine(getMockRoutine(selectedGoal));
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const getMockRoutine = (goal) => {
    const messages = {
      acne: {
        msg: "Hey bestie! We are going to tackle acne gently, focusing on pore clearing without completely frying your skin barrier. Consistency is key! 🧼",
        mSteps: [
          { step: 1, product: 'Gentle Salicylic Cleanser', instruction: 'Massage into damp skin for 60 seconds to clear sebum.', duration: '1 min' },
          { step: 2, product: 'Soothing Centella Asiatica Toner', instruction: 'Pat gently onto dry face to calm active redness.', duration: '2 mins' },
          { step: 3, product: 'Lightweight Gel Hydrator', instruction: 'Oil-free moisture barrier support.', duration: '1 min' },
          { step: 4, product: 'Non-comedogenic SPF 30+', instruction: 'Protects hyperpigmentation from darkening.', duration: '1 min' }
        ],
        eSteps: [
          { step: 1, product: 'Micellar Water / Oil Pre-wash', instruction: 'Clears sunscreens and excess surface oil.', duration: '2 mins' },
          { step: 2, product: 'Gentle Foaming Cleanser', instruction: 'Deep secondary water wash.', duration: '1 min' },
          { step: 3, product: 'Targeted Adapalene or Spot Gel', instruction: 'Apply pea-sized amount over dry skin to treat acne cells.', duration: '2 mins' },
          { step: 4, product: 'Ceramide Barrier Cream', instruction: 'Seals moisture and prevents peeling from actives.', duration: '1 min' }
        ],
        actives: ['Salicylic Acid (BHA)', 'Niacinamide', 'Cica (Centella)'],
        avoid: ['Heavy Coconut Oils', 'Synthetic Fragrances']
      },
      glow: {
        msg: "Let's bring out that glass skin radiance, bestie! We'll use antioxidants to brighten hyperpigmentation and reveal your natural shine! ✨",
        mSteps: [
          { step: 1, product: 'Water Wash or Gentle Cleanser', instruction: 'Simple morning refresh.', duration: '1 min' },
          { step: 2, product: 'Vitamin C Serum (10%)', instruction: 'Pat 3-4 drops to neutralize free radical cells.', duration: '2 mins' },
          { step: 3, product: 'Brightening Niacinamide Lotion', instruction: 'Restores skin glow and calms redness.', duration: '1 min' },
          { step: 4, product: 'Broad Spectrum SPF 50', instruction: 'Mandatory daily sunscreen to protect brightened skin.', duration: '1 min' }
        ],
        eSteps: [
          { step: 1, product: 'Oil-based Cleansing Balm', instruction: 'Melts makeup, SPF, and surface dirt.', duration: '2 mins' },
          { step: 2, product: 'Gentle Hydrating Cleanser', instruction: 'Nourishing secondary wash.', duration: '1 min' },
          { step: 3, product: 'Glycolic Acid (AHA) Serum', instruction: 'Apply 3 nights a week to exfoliate dead surface cells.', duration: '2 mins' },
          { step: 4, product: 'Hyaluronic Acid + Moisture Balm', instruction: 'Locks in deep overnight hydration.', duration: '1 min' }
        ],
        actives: ['L-Ascorbic Acid (Vitamin C)', 'Niacinamide', 'Glycolic Acid'],
        avoid: ['Harsh physical facial scrubs']
      }
    };
    
    const fallback = messages[goal] || messages['acne'];
    return {
      morningRoutine: fallback.mSteps,
      eveningRoutine: fallback.eSteps,
      weeklyTreatments: ['Exfoliating clay mask (Once a week)'],
      ingredientsToLookFor: fallback.actives,
      ingredientsToAvoid: fallback.avoid,
      careBotMessage: fallback.msg
    };
  };

  return (
    <div className="full-page page-with-nav" style={{ background: 'var(--gradient-warm)' }}>
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => (routine ? setRoutine(null) : navigate(-1))}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>Routine Generator</h1>
      </div>

      <div className="page-container">
        {loading ? (
          <div className="centered-page" style={{ minHeight: 'auto', padding: 40 }}>
            <div className="spinner spinner-lg mb-3" />
            <h3 className="gradient-text font-bold">Formulating Custom AI Plan</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 240, marginTop: 6 }}>
              CareBot is tailoring steps for your skin type, filtering allergen databases, and mapping routine cycles...
            </p>
          </div>
        ) : !routine ? (
          <div className="animate-fade-up">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{
                display: 'inline-flex', padding: 12, borderRadius: '50%',
                background: 'var(--primary-glow)', color: 'var(--primary)', marginBottom: 12
              }}>
                <Sparkles size={24} />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 6 }}>Choose Your Skin Goal</h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                CareBot will construct a complete daily plan to target your goals safely.
              </p>
            </div>

            {/* Grid of Goals */}
            <div className="flex flex-col gap-3" style={{ marginBottom: 30 }}>
              {GOALS.map((g) => {
                const isSelected = selectedGoal === g.id;
                return (
                  <div
                    key={g.id}
                    className="card"
                    onClick={() => setSelectedGoal(g.id)}
                    style={{
                      cursor: 'pointer',
                      padding: '16px 20px',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                      background: isSelected ? 'rgba(0,168,107,0.02)' : 'white'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ fontSize: 28 }}>{g.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700 }}>{g.label}</h3>
                        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{g.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              className="btn btn-primary btn-lg btn-block"
              disabled={!selectedGoal}
              onClick={handleGenerate}
            >
              Generate AI Skincare Plan 🚀
            </button>
          </div>
        ) : (
          <div className="animate-fade-up">
            {/* CareBot Speech Bubble */}
            <div className="card-glass flex gap-3 items-start" style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 28 }}>💬</span>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary)' }}>CareBot Bestie</h4>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 4 }}>
                  "{routine.careBotMessage}"
                </p>
              </div>
            </div>

            {/* Tab morning vs evening */}
            <div className="tab-bar" style={{ marginBottom: 20 }}>
              <div
                className={`tab-item ${activeTab === 'morning' ? 'active' : ''}`}
                onClick={() => setActiveTab('morning')}
              >
                <Sun size={16} style={{ marginRight: 6, verticalAlign: 'middle', color: 'var(--warning)' }} /> AM Steps
              </div>
              <div
                className={`tab-item ${activeTab === 'evening' ? 'active' : ''}`}
                onClick={() => setActiveTab('evening')}
              >
                <Moon size={16} style={{ marginRight: 6, verticalAlign: 'middle', color: 'var(--accent)' }} /> PM Steps
              </div>
            </div>

            {/* List steps */}
            <div className="flex flex-col gap-3" style={{ marginBottom: 24 }}>
              {(activeTab === 'morning' ? routine.morningRoutine : routine.eveningRoutine)?.map((step) => (
                <div key={step.step} className="card flex items-start gap-4" style={{ padding: 16, borderLeft: `3px solid ${activeTab === 'morning' ? 'var(--warning)' : 'var(--accent)'}` }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: activeTab === 'morning' ? 'var(--warning-light)' : 'var(--accent-glow)',
                    color: activeTab === 'morning' ? 'var(--warning)' : 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 13, flexShrink: 0
                  }}>
                    {step.step}
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 800 }}>{step.product}</h4>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                      {step.instruction}
                    </p>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginTop: 6 }}>
                      ⏳ Duration: {step.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Ingredient Guides */}
            <div className="card flex flex-col gap-3" style={{ marginBottom: 30 }}>
              <h4 style={{ fontSize: 14, fontWeight: 800 }}>Ingredients Cheat-sheet</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <h5 style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)', marginBottom: 4 }}>🍀 INGREDIENTS TO LOOK FOR:</h5>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {routine.ingredientsToLookFor?.map((i) => (
                      <span key={i} className="badge badge-safe" style={{ fontSize: 10 }}>{i}</span>
                    ))}
                  </div>
                </div>
                
                <div className="divider" style={{ margin: '4px 0' }} />

                <div>
                  <h5 style={{ fontSize: 12, fontWeight: 700, color: 'var(--danger)', marginBottom: 4 }}>🚨 INGREDIENTS TO AVOID:</h5>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {routine.ingredientsToAvoid?.map((i) => (
                      <span key={i} className="badge badge-avoid" style={{ fontSize: 10 }}>{i}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
