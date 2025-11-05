import { motion } from 'framer-motion';
import { useState } from 'react';
import '../styles/about.css';

function AboutPage() {
  const [activeTab, setActiveTab] = useState('history');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const timelineEvents = [
    {
      year: "1903",
      title: "Kuruluş",
      description: "Beşiktaş Jimnastik Kulübü, Osmanlı İmparatorluğu döneminde 1903 yılında İstanbul'da resmi olarak kurulmuştur."
    },
    {
      year: "1911",
      title: "Futbol Branşının Kuruluşu",
      description: "Kulübün futbol branşı resmi olarak kurularak Türk futbol tarihindeki yerini almıştır."
    },
    {
      year: "1957",
      title: "İlk Büyük Stadyum",
      description: "Beşiktaş'ın ilk büyük stadyumu Mithatpaşa Stadı hizmete açılmıştır."
    },
    {
      year: "1986",
      title: "İnönü Stadı Dönemi",
      description: "Stadyum yenilenerek BJK İnönü Stadı adını almış ve uzun yıllar Beşiktaş'a ev sahipliği yapmıştır."
    },
    {
      year: "2003",
      title: "Yüzyıllık Çınar",
      description: "Beşiktaş Jimnastik Kulübü, kuruluşunun 100. yılını görkemli törenlerle kutlamıştır."
    },
    {
      year: "2016",
      title: "Vodafone Park",
      description: "Modern mimarisi ve teknolojik altyapısıyla Vodafone Park, Beşiktaş'ın yeni yuvası olmuştur."
    }
  ];

  const legends = [
    {
      id: 1,
      name: "Süleyman Seba",
      role: "Efsane Başkan",
      image: "/images/legends/suleyman-seba.jpg",
      description: "1984-2000 yılları arasında kulüp başkanlığı yapmış, Beşiktaş tarihinin en başarılı ve sevilen başkanlarındandır."
    },
    {
      id: 2,
      name: "Metin-Ali-Feyyaz",
      role: "Efsane Forvet Hattı",
      image: "/images/legends/maf.jpg",
      description: "1980'lerin sonunda Beşiktaş'ın üst üste şampiyonluklarında belirleyici rol oynayan tarihi forvet üçlüsü."
    },
    {
      id: 3,
      name: "Hakkı Yeten",
      role: "Kulüp Efsanesi",
      image: "/images/legends/hakki-yeten.jpg",
      description: "Futbolculuğu ve başkanlığı döneminde Beşiktaş'a büyük hizmetler vermiş efsanevi isim."
    },
    {
      id: 4,
      name: "Şeref Bey",
      role: "Kurucu Üye",
      image: "/images/legends/seref-bey.jpg",
      description: "Beşiktaş'ın kurucu üyelerinden olup kulübün futbol branşının temellerini atmıştır."
    }
  ];

  return (
    <div className="about-container">
      <motion.div 
        className="about-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Beşiktaş Jimnastik Kulübü
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Türkiye'nin ilk spor kulübü olarak 1903'ten beri sporun ve fair-play'in bayrağını taşıyoruz.
        </motion.p>
      </motion.div>

      <motion.div 
        className="tabs-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => handleTabChange('history')}
        >
          <i className="fas fa-history"></i>
          Tarihçe
        </button>
        <button 
          className={`tab-button ${activeTab === 'legends' ? 'active' : ''}`}
          onClick={() => handleTabChange('legends')}
        >
          <i className="fas fa-star"></i>
          Efsaneler
        </button>
      </motion.div>

      <div className="tab-content">
        {activeTab === 'history' && (
          <motion.div
            className="timeline-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Onurlu Tarihimiz
            </motion.h2>
            <div className="timeline">
              {timelineEvents.map((event, index) => (
                <motion.div 
                  key={index} 
                  className="timeline-event"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="timeline-year">{event.year}</div>
                  <div className="timeline-content">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'legends' && (
          <motion.div
            className="legends-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Kulüp Efsaneleri
            </motion.h2>
            <div className="legends-grid">
              {legends.map((legend, index) => (
                <motion.div 
                  key={legend.id} 
                  className="legend-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <div className="legend-image-container">
                    <img src={legend.image} alt={legend.name} className="legend-image" />
                    <div className="legend-overlay"></div>
                  </div>
                  <div className="legend-info">
                    <h3>{legend.name}</h3>
                    <p className="legend-role">{legend.role}</p>
                    <p className="legend-description">{legend.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default AboutPage;