import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const sliderImages = [
    {
      src: '/images/bjk-stadium.jpg',
      title: 'Vodafone Park',
      desc: 'Beşiktaş\'ın efsanevi stadyumunda muhteşem atmosfer'
    },
    {
      src: '/images/historic-1.jpg',
      title: 'Siyah Beyaz Tutku',
      desc: 'Türkiye\'nin en köklü spor kulübünün tarihi yolculuğu'
    },
    {
      src: '/images/celebration-1.jpg',
      title: 'Şampiyonluk Geleneği',
      desc: 'Beşiktaş\'ın başarı dolu tarihi her geçen gün büyüyor'
    }
  ];

  const newsItems = [
    {
      id: 1,
      title: 'Beşiktaş\'tan Stratejik Transfer Hamlesi',
      summary: 'Beşiktaş, yeni sezon hazırlıkları kapsamında kadrosunu güçlendirmek için önemli transfer görüşmelerine başladı...',
      date: '15 Nisan 2025',
      image: '/images/team-1.jpg'
    },
    {
      id: 2,
      title: 'Vodafone Park\'ta Tarihi Gece',
      summary: 'Avrupa kupalarında oynanan maçta taraftarlar muazzam bir atmosfer oluşturarak takımına destek verdi...',
      date: '12 Nisan 2025',
      image: '/images/bjk-stadium.jpg'
    },
    {
      id: 3,
      title: 'Akademi\'den Yeni Yetenekler',
      summary: 'Beşiktaş altyapısından yetişen genç futbolcular A takımda forma şansı bularak kulübün geleceğini temsil ediyor...',
      date: '10 Nisan 2025',
      image: '/images/historic-1.jpg'
    }
  ];

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setNews(newsItems);
      setIsLoading(false);
    };

    loadNews();

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="home-page">
      {/* Hero Slider */}
      <section className="hero-slider">
        <div className="slider-container">
          {sliderImages.map((slide, index) => (
            <motion.div 
              key={index} 
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.src})` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 1.5 }}
            >
              <div className="slide-overlay"></div>
              <div className="slide-content">
                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: index === currentSlide ? 1 : 0, y: index === currentSlide ? 0 : 30 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  {slide.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: index === currentSlide ? 1 : 0, y: index === currentSlide ? 0 : 30 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  {slide.desc}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: index === currentSlide ? 1 : 0, scale: index === currentSlide ? 1 : 0.8 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <Link to="/hakkimizda" className="btn btn-primary">Keşfet</Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
          
          <button className="slider-arrow prev" onClick={prevSlide} aria-label="Önceki slide">
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="slider-arrow next" onClick={nextSlide} aria-label="Sonraki slide">
            <i className="fas fa-chevron-right"></i>
          </button>
          
          <div className="slider-dots">
            {sliderImages.map((_, index) => (
              <button 
                key={index} 
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="container">
          <motion.div 
            className="welcome-content"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Kara Kartal'ın <span className="highlight">Onurlu</span> Dünyasına Hoş Geldiniz
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Beşiktaş Jimnastik Kulübü'nün 120 yıllık köklü geçmişi, şerefli mücadelesi ve 
              sarsılmaz değerleriyle tanışın. Bu platform, siyah-beyaz renklere gönül vermiş 
              taraftarlar için resmi bir buluşma noktası olarak hizmet vermektedir.
            </motion.p>
            <motion.div 
              className="cta-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link to="/hakkimizda" className="btn btn-primary">Kulüp Tarihini Keşfet</Link>
              <Link to="/galeri" className="btn btn-secondary">Arşiv Galerisi</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Games Section - NEW */}
      <section className="games-preview-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2>BJK <span className="highlight">Oyun</span> Merkezi</h2>
            <div className="section-line"></div>
            <p className="section-subtitle">Beşiktaş sevginizi eğlenceli oyunlarla test edin</p>
          </motion.div>
          
          <div className="games-preview-grid">
            {[
              {
                icon: 'fa-brain',
                title: 'Bilgi Yarışması',
                description: 'Beşiktaş tarihini test et',
                color: '#4CAF50'
              },
              {
                icon: 'fa-th',
                title: 'Hafıza Oyunu',
                description: 'Efsane oyuncuları eşleştir',
                color: '#2196F3'
              },
              {
                icon: 'fa-clock',
                title: 'Hızlı Sorular',
                description: 'Zamana karşı yarış',
                color: '#FF5722'
              }
            ].map((game, index) => (
              <motion.div
                key={index}
                className="game-preview-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div className="game-preview-icon" style={{ color: game.color }}>
                  <i className={`fas ${game.icon}`}></i>
                </div>
                <h3>{game.title}</h3>
                <p>{game.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="games-cta"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Link to="/oyunlar" className="btn btn-primary btn-large">
              Tüm Oyunları Keşfet
              <i className="fas fa-gamepad"></i>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Latest News */}
      <section className="news-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2>Resmi <span className="highlight">Duyurular</span></h2>
            <div className="section-line"></div>
            <p className="section-subtitle">Kulübümüzden en güncel haberler ve resmi açıklamalar</p>
          </motion.div>
          
          <div className="news-container">
            {!isLoading ? (
              news.map((item, index) => (
                <motion.article 
                  key={item.id} 
                  className="news-card"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <div className="news-image">
                    <img src={item.image} alt={item.title} />
                    <span className="news-date">{item.date}</span>
                  </div>
                  <div className="news-content">
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <Link to={`/haber/${item.id}`} className="read-more">
                      Detaylı Bilgi 
                      <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </motion.article>
              ))
            ) : (
              <motion.div 
                className="loading-news"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="spinner"></div>
                <p>Resmi duyurular yükleniyor...</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="stats-section">
        <div className="container">
          <motion.div 
            className="stats-container"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {[
              { icon: 'fa-trophy', number: '16', label: 'Süper Lig Şampiyonluğu' },
              { icon: 'fa-star', number: '120+', label: 'Yıllık Köklü Tarih' },
              { icon: 'fa-users', number: '25M+', label: 'Küresel Taraftar' },
              { icon: 'fa-globe', number: '42,590', label: 'Stadyum Kapasitesi' }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="stat-box"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <div className="stat-icon">
                  <i className={`fas ${stat.icon}`}></i>
                </div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Kara Kartal Ailesine Katılın
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Beşiktaş Jimnastik Kulübü'nün resmi platformunda yerinizi alın ve 
              kulübümüzle ilgili en güncel gelişmelerden haberdar olun.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Link to="/iletisim" className="btn btn-primary">Resmi İletişim</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;