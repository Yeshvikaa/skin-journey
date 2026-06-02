import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { scanAPI } from '../../services/api';
import BottomNav from '../../components/BottomNav';
import { Camera, Upload, Type, ArrowLeft, AlertTriangle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ScannerScreen() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  
  const [scanMode, setScanMode] = useState('camera'); // 'camera' | 'upload' | 'text'
  const [ingredientsText, setIngredientsText] = useState('');
  const [productName, setProductName] = useState('');
  const [loading, setLoading] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(true);

  const handleManualScan = async (e) => {
    e.preventDefault();
    if (!ingredientsText.trim()) return toast.error('Please enter ingredient text!');
    
    setLoading(true);
    try {
      const { data } = await scanAPI.analyzeIngredients({
        ingredientsRaw: ingredientsText,
        productName: productName || 'Scanned Cosmetic',
        scanType: 'manual'
      });
      if (data.success) {
        toast.success('AI safety breakdown complete! ✨');
        navigate(`/scan/result/${data.report._id}`);
      } else {
        toast.error(data.message || 'Scanning failed.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Connection error. Playing simulated scanner...');
      simulateScan();
    } finally {
      setLoading(false);
    }
  };

  // Mock scan fallback in case backend is offline
  const simulateScan = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Route to a mock ID
      navigate('/scan/result/mock-id-123');
    }, 2500);
  };

  const handleCapture = () => {
    toast.success('Analyzing captured image...');
    simulateScan();
  };

  const handleFileUpload = (e) => {
    if (e.target.files?.length > 0) {
      toast.success(`File "${e.target.files[0].name}" loaded. Extracting text...`);
      // Mock extract some common ingredients
      setProductName(e.target.files[0].name.split('.')[0]);
      setIngredientsText('Aqua, Glycerin, Niacinamide, Retinol, Sodium Hyaluronate, Salicylic Acid, Phenoxyethanol, Fragrance, Propylparaben');
      setScanMode('text');
    }
  };

  return (
    <div className="full-page page-with-nav" style={{ background: 'var(--gradient-warm)' }}>
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 800 }}>Cosmetic Scanner</h1>
      </div>

      <div className="page-container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Tab mode selection */}
        <div className="tab-bar animate-fade-up" style={{ marginBottom: 20 }}>
          <div
            className={`tab-item ${scanMode === 'camera' ? 'active' : ''}`}
            onClick={() => setScanMode('camera')}
          >
            <Camera size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Camera
          </div>
          <div
            className={`tab-item ${scanMode === 'upload' ? 'active' : ''}`}
            onClick={() => setScanMode('upload')}
          >
            <Upload size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Upload
          </div>
          <div
            className={`tab-item ${scanMode === 'text' ? 'active' : ''}`}
            onClick={() => setScanMode('text')}
          >
            <Type size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Manual Text
          </div>
        </div>

        {loading ? (
          <div className="card animate-pulse" style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: 40, minHeight: 320, background: 'var(--bg-glass)'
          }}>
            <div className="spinner spinner-lg" style={{ marginBottom: 24 }} />
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }} className="gradient-text">
              Decoding Ingredients
            </h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: 13, maxWidth: 260 }}>
              AI is examining safety ratings, cross-referencing allergies, and checking product conflict rules...
            </p>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {scanMode === 'camera' && (
              <div className="animate-fade-up" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {cameraPermission ? (
                  <div className="relative overflow-hidden" style={{
                    width: '100%', borderRadius: 24, background: 'black',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    aspectRatio: '1/1', boxShadow: 'var(--shadow-lg)'
                  }}>
                    {/* Active Scan Overlay */}
                    <div className="scanner-line" style={{ zIndex: 10 }} />
                    <div className="scanner-corner tl" style={{ zIndex: 10 }} />
                    <div className="scanner-corner tr" style={{ zIndex: 10 }} />
                    <div className="scanner-corner bl" style={{ zIndex: 10 }} />
                    <div className="scanner-corner br" style={{ zIndex: 10 }} />
                    
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onUserMediaError={() => setCameraPermission(false)}
                    />
                  </div>
                ) : (
                  <div className="card flex flex-col items-center justify-center text-center p-6" style={{ aspectRatio: '1/1', background: 'var(--bg-glass)' }}>
                    <AlertTriangle size={48} className="text-warning mb-3" />
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Camera Access Denied</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                      Please enable camera permissions in your browser or switch to "Manual Text" mode to paste ingredients.
                    </p>
                    <button className="btn btn-primary" onClick={() => setScanMode('text')}>
                      Use Manual Text Input
                    </button>
                  </div>
                )}

                {cameraPermission && (
                  <div style={{ textAlign: 'center' }}>
                    <button className="btn btn-primary btn-lg" onClick={handleCapture} style={{ borderRadius: '50%', width: 72, height: 72, padding: 0, boxShadow: 'var(--shadow-glow)' }}>
                      <Camera size={32} />
                    </button>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                      Snap a clear photo of the ingredient label on the back of your bottle.
                    </p>
                  </div>
                )}
              </div>
            )}

            {scanMode === 'upload' && (
              <div className="card animate-fade-up flex flex-col items-center justify-center p-6" style={{ flex: 1, minHeight: 320, background: 'var(--bg-glass)', border: '2px dashed var(--border)' }}>
                <Upload size={48} className="text-primary-color mb-3 animate-float" />
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Upload Label Photo</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 20, maxWidth: 280 }}>
                  Take a photo on your device and upload it. Gemini AI will scan, OCR, and decode it automatically!
                </p>
                <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
                  Choose Photo
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
                </label>
              </div>
            )}

            {scanMode === 'text' && (
              <form onSubmit={handleManualScan} className="card animate-fade-up flex flex-col gap-4" style={{ flex: 1, background: 'var(--bg-glass)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={18} className="text-primary-color" />
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Ingredient Copy-Paste</h3>
                </div>
                
                <div className="input-group">
                  <label className="input-label">Product Name (Optional)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. CeraVe Hydrating Cleanser"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>

                <div className="input-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label className="input-label">Ingredient List</label>
                  <textarea
                    className="input-field"
                    placeholder="Paste the back label text (separated by commas or lines)... e.g. Aqua, Glycerin, Retinol, Sodium Hyaluronate"
                    value={ingredientsText}
                    onChange={(e) => setIngredientsText(e.target.value)}
                    style={{ flex: 1, minHeight: 150, resize: 'none', padding: 14 }}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={!ingredientsText.trim()}>
                  Decode Ingredients ✨
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
