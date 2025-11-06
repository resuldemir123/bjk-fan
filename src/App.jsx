import { useEffect, useState } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import GalleryPage from './pages/GalleryPage'
import GamesPage from './pages/GamesPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NewsDetailPage from './pages/NewsDetailPage'
import RegisterPage from './pages/RegisterPage'
import { userService } from './services/userService'
import './styles/loading.css'

function App() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    // Kullanıcı authentication durumunu kontrol et
    const checkAuth = async () => {
      try {
        const token = userService.getToken()
        const currentUser = userService.getCurrentUser()
        
        if (token && currentUser) {
          // Token geçerliliğini kontrol et
          const isValid = await userService.validateToken()
          if (isValid) {
            setIsAuthenticated(true)
            setUser(currentUser)
          } else {
            // Token geçersizse temizle
            userService.logout()
          }
        }
      } catch (error) {
        console.error('Auth check error:', error)
        userService.logout()
      }
    }

    // Loading ve auth kontrolünü birlikte yap
    const initializeApp = async () => {
      await checkAuth()
      
      // Loading animasyonu
      setTimeout(() => {
        setLoading(false)
      }, 2000)
    }

    initializeApp()
  }, [])

  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true)
    setUser(userData.user)
    // Ana sayfaya yönlendir
    window.location.href = '/'
  }

  const handleLogout = () => {
    userService.logout()
    setIsAuthenticated(false)
    setUser(null)
    // Login sayfasına yönlendir
    window.location.href = '/login'
  }

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
        <Header isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/hakkimizda" element={<AboutPage />} />
            <Route path="/galeri" element={<GalleryPage />} />
            <Route path="/oyunlar" element={<GamesPage />} />
            <Route path="/iletisim" element={<ContactPage />} />
            <Route path="/haber/:id" element={<NewsDetailPage />} />
            
            {/* Auth Route'ları */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <LoginPage onLoginSuccess={handleLoginSuccess} />
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <RegisterPage onRegisterSuccess={handleLoginSuccess} />
              } 
            />
            
            {/* Bilinmeyen URL'leri ana sayfaya yönlendir */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
