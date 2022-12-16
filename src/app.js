const obj1 = {
    isSunk: function () {
        return true;
    },
};
const obj2 = {
    isSunk: function () {
        return false;
    },
};
const arr = [{ a: 1, c: 2 }, { a: 1, b: obj1 }, { a: 1, b: obj2 }, { a: 1 }];

console.log(
    arr.some((field) => {
        if (field.b) {
            return !field.b.isSunk();
        }
    })
);
