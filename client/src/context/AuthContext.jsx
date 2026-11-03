import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, login as apiLogin, signup as apiSignup, logout as apiLogout } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const { data } = await apiLogin(credentials);
    setUser(data.user);
    return data;
  };

  const signup = async (credentials) => {
    const { data } = await apiSignup(credentials);
    setUser(data.user);
    // Clear house selection for new users to force house selection
    localStorage.removeItem('ss_house');
    return data;
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  const refetch = async () => {
    try { const res = await getMe(); setUser(res.data); } catch { setUser(null); }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
