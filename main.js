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
/* harmony export */   "initialize": () => (/* binding */ initialize),
/* harmony export */   "peekBoats": () => (/* binding */ peekBoats)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQSxvQkFBb0IsUUFBUTtBQUM1QjtBQUNBLHdCQUF3QixRQUFRO0FBQ2hDLDRCQUE0QixjQUFjO0FBQzFDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGlCQUFpQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixpQkFBaUI7QUFDN0M7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLDRCQUE0QixpQkFBaUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdCQUF3QixRQUFRO0FBQ2hDO0FBQ0EsNEJBQTRCLFFBQVE7QUFDcEM7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxTQUFTLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdEZLOztBQUU5QjtBQUNBOztBQUVBLG9CQUFvQixRQUFRO0FBQzVCLHdCQUF3QixRQUFRO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQ0FBa0MscUJBQXFCLEdBQUcscUJBQXFCO0FBQy9FO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsaUJBQWlCLCtDQUFNO0FBQ3ZCLG1CQUFtQiwrQ0FBTTtBQUN6QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsU0FBUyxtQkFBbUIsU0FBUztBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQ0FBb0Msa0NBQWtDO0FBQ3RFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRWlDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ25JRztBQUNWOztBQUUxQjtBQUNBO0FBQ0EscUJBQXFCLGtEQUFTOztBQUU5QjtBQUNBLFlBQVksNkNBQUk7QUFDaEIsWUFBWSw2Q0FBSTtBQUNoQixZQUFZLDZDQUFJO0FBQ2hCLFlBQVksNkNBQUk7QUFDaEIsWUFBWSw2Q0FBSTtBQUNoQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlLE1BQU0sRUFBQzs7Ozs7Ozs7Ozs7Ozs7O0FDdkN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUVBQWUsSUFBSSxFQUFDOzs7Ozs7O1VDOUJwQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTm1DOztBQUVuQyxnREFBVSIsInNvdXJjZXMiOlsid2VicGFjazovL29kaW4tYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vb2Rpbi1iYXR0bGVzaGlwLy4vc3JjL2d1aS5qcyIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL29kaW4tYmF0dGxlc2hpcC8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL29kaW4tYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9vZGluLWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL29kaW4tYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL29kaW4tYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL29kaW4tYmF0dGxlc2hpcC8uL3NyYy9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gR2FtZUJvYXJkKCkge1xuICAgIGNvbnN0IGJvYXJkID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgIGJvYXJkW2ldID0gW107XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICAgICAgYm9hcmRbaV0ucHVzaCh7IGlzSGl0OiBmYWxzZSB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucGxhY2VTaGlwID0gKHNoaXAsIHgsIHksIGRpcmVjdGlvbikgPT4ge1xuICAgICAgICBpZiAoc2hpcC5pc1BsYWNlZCkgcmV0dXJuIFwiYWxyZWFkeSBwbGFjZWRcIjtcbiAgICAgICAgaWYgKCFjaGVja1BsYWNlbWVudChzaGlwLCB4LCB5LCBkaXJlY3Rpb24pKSByZXR1cm4gXCJpbnZhbGlkIHBsYWNlbWVudFwiO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJvYXJkW3ggKyAoZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIiA/IGkgOiAwKV1bXG4gICAgICAgICAgICAgICAgeSArIChkaXJlY3Rpb24gPT09IFwidmVydGljYWxcIiA/IGkgOiAwKVxuICAgICAgICAgICAgXS5zaGlwID0gc2hpcDtcbiAgICAgICAgfVxuICAgICAgICBzaGlwLmlzUGxhY2VkID0gdHJ1ZTtcbiAgICB9O1xuXG4gICAgdGhpcy5wbGFjZVJhbmRvbWx5ID0gKHNoaXBzKSA9PiB7XG4gICAgICAgIGZvciAobGV0IHNoaXAgb2Ygc2hpcHMpIHtcbiAgICAgICAgICAgIHdoaWxlICghc2hpcC5pc1BsYWNlZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJhbmRvbVggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmFuZG9tWSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgICAgICAgICAgICBjb25zdCByYW5kb21EaXJlY3Rpb24gPVxuICAgICAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpIDwgMC41ID8gXCJob3Jpem9udGFsXCIgOiBcInZlcnRpY2FsXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGFjZVNoaXAoc2hpcCwgcmFuZG9tWCwgcmFuZG9tWSwgcmFuZG9tRGlyZWN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLnJlY2VpdmVBdHRhY2sgPSAoeCwgeSkgPT4ge1xuICAgICAgICBjb25zdCBmaWVsZCA9IGJvYXJkW3hdW3ldO1xuICAgICAgICBpZiAoZmllbGQuaXNIaXQpIHJldHVybiBmYWxzZTtcbiAgICAgICAgZmllbGQuaXNIaXQgPSB0cnVlO1xuICAgICAgICBpZiAoZmllbGQuc2hpcCkge1xuICAgICAgICAgICAgZmllbGQuc2hpcC5oaXQoKTtcbiAgICAgICAgICAgIHJldHVybiBcImhpdFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIm1pc3NcIjtcbiAgICB9O1xuXG4gICAgdGhpcy5nYW1lT3ZlciA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgdW5zdW5rU2hpcHMgPSBib2FyZC5zb21lKChyb3cpID0+IHtcbiAgICAgICAgICAgIHJldHVybiByb3cuc29tZSgoZmllbGQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZmllbGQuc2hpcCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIWZpZWxkLnNoaXAuaXNTdW5rKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodW5zdW5rU2hpcHMpIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrUGxhY2VtZW50KHNoaXAsIHgsIHksIGRpcmVjdGlvbikge1xuICAgICAgICBpZiAoeCA+IDkgfHwgeSA+IDkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgICAgICAgIGlmICh4ICsgc2hpcC5sZW5ndGggPiAxMCB8fCB5ID4gOSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJvYXJkW3ggKyBpXVt5XS5zaGlwKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSBcInZlcnRpY2FsXCIpIHtcbiAgICAgICAgICAgIGlmICh5ICsgc2hpcC5sZW5ndGggPiAxMCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJvYXJkW3hdW3kgKyBpXS5zaGlwKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5sb2cgPSAoKSA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgICAgICAgbGV0IHN0cmluZyA9IFwifFwiO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgICAgICAgICAgc3RyaW5nICs9IGAgJHtcbiAgICAgICAgICAgICAgICAgICAgYm9hcmRbal1baV0uc2hpcD8ubmFtZS5zbGljZSgwLCA3KSB8fCBcIiAgICAgICBcIlxuICAgICAgICAgICAgICAgIH0gfGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzdHJpbmcpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCItXCIucmVwZWF0KDEwMCkpXG4gICAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMuZmllbGRzID0gYm9hcmQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVCb2FyZDtcbiIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vcGxheWVyXCI7XG5cbmZ1bmN0aW9uIG1ha2VCb2FyZCgpIHtcbiAgICBjb25zdCBib2FyZCA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICAgICAgY29uc3QgZmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgZmllbGQuZGF0YXNldC54Q29vcmQgPSBqO1xuICAgICAgICAgICAgZmllbGQuZGF0YXNldC55Q29vcmQgPSBpO1xuICAgICAgICAgICAgZmllbGQuY2xhc3NMaXN0LmFkZChcImJvYXJkXCIsIFwiZmllbGRcIik7XG5cbiAgICAgICAgICAgIGJvYXJkLnB1c2goZmllbGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJvYXJkO1xufVxuXG5mdW5jdGlvbiBkcmF3Qm9hcmQoYm9hcmQsIHBsYXllcikge1xuICAgIGNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHdyYXBwZXIuY2xhc3NMaXN0LmFkZChcImJvYXJkXCIsIHBsYXllcik7XG4gICAgZm9yIChsZXQgZmllbGQgb2YgYm9hcmQpIHtcbiAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChmaWVsZCk7XG5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gZmllbGQudGV4dENvbnRlbnQgPSBgJHtmaWVsZC5kYXRhc2V0LnhDb29yZH0sJHtmaWVsZC5kYXRhc2V0LnlDb29yZH1gO1xuICAgIH1cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJvYXJkc1wiKS5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcbiAgICByZXR1cm4gd3JhcHBlcjtcbn1cblxuY29uc3QgcGxheWVyRmllbGRzID0gbWFrZUJvYXJkKCk7XG5jb25zdCBjb21wdXRlckZpZWxkcyA9IG1ha2VCb2FyZCgpO1xuXG5jb25zdCByZXN1bHRUZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yZXN1bHRcIik7XG5jb25zdCBwbGF5ZXJCb2FyZCA9IGRyYXdCb2FyZChwbGF5ZXJGaWVsZHMsIFwicGxheWVyXCIpO1xuY29uc3QgY29tcHV0ZXJCb2FyZCA9IGRyYXdCb2FyZChjb21wdXRlckZpZWxkcywgXCJjb21wdXRlclwiKTtcbmNvbnN0IHBsYXllckZpZWxkSWNvbnMgPSBwbGF5ZXJCb2FyZC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZpZWxkXCIpO1xuY29uc3QgY29tcHV0ZXJGaWVsZEljb25zID0gY29tcHV0ZXJCb2FyZC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZpZWxkXCIpO1xuY29uc3QgcmVzdGFydEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVzdGFydFwiKTtcblxubGV0IHBsYXllciwgY29tcHV0ZXI7XG5cbmZ1bmN0aW9uIHBsYXllclNldHVwKCkge1xuICAgIHBsYXllciA9IG5ldyBQbGF5ZXIoXCJZb3VcIik7XG4gICAgY29tcHV0ZXIgPSBuZXcgUGxheWVyKFwiQ29tcHV0ZXJcIiwgdHJ1ZSk7XG4gICAgY29tcHV0ZXIucGxhY2VTaGlwc1JhbmRvbWx5KCk7XG4gICAgcGxheWVyLnBsYWNlU2hpcHNSYW5kb21seSgpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVTaG90KGZpZWxkKSB7XG4gICAgZmllbGQgPSBmaWVsZC50YXJnZXQ7XG4gICAgY29uc3QgcmVzdWx0ID0gcGxheWVyLnNob290KFxuICAgICAgICBjb21wdXRlci5ib2FyZCxcbiAgICAgICAgK2ZpZWxkLmRhdGFzZXQueENvb3JkLFxuICAgICAgICArZmllbGQuZGF0YXNldC55Q29vcmRcbiAgICApO1xuICAgIGZpZWxkLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVTaG90KTtcbiAgICBzdHlsZVNob3RzKGZpZWxkLCByZXN1bHQpO1xuICAgIGlmIChjb21wdXRlci5ib2FyZC5nYW1lT3ZlcigpKSB7XG4gICAgICAgIHJldHVybiBoYW5kbGVHYW1lT3ZlcihcIndpblwiKTtcbiAgICB9XG4gICAgY29tcHV0ZXJTaG9vdCgpO1xufVxuXG5mdW5jdGlvbiBjb21wdXRlclNob290KCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGNvbXB1dGVyLnJhbmRvbVBsYXkocGxheWVyLmJvYXJkKTtcbiAgICBjb25zdCBmaWVsZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAucGxheWVyIFtkYXRhLXgtY29vcmQ9XCIke3Jlc3VsdC54fVwiXVtkYXRhLXktY29vcmQ9XCIke3Jlc3VsdC55fVwiXWBcbiAgICApO1xuICAgIHN0eWxlU2hvdHMoZmllbGQsIHJlc3VsdC5yZXN1bHQpO1xuICAgIGlmIChwbGF5ZXIuYm9hcmQuZ2FtZU92ZXIoKSkge1xuICAgICAgICByZXR1cm4gaGFuZGxlR2FtZU92ZXIoXCJsb3NzXCIpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaGFuZGxlR2FtZU92ZXIocmVzdWx0KSB7XG4gICAgcmVzdWx0VGV4dC50ZXh0Q29udGVudCA9IGBZb3UgJHtyZXN1bHQgPT09IFwid2luXCIgPyBcIndvblwiIDogXCJsb3N0XCJ9IWA7XG4gICAgY29tcHV0ZXJCb2FyZC5jbGFzc0xpc3QuYWRkKFwiZ2FtZS1vdmVyXCIpO1xufVxuXG5mdW5jdGlvbiBzdHlsZVNob3RzKGZpZWxkLCByZXN1bHQpIHtcbiAgICBpZiAocmVzdWx0ID09PSBcImhpdFwiKSB7XG4gICAgICAgIGZpZWxkLmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XG4gICAgfSBlbHNlIGlmIChyZXN1bHQgPT09IFwibWlzc1wiKSB7XG4gICAgICAgIGZpZWxkLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYWRkU2hvdExpc3RlbmVycygpIHtcbiAgICBmb3IgKGxldCBmaWVsZCBvZiBjb21wdXRlckZpZWxkSWNvbnMpIHtcbiAgICAgICAgZmllbGQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZVNob3QpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBwbGF5ZXJTZXR1cCgpO1xuICAgIGFkZFNob3RMaXN0ZW5lcnMoKTtcbiAgICBmb3IgKGxldCBmaWVsZCBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZpZWxkXCIpKSB7XG4gICAgICAgIGZpZWxkLmNsYXNzTGlzdC5yZW1vdmUoXCJoaXRcIik7XG4gICAgICAgIGZpZWxkLmNsYXNzTGlzdC5yZW1vdmUoXCJtaXNzXCIpO1xuICAgIH1cbiAgICBjb21wdXRlckJvYXJkLmNsYXNzTGlzdC5yZW1vdmUoXCJnYW1lLW92ZXJcIik7XG4gICAgcmVzdWx0VGV4dC50ZXh0Q29udGVudCA9IFwiXCI7XG4gICAgcGVla0JvYXRzKFwiZGVidWdcIik7XG59XG5cbnJlc3RhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGluaXRpYWxpemUpO1xuXG5mdW5jdGlvbiBwZWVrQm9hdHMoZGVidWcpIHtcbiAgICBpZiAoZGVidWcgPT09IFwiZGVidWdcIikge1xuICAgICAgICBmb3IgKGxldCBmaWVsZCBvZiBjb21wdXRlckZpZWxkSWNvbnMpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBjb21wdXRlci5ib2FyZC5maWVsZHNbZmllbGQuZGF0YXNldC54Q29vcmRdW1xuICAgICAgICAgICAgICAgICAgICBmaWVsZC5kYXRhc2V0LnlDb29yZFxuICAgICAgICAgICAgICAgIF0uc2hpcFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgZmllbGQudGV4dENvbnRlbnQgPSBcIlhcIjtcbiAgICAgICAgICAgIH0gZWxzZSBmaWVsZC50ZXh0Q29udGVudCA9IFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yIChsZXQgZmllbGQgb2YgcGxheWVyRmllbGRJY29ucykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICBwbGF5ZXIuYm9hcmQuZmllbGRzW2ZpZWxkLmRhdGFzZXQueENvb3JkXVtmaWVsZC5kYXRhc2V0LnlDb29yZF0uc2hpcFxuICAgICAgICApIHtcbiAgICAgICAgICAgIGZpZWxkLnRleHRDb250ZW50ID0gXCJYXCI7XG4gICAgICAgIH0gZWxzZSBmaWVsZC50ZXh0Q29udGVudCA9IFwiXCI7XG4gICAgfVxufVxuXG5leHBvcnQgeyBpbml0aWFsaXplLCBwZWVrQm9hdHMgfTtcbiIsImltcG9ydCBHYW1lQm9hcmQgZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmZ1bmN0aW9uIFBsYXllcihuYW1lLCBjb21wdXRlciA9IGZhbHNlKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmJvYXJkID0gbmV3IEdhbWVCb2FyZCgpO1xuXG4gICAgdGhpcy5zaGlwcyA9IFtcbiAgICAgICAgbmV3IFNoaXAoMSksXG4gICAgICAgIG5ldyBTaGlwKDIpLFxuICAgICAgICBuZXcgU2hpcCgzKSxcbiAgICAgICAgbmV3IFNoaXAoNCksXG4gICAgICAgIG5ldyBTaGlwKDUpLFxuICAgIF07XG5cbiAgICBpZiAoY29tcHV0ZXIpIHtcbiAgICAgICAgdGhpcy5yYW5kb21QbGF5ID0gKGJvYXJkKSA9PiB7XG4gICAgICAgICAgICBsZXQgdmFsaWRNb3ZlID0gZmFsc2U7XG4gICAgICAgICAgICB3aGlsZSAoIXZhbGlkTW92ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJhbmRvbVggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmFuZG9tWSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzaG90ID0gYm9hcmQucmVjZWl2ZUF0dGFjayhyYW5kb21YLCByYW5kb21ZKTtcbiAgICAgICAgICAgICAgICBpZiAoc2hvdCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRNb3ZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgeDogcmFuZG9tWCwgeTogcmFuZG9tWSwgcmVzdWx0OiBzaG90IH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2hvb3QgPSAoYm9hcmQsIHgsIHkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBib2FyZC5yZWNlaXZlQXR0YWNrKHgsIHkpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHRoaXMucGxhY2VTaGlwc1JhbmRvbWx5ID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmJvYXJkLnBsYWNlUmFuZG9tbHkodGhpcy5zaGlwcyk7XG4gICAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiZnVuY3Rpb24gU2hpcChsZW5ndGgpIHtcbiAgICB0aGlzLmhpdHMgPSAwO1xuICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgIHRoaXMubmFtZSA9IF9nZXROYW1lKCk7XG4gICAgZnVuY3Rpb24gX2dldE5hbWUoKSB7XG4gICAgICAgIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiQWlyY3JhZnQgY2FycmllclwiO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIHJldHVybiBcIkJhdHRsZXNoaXBcIjtcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJEZXN0cm95ZXJcIjtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJTdWJtYXJpbmVcIjtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJQYXRyb2wgYm9hdFwiO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmlzU3VuayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGl0cyA+PSB0aGlzLmxlbmd0aDtcbiAgICB9O1xuICAgIHRoaXMuaGl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmhpdHMrKztcbiAgICB9O1xuXG4gICAgdGhpcy5pc1BsYWNlZCA9IGZhbHNlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBpbml0aWFsaXplIH0gZnJvbSBcIi4vZ3VpXCI7XG5cbmluaXRpYWxpemUoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==