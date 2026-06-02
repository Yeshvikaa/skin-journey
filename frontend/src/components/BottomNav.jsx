import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Package, Camera, MessageSquare, Calendar } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-nav">
      <div
        className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
        onClick={() => navigate('/dashboard')}
      >
        <Home className="nav-icon" size={20} />
        <span className="nav-label">Home</span>
      </div>

      <div
        className={`nav-item ${isActive('/cabinet') ? 'active' : ''}`}
        onClick={() => navigate('/cabinet')}
      >
        <Package className="nav-icon" size={20} />
        <span className="nav-label">Cabinet</span>
      </div>

      <div
        className="nav-scan-btn"
        onClick={() => navigate('/scan')}
        style={{ cursor: 'pointer' }}
      >
        <Camera size={26} />
      </div>

      <div
        className={`nav-item ${isActive('/carebot') ? 'active' : ''}`}
        onClick={() => navigate('/carebot')}
      >
        <MessageSquare className="nav-icon" size={20} />
        <span className="nav-label">CareBot</span>
      </div>

      <div
        className={`nav-item ${isActive('/journey') ? 'active' : ''}`}
        onClick={() => navigate('/journey')}
      >
        <Calendar className="nav-icon" size={20} />
        <span className="nav-label">Journey</span>
      </div>
    </nav>
  );
}
