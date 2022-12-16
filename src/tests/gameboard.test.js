import GameBoard from "../gameboard";
import Ship from "../ship";

describe("Gameboard tests", () => {
    let board, ships;
    beforeAll(() => {
        board = new GameBoard();
        ships = [
            new Ship(1),
            new Ship(2),
            new Ship(3),
            new Ship(4),
            new Ship(5),
        ];
    });
    test("Ships gets created", () => {
        expect(ships.every((ship) => ship.isPlaced)).toBeFalsy();
    });
    test("Place ship outside of board", () => {
        expect(board.placeShip(ships[2], 8, 2, "horizontal")).toBe(
            "invalid placement"
        );
    });
    test("Place an already placed ship", () => {
        board.placeShip(ships[2], 2, 2, "horizontal");
        expect(board.placeShip(ships[2], 4, 2, "horizontal")).toBe(
            "already placed"
        );
    });
    test("Place a ship on top of another", () => {
        expect(board.placeShip(ships[3], 0, 2, "horizontal")).toBe(
            "invalid placement"
        );
    });
    test("Place a ship on free space", () => {
        board.placeShip(ships[4], 0, 9, "horizontal");
        const fields = [
            board.fields[0][9],
            board.fields[1][9],
            board.fields[2][9],
            board.fields[3][9],
            board.fields[4][9],
        ];
        expect(fields.every((field) => field.ship)).toBeTruthy();
    });
    test("Shoot and miss", () => {
        expect(board.receiveAttack(0, 0)).toBe("miss");
        expect(board.fields[0][0].isHit).toBe(true);
        expect(board.fields[0][0].ship).toBeFalsy();
    });
    test("Shoot and hit", () => {
        expect(board.receiveAttack(2, 9)).toBe("hit");
        expect(board.fields[2][9].ship.hits).toBe(1);
        expect(board.fields[2][9].isHit).toBe(true);
    });
    test("Shoot an already shot field", () => {
        expect(board.receiveAttack(2, 9)).toBe(false);
        expect(board.fields[2][9].ship.hits).toBe(1);
    });
    test("Sink a ship", () => {
        expect(board.receiveAttack(0, 9)).toBe("hit");
        expect(board.fields[2][9].ship.hits).toBe(2);
        expect(board.receiveAttack(1, 9)).toBe("hit");
        expect(board.fields[2][9].ship.hits).toBe(3);
        expect(board.receiveAttack(3, 9)).toBe("hit");
        expect(board.fields[2][9].ship.hits).toBe(4);
        expect(board.receiveAttack(4, 9)).toBe("hit");
        expect(board.fields[2][9].ship.hits).toBe(5);
        expect(board.fields[0][9].ship.isSunk()).toBe(true);
    });

    test("Game is over", () => {
        const board = new GameBoard();
        board.placeShip(new Ship(2), 0, 0, "vertical");
        expect(board.gameOver()).toBe(false);
        board.receiveAttack(0, 0);
        board.receiveAttack(0, 1);
        expect(board.gameOver()).toBe(true);
    });
});
