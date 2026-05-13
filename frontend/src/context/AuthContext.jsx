import { createContext, useContext, useState, useEffect } from 'react';
import { loginAPI, registerAPI, getProfileAPI } from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('atsUser');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await loginAPI({ email, password });
      setUser(data);
      localStorage.setItem('atsUser', JSON.stringify(data));
      return { success: true, role: data.role };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const { data } = await registerAPI(formData);
      setUser(data);
      localStorage.setItem('atsUser', JSON.stringify(data));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('atsUser');
  };

  const refreshUser = async () => {
    try {
      const { data } = await getProfileAPI();
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('atsUser', JSON.stringify(updated));
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
