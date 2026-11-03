import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Signup({ onSwitch }) {
  const { signup } = useAuth();
  const [form, setForm] = useState({ username: '', name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGenerateUsername = async () => {
    setGenerating(true);
    setError(''); // Clear any previous errors
    
    try {
      console.log('Calling generate-username API...');
      
      // Use the full URL to be explicit
      const response = await fetch('http://localhost:5001/api/auth/generate-username');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Generated username:', data);
      
      if (data.username) {
        setForm(prev => ({ ...prev, username: data.username }));
        console.log('Form updated with username:', data.username);
      } else {
        console.error('No username in response:', data);
        setError('Failed to generate username');
      }
    } catch (e) {
      console.error('Failed to generate username:', e);
      setError('Could not generate username. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      // If no username provided, generate one
      let signupData = { ...form };
      if (!signupData.username || signupData.username.trim() === '') {
        const response = await fetch('http://localhost:5001/api/auth/generate-username');
        const data = await response.json();
        signupData.username = data.username;
      }
      await signup(signupData);
    } catch (e) {
      const errorMsg = e.response?.data?.error || 'Enrollment failed. Please try again.';
      setError(errorMsg);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow" />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon">⚡</div>
          <h1>Spellbound Library</h1>
          <p>Begin your magical education</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Magical Username (Optional)</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <input 
                className="input" 
                placeholder="Click 'Random' to generate"
                value={form.username} 
                onChange={(e) => setForm({ ...form, username: e.target.value })} 
                minLength={3}
                maxLength={50}
                pattern="[a-zA-Z0-9_]+"
                title="Only letters, numbers, and underscores allowed"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleGenerateUsername}
                disabled={generating}
                style={{ 
                  minWidth: '120px',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Generate a random Hogwarts-themed username"
              >
                {generating ? (
                  <>
                    <span className="spinner" style={{ width: 16, height: 16 }} />
                    Magic...
                  </>
                ) : (
                  <>
                    🪄 Random
                  </>
                )}
              </button>
            </div>
            <small style={{ color: 'rgba(201, 168, 76, 0.6)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              Leave empty to auto-generate, or click 'Random' for a magical name
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Wizard Name</label>
            <input className="input" placeholder="e.g. Harry Potter"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Owl Post Address</label>
            <input className="input" type="email" placeholder="wizard@hogwarts.edu"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Secret Incantation</label>
            <div style={{ position: 'relative' }}>
              <input 
                className="input" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Min. 8 characters"
                value={form.password} 
                onChange={(e) => setForm({ ...form, password: e.target.value })} 
                required 
                minLength={8}
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  opacity: 0.7,
                }}
              >
                {showPassword ? '🔒' : '👁️'}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 10 }} disabled={loading}>
            {loading ? <span className="spinner" /> : '✦ Enroll at Hogwarts'}
          </button>
        </form>

        <div className="auth-footer">
          Already enrolled?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>Enter the library</a>
        </div>
      </div>
    </div>
  );
}
