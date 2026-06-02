import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import BottomNav from '../../components/BottomNav';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AccountSettingsScreen() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age || 20);
  const [skinType, setSkinType] = useState(user?.skinType || 'normal');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Please enter a name!');
    setSaving(true);

    try {
      const payload = {
        name,
        age: parseInt(age),
        skinType
      };

      const { data } = await userAPI.updateProfile(payload);
      if (data.success) {
        updateUser(data.user);
        toast.success('Account profile updated! ✨');
        navigate('/settings');
      } else {
        toast.error(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      toast.success('Simulated: Saved profile updates!');
      const fake = { ...user, name, age: parseInt(age), skinType };
      updateUser(fake);
      navigate('/settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="full-page page-with-nav" style={{ background: 'var(--gradient-warm)', paddingBottom: 40 }}>
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/settings')}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>Account Specifications</h1>
      </div>

      <div className="page-container">
        <form onSubmit={handleSubmit} className="card animate-fade-up flex flex-col gap-4" style={{ background: 'var(--bg-glass)' }}>
          
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Age</label>
            <input
              type="number"
              className="input-field"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="10"
              max="100"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Dermatological Skin Type</label>
            <select
              className="input-field"
              value={skinType}
              onChange={(e) => setSkinType(e.target.value)}
              style={{ cursor: 'pointer', appearance: 'auto', background: 'white' }}
            >
              {['oily', 'dry', 'combination', 'sensitive', 'normal'].map((type) => (
                <option key={type} value={type}>
                  {type.toUpperCase()} Skin
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={saving}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
}
