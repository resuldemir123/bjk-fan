// BJK Fan Club User Service
const API_BASE_URL = 'http://localhost:3001/api'; // Backend API URL

export const userService = {
  // Kullanıcı giriş işlemi
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Giriş başarısız');
      }

      const data = await response.json();
      
      // Token'ı localStorage'a kaydet
      if (data.token) {
        localStorage.setItem('bjk-token', data.token);
        localStorage.setItem('bjk-user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Kullanıcı kayıt işlemi
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Kayıt başarısız');
      }

      const data = await response.json();
      
      // Token'ı localStorage'a kaydet
      if (data.token) {
        localStorage.setItem('bjk-token', data.token);
        localStorage.setItem('bjk-user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  // Kullanıcı çıkış işlemi
  logout() {
    localStorage.removeItem('bjk-token');
    localStorage.removeItem('bjk-user');
  },

  // Kullanıcı profil güncelleme
  async updateProfile(userId, profileData) {
    try {
      const token = localStorage.getItem('bjk-token');
      const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Profil güncellenemedi');
      }

      const data = await response.json();
      localStorage.setItem('bjk-user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Kullanıcı skor güncelleme
  async updateScore(scoreData) {
    try {
      const token = localStorage.getItem('bjk-token');
      const response = await fetch(`${API_BASE_URL}/users/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(scoreData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Skor güncellenemedi');
      }

      const data = await response.json();
      localStorage.setItem('bjk-user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      console.error('Update score error:', error);
      throw error;
    }
  },

  // Liderlik tablosu
  async getLeaderboard() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/leaderboard`);
      
      if (!response.ok) {
        throw new Error('Liderlik tablosu alınamadı');
      }

      return await response.json();
    } catch (error) {
      console.error('Leaderboard error:', error);
      throw error;
    }
  },

  // Token geçerliliği kontrolü
  async validateToken() {
    try {
      const token = localStorage.getItem('bjk-token');
      if (!token) return false;

      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  },

  // Mevcut kullanıcı bilgilerini al
  getCurrentUser() {
    const user = localStorage.getItem('bjk-user');
    return user ? JSON.parse(user) : null;
  },

  // Token kontrolü
  getToken() {
    return localStorage.getItem('bjk-token');
  }
};