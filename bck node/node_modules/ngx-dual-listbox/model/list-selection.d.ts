export interface ListSelection {
    selectedItems: any[];
    totalItems: any[];
    select(item: any): void;
    selectAll(): void;
    unselect(item: any): void;
    isSelected(item: any): boolean;
}
export declare class ListSelectionImpl implements ListSelection {
    readonly totalItems: any[];
    private _selectedItems;
    constructor(totalItems: any[]);
    select(item: any): void;
    selectAll(): void;
    unselect(item: any): void;
    isSelected(item: any): boolean;
    readonly selectedItems: any[];
}
