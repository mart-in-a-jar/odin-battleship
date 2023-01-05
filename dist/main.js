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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTs7QUFFQTtBQUNBOztBQUVBLGlFQUFlLElBQUksRUFBQzs7Ozs7OztVQzlCcEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05tQzs7QUFFbkMsZ0RBQVUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL29kaW4tYmF0dGxlc2hpcC8uL3NyYy9ndWkuanMiLCJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvLi9zcmMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIEdhbWVCb2FyZCgpIHtcbiAgICBjb25zdCBib2FyZCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgICBib2FyZFtpXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgICAgIGJvYXJkW2ldLnB1c2goeyBpc0hpdDogZmFsc2UgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnBsYWNlU2hpcCA9IChzaGlwLCB4LCB5LCBkaXJlY3Rpb24pID0+IHtcbiAgICAgICAgaWYgKHNoaXAuaXNQbGFjZWQpIHJldHVybiBcImFscmVhZHkgcGxhY2VkXCI7XG4gICAgICAgIGlmICghY2hlY2tQbGFjZW1lbnQoc2hpcCwgeCwgeSwgZGlyZWN0aW9uKSkgcmV0dXJuIFwiaW52YWxpZCBwbGFjZW1lbnRcIjtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBib2FyZFt4ICsgKGRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIgPyBpIDogMCldW1xuICAgICAgICAgICAgICAgIHkgKyAoZGlyZWN0aW9uID09PSBcInZlcnRpY2FsXCIgPyBpIDogMClcbiAgICAgICAgICAgIF0uc2hpcCA9IHNoaXA7XG4gICAgICAgIH1cbiAgICAgICAgc2hpcC5pc1BsYWNlZCA9IHRydWU7XG4gICAgfTtcblxuICAgIHRoaXMucGxhY2VSYW5kb21seSA9IChzaGlwcykgPT4ge1xuICAgICAgICBmb3IgKGxldCBzaGlwIG9mIHNoaXBzKSB7XG4gICAgICAgICAgICB3aGlsZSAoIXNoaXAuaXNQbGFjZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByYW5kb21YID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJhbmRvbVkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmFuZG9tRGlyZWN0aW9uID1cbiAgICAgICAgICAgICAgICAgICAgTWF0aC5yYW5kb20oKSA8IDAuNSA/IFwiaG9yaXpvbnRhbFwiIDogXCJ2ZXJ0aWNhbFwiO1xuICAgICAgICAgICAgICAgIHRoaXMucGxhY2VTaGlwKHNoaXAsIHJhbmRvbVgsIHJhbmRvbVksIHJhbmRvbURpcmVjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5yZWNlaXZlQXR0YWNrID0gKHgsIHkpID0+IHtcbiAgICAgICAgY29uc3QgZmllbGQgPSBib2FyZFt4XVt5XTtcbiAgICAgICAgaWYgKGZpZWxkLmlzSGl0KSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGZpZWxkLmlzSGl0ID0gdHJ1ZTtcbiAgICAgICAgaWYgKGZpZWxkLnNoaXApIHtcbiAgICAgICAgICAgIGZpZWxkLnNoaXAuaGl0KCk7XG4gICAgICAgICAgICByZXR1cm4gXCJoaXRcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJtaXNzXCI7XG4gICAgfTtcblxuICAgIHRoaXMuZ2FtZU92ZXIgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHVuc3Vua1NoaXBzID0gYm9hcmQuc29tZSgocm93KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcm93LnNvbWUoKGZpZWxkKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGZpZWxkLnNoaXApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICFmaWVsZC5zaGlwLmlzU3VuaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHVuc3Vua1NoaXBzKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBjaGVja1BsYWNlbWVudChzaGlwLCB4LCB5LCBkaXJlY3Rpb24pIHtcbiAgICAgICAgaWYgKHggPiA5IHx8IHkgPiA5KSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChkaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICAgICAgICBpZiAoeCArIHNoaXAubGVuZ3RoID4gMTAgfHwgeSA+IDkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChib2FyZFt4ICsgaV1beV0uc2hpcCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiKSB7XG4gICAgICAgICAgICBpZiAoeSArIHNoaXAubGVuZ3RoID4gMTApIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChib2FyZFt4XVt5ICsgaV0uc2hpcCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMubG9nID0gKCkgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBzdHJpbmcgPSBcInxcIjtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICAgICAgICAgIHN0cmluZyArPSBgICR7XG4gICAgICAgICAgICAgICAgICAgIGJvYXJkW2pdW2ldLnNoaXA/Lm5hbWUuc2xpY2UoMCwgNykgfHwgXCIgICAgICAgXCJcbiAgICAgICAgICAgICAgICB9IHxgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coc3RyaW5nKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiLVwiLnJlcGVhdCgxMDApKVxuICAgICAgICB9XG4gICAgfTtcbiAgICB0aGlzLmZpZWxkcyA9IGJvYXJkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lQm9hcmQ7XG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuL3BsYXllclwiO1xuXG5mdW5jdGlvbiBtYWtlQm9hcmQoKSB7XG4gICAgY29uc3QgYm9hcmQgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIGZpZWxkLmRhdGFzZXQueENvb3JkID0gajtcbiAgICAgICAgICAgIGZpZWxkLmRhdGFzZXQueUNvb3JkID0gaTtcbiAgICAgICAgICAgIGZpZWxkLmNsYXNzTGlzdC5hZGQoXCJib2FyZFwiLCBcImZpZWxkXCIpO1xuXG4gICAgICAgICAgICBib2FyZC5wdXNoKGZpZWxkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBib2FyZDtcbn1cblxuZnVuY3Rpb24gZHJhd0JvYXJkKGJvYXJkLCBwbGF5ZXIpIHtcbiAgICBjb25zdCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB3cmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJib2FyZFwiLCBwbGF5ZXIpO1xuICAgIGZvciAobGV0IGZpZWxkIG9mIGJvYXJkKSB7XG4gICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoZmllbGQpO1xuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIGZpZWxkLnRleHRDb250ZW50ID0gYCR7ZmllbGQuZGF0YXNldC54Q29vcmR9LCR7ZmllbGQuZGF0YXNldC55Q29vcmR9YDtcbiAgICB9XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ib2FyZHNcIikuYXBwZW5kQ2hpbGQod3JhcHBlcik7XG4gICAgcmV0dXJuIHdyYXBwZXI7XG59XG5cbmNvbnN0IHBsYXllckZpZWxkcyA9IG1ha2VCb2FyZCgpO1xuY29uc3QgY29tcHV0ZXJGaWVsZHMgPSBtYWtlQm9hcmQoKTtcblxuY29uc3QgcmVzdWx0VGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmVzdWx0XCIpO1xuY29uc3QgcGxheWVyQm9hcmQgPSBkcmF3Qm9hcmQocGxheWVyRmllbGRzLCBcInBsYXllclwiKTtcbmNvbnN0IGNvbXB1dGVyQm9hcmQgPSBkcmF3Qm9hcmQoY29tcHV0ZXJGaWVsZHMsIFwiY29tcHV0ZXJcIik7XG5jb25zdCBwbGF5ZXJGaWVsZEljb25zID0gcGxheWVyQm9hcmQucXVlcnlTZWxlY3RvckFsbChcIi5maWVsZFwiKTtcbmNvbnN0IGNvbXB1dGVyRmllbGRJY29ucyA9IGNvbXB1dGVyQm9hcmQucXVlcnlTZWxlY3RvckFsbChcIi5maWVsZFwiKTtcbmNvbnN0IHJlc3RhcnRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Jlc3RhcnRcIik7XG5cbmxldCBwbGF5ZXIsIGNvbXB1dGVyO1xuXG5mdW5jdGlvbiBwbGF5ZXJTZXR1cCgpIHtcbiAgICBwbGF5ZXIgPSBuZXcgUGxheWVyKFwiWW91XCIpO1xuICAgIGNvbXB1dGVyID0gbmV3IFBsYXllcihcIkNvbXB1dGVyXCIsIHRydWUpO1xuICAgIGNvbXB1dGVyLnBsYWNlU2hpcHNSYW5kb21seSgpO1xuICAgIHBsYXllci5wbGFjZVNoaXBzUmFuZG9tbHkoKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlU2hvdChmaWVsZCkge1xuICAgIGZpZWxkID0gZmllbGQudGFyZ2V0O1xuICAgIGNvbnN0IHJlc3VsdCA9IHBsYXllci5zaG9vdChcbiAgICAgICAgY29tcHV0ZXIuYm9hcmQsXG4gICAgICAgICtmaWVsZC5kYXRhc2V0LnhDb29yZCxcbiAgICAgICAgK2ZpZWxkLmRhdGFzZXQueUNvb3JkXG4gICAgKTtcbiAgICBmaWVsZC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlU2hvdCk7XG4gICAgc3R5bGVTaG90cyhmaWVsZCwgcmVzdWx0KTtcbiAgICBpZiAoY29tcHV0ZXIuYm9hcmQuZ2FtZU92ZXIoKSkge1xuICAgICAgICByZXR1cm4gaGFuZGxlR2FtZU92ZXIoXCJ3aW5cIik7XG4gICAgfVxuICAgIGNvbXB1dGVyU2hvb3QoKTtcbn1cblxuZnVuY3Rpb24gY29tcHV0ZXJTaG9vdCgpIHtcbiAgICBjb25zdCByZXN1bHQgPSBjb21wdXRlci5yYW5kb21QbGF5KHBsYXllci5ib2FyZCk7XG4gICAgY29uc3QgZmllbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgLnBsYXllciBbZGF0YS14LWNvb3JkPVwiJHtyZXN1bHQueH1cIl1bZGF0YS15LWNvb3JkPVwiJHtyZXN1bHQueX1cIl1gXG4gICAgKTtcbiAgICBzdHlsZVNob3RzKGZpZWxkLCByZXN1bHQucmVzdWx0KTtcbiAgICBpZiAocGxheWVyLmJvYXJkLmdhbWVPdmVyKCkpIHtcbiAgICAgICAgcmV0dXJuIGhhbmRsZUdhbWVPdmVyKFwibG9zc1wiKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUdhbWVPdmVyKHJlc3VsdCkge1xuICAgIHJlc3VsdFRleHQudGV4dENvbnRlbnQgPSBgWW91ICR7cmVzdWx0ID09PSBcIndpblwiID8gXCJ3b25cIiA6IFwibG9zdFwifSFgO1xuICAgIGNvbXB1dGVyQm9hcmQuY2xhc3NMaXN0LmFkZChcImdhbWUtb3ZlclwiKTtcbn1cblxuZnVuY3Rpb24gc3R5bGVTaG90cyhmaWVsZCwgcmVzdWx0KSB7XG4gICAgaWYgKHJlc3VsdCA9PT0gXCJoaXRcIikge1xuICAgICAgICBmaWVsZC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xuICAgIH0gZWxzZSBpZiAocmVzdWx0ID09PSBcIm1pc3NcIikge1xuICAgICAgICBmaWVsZC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFkZFNob3RMaXN0ZW5lcnMoKSB7XG4gICAgZm9yIChsZXQgZmllbGQgb2YgY29tcHV0ZXJGaWVsZEljb25zKSB7XG4gICAgICAgIGZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVTaG90KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgcGxheWVyU2V0dXAoKTtcbiAgICBhZGRTaG90TGlzdGVuZXJzKCk7XG4gICAgZm9yIChsZXQgZmllbGQgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5maWVsZFwiKSkge1xuICAgICAgICBmaWVsZC5jbGFzc0xpc3QucmVtb3ZlKFwiaGl0XCIpO1xuICAgICAgICBmaWVsZC5jbGFzc0xpc3QucmVtb3ZlKFwibWlzc1wiKTtcbiAgICB9XG4gICAgY29tcHV0ZXJCb2FyZC5jbGFzc0xpc3QucmVtb3ZlKFwiZ2FtZS1vdmVyXCIpO1xuICAgIHJlc3VsdFRleHQudGV4dENvbnRlbnQgPSBcIlwiO1xuICAgIC8vIHBlZWtCb2F0cyhcImRlYnVnXCIpO1xuICAgIHBlZWtCb2F0cygpO1xufVxuXG5yZXN0YXJ0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBpbml0aWFsaXplKTtcblxuZnVuY3Rpb24gcGVla0JvYXRzKGRlYnVnKSB7XG4gICAgaWYgKGRlYnVnID09PSBcImRlYnVnXCIpIHtcbiAgICAgICAgZm9yIChsZXQgZmllbGQgb2YgY29tcHV0ZXJGaWVsZEljb25zKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgY29tcHV0ZXIuYm9hcmQuZmllbGRzW2ZpZWxkLmRhdGFzZXQueENvb3JkXVtcbiAgICAgICAgICAgICAgICAgICAgZmllbGQuZGF0YXNldC55Q29vcmRcbiAgICAgICAgICAgICAgICBdLnNoaXBcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGZpZWxkLnRleHRDb250ZW50ID0gXCJYXCI7XG4gICAgICAgICAgICB9IGVsc2UgZmllbGQudGV4dENvbnRlbnQgPSBcIlwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAobGV0IGZpZWxkIG9mIHBsYXllckZpZWxkSWNvbnMpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgcGxheWVyLmJvYXJkLmZpZWxkc1tmaWVsZC5kYXRhc2V0LnhDb29yZF1bZmllbGQuZGF0YXNldC55Q29vcmRdLnNoaXBcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBmaWVsZC50ZXh0Q29udGVudCA9IFwiWFwiO1xuICAgICAgICB9IGVsc2UgZmllbGQudGV4dENvbnRlbnQgPSBcIlwiO1xuICAgIH1cbn1cblxuZXhwb3J0IHsgaW5pdGlhbGl6ZSB9O1xuIiwiaW1wb3J0IEdhbWVCb2FyZCBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcbmltcG9ydCBTaGlwIGZyb20gXCIuL3NoaXBcIjtcblxuZnVuY3Rpb24gUGxheWVyKG5hbWUsIGNvbXB1dGVyID0gZmFsc2UpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuYm9hcmQgPSBuZXcgR2FtZUJvYXJkKCk7XG5cbiAgICB0aGlzLnNoaXBzID0gW1xuICAgICAgICBuZXcgU2hpcCgxKSxcbiAgICAgICAgbmV3IFNoaXAoMiksXG4gICAgICAgIG5ldyBTaGlwKDMpLFxuICAgICAgICBuZXcgU2hpcCg0KSxcbiAgICAgICAgbmV3IFNoaXAoNSksXG4gICAgXTtcblxuICAgIGlmIChjb21wdXRlcikge1xuICAgICAgICB0aGlzLnJhbmRvbVBsYXkgPSAoYm9hcmQpID0+IHtcbiAgICAgICAgICAgIGxldCB2YWxpZE1vdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHdoaWxlICghdmFsaWRNb3ZlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmFuZG9tWCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgICAgICAgICAgICBjb25zdCByYW5kb21ZID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNob3QgPSBib2FyZC5yZWNlaXZlQXR0YWNrKHJhbmRvbVgsIHJhbmRvbVkpO1xuICAgICAgICAgICAgICAgIGlmIChzaG90ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZE1vdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyB4OiByYW5kb21YLCB5OiByYW5kb21ZLCByZXN1bHQ6IHNob3QgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zaG9vdCA9IChib2FyZCwgeCwgeSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGJvYXJkLnJlY2VpdmVBdHRhY2soeCwgeSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdGhpcy5wbGFjZVNoaXBzUmFuZG9tbHkgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuYm9hcmQucGxhY2VSYW5kb21seSh0aGlzLnNoaXBzKTtcbiAgICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XG4iLCJmdW5jdGlvbiBTaGlwKGxlbmd0aCkge1xuICAgIHRoaXMuaGl0cyA9IDA7XG4gICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgdGhpcy5uYW1lID0gX2dldE5hbWUoKTtcbiAgICBmdW5jdGlvbiBfZ2V0TmFtZSgpIHtcbiAgICAgICAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJBaXJjcmFmdCBjYXJyaWVyXCI7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiQmF0dGxlc2hpcFwiO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIkRlc3Ryb3llclwiO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIlN1Ym1hcmluZVwiO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIlBhdHJvbCBib2F0XCI7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRoaXMuaXNTdW5rID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oaXRzID49IHRoaXMubGVuZ3RoO1xuICAgIH07XG4gICAgdGhpcy5oaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaGl0cysrO1xuICAgIH07XG5cbiAgICB0aGlzLmlzUGxhY2VkID0gZmFsc2U7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXA7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGluaXRpYWxpemUgfSBmcm9tIFwiLi9ndWlcIjtcblxuaW5pdGlhbGl6ZSgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9