import Player from "./player";

function game() {
    const player = new Player("You");
    const computer = new Player("Computer");
    let humanTurn = true;

    computer.placeShipsRandomly();

    // Change this to allow manual placement
    player.placeShipsRandomly();

    
}
