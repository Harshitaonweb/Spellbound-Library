import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login({ onSwitch }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try { await login(form); }
    catch (e) { setError(e.response?.data?.error || 'The password is incorrect, young wizard.'); }
    finally { setLoading(false); }
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
            <input className="input" type="password" placeholder="••••••••"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
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
