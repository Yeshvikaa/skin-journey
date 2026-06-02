import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const slides = [
  {
    emoji: '🔬',
    title: 'Scan & Decode',
    subtitle: 'AI-powered scanning',
    desc: 'Point your camera at any product label or barcode. Our AI decodes ingredients instantly.',
    color: 'linear-gradient(135deg, #00A86B, #00C97E)',
    bg: 'linear-gradient(180deg, rgba(0,168,107,0.08) 0%, transparent 100%)'
  },
  {
    emoji: '🛡️',
    title: 'Know What’s Safe',
    subtitle: 'Safety intelligence',
    desc: 'Detect parabens, sulfates, allergens, and ingredient conflicts instantly.',
    color: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
    bg: 'linear-gradient(180deg, rgba(139,92,246,0.08) 0%, transparent 100%)'
  },
  {
    emoji: '✨',
    title: 'Track Your Glow',
    subtitle: 'Glow analytics',
    desc: 'Log your skin daily and improve your glow score with smart skincare habits.',
    color: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
    bg: 'linear-gradient(180deg, rgba(245,158,11,0.08) 0%, transparent 100%)'
  },
  {
    emoji: '💬',
    title: 'Meet CareBot',
    subtitle: 'Your AI bestie',
    desc: 'Get skincare recommendations, routines, and personalized AI advice.',
    color: 'linear-gradient(135deg, #EB5757, #FC8585)',
    bg: 'linear-gradient(180deg, rgba(235,87,87,0.08) 0%, transparent 100%)'
  }
];

export default function AppIntroScreen() {
  const [current, setCurrent] = useState(0);

  const navigate = useNavigate();

  const slide = slides[current];

  const next = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      navigate('/signup');
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: slide.bg,
        display: 'flex',
        flexDirection: 'column',
        transition: '0.4s ease'
      }}
    >
      {/* TOP */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '20px'
        }}
      >
        <button
          onClick={() => navigate('/signup')}
          style={{
            border: 'none',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Skip
        </button>
      </div>

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 24px'
        }}
      >
        <div
          style={{
            textAlign: 'center',
            width: '100%',
            maxWidth: 320
          }}
        >
          {/* ICON */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 32,
              background: slide.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 56,
              margin: '0 auto 28px',
              boxShadow: '0 18px 40px rgba(0,0,0,0.12)'
            }}
          >
            {slide.emoji}
          </div>

          {/* SUBTITLE */}
          <div
            style={{
              display: 'inline-flex',
              padding: '6px 14px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.75)',
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 18
            }}
          >
            {slide.subtitle}
          </div>

          {/* TITLE */}
          <h1
            style={{
              fontSize: 30,
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 14,
              letterSpacing: '-0.5px'
            }}
          >
            {slide.title}
          </h1>

          {/* DESC */}
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: 'var(--text-secondary)'
            }}
          >
            {slide.desc}
          </p>
        </div>
      </div>

      {/* DOTS */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 26
        }}
      >
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? 22 : 8,
              height: 8,
              borderRadius: 999,
              background:
                i === current
                  ? 'var(--primary)'
                  : 'rgba(0,0,0,0.12)',
              transition: '0.3s',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>

      {/* BUTTONS */}
      <div
        style={{
          padding: '0 20px 38px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent:
              current > 0 ? 'space-between' : 'center',
            alignItems: 'center',
            gap: 12
          }}
        >
          {/* BACK */}
          {current > 0 && (
            <button
              onClick={prev}
              style={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                border: '1px solid rgba(0,0,0,0.08)',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <ArrowLeft size={18} />
            </button>
          )}

          {/* NEXT */}
          <button
            onClick={next}
            style={{
              height: 46,
              minWidth: current === 0 ? 160 : 140,
              padding: '0 20px',
              borderRadius: 16,
              border: 'none',
              background: 'var(--primary)',
              color: 'white',
              fontWeight: 700,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 10px 24px rgba(0,168,107,0.22)'
            }}
          >
            {current === slides.length - 1
              ? 'Get Started'
              : 'Next'}

            {current < slides.length - 1 && (
              <ArrowRight size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}