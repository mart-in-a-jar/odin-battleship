/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GameBoard);


/***/ }),

/***/ "./src/gui.js":
/*!********************!*\
  !*** ./src/gui.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initialize": () => (/* binding */ initialize)
/* harmony export */ });
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ "./src/player.js");


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
    player = new _player__WEBPACK_IMPORTED_MODULE_0__["default"]("You");
    computer = new _player__WEBPACK_IMPORTED_MODULE_0__["default"]("Computer", true);
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
    const result = computer.shoot(player.board);
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
        field.classList.add("hit", "ship");
        field.innerHTML = "&times;";
    } else if (result === "miss") {
        field.classList.add("miss");
        field.innerHTML = "&#9679;";
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
        field.classList.remove("ship");
        field.innerHTML = "";
    }
    computerBoard.classList.remove("game-over");
    resultText.textContent = "";
    // peekBoats("debug");
    peekBoats();
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
                field.classList.add("ship");
            } else field.classList.remove("ship");
        }
    }
    for (let field of playerFieldIcons) {
        if (
            player.board.fields[field.dataset.xCoord][field.dataset.yCoord].ship
        ) {
            field.classList.add("ship");
        } else field.classList.remove("ship");
    }
}




/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ship */ "./src/ship.js");



function Player(name, computer = false) {
    this.name = name;
    this.board = new _gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]();

    this.ships = [
        new _ship__WEBPACK_IMPORTED_MODULE_1__["default"](1),
        new _ship__WEBPACK_IMPORTED_MODULE_1__["default"](2),
        new _ship__WEBPACK_IMPORTED_MODULE_1__["default"](3),
        new _ship__WEBPACK_IMPORTED_MODULE_1__["default"](4),
        new _ship__WEBPACK_IMPORTED_MODULE_1__["default"](5),
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);


/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function Ship(length) {
    this.hits = 0;
    this.length = length;
    this.name = _getName();
    function _getName() {
        switch (length) {
            case 5:
                return "Aircraft carrier";
            case 4:
                return "Battleship";
            case 3:
                return "Destroyer";
            case 2:
                return "Submarine";
            case 1:
                return "Patrol boat";
            default:
                break;
        }
    }
    this.isSunk = function () {
        return this.hits >= this.length;
    };
    this.hit = function () {
        this.hits++;
    };

    this.isPlaced = false;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ship);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _gui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gui */ "./src/gui.js");


