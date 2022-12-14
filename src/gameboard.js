function GameBoard() {
    const board = [];
    for (let i = 0; i < 10; i++) {
        board[i] = [];
        for (let j = 0; j < 10; j++) {
            board[i].push({ isHit: false });
        }
    }

    this.placeShip = (ship, x, y, direction) => {
        if (ship.isPlaced) return "already placed";
        if (!checkPlacement(ship, x, y, direction)) return "invalid placement";
        for (let i = 0; i < ship.length; i++) {
            board[x + (direction === "horizontal" ? i : 0)][
                y + (direction === "vertical" ? i : 0)
            ].ship = ship;
        }
        ship.isPlaced = true;
    };

    this.placeRandomly = (ships) => {
        for (let ship of ships) {
            while (!ship.isPlaced) {
                const randomX = Math.floor(Math.random() * 10);
                const randomY = Math.floor(Math.random() * 10);
                const randomDirection =
                    Math.random() < 0.5 ? "horizontal" : "vertical";
                this.placeShip(ship, randomX, randomY, randomDirection);
            }
        }
    };

    this.receiveAttack = (x, y) => {
        if (x < 0 || x > 9 || y < 0 || y > 9) return false;
        const field = board[x][y];
        if (field.isHit) return false;
        field.isHit = true;
        if (field.ship) {
            field.ship.hit();
            return "hit";
        }
        return "miss";
    };

    this.gameOver = () => {
        const unsunkShips = board.some((row) => {
            return row.some((field) => {
                if (field.ship) {
                    return !field.ship.isSunk();
                }
            });
        });
        if (unsunkShips) return false;
        return true;
    };

    function checkPlacement(ship, x, y, direction) {
        if (x > 9 || y > 9) return false;
        if (direction === "horizontal") {
            if (x + ship.length > 10 || y > 9) return false;
            for (let i = 0; i < ship.length; i++) {
                if (board[x + i][y].ship) return false;
            }
        } else if (direction === "vertical") {
            if (y + ship.length > 10) return false;
            for (let i = 0; i < ship.length; i++) {
                if (board[x][y + i].ship) return false;
            }
        }
        if (checkAround(ship, x, y, direction) === false) return false;
        return true;
        function checkAround(ship, x, y, direction) {
            if (direction === "horizontal") {
                if (
                    (x > 0 && board[x - 1][y].ship) ||
                    (x + ship.length < 10 && board[x + ship.length][y].ship)
                )
                    return false;
                for (let i = -1; i <= ship.length; i++) {
                    if (x + i >= 0 && x + i < 10) {
                        if (
                            (y - 1 >= 0 && board[x + i][y - 1].ship) ||
                            (y + 1 < 10 && board[x + i][y + 1].ship)
                        )
                            return false;
                    }
                }
            } else if (direction === "vertical") {
                if (
                    (y > 0 && board[x][y - 1].ship) ||
                    (y + ship.length < 10 && board[x][y + ship.length].ship)
                )
                    return false;
                for (let i = -1; i <= ship.length; i++) {
                    if (y + i >= 0 && y + i < 10) {
                        if (
                            (x - 1 >= 0 && board[x - 1][y + i].ship) ||
                            (x + 1 < 10 && board[x + 1][y + i].ship)
                        )
                            return false;
                    }
                }
            }

            return true;
        }
    }

    this.log = () => {
        for (let i = 0; i < 10; i++) {
            let string = "|";
            for (let j = 0; j < 10; j++) {
                string += ` ${
                    board[j][i].ship?.name.slice(0, 7) || "       "
                } |`;
            }
            console.log(string);
            // console.log("-".repeat(100))
        }
    };
    this.fields = board;
}

export default GameBoard;
