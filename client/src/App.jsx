import { useState, useEffect } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HouseProvider, useHouse } from './context/HouseContext';
import { useSounds } from './hooks/useSounds';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ResourcesPage from './pages/ResourcesPage';
import GroupPage from './pages/GroupPage';
import SearchPage from './pages/SearchPage';
import HouseSelection from './pages/HouseSelection';
import HouseBackground from './components/HouseBackground';
import HogwartsCastle from './components/HogwartsCastle';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

function AppInner() {
  const { user, loading, refetch } = useAuth();
  const { house } = useHouse();
  const [authPage, setAuthPage] = useState('login');
  const [page, setPage] = useState('dashboard');

  // Global magical sounds
  useSounds();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16, background: '#080608' }}>
        <div style={{ fontSize: 40 }}>⚡</div>
        <span className="spinner" style={{ width: 32, height: 32, borderTopColor: '#c9a84c', borderColor: '#2a2030' }} />
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: 13, color: 'rgba(201,168,76,0.4)', letterSpacing: '0.1em' }}>SUMMONING MAGIC...</span>
      </div>
    );
  }

  if (!user) {
    return authPage === 'login'
      ? <Login onSwitch={() => setAuthPage('signup')} />
      : <Signup onSwitch={() => setAuthPage('login')} />;
  }

  // Show house selection if no house chosen yet
  if (!house) {
    return <HouseSelection />;
  }

  const pages = {
    dashboard: <Dashboard onNavigate={setPage} />,
    resources: <ResourcesPage />,
    groups: <GroupPage />,
    search: <SearchPage />,
  };

  return (
    <div className="layout">
      <HouseBackground />
      <HogwartsCastle />
      <Footer />
      <Sidebar current={page} onNavigate={setPage} />
      <main className="main">
        {pages[page] || pages.dashboard}
      </main>
    </div>
  );
}

import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <HouseProvider>
          <AppInner />
        </HouseProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
