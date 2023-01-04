import GameBoard from "./gameboard";
import Ship from "./ship";

function Player(name, computer = false) {
    this.name = name;
    this.board = new GameBoard();

    this.ships = [
        new Ship(1),
        new Ship(2),
        new Ship(3),
        new Ship(4),
        new Ship(5),
    ];

    if (computer) {
        this.randomPlay = (board) => {
            let validMove = false;
            while (!validMove) {
                const randomX = Math.floor(Math.random() * 10);
                const randomY = Math.floor(Math.random() * 10);
                const shot = board.receiveAttack(randomX, randomY);
                if (shot !== false) {
                    validMove = true;
                    return { x: randomX, y: randomY, result: shot };
                }
            }
        };
    } else {
        this.shoot = (board, x, y) => {
            return board.receiveAttack(x, y);
        };
    }

    this.placeShipsRandomly = () => {
        this.board.placeRandomly(this.ships);
    };
}

export default Player;
