import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/news-detail.css';

function NewsDetailPage() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const newsData = {
    1: {
      id: 1,
      title: 'Beşiktaş\'tan Stratejik Transfer Hamlesi',
      summary: 'Beşiktaş, yeni sezon hazırlıkları kapsamında kadrosunu güçlendirmek için önemli transfer görüşmelerine başladı...',
      content: `Beşiktaş Jimnastik Kulübü, 2024-25 sezonuna damgasını vurmak adına transfer çalışmalarını hızlandırdı. Kulüp yönetimi, teknik direktör ile yapılan toplantılar sonrasında belirli pozisyonlara takviye yapılması kararı alındı.

      Özellikle kanat oyuncusu ve orta saha pozisyonlarında güçlü alternatiflerin arayışında olan siyah-beyazlılar, Avrupa liglerinden deneyimli isimleri takip ediyor. Kulübün sportif direktörü, "Kaliteli ve karakterli oyuncularla kadromuzu güçlendirmeyi hedefliyoruz" açıklamasında bulundu.

      Transfer çalışmaları kapsamında yerli ve yabancı birçok oyuncuyla görüşmelerin sürdüğü belirtilirken, resmi açıklamaların önümüzdeki haftalarda yapılacağı ifade edildi. Taraftarlar ise sosyal medyada bu gelişmeleri büyük bir heyecanla takip ediyor.

      Vodafone Park'ta yapılacak olan yeni sezon lansmanında transfer hamlelerinin detayları açıklanacak. Kulüp başkanı da en kısa sürede müjdeli haberleri taraftarlarla paylaşacaklarını duyurdu.`,
      date: '15 Nisan 2025',
      author: 'Beşiktaş JK Medya',
      image: '/images/team-1.jpg',
      gallery: [
        '/images/team-1.jpg',
        '/images/stadium-1.jpg',
        '/images/celebration-1.jpg',
        '/images/historic-1.jpg'
      ],
      tags: ['Transfer', 'Kadro', 'Yönetim']
    },
    2: {
      id: 2,
      title: 'Vodafone Park\'ta Tarihi Gece',
      summary: 'Avrupa kupalarında oynanan maçta taraftarlar muazzam bir atmosfer oluşturarak takımına destek verdi...',
      content: `Vodafone Park, dün gece Avrupa kupalarında oynanan kritik maçta adeta çıldırdı. 42.590 kişilik stadyumun tamamını dolduran Beşiktaş taraftarları, takımlarına muhteşem bir destek verdi.

      Maç öncesi yapılan koreografi ve tribünlerin oluşturduğu ses duvarı, rakip takım oyuncularını bile büyüledi. Çarşı grubu öncülüğünde yapılan tezahürat, stadyumu adeta savaş alanına çevirdi.

      90 dakika boyunca hiç susmayan taraftarlar, takımlarının her hareketini coşkuyla destekledi. Özellikle ikinci yarıda atılan golde yaşanan sevinç patlaması, stadyumun temellerini sarstı.

      Maç sonrası oyuncular, taraftarlara teşekkür etmek için tribün önünde uzun süre selamladı. Teknik direktör de basın toplantısında "Bu atmosfer Avrupa'da eşi benzeri görülmemiş bir destekti" değerlendirmesinde bulundu.`,
      date: '12 Nisan 2025',
      author: 'Stadyum Muhabiri',
      image: '/images/bjk-stadium.jpg',
      gallery: [
        '/images/bjk-stadium.jpg',
        '/images/celebration-1.jpg',
        '/images/team-1.jpg',
        '/images/stadium-1.jpg'
      ],
      tags: ['Vodafone Park', 'Avrupa Kupaları', 'Taraftar']
    },
    3: {
      id: 3,
      title: 'Akademi\'den Yeni Yetenekler',
      summary: 'Beşiktaş altyapısından yetişen genç futbolcular A takımda forma şansı bularak kulübün geleceğini temsil ediyor...',
      content: `Beşiktaş Jimnastik Kulübü'nün gözbebeği olan akademi, bir kez daha yetenekli futbolcular yetiştirmeye devam ediyor. Bu sezon A takıma yükselen genç oyuncular, verdikleri performansla kulübün geleceğine umut veriyorlar.

      Özellikle 18-20 yaş grubu oyuncular, antrenman performanslarıyla teknik direktörün dikkatini çekmeyi başardı. Altyapı koordinatörü, "Gençlerimiz Beşiktaş DNA'sını taşıyarak büyüyorlar" açıklamasında bulundu.

      Akademiden yetişen oyuncular, sadece teknik becerileriyle değil, aynı zamanda Beşiktaş kültürünü içselleştirmeleri ile de dikkat çekiyor. Disiplinli çalışmaları ve kulübe bağlılıkları, onları diğerlerinden ayıran özellikler arasında.

      Önümüzdeki sezon bu genç yeteneklerin daha fazla şans bulacağı belirtilirken, bazı oyuncuların kiralık olarak deneyim kazanması da gündemde. Kulüp, gençlere olan inancını her fırsatta dile getiriyor.`,
      date: '10 Nisan 2025',
      author: 'Akademi Muhabiri',
      image: '/images/team-1.jpg',
      gallery: [
        '/images/team-1.jpg',
        '/images/legends-1.jpg',
        '/images/historic-1.jpg',
        '/images/stadium-1.jpg'
      ],
      tags: ['Akademi', 'Gençlik', 'Gelecek']
    }
  };

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newsItem = newsData[id];
      if (newsItem) {
        setNews(newsItem);
        
        // İlgili haberleri getir (diğer haberler)
        const related = Object.values(newsData)
          .filter(item => item.id !== parseInt(id))
          .slice(0, 2);
        setRelatedNews(related);
      }
      
      setIsLoading(false);
    };

    loadNews();
  }, [id]);

  if (isLoading) {
    return (
      <div className="news-detail-loading">
        <div className="spinner"></div>
        <p>Haber yükleniyor...</p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="news-not-found">
        <h2>Haber bulunamadı</h2>
        <Link to="/" className="btn btn-primary">Ana Sayfaya Dön</Link>
      </div>
    );
  }

  return (
    <div className="news-detail-page">
      {/* Breadcrumb */}
      <section className="breadcrumb">
        <div className="container">
          <nav>
            <Link to="/">Ana Sayfa</Link>
            <span>/</span>
            <span>Haberler</span>
            <span>/</span>
            <span>{news.title}</span>
          </nav>
        </div>
      </section>

      {/* Ana İçerik */}
      <article className="news-article">
        <div className="container">
          <motion.div 
            className="article-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="article-meta">
              <span className="date">{news.date}</span>
              <span className="author">Yazar: {news.author}</span>
            </div>
            <h1>{news.title}</h1>
            <p className="summary">{news.summary}</p>
            
            <div className="tags">
              {news.tags.map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="article-image"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img src={news.image} alt={news.title} />
          </motion.div>

          <motion.div 
            className="article-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {news.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph.trim()}</p>
            ))}
          </motion.div>

          {/* Fotoğraf Galerisi */}
          <motion.section 
            className="news-gallery"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3>Fotoğraf Galerisi</h3>
            <div className="gallery-grid">
              {news.gallery.map((image, index) => (
                <motion.div 
                  key={index}
                  className="gallery-item"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={image} alt={`Galeri ${index + 1}`} />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Sosyal Medya Paylaşım */}
          <motion.div 
            className="social-share"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <h4>Bu haberi paylaş:</h4>
            <div className="share-buttons">
              <button className="share-btn twitter">
                <i className="fab fa-twitter"></i>
                Twitter
              </button>
              <button className="share-btn facebook">
                <i className="fab fa-facebook-f"></i>
                Facebook
              </button>
              <button className="share-btn whatsapp">
                <i className="fab fa-whatsapp"></i>
                WhatsApp
              </button>
            </div>
          </motion.div>
        </div>
      </article>

      {/* İlgili Haberler */}
      {relatedNews.length > 0 && (
        <section className="related-news">
          <div className="container">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              İlgili Haberler
            </motion.h3>
            <div className="related-news-grid">
              {relatedNews.map((item, index) => (
                <motion.article 
                  key={item.id}
                  className="related-news-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Link to={`/haber/${item.id}`}>
                    <div className="news-image">
                      <img src={item.image} alt={item.title} />
                    </div>
                    <div className="news-content">
                      <span className="date">{item.date}</span>
                      <h4>{item.title}</h4>
                      <p>{item.summary}</p>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Geri Dön Butonu */}
      <motion.div 
        className="back-to-news"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <div className="container">
          <Link to="/" className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i>
            Ana Sayfaya Dön
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default NewsDetailPage;