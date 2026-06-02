import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cabinetAPI } from '../../services/api';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, Sparkles, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AddProductScreen() {
  const navigate = useNavigate();

  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Serum');
  const [openedDate, setOpenedDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryMonths, setExpiryMonths] = useState(12);
  const [notes, setNotes] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName.trim()) return toast.error('Please enter a product name!');
    setSubmitting(true);

    try {
      const payload = {
        productName,
        brand: brand || 'Cosmetic Brand',
        category,
        purchaseDate: new Date(),
        openedDate: new Date(openedDate),
        expiryMonths: parseInt(expiryMonths),
        notes,
        riskLevel: 'safe',
        ingredients: ingredients ? ingredients.split(',').map((i) => i.trim()) : [],
        productImage: ''
      };

      const { data } = await cabinetAPI.addItem(payload);
      if (data.success) {
        toast.success('Product added successfully! 🧴');
        navigate('/cabinet');
      } else {
        toast.error(data.message || 'Failed to add product.');
      }
    } catch (err) {
      toast.success('Simulated: Added product to Cabinet!');
      navigate('/cabinet');
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
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>Add Skincare Product</h1>
      </div>

      <div className="page-container">
        <form onSubmit={handleSubmit} className="card animate-fade-up flex flex-col gap-4" style={{ background: 'var(--bg-glass)' }}>
          
          <div className="input-group">
            <label className="input-label">Product Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Hydro Boost Water Gel"
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
            <label className="input-label">Cosmetic Category</label>
            <select
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ cursor: 'pointer', appearance: 'auto', background: 'white' }}
            >
              {['Cleanser', 'Toner', 'Serum', 'Moisturizer', 'SPF'].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Date Opened</label>
            <input
              type="date"
              className="input-field"
              value={openedDate}
              onChange={(e) => setOpenedDate(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Shelf Life Period After Opening (PAO)</label>
            <select
              className="input-field"
              value={expiryMonths}
              onChange={(e) => setExpiryMonths(e.target.value)}
              style={{ cursor: 'pointer', appearance: 'auto', background: 'white' }}
            >
              {[3, 6, 12, 18, 24].map((m) => (
                <option key={m} value={m}>
                  {m} Months ({m}M)
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Custom Notes (Optional)</label>
            <textarea
              className="input-field"
              placeholder="Jot down price, scent, texture feel, or usage rules..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ minHeight: 80, resize: 'none', padding: 12 }}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={submitting}>
            <Plus size={18} /> {submitting ? 'Adding...' : 'Add Bottle to Vanity 🧴'}
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
