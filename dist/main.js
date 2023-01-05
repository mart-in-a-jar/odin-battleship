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
        return true;
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
                    } else {
                        // switch direction
                        if (_firstHit.x !== null && _firstHit.y !== null) {
                            _lastHit.x = _firstHit.x;
                            _lastHit.y = _firstHit.y;
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
                            _firstHit.x = null;
                            _firstHit.y = null;
                            _directionSwitched = true;
                        } else {
                            _lastHit.x = null;
                            _lastHit.y = null;
                        }
                        if (shot === false) {
                            if (!_directionSwitched) {
                                // switch direction and shoot again
                            /* } else { */
                                return _randomShot();
                            }
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
            function _randomShot() {
                _hitDirection = null;
                const shot = randomPlay(board);
                if (shot.result === "hit") {
                    _firstHit.x = shot.x;
                    _firstHit.y = shot.y;
                    _lastHit.x = shot.x;
                    _lastHit.y = shot.y;
                } /* else if (shot.result === "miss") {
                    _lastHit.x = null;
                    _lastHit.y = null;
                } */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05tQzs7QUFFbkMsZ0RBQVUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL29kaW4tYmF0dGxlc2hpcC8uL3NyYy9ndWkuanMiLCJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvLi9zcmMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIEdhbWVCb2FyZCgpIHtcbiAgICBjb25zdCBib2FyZCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgICBib2FyZFtpXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgICAgIGJvYXJkW2ldLnB1c2goeyBpc0hpdDogZmFsc2UgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnBsYWNlU2hpcCA9IChzaGlwLCB4LCB5LCBkaXJlY3Rpb24pID0+IHtcbiAgICAgICAgaWYgKHNoaXAuaXNQbGFjZWQpIHJldHVybiBcImFscmVhZHkgcGxhY2VkXCI7XG4gICAgICAgIGlmICghY2hlY2tQbGFjZW1lbnQoc2hpcCwgeCwgeSwgZGlyZWN0aW9uKSkgcmV0dXJuIFwiaW52YWxpZCBwbGFjZW1lbnRcIjtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBib2FyZFt4ICsgKGRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIgPyBpIDogMCldW1xuICAgICAgICAgICAgICAgIHkgKyAoZGlyZWN0aW9uID09PSBcInZlcnRpY2FsXCIgPyBpIDogMClcbiAgICAgICAgICAgIF0uc2hpcCA9IHNoaXA7XG4gICAgICAgIH1cbiAgICAgICAgc2hpcC5pc1BsYWNlZCA9IHRydWU7XG4gICAgfTtcblxuICAgIHRoaXMucGxhY2VSYW5kb21seSA9IChzaGlwcykgPT4ge1xuICAgICAgICBmb3IgKGxldCBzaGlwIG9mIHNoaXBzKSB7XG4gICAgICAgICAgICB3aGlsZSAoIXNoaXAuaXNQbGFjZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByYW5kb21YID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJhbmRvbVkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmFuZG9tRGlyZWN0aW9uID1cbiAgICAgICAgICAgICAgICAgICAgTWF0aC5yYW5kb20oKSA8IDAuNSA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xuICAgICAgICAgICAgICAgIHRoaXMucGxhY2VTaGlwKHNoaXAsIHJhbmRvbVgsIHJhbmRvbVksIHJhbmRvbURpcmVjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5yZWNlaXZlQXR0YWNrID0gKHgsIHkpID0+IHtcbiAgICAgICAgaWYgKHggPCAwIHx8IHggPiA5IHx8IHkgPCAwIHx8IHkgPiA5KSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGNvbnN0IGZpZWxkID0gYm9hcmRbeF1beV07XG4gICAgICAgIGlmIChmaWVsZC5pc0hpdCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBmaWVsZC5pc0hpdCA9IHRydWU7XG4gICAgICAgIGlmIChmaWVsZC5zaGlwKSB7XG4gICAgICAgICAgICBmaWVsZC5zaGlwLmhpdCgpO1xuICAgICAgICAgICAgcmV0dXJuIFwiaGl0XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwibWlzc1wiO1xuICAgIH07XG5cbiAgICB0aGlzLmdhbWVPdmVyID0gKCkgPT4ge1xuICAgICAgICBjb25zdCB1bnN1bmtTaGlwcyA9IGJvYXJkLnNvbWUoKHJvdykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJvdy5zb21lKChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChmaWVsZC5zaGlwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhZmllbGQuc2hpcC5pc1N1bmsoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh1bnN1bmtTaGlwcykgcmV0dXJuIGZhbHNlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gY2hlY2tQbGFjZW1lbnQoc2hpcCwgeCwgeSwgZGlyZWN0aW9uKSB7XG4gICAgICAgIGlmICh4ID4gOSB8fCB5ID4gOSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgICAgICAgaWYgKHggKyBzaGlwLmxlbmd0aCA+IDEwIHx8IHkgPiA5KSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoYm9hcmRbeCArIGldW3ldLnNoaXApIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IFwidmVydGljYWxcIikge1xuICAgICAgICAgICAgaWYgKHkgKyBzaGlwLmxlbmd0aCA+IDEwKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoYm9hcmRbeF1beSArIGldLnNoaXApIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB0aGlzLmxvZyA9ICgpID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgc3RyaW5nID0gXCJ8XCI7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgICAgICAgICBzdHJpbmcgKz0gYCAke1xuICAgICAgICAgICAgICAgICAgICBib2FyZFtqXVtpXS5zaGlwPy5uYW1lLnNsaWNlKDAsIDcpIHx8IFwiICAgICAgIFwiXG4gICAgICAgICAgICAgICAgfSB8YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0cmluZyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi1cIi5yZXBlYXQoMTAwKSlcbiAgICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5maWVsZHMgPSBib2FyZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZUJvYXJkO1xuIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi9wbGF5ZXJcIjtcblxuZnVuY3Rpb24gbWFrZUJvYXJkKCkge1xuICAgIGNvbnN0IGJvYXJkID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgICAgICBjb25zdCBmaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBmaWVsZC5kYXRhc2V0LnhDb29yZCA9IGo7XG4gICAgICAgICAgICBmaWVsZC5kYXRhc2V0LnlDb29yZCA9IGk7XG4gICAgICAgICAgICBmaWVsZC5jbGFzc0xpc3QuYWRkKFwiYm9hcmRcIiwgXCJmaWVsZFwiKTtcblxuICAgICAgICAgICAgYm9hcmQucHVzaChmaWVsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYm9hcmQ7XG59XG5cbmZ1bmN0aW9uIGRyYXdCb2FyZChib2FyZCwgcGxheWVyKSB7XG4gICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKFwiYm9hcmRcIiwgcGxheWVyKTtcbiAgICBmb3IgKGxldCBmaWVsZCBvZiBib2FyZCkge1xuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGZpZWxkKTtcbiAgICB9XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ib2FyZHNcIikuYXBwZW5kQ2hpbGQod3JhcHBlcik7XG4gICAgcmV0dXJuIHdyYXBwZXI7XG59XG5cbmNvbnN0IHBsYXllckZpZWxkcyA9IG1ha2VCb2FyZCgpO1xuY29uc3QgY29tcHV0ZXJGaWVsZHMgPSBtYWtlQm9hcmQoKTtcblxuY29uc3QgcmVzdWx0VGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmVzdWx0XCIpO1xuY29uc3QgcGxheWVyQm9hcmQgPSBkcmF3Qm9hcmQocGxheWVyRmllbGRzLCBcInBsYXllclwiKTtcbmNvbnN0IGNvbXB1dGVyQm9hcmQgPSBkcmF3Qm9hcmQoY29tcHV0ZXJGaWVsZHMsIFwiY29tcHV0ZXJcIik7XG5jb25zdCBwbGF5ZXJGaWVsZEljb25zID0gcGxheWVyQm9hcmQucXVlcnlTZWxlY3RvckFsbChcIi5maWVsZFwiKTtcbmNvbnN0IGNvbXB1dGVyRmllbGRJY29ucyA9IGNvbXB1dGVyQm9hcmQucXVlcnlTZWxlY3RvckFsbChcIi5maWVsZFwiKTtcbmNvbnN0IHJlc3RhcnRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Jlc3RhcnRcIik7XG5cbmxldCBwbGF5ZXIsIGNvbXB1dGVyO1xuXG5mdW5jdGlvbiBwbGF5ZXJTZXR1cCgpIHtcbiAgICBwbGF5ZXIgPSBuZXcgUGxheWVyKFwiWW91XCIpO1xuICAgIGNvbXB1dGVyID0gbmV3IFBsYXllcihcIkNvbXB1dGVyXCIsIHRydWUpO1xuICAgIGNvbXB1dGVyLnBsYWNlU2hpcHNSYW5kb21seSgpO1xuICAgIHBsYXllci5wbGFjZVNoaXBzUmFuZG9tbHkoKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlU2hvdChmaWVsZCkge1xuICAgIGZpZWxkID0gZmllbGQudGFyZ2V0O1xuICAgIGNvbnN0IHJlc3VsdCA9IHBsYXllci5zaG9vdChcbiAgICAgICAgY29tcHV0ZXIuYm9hcmQsXG4gICAgICAgICtmaWVsZC5kYXRhc2V0LnhDb29yZCxcbiAgICAgICAgK2ZpZWxkLmRhdGFzZXQueUNvb3JkXG4gICAgKTtcbiAgICBmaWVsZC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlU2hvdCk7XG4gICAgc3R5bGVTaG90cyhmaWVsZCwgcmVzdWx0KTtcbiAgICBpZiAoY29tcHV0ZXIuYm9hcmQuZ2FtZU92ZXIoKSkge1xuICAgICAgICByZXR1cm4gaGFuZGxlR2FtZU92ZXIoXCJ3aW5cIik7XG4gICAgfVxuICAgIGNvbXB1dGVyU2hvb3QoKTtcbn1cblxuZnVuY3Rpb24gY29tcHV0ZXJTaG9vdCgpIHtcbiAgICBjb25zdCByZXN1bHQgPSBjb21wdXRlci5zaG9vdChwbGF5ZXIuYm9hcmQpO1xuICAgIGNvbnN0IGZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYC5wbGF5ZXIgW2RhdGEteC1jb29yZD1cIiR7cmVzdWx0Lnh9XCJdW2RhdGEteS1jb29yZD1cIiR7cmVzdWx0Lnl9XCJdYFxuICAgICk7XG4gICAgc3R5bGVTaG90cyhmaWVsZCwgcmVzdWx0LnJlc3VsdCk7XG4gICAgaWYgKHBsYXllci5ib2FyZC5nYW1lT3ZlcigpKSB7XG4gICAgICAgIHJldHVybiBoYW5kbGVHYW1lT3ZlcihcImxvc3NcIik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVHYW1lT3ZlcihyZXN1bHQpIHtcbiAgICByZXN1bHRUZXh0LnRleHRDb250ZW50ID0gYFlvdSAke3Jlc3VsdCA9PT0gXCJ3aW5cIiA/IFwid29uXCIgOiBcImxvc3RcIn0hYDtcbiAgICBjb21wdXRlckJvYXJkLmNsYXNzTGlzdC5hZGQoXCJnYW1lLW92ZXJcIik7XG59XG5cbmZ1bmN0aW9uIHN0eWxlU2hvdHMoZmllbGQsIHJlc3VsdCkge1xuICAgIGlmIChyZXN1bHQgPT09IFwiaGl0XCIpIHtcbiAgICAgICAgZmllbGQuY2xhc3NMaXN0LmFkZChcImhpdFwiLCBcInNoaXBcIik7XG4gICAgICAgIGZpZWxkLmlubmVySFRNTCA9IFwiJnRpbWVzO1wiO1xuICAgIH0gZWxzZSBpZiAocmVzdWx0ID09PSBcIm1pc3NcIikge1xuICAgICAgICBmaWVsZC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcbiAgICAgICAgZmllbGQuaW5uZXJIVE1MID0gXCImIzk2Nzk7XCI7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhZGRTaG90TGlzdGVuZXJzKCkge1xuICAgIGZvciAobGV0IGZpZWxkIG9mIGNvbXB1dGVyRmllbGRJY29ucykge1xuICAgICAgICBmaWVsZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlU2hvdCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIHBsYXllclNldHVwKCk7XG4gICAgYWRkU2hvdExpc3RlbmVycygpO1xuICAgIGZvciAobGV0IGZpZWxkIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmllbGRcIikpIHtcbiAgICAgICAgZmllbGQuY2xhc3NMaXN0LnJlbW92ZShcImhpdFwiKTtcbiAgICAgICAgZmllbGQuY2xhc3NMaXN0LnJlbW92ZShcIm1pc3NcIik7XG4gICAgICAgIGZpZWxkLmNsYXNzTGlzdC5yZW1vdmUoXCJzaGlwXCIpO1xuICAgICAgICBmaWVsZC5pbm5lckhUTUwgPSBcIlwiO1xuICAgIH1cbiAgICBjb21wdXRlckJvYXJkLmNsYXNzTGlzdC5yZW1vdmUoXCJnYW1lLW92ZXJcIik7XG4gICAgcmVzdWx0VGV4dC50ZXh0Q29udGVudCA9IFwiXCI7XG4gICAgLy8gcGVla0JvYXRzKFwiZGVidWdcIik7XG4gICAgcGVla0JvYXRzKCk7XG59XG5cbnJlc3RhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGluaXRpYWxpemUpO1xuXG5mdW5jdGlvbiBwZWVrQm9hdHMoZGVidWcpIHtcbiAgICBpZiAoZGVidWcgPT09IFwiZGVidWdcIikge1xuICAgICAgICBmb3IgKGxldCBmaWVsZCBvZiBjb21wdXRlckZpZWxkSWNvbnMpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBjb21wdXRlci5ib2FyZC5maWVsZHNbZmllbGQuZGF0YXNldC54Q29vcmRdW1xuICAgICAgICAgICAgICAgICAgICBmaWVsZC5kYXRhc2V0LnlDb29yZFxuICAgICAgICAgICAgICAgIF0uc2hpcFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgZmllbGQuY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XG4gICAgICAgICAgICB9IGVsc2UgZmllbGQuY2xhc3NMaXN0LnJlbW92ZShcInNoaXBcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yIChsZXQgZmllbGQgb2YgcGxheWVyRmllbGRJY29ucykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBwbGF5ZXIuYm9hcmQuZmllbGRzW2ZpZWxkLmRhdGFzZXQueENvb3JkXVtmaWVsZC5kYXRhc2V0LnlDb29yZF0uc2hpcFxuICAgICAgICApIHtcbiAgICAgICAgICAgIGZpZWxkLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xuICAgICAgICB9IGVsc2UgZmllbGQuY2xhc3NMaXN0LnJlbW92ZShcInNoaXBcIik7XG4gICAgfVxufVxuXG5leHBvcnQgeyBpbml0aWFsaXplIH07XG4iLCJpbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5mdW5jdGlvbiBQbGF5ZXIobmFtZSwgY29tcHV0ZXIgPSBmYWxzZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5ib2FyZCA9IG5ldyBHYW1lQm9hcmQoKTtcblxuICAgIHRoaXMuc2hpcHMgPSBbXG4gICAgICAgIG5ldyBTaGlwKDEpLFxuICAgICAgICBuZXcgU2hpcCgyKSxcbiAgICAgICAgbmV3IFNoaXAoMyksXG4gICAgICAgIG5ldyBTaGlwKDQpLFxuICAgICAgICBuZXcgU2hpcCg1KSxcbiAgICBdO1xuXG4gICAgZnVuY3Rpb24gcmFuZG9tUGxheShib2FyZCkge1xuICAgICAgICBsZXQgdmFsaWRNb3ZlID0gZmFsc2U7XG4gICAgICAgIHdoaWxlICghdmFsaWRNb3ZlKSB7XG4gICAgICAgICAgICBjb25zdCByYW5kb21YID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgICAgICAgY29uc3QgcmFuZG9tWSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgICAgICAgIGNvbnN0IHNob3QgPSBib2FyZC5yZWNlaXZlQXR0YWNrKHJhbmRvbVgsIHJhbmRvbVkpO1xuICAgICAgICAgICAgaWYgKHNob3QgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRNb3ZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyB4OiByYW5kb21YLCB5OiByYW5kb21ZLCByZXN1bHQ6IHNob3QgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoY29tcHV0ZXIpIHtcbiAgICAgICAgY29uc3QgX2ZpcnN0SGl0ID0geyB4OiBudWxsLCB5OiBudWxsIH07XG4gICAgICAgIGNvbnN0IF9sYXN0SGl0ID0geyB4OiBudWxsLCB5OiBudWxsIH07XG4gICAgICAgIGxldCBfaGl0RGlyZWN0aW9uO1xuICAgICAgICBsZXQgX2RpcmVjdGlvblN3aXRjaGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2hvb3QgPSAoYm9hcmQpID0+IHtcbiAgICAgICAgICAgIGlmIChfbGFzdEhpdC54ICE9PSBudWxsICYmIF9sYXN0SGl0LnkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoIV9oaXREaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhbGlkTW92ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb3NpYmxlTW92ZXMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICBbMSwgMCwgXCJyaWdodFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFswLCAtMSwgXCJ1cFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFstMSwgMCwgXCJsZWZ0XCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgWzAsIDEsIFwiZG93blwiXSxcbiAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCF2YWxpZE1vdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vdmUgPSBwb3NpYmxlTW92ZXMuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbW92ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfcmFuZG9tU2hvdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dFNob3QgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogX2xhc3RIaXQueCArIG1vdmVbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogX2xhc3RIaXQueSArIG1vdmVbMV0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hvdCA9IGJvYXJkLnJlY2VpdmVBdHRhY2soXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNob3QueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2hvdC55XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNob3QgPT09IFwiaGl0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfbGFzdEhpdC54ID0gbmV4dFNob3QueDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfbGFzdEhpdC55ID0gbmV4dFNob3QueTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaGl0RGlyZWN0aW9uID0gbW92ZVsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzaG90ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkTW92ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogbmV4dFNob3QueCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogbmV4dFNob3QueSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0OiBzaG90LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXh0U2hvdCA9IHsgeDogX2xhc3RIaXQueCwgeTogX2xhc3RIaXQueSB9O1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKF9oaXREaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTaG90LngrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ1cFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRTaG90LnktLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNob3QueC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0U2hvdC55Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hvdCA9IGJvYXJkLnJlY2VpdmVBdHRhY2sobmV4dFNob3QueCwgbmV4dFNob3QueSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzaG90ID09PSBcImhpdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfbGFzdEhpdC54ID0gbmV4dFNob3QueDtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9sYXN0SGl0LnkgPSBuZXh0U2hvdC55O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3dpdGNoIGRpcmVjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9maXJzdEhpdC54ICE9PSBudWxsICYmIF9maXJzdEhpdC55ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2xhc3RIaXQueCA9IF9maXJzdEhpdC54O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9sYXN0SGl0LnkgPSBfZmlyc3RIaXQueTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKF9oaXREaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaGl0RGlyZWN0aW9uID0gXCJsZWZ0XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInVwXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaGl0RGlyZWN0aW9uID0gXCJkb3duXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9oaXREaXJlY3Rpb24gPSBcInJpZ2h0XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImRvd25cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9oaXREaXJlY3Rpb24gPSBcInVwXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZmlyc3RIaXQueCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2ZpcnN0SGl0LnkgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9kaXJlY3Rpb25Td2l0Y2hlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9sYXN0SGl0LnggPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9sYXN0SGl0LnkgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNob3QgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFfZGlyZWN0aW9uU3dpdGNoZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3dpdGNoIGRpcmVjdGlvbiBhbmQgc2hvb3QgYWdhaW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiB9IGVsc2UgeyAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3JhbmRvbVNob3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgeDogbmV4dFNob3QueCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IG5leHRTaG90LnksXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHNob3QsXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3JhbmRvbVNob3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIF9yYW5kb21TaG90KCkge1xuICAgICAgICAgICAgICAgIF9oaXREaXJlY3Rpb24gPSBudWxsO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNob3QgPSByYW5kb21QbGF5KGJvYXJkKTtcbiAgICAgICAgICAgICAgICBpZiAoc2hvdC5yZXN1bHQgPT09IFwiaGl0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgX2ZpcnN0SGl0LnggPSBzaG90Lng7XG4gICAgICAgICAgICAgICAgICAgIF9maXJzdEhpdC55ID0gc2hvdC55O1xuICAgICAgICAgICAgICAgICAgICBfbGFzdEhpdC54ID0gc2hvdC54O1xuICAgICAgICAgICAgICAgICAgICBfbGFzdEhpdC55ID0gc2hvdC55O1xuICAgICAgICAgICAgICAgIH0gLyogZWxzZSBpZiAoc2hvdC5yZXN1bHQgPT09IFwibWlzc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIF9sYXN0SGl0LnggPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBfbGFzdEhpdC55ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9ICovXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNob3Q7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zaG9vdCA9IChib2FyZCwgeCwgeSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGJvYXJkLnJlY2VpdmVBdHRhY2soeCwgeSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdGhpcy5wbGFjZVNoaXBzUmFuZG9tbHkgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuYm9hcmQucGxhY2VSYW5kb21seSh0aGlzLnNoaXBzKTtcbiAgICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XG4iLCJmdW5jdGlvbiBTaGlwKGxlbmd0aCkge1xuICAgIHRoaXMuaGl0cyA9IDA7XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgdGhpcy5uYW1lID0gX2dldE5hbWUoKTtcbiAgICBmdW5jdGlvbiBfZ2V0TmFtZSgpIHtcbiAgICAgICAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJBaXJjcmFmdCBjYXJyaWVyXCI7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiQmF0dGxlc2hpcFwiO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIkRlc3Ryb3llclwiO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIlN1Ym1hcmluZVwiO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIlBhdHJvbCBib2F0XCI7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRoaXMuaXNTdW5rID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oaXRzID49IHRoaXMubGVuZ3RoO1xuICAgIH07XG4gICAgdGhpcy5oaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaGl0cysrO1xuICAgIH07XG5cbiAgICB0aGlzLmlzUGxhY2VkID0gZmFsc2U7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXA7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGluaXRpYWxpemUgfSBmcm9tIFwiLi9ndWlcIjtcblxuaW5pdGlhbGl6ZSgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9