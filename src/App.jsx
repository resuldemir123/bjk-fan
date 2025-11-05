import { useEffect, useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import GalleryPage from './pages/GalleryPage'
import GamesPage from './pages/GamesPage'
import HomePage from './pages/HomePage'
import NewsDetailPage from './pages/NewsDetailPage'
import './styles/loading.css'

function App() {
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Sayfa yüklendiğinde loading animasyonu
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000) // Logoyu daha uzun süre göstermek için 2 saniyeye çıkardım
    
    // Component unmount olduğunda timer'ı temizle
    return () => clearTimeout(timer)
  }, [])

  // Loading durumunda gösterilecek ekran
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="logo-container">
          <img src="/images/bjk-logo.png" alt="Beşiktaş JK Logo" className="animated-logo" />
        </div>
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
        <p className="loading-text">Beşiktaş JK<span className="loading-dots">...</span></p>
      </div>
    )
  }

  // Ana uygulama
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/hakkimizda" element={<AboutPage />} />
            <Route path="/galeri" element={<GalleryPage />} />
            <Route path="/oyunlar" element={<GamesPage />} />
            <Route path="/iletisim" element={<ContactPage />} />
            <Route path="/haber/:id" element={<NewsDetailPage />} />
            {/* Bilinmeyen URL'leri ana sayfaya yönlendir */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
