import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, Upload, Info, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SkinProgressScreen() {
  const navigate = useNavigate();
  const [sliderVal, setSliderVal] = useState(50);
  const [images, setImages] = useState({
    before: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500&auto=format&fit=crop&q=60',
    after: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=60'
  });

  const handleUploadPhoto = () => {
    toast.success('Skin progress photo uploaded successfully! 📸');
  };

  return (
    <div className="full-page page-with-nav" style={{ background: 'var(--gradient-warm)', paddingBottom: 40 }}>
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>Progress Tracker</h1>
      </div>

      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Intro */}
        <div className="card-glass flex gap-3 items-center">
          <Info size={20} className="text-primary-color" />
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Take progress selfies in the same lighting every week. Drag the slider below to see your transformation!
          </p>
        </div>

        {/* Visual Comparison Split Container */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1/1',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {/* Before Image (Left Base) */}
          <img
            src={images.before}
            alt="Before Skincare"
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
          />

          {/* Label Before */}
          <span style={{ position: 'absolute', bottom: 16, left: 16, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700, zIndex: 10 }}>
            DAY 1 (BEFORE)
          </span>

          {/* After Image (Right Clipped Overlay) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            clipPath: `polygon(${sliderVal}% 0, 100% 0, 100% 100%, ${sliderVal}% 100%)`
          }}>
            <img
              src={images.after}
              alt="After Skincare"
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
            />
            {/* Label After */}
            <span style={{ position: 'absolute', bottom: 16, right: 16, background: 'var(--gradient-primary)', color: 'white', padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700, zIndex: 10 }}>
              TODAY (GLOWING ✨)
            </span>
          </div>

          {/* Sliding Divider Bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sliderVal}%`,
            width: 3,
            background: 'white',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            transform: 'translateX(-50%)',
            zIndex: 12
          }} />

          {/* Overlay Slider Range Controller */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderVal}
            onChange={(e) => setSliderVal(e.target.value)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'ew-resize',
              zIndex: 20
            }}
          />
        </div>

        {/* Upload Button */}
        <button className="btn btn-primary btn-lg btn-block" onClick={handleUploadPhoto} style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
          <Upload size={18} /> Upload Weekly Selfie
        </button>

        {/* Timeline Stats */}
        <div className="card flex items-center justify-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Heart size={20} className="text-danger animate-pulse" />
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 800 }}>Acne Redness Cleared</h4>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>Based on AI image scan metrics</p>
            </div>
          </div>
          <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--success)' }}>-38% Redness</span>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
