// JavaScript
const cardsContainer = document.getElementById("cards");
let firstCard, secondCard;
let cards = [];
let score = 0;
let lockBoard = false;
const totalPairs = 9; // Assuming 18 cards in total (9 pairs)
let pairsMatched = 0;

// Function to update the score display
function updateScoreDisplay() {
  document.getElementById("score").textContent = "Score: " + score;
}

// Function to check if the player has won the game
function checkGameWin() {
  if (pairsMatched === totalPairs) {
    alert("Congratulations! You've won the game!");
  }
}

document.getElementById("score").textContent = "Score: " + score;

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
    console.log(cards);
  });

function shuffleCards() {
  let currentIndex = cards.length;
  let randomIndex;
  let tempValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    tempValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = tempValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
    <div class="front">
    <img class="front-image" src=${card.image}>
    </div>
    <div class="back"> </div>
    `;

    cardsContainer.appendChild(cardElement);

    cardElement.addEventListener("click", flipCard);
    cardElement.addEventListener("touch", flipCard);
  }
}

function flipCard() {
  if (lockBoard || this === firstCard || this.classList.contains("flipped")) {
    return;
  }

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  isMatch ? disableCards() : unflipCards();
}

function unlockBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  firstCard.removeEventListener("touch", flipCard);
  secondCard.removeEventListener("touch", flipCard);
  score++;
  pairsMatched++;
  updateScoreDisplay();
  unlockBoard();
  checkGameWin();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    unlockBoard();
  }, 1000);
}
function restart () {
shuffleCards();
unlockBoard();
cardsContainer.innerHTML = "";
generateCards();
score = 0;
document.getElementById("score").textContent = score;
}