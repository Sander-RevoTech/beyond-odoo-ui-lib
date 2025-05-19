import * as i0 from '@angular/core';
import { Injectable, signal, inject, Input, Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { BydFormComponent } from '@beyond/form-basic';
import { InputPanel, InputDatePicker, InputDropdown, InputNumber, InputTextBox } from '@beyond/form-model';
import { isNonNullable, BydBaseComponent, TypedTemplateDirective } from '@beyond/utils';
import { of, BehaviorSubject, firstValueFrom, filter, tap, mergeMap, map } from 'rxjs';
import { TabulatorFull } from 'tabulator-tables';
import { NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@beyond/translation';
import { BydBadgeComponent, BydTextComponent } from '@beyond/ui';
import { BydBaseOdooService } from '@beyond/odoo';

var ParameterType;
(function (ParameterType) {
    ParameterType[ParameterType["Unknown"] = 0] = "Unknown";
    ParameterType[ParameterType["String"] = 1] = "String";
    ParameterType[ParameterType["Number"] = 2] = "Number";
    ParameterType[ParameterType["Boolean"] = 3] = "Boolean";
    ParameterType[ParameterType["DateTime"] = 4] = "DateTime";
    ParameterType[ParameterType["Enum"] = 5] = "Enum";
})(ParameterType || (ParameterType = {}));

class BydGridFormService {
    constructor() { }
    getFiltersForm(model) {
        const keys = Object.keys(model.cols);
        if (!keys || keys.length === 0) {
            return [];
        }
        return [
            new InputPanel({
                key: 'main-panel',
                label: `grid.${model.scope}.title`,
                class: 'p-space-sm',
                children: keys.map(key => model.cols[key].getInputForm()).filter(isNonNullable),
            }),
        ];
    }
    formatFiltersForm(model, data) {
        return Object.keys(model.cols).reduce((acc, key) => {
            const filter = model.cols[key].formatInputForm(data);
            if (!filter) {
                return acc;
            }
            return [...acc, filter];
        }, []);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridFormService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridFormService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridFormService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

const operatorMap = {
    contains: '%',
    greaterThan: '>',
    lessThan: '<',
    equals: '=',
    notEqual: '!=',
    greaterThanOrEqual: '>=',
    lessThanOrEqual: '<=',
};
class BaseCol {
    data;
    model;
    get key() {
        return this.data.col.name;
    }
    get options() {
        return this.data.options;
    }
    get inputLabel() {
        return `grid.${this.data.scope}.core.${this.data.col.name}`;
    }
    constructor(data, model) {
        this.data = data;
        this.model = model;
    }
    getColDef() {
        return {
            field: this.key,
            title: this.inputLabel,
            headerFilter: 'input',
        };
    }
    getInputForm() {
        return null;
    }
    formatInputForm(data) {
        const value = data[this.key];
        if (!value) {
            return null;
        }
        return {
            field: this.key,
            type: '=',
            value: value,
        };
    }
}
// export class BaseFilterComponent<T extends AdvancedFilterModel, U extends BaseCol<T>> implements IFilter {
//   public input: InputBase<any> | null = null;
//   protected _col: U | null = null;
//   protected _model: T | null = null;
//   protected _params: IFilterParams<unknown, GridContext> | null = null;
//   agInit(params: IFilterParams) {
//     this._params = params;
//     this._col = params.context.cols[params.column.getColId()] ?? null;
//     this.setInput();
//   }
//   isFilterActive() {
//     this.setInput();
//     return !!this._model;
//   }
//   getModel() {
//     return this._model;
//   }
//   setModel(model: any): void | AgPromise<void> {
//     this._model = model;
//   }
//   refresh?(newParams: IFilterParams): boolean {
//     console.log('Method refresh not implemented.');
//     return true;
//   }
//   doesFilterPass(params: IDoesFilterPassParams): boolean {
//     if (!this._col?.key) {
//       return true;
//     }
//     const data = params.data[this._col?.key];
//     if (!data || !this._model) {
//       return true;
//     }
//     return this._validateDataAgainstModel(data, this._model);
//   }
//   getTags(): ActiveFilterTag[] {
//     return [];
//   }
//   getModelAsString(model: ISimpleFilter): string {
//     return '';
//   }
//   apply(data: any) {
//     this.setModel(this._col?.getFiltersModel(data));
//     this._params?.api.onFilterChanged();
//     this._params?.context.grid.applyFilterModel({}, FilterModelSource.storage);
//   }
//   setInput() {
//     if (this.input) {
//       this.input.destroy();
//     }
//     this.input = this._col?.getInputForm(true) ?? null;
//     this.input?.createFormControl();
//     this.input?.changeValue$.subscribe({
//       next: value => {
//         const data: any = [];
//         data[this._col?.key ?? ''] = value;
//         this.apply(data);
//       },
//     });
//   }
//   private _validateDataAgainstModel(data: any, model: AdvancedFilterModel): boolean {
//     if (model.filterType === 'join') {
//       // Validation for JoinAdvancedFilterModel
//       if (!Array.isArray(model.conditions)) return false;
//       if (model.type === 'AND') {
//         return model.conditions.every(condition => this._validateDataAgainstModel(data, condition));
//       } else if (model.type === 'OR') {
//         return model.conditions.some(condition => this._validateDataAgainstModel(data, condition));
//       }
//     }
//     if (['text', 'number', 'date', 'dateString', 'boolean'].includes(model.filterType)) {
//       // Validation for ColumnAdvancedFilterModel
//       switch (model.filterType) {
//         case 'text':
//           return this._validateTextCondition(data, model.type, model.filter);
//         case 'number':
//           return this._validateScalarCondition(data, model.type, model.filter);
//         case 'date':
//         case 'dateString':
//           return this._validateScalarCondition(
//             new Date(data).getTime(),
//             model.type,
//             model.filter ? new Date(model.filter).getTime() : undefined
//           );
//         case 'boolean':
//           return this._validateBooleanCondition(data, model.type);
//         default:
//           return false;
//       }
//     }
//     return false;
//   }
//   private _validateTextCondition(data: string, type: TextAdvancedFilterModelType, filter?: string): boolean {
//     switch (type) {
//       case 'equals':
//         return data === filter;
//       case 'notEqual':
//         return data !== filter;
//       case 'contains':
//         return filter ? data.includes(filter) : false;
//       case 'notContains':
//         return filter ? !data.includes(filter) : true;
//       case 'startsWith':
//         return filter ? data.startsWith(filter) : false;
//       case 'endsWith':
//         return filter ? data.endsWith(filter) : false;
//       case 'blank':
//         return data === '';
//       case 'notBlank':
//         return data !== '';
//       default:
//         return false;
//     }
//   }
//   private _validateScalarCondition(data: number, type: ScalarAdvancedFilterModelType, filter?: number): boolean {
//     switch (type) {
//       case 'equals':
//         return data === filter;
//       case 'notEqual':
//         return data !== filter;
//       case 'lessThan':
//         return filter !== undefined && data < filter;
//       case 'lessThanOrEqual':
//         return filter !== undefined && data <= filter;
//       case 'greaterThan':
//         return filter !== undefined && data > filter;
//       case 'greaterThanOrEqual':
//         return filter !== undefined && data >= filter;
//       case 'blank':
//         return data === null || data === undefined;
//       case 'notBlank':
//         return data !== null && data !== undefined;
//       default:
//         return false;
//     }
//   }
//   private _validateBooleanCondition(data: boolean, type: BooleanAdvancedFilterModelType): boolean {
//     return (type === 'true' && data === true) || (type === 'false' && data === false);
//   }
// }

class BoolCol extends BaseCol {
}

class DateCol extends BaseCol {
    getInputForm() {
        return new InputDatePicker({
            key: this.key,
            label: this.inputLabel,
            rangeEnabled: true,
        });
    }
}

class EnumCol extends BaseCol {
    getInputForm() {
        return new InputPanel({
            key: 'enum-panel',
            contentClass: 'row g-0',
            children: [
                new InputDropdown({
                    key: this.key,
                    label: this.inputLabel,
                    options: of(this.data.col.enumValues?.map(value => ({
                        id: value,
                        name: value,
                    })) ?? []),
                }),
            ],
        });
    }
}

class NumberCol extends BaseCol {
    getInputForm() {
        return new InputPanel({
            key: 'number-panel',
            contentClass: 'row g-0',
            children: [
                new InputNumber({
                    key: this.key,
                    label: this.inputLabel,
                }),
            ],
        });
    }
    formatInputForm(data) {
        const value = data[this.key];
        if (!value) {
            return null;
        }
        return {
            field: this.key,
            type: '=',
            value: value,
        };
    }
}

class StringCol extends BaseCol {
    getInputForm() {
        // const value = this.values;
        return new InputTextBox({
            key: this.key,
            label: this.inputLabel,
            class: 'pb-2',
        });
    }
    formatInputForm(data) {
        const value = data[this.key];
        if (!value || value === '' || value.length === 0) {
            return null;
        }
        return {
            field: this.key,
            type: 'like',
            value: value,
        };
    }
}

class BydGridFilters {
    scope;
    table;
    constructor(scope, table) {
        this.scope = scope;
        this.table = table;
    }
    get() {
        return this.table.getFilters(false).reduce((acc, filter) => {
            const existing = acc.find(tag => tag.key === filter.field);
            if (existing) {
                existing.values.push(filter);
            }
            else {
                acc.push({
                    key: filter.field,
                    values: [filter],
                });
            }
            return acc;
        }, []);
    }
    apply(filters) {
        this.table?.setFilter(filters);
    }
    remove(filter) {
        this.table.removeFilter(filter.field, filter.type, filter.value);
    }
}

class BydGridData {
    scope;
    get data() {
        return this.table?.getData() ?? [];
    }
    table = null;
    cols = {};
    filters = null;
    isReady$ = new BehaviorSubject(false);
    tableHtml = null;
    displayType = signal('card');
    constructor(scope) {
        this.scope = scope;
    }
    init(params) {
        this.table = new TabulatorFull(params.elementRef.nativeElement, {
            height: '500px',
            layout: 'fitColumns',
            paginationMode: 'remote',
            pagination: true,
            paginationSize: 10,
            paginationInitialPage: 1,
            ajaxFiltering: true,
            filterMode: 'remote',
            ajaxSorting: true,
            sortMode: 'remote',
            columns: this._getColumns(params.colsMetaData),
            ajaxURL: 'dummy',
            ajaxRequestFunc: (url, config, ajaxParams) => {
                return firstValueFrom(params.services.getData$(ajaxParams));
            },
            ajaxResponse: function (_, __, response) {
                return response;
            },
        });
        this.table.on('tableBuilt', () => {
            this.tableHtml = params.elementRef;
            this.filters = new BydGridFilters(this.scope, this.table);
            this.isReady$.next(true);
        });
    }
    switchView(type) {
        this.displayType.set(type);
    }
    _getColumns(colsMetaData) {
        this.cols = Object.fromEntries(colsMetaData.map(meta => {
            const field = this._factoryCols(meta);
            return [field.key, field];
        }));
        return Object.keys(this.cols)
            .filter(key => !key.startsWith('_'))
            .map(key => ({ ...this.cols[key].getColDef() }));
    }
    _factoryCols(col) {
        switch (col.type) {
            case ParameterType.String:
                return new StringCol({ scope: this.scope, col: col }, this);
            case ParameterType.Enum:
                return new EnumCol({ scope: this.scope, col: col }, this);
            case ParameterType.Number:
                return new NumberCol({ scope: this.scope, col: col }, this);
            case ParameterType.DateTime:
                return new DateCol({ scope: this.scope, col: col }, this);
            case ParameterType.Boolean:
                return new BoolCol({ scope: this.scope, col: col }, this);
            default:
                return new BaseCol({ scope: this.scope, col: col }, this);
        }
    }
}

class BydGridInstanceService {
    grids = {};
    constructor() { }
    create(key) {
        if (!this.has(key)) {
            this.grids[key] = new BydGridData(key);
        }
    }
    get(key, create = false) {
        if (!this.has(key) && create) {
            this.create(key);
        }
        return this.grids[key];
    }
    has(key) {
        return !!this.grids[key];
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridInstanceService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridInstanceService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridInstanceService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

class BydAbstractGridComponent extends BydBaseComponent {
    gridId;
    get data() {
        return this._grid.data;
    }
    get displayType() {
        return this._grid.displayType;
    }
    isReady$;
    _grid;
    _dataService = inject(BydGridInstanceService);
    constructor() {
        super();
    }
    ngOnInit() {
        this._grid = this._dataService.get(this.gridId, true);
        this.isReady$ = this._grid.isReady$.pipe(filter(isReady => isReady), tap(a => console.log('after', a)));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydAbstractGridComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: BydAbstractGridComponent, isStandalone: true, selector: "ng-component", inputs: { gridId: "gridId" }, usesInheritance: true, ngImport: i0, template: '', isInline: true });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydAbstractGridComponent, decorators: [{
            type: Component,
            args: [{ template: '' }]
        }], ctorParameters: () => [], propDecorators: { gridId: [{
                type: Input
            }] } });

class BydGridFormComponent extends BydAbstractGridComponent {
    applied = new EventEmitter();
    filtersForm = signal([]);
    _formService = inject((BydGridFormService));
    ngOnInit() {
        super.ngOnInit();
        this._registerSubscription(this.isReady$.subscribe({
            next: () => this.filtersForm.set(this._formService.getFiltersForm(this._grid)),
        }));
    }
    apply(data) {
        const filters = this._formService.formatFiltersForm(this._grid, data);
        this._grid.filters?.apply(filters);
        this.applied.emit(filters);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridFormComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: BydGridFormComponent, isStandalone: true, selector: "byd-grid-form", outputs: { applied: "applied" }, usesInheritance: true, ngImport: i0, template: "<byd-form [inputs]=\"this.filtersForm()\" (valid)=\"this.apply($event)\"></byd-form>\n", styles: [""], dependencies: [{ kind: "component", type: BydFormComponent, selector: "byd-form", inputs: ["inputs", "askValidation$", "askOnDestroy", "loader", "error", "border", "canDisplayButton", "buttonTitle", "onLive"], outputs: ["valid", "isFormValid"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridFormComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-grid-form', imports: [BydFormComponent], template: "<byd-form [inputs]=\"this.filtersForm()\" (valid)=\"this.apply($event)\"></byd-form>\n" }]
        }], propDecorators: { applied: [{
                type: Output
            }] } });

class PaginationComponent extends BydAbstractGridComponent {
    PageNumber;
    maxPageNumber = 10;
    get grid() {
        return this._grid;
    }
    get show() {
        return this.paginationGetTotalPages > 1;
    }
    get paginationGetTotalPages() {
        return this.grid.table?.getPageMax() || 0;
    }
    constructor() {
        super();
    }
    getListPage() {
        if (!this.grid || !this.grid.table) {
            return [];
        }
        const last = this.paginationGetTotalPages;
        if (last < this.maxPageNumber) {
            return this._computedPageNumbers(2, last);
        }
        const current = this.grid.table.getPage() || 0;
        const rangeStart = Math.floor(current / 10) * 10;
        const rangeEnd = rangeStart + 10;
        return [
            ...(rangeStart <= 1 ? [] : [{ number: rangeStart - 1, icon: 'more-line' }]),
            ...this._computedPageNumbers(rangeStart > 1 ? rangeStart : 2, rangeEnd < last ? rangeEnd : last),
            ...(rangeEnd > last ? [] : [{ number: rangeEnd, icon: 'more-line' }]),
        ];
    }
    _computedPageNumbers(start, end) {
        const pageNumbers = [];
        for (let i = start; i < end; i++) {
            pageNumbers.push({ number: i });
        }
        return pageNumbers;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: PaginationComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.1", type: PaginationComponent, isStandalone: true, selector: "byd-grid-pagination", usesInheritance: true, ngImport: i0, template: "@if (this.grid && this.grid.table && this.show) {\n  <div class=\"flex-start g-space-sm align-center\">\n    <mat-icon (click)=\"this.grid.table.previousPage()\"> chevron_left </mat-icon>\n    <ng-template [ngTemplateOutlet]=\"item\" [ngTemplateOutletContext]=\"{ pagenumber: { number: 1 } }\"></ng-template>\n\n    @for (page of this.getListPage(); track page.number) {\n      <ng-template [ngTemplateOutlet]=\"item\" [ngTemplateOutletContext]=\"{ pagenumber: page }\"></ng-template>\n    }\n\n    @if (this.paginationGetTotalPages > 1) {\n      <ng-template\n        [ngTemplateOutlet]=\"item\"\n        [ngTemplateOutletContext]=\"{\n          pagenumber: { number: this.paginationGetTotalPages },\n        }\"\n      ></ng-template>\n    }\n\n    <mat-icon (click)=\"this.grid.table.nextPage()\"> chevron_right </mat-icon>\n  </div>\n}\n\n<ng-template #item let-pagenumber=\"pagenumber\" [typedTemplate]=\"this.PageNumber\">\n  <div\n    class=\"figure c-pointer\"\n    [class.is-active]=\"pagenumber.number === (this.grid.table?.getPage() || 0)\"\n    (click)=\"this.grid.table?.setPage(pagenumber.number)\"\n  >\n    @if (pagenumber.icon) {\n      <mat-icon type=\"sm\">{{ pagenumber.icon }}</mat-icon>\n    } @else {\n      {{ pagenumber.number }}\n    }\n  </div>\n</ng-template>\n", styles: [".figure{color:var(--byd-text-primary);border:1px solid var(--byd-border-secondary);padding:var(--byd-space-sm) var(--byd-space-md);border-radius:var(--byd-radius-rounded)}.figure.is-active{color:var(--byd-text-invert-primary);background-color:var(--byd-surface-brand-primary)}\n"], dependencies: [{ kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: TypedTemplateDirective, selector: "ng-template[typedTemplate]", inputs: ["typedTemplate"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: PaginationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-grid-pagination', standalone: true, imports: [MatIcon, NgTemplateOutlet, TypedTemplateDirective], template: "@if (this.grid && this.grid.table && this.show) {\n  <div class=\"flex-start g-space-sm align-center\">\n    <mat-icon (click)=\"this.grid.table.previousPage()\"> chevron_left </mat-icon>\n    <ng-template [ngTemplateOutlet]=\"item\" [ngTemplateOutletContext]=\"{ pagenumber: { number: 1 } }\"></ng-template>\n\n    @for (page of this.getListPage(); track page.number) {\n      <ng-template [ngTemplateOutlet]=\"item\" [ngTemplateOutletContext]=\"{ pagenumber: page }\"></ng-template>\n    }\n\n    @if (this.paginationGetTotalPages > 1) {\n      <ng-template\n        [ngTemplateOutlet]=\"item\"\n        [ngTemplateOutletContext]=\"{\n          pagenumber: { number: this.paginationGetTotalPages },\n        }\"\n      ></ng-template>\n    }\n\n    <mat-icon (click)=\"this.grid.table.nextPage()\"> chevron_right </mat-icon>\n  </div>\n}\n\n<ng-template #item let-pagenumber=\"pagenumber\" [typedTemplate]=\"this.PageNumber\">\n  <div\n    class=\"figure c-pointer\"\n    [class.is-active]=\"pagenumber.number === (this.grid.table?.getPage() || 0)\"\n    (click)=\"this.grid.table?.setPage(pagenumber.number)\"\n  >\n    @if (pagenumber.icon) {\n      <mat-icon type=\"sm\">{{ pagenumber.icon }}</mat-icon>\n    } @else {\n      {{ pagenumber.number }}\n    }\n  </div>\n</ng-template>\n", styles: [".figure{color:var(--byd-text-primary);border:1px solid var(--byd-border-secondary);padding:var(--byd-space-sm) var(--byd-space-md);border-radius:var(--byd-radius-rounded)}.figure.is-active{color:var(--byd-text-invert-primary);background-color:var(--byd-surface-brand-primary)}\n"] }]
        }], ctorParameters: () => [] });

class BydGridComponent extends BydAbstractGridComponent {
    renderer;
    cardTemplate;
    tableElement;
    constructor(renderer) {
        super();
        this.renderer = renderer;
    }
    ngAfterViewInit() {
        this._registerSubscription(this.isReady$.subscribe({
            next: () => {
                if (this._grid.tableHtml) {
                    this.renderer.appendChild(this.tableElement.nativeElement, this._grid.tableHtml.nativeElement);
                }
            },
        }));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridComponent, deps: [{ token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.1", type: BydGridComponent, isStandalone: true, selector: "byd-grid", inputs: { cardTemplate: "cardTemplate" }, viewQueries: [{ propertyName: "tableElement", first: true, predicate: ["table"], descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<div [style.display]=\"this.displayType() === 'grid' ? 'block' : 'none'\">\r\n  <div #table></div>\r\n</div>\r\n\r\n@if (this.isReady$ | async) {\r\n  @if (this.displayType() === 'card') {\r\n    <ng-template [ngTemplateOutlet]=\"this.cardTemplate\" [ngTemplateOutletContext]=\"{ items: this.data }\"></ng-template>\r\n  }\r\n  <byd-grid-pagination [gridId]=\"this.gridId\"></byd-grid-pagination>\r\n}\r\n", styles: [".tabulator{background-color:#888;border:1px solid #999;font-size:14px;overflow:hidden;position:relative;text-align:left;-webkit-transform:translateZ(0);-moz-transform:translateZ(0);-ms-transform:translateZ(0);-o-transform:translateZ(0);transform:translateZ(0)}.tabulator[tabulator-layout=fitDataFill] .tabulator-tableholder .tabulator-table{min-width:100%}.tabulator[tabulator-layout=fitDataTable]{display:inline-block}.tabulator.tabulator-block-select,.tabulator.tabulator-ranges .tabulator-cell:not(.tabulator-editing){-webkit-user-select:none;user-select:none}.tabulator .tabulator-header{background-color:#e6e6e6;border-bottom:1px solid #999;box-sizing:border-box;color:#555;font-weight:700;outline:none;overflow:hidden;position:relative;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;white-space:nowrap;width:100%}.tabulator .tabulator-header.tabulator-header-hidden{display:none}.tabulator .tabulator-header .tabulator-header-contents{overflow:hidden;position:relative}.tabulator .tabulator-header .tabulator-header-contents .tabulator-headers{display:inline-block}.tabulator .tabulator-header .tabulator-col{background:#e6e6e6;border-right:1px solid #aaa;box-sizing:border-box;display:inline-flex;flex-direction:column;justify-content:flex-start;overflow:hidden;position:relative;text-align:left;vertical-align:bottom}.tabulator .tabulator-header .tabulator-col.tabulator-moving{background:#cdcdcd;border:1px solid #999;pointer-events:none;position:absolute}.tabulator .tabulator-header .tabulator-col.tabulator-range-highlight{background-color:#d6d6d6;color:#000}.tabulator .tabulator-header .tabulator-col.tabulator-range-selected{background-color:#3876ca;color:#fff}.tabulator .tabulator-header .tabulator-col .tabulator-col-content{box-sizing:border-box;padding:4px;position:relative}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-header-popup-button{padding:0 8px}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-header-popup-button:hover{cursor:pointer;opacity:.6}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title-holder{position:relative}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title{box-sizing:border-box;overflow:hidden;text-overflow:ellipsis;vertical-align:bottom;white-space:nowrap;width:100%}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title.tabulator-col-title-wrap{text-overflow:clip;white-space:normal}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title .tabulator-title-editor{background:#fff;border:1px solid #999;box-sizing:border-box;padding:1px;width:100%}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title .tabulator-header-popup-button+.tabulator-title-editor{width:calc(100% - 22px)}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter{align-items:center;bottom:0;display:flex;position:absolute;right:4px;top:0}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{border-bottom:6px solid #bbb;border-left:6px solid transparent;border-right:6px solid transparent;height:0;width:0}.tabulator .tabulator-header .tabulator-col.tabulator-col-group .tabulator-col-group-cols{border-top:1px solid #aaa;display:flex;margin-right:-1px;overflow:hidden;position:relative}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter{box-sizing:border-box;margin-top:2px;position:relative;text-align:center;width:100%}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter textarea{height:auto!important}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter svg{margin-top:3px}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter input::-ms-clear{height:0;width:0}.tabulator .tabulator-header .tabulator-col.tabulator-sortable .tabulator-col-title{padding-right:25px}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-header .tabulator-col.tabulator-sortable.tabulator-col-sorter-element:hover{background-color:#cdcdcd;cursor:pointer}}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=none] .tabulator-col-content .tabulator-col-sorter{color:#bbb}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=none] .tabulator-col-content .tabulator-col-sorter.tabulator-col-sorter-element .tabulator-arrow:hover{border-bottom:6px solid #555;cursor:pointer}}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=none] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{border-bottom:6px solid #bbb;border-top:none}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=ascending] .tabulator-col-content .tabulator-col-sorter{color:#666}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=ascending] .tabulator-col-content .tabulator-col-sorter.tabulator-col-sorter-element .tabulator-arrow:hover{border-bottom:6px solid #555;cursor:pointer}}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=ascending] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{border-bottom:6px solid #666;border-top:none}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=descending] .tabulator-col-content .tabulator-col-sorter{color:#666}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=descending] .tabulator-col-content .tabulator-col-sorter.tabulator-col-sorter-element .tabulator-arrow:hover{border-top:6px solid #555;cursor:pointer}}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=descending] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{border-bottom:none;border-top:6px solid #666;color:#666}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical .tabulator-col-content .tabulator-col-title{align-items:center;display:flex;justify-content:center;text-orientation:mixed;writing-mode:vertical-rl}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-col-vertical-flip .tabulator-col-title{transform:rotate(180deg)}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-sortable .tabulator-col-title{padding-right:0;padding-top:20px}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-sortable.tabulator-col-vertical-flip .tabulator-col-title{padding-bottom:20px;padding-right:0}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-sortable .tabulator-col-sorter{justify-content:center;inset:4px 0 auto}.tabulator .tabulator-header .tabulator-frozen{left:0;position:sticky;z-index:11}.tabulator .tabulator-header .tabulator-frozen.tabulator-frozen-left{border-right:2px solid #aaa}.tabulator .tabulator-header .tabulator-frozen.tabulator-frozen-right{border-left:2px solid #aaa}.tabulator .tabulator-header .tabulator-calcs-holder{background:#f3f3f3!important;border-bottom:1px solid #aaa;border-top:1px solid #aaa;box-sizing:border-box;display:inline-block}.tabulator .tabulator-header .tabulator-calcs-holder .tabulator-row{background:#f3f3f3!important}.tabulator .tabulator-header .tabulator-calcs-holder .tabulator-row .tabulator-col-resize-handle{display:none}.tabulator .tabulator-header .tabulator-frozen-rows-holder{display:inline-block}.tabulator .tabulator-header .tabulator-frozen-rows-holder:empty{display:none}.tabulator .tabulator-tableholder{-webkit-overflow-scrolling:touch;overflow:auto;position:relative;white-space:nowrap;width:100%}.tabulator .tabulator-tableholder:focus{outline:none}.tabulator .tabulator-tableholder .tabulator-placeholder{align-items:center;box-sizing:border-box;display:flex;justify-content:center;min-width:100%;width:100%}.tabulator .tabulator-tableholder .tabulator-placeholder[tabulator-render-mode=virtual]{min-height:100%}.tabulator .tabulator-tableholder .tabulator-placeholder .tabulator-placeholder-contents{color:#ccc;display:inline-block;font-size:20px;font-weight:700;padding:10px;text-align:center;white-space:normal}.tabulator .tabulator-tableholder .tabulator-table{background-color:#fff;color:#333;display:inline-block;overflow:visible;position:relative;white-space:nowrap}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.tabulator-calcs{background:#e2e2e2!important;font-weight:700}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.tabulator-calcs.tabulator-calcs-top{border-bottom:2px solid #aaa}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.tabulator-calcs.tabulator-calcs-bottom{border-top:2px solid #aaa}.tabulator .tabulator-tableholder .tabulator-range-overlay{inset:0;pointer-events:none;position:absolute;z-index:10}.tabulator .tabulator-tableholder .tabulator-range-overlay .tabulator-range{border:1px solid #2975dd;box-sizing:border-box;position:absolute}.tabulator .tabulator-tableholder .tabulator-range-overlay .tabulator-range.tabulator-range-active:after{background-color:#2975dd;border-radius:999px;bottom:-3px;content:\"\";height:6px;position:absolute;right:-3px;width:6px}.tabulator .tabulator-tableholder .tabulator-range-overlay .tabulator-range-cell-active{border:2px solid #2975dd;box-sizing:border-box;position:absolute}.tabulator .tabulator-footer{background-color:#e6e6e6;border-top:1px solid #999;color:#555;font-weight:700;user-select:none;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;white-space:nowrap}.tabulator .tabulator-footer .tabulator-footer-contents{align-items:center;display:flex;flex-direction:row;justify-content:space-between;padding:5px 10px}.tabulator .tabulator-footer .tabulator-footer-contents:empty{display:none}.tabulator .tabulator-footer .tabulator-spreadsheet-tabs{margin-top:-5px;overflow-x:auto}.tabulator .tabulator-footer .tabulator-spreadsheet-tabs .tabulator-spreadsheet-tab{border:1px solid #999;border-bottom-left-radius:5px;border-bottom-right-radius:5px;border-top:none;display:inline-block;font-size:.9em;padding:5px}.tabulator .tabulator-footer .tabulator-spreadsheet-tabs .tabulator-spreadsheet-tab:hover{cursor:pointer;opacity:.7}.tabulator .tabulator-footer .tabulator-spreadsheet-tabs .tabulator-spreadsheet-tab.tabulator-spreadsheet-tab-active{background:#fff}.tabulator .tabulator-footer .tabulator-calcs-holder{background:#f3f3f3!important;border-bottom:1px solid #aaa;border-top:1px solid #aaa;box-sizing:border-box;overflow:hidden;text-align:left;width:100%}.tabulator .tabulator-footer .tabulator-calcs-holder .tabulator-row{background:#f3f3f3!important;display:inline-block}.tabulator .tabulator-footer .tabulator-calcs-holder .tabulator-row .tabulator-col-resize-handle{display:none}.tabulator .tabulator-footer .tabulator-calcs-holder:only-child{border-bottom:none;margin-bottom:-5px}.tabulator .tabulator-footer>*+.tabulator-page-counter{margin-left:10px}.tabulator .tabulator-footer .tabulator-page-counter{font-weight:400}.tabulator .tabulator-footer .tabulator-paginator{color:#555;flex:1;font-family:inherit;font-size:inherit;font-weight:inherit;text-align:right}.tabulator .tabulator-footer .tabulator-page-size{border:1px solid #aaa;border-radius:3px;display:inline-block;margin:0 5px;padding:2px 5px}.tabulator .tabulator-footer .tabulator-pages{margin:0 7px}.tabulator .tabulator-footer .tabulator-page{background:#fff3;border:1px solid #aaa;border-radius:3px;display:inline-block;margin:0 2px;padding:2px 5px}.tabulator .tabulator-footer .tabulator-page.active{color:#d00}.tabulator .tabulator-footer .tabulator-page:disabled{opacity:.5}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-footer .tabulator-page:not(disabled):hover{background:#0003;color:#fff;cursor:pointer}}.tabulator .tabulator-col-resize-handle{display:inline-block;margin-left:-3px;margin-right:-3px;position:relative;vertical-align:middle;width:6px;z-index:11}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-col-resize-handle:hover{cursor:ew-resize}}.tabulator .tabulator-col-resize-handle:last-of-type{margin-right:0;width:3px}.tabulator .tabulator-col-resize-guide{background-color:#999;height:100%;margin-left:-.5px;opacity:.5;position:absolute;top:0;width:4px}.tabulator .tabulator-row-resize-guide{background-color:#999;height:4px;left:0;margin-top:-.5px;opacity:.5;position:absolute;width:100%}.tabulator .tabulator-alert{align-items:center;background:#0006;display:flex;height:100%;left:0;position:absolute;text-align:center;top:0;width:100%;z-index:100}.tabulator .tabulator-alert .tabulator-alert-msg{background:#fff;border-radius:10px;display:inline-block;font-size:16px;font-weight:700;margin:0 auto;padding:10px 20px}.tabulator .tabulator-alert .tabulator-alert-msg.tabulator-alert-state-msg{border:4px solid #333;color:#000}.tabulator .tabulator-alert .tabulator-alert-msg.tabulator-alert-state-error{border:4px solid #d00;color:#590000}.tabulator-row{background-color:#fff;box-sizing:border-box;min-height:22px;position:relative}.tabulator-row.tabulator-row-even{background-color:#efefef}@media (hover:hover) and (pointer:fine){.tabulator-row.tabulator-selectable:hover{background-color:#bbb;cursor:pointer}}.tabulator-row.tabulator-selected{background-color:#9abcea}@media (hover:hover) and (pointer:fine){.tabulator-row.tabulator-selected:hover{background-color:#769bcc;cursor:pointer}}.tabulator-row.tabulator-row-moving{background:#fff;border:1px solid #000}.tabulator-row.tabulator-moving{border-bottom:1px solid #aaa;border-top:1px solid #aaa;pointer-events:none;position:absolute;z-index:15}.tabulator-row.tabulator-range-highlight .tabulator-cell.tabulator-range-row-header{background-color:#d6d6d6;color:#000}.tabulator-row.tabulator-range-highlight.tabulator-range-selected .tabulator-cell.tabulator-range-row-header,.tabulator-row.tabulator-range-selected .tabulator-cell.tabulator-range-row-header{background-color:#3876ca;color:#fff}.tabulator-row .tabulator-row-resize-handle{bottom:0;height:5px;left:0;position:absolute;right:0}.tabulator-row .tabulator-row-resize-handle.prev{bottom:auto;top:0}@media (hover:hover) and (pointer:fine){.tabulator-row .tabulator-row-resize-handle:hover{cursor:ns-resize}}.tabulator-row .tabulator-responsive-collapse{border-bottom:1px solid #aaa;border-top:1px solid #aaa;box-sizing:border-box;padding:5px}.tabulator-row .tabulator-responsive-collapse:empty{display:none}.tabulator-row .tabulator-responsive-collapse table{font-size:14px}.tabulator-row .tabulator-responsive-collapse table tr td{position:relative}.tabulator-row .tabulator-responsive-collapse table tr td:first-of-type{padding-right:10px}.tabulator-row .tabulator-cell{border-right:1px solid #aaa;box-sizing:border-box;display:inline-block;outline:none;overflow:hidden;padding:4px;position:relative;text-overflow:ellipsis;vertical-align:middle;white-space:nowrap}.tabulator-row .tabulator-cell.tabulator-row-header{background:#e6e6e6;border-bottom:1px solid #aaa;border-right:1px solid #999}.tabulator-row .tabulator-cell.tabulator-frozen{background-color:inherit;display:inline-block;left:0;position:sticky;z-index:11}.tabulator-row .tabulator-cell.tabulator-frozen.tabulator-frozen-left{border-right:2px solid #aaa}.tabulator-row .tabulator-cell.tabulator-frozen.tabulator-frozen-right{border-left:2px solid #aaa}.tabulator-row .tabulator-cell.tabulator-editing{border:1px solid #1d68cd;outline:none;padding:0}.tabulator-row .tabulator-cell.tabulator-editing input,.tabulator-row .tabulator-cell.tabulator-editing select{background:transparent;border:1px;outline:none}.tabulator-row .tabulator-cell.tabulator-validation-fail{border:1px solid #d00}.tabulator-row .tabulator-cell.tabulator-validation-fail input,.tabulator-row .tabulator-cell.tabulator-validation-fail select{background:transparent;border:1px;color:#d00}.tabulator-row .tabulator-cell.tabulator-row-handle{align-items:center;display:inline-flex;justify-content:center;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none}.tabulator-row .tabulator-cell.tabulator-row-handle .tabulator-row-handle-box{width:80%}.tabulator-row .tabulator-cell.tabulator-row-handle .tabulator-row-handle-box .tabulator-row-handle-bar{background:#666;height:3px;margin-top:2px;width:100%}.tabulator-row .tabulator-cell.tabulator-range-selected:not(.tabulator-range-only-cell-selected):not(.tabulator-range-row-header){background-color:#9abcea}.tabulator-row .tabulator-cell .tabulator-data-tree-branch-empty{display:inline-block;width:7px}.tabulator-row .tabulator-cell .tabulator-data-tree-branch{border-bottom:2px solid #aaa;border-bottom-left-radius:1px;border-left:2px solid #aaa;display:inline-block;height:9px;margin-right:5px;margin-top:-9px;vertical-align:middle;width:7px}.tabulator-row .tabulator-cell .tabulator-data-tree-control{align-items:center;background:#0000001a;border:1px solid #333;border-radius:2px;display:inline-flex;height:11px;justify-content:center;margin-right:5px;overflow:hidden;vertical-align:middle;width:11px}@media (hover:hover) and (pointer:fine){.tabulator-row .tabulator-cell .tabulator-data-tree-control:hover{background:#0003;cursor:pointer}}.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-collapse{background:transparent;display:inline-block;height:7px;position:relative;width:1px}.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-collapse:after{background:#333;content:\"\";height:1px;left:-3px;position:absolute;top:3px;width:7px}.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-expand{background:#333;display:inline-block;height:7px;position:relative;width:1px}.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-expand:after{background:#333;content:\"\";height:1px;left:-3px;position:absolute;top:3px;width:7px}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle{align-items:center;background:#666;border-radius:20px;color:#fff;display:inline-flex;font-size:1.1em;font-weight:700;height:15px;justify-content:center;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;width:15px}@media (hover:hover) and (pointer:fine){.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle:hover{cursor:pointer;opacity:.7}}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle.open .tabulator-responsive-collapse-toggle-close{display:initial}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle.open .tabulator-responsive-collapse-toggle-open{display:none}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle svg{stroke:#fff}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle .tabulator-responsive-collapse-toggle-close{display:none}.tabulator-row .tabulator-cell .tabulator-traffic-light{border-radius:14px;display:inline-block;height:14px;width:14px}.tabulator-row.tabulator-group{background:#ccc;border-bottom:1px solid #999;border-right:1px solid #aaa;border-top:1px solid #999;box-sizing:border-box;font-weight:700;min-width:100%;padding:5px 5px 5px 10px}@media (hover:hover) and (pointer:fine){.tabulator-row.tabulator-group:hover{background-color:#0000001a;cursor:pointer}}.tabulator-row.tabulator-group.tabulator-group-visible .tabulator-arrow{border-bottom:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #666;margin-right:10px}.tabulator-row.tabulator-group.tabulator-group-level-1{padding-left:30px}.tabulator-row.tabulator-group.tabulator-group-level-2{padding-left:50px}.tabulator-row.tabulator-group.tabulator-group-level-3{padding-left:70px}.tabulator-row.tabulator-group.tabulator-group-level-4{padding-left:90px}.tabulator-row.tabulator-group.tabulator-group-level-5{padding-left:110px}.tabulator-row.tabulator-group .tabulator-group-toggle{display:inline-block}.tabulator-row.tabulator-group .tabulator-arrow{border-bottom:6px solid transparent;border-left:6px solid #666;border-right:0;border-top:6px solid transparent;display:inline-block;height:0;margin-right:16px;vertical-align:middle;width:0}.tabulator-row.tabulator-group span{color:#d00;margin-left:10px}.tabulator-toggle{background:#dcdcdc;border:1px solid #ccc;box-sizing:border-box;display:flex;flex-direction:row}.tabulator-toggle.tabulator-toggle-on{background:#1c6cc2}.tabulator-toggle .tabulator-toggle-switch{background:#fff;border:1px solid #ccc;box-sizing:border-box}.tabulator-popup-container{-webkit-overflow-scrolling:touch;background:#fff;border:1px solid #aaa;box-shadow:0 0 5px #0003;box-sizing:border-box;display:inline-block;font-size:14px;overflow-y:auto;position:absolute;z-index:10000}.tabulator-popup{border-radius:3px;padding:5px}.tabulator-tooltip{border-radius:2px;box-shadow:none;font-size:12px;max-width:Min(500px,100%);padding:3px 5px;pointer-events:none}.tabulator-menu .tabulator-menu-item{box-sizing:border-box;padding:5px 10px;position:relative;-webkit-user-select:none;user-select:none}.tabulator-menu .tabulator-menu-item.tabulator-menu-item-disabled{opacity:.5}@media (hover:hover) and (pointer:fine){.tabulator-menu .tabulator-menu-item:not(.tabulator-menu-item-disabled):hover{background:#efefef;cursor:pointer}}.tabulator-menu .tabulator-menu-item.tabulator-menu-item-submenu{padding-right:25px}.tabulator-menu .tabulator-menu-item.tabulator-menu-item-submenu:after{border-color:#aaa;border-style:solid;border-width:1px 1px 0 0;content:\"\";display:inline-block;height:7px;position:absolute;right:10px;top:calc(5px + .4em);transform:rotate(45deg);vertical-align:top;width:7px}.tabulator-menu .tabulator-menu-separator{border-top:1px solid #aaa}.tabulator-edit-list{-webkit-overflow-scrolling:touch;font-size:14px;max-height:200px;overflow-y:auto}.tabulator-edit-list .tabulator-edit-list-item{color:#333;outline:none;padding:4px}.tabulator-edit-list .tabulator-edit-list-item.active{background:#1d68cd;color:#fff}.tabulator-edit-list .tabulator-edit-list-item.active.focused{outline:1px solid hsla(0,0%,100%,.5)}.tabulator-edit-list .tabulator-edit-list-item.focused{outline:1px solid #1d68cd}@media (hover:hover) and (pointer:fine){.tabulator-edit-list .tabulator-edit-list-item:hover{background:#1d68cd;color:#fff;cursor:pointer}}.tabulator-edit-list .tabulator-edit-list-placeholder{color:#333;padding:4px;text-align:center}.tabulator-edit-list .tabulator-edit-list-group{border-bottom:1px solid #aaa;color:#333;font-weight:700;padding:6px 4px 4px}.tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-2,.tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-2{padding-left:12px}.tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-3,.tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-3{padding-left:20px}.tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-4,.tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-4{padding-left:28px}.tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-5,.tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-5{padding-left:36px}.tabulator.tabulator-ltr{direction:ltr}.tabulator.tabulator-rtl{direction:rtl;text-align:initial}.tabulator.tabulator-rtl .tabulator-header .tabulator-col{border-left:1px solid #aaa;border-right:initial;text-align:initial}.tabulator.tabulator-rtl .tabulator-header .tabulator-col.tabulator-col-group .tabulator-col-group-cols{margin-left:-1px;margin-right:0}.tabulator.tabulator-rtl .tabulator-header .tabulator-col.tabulator-sortable .tabulator-col-title{padding-left:25px;padding-right:0}.tabulator.tabulator-rtl .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter{left:8px;right:auto}.tabulator.tabulator-rtl .tabulator-tableholder .tabulator-range-overlay .tabulator-range.tabulator-range-active:after{background-color:#2975dd;border-radius:999px;bottom:-3px;content:\"\";height:6px;left:-3px;position:absolute;right:auto;width:6px}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell{border-left:1px solid #aaa;border-right:initial}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell .tabulator-data-tree-branch{border-bottom-left-radius:0;border-bottom-right-radius:1px;border-left:initial;border-right:2px solid #aaa;margin-left:5px;margin-right:0}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell .tabulator-data-tree-control{margin-left:5px;margin-right:0}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell.tabulator-frozen.tabulator-frozen-left{border-left:2px solid #aaa}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell.tabulator-frozen.tabulator-frozen-right{border-right:2px solid #aaa}.tabulator.tabulator-rtl .tabulator-row .tabulator-col-resize-handle:last-of-type{margin-left:0;margin-right:-3px;width:3px}.tabulator.tabulator-rtl .tabulator-footer .tabulator-calcs-holder{text-align:initial}.tabulator-print-fullscreen{inset:0;position:absolute;z-index:10000}body.tabulator-print-fullscreen-hide>:not(.tabulator-print-fullscreen){display:none!important}.tabulator-print-table{border-collapse:collapse}.tabulator-print-table .tabulator-data-tree-branch{border-bottom:2px solid #aaa;border-bottom-left-radius:1px;border-left:2px solid #aaa;display:inline-block;height:9px;margin-right:5px;margin-top:-9px;vertical-align:middle;width:7px}.tabulator-print-table .tabulator-print-table-group{background:#ccc;border-bottom:1px solid #999;border-right:1px solid #aaa;border-top:1px solid #999;box-sizing:border-box;font-weight:700;min-width:100%;padding:5px 5px 5px 10px}@media (hover:hover) and (pointer:fine){.tabulator-print-table .tabulator-print-table-group:hover{background-color:#0000001a;cursor:pointer}}.tabulator-print-table .tabulator-print-table-group.tabulator-group-visible .tabulator-arrow{border-bottom:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #666;margin-right:10px}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-1 td{padding-left:30px!important}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-2 td{padding-left:50px!important}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-3 td{padding-left:70px!important}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-4 td{padding-left:90px!important}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-5 td{padding-left:110px!important}.tabulator-print-table .tabulator-print-table-group .tabulator-group-toggle{display:inline-block}.tabulator-print-table .tabulator-print-table-group .tabulator-arrow{border-bottom:6px solid transparent;border-left:6px solid #666;border-right:0;border-top:6px solid transparent;display:inline-block;height:0;margin-right:16px;vertical-align:middle;width:0}.tabulator-print-table .tabulator-print-table-group span{color:#d00;margin-left:10px}.tabulator-print-table .tabulator-data-tree-control{align-items:center;background:#0000001a;border:1px solid #333;border-radius:2px;display:inline-flex;height:11px;justify-content:center;margin-right:5px;overflow:hidden;vertical-align:middle;width:11px}@media (hover:hover) and (pointer:fine){.tabulator-print-table .tabulator-data-tree-control:hover{background:#0003;cursor:pointer}}.tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-collapse{background:transparent;display:inline-block;height:7px;position:relative;width:1px}.tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-collapse:after{background:#333;content:\"\";height:1px;left:-3px;position:absolute;top:3px;width:7px}.tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-expand{background:#333;display:inline-block;height:7px;position:relative;width:1px}.tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-expand:after{background:#333;content:\"\";height:1px;left:-3px;position:absolute;top:3px;width:7px}\n"], dependencies: [{ kind: "component", type: PaginationComponent, selector: "byd-grid-pagination" }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "pipe", type: AsyncPipe, name: "async" }], encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-grid', imports: [PaginationComponent, NgTemplateOutlet, AsyncPipe], encapsulation: ViewEncapsulation.None, template: "<div [style.display]=\"this.displayType() === 'grid' ? 'block' : 'none'\">\r\n  <div #table></div>\r\n</div>\r\n\r\n@if (this.isReady$ | async) {\r\n  @if (this.displayType() === 'card') {\r\n    <ng-template [ngTemplateOutlet]=\"this.cardTemplate\" [ngTemplateOutletContext]=\"{ items: this.data }\"></ng-template>\r\n  }\r\n  <byd-grid-pagination [gridId]=\"this.gridId\"></byd-grid-pagination>\r\n}\r\n", styles: [".tabulator{background-color:#888;border:1px solid #999;font-size:14px;overflow:hidden;position:relative;text-align:left;-webkit-transform:translateZ(0);-moz-transform:translateZ(0);-ms-transform:translateZ(0);-o-transform:translateZ(0);transform:translateZ(0)}.tabulator[tabulator-layout=fitDataFill] .tabulator-tableholder .tabulator-table{min-width:100%}.tabulator[tabulator-layout=fitDataTable]{display:inline-block}.tabulator.tabulator-block-select,.tabulator.tabulator-ranges .tabulator-cell:not(.tabulator-editing){-webkit-user-select:none;user-select:none}.tabulator .tabulator-header{background-color:#e6e6e6;border-bottom:1px solid #999;box-sizing:border-box;color:#555;font-weight:700;outline:none;overflow:hidden;position:relative;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;white-space:nowrap;width:100%}.tabulator .tabulator-header.tabulator-header-hidden{display:none}.tabulator .tabulator-header .tabulator-header-contents{overflow:hidden;position:relative}.tabulator .tabulator-header .tabulator-header-contents .tabulator-headers{display:inline-block}.tabulator .tabulator-header .tabulator-col{background:#e6e6e6;border-right:1px solid #aaa;box-sizing:border-box;display:inline-flex;flex-direction:column;justify-content:flex-start;overflow:hidden;position:relative;text-align:left;vertical-align:bottom}.tabulator .tabulator-header .tabulator-col.tabulator-moving{background:#cdcdcd;border:1px solid #999;pointer-events:none;position:absolute}.tabulator .tabulator-header .tabulator-col.tabulator-range-highlight{background-color:#d6d6d6;color:#000}.tabulator .tabulator-header .tabulator-col.tabulator-range-selected{background-color:#3876ca;color:#fff}.tabulator .tabulator-header .tabulator-col .tabulator-col-content{box-sizing:border-box;padding:4px;position:relative}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-header-popup-button{padding:0 8px}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-header-popup-button:hover{cursor:pointer;opacity:.6}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title-holder{position:relative}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title{box-sizing:border-box;overflow:hidden;text-overflow:ellipsis;vertical-align:bottom;white-space:nowrap;width:100%}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title.tabulator-col-title-wrap{text-overflow:clip;white-space:normal}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title .tabulator-title-editor{background:#fff;border:1px solid #999;box-sizing:border-box;padding:1px;width:100%}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title .tabulator-header-popup-button+.tabulator-title-editor{width:calc(100% - 22px)}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter{align-items:center;bottom:0;display:flex;position:absolute;right:4px;top:0}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{border-bottom:6px solid #bbb;border-left:6px solid transparent;border-right:6px solid transparent;height:0;width:0}.tabulator .tabulator-header .tabulator-col.tabulator-col-group .tabulator-col-group-cols{border-top:1px solid #aaa;display:flex;margin-right:-1px;overflow:hidden;position:relative}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter{box-sizing:border-box;margin-top:2px;position:relative;text-align:center;width:100%}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter textarea{height:auto!important}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter svg{margin-top:3px}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter input::-ms-clear{height:0;width:0}.tabulator .tabulator-header .tabulator-col.tabulator-sortable .tabulator-col-title{padding-right:25px}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-header .tabulator-col.tabulator-sortable.tabulator-col-sorter-element:hover{background-color:#cdcdcd;cursor:pointer}}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=none] .tabulator-col-content .tabulator-col-sorter{color:#bbb}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=none] .tabulator-col-content .tabulator-col-sorter.tabulator-col-sorter-element .tabulator-arrow:hover{border-bottom:6px solid #555;cursor:pointer}}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=none] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{border-bottom:6px solid #bbb;border-top:none}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=ascending] .tabulator-col-content .tabulator-col-sorter{color:#666}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=ascending] .tabulator-col-content .tabulator-col-sorter.tabulator-col-sorter-element .tabulator-arrow:hover{border-bottom:6px solid #555;cursor:pointer}}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=ascending] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{border-bottom:6px solid #666;border-top:none}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=descending] .tabulator-col-content .tabulator-col-sorter{color:#666}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=descending] .tabulator-col-content .tabulator-col-sorter.tabulator-col-sorter-element .tabulator-arrow:hover{border-top:6px solid #555;cursor:pointer}}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=descending] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{border-bottom:none;border-top:6px solid #666;color:#666}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical .tabulator-col-content .tabulator-col-title{align-items:center;display:flex;justify-content:center;text-orientation:mixed;writing-mode:vertical-rl}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-col-vertical-flip .tabulator-col-title{transform:rotate(180deg)}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-sortable .tabulator-col-title{padding-right:0;padding-top:20px}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-sortable.tabulator-col-vertical-flip .tabulator-col-title{padding-bottom:20px;padding-right:0}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-sortable .tabulator-col-sorter{justify-content:center;inset:4px 0 auto}.tabulator .tabulator-header .tabulator-frozen{left:0;position:sticky;z-index:11}.tabulator .tabulator-header .tabulator-frozen.tabulator-frozen-left{border-right:2px solid #aaa}.tabulator .tabulator-header .tabulator-frozen.tabulator-frozen-right{border-left:2px solid #aaa}.tabulator .tabulator-header .tabulator-calcs-holder{background:#f3f3f3!important;border-bottom:1px solid #aaa;border-top:1px solid #aaa;box-sizing:border-box;display:inline-block}.tabulator .tabulator-header .tabulator-calcs-holder .tabulator-row{background:#f3f3f3!important}.tabulator .tabulator-header .tabulator-calcs-holder .tabulator-row .tabulator-col-resize-handle{display:none}.tabulator .tabulator-header .tabulator-frozen-rows-holder{display:inline-block}.tabulator .tabulator-header .tabulator-frozen-rows-holder:empty{display:none}.tabulator .tabulator-tableholder{-webkit-overflow-scrolling:touch;overflow:auto;position:relative;white-space:nowrap;width:100%}.tabulator .tabulator-tableholder:focus{outline:none}.tabulator .tabulator-tableholder .tabulator-placeholder{align-items:center;box-sizing:border-box;display:flex;justify-content:center;min-width:100%;width:100%}.tabulator .tabulator-tableholder .tabulator-placeholder[tabulator-render-mode=virtual]{min-height:100%}.tabulator .tabulator-tableholder .tabulator-placeholder .tabulator-placeholder-contents{color:#ccc;display:inline-block;font-size:20px;font-weight:700;padding:10px;text-align:center;white-space:normal}.tabulator .tabulator-tableholder .tabulator-table{background-color:#fff;color:#333;display:inline-block;overflow:visible;position:relative;white-space:nowrap}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.tabulator-calcs{background:#e2e2e2!important;font-weight:700}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.tabulator-calcs.tabulator-calcs-top{border-bottom:2px solid #aaa}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.tabulator-calcs.tabulator-calcs-bottom{border-top:2px solid #aaa}.tabulator .tabulator-tableholder .tabulator-range-overlay{inset:0;pointer-events:none;position:absolute;z-index:10}.tabulator .tabulator-tableholder .tabulator-range-overlay .tabulator-range{border:1px solid #2975dd;box-sizing:border-box;position:absolute}.tabulator .tabulator-tableholder .tabulator-range-overlay .tabulator-range.tabulator-range-active:after{background-color:#2975dd;border-radius:999px;bottom:-3px;content:\"\";height:6px;position:absolute;right:-3px;width:6px}.tabulator .tabulator-tableholder .tabulator-range-overlay .tabulator-range-cell-active{border:2px solid #2975dd;box-sizing:border-box;position:absolute}.tabulator .tabulator-footer{background-color:#e6e6e6;border-top:1px solid #999;color:#555;font-weight:700;user-select:none;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;white-space:nowrap}.tabulator .tabulator-footer .tabulator-footer-contents{align-items:center;display:flex;flex-direction:row;justify-content:space-between;padding:5px 10px}.tabulator .tabulator-footer .tabulator-footer-contents:empty{display:none}.tabulator .tabulator-footer .tabulator-spreadsheet-tabs{margin-top:-5px;overflow-x:auto}.tabulator .tabulator-footer .tabulator-spreadsheet-tabs .tabulator-spreadsheet-tab{border:1px solid #999;border-bottom-left-radius:5px;border-bottom-right-radius:5px;border-top:none;display:inline-block;font-size:.9em;padding:5px}.tabulator .tabulator-footer .tabulator-spreadsheet-tabs .tabulator-spreadsheet-tab:hover{cursor:pointer;opacity:.7}.tabulator .tabulator-footer .tabulator-spreadsheet-tabs .tabulator-spreadsheet-tab.tabulator-spreadsheet-tab-active{background:#fff}.tabulator .tabulator-footer .tabulator-calcs-holder{background:#f3f3f3!important;border-bottom:1px solid #aaa;border-top:1px solid #aaa;box-sizing:border-box;overflow:hidden;text-align:left;width:100%}.tabulator .tabulator-footer .tabulator-calcs-holder .tabulator-row{background:#f3f3f3!important;display:inline-block}.tabulator .tabulator-footer .tabulator-calcs-holder .tabulator-row .tabulator-col-resize-handle{display:none}.tabulator .tabulator-footer .tabulator-calcs-holder:only-child{border-bottom:none;margin-bottom:-5px}.tabulator .tabulator-footer>*+.tabulator-page-counter{margin-left:10px}.tabulator .tabulator-footer .tabulator-page-counter{font-weight:400}.tabulator .tabulator-footer .tabulator-paginator{color:#555;flex:1;font-family:inherit;font-size:inherit;font-weight:inherit;text-align:right}.tabulator .tabulator-footer .tabulator-page-size{border:1px solid #aaa;border-radius:3px;display:inline-block;margin:0 5px;padding:2px 5px}.tabulator .tabulator-footer .tabulator-pages{margin:0 7px}.tabulator .tabulator-footer .tabulator-page{background:#fff3;border:1px solid #aaa;border-radius:3px;display:inline-block;margin:0 2px;padding:2px 5px}.tabulator .tabulator-footer .tabulator-page.active{color:#d00}.tabulator .tabulator-footer .tabulator-page:disabled{opacity:.5}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-footer .tabulator-page:not(disabled):hover{background:#0003;color:#fff;cursor:pointer}}.tabulator .tabulator-col-resize-handle{display:inline-block;margin-left:-3px;margin-right:-3px;position:relative;vertical-align:middle;width:6px;z-index:11}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-col-resize-handle:hover{cursor:ew-resize}}.tabulator .tabulator-col-resize-handle:last-of-type{margin-right:0;width:3px}.tabulator .tabulator-col-resize-guide{background-color:#999;height:100%;margin-left:-.5px;opacity:.5;position:absolute;top:0;width:4px}.tabulator .tabulator-row-resize-guide{background-color:#999;height:4px;left:0;margin-top:-.5px;opacity:.5;position:absolute;width:100%}.tabulator .tabulator-alert{align-items:center;background:#0006;display:flex;height:100%;left:0;position:absolute;text-align:center;top:0;width:100%;z-index:100}.tabulator .tabulator-alert .tabulator-alert-msg{background:#fff;border-radius:10px;display:inline-block;font-size:16px;font-weight:700;margin:0 auto;padding:10px 20px}.tabulator .tabulator-alert .tabulator-alert-msg.tabulator-alert-state-msg{border:4px solid #333;color:#000}.tabulator .tabulator-alert .tabulator-alert-msg.tabulator-alert-state-error{border:4px solid #d00;color:#590000}.tabulator-row{background-color:#fff;box-sizing:border-box;min-height:22px;position:relative}.tabulator-row.tabulator-row-even{background-color:#efefef}@media (hover:hover) and (pointer:fine){.tabulator-row.tabulator-selectable:hover{background-color:#bbb;cursor:pointer}}.tabulator-row.tabulator-selected{background-color:#9abcea}@media (hover:hover) and (pointer:fine){.tabulator-row.tabulator-selected:hover{background-color:#769bcc;cursor:pointer}}.tabulator-row.tabulator-row-moving{background:#fff;border:1px solid #000}.tabulator-row.tabulator-moving{border-bottom:1px solid #aaa;border-top:1px solid #aaa;pointer-events:none;position:absolute;z-index:15}.tabulator-row.tabulator-range-highlight .tabulator-cell.tabulator-range-row-header{background-color:#d6d6d6;color:#000}.tabulator-row.tabulator-range-highlight.tabulator-range-selected .tabulator-cell.tabulator-range-row-header,.tabulator-row.tabulator-range-selected .tabulator-cell.tabulator-range-row-header{background-color:#3876ca;color:#fff}.tabulator-row .tabulator-row-resize-handle{bottom:0;height:5px;left:0;position:absolute;right:0}.tabulator-row .tabulator-row-resize-handle.prev{bottom:auto;top:0}@media (hover:hover) and (pointer:fine){.tabulator-row .tabulator-row-resize-handle:hover{cursor:ns-resize}}.tabulator-row .tabulator-responsive-collapse{border-bottom:1px solid #aaa;border-top:1px solid #aaa;box-sizing:border-box;padding:5px}.tabulator-row .tabulator-responsive-collapse:empty{display:none}.tabulator-row .tabulator-responsive-collapse table{font-size:14px}.tabulator-row .tabulator-responsive-collapse table tr td{position:relative}.tabulator-row .tabulator-responsive-collapse table tr td:first-of-type{padding-right:10px}.tabulator-row .tabulator-cell{border-right:1px solid #aaa;box-sizing:border-box;display:inline-block;outline:none;overflow:hidden;padding:4px;position:relative;text-overflow:ellipsis;vertical-align:middle;white-space:nowrap}.tabulator-row .tabulator-cell.tabulator-row-header{background:#e6e6e6;border-bottom:1px solid #aaa;border-right:1px solid #999}.tabulator-row .tabulator-cell.tabulator-frozen{background-color:inherit;display:inline-block;left:0;position:sticky;z-index:11}.tabulator-row .tabulator-cell.tabulator-frozen.tabulator-frozen-left{border-right:2px solid #aaa}.tabulator-row .tabulator-cell.tabulator-frozen.tabulator-frozen-right{border-left:2px solid #aaa}.tabulator-row .tabulator-cell.tabulator-editing{border:1px solid #1d68cd;outline:none;padding:0}.tabulator-row .tabulator-cell.tabulator-editing input,.tabulator-row .tabulator-cell.tabulator-editing select{background:transparent;border:1px;outline:none}.tabulator-row .tabulator-cell.tabulator-validation-fail{border:1px solid #d00}.tabulator-row .tabulator-cell.tabulator-validation-fail input,.tabulator-row .tabulator-cell.tabulator-validation-fail select{background:transparent;border:1px;color:#d00}.tabulator-row .tabulator-cell.tabulator-row-handle{align-items:center;display:inline-flex;justify-content:center;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none}.tabulator-row .tabulator-cell.tabulator-row-handle .tabulator-row-handle-box{width:80%}.tabulator-row .tabulator-cell.tabulator-row-handle .tabulator-row-handle-box .tabulator-row-handle-bar{background:#666;height:3px;margin-top:2px;width:100%}.tabulator-row .tabulator-cell.tabulator-range-selected:not(.tabulator-range-only-cell-selected):not(.tabulator-range-row-header){background-color:#9abcea}.tabulator-row .tabulator-cell .tabulator-data-tree-branch-empty{display:inline-block;width:7px}.tabulator-row .tabulator-cell .tabulator-data-tree-branch{border-bottom:2px solid #aaa;border-bottom-left-radius:1px;border-left:2px solid #aaa;display:inline-block;height:9px;margin-right:5px;margin-top:-9px;vertical-align:middle;width:7px}.tabulator-row .tabulator-cell .tabulator-data-tree-control{align-items:center;background:#0000001a;border:1px solid #333;border-radius:2px;display:inline-flex;height:11px;justify-content:center;margin-right:5px;overflow:hidden;vertical-align:middle;width:11px}@media (hover:hover) and (pointer:fine){.tabulator-row .tabulator-cell .tabulator-data-tree-control:hover{background:#0003;cursor:pointer}}.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-collapse{background:transparent;display:inline-block;height:7px;position:relative;width:1px}.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-collapse:after{background:#333;content:\"\";height:1px;left:-3px;position:absolute;top:3px;width:7px}.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-expand{background:#333;display:inline-block;height:7px;position:relative;width:1px}.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-expand:after{background:#333;content:\"\";height:1px;left:-3px;position:absolute;top:3px;width:7px}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle{align-items:center;background:#666;border-radius:20px;color:#fff;display:inline-flex;font-size:1.1em;font-weight:700;height:15px;justify-content:center;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;width:15px}@media (hover:hover) and (pointer:fine){.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle:hover{cursor:pointer;opacity:.7}}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle.open .tabulator-responsive-collapse-toggle-close{display:initial}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle.open .tabulator-responsive-collapse-toggle-open{display:none}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle svg{stroke:#fff}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle .tabulator-responsive-collapse-toggle-close{display:none}.tabulator-row .tabulator-cell .tabulator-traffic-light{border-radius:14px;display:inline-block;height:14px;width:14px}.tabulator-row.tabulator-group{background:#ccc;border-bottom:1px solid #999;border-right:1px solid #aaa;border-top:1px solid #999;box-sizing:border-box;font-weight:700;min-width:100%;padding:5px 5px 5px 10px}@media (hover:hover) and (pointer:fine){.tabulator-row.tabulator-group:hover{background-color:#0000001a;cursor:pointer}}.tabulator-row.tabulator-group.tabulator-group-visible .tabulator-arrow{border-bottom:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #666;margin-right:10px}.tabulator-row.tabulator-group.tabulator-group-level-1{padding-left:30px}.tabulator-row.tabulator-group.tabulator-group-level-2{padding-left:50px}.tabulator-row.tabulator-group.tabulator-group-level-3{padding-left:70px}.tabulator-row.tabulator-group.tabulator-group-level-4{padding-left:90px}.tabulator-row.tabulator-group.tabulator-group-level-5{padding-left:110px}.tabulator-row.tabulator-group .tabulator-group-toggle{display:inline-block}.tabulator-row.tabulator-group .tabulator-arrow{border-bottom:6px solid transparent;border-left:6px solid #666;border-right:0;border-top:6px solid transparent;display:inline-block;height:0;margin-right:16px;vertical-align:middle;width:0}.tabulator-row.tabulator-group span{color:#d00;margin-left:10px}.tabulator-toggle{background:#dcdcdc;border:1px solid #ccc;box-sizing:border-box;display:flex;flex-direction:row}.tabulator-toggle.tabulator-toggle-on{background:#1c6cc2}.tabulator-toggle .tabulator-toggle-switch{background:#fff;border:1px solid #ccc;box-sizing:border-box}.tabulator-popup-container{-webkit-overflow-scrolling:touch;background:#fff;border:1px solid #aaa;box-shadow:0 0 5px #0003;box-sizing:border-box;display:inline-block;font-size:14px;overflow-y:auto;position:absolute;z-index:10000}.tabulator-popup{border-radius:3px;padding:5px}.tabulator-tooltip{border-radius:2px;box-shadow:none;font-size:12px;max-width:Min(500px,100%);padding:3px 5px;pointer-events:none}.tabulator-menu .tabulator-menu-item{box-sizing:border-box;padding:5px 10px;position:relative;-webkit-user-select:none;user-select:none}.tabulator-menu .tabulator-menu-item.tabulator-menu-item-disabled{opacity:.5}@media (hover:hover) and (pointer:fine){.tabulator-menu .tabulator-menu-item:not(.tabulator-menu-item-disabled):hover{background:#efefef;cursor:pointer}}.tabulator-menu .tabulator-menu-item.tabulator-menu-item-submenu{padding-right:25px}.tabulator-menu .tabulator-menu-item.tabulator-menu-item-submenu:after{border-color:#aaa;border-style:solid;border-width:1px 1px 0 0;content:\"\";display:inline-block;height:7px;position:absolute;right:10px;top:calc(5px + .4em);transform:rotate(45deg);vertical-align:top;width:7px}.tabulator-menu .tabulator-menu-separator{border-top:1px solid #aaa}.tabulator-edit-list{-webkit-overflow-scrolling:touch;font-size:14px;max-height:200px;overflow-y:auto}.tabulator-edit-list .tabulator-edit-list-item{color:#333;outline:none;padding:4px}.tabulator-edit-list .tabulator-edit-list-item.active{background:#1d68cd;color:#fff}.tabulator-edit-list .tabulator-edit-list-item.active.focused{outline:1px solid hsla(0,0%,100%,.5)}.tabulator-edit-list .tabulator-edit-list-item.focused{outline:1px solid #1d68cd}@media (hover:hover) and (pointer:fine){.tabulator-edit-list .tabulator-edit-list-item:hover{background:#1d68cd;color:#fff;cursor:pointer}}.tabulator-edit-list .tabulator-edit-list-placeholder{color:#333;padding:4px;text-align:center}.tabulator-edit-list .tabulator-edit-list-group{border-bottom:1px solid #aaa;color:#333;font-weight:700;padding:6px 4px 4px}.tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-2,.tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-2{padding-left:12px}.tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-3,.tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-3{padding-left:20px}.tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-4,.tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-4{padding-left:28px}.tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-5,.tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-5{padding-left:36px}.tabulator.tabulator-ltr{direction:ltr}.tabulator.tabulator-rtl{direction:rtl;text-align:initial}.tabulator.tabulator-rtl .tabulator-header .tabulator-col{border-left:1px solid #aaa;border-right:initial;text-align:initial}.tabulator.tabulator-rtl .tabulator-header .tabulator-col.tabulator-col-group .tabulator-col-group-cols{margin-left:-1px;margin-right:0}.tabulator.tabulator-rtl .tabulator-header .tabulator-col.tabulator-sortable .tabulator-col-title{padding-left:25px;padding-right:0}.tabulator.tabulator-rtl .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter{left:8px;right:auto}.tabulator.tabulator-rtl .tabulator-tableholder .tabulator-range-overlay .tabulator-range.tabulator-range-active:after{background-color:#2975dd;border-radius:999px;bottom:-3px;content:\"\";height:6px;left:-3px;position:absolute;right:auto;width:6px}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell{border-left:1px solid #aaa;border-right:initial}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell .tabulator-data-tree-branch{border-bottom-left-radius:0;border-bottom-right-radius:1px;border-left:initial;border-right:2px solid #aaa;margin-left:5px;margin-right:0}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell .tabulator-data-tree-control{margin-left:5px;margin-right:0}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell.tabulator-frozen.tabulator-frozen-left{border-left:2px solid #aaa}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell.tabulator-frozen.tabulator-frozen-right{border-right:2px solid #aaa}.tabulator.tabulator-rtl .tabulator-row .tabulator-col-resize-handle:last-of-type{margin-left:0;margin-right:-3px;width:3px}.tabulator.tabulator-rtl .tabulator-footer .tabulator-calcs-holder{text-align:initial}.tabulator-print-fullscreen{inset:0;position:absolute;z-index:10000}body.tabulator-print-fullscreen-hide>:not(.tabulator-print-fullscreen){display:none!important}.tabulator-print-table{border-collapse:collapse}.tabulator-print-table .tabulator-data-tree-branch{border-bottom:2px solid #aaa;border-bottom-left-radius:1px;border-left:2px solid #aaa;display:inline-block;height:9px;margin-right:5px;margin-top:-9px;vertical-align:middle;width:7px}.tabulator-print-table .tabulator-print-table-group{background:#ccc;border-bottom:1px solid #999;border-right:1px solid #aaa;border-top:1px solid #999;box-sizing:border-box;font-weight:700;min-width:100%;padding:5px 5px 5px 10px}@media (hover:hover) and (pointer:fine){.tabulator-print-table .tabulator-print-table-group:hover{background-color:#0000001a;cursor:pointer}}.tabulator-print-table .tabulator-print-table-group.tabulator-group-visible .tabulator-arrow{border-bottom:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #666;margin-right:10px}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-1 td{padding-left:30px!important}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-2 td{padding-left:50px!important}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-3 td{padding-left:70px!important}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-4 td{padding-left:90px!important}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-5 td{padding-left:110px!important}.tabulator-print-table .tabulator-print-table-group .tabulator-group-toggle{display:inline-block}.tabulator-print-table .tabulator-print-table-group .tabulator-arrow{border-bottom:6px solid transparent;border-left:6px solid #666;border-right:0;border-top:6px solid transparent;display:inline-block;height:0;margin-right:16px;vertical-align:middle;width:0}.tabulator-print-table .tabulator-print-table-group span{color:#d00;margin-left:10px}.tabulator-print-table .tabulator-data-tree-control{align-items:center;background:#0000001a;border:1px solid #333;border-radius:2px;display:inline-flex;height:11px;justify-content:center;margin-right:5px;overflow:hidden;vertical-align:middle;width:11px}@media (hover:hover) and (pointer:fine){.tabulator-print-table .tabulator-data-tree-control:hover{background:#0003;cursor:pointer}}.tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-collapse{background:transparent;display:inline-block;height:7px;position:relative;width:1px}.tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-collapse:after{background:#333;content:\"\";height:1px;left:-3px;position:absolute;top:3px;width:7px}.tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-expand{background:#333;display:inline-block;height:7px;position:relative;width:1px}.tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-expand:after{background:#333;content:\"\";height:1px;left:-3px;position:absolute;top:3px;width:7px}\n"] }]
        }], ctorParameters: () => [{ type: i0.Renderer2 }], propDecorators: { cardTemplate: [{
                type: Input
            }], tableElement: [{
                type: ViewChild,
                args: ['table', { static: true }]
            }] } });

class BydGridTagsComponent extends BydAbstractGridComponent {
    get activeFilters() {
        return this._grid.filters?.get() ?? [];
    }
    ngOnInit() {
        super.ngOnInit();
    }
    remove(filter) {
        this._grid.filters?.remove(filter);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridTagsComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.1", type: BydGridTagsComponent, isStandalone: true, selector: "byd-grid-tags", usesInheritance: true, ngImport: i0, template: "<div class=\"flex-row align-center g-space-sm\">\n  <div class=\"list-tag\">\n    @for (tag of this.activeFilters; track tag.key) {\n      <div class=\"item-tag\">\n        <div class=\"tag-title\">\n          {{ 'grid.' + this.gridId + '.core.' + tag.key | translate }}\n        </div>\n        @for (value of tag.values; track value.field) {\n          <byd-badge\n            [value]=\"value.type + ' ' + value.value\"\n            type=\"primary\"\n            icon=\"close\"\n            (clickAction)=\"this.remove(value)\"\n          ></byd-badge>\n        }\n      </div>\n    }\n  </div>\n\n  <div class=\"reset-n-result flex-start g-space-md\">\n    <!-- <div class=\"rest\" *ngIf=\"this.tagsList.length > 0\">\n      <cam-link (action)=\"this.reset()\" [underline]=\"false\">\n        <div class=\"flex-start g-space-xs align-center\">\n          <cam-font-icon type=\"sm\" name=\"close-tool\"></cam-font-icon>\n          {{ \"grid.tag.delete\" | translate }}\n        </div>\n      </cam-link>\n    </div> -->\n    <div class=\"result\">\n      <byd-text>\n        {{ 'grid.tag.results' | translate: { nb: this.data.length } }}\n      </byd-text>\n    </div>\n  </div>\n</div>\n", styles: [""], dependencies: [{ kind: "pipe", type: TranslatePipe, name: "translate" }, { kind: "component", type: BydBadgeComponent, selector: "byd-badge", inputs: ["value", "type", "icon"], outputs: ["clickAction"] }, { kind: "component", type: BydTextComponent, selector: "byd-text", inputs: ["size", "isBold", "color"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridTagsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-grid-tags', standalone: true, imports: [TranslatePipe, BydBadgeComponent, BydTextComponent], template: "<div class=\"flex-row align-center g-space-sm\">\n  <div class=\"list-tag\">\n    @for (tag of this.activeFilters; track tag.key) {\n      <div class=\"item-tag\">\n        <div class=\"tag-title\">\n          {{ 'grid.' + this.gridId + '.core.' + tag.key | translate }}\n        </div>\n        @for (value of tag.values; track value.field) {\n          <byd-badge\n            [value]=\"value.type + ' ' + value.value\"\n            type=\"primary\"\n            icon=\"close\"\n            (clickAction)=\"this.remove(value)\"\n          ></byd-badge>\n        }\n      </div>\n    }\n  </div>\n\n  <div class=\"reset-n-result flex-start g-space-md\">\n    <!-- <div class=\"rest\" *ngIf=\"this.tagsList.length > 0\">\n      <cam-link (action)=\"this.reset()\" [underline]=\"false\">\n        <div class=\"flex-start g-space-xs align-center\">\n          <cam-font-icon type=\"sm\" name=\"close-tool\"></cam-font-icon>\n          {{ \"grid.tag.delete\" | translate }}\n        </div>\n      </cam-link>\n    </div> -->\n    <div class=\"result\">\n      <byd-text>\n        {{ 'grid.tag.results' | translate: { nb: this.data.length } }}\n      </byd-text>\n    </div>\n  </div>\n</div>\n" }]
        }] });

class BydGridControlComponent extends BydAbstractGridComponent {
    show = { switchView: true };
    constructor() {
        super();
    }
    ngOnInit() {
        super.ngOnInit();
        if (this.breakpoints.isMobile && this.show.switchView) {
            this.switchView('card');
        }
    }
    switchView(type) {
        this._grid.switchView(type);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridControlComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.1", type: BydGridControlComponent, isStandalone: true, selector: "byd-grid-control", inputs: { show: "show" }, usesInheritance: true, ngImport: i0, template: "@if (this.isReady$ | async) {\n  <div class=\"d-flex\">\n    @if (this.show.switchView) {\n      <div class=\"grid-control-container ml-space-xs c-pointer\">\n        <div (click)=\"this.switchView('grid')\" class=\"trigger\" [class.active]=\"this.displayType() === 'grid'\">\n          <mat-icon>list</mat-icon>\n        </div>\n        <div class=\"sep\"></div>\n\n        <div (click)=\"this.switchView('card')\" class=\"trigger\" [class.active]=\"this.displayType() === 'card'\">\n          <mat-icon>grid_view</mat-icon>\n        </div>\n      </div>\n    }\n  </div>\n}\n", styles: [".grid-control-container{display:flex;flex-direction:row;justify-content:space-between;border-radius:8px;border:1px solid var(--byd-brand-400);overflow:hidden}.grid-control-container .trigger{display:flex;align-items:center;padding:var(--byd-space-sm)}.grid-control-container .trigger.active{background:var(--byd-brand-100);color:var(--byd-brand-500)}.grid-control-container .sep{border-left:1px solid var(--byd-brand-400)}\n"], dependencies: [{ kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "pipe", type: AsyncPipe, name: "async" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridControlComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-grid-control', standalone: true, imports: [MatIcon, AsyncPipe], template: "@if (this.isReady$ | async) {\n  <div class=\"d-flex\">\n    @if (this.show.switchView) {\n      <div class=\"grid-control-container ml-space-xs c-pointer\">\n        <div (click)=\"this.switchView('grid')\" class=\"trigger\" [class.active]=\"this.displayType() === 'grid'\">\n          <mat-icon>list</mat-icon>\n        </div>\n        <div class=\"sep\"></div>\n\n        <div (click)=\"this.switchView('card')\" class=\"trigger\" [class.active]=\"this.displayType() === 'card'\">\n          <mat-icon>grid_view</mat-icon>\n        </div>\n      </div>\n    }\n  </div>\n}\n", styles: [".grid-control-container{display:flex;flex-direction:row;justify-content:space-between;border-radius:8px;border:1px solid var(--byd-brand-400);overflow:hidden}.grid-control-container .trigger{display:flex;align-items:center;padding:var(--byd-space-sm)}.grid-control-container .trigger.active{background:var(--byd-brand-100);color:var(--byd-brand-500)}.grid-control-container .sep{border-left:1px solid var(--byd-brand-400)}\n"] }]
        }], ctorParameters: () => [], propDecorators: { show: [{
                type: Input
            }] } });

class BydGridViewService extends BydBaseOdooService {
    constructor() {
        super();
    }
    getData$(model, ajaxParam, fields) {
        const filterParams = ajaxParam.filter.map(f => [f.field, f.type, f.value]) ?? [];
        const orderParams = ajaxParam.sort.map(s => `${s.field} ${s.dir}`).join(',') ?? '';
        return this._odooService.searchCount$(model, filterParams).pipe(mergeMap(count => this._odooService
            .searchRead$(model, filterParams, fields, {
            order: orderParams,
            offset: (ajaxParam.page - 1) * ajaxParam.size,
            limit: ajaxParam.size,
        })
            .pipe(filter(isNonNullable), map(data => ({
            data: data,
            last_page: Math.ceil(count / ajaxParam.size),
        })))));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridViewService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridViewService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridViewService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

class BydGridContainerComponent extends BydAbstractGridComponent {
    model;
    colsMetaData = [];
    tableElement;
    _service = inject(BydGridViewService);
    ngAfterViewInit() {
        this._grid.init({
            elementRef: this.tableElement,
            colsMetaData: this.colsMetaData,
            services: {
                getData$: params => this._service.getData$(this.model, params, this.colsMetaData.map(c => c.name)),
            },
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridContainerComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: BydGridContainerComponent, isStandalone: true, selector: "byd-grid-container", inputs: { model: "model", colsMetaData: "colsMetaData" }, viewQueries: [{ propertyName: "tableElement", first: true, predicate: ["table"], descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<div style=\"display: none\">\r\n  <div #table></div>\r\n</div>\r\n\r\n<ng-content></ng-content>\r\n", styles: [""] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridContainerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-grid-container', imports: [], template: "<div style=\"display: none\">\r\n  <div #table></div>\r\n</div>\r\n\r\n<ng-content></ng-content>\r\n" }]
        }], propDecorators: { model: [{
                type: Input
            }], colsMetaData: [{
                type: Input
            }], tableElement: [{
                type: ViewChild,
                args: ['table', { static: true }]
            }] } });

/*
 * Public API Surface of features
 */

/*
 * Public API Surface of features
 */

/**
 * Generated bundle index. Do not edit.
 */

export { BydGridComponent, BydGridContainerComponent, BydGridControlComponent, BydGridFormComponent, BydGridTagsComponent, ParameterType };
//# sourceMappingURL=beyond-features.mjs.map
