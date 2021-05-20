import { OnInit, EventEmitter, TemplateRef } from '@angular/core';
import { ListSelection } from '../../model/list-selection';
export declare class NgxDualListboxComponent implements OnInit {
    key: string;
    items: any[];
    _selectedItems: any[];
    selectedItemsChange: EventEmitter<any[]>;
    minHeight: string;
    templateItem: TemplateRef<any>;
    templateArrowLeft: TemplateRef<any>;
    templateArrowRight: TemplateRef<any>;
    availableItems: ListSelection;
    selectedItems: ListSelection;
    ngOnInit(): void;
    select(): void;
    return(): void;
}
