const canvas = document.getElementById("gameCanvas");

const ctx = canvas.getContext("2d");

const refreshButton = document.getElementById("refresh");

canvas.width = 300;
canvas.height = 300;

const cellSize = canvas.width / 3;
let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let currentPlayer = "X";
let gameActive = true;
let firstClick = true;

// پنهان کردن دکمه شروع مجدد در ابتدا
refreshButton.style.display = "none";

// رویداد کلیک برای برد بازی
canvas.addEventListener("click", handleClick);
refreshButton.addEventListener("click", () => location.reload());

drawBoard();

// رسم جدول بازی
function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;

  for (let i = 1; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvas.width, i * cellSize);
    ctx.stroke();
  }
  drawMarks();
}

// نمایش X و O در جدول
function drawMarks() {
  ctx.font = "50px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] !== "") {
        ctx.fillText(
          board[row][col],
          col * cellSize + cellSize / 2,
          row * cellSize + cellSize / 2
        );
      }
    }
  }
}

// مدیریت کلیک روی برد
function handleClick(event) {
  if (!gameActive) return;

  if (firstClick) {
    refreshButton.style.display = "block";
    firstClick = false;
  }

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);

  if (board[row][col] === "") {
    board[row][col] = currentPlayer;
    drawBoard();

    const winInfo = checkWinner(currentPlayer);
    if (winInfo) {
      drawWinningLine(winInfo);
      setTimeout(() => alert(`${currentPlayer} wins!`), 500);
      gameActive = false;
      return;
    }

    if (board.flat().every((cell) => cell !== "")) {
      setTimeout(() => alert("It's a draw!"), 10);
      gameActive = false;
      return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
}

// بررسی برنده بازی
function checkWinner(player) {
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] === player &&
      board[i][1] === player &&
      board[i][2] === player
    )
      return [
        [i, 0],
        [i, 1],
        [i, 2],
      ];
    if (
      board[0][i] === player &&
      board[1][i] === player &&
      board[2][i] === player
    )
      return [
        [0, i],
        [1, i],
        [2, i],
      ];
  }

  if (
    board[0][0] === player &&
    board[1][1] === player &&
    board[2][2] === player
  )
    return [
      [0, 0],
      [1, 1],
      [2, 2],
    ];
  if (
    board[0][2] === player &&
    board[1][1] === player &&
    board[2][0] === player
  )
    return [
      [0, 2],
      [1, 1],
      [2, 0],
    ];

  return null;
}

// کشیدن خط روی خانه‌های برنده
function drawWinningLine(cells) {
  ctx.strokeStyle = "red";
  ctx.lineWidth = 5;
  ctx.beginPath();

  const startX = cells[0][1] * cellSize + cellSize / 2;
  const startY = cells[0][0] * cellSize + cellSize / 2;
  const endX = cells[2][1] * cellSize + cellSize / 2;
  const endY = cells[2][0] * cellSize + cellSize / 2;

  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}
