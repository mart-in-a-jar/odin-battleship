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

function drawBoard(board) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("board", "wrapper");
    for (let field of board) {
        wrapper.appendChild(field);

        //
        field.textContent = `${field.dataset.xCoord},${field.dataset.yCoord}`;
    }
    document.body.appendChild(wrapper);
}

drawBoard(makeBoard());

export { makeBoard };
