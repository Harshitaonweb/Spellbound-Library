import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login({ onSwitch }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try { 
      // Use direct fetch
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Store token in localStorage as backup
      localStorage.setItem('auth_token', data.token);
      
      // Force page reload
      window.location.href = '/';
      
    } catch (e) { 
      console.error('Login error:', e);
      const errorMsg = e.message || 'Login failed. Please try again.';
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
          <p>Enter the Wizarding Library</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={submit}>
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
                placeholder="••••••••"
                value={form.password} 
                onChange={(e) => setForm({ ...form, password: e.target.value })} 
                required 
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
            {loading ? <span className="spinner" /> : '✦ Enter the Library'}
          </button>
        </form>

        <div className="auth-footer">
          New to Hogwarts?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>Enroll now</a>
        </div>
      </div>
    </div>
  );
}
