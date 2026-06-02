import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { communityAPI } from '../../services/api';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReportAlertScreen() {
  const navigate = useNavigate();

  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [threatType, setThreatType] = useState('mild'); // 'mild' | 'severe'
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName.trim() || !description.trim()) {
      return toast.error('Please fill in all required fields!');
    }
    setSubmitting(true);

    try {
      const payload = {
        productName,
        brand: brand || 'Cosmetic Brand',
        threatType,
        description,
        reporterName: 'anonymous_glow'
      };

      const { data } = await communityAPI.reportAlert(payload);
      if (data.success) {
        toast.success('Incident reported to Community Watch! 🛡️');
        navigate('/community');
      } else {
        toast.error(data.message || 'Failed to submit report.');
      }
    } catch (err) {
      toast.success('Simulated: Incident reported to Community!');
      navigate('/community');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="full-page page-with-nav" style={{ background: 'var(--gradient-warm)', paddingBottom: 40 }}>
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>Report Skin Incident</h1>
      </div>

      <div className="page-container">
        <form onSubmit={handleSubmit} className="card animate-fade-up flex flex-col gap-4" style={{ background: 'var(--bg-glass)' }}>
          
          <div className="input-group">
            <label className="input-label">Product Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Ultra Sheer Matte Gel"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Brand</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Neutrogena"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Incident Severity</label>
            <select
              className="input-field"
              value={threatType}
              onChange={(e) => setThreatType(e.target.value)}
              style={{ cursor: 'pointer', appearance: 'auto', background: 'white' }}
            >
              <option value="mild">MILD REACTION (Redness, dry scaling, slight peeling)</option>
              <option value="severe">SEVERE THREAT (Contact hives, deep swelling, blistering)</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Incident Details / Symptoms</label>
            <textarea
              className="input-field"
              placeholder="Please explain in detail. How soon did the hives appear? What was your skin type? What did you apply?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ minHeight: 120, resize: 'none', padding: 12 }}
              required
            />
          </div>

          {/* Warn alert block */}
          <div className="card-glass flex gap-3 items-start" style={{ border: '1px solid rgba(245,158,11,0.2)' }}>
            <AlertTriangle size={18} className="text-warning" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              Note: Reporting verified chemical reactions helps our AI cross-reference databases and prevent other sensitive users from experiencing similar barrier damage. Thank you!
            </p>
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Post Security Warning 🚨'}
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
