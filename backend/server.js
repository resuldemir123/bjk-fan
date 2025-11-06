const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const database = require('./database');
const authController = require('./controllers/authController');

const app = express();
const PORT = process.env.PORT || 3001;

// Güvenlik middleware'leri
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 dakika
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Auth middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Erişim token bulunamadı'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await database.findUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Geçersiz token'
    });
  }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'BJK Fan Club API çalışıyor! 🦅',
    timestamp: new Date().toISOString()
  });
});

// Auth routes
app.post('/api/auth/register', authController.registerValidation, authController.register);
app.post('/api/auth/login', authController.loginValidation, authController.login);
app.get('/api/auth/validate', authController.validateToken);

// User routes
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = { ...req.user };
    delete user.PasswordHash;
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Profil bilgileri alınamadı'
    });
  }
});

app.put('/api/users/:userId/profile', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, phone, dateOfBirth, favoritePlayer } = req.body;

    // Kullanıcının sadece kendi profilini güncelleyebilmesini kontrol et
    if (req.user.UserId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Bu profili güncelleme yetkiniz yok'
      });
    }

    const sql = require('mssql');
    const query = `
      UPDATE Users 
      SET FirstName = @firstName, 
          LastName = @lastName, 
          Phone = @phone, 
          DateOfBirth = @dateOfBirth, 
          FavoritePlayer = @favoritePlayer,
          UpdatedAt = GETDATE()
      WHERE UserId = @userId
    `;

    const request = database.pool.request();
    request.input('firstName', sql.NVarChar(50), firstName);
    request.input('lastName', sql.NVarChar(50), lastName);
    request.input('phone', sql.NVarChar(20), phone);
    request.input('dateOfBirth', sql.Date, dateOfBirth);
    request.input('favoritePlayer', sql.NVarChar(100), favoritePlayer);
    request.input('userId', sql.UniqueIdentifier, userId);

    await request.query(query);

    const updatedUser = await database.findUserById(userId);
    delete updatedUser.PasswordHash;

    res.json({
      success: true,
      message: 'Profil başarıyla güncellendi',
      user: updatedUser
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Profil güncellenemedi'
    });
  }
});

// Score routes
app.post('/api/users/score', authenticateToken, async (req, res) => {
  try {
    const { points, gameType, details } = req.body;
    const userId = req.user.UserId;

    if (!points || !gameType) {
      return res.status(400).json({
        success: false,
        message: 'Puan ve oyun türü gerekli'
      });
    }

    const updatedUser = await database.updateUserScore(
      userId, 
      points, 
      gameType, 
      JSON.stringify(details)
    );

    delete updatedUser.PasswordHash;

    res.json({
      success: true,
      message: `Tebrikler! ${points} puan kazandınız! 🎉`,
      user: updatedUser
    });

  } catch (error) {
    console.error('Score update error:', error);
    res.status(500).json({
      success: false,
      message: 'Puan güncellenemedi'
    });
  }
});

// Leaderboard route
app.get('/api/users/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await database.getLeaderboard(limit);

    res.json({
      success: true,
      leaderboard
    });

  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Liderlik tablosu alınamadı'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Sunucu hatası'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint bulunamadı'
  });
});

// Sunucuyu başlat
const startServer = async () => {
  try {
    // Veritabanı bağlantısını kur
    await database.connect();
    
    app.listen(PORT, () => {
      console.log(`🚀 BJK Fan Club API sunucusu http://localhost:${PORT} adresinde çalışıyor`);
      console.log(`🦅 Beşiktaş her şeyin en güzeli!`);
    });
  } catch (error) {
    console.error('❌ Sunucu başlatılamadı:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔌 Sunucu kapatılıyor...');
  await database.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔌 Sunucu kapatılıyor...');
  await database.disconnect();
  process.exit(0);
});

startServer();