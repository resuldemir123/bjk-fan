const sql = require('mssql');
require('dotenv').config();

// MSSQL Server konfigürasyonu - LocalDB için
const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    enableArithAbort: true,
    requestTimeout: 30000,
    connectionTimeout: 30000,
    integratedSecurity: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

class Database {
  constructor() {
    this.pool = null;
    this.connected = false;
    this.mockUsers = [
      {
        UserId: '123e4567-e89b-12d3-a456-426614174000',
        Username: 'bjkfan1903',
        Email: 'fan@bjk.com',
        FirstName: 'Ahmet',
        LastName: 'Yılmaz',
        TotalScore: 1500,
        Level: 3,
        FavoritePlayer: 'Cenk Tosun',
        IsActive: 1
      }
    ];
  }

  async connect() {
    try {
      console.log('🔄 Mock veritabanı modu - Bağlantı simüle ediliyor...');
      this.connected = true;
      console.log('✅ Mock veritabanına başarıyla bağlanıldı!');
      return true;
    } catch (error) {
      console.error('❌ Veritabanı bağlantı hatası:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.pool) {
        await this.pool.close();
        this.connected = false;
        console.log('🔌 Veritabanı bağlantısı kapatıldı');
      }
    } catch (error) {
      console.error('Veritabanı bağlantısı kapatma hatası:', error);
    }
  }

  async query(queryString, params = []) {
    try {
      if (!this.connected) {
        await this.connect();
      }

      const request = this.pool.request();
      
      // Parametreleri ekle
      if (params && params.length > 0) {
        params.forEach((param, index) => {
          request.input(`param${index}`, param);
        });
      }

      const result = await request.query(queryString);
      return result;
    } catch (error) {
      console.error('Sorgu hatası:', error);
      throw error;
    }
  }

  async execute(procedureName, params = {}) {
    try {
      if (!this.connected) {
        await this.connect();
      }

      const request = this.pool.request();
      
      // Parametreleri ekle
      Object.keys(params).forEach(key => {
        request.input(key, params[key]);
      });

      const result = await request.execute(procedureName);
      return result;
    } catch (error) {
      console.error('Prosedür çalıştırma hatası:', error);
      throw error;
    }
  }

  // Kullanıcı işlemleri için özel metodlar
  async createUser(userData) {
    console.log('🔧 Mock: Kullanıcı oluşturuluyor...', userData.username);
    const newUser = {
      UserId: Date.now().toString(),
      Username: userData.username,
      Email: userData.email,
      FirstName: userData.firstName,
      LastName: userData.lastName,
      TotalScore: 0,
      Level: 1,
      FavoritePlayer: userData.favoritePlayer,
      IsActive: 1,
      CreatedAt: new Date()
    };
    this.mockUsers.push(newUser);
    return newUser;
  }

  async findUserByEmail(email) {
    console.log('🔧 Mock: Email ile kullanıcı aranıyor...', email);
    return this.mockUsers.find(user => user.Email === email && user.IsActive === 1);
  }

  async findUserByUsername(username) {
    console.log('🔧 Mock: Kullanıcı adı ile aranıyor...', username);
    return this.mockUsers.find(user => user.Username === username && user.IsActive === 1);
  }

  async findUserById(userId) {
    console.log('🔧 Mock: ID ile kullanıcı aranıyor...', userId);
    return this.mockUsers.find(user => user.UserId === userId && user.IsActive === 1);
  }

  async getLeaderboard(limit = 10) {
    console.log('🔧 Mock: Lider tablosu getiriliyor...');
    return this.mockUsers
      .filter(user => user.IsActive === 1)
      .sort((a, b) => b.TotalScore - a.TotalScore)
      .slice(0, limit)
      .map(user => ({
        Username: user.Username,
        FirstName: user.FirstName,
        LastName: user.LastName,
        TotalScore: user.TotalScore,
        Level: user.Level,
        FavoritePlayer: user.FavoritePlayer
      }));
  }

  async updateUserScore(userId, points, gameType, details) {
    console.log('🔧 Mock: Kullanıcı skoru güncelleniyor...', userId, points);
    const user = this.mockUsers.find(u => u.UserId === userId);
    if (user) {
      user.TotalScore += points;
      user.Level = Math.floor(user.TotalScore / 500) + 1;
    }
    return user;
  }
}

// Singleton instance
const database = new Database();

module.exports = database;