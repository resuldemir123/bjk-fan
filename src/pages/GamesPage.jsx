import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import '../styles/games.css';

function GamesPage() {
  const [currentGame, setCurrentGame] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);

  const games = [
    {
      id: 'quiz',
      title: 'Beşiktaş Bilgi Yarışması',
      description: 'Beşiktaş tarihini ne kadar iyi biliyorsun? Test et!',
      icon: 'fa-brain',
      difficulty: 'Orta'
    },
    {
      id: 'memory',
      title: 'BJK Hafıza Oyunu',
      description: 'Beşiktaş\'ın efsane oyuncularını eşleştir!',
      icon: 'fa-th',
      difficulty: 'Kolay'
    },
    {
      id: 'trivia',
      title: 'Hızlı Sorular',
      description: 'Zamana karşı Beşiktaş soruları!',
      icon: 'fa-clock',
      difficulty: 'Zor'
    }
  ];

  const quizQuestions = [
    {
      question: 'Beşiktaş hangi yılda kuruldu?',
      options: ['1902', '1903', '1904', '1905'],
      correct: 1
    },
    {
      question: 'Beşiktaş\'ın stadyumunun adı nedir?',
      options: ['İnönü Stadyumu', 'Vodafone Park', 'BJK İnönü Stadyumu', 'Kara Kartal Arena'],
      correct: 1
    },
    {
      question: 'Beşiktaş kaç kez Süper Lig şampiyonu oldu?',
      options: ['14', '15', '16', '17'],
      correct: 2
    },
    {
      question: 'Beşiktaş\'ın resmi renkleri nelerdir?',
      options: ['Siyah-Beyaz', 'Siyah-Sarı', 'Beyaz-Mavi', 'Siyah-Kırmızı'],
      correct: 0
    },
    {
      question: 'Beşiktaş\'ın lakabı nedir?',
      options: ['Aslan', 'Kartal', 'Kara Kartal', 'Şahin'],
      correct: 2
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
    if (selectedAnswer === quizQuestions[currentQuestion].correct) {
      setQuizScore(quizScore + 1);
    }

    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setQuizScore(0);
    setShowResult(false);
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

  const renderGameSelection = () => (
    <div className="games-grid">
      {games.map((game, index) => (
        <motion.div
          key={game.id}
          className="game-card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          onClick={() => setCurrentGame(game.id)}
        >
          <div className="game-icon">
            <i className={`fas ${game.icon}`}></i>
          </div>
          <h3>{game.title}</h3>
          <p>{game.description}</p>
          <div className="game-difficulty">
            <span className={`difficulty ${game.difficulty.toLowerCase()}`}>
              {game.difficulty}
            </span>
          </div>
          <button className="play-btn">Oyna</button>
        </motion.div>
      ))}
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
            <span className="question-counter">
              Soru {currentQuestion + 1} / {quizQuestions.length}
            </span>
            <span className="current-score">Puan: {quizScore}</span>
          </div>
          <h3>{quizQuestions[currentQuestion].question}</h3>
          <div className="quiz-options">
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className="quiz-option"
                onClick={() => handleQuizAnswer(index)}
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="quiz-result"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3>Oyun Bitti!</h3>
          <div className="final-score">
            {quizScore} / {quizQuestions.length}
          </div>
          <p>
            {quizScore === quizQuestions.length 
              ? "Mükemmel! Gerçek bir Beşiktaşlısın! 🦅"
              : quizScore >= 3 
              ? "Çok iyi! Beşiktaş hakkında bilgin var! ⚫⚪"
              : "Daha çok çalışman gerek! 📚"
            }
          </p>
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