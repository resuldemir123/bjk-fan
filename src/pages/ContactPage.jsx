import { motion } from 'framer-motion';

import { useState } from 'react';
import '../styles/contact.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Mesajınız gönderildi! Teşekkürler.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-page">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="contact-header"
      >
        <h1>İletişim</h1>
        <p>Beşiktaş JK ile iletişime geçmek için formu doldurun.</p>
      </motion.div>

      <div className="contact-container">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="contact-info"
        >
          <h2>İletişim Bilgileri</h2>
          <div className="info-item">
            <i className="fas fa-map-marker-alt"></i>
            <p>Vodafone Park, Beşiktaş, İstanbul</p>
          </div>
          <div className="info-item">
            <i className="fas fa-phone"></i>
            <p>+90 212 123 4567</p>
          </div>
          <div className="info-item">
            <i className="fas fa-envelope"></i>
            <p>info@bjk.com.tr</p>
          </div>
          <div className="social-links">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="contact-form"
        >
          <h2>Mesaj Gönder</h2>
          <div className="form-group">
            <label htmlFor="name">Adınız</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Mesajınız</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-btn">Gönder</button>
        </motion.form>
      </div>
    </div>
  );
}

export default ContactPage;