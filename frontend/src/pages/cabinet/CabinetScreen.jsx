import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cabinetAPI } from '../../services/api';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, Plus, Calendar, AlertTriangle, Trash2, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CabinetScreen() {
  const navigate = useNavigate();

  const [cabinet, setCabinet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchCabinet = async () => {
    try {
      const { data } = await cabinetAPI.getCabinet();
      if (data.success) {
        setCabinet(data.cabinet);
      } else {
        setCabinet(getMockCabinet());
      }
    } catch (err) {
      console.warn('Backend connection offline, showing simulated cabinet.');
      setCabinet(getMockCabinet());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCabinet();
  }, []);

  const handleRemove = async (itemId) => {
    try {
      const { data } = await cabinetAPI.removeItem(itemId);
      if (data.success) {
        toast.success('Product removed from Cabinet 🧴');
        fetchCabinet();
      } else {
        toast.error(data.message || 'Failed to remove product.');
      }
    } catch (err) {
      // Offline fallback
      setCabinet((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i._id !== itemId)
      }));
      toast.success('Simulated: Product removed from Cabinet!');
    }
  };

  const getMockCabinet = () => ({
    totalProducts: 4,
    expiringSoon: 1,
    items: [
      {
        _id: 'c1',
        productName: 'Aqua Youth Hydra Serum',
        brand: 'Glow Lab',
        category: 'Serum',
        expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days
        openedDate: new Date().toISOString(),
        riskLevel: 'caution'
      },
      {
        _id: 'c2',
        productName: 'PM Facial Moisturizing Lotion',
        brand: 'CeraVe',
        category: 'Moisturizer',
        expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        openedDate: new Date().toISOString(),
        riskLevel: 'safe'
      },
      {
        _id: 'c3',
        productName: 'Toleriane Hydrating Cleanser',
        brand: 'La Roche-Posay',
        category: 'Cleanser',
        expiryDate: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000).toISOString(),
        openedDate: new Date().toISOString(),
        riskLevel: 'safe'
      }
    ]
  });

  const categories = ['all', 'Cleanser', 'Toner', 'Serum', 'Moisturizer', 'SPF'];

  const filteredItems = cabinet?.items?.filter((item) => {
    return activeFilter === 'all' || item.category === activeFilter;
  }) || [];

  return (
    <div className="full-page page-with-nav" style={{ background: 'var(--gradient-warm)' }}>
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>Product Cabinet</h1>
      </div>

      <div className="page-container">
        {/* Cabinet Statistics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div className="card text-center" style={{ padding: 14 }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary)', display: 'block' }}>
              {cabinet?.items?.length || 0}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL BOTTLES</span>
          </div>
          <div className="card text-center" style={{ padding: 14, border: '1px solid var(--danger)', background: 'rgba(235,87,87,0.02)' }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--danger)', display: 'block' }}>
              {cabinet?.expiringSoon || 1}
            </span>
            <span style={{ fontSize: 11, color: 'var(--danger)', fontWeight: 700 }}>EXPIRING SOON! ⚠️</span>
          </div>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 16, scrollbarWidth: 'none' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`chip ${activeFilter === cat ? 'selected' : ''}`}
              onClick={() => setActiveFilter(cat)}
              style={{ whiteSpace: 'nowrap' }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Product Cards */}
        {loading ? (
          <div className="centered-page" style={{ minHeight: 'auto', padding: 40 }}>
            <div className="spinner" />
          </div>
        ) : (
          <div className="flex flex-col gap-4 animate-fade-up" style={{ marginBottom: 40 }}>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const daysLeft = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                const isExpiring = daysLeft > 0 && daysLeft < 30;

                return (
                  <div key={item._id} className="card flex justify-between items-center" style={{ padding: '16px 20px', borderLeft: `4px solid var(--${item.riskLevel === 'safe' ? 'success' : 'warning'})` }}>
                    <div style={{ flex: 1, minWidth: 0, marginRight: 16 }}>
                      <span className="badge badge-primary" style={{ fontSize: 9, marginBottom: 4 }}>{item.category.toUpperCase()}</span>
                      <h3 style={{ fontSize: 15, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.productName}
                      </h3>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.brand}</p>
                      
                      {isExpiring && (
                        <div style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 10, color: 'var(--danger)', fontWeight: 700, marginTop: 6 }}>
                          <AlertTriangle size={12} /> Expires in {daysLeft} Days!
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button
                        className="back-btn"
                        style={{ color: 'var(--danger)', border: '1px solid rgba(235,87,87,0.2)', background: 'var(--danger-light)', width: 36, height: 36 }}
                        onClick={() => handleRemove(item._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-muted" style={{ padding: 40 }}>
                No active cosmetics in this category. Let's add one!
              </div>
            )}
          </div>
        )}

        {/* Add Product Floating CTA */}
        <div style={{ position: 'fixed', bottom: 90, right: 24, zIndex: 120 }}>
          <button className="btn btn-primary" onClick={() => navigate('/cabinet/add')} style={{ borderRadius: '50%', width: 56, height: 56, padding: 0, boxShadow: 'var(--shadow-glow)' }}>
            <Plus size={28} />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
