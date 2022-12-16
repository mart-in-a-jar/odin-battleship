import GameBoard from "./gameboard";

function Player(name, computer = false) {
    this.name = name;
    this.board = new GameBoard();

    if (computer) {
        this.randomPlay = (board) => {
            let validMove = false;
            while (!validMove) {
                const randomX = Math.floor(Math.random() * 10);
                const randomY = Math.floor(Math.random() * 10);
                if (board.receiveAttack(randomX, randomY) !== false)
                    validMove = true;
            }
        };
    } else {
        this.shoot = (board, x, y) => {
            board.receiveAttack(x, y);
        };
    }
}

export default Player;
