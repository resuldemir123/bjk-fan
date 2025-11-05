import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: 'fa-facebook-f', url: '#', label: 'Facebook' },
    { icon: 'fa-twitter', url: '#', label: 'Twitter' },
    { icon: 'fa-instagram', url: '#', label: 'Instagram' },
    { icon: 'fa-youtube', url: '#', label: 'YouTube' }
  ];

  const quickLinks = [
    { path: '/', text: 'Ana Sayfa' },
    { path: '/hakkimizda', text: 'Kulüp Tarihi' },
    { path: '/galeri', text: 'Medya Arşivi' },
    { path: '/iletisim', text: 'Resmi İletişim' }
  ];

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-content">
            <motion.div 
              className="footer-section about"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="footer-logo-container">
                <motion.img 
                  src="/images/bjk-logo.png" 
                  alt="Beşiktaş JK Resmi Logosu" 
                  className="footer-logo"
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.3 }}
                />
                <h3>Beşiktaş Jimnastik Kulübü</h3>
              </div>
              <p>
                Türkiye'nin ilk spor kulübü olarak 1903'ten beri sporun ve centilmenliğin 
                bayrağını gururla taşıyoruz. Bu platform kulübümüzün resmi iletişim kanallarından biridir.
              </p>
              <motion.div 
                className="club-motto"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <p>"Beşiktaş, Bir Yaşam Biçimidir!"</p>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="footer-section links"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3>Hızlı Erişim</h3>
              <ul>
                {quickLinks.map((link, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link to={link.path}>
                      <i className="fas fa-chevron-right"></i>
                      {link.text}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              className="footer-section contact"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3>Resmi İletişim</h3>
              <div className="contact-info">
                <p>
                  <i className="fas fa-envelope"></i>
                  iletisim@bjk.com.tr
                </p>
                <p>
                  <i className="fas fa-map-marker-alt"></i>
                  Vodafone Park, Beşiktaş/İstanbul
                </p>
                <p>
                  <i className="fas fa-phone"></i>
                  +90 212 123 4567
                </p>
              </div>
              
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    className="social-icon"
                    aria-label={social.label}
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <i className={`fab ${social.icon}`}></i>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <motion.div 
        className="footer-bottom"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <p>&copy; {currentYear} Beşiktaş Jimnastik Kulübü. Tüm hakları saklıdır.</p>
          <p className="official-notice">
            Beşiktaş Jimnastik Kulübü'nün resmi dijital platformudur.
          </p>
        </div>
      </motion.div>
    </footer>
  );
}

export default Footer;