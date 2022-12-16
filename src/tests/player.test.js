import Player from "../player";
import Ship from "../ship";

describe("Player tests", () => {
    let human, computer;

    beforeEach(() => {
        human = new Player("Human");
        computer = new Player("Computer", true);
    });
    test("Create player", () => {
        const player = new Player("Charles");
        expect(player.name).toBe("Charles");
        expect(player.board.fields[2][1].isHit).toBe(false);
    });
    test("Make random play", () => {
        computer.randomPlay(human.board);

        function countHits() {
            let hits = 0;
            for (let row of human.board.fields) {
                for (let field of row) {
                    if (field.isHit) hits++;
                }
            }
            return hits;
        }
        expect(countHits()).toBe(1);

        human.board.placeShip(new Ship(5), 0, 0, "horizontal");
        human.board.placeShip(new Ship(4), 0, 2, "horizontal");
        human.board.placeShip(new Ship(3), 0, 4, "horizontal");
        human.board.placeShip(new Ship(2), 0, 6, "horizontal");
        human.board.placeShip(new Ship(1), 0, 8, "horizontal");

        for (let i = 0; i < 50; i++) {
            computer.randomPlay(human.board);
        }
        expect(countHits()).toBe(51);

        for (let i = 0; i < 49; i++) {
            computer.randomPlay(human.board);
        }

        expect(countHits()).toBe(100);
    });

    test("Make play", () => {
        human.shoot(computer.board, 5, 5);
        expect(computer.board.fields[5][5].isHit).toBe(true);
    });
});
