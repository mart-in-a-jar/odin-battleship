import Player from "./player";

function makeBoard() {
    const board = [];

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const field = document.createElement("div");
            field.dataset.xCoord = j;
            field.dataset.yCoord = i;
            field.classList.add("board", "field");

            board.push(field);
        }
    }

    return board;
}

function drawBoard(board, player) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("board", player);
    for (let field of board) {
        wrapper.appendChild(field);

        //
        // field.textContent = `${field.dataset.xCoord},${field.dataset.yCoord}`;
    }
    document.querySelector(".boards").appendChild(wrapper);
    return wrapper;
}

const playerFields = makeBoard();
const computerFields = makeBoard();

const resultText = document.querySelector(".result");
const playerBoard = drawBoard(playerFields, "player");
const computerBoard = drawBoard(computerFields, "computer");
const playerFieldIcons = playerBoard.querySelectorAll(".field");
const computerFieldIcons = computerBoard.querySelectorAll(".field");
const restartButton = document.querySelector("#restart");

let player, computer;

function playerSetup() {
    player = new Player("You");
    computer = new Player("Computer", true);
    computer.placeShipsRandomly();
    player.placeShipsRandomly();
}

function handleShot(field) {
    field = field.target;
    const result = player.shoot(
        computer.board,
        +field.dataset.xCoord,
        +field.dataset.yCoord
    );
    field.removeEventListener("click", handleShot);
    styleShots(field, result);
    if (computer.board.gameOver()) {
        return handleGameOver("win");
    }
    computerShoot();
}

function computerShoot() {
    const result = computer.randomPlay(player.board);
    const field = document.querySelector(
        `.player [data-x-coord="${result.x}"][data-y-coord="${result.y}"]`
    );
    styleShots(field, result.result);
    if (player.board.gameOver()) {
        return handleGameOver("loss");
    }
}

function handleGameOver(result) {
    resultText.textContent = `You ${result === "win" ? "won" : "lost"}!`;
    computerBoard.classList.add("game-over");
}

function styleShots(field, result) {
    if (result === "hit") {
        field.classList.add("hit");
    } else if (result === "miss") {
        field.classList.add("miss");
    }
}

function addShotListeners() {
    for (let field of computerFieldIcons) {
        field.addEventListener("click", handleShot);
    }
}

function initialize() {
    playerSetup();
    addShotListeners();
    for (let field of document.querySelectorAll(".field")) {
        field.classList.remove("hit");
        field.classList.remove("miss");
    }
    computerBoard.classList.remove("game-over");
    resultText.textContent = "";
    peekBoats("debug");
}

restartButton.addEventListener("click", initialize);

function peekBoats(debug) {
    if (debug === "debug") {
        for (let field of computerFieldIcons) {
            if (
                computer.board.fields[field.dataset.xCoord][
                    field.dataset.yCoord
                ].ship
            ) {
                field.textContent = "X";
            } else field.textContent = "";
        }
    }
    for (let field of playerFieldIcons) {
        if (
            player.board.fields[field.dataset.xCoord][field.dataset.yCoord].ship
        ) {
            field.textContent = "X";
        } else field.textContent = "";
    }
}

export { initialize, peekBoats };
