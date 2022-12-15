import GameBoard from "../gameboard";

describe("Gameboard tests", () => {
    let board;
    beforeAll(() => {
        board = new GameBoard();
    });
    test("Ships gets created", () => {
        expect(board.ships.every((ship) => ship.isPlaced)).toBeFalsy();
    });
    test("Place ship", () => {
        board.placeShip(board.ships[2], 2, 2, "horizontal");
        expect(board.placeShip(board.ships[2], 4, 2, "horizontal")).toBe(
            "already placed"
        );
    });
});
