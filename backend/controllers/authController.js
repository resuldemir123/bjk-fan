const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const database = require('../database');

// JWT Token oluşturma
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Kullanıcı kayıt işlemi
const register = async (req, res) => {
  try {
    // Validation hatalarını kontrol et
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veriler',
        errors: errors.array()
      });
    }

    const {
      username,
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      favoritePlayer,
      fanSince
    } = req.body;

    // E-posta kontrolü
    const existingUserByEmail = await database.findUserByEmail(email);
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: 'Bu e-posta adresi zaten kullanılıyor'
      });
    }

    // Kullanıcı adı kontrolü
    const existingUserByUsername = await database.findUserByUsername(username);
    if (existingUserByUsername) {
      return res.status(400).json({
        success: false,
        message: 'Bu kullanıcı adı zaten kullanılıyor'
      });
    }

    // Şifreyi hash'le
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Kullanıcıyı oluştur
    const userData = {
      username,
      email,
      passwordHash,
      firstName,
      lastName,
      phone: phone || null,
      dateOfBirth: dateOfBirth || null,
      favoritePlayer: favoritePlayer || null,
      fanSince: fanSince || new Date().toISOString().split('T')[0]
    };

    const newUser = await database.createUser(userData);

    // Token oluştur
    const token = generateToken(newUser.UserId);

    // Şifreyi response'dan kaldır
    delete newUser.PasswordHash;

    res.status(201).json({
      success: true,
      message: 'Kayıt başarılı! BJK Ailesine hoş geldin!',
      token,
      user: newUser
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası. Lütfen tekrar deneyin.'
    });
  }
};

// Kullanıcı giriş işlemi
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veriler',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Kullanıcıyı bul
    const user = await database.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'E-posta veya şifre hatalı'
      });
    }

    // Şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'E-posta veya şifre hatalı'
      });
    }

    // Token oluştur
    const token = generateToken(user.UserId);

    // Şifreyi response'dan kaldır
    delete user.PasswordHash;

    res.json({
      success: true,
      message: `Hoş geldin ${user.FirstName}! 🦅`,
      token,
      user
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası. Lütfen tekrar deneyin.'
    });
  }
};

// Token doğrulama
const validateToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token bulunamadı'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await database.findUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token'
      });
    }

    delete user.PasswordHash;

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Token validation error:', error);
    res.status(401).json({
      success: false,
      message: 'Geçersiz token'
    });
  }
};

// Validation middleware'leri
const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('Kullanıcı adı 3-50 karakter arasında olmalı')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir'),
  
  body('email')
    .isEmail()
    .withMessage('Geçerli bir e-posta adresi girin')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalı')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermeli'),
  
  body('firstName')
    .isLength({ min: 2, max: 50 })
    .withMessage('Ad 2-50 karakter arasında olmalı')
    .matches(/^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/)
    .withMessage('Ad sadece harf içerebilir'),
  
  body('lastName')
    .isLength({ min: 2, max: 50 })
    .withMessage('Soyad 2-50 karakter arasında olmalı')
    .matches(/^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/)
    .withMessage('Soyad sadece harf içerebilir'),
  
  body('phone')
    .optional()
    .isMobilePhone('tr-TR')
    .withMessage('Geçerli bir telefon numarası girin'),
  
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Geçerli bir tarih girin')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Geçerli bir e-posta adresi girin')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Şifre gerekli')
];

module.exports = {
  register,
  login,
  validateToken,
  registerValidation,
  loginValidation
};