const boardContainer = document.getElementById("boardContainer");
const winnerAnnounce = document.getElementById("winnerAnnounce")
const startButton = document.getElementById("start")
const restartButton = document.getElementById("restart")

let player1;
let player2;
let turnCount = 1
let movesCount = 0

function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = []

    for (let i = 0; i < rows; i++) {
        for (let y = 0; y < columns; y++) {
            board.push([i,y]);
            const box = document.createElement("div");
            box.classList.add("box");
            box.id = `${i},${y}`;
            box.addEventListener("click", function() {
                // .map(number), Look at this array of text strings like ["0", "1"],
                // convert every single one of them into a real number, and hand me back the fresh number array.
                const currentCoord = this.id.split(",").map(Number);
                if (turnCount % 2 === 0){
                    this.innerHTML = "X";
                    turnCount += 1
                    player2.addMove(currentCoord);
                    gameLogic(player1, player2);
                } else {
                    this.innerHTML = "O";
                    turnCount += 1
                    player1.addMove(currentCoord);
                    gameLogic(player1, player2);
                }
                return box.id
            });
            boardContainer.appendChild(box);
        }
    }
    return board;
};

function createPlayers(name){
    const player = {
        name: name,
        moves: [],
        addMove: (move) => player.moves.push(move)
    }

    return player;
}

function gameLogic(player1, player2){
    movesCount += 1
    const winningCombos = [
        // horizontals
        [[0, 0], [0, 1], [0, 2]], 
        [[1, 0], [1, 1], [1, 2]], 
        [[2, 0], [2, 1], [2, 2]], 
        
        // verticals
        [[0, 0], [1, 0], [2, 0]], 
        [[0, 1], [1, 1], [2, 1]], 
        [[0, 2], [1, 2], [2, 2]], 

        // diagonals
        [[0, 0], [1, 1], [2, 2]], 
        [[0, 2], [1, 1], [2, 0]]  
    ];

    // check if have this move, return true if have
    function hasMoves(moves, r, c) {
        for (m of moves) {
            if (m[0] === r && m[1] === c) {
                return true;
            }
        }
        return false;
    }

    const checkWin = (player) => {
        return winningCombos.some(combo => {
                let coord1 = combo[0];
                let coord2 = combo[1];
                let coord3 = combo[2];

                return (hasMoves(player.moves, coord1[0], coord1[1]) &&
                        hasMoves(player.moves, coord2[0], coord2[1]) &&
                        hasMoves(player.moves, coord3[0], coord3[1]))
            })
    }

    const player1IsWinner = checkWin(player1);
    const player2IsWinner = checkWin(player2);

    if (player1IsWinner) {
        winnerAnnounce.textContent = `${player1.name} is the winner!`;
        winnerAnnounce.style.display = "flex";
        boardContainer.style.pointerEvents = "none";
    } else if (player2IsWinner) {
        winnerAnnounce.textContent =`${player2.name} is the winner!`;
        winnerAnnounce.style.display = "flex";
        boardContainer.style.pointerEvents = "none";
    } else if (movesCount === 9) {
        winnerAnnounce.textContent =`It's a tie!`;
        winnerAnnounce.style.display = "flex";
        boardContainer.style.pointerEvents = "none";
    }
}

function startGame() {
    const player1Name = prompt("What's your name first player?");
    const player2Name = prompt("What's your name second player?");
    player1 = createPlayers(player1Name);
    player2 = createPlayers(player2Name);
    gameBoard();
}

startButton.addEventListener("click", () => {
    boardContainer.innerHTML = "";
    boardContainer.style.display = "grid";
    document.querySelector(".buttonGroup").classList.remove("initial");
    startButton.style.display = "none"
    startGame();
});

restartButton.addEventListener("click", () => {
    boardContainer.innerHTML = "";
    boardContainer.style.display = "grid";
    boardContainer.style.pointerEvents = "auto";
    winnerAnnounce.textContent = "";
    movesCount = 0;
    startGame();
});

