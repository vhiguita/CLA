import { NgOption } from './ng-select.types';
export declare class SelectionModel {
    private _selected;
    readonly value: NgOption[];
    select(item: NgOption, multiple: boolean): void;
    unselect(item: NgOption, multiple: boolean): void;
    clear(): void;
    private _setChildrenSelectedState(children, selected);
    private _removeParentChildren(parent);
    private _removeParent(parent);
}
