import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { scanAPI } from '../../services/api';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, Search, Check, AlertTriangle, ShieldX, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function IngredientBreakdownScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'safe' | 'caution' | 'avoid'

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        if (id === 'mock-id-123') {
          setIngredients(getMockIngredients());
          setLoading(false);
          return;
        }

        const { data } = await scanAPI.getReport(id);
        if (data.success) {
          setIngredients(data.report.ingredientsAnalyzed || []);
        } else {
          setIngredients(getMockIngredients());
        }
      } catch (err) {
        setIngredients(getMockIngredients());
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, [id]);

  const getMockIngredients = () => [
    { name: 'Aqua', riskLevel: 'safe', concern: null, benefit: 'Skin hydration solvent, base for humectants.' },
    { name: 'Glycerin', riskLevel: 'safe', concern: null, benefit: 'Powerful natural humectant locks moisture into skin cells.' },
    { name: 'Niacinamide', riskLevel: 'safe', concern: null, benefit: 'Calms redness, fades dark spots, regulates sebum.' },
    { name: 'Sodium Hyaluronate', riskLevel: 'safe', concern: null, benefit: 'Deep cellular hydration holds 1000x its weight in water.' },
    { name: 'Salicylic Acid', riskLevel: 'caution', concern: 'May cause dryness or slight purging in early use.', benefit: 'Clears clogged pores, treats active acne.' },
    { name: 'Phenoxyethanol', riskLevel: 'caution', concern: 'Synthetic preservative that can irritate highly sensitive skin.', benefit: 'Keeps products shelf-stable and bacteria-free.' },
    { name: 'Fragrance (Limonene)', riskLevel: 'avoid', concern: 'Highly sensitizing fragrance compound linked to contact dermatitis.', benefit: null },
    { name: 'Propylparaben', riskLevel: 'avoid', concern: 'Chemical preservative linked to endocrine/hormone disruption.', benefit: null }
  ];

  const filtered = ingredients.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'all' || item.riskLevel === activeTab;
    return matchesSearch && matchesTab;
  });

  const getIcon = (risk) => {
    switch (risk) {
      case 'safe': return <Check size={14} className="text-success" />;
      case 'caution': return <AlertTriangle size={14} className="text-warning" />;
      case 'avoid': return <ShieldX size={14} className="text-danger" />;
      default: return <HelpCircle size={14} />;
    }
  };

  return (
    <div className="full-page page-with-nav" style={{ background: 'var(--gradient-warm)' }}>
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>Ingredient Listing</h1>
      </div>

      <div className="page-container">
        {/* Search */}
        <div className="input-wrapper animate-fade-up" style={{ marginBottom: 16 }}>
          <Search className="input-icon" size={18} />
          <input
            type="text"
            className="input-field"
            placeholder="Search ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tab Filters */}
        <div className="tab-bar animate-fade-up delay-100" style={{ marginBottom: 20 }}>
          <div className={`tab-item ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
            All ({ingredients.length})
          </div>
          <div className={`tab-item ${activeTab === 'safe' ? 'active' : ''}`} onClick={() => setActiveTab('safe')}>
            Safe
          </div>
          <div className={`tab-item ${activeTab === 'caution' ? 'active' : ''}`} onClick={() => setActiveTab('caution')}>
            Caution
          </div>
          <div className={`tab-item ${activeTab === 'avoid' ? 'active' : ''}`} onClick={() => setActiveTab('avoid')}>
            Avoid
          </div>
        </div>

        {loading ? (
          <div className="centered-page" style={{ minHeight: 'auto', padding: 40 }}>
            <div className="spinner" />
          </div>
        ) : (
          <div className="flex flex-col gap-3 animate-fade-up delay-200" style={{ marginBottom: 40 }}>
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <div
                  key={item.name}
                  className="card"
                  onClick={() => navigate('/scan/ingredient-dive', { state: { ingredient: item } })}
                  style={{
                    padding: 16,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    border: `1.5px solid var(--border-light)`
                  }}
                >
                  <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700 }}>{item.name}</h3>
                    <div className={`badge badge-${item.riskLevel}`}>
                      {getIcon(item.riskLevel)} <span style={{ textTransform: 'capitalize' }}>{item.riskLevel}</span>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.benefit || item.concern || 'No specific chemical description available. Tap to search deep dive.'}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center text-muted" style={{ padding: 40 }}>
                No ingredients found matching filters.
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
