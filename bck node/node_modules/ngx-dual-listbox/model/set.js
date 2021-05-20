export function belongs(item, array, key) {
    return !!array.find(function (i) { return i[key] === item[key]; });
}
export function difference(arrayOne, arrayTwo, key) {
    return arrayOne.filter(function (i) {
        return !belongs(i, arrayTwo, key);
    });
}
//# sourceMappingURL=set.js.map