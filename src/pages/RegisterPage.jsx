import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import '../styles/auth.css';

const RegisterPage = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    favoritePlayer: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Hata mesajını temizle
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Kullanıcı adı gerekli';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Kullanıcı adı en az 3 karakter olmalı';
    }

    if (!formData.email) {
      newErrors.email = 'E-posta adresi gerekli';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    if (!formData.password) {
      newErrors.password = 'Şifre gerekli';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalı';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifre tekrarı gerekli';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'Ad gerekli';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Soyad gerekli';
    }

    if (formData.phone && !/^\d{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Geçerli bir telefon numarası girin';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userData = {
        ...formData,
        fanSince: new Date().toISOString().split('T')[0] // Bugünün tarihi
      };
      delete userData.confirmPassword; // Confirm password'u kaldır
      
      const result = await userService.register(userData);
      
      // Başarılı mesajı göster
      setErrors({ success: 'Kayıt başarılı! BJK ailesine hoş geldiniz!' });
      
      // Parent component'e bildir
      if (onRegisterSuccess) {
        onRegisterSuccess(result);
      }
      
      // React Router ile yönlendirme
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
      
    } catch (error) {
      setErrors({ 
        submit: error.message || 'Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper register-wrapper">
        <div className="auth-header">
          <img src="/images/bjk-logo.png" alt="BJK Logo" className="auth-logo" />
          <h1>BJK Fan Club</h1>
          <h2>Kayıt Ol</h2>
          <p className="auth-subtitle">Kartal ailesine katıl!</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Ad *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
                placeholder="Adınız"
                autoComplete="given-name"
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Soyad *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
                placeholder="Soyadınız"
                autoComplete="family-name"
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">Kullanıcı Adı *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              placeholder="Kullanıcı adınız"
              autoComplete="username"
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">E-posta *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="ornek@email.com"
              autoComplete="email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Şifre *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  placeholder="Şifreniz"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Şifre Tekrar *</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  placeholder="Şifrenizi tekrar girin"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Telefon</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
              placeholder="05xx xxx xx xx (opsiyonel)"
              autoComplete="tel"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth">Doğum Tarihi</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="date-input"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label htmlFor="favoritePlayer">Favori Oyuncu</label>
            <select
              id="favoritePlayer"
              name="favoritePlayer"
              value={formData.favoritePlayer}
              onChange={handleChange}
              className="select-input"
            >
              <option value="">Favori oyuncunuzu seçin</option>
              <option value="Vincent Aboubakar">Vincent Aboubakar</option>
              <option value="Rachid Ghezzal">Rachid Ghezzal</option>
              <option value="Alex Teixeira">Alex Teixeira</option>
              <option value="Necip Uysal">Necip Uysal</option>
              <option value="Domagoj Vida">Domagoj Vida</option>
              <option value="Mert Günok">Mert Günok</option>
              <option value="Cenk Tosun">Cenk Tosun</option>
              <option value="Sergen Yalçın">Sergen Yalçın (Efsane)</option>
              <option value="Ricardo Quaresma">Ricardo Quaresma (Efsane)</option>
              <option value="Metin Tekin">Metin Tekin (Efsane)</option>
            </select>
          </div>

          {errors.success && (
            <div className="success-message">{errors.success}</div>
          )}

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Kayıt oluşturuluyor...
              </>
            ) : (
              'Kayıt Ol'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Zaten üye misin? <button 
            type="button" 
            className="link-button"
            onClick={() => navigate('/login')}
          >
            Giriş Yap
          </button></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;