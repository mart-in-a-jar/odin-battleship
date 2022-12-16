/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
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

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWUsWUFBWSxJQUFJLGVBQWUsSUFBSSxlQUFlLElBQUksTUFBTTs7QUFFM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCIsInNvdXJjZXMiOlsid2VicGFjazovL29kaW4tYmF0dGxlc2hpcC8uL3NyYy9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgb2JqMSA9IHtcbiAgICBpc1N1bms6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbn07XG5jb25zdCBvYmoyID0ge1xuICAgIGlzU3VuazogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbn07XG5jb25zdCBhcnIgPSBbeyBhOiAxLCBjOiAyIH0sIHsgYTogMSwgYjogb2JqMSB9LCB7IGE6IDEsIGI6IG9iajIgfSwgeyBhOiAxIH1dO1xuXG5jb25zb2xlLmxvZyhcbiAgICBhcnIuc29tZSgoZmllbGQpID0+IHtcbiAgICAgICAgaWYgKGZpZWxkLmIpIHtcbiAgICAgICAgICAgIHJldHVybiAhZmllbGQuYi5pc1N1bmsoKTtcbiAgICAgICAgfVxuICAgIH0pXG4pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9