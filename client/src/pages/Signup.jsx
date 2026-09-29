import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Signup({ onSwitch }) {
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedUsername, setGeneratedUsername] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const result = await signup(form);
      if (result.user?.username) {
        setGeneratedUsername(result.user.username);
      }
    } catch (e) {
      setError(e.response?.data?.error || 'Enrollment failed. Try again.');
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

        {generatedUsername ? (
          <div className="success-box" style={{
            background: 'rgba(34, 139, 34, 0.1)',
            border: '1px solid rgba(34, 139, 34, 0.3)',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>🎉</div>
            <h3 style={{ color: 'rgba(34, 139, 34, 0.9)', marginBottom: '10px' }}>Welcome to Hogwarts!</h3>
            <p style={{ color: 'rgba(201, 168, 76, 0.9)', fontSize: '14px', marginBottom: '8px' }}>
              Your magical username has been chosen:
            </p>
            <div style={{
              background: 'rgba(201, 168, 76, 0.15)',
              border: '2px solid rgba(201, 168, 76, 0.4)',
              borderRadius: '6px',
              padding: '12px 20px',
              fontSize: '18px',
              fontFamily: 'Cinzel, serif',
              color: 'rgba(201, 168, 76, 1)',
              fontWeight: 'bold',
              letterSpacing: '0.05em'
            }}>
              {generatedUsername}
            </div>
          </div>
        ) : (
          <>
            {error && <div className="error-msg">{error}</div>}

            <div className="info-box" style={{
              background: 'rgba(201, 168, 76, 0.1)',
              border: '1px solid rgba(201, 168, 76, 0.3)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '20px',
              fontSize: '14px',
              color: 'rgba(201, 168, 76, 0.9)',
              textAlign: 'center'
            }}>
              ✨ You'll be assigned a magical Hogwarts username automatically!
            </div>

            <form onSubmit={submit}>
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
                <input className="input" type="password" placeholder="Min. 8 characters"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
              </div>
              <button type="submit" className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 10 }} disabled={loading}>
                {loading ? <span className="spinner" /> : '✦ Enroll at Hogwarts'}
              </button>
            </form>
          </>
        )}

        <div className="auth-footer">
          Already enrolled?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>Enter the library</a>
        </div>
      </div>
    </div>
  );
}
