import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('sj_token');

    const timer = setTimeout(() => {
      if (token) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/welcome', { replace: true });
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, []); // empty dependency is safer for splash screens

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #00A86B 0%, #007A4D 40%, #8B5CF6 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Ambient blobs */}
      <div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          top: -80,
          right: -80,
          filter: 'blur(40px)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(184,242,230,0.15)',
          bottom: 100,
          left: -60,
          filter: 'blur(30px)'
        }}
      />

      {/* Logo */}
      <div className="animate-scale-in" style={{ textAlign: 'center', zIndex: 1 }}>
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: '28px',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: 48,
            animation: 'float 3s ease-in-out infinite'
          }}
        >
          🌿
        </div>

        <h1
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 36,
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-0.5px',
            marginBottom: 8
          }}
        >
          Skin Journey
        </h1>

        <p
          style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: 14,
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Understand Your Skin. Glow Safer.
        </p>
      </div>

      {/* Spinner */}
      <div className="animate-fade-in delay-400" style={{ marginTop: 60, zIndex: 1 }}>
        <div
          style={{
            width: 36,
            height: 36,
            border: '3px solid rgba(255,255,255,0.2)',
            borderTopColor: 'white',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}
        />
      </div>

      {/* Tagline */}
      <p
        className="animate-fade-in delay-500"
        style={{
          position: 'absolute',
          bottom: 48,
          color: 'rgba(255,255,255,0.5)',
          fontSize: 12,
          fontFamily: 'Inter, sans-serif',
          letterSpacing: 1
        }}
      >
        AI-Powered Skincare Intelligence
      </p>
    </div>
  );
}
