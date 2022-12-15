import Ship from "../ship";

describe("Ship generation", () => {
    let ship;
    beforeAll(() => {
        ship = new Ship(5);
    });
    test("Generate ship", () => {
        expect(ship.name).toBe("Aircraft carrier");
        expect(ship.length).toBe(5);
        expect(ship.hits).toBe(0);
        expect(ship.isSunk()).toBeFalsy();
    });
    test("Sink ship", () => {
        ship.hit();
        ship.hit();
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBeTruthy();
    });
});
