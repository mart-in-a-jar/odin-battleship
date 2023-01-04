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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUE7QUFDQTs7QUFFQSxpRUFBZSxJQUFJLEVBQUM7Ozs7Ozs7VUM5QnBCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNObUM7O0FBRW5DLGdEQUFVIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvLi9zcmMvZ3VpLmpzIiwid2VicGFjazovL29kaW4tYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL29kaW4tYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwLy4vc3JjL2FwcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBHYW1lQm9hcmQoKSB7XG4gICAgY29uc3QgYm9hcmQgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgYm9hcmRbaV0gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgICAgICBib2FyZFtpXS5wdXNoKHsgaXNIaXQ6IGZhbHNlIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5wbGFjZVNoaXAgPSAoc2hpcCwgeCwgeSwgZGlyZWN0aW9uKSA9PiB7XG4gICAgICAgIGlmIChzaGlwLmlzUGxhY2VkKSByZXR1cm4gXCJhbHJlYWR5IHBsYWNlZFwiO1xuICAgICAgICBpZiAoIWNoZWNrUGxhY2VtZW50KHNoaXAsIHgsIHksIGRpcmVjdGlvbikpIHJldHVybiBcImludmFsaWQgcGxhY2VtZW50XCI7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYm9hcmRbeCArIChkaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiID8gaSA6IDApXVtcbiAgICAgICAgICAgICAgICB5ICsgKGRpcmVjdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiID8gaSA6IDApXG4gICAgICAgICAgICBdLnNoaXAgPSBzaGlwO1xuICAgICAgICB9XG4gICAgICAgIHNoaXAuaXNQbGFjZWQgPSB0cnVlO1xuICAgIH07XG5cbiAgICB0aGlzLnBsYWNlUmFuZG9tbHkgPSAoc2hpcHMpID0+IHtcbiAgICAgICAgZm9yIChsZXQgc2hpcCBvZiBzaGlwcykge1xuICAgICAgICAgICAgd2hpbGUgKCFzaGlwLmlzUGxhY2VkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmFuZG9tWCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgICAgICAgICAgICBjb25zdCByYW5kb21ZID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJhbmRvbURpcmVjdGlvbiA9XG4gICAgICAgICAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgPCAwLjUgPyBcImhvcml6b250YWxcIiA6IFwidmVydGljYWxcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYWNlU2hpcChzaGlwLCByYW5kb21YLCByYW5kb21ZLCByYW5kb21EaXJlY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMucmVjZWl2ZUF0dGFjayA9ICh4LCB5KSA9PiB7XG4gICAgICAgIGNvbnN0IGZpZWxkID0gYm9hcmRbeF1beV07XG4gICAgICAgIGlmIChmaWVsZC5pc0hpdCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBmaWVsZC5pc0hpdCA9IHRydWU7XG4gICAgICAgIGlmIChmaWVsZC5zaGlwKSB7XG4gICAgICAgICAgICBmaWVsZC5zaGlwLmhpdCgpO1xuICAgICAgICAgICAgcmV0dXJuIFwiaGl0XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwibWlzc1wiO1xuICAgIH07XG5cbiAgICB0aGlzLmdhbWVPdmVyID0gKCkgPT4ge1xuICAgICAgICBjb25zdCB1bnN1bmtTaGlwcyA9IGJvYXJkLnNvbWUoKHJvdykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJvdy5zb21lKChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChmaWVsZC5zaGlwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhZmllbGQuc2hpcC5pc1N1bmsoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh1bnN1bmtTaGlwcykgcmV0dXJuIGZhbHNlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gY2hlY2tQbGFjZW1lbnQoc2hpcCwgeCwgeSwgZGlyZWN0aW9uKSB7XG4gICAgICAgIGlmICh4ID4gOSB8fCB5ID4gOSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgICAgICAgaWYgKHggKyBzaGlwLmxlbmd0aCA+IDEwIHx8IHkgPiA5KSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoYm9hcmRbeCArIGldW3ldLnNoaXApIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IFwidmVydGljYWxcIikge1xuICAgICAgICAgICAgaWYgKHkgKyBzaGlwLmxlbmd0aCA+IDEwKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoYm9hcmRbeF1beSArIGldLnNoaXApIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB0aGlzLmxvZyA9ICgpID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgc3RyaW5nID0gXCJ8XCI7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgICAgICAgICBzdHJpbmcgKz0gYCAke1xuICAgICAgICAgICAgICAgICAgICBib2FyZFtqXVtpXS5zaGlwPy5uYW1lLnNsaWNlKDAsIDcpIHx8IFwiICAgICAgIFwiXG4gICAgICAgICAgICAgICAgfSB8YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0cmluZyk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIi1cIi5yZXBlYXQoMTAwKSlcbiAgICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5maWVsZHMgPSBib2FyZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZUJvYXJkO1xuIiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi9wbGF5ZXJcIjtcblxuZnVuY3Rpb24gbWFrZUJvYXJkKCkge1xuICAgIGNvbnN0IGJvYXJkID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgICAgICBjb25zdCBmaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBmaWVsZC5kYXRhc2V0LnhDb29yZCA9IGo7XG4gICAgICAgICAgICBmaWVsZC5kYXRhc2V0LnlDb29yZCA9IGk7XG4gICAgICAgICAgICBmaWVsZC5jbGFzc0xpc3QuYWRkKFwiYm9hcmRcIiwgXCJmaWVsZFwiKTtcblxuICAgICAgICAgICAgYm9hcmQucHVzaChmaWVsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYm9hcmQ7XG59XG5cbmZ1bmN0aW9uIGRyYXdCb2FyZChib2FyZCwgcGxheWVyKSB7XG4gICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKFwiYm9hcmRcIiwgcGxheWVyKTtcbiAgICBmb3IgKGxldCBmaWVsZCBvZiBib2FyZCkge1xuICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGZpZWxkKTtcblxuICAgICAgICAvL1xuICAgICAgICAvLyBmaWVsZC50ZXh0Q29udGVudCA9IGAke2ZpZWxkLmRhdGFzZXQueENvb3JkfSwke2ZpZWxkLmRhdGFzZXQueUNvb3JkfWA7XG4gICAgfVxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYm9hcmRzXCIpLmFwcGVuZENoaWxkKHdyYXBwZXIpO1xuICAgIHJldHVybiB3cmFwcGVyO1xufVxuXG5jb25zdCBwbGF5ZXJGaWVsZHMgPSBtYWtlQm9hcmQoKTtcbmNvbnN0IGNvbXB1dGVyRmllbGRzID0gbWFrZUJvYXJkKCk7XG5cbmNvbnN0IHJlc3VsdFRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJlc3VsdFwiKTtcbmNvbnN0IHBsYXllckJvYXJkID0gZHJhd0JvYXJkKHBsYXllckZpZWxkcywgXCJwbGF5ZXJcIik7XG5jb25zdCBjb21wdXRlckJvYXJkID0gZHJhd0JvYXJkKGNvbXB1dGVyRmllbGRzLCBcImNvbXB1dGVyXCIpO1xuY29uc3QgcGxheWVyRmllbGRJY29ucyA9IHBsYXllckJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmllbGRcIik7XG5jb25zdCBjb21wdXRlckZpZWxkSWNvbnMgPSBjb21wdXRlckJvYXJkLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmllbGRcIik7XG5jb25zdCByZXN0YXJ0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyZXN0YXJ0XCIpO1xuXG5sZXQgcGxheWVyLCBjb21wdXRlcjtcblxuZnVuY3Rpb24gcGxheWVyU2V0dXAoKSB7XG4gICAgcGxheWVyID0gbmV3IFBsYXllcihcIllvdVwiKTtcbiAgICBjb21wdXRlciA9IG5ldyBQbGF5ZXIoXCJDb21wdXRlclwiLCB0cnVlKTtcbiAgICBjb21wdXRlci5wbGFjZVNoaXBzUmFuZG9tbHkoKTtcbiAgICBwbGF5ZXIucGxhY2VTaGlwc1JhbmRvbWx5KCk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVNob3QoZmllbGQpIHtcbiAgICBmaWVsZCA9IGZpZWxkLnRhcmdldDtcbiAgICBjb25zdCByZXN1bHQgPSBwbGF5ZXIuc2hvb3QoXG4gICAgICAgIGNvbXB1dGVyLmJvYXJkLFxuICAgICAgICArZmllbGQuZGF0YXNldC54Q29vcmQsXG4gICAgICAgICtmaWVsZC5kYXRhc2V0LnlDb29yZFxuICAgICk7XG4gICAgZmllbGQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZVNob3QpO1xuICAgIHN0eWxlU2hvdHMoZmllbGQsIHJlc3VsdCk7XG4gICAgaWYgKGNvbXB1dGVyLmJvYXJkLmdhbWVPdmVyKCkpIHtcbiAgICAgICAgcmV0dXJuIGhhbmRsZUdhbWVPdmVyKFwid2luXCIpO1xuICAgIH1cbiAgICBjb21wdXRlclNob290KCk7XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVyU2hvb3QoKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gY29tcHV0ZXIucmFuZG9tUGxheShwbGF5ZXIuYm9hcmQpO1xuICAgIGNvbnN0IGZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYC5wbGF5ZXIgW2RhdGEteC1jb29yZD1cIiR7cmVzdWx0Lnh9XCJdW2RhdGEteS1jb29yZD1cIiR7cmVzdWx0Lnl9XCJdYFxuICAgICk7XG4gICAgc3R5bGVTaG90cyhmaWVsZCwgcmVzdWx0LnJlc3VsdCk7XG4gICAgaWYgKHBsYXllci5ib2FyZC5nYW1lT3ZlcigpKSB7XG4gICAgICAgIHJldHVybiBoYW5kbGVHYW1lT3ZlcihcImxvc3NcIik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVHYW1lT3ZlcihyZXN1bHQpIHtcbiAgICByZXN1bHRUZXh0LnRleHRDb250ZW50ID0gYFlvdSAke3Jlc3VsdCA9PT0gXCJ3aW5cIiA/IFwid29uXCIgOiBcImxvc3RcIn0hYDtcbiAgICBjb21wdXRlckJvYXJkLmNsYXNzTGlzdC5hZGQoXCJnYW1lLW92ZXJcIik7XG59XG5cbmZ1bmN0aW9uIHN0eWxlU2hvdHMoZmllbGQsIHJlc3VsdCkge1xuICAgIGlmIChyZXN1bHQgPT09IFwiaGl0XCIpIHtcbiAgICAgICAgZmllbGQuY2xhc3NMaXN0LmFkZChcImhpdFwiKTtcbiAgICB9IGVsc2UgaWYgKHJlc3VsdCA9PT0gXCJtaXNzXCIpIHtcbiAgICAgICAgZmllbGQuY2xhc3NMaXN0LmFkZChcIm1pc3NcIik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhZGRTaG90TGlzdGVuZXJzKCkge1xuICAgIGZvciAobGV0IGZpZWxkIG9mIGNvbXB1dGVyRmllbGRJY29ucykge1xuICAgICAgICBmaWVsZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlU2hvdCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIHBsYXllclNldHVwKCk7XG4gICAgYWRkU2hvdExpc3RlbmVycygpO1xuICAgIGZvciAobGV0IGZpZWxkIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZmllbGRcIikpIHtcbiAgICAgICAgZmllbGQuY2xhc3NMaXN0LnJlbW92ZShcImhpdFwiKTtcbiAgICAgICAgZmllbGQuY2xhc3NMaXN0LnJlbW92ZShcIm1pc3NcIik7XG4gICAgfVxuICAgIGNvbXB1dGVyQm9hcmQuY2xhc3NMaXN0LnJlbW92ZShcImdhbWUtb3ZlclwiKTtcbiAgICByZXN1bHRUZXh0LnRleHRDb250ZW50ID0gXCJcIjtcbiAgICBwZWVrQm9hdHMoXCJkZWJ1Z1wiKTtcbn1cblxucmVzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaW5pdGlhbGl6ZSk7XG5cbmZ1bmN0aW9uIHBlZWtCb2F0cyhkZWJ1Zykge1xuICAgIGlmIChkZWJ1ZyA9PT0gXCJkZWJ1Z1wiKSB7XG4gICAgICAgIGZvciAobGV0IGZpZWxkIG9mIGNvbXB1dGVyRmllbGRJY29ucykge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGNvbXB1dGVyLmJvYXJkLmZpZWxkc1tmaWVsZC5kYXRhc2V0LnhDb29yZF1bXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkLmRhdGFzZXQueUNvb3JkXG4gICAgICAgICAgICAgICAgXS5zaGlwXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBmaWVsZC50ZXh0Q29udGVudCA9IFwiWFwiO1xuICAgICAgICAgICAgfSBlbHNlIGZpZWxkLnRleHRDb250ZW50ID0gXCJcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxldCBmaWVsZCBvZiBwbGF5ZXJGaWVsZEljb25zKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHBsYXllci5ib2FyZC5maWVsZHNbZmllbGQuZGF0YXNldC54Q29vcmRdW2ZpZWxkLmRhdGFzZXQueUNvb3JkXS5zaGlwXG4gICAgICAgICkge1xuICAgICAgICAgICAgZmllbGQudGV4dENvbnRlbnQgPSBcIlhcIjtcbiAgICAgICAgfSBlbHNlIGZpZWxkLnRleHRDb250ZW50ID0gXCJcIjtcbiAgICB9XG59XG5cbmV4cG9ydCB7IGluaXRpYWxpemUgfTtcbiIsImltcG9ydCBHYW1lQm9hcmQgZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmZ1bmN0aW9uIFBsYXllcihuYW1lLCBjb21wdXRlciA9IGZhbHNlKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmJvYXJkID0gbmV3IEdhbWVCb2FyZCgpO1xuXG4gICAgdGhpcy5zaGlwcyA9IFtcbiAgICAgICAgbmV3IFNoaXAoMSksXG4gICAgICAgIG5ldyBTaGlwKDIpLFxuICAgICAgICBuZXcgU2hpcCgzKSxcbiAgICAgICAgbmV3IFNoaXAoNCksXG4gICAgICAgIG5ldyBTaGlwKDUpLFxuICAgIF07XG5cbiAgICBpZiAoY29tcHV0ZXIpIHtcbiAgICAgICAgdGhpcy5yYW5kb21QbGF5ID0gKGJvYXJkKSA9PiB7XG4gICAgICAgICAgICBsZXQgdmFsaWRNb3ZlID0gZmFsc2U7XG4gICAgICAgICAgICB3aGlsZSAoIXZhbGlkTW92ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJhbmRvbVggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmFuZG9tWSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzaG90ID0gYm9hcmQucmVjZWl2ZUF0dGFjayhyYW5kb21YLCByYW5kb21ZKTtcbiAgICAgICAgICAgICAgICBpZiAoc2hvdCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRNb3ZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgeDogcmFuZG9tWCwgeTogcmFuZG9tWSwgcmVzdWx0OiBzaG90IH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2hvb3QgPSAoYm9hcmQsIHgsIHkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBib2FyZC5yZWNlaXZlQXR0YWNrKHgsIHkpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHRoaXMucGxhY2VTaGlwc1JhbmRvbWx5ID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmJvYXJkLnBsYWNlUmFuZG9tbHkodGhpcy5zaGlwcyk7XG4gICAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiZnVuY3Rpb24gU2hpcChsZW5ndGgpIHtcbiAgICB0aGlzLmhpdHMgPSAwO1xuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgIHRoaXMubmFtZSA9IF9nZXROYW1lKCk7XG4gICAgZnVuY3Rpb24gX2dldE5hbWUoKSB7XG4gICAgICAgIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiQWlyY3JhZnQgY2FycmllclwiO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIHJldHVybiBcIkJhdHRsZXNoaXBcIjtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJEZXN0cm95ZXJcIjtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJTdWJtYXJpbmVcIjtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJQYXRyb2wgYm9hdFwiO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmlzU3VuayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGl0cyA+PSB0aGlzLmxlbmd0aDtcbiAgICB9O1xuICAgIHRoaXMuaGl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmhpdHMrKztcbiAgICB9O1xuXG4gICAgdGhpcy5pc1BsYWNlZCA9IGZhbHNlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBpbml0aWFsaXplIH0gZnJvbSBcIi4vZ3VpXCI7XG5cbmluaXRpYWxpemUoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==