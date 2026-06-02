import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import toast from 'react-hot-toast';

const LOADING_STEPS = [
  'Analyzing your skin profile...',
  'Configuring Gemini safety scanner...',
  'Mapping chemical conflict rules...',
  'Customizing CareBot coach...',
  'All systems glow! Preparing dashboard...'
];

export default function ProfileSetupLoading() {
  const [stepIndex, setStepIndex] = useState(0);
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Increment the text step every 800ms
    const textTimer = setInterval(() => {
      setStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 800);

    const submitProfile = async () => {
      try {
        const skinType = localStorage.getItem('sj_setup_skinType') || 'normal';
        const allergies = JSON.parse(localStorage.getItem('sj_setup_allergies') || '[]');
        const medications = JSON.parse(localStorage.getItem('sj_setup_medications') || '[]');
        const healthConditions = JSON.parse(localStorage.getItem('sj_setup_healthConditions') || '[]');
        const periodSync = JSON.parse(localStorage.getItem('sj_setup_periodSync') || '{"enabled":false}');

        const payload = {
          skinType,
          allergies,
          medications,
          healthConditions,
          periodSync,
          profileCompleted: true
        };

        const { data } = await userAPI.updateProfile(payload);
        
        if (data.success) {
          updateUser(data.user);
          // Clear setup storage
          localStorage.removeItem('sj_setup_skinType');
          localStorage.removeItem('sj_setup_allergies');
          localStorage.removeItem('sj_setup_medications');
          localStorage.removeItem('sj_setup_healthConditions');
          localStorage.removeItem('sj_setup_periodSync');
          
          // Wait for final animation step
          setTimeout(() => {
            toast.success('Welcome to Skin Journey! Sparkle on ✨');
            navigate('/dashboard');
          }, 1200);
        } else {
          throw new Error(data.message || 'Profile setup failed');
        }
      } catch (err) {
        console.error('Setup failed:', err);
        toast.error(err.response?.data?.message || err.message || 'Connection error. Trying fallback...');
        
        // Fallback for offline/mock simulation
        setTimeout(() => {
          const fakeUser = JSON.parse(localStorage.getItem('sj_user') || '{}');
          fakeUser.profileCompleted = true;
          updateUser(fakeUser);
          navigate('/dashboard');
        }, 3000);
      }
    };

    submitProfile();

    return () => {
      clearInterval(textTimer);
    };
  }, [navigate, updateUser]);

  return (
    <div className="centered-page" style={{ background: 'linear-gradient(135deg, #00A86B 0%, #8B5CF6 100%)', color: 'white' }}>
      {/* Sparkly Floating Icons */}
      <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 32 }}>
        <div style={{
          width: 80, height: 80, borderRadius: '24px',
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)',
          border: '2px solid rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, margin: '20px auto', animation: 'pulse 1.8s infinite'
        }}>
          🔬
        </div>
        <div style={{
          position: 'absolute', top: -5, left: -5, fontSize: 24, animation: 'bounce 2.2s infinite'
        }}>✨</div>
        <div style={{
          position: 'absolute', bottom: -5, right: -5, fontSize: 24, animation: 'float 3s infinite'
        }}>🧪</div>
      </div>

      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.5px', fontFamily: 'Outfit' }}>
        Building Your Skin Intelligence
      </h2>

      <div className="card-glass" style={{ width: '100%', maxWidth: 320, padding: 20, textAlign: 'center' }}>
        <div className="spinner" style={{ borderTopColor: 'white', borderLeftColor: 'rgba(255,255,255,0.2)', borderWidth: 4, margin: '0 auto 20px', width: 48, height: 48 }} />
        <p style={{ fontSize: 14, fontWeight: 600, minHeight: 24, transition: 'all 0.3s' }}>
          {LOADING_STEPS[stepIndex]}
        </p>
      </div>

      <div style={{ marginTop: 24, width: '100%', maxWidth: 200, background: 'rgba(255,255,255,0.2)', height: 6, borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%', background: 'white',
          width: `${((stepIndex + 1) / LOADING_STEPS.length) * 100}%`,
          transition: 'width 0.4s ease'
        }} />
      </div>
    </div>
  );
}