(0,_gui__WEBPACK_IMPORTED_MODULE_0__.initialize)();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QSw0QkFBNEI7QUFDNUIsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQix1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsTUFBTSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNwS3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpRUFBZSxJQUFJLEVBQUM7Ozs7Ozs7VUM5QnBCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNObUM7O0FBRW5DLGdEQUFVIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvLi9zcmMvZ3VpLmpzIiwid2VicGFjazovL29kaW4tYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL29kaW4tYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwLy4vc3JjL2FwcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBHYW1lQm9hcmQoKSB7XG4gICAgY29uc3QgYm9hcmQgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgYm9hcmRbaV0gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgICAgICBib2FyZFtpXS5wdXNoKHsgaXNIaXQ6IGZhbHNlIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5wbGFjZVNoaXAgPSAoc2hpcCwgeCwgeSwgZGlyZWN0aW9uKSA9PiB7XG4gICAgICAgIGlmIChzaGlwLmlzUGxhY2VkKSByZXR1cm4gXCJhbHJlYWR5IHBsYWNlZFwiO1xuICAgICAgICBpZiAoIWNoZWNrUGxhY2VtZW50KHNoaXAsIHgsIHksIGRpcmVjdGlvbikpIHJldHVybiBcImludmFsaWQgcGxhY2VtZW50XCI7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYm9hcmRbeCArIChkaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiID8gaSA6IDApXVtcbiAgICAgICAgICAgICAgICB5ICsgKGRpcmVjdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiID8gaSA6IDApXG4gICAgICAgICAgICBdLnNoaXAgPSBzaGlwO1xuICAgICAgICB9XG4gICAgICAgIHNoaXAuaXNQbGFjZWQgPSB0cnVlO1xuICAgIH07XG5cbiAgICB0aGlzLnBsYWNlUmFuZG9tbHkgPSAoc2hpcHMpID0+IHtcbiAgICAgICAgZm9yIChsZXQgc2hpcCBvZiBzaGlwcykge1xuICAgICAgICAgICAgd2hpbGUgKCFzaGlwLmlzUGxhY2VkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmFuZG9tWCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgICAgICAgICAgICBjb25zdCByYW5kb21ZID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJhbmRvbURpcmVjdGlvbiA9XG4gICAgICAgICAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgPCAwLjUgPyBcImhvcml6b250YWxcIiA6IFwidmVydGljYWxcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYWNlU2hpcChzaGlwLCByYW5kb21YLCByYW5kb21ZLCByYW5kb21EaXJlY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMucmVjZWl2ZUF0dGFjayA9ICh4LCB5KSA9PiB7XG4gICAgICAgIGlmICh4IDwgMCB8fCB4ID4gOSB8fCB5IDwgMCB8fCB5ID4gOSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBjb25zdCBmaWVsZCA9IGJvYXJkW3hdW3ldO1xuICAgICAgICBpZiAoZmllbGQuaXNIaXQpIHJldHVybiBmYWxzZTtcbiAgICAgICAgZmllbGQuaXNIaXQgPSB0cnVlO1xuICAgICAgICBpZiAoZmllbGQuc2hpcCkge1xuICAgICAgICAgICAgZmllbGQuc2hpcC5oaXQoKTtcbiAgICAgICAgICAgIHJldHVybiBcImhpdFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIm1pc3NcIjtcbiAgICB9O1xuXG4gICAgdGhpcy5nYW1lT3ZlciA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgdW5zdW5rU2hpcHMgPSBib2FyZC5zb21lKChyb3cpID0+IHtcbiAgICAgICAgICAgIHJldHVybiByb3cuc29tZSgoZmllbGQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZmllbGQuc2hpcCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIWZpZWxkLnNoaXAuaXNTdW5rKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodW5zdW5rU2hpcHMpIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrUGxhY2VtZW50KHNoaXAsIHgsIHksIGRpcmVjdGlvbikge1xuICAgICAgICBpZiAoeCA+IDkgfHwgeSA+IDkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgICAgICAgIGlmICh4ICsgc2hpcC5sZW5ndGggPiAxMCB8fCB5ID4gOSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJvYXJkW3ggKyBpXVt5XS5zaGlwKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSBcInZlcnRpY2FsXCIpIHtcbiAgICAgICAgICAgIGlmICh5ICsgc2hpcC5sZW5ndGggPiAxMCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJvYXJkW3hdW3kgKyBpXS5zaGlwKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoZWNrQXJvdW5kKHNoaXAsIHgsIHksIGRpcmVjdGlvbikgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBmdW5jdGlvbiBjaGVja0Fyb3VuZChzaGlwLCB4LCB5LCBkaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAoeCA+IDAgJiYgYm9hcmRbeCAtIDFdW3ldLnNoaXApIHx8XG4gICAgICAgICAgICAgICAgICAgICh4ICsgc2hpcC5sZW5ndGggPCAxMCAmJiBib2FyZFt4ICsgc2hpcC5sZW5ndGhdW3ldLnNoaXApXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IC0xOyBpIDw9IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHggKyBpID49IDAgJiYgeCArIGkgPCAxMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICh5IC0gMSA+PSAwICYmIGJvYXJkW3ggKyBpXVt5IC0gMV0uc2hpcCkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoeSArIDEgPCAxMCAmJiBib2FyZFt4ICsgaV1beSArIDFdLnNoaXApXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IFwidmVydGljYWxcIikge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgKHkgPiAwICYmIGJvYXJkW3hdW3kgLSAxXS5zaGlwKSB8fFxuICAgICAgICAgICAgICAgICAgICAoeSArIHNoaXAubGVuZ3RoIDwgMTAgJiYgYm9hcmRbeF1beSArIHNoaXAubGVuZ3RoXS5zaGlwKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAtMTsgaSA8PSBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh5ICsgaSA+PSAwICYmIHkgKyBpIDwgMTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoeCAtIDEgPj0gMCAmJiBib2FyZFt4IC0gMV1beSArIGldLnNoaXApIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHggKyAxIDwgMTAgJiYgYm9hcmRbeCArIDFdW3kgKyBpXS5zaGlwKVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmxvZyA9ICgpID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgc3RyaW5nID0gXCJ8XCI7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgICAgICAgICBzdHJpbmcgKz0gYCAke1xuICAgICAgICAgICAgICAgICAgICBib2FyZFtqXVtpXS5zaGlwPy5uYW1lLnNsaWNlKDAsIDcpIHx8IFwiICAgICAgIFwiXG4gICAgICAgICAgICAgICAgfSB8YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0cmluZyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi1cIi5yZXBlYXQoMTAwKSlcbiAgICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5maWVsZHMgPSBib2FyZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZUJvYXJkO1xuIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi9wbGF5ZXJcIjtcblxuZnVuY3Rpb24gbWFrZUJvYXJkKCkge1xuICAgIGNvbnN0IGJvYXJkID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgICAgICBjb25zdCBmaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBmaWVsZC5kYXRhc2V0LnhDb29yZCA9IGo7XG4gICAgICAgICAgICBmaWVsZC5kYXRhc2V0LnlDb29yZCA9IGk7XG4gICAgICAgICAgICBmaWVsZC5jbGFzc0xpc3QuYWRkKFwiYm9hcmRcIiwgXCJmaWVsZFwiKTtcblxuICAgICAgICAgICAgYm9hcmQucHVzaChmaWVsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYm9hcmQ7XG59XG5cbmZ1bmN0aW9uIGRyYXdCb2FyZChib2FyZCwgcGxheWVyKSB7XG4gICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKFwiYm9hcmRcIiwgcGxheWVyKTtcbiAgICBmb3IgKGxldCBmaWVsZCBvZiBib2FyZCkge1xuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGZpZWxkKTtcbiAgICB9XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ib2FyZHNcIikuYXBwZW5kQ2hpbGQod3JhcHBlcik7XG4gICAgcmV0dXJuIHdyYXBwZXI7XG59XG5cbmNvbnN0IHBsYXllckZpZWxkcyA9IG1ha2VCb2FyZCgpO1xuY29uc3QgY29tcHV0ZXJGaWVsZHMgPSBtYWtlQm9hcmQoKTtcblxuY29uc3QgcmVzdWx0VGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmVzdWx0XCIpO1xuY29uc3QgcGxheWVyQm9hcmQgPSBkcmF3Qm9hcmQocGxheWVyRmllbGRzLCBcInBsYXllclwiKTtcbmNvbnN0IGNvbXB1dGVyQm9hcmQgPSBkcmF3Qm9hcmQoY29tcHV0ZXJGaWVsZHMsIFwiY29tcHV0ZXJcIik7XG5jb25zdCBwbGF5ZXJGaWVsZEljb25zID0gcGxheWVyQm9hcmQucXVlcnlTZWxlY3RvckFsbChcIi5maWVsZFwiKTtcbmNvbnN0IGNvbXB1dGVyRmllbGRJY29ucyA9IGNvbXB1dGVyQm9hcmQucXVlcnlTZWxlY3RvckFsbChcIi5maWVsZFwiKTtcbmNvbnN0IHJlc3RhcnRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Jlc3RhcnRcIik7XG5cbmxldCBwbGF5ZXIsIGNvbXB1dGVyO1xuXG5mdW5jdGlvbiBwbGF5ZXJTZXR1cCgpIHtcbiAgICBwbGF5ZXIgPSBuZXcgUGxheWVyKFwiWW91XCIpO1xuICAgIGNvbXB1dGVyID0gbmV3IFBsYXllcihcIkNvbXB1dGVyXCIsIHRydWUpO1xuICAgIGNvbXB1dGVyLnBsYWNlU2hpcHNSYW5kb21seSgpO1xuICAgIHBsYXllci5wbGFjZVNoaXBzUmFuZG9tbHkoKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlU2hvdChmaWVsZCkge1xuICAgIGZpZWxkID0gZmllbGQudGFyZ2V0O1xuICAgIGNvbnN0IHJlc3VsdCA9IHBsYXllci5zaG9vdChcbiAgICAgICAgY29tcHV0ZXIuYm9hcmQsXG4gICAgICAgICtmaWVsZC5kYXRhc2V0LnhDb29yZCxcbiAgICAgICAgK2ZpZWxkLmRhdGFzZXQueUNvb3JkXG4gICAgKTtcbiAgICBmaWVsZC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlU2hvdCk7XG4gICAgc3R5bGVTaG90cyhmaWVsZCwgcmVzdWx0KTtcbiAgICBpZiAoY29tcHV0ZXIuYm9hcmQuZ2FtZU92ZXIoKSkge1xuICAgICAgICByZXR1cm4gaGFuZGxlR2FtZU92ZXIoXCJ3aW5cIik7XG4gICAgfVxuICAgIGNvbXB1dGVyU2hvb3QoKTtcbn1cblxuZnVuY3Rpb24gY29tcHV0ZXJTaG9vdCgpIHtcbiAgICBjb25zdCByZXN1bHQgPSBjb21wdXRlci5zaG9vdChwbGF5ZXIuYm9hcmQpO1xuICAgIGNvbnN0IGZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYC5wbGF5ZXIgW2RhdGEteC1jb29yZD1cIiR7cmVzdWx0Lnh9XCJdW2RhdGEteS1jb29yZD1cIiR7cmVzdWx0Lnl9XCJdYFxuICAgICk7XG4gICAgc3R5bGVTaG90cyhmaWVsZCwgcmVzdWx0LnJlc3VsdCk7XG4gICAgaWYgKHBsYXllci5ib2FyZC5nYW1lT3ZlcigpKSB7XG4gICAgICAgIHJldHVybiBoYW5kbGVHYW1lT3ZlcihcImxvc3NcIik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVHYW1lT3ZlcihyZXN1bHQpIHtcbiAgICByZXN1bHRUZXh0LnRleHRDb250ZW50ID0gYFlvdSAke3Jlc3VsdCA9PT0gXCJ3aW5cIiA/IFwid29uXCIgOiBcImxvc3RcIn0hYDtcbiAgICBjb21wdXRlckJvYXJkLmNsYXNzTGlzdC5hZGQoXCJnYW1lLW92ZXJcIik7XG59XG5cbmZ1bmN0aW9uIHN0eWxlU2hvdHMoZmllbGQsIHJlc3VsdCkge1xuICAgIGlmIChyZXN1bHQgPT09IFwiaGl0XCIpIHtcbiAgICAgICAgZmllbGQuY2xhc3NMaXN0LmFkZChcImhpdFwiLCBcInNoaXBcIik7XG4gICAgICAgIGZpZWxkLmlubmVySFRNTCA9IFwiJnRpbWVzO1wiO1xuICAgIH0gZWxzZSBpZiAocmVzdWx0ID09PSBcIm1pc3NcIikge1xuICAgICAgICBmaWVsZC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcbiAgICAgICAgZmllbGQuaW5uZXJIVE1MID0gXCImIzk2Nzk7XCI7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhZGRTaG90TGlzdGVuZXJzKCkge1xuICAgIGZvciAobGV0IGZpZWxkIG9mIGNvbXB1dGVyRmllbGRJY29ucykge1xuICAgICAgICBmaWVsZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlU2hvdCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIHBsYXllclNldHVwKCk7XG4gICAgYWRkU2hvdExpc3RlbmVycygpO1xuICAgIGZvciAobGV0IGZpZWxkIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmllbGRcIikpIHtcbiAgICAgICAgZmllbGQuY2xhc3NMaXN0LnJlbW92ZShcImhpdFwiKTtcbiAgICAgICAgZmllbGQuY2xhc3NMaXN0LnJlbW92ZShcIm1pc3NcIik7XG4gICAgICAgIGZpZWxkLmNsYXNzTGlzdC5yZW1vdmUoXCJzaGlwXCIpO1xuICAgICAgICBmaWVsZC5pbm5lckhUTUwgPSBcIlwiO1xuICAgIH1cbiAgICBjb21wdXRlckJvYXJkLmNsYXNzTGlzdC5yZW1vdmUoXCJnYW1lLW92ZXJcIik7XG4gICAgcmVzdWx0VGV4dC50ZXh0Q29udGVudCA9IFwiXCI7XG4gICAgLy8gcGVla0JvYXRzKFwiZGVidWdcIik7XG4gICAgcGVla0JvYXRzKCk7XG59XG5cbnJlc3RhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGluaXRpYWxpemUpO1xuXG5mdW5jdGlvbiBwZWVrQm9hdHMoZGVidWcpIHtcbiAgICBpZiAoZGVidWcgPT09IFwiZGVidWdcIikge1xuICAgICAgICBmb3IgKGxldCBmaWVsZCBvZiBjb21wdXRlckZpZWxkSWNvbnMpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBjb21wdXRlci5ib2FyZC5maWVsZHNbZmllbGQuZGF0YXNldC54Q29vcmRdW1xuICAgICAgICAgICAgICAgICAgICBmaWVsZC5kYXRhc2V0LnlDb29yZFxuICAgICAgICAgICAgICAgIF0uc2hpcFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgZmllbGQuY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XG4gICAgICAgICAgICB9IGVsc2UgZmllbGQuY2xhc3NMaXN0LnJlbW92ZShcInNoaXBcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yIChsZXQgZmllbGQgb2YgcGxheWVyRmllbGRJY29ucykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBwbGF5ZXIuYm9hcmQuZmllbGRzW2ZpZWxkLmRhdGFzZXQueENvb3JkXVtmaWVsZC5kYXRhc2V0LnlDb29yZF0uc2hpcFxuICAgICAgICApIHtcbiAgICAgICAgICAgIGZpZWxkLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xuICAgICAgICB9IGVsc2UgZmllbGQuY2xhc3NMaXN0LnJlbW92ZShcInNoaXBcIik7XG4gICAgfVxufVxuXG5leHBvcnQgeyBpbml0aWFsaXplIH07XG4iLCJpbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5mdW5jdGlvbiBQbGF5ZXIobmFtZSwgY29tcHV0ZXIgPSBmYWxzZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5ib2FyZCA9IG5ldyBHYW1lQm9hcmQoKTtcblxuICAgIHRoaXMuc2hpcHMgPSBbXG4gICAgICAgIG5ldyBTaGlwKDEpLFxuICAgICAgICBuZXcgU2hpcCgyKSxcbiAgICAgICAgbmV3IFNoaXAoMyksXG4gICAgICAgIG5ldyBTaGlwKDQpLFxuICAgICAgICBuZXcgU2hpcCg1KSxcbiAgICBdO1xuXG4gICAgZnVuY3Rpb24gcmFuZG9tUGxheShib2FyZCkge1xuICAgICAgICBsZXQgdmFsaWRNb3ZlID0gZmFsc2U7XG4gICAgICAgIHdoaWxlICghdmFsaWRNb3ZlKSB7XG4gICAgICAgICAgICBjb25zdCByYW5kb21YID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgICAgICAgY29uc3QgcmFuZG9tWSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgICAgICAgIGNvbnN0IHNob3QgPSBib2FyZC5yZWNlaXZlQXR0YWNrKHJhbmRvbVgsIHJhbmRvbVkpO1xuICAgICAgICAgICAgaWYgKHNob3QgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRNb3ZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyB4OiByYW5kb21YLCB5OiByYW5kb21ZLCByZXN1bHQ6IHNob3QgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoY29tcHV0ZXIpIHtcbiAgICAgICAgY29uc3QgX2ZpcnN0SGl0ID0geyB4OiBudWxsLCB5OiBudWxsIH07XG4gICAgICAgIGNvbnN0IF9sYXN0SGl0ID0geyB4OiBudWxsLCB5OiBudWxsIH07XG4gICAgICAgIGxldCBfaGl0RGlyZWN0aW9uO1xuICAgICAgICBsZXQgX2RpcmVjdGlvblN3aXRjaGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2hvb3QgPSAoYm9hcmQpID0+IHtcbiAgICAgICAgICAgIGlmIChfbGFzdEhpdC54ICE9PSBudWxsICYmIF9sYXN0SGl0LnkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoIV9oaXREaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbGlkTW92ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb3NpYmxlTW92ZXMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICBbMSwgMCwgXCJyaWdodFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFswLCAtMSwgXCJ1cFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFstMSwgMCwgXCJsZWZ0XCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgWzAsIDEsIFwiZG93blwiXSxcbiAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCF2YWxpZE1vdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vdmUgPSBwb3NpYmxlTW92ZXMuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbW92ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfcmFuZG9tU2hvdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dFNob3QgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogX2xhc3RIaXQueCArIG1vdmVbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogX2xhc3RIaXQueSArIG1vdmVbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hvdCA9IGJvYXJkLnJlY2VpdmVBdHRhY2soXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNob3QueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2hvdC55XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNob3QgPT09IFwiaGl0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfbGFzdEhpdC54ID0gbmV4dFNob3QueDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfbGFzdEhpdC55ID0gbmV4dFNob3QueTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaGl0RGlyZWN0aW9uID0gbW92ZVsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzaG90ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkTW92ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogbmV4dFNob3QueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogbmV4dFNob3QueSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBzaG90LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXh0U2hvdCA9IHsgeDogX2xhc3RIaXQueCwgeTogX2xhc3RIaXQueSB9O1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKF9oaXREaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTaG90LngrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTaG90LnktLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNob3QueC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2hvdC55Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hvdCA9IGJvYXJkLnJlY2VpdmVBdHRhY2sobmV4dFNob3QueCwgbmV4dFNob3QueSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzaG90ID09PSBcImhpdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfbGFzdEhpdC54ID0gbmV4dFNob3QueDtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9sYXN0SGl0LnkgPSBuZXh0U2hvdC55O1xuICAgICAgICAgICAgICAgICAgICAgICAgX2RpcmVjdGlvblN3aXRjaGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2hvdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghX2RpcmVjdGlvblN3aXRjaGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoRGlyZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hvb3QoYm9hcmQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9yYW5kb21TaG90KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzd2l0Y2ggZGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoX2ZpcnN0SGl0LnggIT09IG51bGwgJiYgX2ZpcnN0SGl0LnkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2hEaXJlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2xhc3RIaXQueCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2xhc3RIaXQueSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgeDogbmV4dFNob3QueCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IG5leHRTaG90LnksXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHNob3QsXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3JhbmRvbVNob3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIHN3aXRjaERpcmVjdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9oaXREaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBfaGl0RGlyZWN0aW9uID0gXCJsZWZ0XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBfaGl0RGlyZWN0aW9uID0gXCJkb3duXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9oaXREaXJlY3Rpb24gPSBcInJpZ2h0XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIF9oaXREaXJlY3Rpb24gPSBcInVwXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfbGFzdEhpdC54ID0gX2ZpcnN0SGl0Lng7XG4gICAgICAgICAgICAgICAgX2xhc3RIaXQueSA9IF9maXJzdEhpdC55O1xuICAgICAgICAgICAgICAgIF9maXJzdEhpdC54ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBfZmlyc3RIaXQueSA9IG51bGw7XG4gICAgICAgICAgICAgICAgX2RpcmVjdGlvblN3aXRjaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIF9yYW5kb21TaG90KCkge1xuICAgICAgICAgICAgICAgIF9oaXREaXJlY3Rpb24gPSBudWxsO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNob3QgPSByYW5kb21QbGF5KGJvYXJkKTtcbiAgICAgICAgICAgICAgICBpZiAoc2hvdC5yZXN1bHQgPT09IFwiaGl0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgX2ZpcnN0SGl0LnggPSBzaG90Lng7XG4gICAgICAgICAgICAgICAgICAgIF9maXJzdEhpdC55ID0gc2hvdC55O1xuICAgICAgICAgICAgICAgICAgICBfbGFzdEhpdC54ID0gc2hvdC54O1xuICAgICAgICAgICAgICAgICAgICBfbGFzdEhpdC55ID0gc2hvdC55O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gc2hvdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNob290ID0gKGJvYXJkLCB4LCB5KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYm9hcmQucmVjZWl2ZUF0dGFjayh4LCB5KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB0aGlzLnBsYWNlU2hpcHNSYW5kb21seSA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5ib2FyZC5wbGFjZVJhbmRvbWx5KHRoaXMuc2hpcHMpO1xuICAgIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcbiIsImZ1bmN0aW9uIFNoaXAobGVuZ3RoKSB7XG4gICAgdGhpcy5oaXRzID0gMDtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICB0aGlzLm5hbWUgPSBfZ2V0TmFtZSgpO1xuICAgIGZ1bmN0aW9uIF9nZXROYW1lKCkge1xuICAgICAgICBzd2l0Y2ggKGxlbmd0aCkge1xuICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgIHJldHVybiBcIkFpcmNyYWZ0IGNhcnJpZXJcIjtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJCYXR0bGVzaGlwXCI7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiRGVzdHJveWVyXCI7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiU3VibWFyaW5lXCI7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiUGF0cm9sIGJvYXRcIjtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5pc1N1bmsgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhpdHMgPj0gdGhpcy5sZW5ndGg7XG4gICAgfTtcbiAgICB0aGlzLmhpdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5oaXRzKys7XG4gICAgfTtcblxuICAgIHRoaXMuaXNQbGFjZWQgPSBmYWxzZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgaW5pdGlhbGl6ZSB9IGZyb20gXCIuL2d1aVwiO1xuXG5pbml0aWFsaXplKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=