/* =============================
   LEVEL CONFIG
============================= */
const LEVELS = [
  { cards: 4, time: 10 },
  { cards: 6, time: 15 },
  { cards: 8, time: 20 },
  { cards: 10, time: 25 },
  { cards: 12, time: 35 },
  { cards: 14, time: 40 },
  { cards: 16, time: 45 },
  { cards: 18, time: 50 },
  { cards: 20, time: 55 }
];

let currentLevel = 0;
let timer = 0;
let countdown;
let score = 0;
let lock = false;
let firstCard = null;
let levelScore = 0;


const board = document.getElementById("gameBoard");

const scoreBox = document.getElementById("score");
const levelBox = document.getElementById("level");
const timerBox = document.getElementById("time");

const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");
const nextBtn = document.getElementById("nextLevelBtn");
const restartBtn = document.getElementById("restartBtn");

const flipSound = document.getElementById("flipSound");

function playFlipSound() {
  flipSound.currentTime = 0;
  flipSound.play();
}

/* =============================
   IMAGES LIST
============================= */
const allImages = [
  "images/retree.jpg",
  "images/dantashi.jpg",
  "images/grizzly.jpg",
  "images/iryna.jpg",
  "images/jake.jpg",
  "images/quang.jpg",
  "images/josh.jpg",
  "images/yankee.jpg",
  "images/dorami.jpg",
  "images/xaitoshi.jpg",
  "images/dmac.jpg",
  "images/jesh.jpg",
  "images/zizi.jpg",
  "images/pranay.jpg",
  "images/outlast.jpg",
  "images/tee.jpg",
  "images/zood.jpg",
  "images/kreko.jpg",
  "images/pansky.jpg",
  "images/conal.jpg",
  "images/satya.jpg",
  "images/mac.jpg"
];


/* =============================
   SHUFFLE FUNCTION (ACAK SEMPURNA)
============================= */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/* =============================
   AUTO GRID LAYOUT
============================= */
function setGrid(cardCount) {
  if (cardCount === 4) board.style.gridTemplateColumns = "repeat(2, 1fr)";
  else if (cardCount === 6) board.style.gridTemplateColumns = "repeat(3, 1fr)";
  else if (cardCount === 8) board.style.gridTemplateColumns = "repeat(4, 1fr)";
  else if (cardCount === 10) board.style.gridTemplateColumns = "repeat(5, 1fr)";
  else if (cardCount === 12) board.style.gridTemplateColumns = "repeat(5, 1fr)";
  else if (cardCount === 14) board.style.gridTemplateColumns = "repeat(5, 1fr)";
  else if (cardCount === 16) board.style.gridTemplateColumns = "repeat(6, 1fr)";
  else if (cardCount === 18) board.style.gridTemplateColumns = "repeat(6, 1fr)";
  else if (cardCount === 20) board.style.gridTemplateColumns = "repeat(6, 1fr)";
}

/* =============================
   START LEVEL
============================= */
function startLevel() {
  board.innerHTML = "";
  firstCard = null;
  lock = false;

  levelScore = 0;
  scoreBox.textContent = score;

  const cardCount = LEVELS[currentLevel].cards;
  setGrid(cardCount);

  const needed = cardCount / 2;

  // 1. Acak daftar gambar
  let selection = shuffle([...allImages]).slice(0, needed);

  // 2. Gandakan & ACACAK POSISI
  let cards = shuffle([...selection, ...selection]);

  // 3. Generate kartu
  cards.forEach(src => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.name = src;

    card.innerHTML = `
      <div class="card-back"></div>
      <div class="card-front" style="background-image: url('${src}')"></div>
    `;

    card.addEventListener("click", () => flip(card));
    board.appendChild(card);
  });

  levelBox.textContent = currentLevel + 1;
  startTimer();
}

/* =============================
   TIMER
============================= */
function startTimer() {
  clearInterval(countdown);
  timer = LEVELS[currentLevel].time;
  timerBox.textContent = timer;

  countdown = setInterval(() => {
    timer--;
    timerBox.textContent = timer;

    if (timer <= 0) {
      clearInterval(countdown);
      endLevel(false);
    }
  }, 1000);
}

/* =============================
   FLIP LOGIC
============================= */
function flip(card) {
  if (lock || card.classList.contains("flipped")) return;

  // 🔊 SOUND FLIP
  playFlipSound();

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  lock = true;

  setTimeout(() => {
    if (firstCard.dataset.name === card.dataset.name) {
      // Score total tetap naik
      score++;
      scoreBox.textContent = score;

      // Score khusus level
      levelScore++;

      const totalPairs = LEVELS[currentLevel].cards / 2;

      if (levelScore === totalPairs) {
        clearInterval(countdown);
        endLevel(true);
      }

    } else {
      firstCard.classList.remove("flipped");
      card.classList.remove("flipped");
    }

    firstCard = null;
    lock = false;
  }, 650);
}


/* =============================
   END LEVEL
============================= */
function endLevel(win) {

  const lastLevel = LEVELS.length - 1;

  // LEVEL TERAKHIR (LEVEL 9)
  if (win && currentLevel === lastLevel) {
      popup.style.display = "flex";
      popupText.textContent = "🎉 Congrats! You're a REAL DATAPUNK!";
      nextBtn.style.display = "none";
      restartBtn.style.display = "block";
      return; 
  }

  // LEVEL BIASA
  popup.style.display = "flex";

  if (win) {
    popupText.textContent = "Level Complete!";
    nextBtn.style.display = "block";
  } else {
    popupText.textContent = "Time's Up! Try Again?";
    nextBtn.style.display = "none";
  }

  restartBtn.style.display = "block";
}


nextBtn.onclick = () => {
  popup.style.display = "none";
  currentLevel++;

  startLevel();
};


restartBtn.onclick = () => {
  popup.style.display = "none";

  currentLevel = 0;      
  score = 0;             
  scoreBox.textContent = score;

  startLevel();
};


document.getElementById("startBtn").onclick = () => {
  document.getElementById("landing").style.display = "none";

  document.getElementById("gameBoard").style.display = "grid";

  startLevel();
};


document.getElementById("backHomeBtn").onclick = () => {

    document.getElementById("landing").style.display = "flex";

    document.getElementById("gameBoard").innerHTML = "";
    document.getElementById("gameBoard").style.display = "none";

    score = 0;
    currentLevel = 0;

    document.getElementById("score").textContent = 0;
    document.getElementById("timer").textContent = LEVELS[0].time;
    document.getElementById("level").textContent = 1;

    document.getElementById("popup").style.display = "none";
};

/* =============================
   WALLET CONNECT
============================= */
document.getElementById("connectBtn").onclick = async () => {
  if (!window.ethereum) return alert("MetaMask tidak ditemukan!");

  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const acc = accounts[0];

  document.getElementById("connectBtn").style.display = "none";

  const info = document.getElementById("walletInfo");
  info.style.display = "block";
  info.textContent = acc.slice(0, 6) + "..." + acc.slice(-4);
};



/* =============================
   START GAME
============================= */
startLevel();
