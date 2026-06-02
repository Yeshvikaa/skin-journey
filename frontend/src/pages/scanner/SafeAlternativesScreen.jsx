import { useLocation, useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, ShieldCheck, Star, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SafeAlternativesScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const alternativesList = location.state?.alternatives || [
    'CeraVe PM Facial Moisturizing Lotion',
    'La Roche-Posay Toleriane Double Repair',
    'The Ordinary Hyaluronic Acid 2% + B5'
  ];

  const handleAddAlternative = (product) => {
    toast.success(`"${product}" added to Cabinet! 🧴`);
    navigate('/cabinet');
  };

  const getDetails = (product) => {
    if (product.includes('CeraVe')) {
      return { desc: 'Non-comedogenic hydrator packed with 3 essential Ceramides and calming Niacinamide.', rating: 4.8, price: '$14.99' };
    }
    if (product.includes('La Roche')) {
      return { desc: 'Prebiotic thermal water hydrator that repairs the moisture barrier in 1 hour.', rating: 4.9, price: '$21.99' };
    }
    return { desc: 'Pure vegan hyaluronic acid with B5 to plump cellular moisture across all skin layers.', rating: 4.6, price: '$8.90' };
  };

  return (
    <div className="full-page page-with-nav" style={{ background: 'var(--gradient-warm)' }}>
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>Safe Alternatives</h1>
      </div>

      <div className="page-container">
        {/* Intro */}
        <div className="animate-fade-up" style={{ marginBottom: 20 }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Based on your skin profile, we highly recommend these clean, allergen-free products as direct safe substitutes:
          </p>
        </div>

        {/* List */}
        <div className="flex flex-col gap-4 animate-fade-up delay-100" style={{ marginBottom: 40 }}>
          {alternativesList.map((product) => {
            const details = getDetails(product);
            return (
              <div key={product} className="card flex flex-col gap-3" style={{ borderLeft: '4px solid var(--success)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="badge badge-safe" style={{ fontSize: 11 }}>
                    <ShieldCheck size={12} /> 100% SAFE CHOICE
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: 'var(--warning)' }}>
                    <Star size={14} fill="currentColor" /> {details.rating}
                  </div>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 800 }}>{product}</h3>
                
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {details.desc}
                </p>

                <div className="divider" style={{ margin: 0 }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{details.price}</span>
                  <button className="btn btn-primary btn-sm" onClick={() => handleAddAlternative(product)}>
                    <Plus size={14} /> Add to Cabinet
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
