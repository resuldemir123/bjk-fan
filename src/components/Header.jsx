import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/header.css';

function Header({ isAuthenticated, user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navItems = [
    { path: '/', label: 'Ana Sayfa', icon: 'fa-home' },
    { path: '/hakkimizda', label: 'Hakkımızda', icon: 'fa-info-circle' },
    { path: '/galeri', label: 'Galeri', icon: 'fa-images' },
    { path: '/oyunlar', label: 'Oyunlar', icon: 'fa-gamepad' },
    { path: '/iletisim', label: 'İletişim', icon: 'fa-envelope' }
  ];

  return (
    <motion.header 
      className={`header ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="header-container">
        <motion.div 
          className="logo"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Link to="/">
            <img src="/images/bjk-logo.png" alt="Beşiktaş JK Resmi Logosu" />
            <div className="logo-text">
              <h1>Beşiktaş JK</h1>
              <span>Resmi Taraftar Platformu</span>
            </div>
          </Link>
        </motion.div>

        {/* Ana navigasyon menüsü - logo yakınında */}
        <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            {navItems.map((item, index) => (
              <motion.li 
                key={item.path}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link 
                  to={item.path} 
                  className={location.pathname === item.path ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className={`fas ${item.icon}`}></i>
                  <span>{item.label}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Auth butonları - sağ üstte */}
        <div className="auth-section">
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-info">
                <i className="fas fa-user-circle"></i>
                <span className="username">{user?.username || user?.firstName}</span>
              </div>
              <button 
                className="logout-btn"
                onClick={onLogout}
                title="Çıkış Yap"
              >
                <i className="fas fa-sign-out-alt"></i>
                <span>Çıkış</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link 
                to="/login" 
                className="login-btn"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-sign-in-alt"></i>
                <span>Giriş Yap</span>
              </Link>
              <Link 
                to="/register" 
                className="register-btn"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-user-plus"></i>
                <span>Kayıt Ol</span>
              </Link>
            </div>
          )}
        </div>
        
        {/* Mobile menu toggle */}
        <button 
          className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Menüyü aç/kapat"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </motion.header>
  );
}

export default Header;