document.addEventListener('DOMContentLoaded', () => {
  const cardSymbols = [
    "🍎", "🍎",
    "🐶", "🐶",
    "⚽", "⚽",
    "🎵", "🎵",
    "🚗", "🚗",
    "🌟", "🌟",
    "🍕", "🍕",
    "📚", "📚"
  ];

  const gameBoard = document.getElementById('gameBoard');
  const matchSound = document.getElementById('matchSound');
  const errorSound = document.getElementById('errorSound');
  const victoryMusic = document.getElementById('victoryMusic');
  const backgroundMusic = document.getElementById('backgroundMusic');

  let shuffledSymbols;
  let flippedCards = [];
  let matchedCount = 0;
  let canClick = false;

  function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while(currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  function createBoard() {
    gameBoard.innerHTML = '';
    shuffledSymbols = shuffle(cardSymbols.slice());

    shuffledSymbols.forEach(symbol => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.symbol = symbol;
      card.innerHTML = `
        <div class="card-inner">
          <div class="front">?</div>
          <div class="back">${symbol}</div>
        </div>`;
      gameBoard.appendChild(card);

      card.addEventListener('click', () => {
        if (!canClick) return;
        if (
          flippedCards.length < 2 &&
          !card.classList.contains('flipped') &&
          !card.classList.contains('matched')
        ) {
          card.classList.add('flipped');
          flippedCards.push(card);

          if (flippedCards.length === 2) {
            canClick = false;
            if (flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol) {
              matchSound.currentTime = 0;
              matchSound.play();

              flippedCards[0].classList.add('matched');
              flippedCards[1].classList.add('matched');

              matchedCount += 2;
              flippedCards = [];

              canClick = true;

              if (matchedCount === shuffledSymbols.length) {
                
                matchSound.pause();
                errorSound.pause();
                backgroundMusic.pause();
              
                victoryMusic.currentTime = 0;
                victoryMusic.play();

                setTimeout(() => {
                  alert('Parabéns! Você encontrou todos os pares!');
                  resetGame();
                }, 2000);
              }
            } else {
              errorSound.currentTime = 0;
              errorSound.play();

              setTimeout(() => {
                flippedCards.forEach(card => card.classList.remove('flipped'));
                flippedCards = [];
                canClick = true;
              }, 1000);
            }
          }
        }
      });
    });
  }

  function resetGame() {
    victoryMusic.pause();
    victoryMusic.currentTime = 0;

    matchedCount = 0;
    flippedCards = [];
    createBoard();
    showInitialCards();
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
  }

  function showInitialCards() {
    canClick = false;
    gameBoard.classList.add('show-all');
    setTimeout(() => {
      gameBoard.classList.remove('show-all');
      canClick = true;
    }, 2000);
  }

  
  backgroundMusic.volume = 0.3;
  backgroundMusic.play();

  createBoard();
  showInitialCards();
});
