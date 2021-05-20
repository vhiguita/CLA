import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDualListboxComponent } from './components/index/index.component';
var NgxDualListboxModule = (function () {
    function NgxDualListboxModule() {
    }
    NgxDualListboxModule.forRoot = function () {
        return {
            ngModule: NgxDualListboxModule
        };
    };
    NgxDualListboxModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [NgxDualListboxComponent],
                    imports: [CommonModule],
                    exports: [NgxDualListboxComponent]
                },] },
    ];
    /** @nocollapse */
    NgxDualListboxModule.ctorParameters = function () { return []; };
    return NgxDualListboxModule;
}());
export { NgxDualListboxModule };
//# sourceMappingURL=ngx-dual-listbox.module.js.map