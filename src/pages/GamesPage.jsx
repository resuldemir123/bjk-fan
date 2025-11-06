import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import '../styles/games.css';

function GamesPage() {
  // Ana sistemden kullanıcı bilgisini al
  const [user, setUser] = useState(() => userService.getCurrentUser());
  const navigate = useNavigate();

  // Mevcut oyun state'leri
  const [currentGame, setCurrentGame] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStartTime, setGameStartTime] = useState(null);

  // Genişletilmiş soru bankası
  const quizQuestions = [
    {
      question: 'Beşiktaş Jimnastik Kulübü hangi yıl kurulmuştur?',
      options: ['1902', '1903', '1904', '1905'],
      correct: 1,
      difficulty: 'easy',
      points: 10
    },
    {
      question: 'Beşiktaş\'ın futbol ligine katılmadan önceki ana branşı nedir?',
      options: ['Futbol', 'Jimnastik', 'Basketbol', 'Yüzme'],
      correct: 1,
      difficulty: 'easy',
      points: 10
    },
    {
      question: 'Beşiktaş\'ın ilk resmi adı nedir?',
      options: ['Beşiktaş JK', 'Bereket Jimnastik Kulübü', 'Kara Kartal SK', 'BJK'],
      correct: 1,
      difficulty: 'medium',
      points: 15
    },
    {
      question: 'Kulüp, resmen tescilini hangi yıl almıştır?',
      options: ['1909', '1910', '1911', '1912'],
      correct: 1,
      difficulty: 'medium',
      points: 15
    },
    {
      question: 'Beşiktaş\'ın simgesi olan Kara Kartallar lakabı hangi yıl ortaya çıkmıştır?',
      options: ['1940', '1941', '1942', '1943'],
      correct: 1,
      difficulty: 'hard',
      points: 20
    },
    {
      question: '"Baba" lakabıyla anılan ve Beşiktaş\'ın sembolü haline gelmiş efsane futbolcu kimdir?',
      options: ['Süleyman Seba', 'Hakkı Yeten', 'Metin Tekin', 'Sergen Yalçın'],
      correct: 1,
      difficulty: 'medium',
      points: 15
    },
    {
      question: 'Beşiktaş tarihinin en çok gol atan oyuncusu kimdir?',
      options: ['Metin Tekin', 'Hakkı Yeten', 'Feyyaz Uçar', 'Nihat Kahveci'],
      correct: 1,
      difficulty: 'hard',
      points: 20
    },
    {
      question: 'Beşiktaş\'ın 100. yıl şampiyonluğunda (2002-2003) teknik direktör kimdi?',
      options: ['Gordon Milne', 'Mircea Lucescu', 'Christoph Daum', 'Mustafa Denizli'],
      correct: 1,
      difficulty: 'hard',
      points: 20
    },
    {
      question: 'Beşiktaş\'ın son şampiyonluğunda (2020-2021) teknik direktörlük görevini üstlenen isim kimdir?',
      options: ['Abdullah Avcı', 'Sergen Yalçın', 'Önder Karaveli', 'Valerien Ismael'],
      correct: 1,
      difficulty: 'medium',
      points: 15
    },
    {
      question: 'Beşiktaş\'ın Süper Lig tarihindeki en farklı galibiyeti olan 10-0\'lık skor hangi takıma karşı elde edilmiştir?',
      options: ['Kocaelispor', 'Adana Demirspor', 'Denizlispor', 'Ankaragücü'],
      correct: 1,
      difficulty: 'expert',
      points: 25
    }
  ];

  const games = [
    {
      id: 'quiz',
      title: 'Beşiktaş Bilgi Yarışması',
      description: 'Beşiktaş tarihini ne kadar iyi biliyorsun? Test et!',
      icon: 'fa-brain',
      difficulty: 'Orta',
      requiresLogin: true
    },
    {
      id: 'memory',
      title: 'BJK Hafıza Oyunu',
      description: 'Beşiktaş\'ın efsane oyuncularını eşleştir!',
      icon: 'fa-th',
      difficulty: 'Kolay',
      requiresLogin: false
    }
  ];

  const memoryGameCards = [
    { id: 1, name: 'Sergen Yalçın', image: '/images/legends-1.jpg' },
    { id: 2, name: 'Metin Tekin', image: '/images/historic-1.jpg' },
    { id: 3, name: 'Nihat Kahveci', image: '/images/team-1.jpg' },
    { id: 4, name: 'Ricardo Quaresma', image: '/images/celebration-1.jpg' },
    { id: 5, name: 'Atiba Hutchinson', image: '/images/bjk-stadium.jpg' },
    { id: 6, name: 'Cenk Tosun', image: '/images/stadium-1.jpg' }
  ];

  // Auth fonksiyonlarını kaldırıp Header'daki sistemi kullan
  const startGame = (gameId) => {
    const game = games.find(g => g.id === gameId);
    
    if (game.requiresLogin && !user) {
      // Header'daki login sayfasına yönlendir
      navigate('/login');
      return;
    }

    setCurrentGame(gameId);
    if (gameId === 'quiz') {
      setGameStartTime(Date.now());
      setTimeLeft(30);
    }
  };

  const calculateFinalScore = () => {
    const baseScore = quizScore * 10;
    const timeBonus = timeLeft > 0 ? Math.floor(timeLeft / 5) * 5 : 0;
    const difficultyBonus = quizQuestions
      .slice(0, currentQuestion)
      .reduce((acc, q, index) => {
        if (index < quizScore) {
          return acc + (q.points || 10);
        }
        return acc;
      }, 0);
    
    return baseScore + timeBonus + difficultyBonus;
  };

  const getPlayerLevel = (score) => {
    if (score >= 2000) return { name: 'Kara Kartal Efsanesi', color: '#FFD700' };
    if (score >= 1500) return { name: 'Kanın Siyah Beyaza Akıyor', color: '#C0C0C0' };
    if (score >= 1000) return { name: 'Beşiktaş Senin Hayatın', color: '#CD7F32' };
    if (score >= 500) return { name: 'Kara Kartal Sensin', color: '#000000' };
    if (score >= 200) return { name: 'Gelişen Kartal', color: '#666666' };
    return { name: 'Yeni Kartal', color: '#999999' };
  };

  const getLeaderboard = () => {
    const users = JSON.parse(localStorage.getItem('bjk-users') || '[]');
    return users
      .filter(u => u.totalScore > 0)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10);
  };

  const updateUserScore = (newScore) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      totalScore: user.totalScore + newScore,
      gamesPlayed: user.gamesPlayed + 1
    };

    const level = getPlayerLevel(updatedUser.totalScore);
    updatedUser.level = level.name;

    const users = JSON.parse(localStorage.getItem('bjk-users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    users[userIndex] = updatedUser;

    localStorage.setItem('bjk-users', JSON.stringify(users));
    setUser(updatedUser);
    localStorage.setItem('bjk-user', JSON.stringify(updatedUser));
  };

  useEffect(() => {
    if (currentGame === 'memory') {
      initializeMemoryGame();
    }
  }, [currentGame]);

  const initializeMemoryGame = () => {
    const shuffledCards = [...memoryGameCards, ...memoryGameCards]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, uniqueId: index }));
    setMemoryCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
  };

  const handleQuizAnswer = (selectedAnswer) => {
    const correct = selectedAnswer === quizQuestions[currentQuestion].correct;
    
    if (correct) {
      setQuizScore(quizScore + 1);
    }

    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const finalScore = calculateFinalScore();
      if (user) {
        updateUserScore(finalScore);
      }
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setQuizScore(0);
    setShowResult(false);
    setTimeLeft(30);
    setGameStartTime(Date.now());
  };

  const handleCardFlip = (cardIndex) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardIndex)) return;
    if (matchedPairs.includes(memoryCards[cardIndex].id)) return;

    const newFlippedCards = [...flippedCards, cardIndex];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlippedCards;
      
      if (memoryCards[first].id === memoryCards[second].id) {
        setMatchedPairs([...matchedPairs, memoryCards[first].id]);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetMemoryGame = () => {
    initializeMemoryGame();
  };

  useEffect(() => {
    let interval;
    if (currentGame === 'quiz' && !showResult && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (user) {
              const finalScore = calculateFinalScore();
              updateUserScore(finalScore);
            }
            setShowResult(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentGame, showResult, timeLeft, user]);

  const renderUserProfile = () => {
    if (!user) return null;
    
    const level = getPlayerLevel(user.totalScore || 0);
    
    return (
      <motion.div 
        className="user-profile"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="profile-info">
          <div className="profile-avatar">
            <i className="fas fa-user"></i>
          </div>
          <div className="profile-details">
            <h3>{user.username || user.firstName}</h3>
            <p style={{ color: level.color, fontWeight: 'bold' }}>{level.name}</p>
            <p className="score">Toplam Puan: {user.totalScore || 0}</p>
            <p className="games">Oynadığı Oyun: {user.gamesPlayed || 0}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderLeaderboard = () => {
    const leaderboard = getLeaderboard();
    
    return (
      <motion.div 
        className="leaderboard"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h3><i className="fas fa-trophy"></i> Sıralama</h3>
        <div className="leaderboard-list">
          {leaderboard.map((player, index) => {
            const level = getPlayerLevel(player.totalScore);
            return (
              <div 
                key={player.id} 
                className={`leaderboard-item ${player.id === user?.id ? 'current-user' : ''}`}
              >
                <div className="rank">
                  {index === 0 && <i className="fas fa-crown gold"></i>}
                  {index === 1 && <i className="fas fa-medal silver"></i>}
                  {index === 2 && <i className="fas fa-medal bronze"></i>}
                  {index > 2 && <span>{index + 1}</span>}
                </div>
                <div className="player-info">
                  <span className="name">{player.username}</span>
                  <span className="level" style={{ color: level.color }}>
                    {level.name}
                  </span>
                </div>
                <div className="score">{player.totalScore}</div>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  const renderGameSelection = () => (
    <div className="games-content-wrapper">
      <div className="games-main">
        <div className="games-grid">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              className="game-card"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              onClick={() => startGame(game.id)}
            >
              <div className="game-icon">
                <i className={`fas ${game.icon}`}></i>
                {game.requiresLogin && !user && (
                  <div className="login-required">
                    <i className="fas fa-lock"></i>
                  </div>
                )}
              </div>
              <h3>{game.title}</h3>
              <p>{game.description}</p>
              <div className="game-difficulty">
                <span className={`difficulty ${game.difficulty.toLowerCase()}`}>
                  {game.difficulty}
                </span>
              </div>
              <button className="play-btn">
                {game.requiresLogin && !user ? 'Giriş Gerekli' : 'Oyna'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="games-sidebar">
        {renderLeaderboard()}
      </div>
    </div>
  );

  const renderQuizGame = () => (
    <div className="quiz-container">
      {!showResult ? (
        <motion.div
          className="quiz-question"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="quiz-header">
            <div className="quiz-progress">
              <span className="question-counter">
                Soru {currentQuestion + 1} / {quizQuestions.length}
              </span>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="quiz-stats">
              <span className="current-score">Doğru: {quizScore}</span>
              <span className="timer">
                <i className="fas fa-clock"></i> {timeLeft}s
              </span>
            </div>
          </div>
          <h3>{quizQuestions[currentQuestion].question}</h3>
          <div className="quiz-options">
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className="quiz-option"
                onClick={() => handleQuizAnswer(index)}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                {option}
              </button>
            ))}
          </div>
          <div className="question-info">
            <span className={`difficulty ${quizQuestions[currentQuestion].difficulty}`}>
              {quizQuestions[currentQuestion].difficulty === 'easy' && 'Kolay'}
              {quizQuestions[currentQuestion].difficulty === 'medium' && 'Orta'}
              {quizQuestions[currentQuestion].difficulty === 'hard' && 'Zor'}
              {quizQuestions[currentQuestion].difficulty === 'expert' && 'Uzman'}
            </span>
            <span className="points">+{quizQuestions[currentQuestion].points || 10} puan</span>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="quiz-result"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3>Oyun Bitti! 🎉</h3>
          <div className="result-stats">
            <div className="stat">
              <span className="label">Doğru Cevap:</span>
              <span className="value">{quizScore} / {quizQuestions.length}</span>
            </div>
            <div className="stat">
              <span className="label">Kazanılan Puan:</span>
              <span className="value">{calculateFinalScore()}</span>
            </div>
            <div className="stat">
              <span className="label">Hız Bonusu:</span>
              <span className="value">+{timeLeft > 0 ? Math.floor(timeLeft / 5) * 5 : 0}</span>
            </div>
          </div>
          <div className="result-message">
            <p>
              {quizScore === quizQuestions.length 
                ? "Mükemmel! Gerçek bir Beşiktaşlısın! 🦅"
                : quizScore >= Math.floor(quizQuestions.length * 0.7)
                ? "Çok iyi! Beşiktaş hakkında bilgin var! ⚫⚪"
                : "Daha çok çalışman gerek! 📚"
              }
            </p>
            {user && (
              <p className="level-info">
                Şu anki seviyeniz: <strong style={{ color: getPlayerLevel(user.totalScore).color }}>
                  {getPlayerLevel(user.totalScore).name}
                </strong>
              </p>
            )}
          </div>
          <div className="quiz-actions">
            <button onClick={resetQuiz} className="btn btn-primary">Tekrar Oyna</button>
            <button onClick={() => setCurrentGame(null)} className="btn btn-secondary">Ana Menü</button>
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderMemoryGame = () => (
    <div className="memory-container">
      <div className="memory-header">
        <span className="moves-counter">Hamle: {moves}</span>
        <span className="pairs-counter">
          Eşleşen: {matchedPairs.length} / {memoryGameCards.length}
        </span>
      </div>
      <div className="memory-grid">
        {memoryCards.map((card, index) => (
          <motion.div
            key={card.uniqueId}
            className={`memory-card ${
              flippedCards.includes(index) || matchedPairs.includes(card.id) 
                ? 'flipped' : ''
            }`}
            onClick={() => handleCardFlip(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="card-front">
              <i className="fas fa-question"></i>
            </div>
            <div className="card-back">
              <img src={card.image} alt={card.name} />
              <span>{card.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
      {matchedPairs.length === memoryGameCards.length && (
        <motion.div
          className="memory-complete"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>Tebrikler! 🎉</h3>
          <p>{moves} hamlede tamamladın!</p>
          <div className="memory-actions">
            <button onClick={resetMemoryGame} className="btn btn-primary">Tekrar Oyna</button>
            <button onClick={() => setCurrentGame(null)} className="btn btn-secondary">Ana Menü</button>
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="games-page">
      <section className="games-hero">
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>BJK <span className="highlight">Oyun</span> Merkezi</h1>
            <p>Beşiktaş sevginizi eğlenceli oyunlarla test edin!</p>
            {currentGame && (
              <button 
                className="back-btn"
                onClick={() => setCurrentGame(null)}
              >
                <i className="fas fa-arrow-left"></i> Geri Dön
              </button>
            )}
          </motion.div>
          
          {/* Kullanıcı profili veya giriş yönlendirme */}
          <div className="auth-section">
            {user ? (
              renderUserProfile()
            ) : (
              <div className="auth-buttons-container">
                <button 
                  onClick={() => navigate('/login')}
                  className="btn btn-primary"
                >
                  <i className="fas fa-sign-in-alt"></i> Giriş Yap
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="btn btn-secondary"
                >
                  <i className="fas fa-user-plus"></i> Kayıt Ol
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="games-content">
        <div className="container">
          {currentGame === null && renderGameSelection()}
          {currentGame === 'quiz' && renderQuizGame()}
          {currentGame === 'memory' && renderMemoryGame()}
        </div>
      </section>
    </div>
  );
}

export default GamesPage;