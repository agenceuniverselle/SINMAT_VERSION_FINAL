import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = sessionStorage.getItem('auth_token');
    const userData = sessionStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Erreur parsing user :", error);
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    // Ex: call API → login → receive token + user
    const token = "mock-token"; // à remplacer
    const mockUser: User = {
      id: "1",
      name: "Jean Dupont",
      email,
      phone: "+33 6 12 34 56 78"
    };

    sessionStorage.setItem("auth_token", token);
    sessionStorage.setItem("user", JSON.stringify(mockUser));

    setUser(mockUser);
    setIsAuthenticated(true);
    navigate('/dashboard');
    return { success: true };
  };

  const logout = () => {
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const updateProfile = (updatedUser: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      sessionStorage.setItem("user", JSON.stringify(newUser));
      return { success: true, message: "Profil mis à jour avec succès" };
    }
    return { success: false, error: "Utilisateur non connecté" };
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateProfile,
  };
};
