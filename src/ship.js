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

export default Ship;
