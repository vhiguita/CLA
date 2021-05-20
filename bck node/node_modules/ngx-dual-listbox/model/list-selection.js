var ListSelectionImpl = (function () {
    function ListSelectionImpl(totalItems) {
        this.totalItems = totalItems;
        this._selectedItems = [];
    }
    ListSelectionImpl.prototype.select = function (item) {
        if (!this.isSelected(item)) {
            this._selectedItems.push(item);
        }
    };
    ListSelectionImpl.prototype.selectAll = function () {
        this._selectedItems = this.totalItems;
    };
    ListSelectionImpl.prototype.unselect = function (item) {
        if (!this.isSelected(item)) {
            throw new Error("Cannot unselect an item that is not selected");
        }
        this._selectedItems = this._selectedItems.filter(function (e) { return e !== item; });
    };
    ListSelectionImpl.prototype.isSelected = function (item) {
        return !!this._selectedItems.find(function (e) { return e === item; });
    };
    Object.defineProperty(ListSelectionImpl.prototype, "selectedItems", {
        get: function () {
            return this._selectedItems;
        },
        enumerable: true,
        configurable: true
    });
    return ListSelectionImpl;
}());
export { ListSelectionImpl };
//# sourceMappingURL=list-selection.js.map