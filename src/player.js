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

    function randomPlay(board) {
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
    }
    if (computer) {
        const _firstHit = { x: null, y: null };
        const _lastHit = { x: null, y: null };
        let _hitDirection;
        let _directionSwitched = false;
        this.shoot = (board) => {
            if (_lastHit.x !== null && _lastHit.y !== null) {
                if (!_hitDirection) {
                    let validMove = false;
                    const posibleMoves = [
                        [1, 0, "right"],
                        [0, -1, "up"],
                        [-1, 0, "left"],
                        [0, 1, "down"],
                    ];
                    while (!validMove) {
                        const move = posibleMoves.shift();
                        if (!move) {
                            return _randomShot();
                        }
                        const nextShot = {
                            x: _lastHit.x + move[0],
                            y: _lastHit.y + move[1],
                        };
                        const shot = board.receiveAttack(
                            nextShot.x,
                            nextShot.y
                        );
                        if (shot === "hit") {
                            _lastHit.x = nextShot.x;
                            _lastHit.y = nextShot.y;
                            _hitDirection = move[2];
                        }
                        if (shot !== false) {
                            validMove = true;
                            return {
                                x: nextShot.x,
                                y: nextShot.y,
                                result: shot,
                            };
                        }
                    }
                } else {
                    const nextShot = { x: _lastHit.x, y: _lastHit.y };
                    switch (_hitDirection) {
                        case "right":
                            nextShot.x++;
                            break;
                        case "up":
                            nextShot.y--;
                            break;
                        case "left":
                            nextShot.x--;
                            break;
                        case "down":
                            nextShot.y++;
                            break;
                        default:
                            break;
                    }

                    const shot = board.receiveAttack(nextShot.x, nextShot.y);
                    if (shot === "hit") {
                        _lastHit.x = nextShot.x;
                        _lastHit.y = nextShot.y;
                        _directionSwitched = false;
                    } else if (shot === false) {
                        if (!_directionSwitched) {
                            switchDirection();
                            return this.shoot(board);
                        }
                        return _randomShot();
                    } else {
                        // switch direction
                        if (_firstHit.x !== null && _firstHit.y !== null) {
                            switchDirection();
                        } else {
                            _lastHit.x = null;
                            _lastHit.y = null;
                        }
                    }

                    return {
                        x: nextShot.x,
                        y: nextShot.y,
                        result: shot,
                    };
                }
            } else {
                return _randomShot();
            }
            function switchDirection() {
                switch (_hitDirection) {
                    case "right":
                        _hitDirection = "left";
                        break;
                    case "up":
                        _hitDirection = "down";
                        break;
                    case "left":
                        _hitDirection = "right";
                        break;
                    case "down":
                        _hitDirection = "up";
                        break;
                    default:
                        break;
                }
                _lastHit.x = _firstHit.x;
                _lastHit.y = _firstHit.y;
                _firstHit.x = null;
                _firstHit.y = null;
                _directionSwitched = true;
            }
            function _randomShot() {
                _hitDirection = null;
                const shot = randomPlay(board);
                if (shot.result === "hit") {
                    _firstHit.x = shot.x;
                    _firstHit.y = shot.y;
                    _lastHit.x = shot.x;
                    _lastHit.y = shot.y;
                }
                return shot;
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
