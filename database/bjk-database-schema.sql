-- BJK Fan Club Database Schema
-- Bu script BJK veritabanında çalıştırılacak

-- Kullanıcılar tablosu
CREATE TABLE Users (
    UserId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Username NVARCHAR(50) UNIQUE NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Phone NVARCHAR(20) NULL,
    DateOfBirth DATE NULL,
    ProfileImage NVARCHAR(255) NULL,
    FanSince DATE NULL,
    FavoritePlayer NVARCHAR(100) NULL,
    TotalScore INT DEFAULT 0,
    Level NVARCHAR(20) DEFAULT 'Taraftar',
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- Kullanıcı skorları tablosu (oyun sonuçları için)
CREATE TABLE UserScores (
    ScoreId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    GameType NVARCHAR(50) NOT NULL, -- 'prediction', 'quiz', 'trivia'
    Points INT NOT NULL,
    GameDate DATETIME2 DEFAULT GETDATE(),
    Details NVARCHAR(MAX) NULL, -- JSON format için oyun detayları
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

-- Kullanıcı oturumları tablosu
CREATE TABLE UserSessions (
    SessionId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Token NVARCHAR(255) NOT NULL,
    ExpiresAt DATETIME2 NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    IsActive BIT DEFAULT 1,
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

-- Liderlik seviyeleri tanımları
CREATE TABLE FanLevels (
    LevelId INT IDENTITY(1,1) PRIMARY KEY,
    LevelName NVARCHAR(20) NOT NULL,
    MinScore INT NOT NULL,
    MaxScore INT NULL,
    BadgeIcon NVARCHAR(255) NULL
);

-- Varsayılan fan seviyeleri
INSERT INTO FanLevels (LevelName, MinScore, MaxScore, BadgeIcon) VALUES
('Taraftar', 0, 99, 'fan-badge.png'),
('Sadık Taraftar', 100, 499, 'loyal-fan-badge.png'),
('Çarşı Üyesi', 500, 999, 'carsi-badge.png'),
('Efsane Taraftar', 1000, 2499, 'legend-badge.png'),
('BJK Aşığı', 2500, NULL, 'ultimate-badge.png');

-- Kullanıcı seviyesi güncelleme prosedürü
CREATE PROCEDURE UpdateUserLevel
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    DECLARE @TotalScore INT;
    DECLARE @NewLevel NVARCHAR(20);
    
    -- Kullanıcının toplam skorunu al
    SELECT @TotalScore = TotalScore FROM Users WHERE UserId = @UserId;
    
    -- Yeni seviyeyi belirle
    SELECT TOP 1 @NewLevel = LevelName 
    FROM FanLevels 
    WHERE MinScore <= @TotalScore 
      AND (MaxScore IS NULL OR @TotalScore <= MaxScore)
    ORDER BY MinScore DESC;
    
    -- Kullanıcının seviyesini güncelle
    UPDATE Users 
    SET Level = @NewLevel, UpdatedAt = GETDATE() 
    WHERE UserId = @UserId;
END;

-- İndeksler
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_Username ON Users(Username);
CREATE INDEX IX_UserScores_UserId ON UserScores(UserId);
CREATE INDEX IX_UserScores_GameDate ON UserScores(GameDate);
CREATE INDEX IX_UserSessions_Token ON UserSessions(Token);
CREATE INDEX IX_UserSessions_UserId ON UserSessions(UserId);