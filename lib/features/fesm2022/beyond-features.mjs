import * as i0 from '@angular/core';
import { Injectable, signal, inject, Input, Component, EventEmitter, ViewChild, Output, ViewEncapsulation } from '@angular/core';
import { BydFormComponent } from '@beyond/form-basic';
import { BydTitleComponent, BydBadgeComponent, BydTextComponent, BydButtonComponent } from '@beyond/ui';
import { InputPanel, InputDropdown, InputDatePicker, InputNumber, InputChoices, InputTextBox } from '@beyond/form-model';
import { isNonNullable, getUniqueArray, BydBaseComponent, TypedTemplateDirective } from '@beyond/utils';
import { of, Subject, BehaviorSubject, firstValueFrom, distinctUntilChanged, filter, mergeMap, map } from 'rxjs';
import { TabulatorFull } from 'tabulator-tables';
import { format } from 'date-fns';
import { NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@beyond/translation';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as i1 from '@angular/material/menu';
import { MatMenuModule } from '@angular/material/menu';
import { TextBoxComponent } from '@beyond/form-input';
import { HandleComplexRequest } from '@beyond/server';
import { BydBaseOdooService } from '@beyond/odoo';

var ParameterType;
(function (ParameterType) {
    ParameterType[ParameterType["Unknown"] = 0] = "Unknown";
    ParameterType[ParameterType["String"] = 1] = "String";
    ParameterType[ParameterType["Number"] = 2] = "Number";
    ParameterType[ParameterType["Boolean"] = 3] = "Boolean";
    ParameterType[ParameterType["DateTime"] = 4] = "DateTime";
    ParameterType[ParameterType["Enum"] = 5] = "Enum";
    ParameterType[ParameterType["Relation"] = 6] = "Relation";
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
                class: 'p-space-sm',
                contentClass: 'grid g-space-md',
                children: keys
                    .filter(key => model.cols[key].data.col.showOnSearch)
                    .map(key => model.cols[key].getInputForm())
                    .filter(isNonNullable)
                    .map(input => new InputPanel({
                    key: 'panel',
                    class: 'g-col-6',
                    children: [input],
                })),
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
    getGroupForm(model) {
        return [
            new InputPanel({
                key: 'main-panel',
                class: 'p-space-sm',
                children: [
                    new InputDropdown({
                        key: 'group',
                        label: `grid.${model.scope}.groupBy`,
                        options: of(Object.values(model.cols)
                            .filter(col => col.data.col.showOnSearch)
                            .map(group => ({
                            id: group.key,
                            name: group.key,
                        }))),
                        value: model.groupBy,
                    }),
                ],
            }),
        ];
    }
    formatGroupForm(data) {
        return data['group'] || null;
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
    get inputLabel() {
        return `grid.${this.data.scope}.core.${this.data.col.name}`;
    }
    get filterValues() {
        return (this.model.filters
            ?.get()
            .find(filter => filter.key === this.key)
            ?.values.map(f => f.value) || []);
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
            value: value.trim(),
        };
    }
}

class BoolCol extends BaseCol {
}

class DateCol extends BaseCol {
    getInputForm() {
        return new InputDatePicker({
            key: this.key,
            label: this.inputLabel,
            rangeEnabled: true,
            value: this.filterValues[0] ? { start: this.filterValues[0] } : undefined,
        });
    }
    formatInputForm(data) {
        const value = data[this.key];
        if (!value) {
            return null;
        }
        return {
            field: this.key,
            type: 'like',
            value: format(value, 'yyyy-MM-dd') + '%',
        };
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
                    value: this.filterValues[0],
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
                    value: this.filterValues[0]?.toString(),
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

class RelationCol extends BaseCol {
    getInputForm() {
        if (this.data.col.dataSearch$) {
            return new InputChoices({
                key: this.key,
                label: this.inputLabel,
                class: 'pb-2',
                advancedSearch$: this.data.col.dataSearch$,
                value: this.filterValues[0],
            });
        }
        return new InputTextBox({
            key: this.key,
            value: this.filterValues[0],
        });
    }
    formatInputForm(data) {
        const value = data[this.key];
        if (!value) {
            return null;
        }
        return {
            field: this.key,
            type: this.data.col.multivalues ? 'in' : '=',
            value: Number(value),
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
            value: this.filterValues[0],
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
    preset;
    _debounceTimer = null;
    constructor(scope, table, preset = []) {
        this.scope = scope;
        this.table = table;
        this.preset = preset;
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
        if (this._debounceTimer) {
            clearTimeout(this._debounceTimer);
        }
        this._debounceTimer = setTimeout(() => {
            this.table.setFilter(filters);
        }, 500);
    }
    remove(filter) {
        this.table.removeFilter(filter.field, filter.type, filter.value);
    }
}

const groupBy = (key, data) => {
    if (!key) {
        return [{ key: '', data }];
    }
    const keys = getUniqueArray(data.map(item => item[key]));
    return keys.map(k => ({
        key: k.toString(),
        data: data.filter(item => item[key] === k),
    }));
};

class BydGridData {
    scope;
    get data() {
        return this.table?.getData() ?? [];
    }
    get dataByGroup() {
        return groupBy(this.groupBy, this.data);
    }
    get isGroup() {
        return this.groupBy !== null;
    }
    rowClicked$ = new Subject();
    table = null;
    cols = {};
    filters = null;
    isReady$ = new BehaviorSubject(false);
    isDataReady$ = new BehaviorSubject(false);
    tableHtml = null;
    displayType = signal('card');
    groupBy = null;
    totalItems = signal(0);
    constructor(scope) {
        this.scope = scope;
    }
    init(params) {
        this.table = new TabulatorFull(params.elementRef.nativeElement, {
            height: '500px',
            layout: 'fitColumns',
            paginationMode: 'remote',
            pagination: true,
            paginationSize: 20,
            paginationInitialPage: 1,
            ajaxFiltering: true,
            filterMode: 'remote',
            initialFilter: params.initialFilter,
            ajaxSorting: true,
            sortMode: 'remote',
            columns: this._getColumns(params.colsMetaData),
            ajaxURL: 'dummy',
            ajaxRequestFunc: (url, config, ajaxParams) => {
                return firstValueFrom(params.services.getData$({
                    ...ajaxParams,
                    groupBy: this.groupBy,
                    colsMetaData: params.colsMetaData,
                }));
            },
            ajaxResponse: (_, __, response) => {
                this.isDataReady$.next(true);
                this.totalItems.set(response.total);
                return response;
            },
        });
        this.table.on('tableBuilt', () => {
            this.tableHtml = params.elementRef;
            this.filters = new BydGridFilters(this.scope, this.table, params.preset);
            this.isReady$.next(true);
        });
        this.table.on('rowClick', (_e, row) => {
            this.rowClicked$.next(row.getData());
        });
    }
    destroy() {
        this.table?.destroy();
    }
    setGroupBy(field) {
        this.groupBy = field;
        this.table?.setGroupBy(field);
        this.table?.setData();
    }
    clearGroupBy() {
        this.groupBy = null;
        this.table?.setGroupBy([]);
        this.table?.setData();
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
            case ParameterType.Relation:
                return new RelationCol({ scope: this.scope, col: col }, this);
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
    get grid() {
        return this._grid;
    }
    get isGroup() {
        return this._grid.isGroup;
    }
    get data() {
        return this._grid.data;
    }
    get dataByGroup() {
        return this._grid.dataByGroup;
    }
    get displayType() {
        return this._grid.displayType;
    }
    isReady$;
    isDataReady$;
    _grid;
    _dataService = inject(BydGridInstanceService);
    constructor() {
        super();
    }
    ngOnInit() {
        this._grid = this._dataService.get(this.gridId, true);
        this.isReady$ = this._grid.isReady$.pipe(distinctUntilChanged(), filter(isReady => isReady));
        this.isDataReady$ = this._grid.isDataReady$.pipe(distinctUntilChanged(), filter(isReady => isReady));
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
    filtersForm = signal([]);
    groupForm = signal([]);
    _formService = inject((BydGridFormService));
    ngOnInit() {
        super.ngOnInit();
        this._registerSubscription(this.isReady$.subscribe({
            next: () => {
                this.filtersForm.set(this._formService.getFiltersForm(this._grid));
                this.groupForm.set(this._formService.getGroupForm(this._grid));
            },
        }));
    }
    applyFilters(data) {
        const filters = this._formService.formatFiltersForm(this._grid, data);
        this._grid.filters?.apply(filters);
    }
    applyGroup(data) {
        const group = this._formService.formatGroupForm(data);
        if (!group) {
            this._grid.clearGroupBy();
            return;
        }
        this._grid.setGroupBy(group);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridFormComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: BydGridFormComponent, isStandalone: true, selector: "byd-grid-form", usesInheritance: true, ngImport: i0, template: "<div>\r\n  <byd-title [level]=\"2\">{{ 'grid.' + this.grid.scope + '.title' }}</byd-title>\r\n</div>\r\n\r\n<div class=\"space-between\">\r\n  <div>\r\n    <byd-form\r\n      [inputs]=\"this.filtersForm()\"\r\n      (valid)=\"this.applyFilters($event)\"\r\n      [askOnDestroy]=\"true\"\r\n      [canDisplayButton]=\"false\"\r\n    ></byd-form>\r\n  </div>\r\n  <div>\r\n    <byd-form\r\n      [inputs]=\"this.groupForm()\"\r\n      (valid)=\"this.applyGroup($event)\"\r\n      [askOnDestroy]=\"true\"\r\n      [canDisplayButton]=\"false\"\r\n    ></byd-form>\r\n  </div>\r\n</div>\r\n", styles: [""], dependencies: [{ kind: "component", type: BydFormComponent, selector: "byd-form", inputs: ["inputs", "askValidation$", "askOnDestroy", "loader", "error", "border", "canDisplayButton", "buttonTitle", "onLive"], outputs: ["valid", "isFormValid"] }, { kind: "component", type: BydTitleComponent, selector: "byd-title", inputs: ["level", "isTheme", "isBold"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridFormComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-grid-form', imports: [BydFormComponent, BydTitleComponent], template: "<div>\r\n  <byd-title [level]=\"2\">{{ 'grid.' + this.grid.scope + '.title' }}</byd-title>\r\n</div>\r\n\r\n<div class=\"space-between\">\r\n  <div>\r\n    <byd-form\r\n      [inputs]=\"this.filtersForm()\"\r\n      (valid)=\"this.applyFilters($event)\"\r\n      [askOnDestroy]=\"true\"\r\n      [canDisplayButton]=\"false\"\r\n    ></byd-form>\r\n  </div>\r\n  <div>\r\n    <byd-form\r\n      [inputs]=\"this.groupForm()\"\r\n      (valid)=\"this.applyGroup($event)\"\r\n      [askOnDestroy]=\"true\"\r\n      [canDisplayButton]=\"false\"\r\n    ></byd-form>\r\n  </div>\r\n</div>\r\n" }]
        }] });

class PaginationComponent extends BydAbstractGridComponent {
    PageNumber;
    maxPageNumber = 10;
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
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.1", type: PaginationComponent, isStandalone: true, selector: "byd-grid-pagination", usesInheritance: true, ngImport: i0, template: "@if (this.grid && this.grid.table && this.show) {\r\n  <div class=\"flex-start g-space-sm align-center\">\r\n    <mat-icon (click)=\"this.grid.table.previousPage()\"> chevron_left </mat-icon>\r\n    <ng-template [ngTemplateOutlet]=\"item\" [ngTemplateOutletContext]=\"{ pagenumber: { number: 1 } }\"></ng-template>\r\n\r\n    @for (page of this.getListPage(); track page.number) {\r\n      <ng-template [ngTemplateOutlet]=\"item\" [ngTemplateOutletContext]=\"{ pagenumber: page }\"></ng-template>\r\n    }\r\n\r\n    @if (this.paginationGetTotalPages > 1) {\r\n      <ng-template\r\n        [ngTemplateOutlet]=\"item\"\r\n        [ngTemplateOutletContext]=\"{\r\n          pagenumber: { number: this.paginationGetTotalPages },\r\n        }\"\r\n      ></ng-template>\r\n    }\r\n\r\n    <mat-icon (click)=\"this.grid.table.nextPage()\"> chevron_right </mat-icon>\r\n  </div>\r\n}\r\n\r\n<ng-template #item let-pagenumber=\"pagenumber\" [typedTemplate]=\"this.PageNumber\">\r\n  <div\r\n    class=\"figure c-pointer\"\r\n    [class.is-active]=\"pagenumber.number === (this.grid.table?.getPage() || 0)\"\r\n    (click)=\"this.grid.table?.setPage(pagenumber.number)\"\r\n  >\r\n    @if (pagenumber.icon) {\r\n      <mat-icon type=\"sm\">{{ pagenumber.icon }}</mat-icon>\r\n    } @else {\r\n      {{ pagenumber.number }}\r\n    }\r\n  </div>\r\n</ng-template>\r\n", styles: [".figure{color:var(--byd-text-primary);border:1px solid var(--byd-border-secondary);padding:var(--byd-space-sm) var(--byd-space-md);border-radius:var(--byd-radius-rounded)}.figure.is-active{color:var(--byd-text-invert-primary);background-color:var(--byd-surface-brand-primary)}\n"], dependencies: [{ kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: TypedTemplateDirective, selector: "ng-template[typedTemplate]", inputs: ["typedTemplate"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: PaginationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-grid-pagination', standalone: true, imports: [MatIcon, NgTemplateOutlet, TypedTemplateDirective], template: "@if (this.grid && this.grid.table && this.show) {\r\n  <div class=\"flex-start g-space-sm align-center\">\r\n    <mat-icon (click)=\"this.grid.table.previousPage()\"> chevron_left </mat-icon>\r\n    <ng-template [ngTemplateOutlet]=\"item\" [ngTemplateOutletContext]=\"{ pagenumber: { number: 1 } }\"></ng-template>\r\n\r\n    @for (page of this.getListPage(); track page.number) {\r\n      <ng-template [ngTemplateOutlet]=\"item\" [ngTemplateOutletContext]=\"{ pagenumber: page }\"></ng-template>\r\n    }\r\n\r\n    @if (this.paginationGetTotalPages > 1) {\r\n      <ng-template\r\n        [ngTemplateOutlet]=\"item\"\r\n        [ngTemplateOutletContext]=\"{\r\n          pagenumber: { number: this.paginationGetTotalPages },\r\n        }\"\r\n      ></ng-template>\r\n    }\r\n\r\n    <mat-icon (click)=\"this.grid.table.nextPage()\"> chevron_right </mat-icon>\r\n  </div>\r\n}\r\n\r\n<ng-template #item let-pagenumber=\"pagenumber\" [typedTemplate]=\"this.PageNumber\">\r\n  <div\r\n    class=\"figure c-pointer\"\r\n    [class.is-active]=\"pagenumber.number === (this.grid.table?.getPage() || 0)\"\r\n    (click)=\"this.grid.table?.setPage(pagenumber.number)\"\r\n  >\r\n    @if (pagenumber.icon) {\r\n      <mat-icon type=\"sm\">{{ pagenumber.icon }}</mat-icon>\r\n    } @else {\r\n      {{ pagenumber.number }}\r\n    }\r\n  </div>\r\n</ng-template>\r\n", styles: [".figure{color:var(--byd-text-primary);border:1px solid var(--byd-border-secondary);padding:var(--byd-space-sm) var(--byd-space-md);border-radius:var(--byd-radius-rounded)}.figure.is-active{color:var(--byd-text-invert-primary);background-color:var(--byd-surface-brand-primary)}\n"] }]
        }], ctorParameters: () => [] });

class BydGridComponent extends BydAbstractGridComponent {
    renderer;
    cardTemplate;
    rowClicked = new EventEmitter();
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
                this._registerSubscription(this._grid.rowClicked$.subscribe({ next: row => this.rowClicked.emit(row) }));
            },
        }));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridComponent, deps: [{ token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.1", type: BydGridComponent, isStandalone: true, selector: "byd-grid", inputs: { cardTemplate: "cardTemplate" }, outputs: { rowClicked: "rowClicked" }, viewQueries: [{ propertyName: "tableElement", first: true, predicate: ["table"], descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<div [style.display]=\"this.displayType() === 'grid' ? 'block' : 'none'\">\r\n  <div #table></div>\r\n</div>\r\n\r\n@if (this.isReady$ | async) {\r\n  @if (this.displayType() === 'card') {\r\n    @if (this.isGroup) {\r\n      @for (group of this.dataByGroup; track group.key) {\r\n        <byd-title [level]=\"3\">{{ group.key }}</byd-title>\r\n        <div class=\"py-space-md\">\r\n          <ng-template\r\n            [ngTemplateOutlet]=\"this.cardTemplate\"\r\n            [ngTemplateOutletContext]=\"{ items: group.data }\"\r\n          ></ng-template>\r\n        </div>\r\n      }\r\n    } @else {\r\n      <ng-template\r\n        [ngTemplateOutlet]=\"this.cardTemplate\"\r\n        [ngTemplateOutletContext]=\"{ items: this.data }\"\r\n      ></ng-template>\r\n    }\r\n  }\r\n  <div class=\"py-space-md align-center\">\r\n    <byd-grid-pagination [gridId]=\"this.gridId\"></byd-grid-pagination>\r\n  </div>\r\n}\r\n", styles: [".tabulator{background-color:#888;border:1px solid #999;font-size:14px;overflow:hidden;position:relative;text-align:left;-webkit-transform:translateZ(0);-moz-transform:translateZ(0);-ms-transform:translateZ(0);-o-transform:translateZ(0);transform:translateZ(0)}.tabulator[tabulator-layout=fitDataFill] .tabulator-tableholder .tabulator-table{min-width:100%}.tabulator[tabulator-layout=fitDataTable]{display:inline-block}.tabulator.tabulator-block-select,.tabulator.tabulator-ranges .tabulator-cell:not(.tabulator-editing){-webkit-user-select:none;user-select:none}.tabulator .tabulator-header{background-color:#e6e6e6;border-bottom:1px solid #999;box-sizing:border-box;color:#555;font-weight:700;outline:none;overflow:hidden;position:relative;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;white-space:nowrap;width:100%}.tabulator .tabulator-header.tabulator-header-hidden{display:none}.tabulator .tabulator-header .tabulator-header-contents{overflow:hidden;position:relative}.tabulator .tabulator-header .tabulator-header-contents .tabulator-headers{display:inline-block}.tabulator .tabulator-header .tabulator-col{background:#e6e6e6;border-right:1px solid #aaa;box-sizing:border-box;display:inline-flex;flex-direction:column;justify-content:flex-start;overflow:hidden;position:relative;text-align:left;vertical-align:bottom}.tabulator .tabulator-header .tabulator-col.tabulator-moving{background:#cdcdcd;border:1px solid #999;pointer-events:none;position:absolute}.tabulator .tabulator-header .tabulator-col.tabulator-range-highlight{background-color:#d6d6d6;color:#000}.tabulator .tabulator-header .tabulator-col.tabulator-range-selected{background-color:#3876ca;color:#fff}.tabulator .tabulator-header .tabulator-col .tabulator-col-content{box-sizing:border-box;padding:4px;position:relative}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-header-popup-button{padding:0 8px}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-header-popup-button:hover{cursor:pointer;opacity:.6}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title-holder{position:relative}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title{box-sizing:border-box;overflow:hidden;text-overflow:ellipsis;vertical-align:bottom;white-space:nowrap;width:100%}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title.tabulator-col-title-wrap{text-overflow:clip;white-space:normal}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title .tabulator-title-editor{background:#fff;border:1px solid #999;box-sizing:border-box;padding:1px;width:100%}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title .tabulator-header-popup-button+.tabulator-title-editor{width:calc(100% - 22px)}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter{align-items:center;bottom:0;display:flex;position:absolute;right:4px;top:0}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{border-bottom:6px solid #bbb;border-left:6px solid transparent;border-right:6px solid transparent;height:0;width:0}.tabulator .tabulator-header .tabulator-col.tabulator-col-group .tabulator-col-group-cols{border-top:1px solid #aaa;display:flex;margin-right:-1px;overflow:hidden;position:relative}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter{box-sizing:border-box;margin-top:2px;position:relative;text-align:center;width:100%}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter textarea{height:auto!important}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter svg{margin-top:3px}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter input::-ms-clear{height:0;width:0}.tabulator .tabulator-header .tabulator-col.tabulator-sortable .tabulator-col-title{padding-right:25px}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-header .tabulator-col.tabulator-sortable.tabulator-col-sorter-element:hover{background-color:#cdcdcd;cursor:pointer}}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=none] .tabulator-col-content .tabulator-col-sorter{color:#bbb}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=none] .tabulator-col-content .tabulator-col-sorter.tabulator-col-sorter-element .tabulator-arrow:hover{border-bottom:6px solid #555;cursor:pointer}}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=none] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{border-bottom:6px solid #bbb;border-top:none}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=ascending] .tabulator-col-content .tabulator-col-sorter{color:#666}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=ascending] .tabulator-col-content .tabulator-col-sorter.tabulator-col-sorter-element .tabulator-arrow:hover{border-bottom:6px solid #555;cursor:pointer}}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=ascending] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{border-bottom:6px solid #666;border-top:none}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=descending] .tabulator-col-content .tabulator-col-sorter{color:#666}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=descending] .tabulator-col-content .tabulator-col-sorter.tabulator-col-sorter-element .tabulator-arrow:hover{border-top:6px solid #555;cursor:pointer}}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=descending] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{border-bottom:none;border-top:6px solid #666;color:#666}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical .tabulator-col-content .tabulator-col-title{align-items:center;display:flex;justify-content:center;text-orientation:mixed;writing-mode:vertical-rl}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-col-vertical-flip .tabulator-col-title{transform:rotate(180deg)}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-sortable .tabulator-col-title{padding-right:0;padding-top:20px}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-sortable.tabulator-col-vertical-flip .tabulator-col-title{padding-bottom:20px;padding-right:0}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-sortable .tabulator-col-sorter{justify-content:center;inset:4px 0 auto}.tabulator .tabulator-header .tabulator-frozen{left:0;position:sticky;z-index:11}.tabulator .tabulator-header .tabulator-frozen.tabulator-frozen-left{border-right:2px solid #aaa}.tabulator .tabulator-header .tabulator-frozen.tabulator-frozen-right{border-left:2px solid #aaa}.tabulator .tabulator-header .tabulator-calcs-holder{background:#f3f3f3!important;border-bottom:1px solid #aaa;border-top:1px solid #aaa;box-sizing:border-box;display:inline-block}.tabulator .tabulator-header .tabulator-calcs-holder .tabulator-row{background:#f3f3f3!important}.tabulator .tabulator-header .tabulator-calcs-holder .tabulator-row .tabulator-col-resize-handle{display:none}.tabulator .tabulator-header .tabulator-frozen-rows-holder{display:inline-block}.tabulator .tabulator-header .tabulator-frozen-rows-holder:empty{display:none}.tabulator .tabulator-tableholder{-webkit-overflow-scrolling:touch;overflow:auto;position:relative;white-space:nowrap;width:100%}.tabulator .tabulator-tableholder:focus{outline:none}.tabulator .tabulator-tableholder .tabulator-placeholder{align-items:center;box-sizing:border-box;display:flex;justify-content:center;min-width:100%;width:100%}.tabulator .tabulator-tableholder .tabulator-placeholder[tabulator-render-mode=virtual]{min-height:100%}.tabulator .tabulator-tableholder .tabulator-placeholder .tabulator-placeholder-contents{color:#ccc;display:inline-block;font-size:20px;font-weight:700;padding:10px;text-align:center;white-space:normal}.tabulator .tabulator-tableholder .tabulator-table{background-color:#fff;color:#333;display:inline-block;overflow:visible;position:relative;white-space:nowrap}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.tabulator-calcs{background:#e2e2e2!important;font-weight:700}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.tabulator-calcs.tabulator-calcs-top{border-bottom:2px solid #aaa}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.tabulator-calcs.tabulator-calcs-bottom{border-top:2px solid #aaa}.tabulator .tabulator-tableholder .tabulator-range-overlay{inset:0;pointer-events:none;position:absolute;z-index:10}.tabulator .tabulator-tableholder .tabulator-range-overlay .tabulator-range{border:1px solid #2975dd;box-sizing:border-box;position:absolute}.tabulator .tabulator-tableholder .tabulator-range-overlay .tabulator-range.tabulator-range-active:after{background-color:#2975dd;border-radius:999px;bottom:-3px;content:\"\";height:6px;position:absolute;right:-3px;width:6px}.tabulator .tabulator-tableholder .tabulator-range-overlay .tabulator-range-cell-active{border:2px solid #2975dd;box-sizing:border-box;position:absolute}.tabulator .tabulator-footer{background-color:#e6e6e6;border-top:1px solid #999;color:#555;font-weight:700;user-select:none;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;white-space:nowrap}.tabulator .tabulator-footer .tabulator-footer-contents{align-items:center;display:flex;flex-direction:row;justify-content:space-between;padding:5px 10px}.tabulator .tabulator-footer .tabulator-footer-contents:empty{display:none}.tabulator .tabulator-footer .tabulator-spreadsheet-tabs{margin-top:-5px;overflow-x:auto}.tabulator .tabulator-footer .tabulator-spreadsheet-tabs .tabulator-spreadsheet-tab{border:1px solid #999;border-bottom-left-radius:5px;border-bottom-right-radius:5px;border-top:none;display:inline-block;font-size:.9em;padding:5px}.tabulator .tabulator-footer .tabulator-spreadsheet-tabs .tabulator-spreadsheet-tab:hover{cursor:pointer;opacity:.7}.tabulator .tabulator-footer .tabulator-spreadsheet-tabs .tabulator-spreadsheet-tab.tabulator-spreadsheet-tab-active{background:#fff}.tabulator .tabulator-footer .tabulator-calcs-holder{background:#f3f3f3!important;border-bottom:1px solid #aaa;border-top:1px solid #aaa;box-sizing:border-box;overflow:hidden;text-align:left;width:100%}.tabulator .tabulator-footer .tabulator-calcs-holder .tabulator-row{background:#f3f3f3!important;display:inline-block}.tabulator .tabulator-footer .tabulator-calcs-holder .tabulator-row .tabulator-col-resize-handle{display:none}.tabulator .tabulator-footer .tabulator-calcs-holder:only-child{border-bottom:none;margin-bottom:-5px}.tabulator .tabulator-footer>*+.tabulator-page-counter{margin-left:10px}.tabulator .tabulator-footer .tabulator-page-counter{font-weight:400}.tabulator .tabulator-footer .tabulator-paginator{color:#555;flex:1;font-family:inherit;font-size:inherit;font-weight:inherit;text-align:right}.tabulator .tabulator-footer .tabulator-page-size{border:1px solid #aaa;border-radius:3px;display:inline-block;margin:0 5px;padding:2px 5px}.tabulator .tabulator-footer .tabulator-pages{margin:0 7px}.tabulator .tabulator-footer .tabulator-page{background:#fff3;border:1px solid #aaa;border-radius:3px;display:inline-block;margin:0 2px;padding:2px 5px}.tabulator .tabulator-footer .tabulator-page.active{color:#d00}.tabulator .tabulator-footer .tabulator-page:disabled{opacity:.5}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-footer .tabulator-page:not(disabled):hover{background:#0003;color:#fff;cursor:pointer}}.tabulator .tabulator-col-resize-handle{display:inline-block;margin-left:-3px;margin-right:-3px;position:relative;vertical-align:middle;width:6px;z-index:11}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-col-resize-handle:hover{cursor:ew-resize}}.tabulator .tabulator-col-resize-handle:last-of-type{margin-right:0;width:3px}.tabulator .tabulator-col-resize-guide{background-color:#999;height:100%;margin-left:-.5px;opacity:.5;position:absolute;top:0;width:4px}.tabulator .tabulator-row-resize-guide{background-color:#999;height:4px;left:0;margin-top:-.5px;opacity:.5;position:absolute;width:100%}.tabulator .tabulator-alert{align-items:center;background:#0006;display:flex;height:100%;left:0;position:absolute;text-align:center;top:0;width:100%;z-index:100}.tabulator .tabulator-alert .tabulator-alert-msg{background:#fff;border-radius:10px;display:inline-block;font-size:16px;font-weight:700;margin:0 auto;padding:10px 20px}.tabulator .tabulator-alert .tabulator-alert-msg.tabulator-alert-state-msg{border:4px solid #333;color:#000}.tabulator .tabulator-alert .tabulator-alert-msg.tabulator-alert-state-error{border:4px solid #d00;color:#590000}.tabulator-row{background-color:#fff;box-sizing:border-box;min-height:22px;position:relative}.tabulator-row.tabulator-row-even{background-color:#efefef}@media (hover:hover) and (pointer:fine){.tabulator-row.tabulator-selectable:hover{background-color:#bbb;cursor:pointer}}.tabulator-row.tabulator-selected{background-color:#9abcea}@media (hover:hover) and (pointer:fine){.tabulator-row.tabulator-selected:hover{background-color:#769bcc;cursor:pointer}}.tabulator-row.tabulator-row-moving{background:#fff;border:1px solid #000}.tabulator-row.tabulator-moving{border-bottom:1px solid #aaa;border-top:1px solid #aaa;pointer-events:none;position:absolute;z-index:15}.tabulator-row.tabulator-range-highlight .tabulator-cell.tabulator-range-row-header{background-color:#d6d6d6;color:#000}.tabulator-row.tabulator-range-highlight.tabulator-range-selected .tabulator-cell.tabulator-range-row-header,.tabulator-row.tabulator-range-selected .tabulator-cell.tabulator-range-row-header{background-color:#3876ca;color:#fff}.tabulator-row .tabulator-row-resize-handle{bottom:0;height:5px;left:0;position:absolute;right:0}.tabulator-row .tabulator-row-resize-handle.prev{bottom:auto;top:0}@media (hover:hover) and (pointer:fine){.tabulator-row .tabulator-row-resize-handle:hover{cursor:ns-resize}}.tabulator-row .tabulator-responsive-collapse{border-bottom:1px solid #aaa;border-top:1px solid #aaa;box-sizing:border-box;padding:5px}.tabulator-row .tabulator-responsive-collapse:empty{display:none}.tabulator-row .tabulator-responsive-collapse table{font-size:14px}.tabulator-row .tabulator-responsive-collapse table tr td{position:relative}.tabulator-row .tabulator-responsive-collapse table tr td:first-of-type{padding-right:10px}.tabulator-row .tabulator-cell{border-right:1px solid #aaa;box-sizing:border-box;display:inline-block;outline:none;overflow:hidden;padding:4px;position:relative;text-overflow:ellipsis;vertical-align:middle;white-space:nowrap}.tabulator-row .tabulator-cell.tabulator-row-header{background:#e6e6e6;border-bottom:1px solid #aaa;border-right:1px solid #999}.tabulator-row .tabulator-cell.tabulator-frozen{background-color:inherit;display:inline-block;left:0;position:sticky;z-index:11}.tabulator-row .tabulator-cell.tabulator-frozen.tabulator-frozen-left{border-right:2px solid #aaa}.tabulator-row .tabulator-cell.tabulator-frozen.tabulator-frozen-right{border-left:2px solid #aaa}.tabulator-row .tabulator-cell.tabulator-editing{border:1px solid #1d68cd;outline:none;padding:0}.tabulator-row .tabulator-cell.tabulator-editing input,.tabulator-row .tabulator-cell.tabulator-editing select{background:transparent;border:1px;outline:none}.tabulator-row .tabulator-cell.tabulator-validation-fail{border:1px solid #d00}.tabulator-row .tabulator-cell.tabulator-validation-fail input,.tabulator-row .tabulator-cell.tabulator-validation-fail select{background:transparent;border:1px;color:#d00}.tabulator-row .tabulator-cell.tabulator-row-handle{align-items:center;display:inline-flex;justify-content:center;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none}.tabulator-row .tabulator-cell.tabulator-row-handle .tabulator-row-handle-box{width:80%}.tabulator-row .tabulator-cell.tabulator-row-handle .tabulator-row-handle-box .tabulator-row-handle-bar{background:#666;height:3px;margin-top:2px;width:100%}.tabulator-row .tabulator-cell.tabulator-range-selected:not(.tabulator-range-only-cell-selected):not(.tabulator-range-row-header){background-color:#9abcea}.tabulator-row .tabulator-cell .tabulator-data-tree-branch-empty{display:inline-block;width:7px}.tabulator-row .tabulator-cell .tabulator-data-tree-branch{border-bottom:2px solid #aaa;border-bottom-left-radius:1px;border-left:2px solid #aaa;display:inline-block;height:9px;margin-right:5px;margin-top:-9px;vertical-align:middle;width:7px}.tabulator-row .tabulator-cell .tabulator-data-tree-control{align-items:center;background:#0000001a;border:1px solid #333;border-radius:2px;display:inline-flex;height:11px;justify-content:center;margin-right:5px;overflow:hidden;vertical-align:middle;width:11px}@media (hover:hover) and (pointer:fine){.tabulator-row .tabulator-cell .tabulator-data-tree-control:hover{background:#0003;cursor:pointer}}.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-collapse{background:transparent;display:inline-block;height:7px;position:relative;width:1px}.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-collapse:after{background:#333;content:\"\";height:1px;left:-3px;position:absolute;top:3px;width:7px}.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-expand{background:#333;display:inline-block;height:7px;position:relative;width:1px}.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-expand:after{background:#333;content:\"\";height:1px;left:-3px;position:absolute;top:3px;width:7px}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle{align-items:center;background:#666;border-radius:20px;color:#fff;display:inline-flex;font-size:1.1em;font-weight:700;height:15px;justify-content:center;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;width:15px}@media (hover:hover) and (pointer:fine){.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle:hover{cursor:pointer;opacity:.7}}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle.open .tabulator-responsive-collapse-toggle-close{display:initial}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle.open .tabulator-responsive-collapse-toggle-open{display:none}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle svg{stroke:#fff}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle .tabulator-responsive-collapse-toggle-close{display:none}.tabulator-row .tabulator-cell .tabulator-traffic-light{border-radius:14px;display:inline-block;height:14px;width:14px}.tabulator-row.tabulator-group{background:#ccc;border-bottom:1px solid #999;border-right:1px solid #aaa;border-top:1px solid #999;box-sizing:border-box;font-weight:700;min-width:100%;padding:5px 5px 5px 10px}@media (hover:hover) and (pointer:fine){.tabulator-row.tabulator-group:hover{background-color:#0000001a;cursor:pointer}}.tabulator-row.tabulator-group.tabulator-group-visible .tabulator-arrow{border-bottom:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #666;margin-right:10px}.tabulator-row.tabulator-group.tabulator-group-level-1{padding-left:30px}.tabulator-row.tabulator-group.tabulator-group-level-2{padding-left:50px}.tabulator-row.tabulator-group.tabulator-group-level-3{padding-left:70px}.tabulator-row.tabulator-group.tabulator-group-level-4{padding-left:90px}.tabulator-row.tabulator-group.tabulator-group-level-5{padding-left:110px}.tabulator-row.tabulator-group .tabulator-group-toggle{display:inline-block}.tabulator-row.tabulator-group .tabulator-arrow{border-bottom:6px solid transparent;border-left:6px solid #666;border-right:0;border-top:6px solid transparent;display:inline-block;height:0;margin-right:16px;vertical-align:middle;width:0}.tabulator-row.tabulator-group span{color:#d00;margin-left:10px}.tabulator-toggle{background:#dcdcdc;border:1px solid #ccc;box-sizing:border-box;display:flex;flex-direction:row}.tabulator-toggle.tabulator-toggle-on{background:#1c6cc2}.tabulator-toggle .tabulator-toggle-switch{background:#fff;border:1px solid #ccc;box-sizing:border-box}.tabulator-popup-container{-webkit-overflow-scrolling:touch;background:#fff;border:1px solid #aaa;box-shadow:0 0 5px #0003;box-sizing:border-box;display:inline-block;font-size:14px;overflow-y:auto;position:absolute;z-index:10000}.tabulator-popup{border-radius:3px;padding:5px}.tabulator-tooltip{border-radius:2px;box-shadow:none;font-size:12px;max-width:Min(500px,100%);padding:3px 5px;pointer-events:none}.tabulator-menu .tabulator-menu-item{box-sizing:border-box;padding:5px 10px;position:relative;-webkit-user-select:none;user-select:none}.tabulator-menu .tabulator-menu-item.tabulator-menu-item-disabled{opacity:.5}@media (hover:hover) and (pointer:fine){.tabulator-menu .tabulator-menu-item:not(.tabulator-menu-item-disabled):hover{background:#efefef;cursor:pointer}}.tabulator-menu .tabulator-menu-item.tabulator-menu-item-submenu{padding-right:25px}.tabulator-menu .tabulator-menu-item.tabulator-menu-item-submenu:after{border-color:#aaa;border-style:solid;border-width:1px 1px 0 0;content:\"\";display:inline-block;height:7px;position:absolute;right:10px;top:calc(5px + .4em);transform:rotate(45deg);vertical-align:top;width:7px}.tabulator-menu .tabulator-menu-separator{border-top:1px solid #aaa}.tabulator-edit-list{-webkit-overflow-scrolling:touch;font-size:14px;max-height:200px;overflow-y:auto}.tabulator-edit-list .tabulator-edit-list-item{color:#333;outline:none;padding:4px}.tabulator-edit-list .tabulator-edit-list-item.active{background:#1d68cd;color:#fff}.tabulator-edit-list .tabulator-edit-list-item.active.focused{outline:1px solid hsla(0,0%,100%,.5)}.tabulator-edit-list .tabulator-edit-list-item.focused{outline:1px solid #1d68cd}@media (hover:hover) and (pointer:fine){.tabulator-edit-list .tabulator-edit-list-item:hover{background:#1d68cd;color:#fff;cursor:pointer}}.tabulator-edit-list .tabulator-edit-list-placeholder{color:#333;padding:4px;text-align:center}.tabulator-edit-list .tabulator-edit-list-group{border-bottom:1px solid #aaa;color:#333;font-weight:700;padding:6px 4px 4px}.tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-2,.tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-2{padding-left:12px}.tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-3,.tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-3{padding-left:20px}.tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-4,.tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-4{padding-left:28px}.tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-5,.tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-5{padding-left:36px}.tabulator.tabulator-ltr{direction:ltr}.tabulator.tabulator-rtl{direction:rtl;text-align:initial}.tabulator.tabulator-rtl .tabulator-header .tabulator-col{border-left:1px solid #aaa;border-right:initial;text-align:initial}.tabulator.tabulator-rtl .tabulator-header .tabulator-col.tabulator-col-group .tabulator-col-group-cols{margin-left:-1px;margin-right:0}.tabulator.tabulator-rtl .tabulator-header .tabulator-col.tabulator-sortable .tabulator-col-title{padding-left:25px;padding-right:0}.tabulator.tabulator-rtl .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter{left:8px;right:auto}.tabulator.tabulator-rtl .tabulator-tableholder .tabulator-range-overlay .tabulator-range.tabulator-range-active:after{background-color:#2975dd;border-radius:999px;bottom:-3px;content:\"\";height:6px;left:-3px;position:absolute;right:auto;width:6px}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell{border-left:1px solid #aaa;border-right:initial}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell .tabulator-data-tree-branch{border-bottom-left-radius:0;border-bottom-right-radius:1px;border-left:initial;border-right:2px solid #aaa;margin-left:5px;margin-right:0}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell .tabulator-data-tree-control{margin-left:5px;margin-right:0}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell.tabulator-frozen.tabulator-frozen-left{border-left:2px solid #aaa}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell.tabulator-frozen.tabulator-frozen-right{border-right:2px solid #aaa}.tabulator.tabulator-rtl .tabulator-row .tabulator-col-resize-handle:last-of-type{margin-left:0;margin-right:-3px;width:3px}.tabulator.tabulator-rtl .tabulator-footer .tabulator-calcs-holder{text-align:initial}.tabulator-print-fullscreen{inset:0;position:absolute;z-index:10000}body.tabulator-print-fullscreen-hide>:not(.tabulator-print-fullscreen){display:none!important}.tabulator-print-table{border-collapse:collapse}.tabulator-print-table .tabulator-data-tree-branch{border-bottom:2px solid #aaa;border-bottom-left-radius:1px;border-left:2px solid #aaa;display:inline-block;height:9px;margin-right:5px;margin-top:-9px;vertical-align:middle;width:7px}.tabulator-print-table .tabulator-print-table-group{background:#ccc;border-bottom:1px solid #999;border-right:1px solid #aaa;border-top:1px solid #999;box-sizing:border-box;font-weight:700;min-width:100%;padding:5px 5px 5px 10px}@media (hover:hover) and (pointer:fine){.tabulator-print-table .tabulator-print-table-group:hover{background-color:#0000001a;cursor:pointer}}.tabulator-print-table .tabulator-print-table-group.tabulator-group-visible .tabulator-arrow{border-bottom:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #666;margin-right:10px}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-1 td{padding-left:30px!important}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-2 td{padding-left:50px!important}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-3 td{padding-left:70px!important}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-4 td{padding-left:90px!important}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-5 td{padding-left:110px!important}.tabulator-print-table .tabulator-print-table-group .tabulator-group-toggle{display:inline-block}.tabulator-print-table .tabulator-print-table-group .tabulator-arrow{border-bottom:6px solid transparent;border-left:6px solid #666;border-right:0;border-top:6px solid transparent;display:inline-block;height:0;margin-right:16px;vertical-align:middle;width:0}.tabulator-print-table .tabulator-print-table-group span{color:#d00;margin-left:10px}.tabulator-print-table .tabulator-data-tree-control{align-items:center;background:#0000001a;border:1px solid #333;border-radius:2px;display:inline-flex;height:11px;justify-content:center;margin-right:5px;overflow:hidden;vertical-align:middle;width:11px}@media (hover:hover) and (pointer:fine){.tabulator-print-table .tabulator-data-tree-control:hover{background:#0003;cursor:pointer}}.tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-collapse{background:transparent;display:inline-block;height:7px;position:relative;width:1px}.tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-collapse:after{background:#333;content:\"\";height:1px;left:-3px;position:absolute;top:3px;width:7px}.tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-expand{background:#333;display:inline-block;height:7px;position:relative;width:1px}.tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-expand:after{background:#333;content:\"\";height:1px;left:-3px;position:absolute;top:3px;width:7px}\n"], dependencies: [{ kind: "component", type: PaginationComponent, selector: "byd-grid-pagination" }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "pipe", type: AsyncPipe, name: "async" }, { kind: "component", type: BydTitleComponent, selector: "byd-title", inputs: ["level", "isTheme", "isBold"] }], encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-grid', imports: [PaginationComponent, NgTemplateOutlet, AsyncPipe, BydTitleComponent], encapsulation: ViewEncapsulation.None, template: "<div [style.display]=\"this.displayType() === 'grid' ? 'block' : 'none'\">\r\n  <div #table></div>\r\n</div>\r\n\r\n@if (this.isReady$ | async) {\r\n  @if (this.displayType() === 'card') {\r\n    @if (this.isGroup) {\r\n      @for (group of this.dataByGroup; track group.key) {\r\n        <byd-title [level]=\"3\">{{ group.key }}</byd-title>\r\n        <div class=\"py-space-md\">\r\n          <ng-template\r\n            [ngTemplateOutlet]=\"this.cardTemplate\"\r\n            [ngTemplateOutletContext]=\"{ items: group.data }\"\r\n          ></ng-template>\r\n        </div>\r\n      }\r\n    } @else {\r\n      <ng-template\r\n        [ngTemplateOutlet]=\"this.cardTemplate\"\r\n        [ngTemplateOutletContext]=\"{ items: this.data }\"\r\n      ></ng-template>\r\n    }\r\n  }\r\n  <div class=\"py-space-md align-center\">\r\n    <byd-grid-pagination [gridId]=\"this.gridId\"></byd-grid-pagination>\r\n  </div>\r\n}\r\n", styles: [".tabulator{background-color:#888;border:1px solid #999;font-size:14px;overflow:hidden;position:relative;text-align:left;-webkit-transform:translateZ(0);-moz-transform:translateZ(0);-ms-transform:translateZ(0);-o-transform:translateZ(0);transform:translateZ(0)}.tabulator[tabulator-layout=fitDataFill] .tabulator-tableholder .tabulator-table{min-width:100%}.tabulator[tabulator-layout=fitDataTable]{display:inline-block}.tabulator.tabulator-block-select,.tabulator.tabulator-ranges .tabulator-cell:not(.tabulator-editing){-webkit-user-select:none;user-select:none}.tabulator .tabulator-header{background-color:#e6e6e6;border-bottom:1px solid #999;box-sizing:border-box;color:#555;font-weight:700;outline:none;overflow:hidden;position:relative;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;white-space:nowrap;width:100%}.tabulator .tabulator-header.tabulator-header-hidden{display:none}.tabulator .tabulator-header .tabulator-header-contents{overflow:hidden;position:relative}.tabulator .tabulator-header .tabulator-header-contents .tabulator-headers{display:inline-block}.tabulator .tabulator-header .tabulator-col{background:#e6e6e6;border-right:1px solid #aaa;box-sizing:border-box;display:inline-flex;flex-direction:column;justify-content:flex-start;overflow:hidden;position:relative;text-align:left;vertical-align:bottom}.tabulator .tabulator-header .tabulator-col.tabulator-moving{background:#cdcdcd;border:1px solid #999;pointer-events:none;position:absolute}.tabulator .tabulator-header .tabulator-col.tabulator-range-highlight{background-color:#d6d6d6;color:#000}.tabulator .tabulator-header .tabulator-col.tabulator-range-selected{background-color:#3876ca;color:#fff}.tabulator .tabulator-header .tabulator-col .tabulator-col-content{box-sizing:border-box;padding:4px;position:relative}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-header-popup-button{padding:0 8px}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-header-popup-button:hover{cursor:pointer;opacity:.6}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title-holder{position:relative}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title{box-sizing:border-box;overflow:hidden;text-overflow:ellipsis;vertical-align:bottom;white-space:nowrap;width:100%}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title.tabulator-col-title-wrap{text-overflow:clip;white-space:normal}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title .tabulator-title-editor{background:#fff;border:1px solid #999;box-sizing:border-box;padding:1px;width:100%}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title .tabulator-header-popup-button+.tabulator-title-editor{width:calc(100% - 22px)}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter{align-items:center;bottom:0;display:flex;position:absolute;right:4px;top:0}.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{border-bottom:6px solid #bbb;border-left:6px solid transparent;border-right:6px solid transparent;height:0;width:0}.tabulator .tabulator-header .tabulator-col.tabulator-col-group .tabulator-col-group-cols{border-top:1px solid #aaa;display:flex;margin-right:-1px;overflow:hidden;position:relative}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter{box-sizing:border-box;margin-top:2px;position:relative;text-align:center;width:100%}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter textarea{height:auto!important}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter svg{margin-top:3px}.tabulator .tabulator-header .tabulator-col .tabulator-header-filter input::-ms-clear{height:0;width:0}.tabulator .tabulator-header .tabulator-col.tabulator-sortable .tabulator-col-title{padding-right:25px}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-header .tabulator-col.tabulator-sortable.tabulator-col-sorter-element:hover{background-color:#cdcdcd;cursor:pointer}}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=none] .tabulator-col-content .tabulator-col-sorter{color:#bbb}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=none] .tabulator-col-content .tabulator-col-sorter.tabulator-col-sorter-element .tabulator-arrow:hover{border-bottom:6px solid #555;cursor:pointer}}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=none] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{border-bottom:6px solid #bbb;border-top:none}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=ascending] .tabulator-col-content .tabulator-col-sorter{color:#666}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=ascending] .tabulator-col-content .tabulator-col-sorter.tabulator-col-sorter-element .tabulator-arrow:hover{border-bottom:6px solid #555;cursor:pointer}}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=ascending] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{border-bottom:6px solid #666;border-top:none}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=descending] .tabulator-col-content .tabulator-col-sorter{color:#666}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=descending] .tabulator-col-content .tabulator-col-sorter.tabulator-col-sorter-element .tabulator-arrow:hover{border-top:6px solid #555;cursor:pointer}}.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort=descending] .tabulator-col-content .tabulator-col-sorter .tabulator-arrow{border-bottom:none;border-top:6px solid #666;color:#666}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical .tabulator-col-content .tabulator-col-title{align-items:center;display:flex;justify-content:center;text-orientation:mixed;writing-mode:vertical-rl}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-col-vertical-flip .tabulator-col-title{transform:rotate(180deg)}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-sortable .tabulator-col-title{padding-right:0;padding-top:20px}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-sortable.tabulator-col-vertical-flip .tabulator-col-title{padding-bottom:20px;padding-right:0}.tabulator .tabulator-header .tabulator-col.tabulator-col-vertical.tabulator-sortable .tabulator-col-sorter{justify-content:center;inset:4px 0 auto}.tabulator .tabulator-header .tabulator-frozen{left:0;position:sticky;z-index:11}.tabulator .tabulator-header .tabulator-frozen.tabulator-frozen-left{border-right:2px solid #aaa}.tabulator .tabulator-header .tabulator-frozen.tabulator-frozen-right{border-left:2px solid #aaa}.tabulator .tabulator-header .tabulator-calcs-holder{background:#f3f3f3!important;border-bottom:1px solid #aaa;border-top:1px solid #aaa;box-sizing:border-box;display:inline-block}.tabulator .tabulator-header .tabulator-calcs-holder .tabulator-row{background:#f3f3f3!important}.tabulator .tabulator-header .tabulator-calcs-holder .tabulator-row .tabulator-col-resize-handle{display:none}.tabulator .tabulator-header .tabulator-frozen-rows-holder{display:inline-block}.tabulator .tabulator-header .tabulator-frozen-rows-holder:empty{display:none}.tabulator .tabulator-tableholder{-webkit-overflow-scrolling:touch;overflow:auto;position:relative;white-space:nowrap;width:100%}.tabulator .tabulator-tableholder:focus{outline:none}.tabulator .tabulator-tableholder .tabulator-placeholder{align-items:center;box-sizing:border-box;display:flex;justify-content:center;min-width:100%;width:100%}.tabulator .tabulator-tableholder .tabulator-placeholder[tabulator-render-mode=virtual]{min-height:100%}.tabulator .tabulator-tableholder .tabulator-placeholder .tabulator-placeholder-contents{color:#ccc;display:inline-block;font-size:20px;font-weight:700;padding:10px;text-align:center;white-space:normal}.tabulator .tabulator-tableholder .tabulator-table{background-color:#fff;color:#333;display:inline-block;overflow:visible;position:relative;white-space:nowrap}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.tabulator-calcs{background:#e2e2e2!important;font-weight:700}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.tabulator-calcs.tabulator-calcs-top{border-bottom:2px solid #aaa}.tabulator .tabulator-tableholder .tabulator-table .tabulator-row.tabulator-calcs.tabulator-calcs-bottom{border-top:2px solid #aaa}.tabulator .tabulator-tableholder .tabulator-range-overlay{inset:0;pointer-events:none;position:absolute;z-index:10}.tabulator .tabulator-tableholder .tabulator-range-overlay .tabulator-range{border:1px solid #2975dd;box-sizing:border-box;position:absolute}.tabulator .tabulator-tableholder .tabulator-range-overlay .tabulator-range.tabulator-range-active:after{background-color:#2975dd;border-radius:999px;bottom:-3px;content:\"\";height:6px;position:absolute;right:-3px;width:6px}.tabulator .tabulator-tableholder .tabulator-range-overlay .tabulator-range-cell-active{border:2px solid #2975dd;box-sizing:border-box;position:absolute}.tabulator .tabulator-footer{background-color:#e6e6e6;border-top:1px solid #999;color:#555;font-weight:700;user-select:none;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;white-space:nowrap}.tabulator .tabulator-footer .tabulator-footer-contents{align-items:center;display:flex;flex-direction:row;justify-content:space-between;padding:5px 10px}.tabulator .tabulator-footer .tabulator-footer-contents:empty{display:none}.tabulator .tabulator-footer .tabulator-spreadsheet-tabs{margin-top:-5px;overflow-x:auto}.tabulator .tabulator-footer .tabulator-spreadsheet-tabs .tabulator-spreadsheet-tab{border:1px solid #999;border-bottom-left-radius:5px;border-bottom-right-radius:5px;border-top:none;display:inline-block;font-size:.9em;padding:5px}.tabulator .tabulator-footer .tabulator-spreadsheet-tabs .tabulator-spreadsheet-tab:hover{cursor:pointer;opacity:.7}.tabulator .tabulator-footer .tabulator-spreadsheet-tabs .tabulator-spreadsheet-tab.tabulator-spreadsheet-tab-active{background:#fff}.tabulator .tabulator-footer .tabulator-calcs-holder{background:#f3f3f3!important;border-bottom:1px solid #aaa;border-top:1px solid #aaa;box-sizing:border-box;overflow:hidden;text-align:left;width:100%}.tabulator .tabulator-footer .tabulator-calcs-holder .tabulator-row{background:#f3f3f3!important;display:inline-block}.tabulator .tabulator-footer .tabulator-calcs-holder .tabulator-row .tabulator-col-resize-handle{display:none}.tabulator .tabulator-footer .tabulator-calcs-holder:only-child{border-bottom:none;margin-bottom:-5px}.tabulator .tabulator-footer>*+.tabulator-page-counter{margin-left:10px}.tabulator .tabulator-footer .tabulator-page-counter{font-weight:400}.tabulator .tabulator-footer .tabulator-paginator{color:#555;flex:1;font-family:inherit;font-size:inherit;font-weight:inherit;text-align:right}.tabulator .tabulator-footer .tabulator-page-size{border:1px solid #aaa;border-radius:3px;display:inline-block;margin:0 5px;padding:2px 5px}.tabulator .tabulator-footer .tabulator-pages{margin:0 7px}.tabulator .tabulator-footer .tabulator-page{background:#fff3;border:1px solid #aaa;border-radius:3px;display:inline-block;margin:0 2px;padding:2px 5px}.tabulator .tabulator-footer .tabulator-page.active{color:#d00}.tabulator .tabulator-footer .tabulator-page:disabled{opacity:.5}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-footer .tabulator-page:not(disabled):hover{background:#0003;color:#fff;cursor:pointer}}.tabulator .tabulator-col-resize-handle{display:inline-block;margin-left:-3px;margin-right:-3px;position:relative;vertical-align:middle;width:6px;z-index:11}@media (hover:hover) and (pointer:fine){.tabulator .tabulator-col-resize-handle:hover{cursor:ew-resize}}.tabulator .tabulator-col-resize-handle:last-of-type{margin-right:0;width:3px}.tabulator .tabulator-col-resize-guide{background-color:#999;height:100%;margin-left:-.5px;opacity:.5;position:absolute;top:0;width:4px}.tabulator .tabulator-row-resize-guide{background-color:#999;height:4px;left:0;margin-top:-.5px;opacity:.5;position:absolute;width:100%}.tabulator .tabulator-alert{align-items:center;background:#0006;display:flex;height:100%;left:0;position:absolute;text-align:center;top:0;width:100%;z-index:100}.tabulator .tabulator-alert .tabulator-alert-msg{background:#fff;border-radius:10px;display:inline-block;font-size:16px;font-weight:700;margin:0 auto;padding:10px 20px}.tabulator .tabulator-alert .tabulator-alert-msg.tabulator-alert-state-msg{border:4px solid #333;color:#000}.tabulator .tabulator-alert .tabulator-alert-msg.tabulator-alert-state-error{border:4px solid #d00;color:#590000}.tabulator-row{background-color:#fff;box-sizing:border-box;min-height:22px;position:relative}.tabulator-row.tabulator-row-even{background-color:#efefef}@media (hover:hover) and (pointer:fine){.tabulator-row.tabulator-selectable:hover{background-color:#bbb;cursor:pointer}}.tabulator-row.tabulator-selected{background-color:#9abcea}@media (hover:hover) and (pointer:fine){.tabulator-row.tabulator-selected:hover{background-color:#769bcc;cursor:pointer}}.tabulator-row.tabulator-row-moving{background:#fff;border:1px solid #000}.tabulator-row.tabulator-moving{border-bottom:1px solid #aaa;border-top:1px solid #aaa;pointer-events:none;position:absolute;z-index:15}.tabulator-row.tabulator-range-highlight .tabulator-cell.tabulator-range-row-header{background-color:#d6d6d6;color:#000}.tabulator-row.tabulator-range-highlight.tabulator-range-selected .tabulator-cell.tabulator-range-row-header,.tabulator-row.tabulator-range-selected .tabulator-cell.tabulator-range-row-header{background-color:#3876ca;color:#fff}.tabulator-row .tabulator-row-resize-handle{bottom:0;height:5px;left:0;position:absolute;right:0}.tabulator-row .tabulator-row-resize-handle.prev{bottom:auto;top:0}@media (hover:hover) and (pointer:fine){.tabulator-row .tabulator-row-resize-handle:hover{cursor:ns-resize}}.tabulator-row .tabulator-responsive-collapse{border-bottom:1px solid #aaa;border-top:1px solid #aaa;box-sizing:border-box;padding:5px}.tabulator-row .tabulator-responsive-collapse:empty{display:none}.tabulator-row .tabulator-responsive-collapse table{font-size:14px}.tabulator-row .tabulator-responsive-collapse table tr td{position:relative}.tabulator-row .tabulator-responsive-collapse table tr td:first-of-type{padding-right:10px}.tabulator-row .tabulator-cell{border-right:1px solid #aaa;box-sizing:border-box;display:inline-block;outline:none;overflow:hidden;padding:4px;position:relative;text-overflow:ellipsis;vertical-align:middle;white-space:nowrap}.tabulator-row .tabulator-cell.tabulator-row-header{background:#e6e6e6;border-bottom:1px solid #aaa;border-right:1px solid #999}.tabulator-row .tabulator-cell.tabulator-frozen{background-color:inherit;display:inline-block;left:0;position:sticky;z-index:11}.tabulator-row .tabulator-cell.tabulator-frozen.tabulator-frozen-left{border-right:2px solid #aaa}.tabulator-row .tabulator-cell.tabulator-frozen.tabulator-frozen-right{border-left:2px solid #aaa}.tabulator-row .tabulator-cell.tabulator-editing{border:1px solid #1d68cd;outline:none;padding:0}.tabulator-row .tabulator-cell.tabulator-editing input,.tabulator-row .tabulator-cell.tabulator-editing select{background:transparent;border:1px;outline:none}.tabulator-row .tabulator-cell.tabulator-validation-fail{border:1px solid #d00}.tabulator-row .tabulator-cell.tabulator-validation-fail input,.tabulator-row .tabulator-cell.tabulator-validation-fail select{background:transparent;border:1px;color:#d00}.tabulator-row .tabulator-cell.tabulator-row-handle{align-items:center;display:inline-flex;justify-content:center;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none}.tabulator-row .tabulator-cell.tabulator-row-handle .tabulator-row-handle-box{width:80%}.tabulator-row .tabulator-cell.tabulator-row-handle .tabulator-row-handle-box .tabulator-row-handle-bar{background:#666;height:3px;margin-top:2px;width:100%}.tabulator-row .tabulator-cell.tabulator-range-selected:not(.tabulator-range-only-cell-selected):not(.tabulator-range-row-header){background-color:#9abcea}.tabulator-row .tabulator-cell .tabulator-data-tree-branch-empty{display:inline-block;width:7px}.tabulator-row .tabulator-cell .tabulator-data-tree-branch{border-bottom:2px solid #aaa;border-bottom-left-radius:1px;border-left:2px solid #aaa;display:inline-block;height:9px;margin-right:5px;margin-top:-9px;vertical-align:middle;width:7px}.tabulator-row .tabulator-cell .tabulator-data-tree-control{align-items:center;background:#0000001a;border:1px solid #333;border-radius:2px;display:inline-flex;height:11px;justify-content:center;margin-right:5px;overflow:hidden;vertical-align:middle;width:11px}@media (hover:hover) and (pointer:fine){.tabulator-row .tabulator-cell .tabulator-data-tree-control:hover{background:#0003;cursor:pointer}}.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-collapse{background:transparent;display:inline-block;height:7px;position:relative;width:1px}.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-collapse:after{background:#333;content:\"\";height:1px;left:-3px;position:absolute;top:3px;width:7px}.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-expand{background:#333;display:inline-block;height:7px;position:relative;width:1px}.tabulator-row .tabulator-cell .tabulator-data-tree-control .tabulator-data-tree-control-expand:after{background:#333;content:\"\";height:1px;left:-3px;position:absolute;top:3px;width:7px}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle{align-items:center;background:#666;border-radius:20px;color:#fff;display:inline-flex;font-size:1.1em;font-weight:700;height:15px;justify-content:center;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;width:15px}@media (hover:hover) and (pointer:fine){.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle:hover{cursor:pointer;opacity:.7}}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle.open .tabulator-responsive-collapse-toggle-close{display:initial}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle.open .tabulator-responsive-collapse-toggle-open{display:none}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle svg{stroke:#fff}.tabulator-row .tabulator-cell .tabulator-responsive-collapse-toggle .tabulator-responsive-collapse-toggle-close{display:none}.tabulator-row .tabulator-cell .tabulator-traffic-light{border-radius:14px;display:inline-block;height:14px;width:14px}.tabulator-row.tabulator-group{background:#ccc;border-bottom:1px solid #999;border-right:1px solid #aaa;border-top:1px solid #999;box-sizing:border-box;font-weight:700;min-width:100%;padding:5px 5px 5px 10px}@media (hover:hover) and (pointer:fine){.tabulator-row.tabulator-group:hover{background-color:#0000001a;cursor:pointer}}.tabulator-row.tabulator-group.tabulator-group-visible .tabulator-arrow{border-bottom:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #666;margin-right:10px}.tabulator-row.tabulator-group.tabulator-group-level-1{padding-left:30px}.tabulator-row.tabulator-group.tabulator-group-level-2{padding-left:50px}.tabulator-row.tabulator-group.tabulator-group-level-3{padding-left:70px}.tabulator-row.tabulator-group.tabulator-group-level-4{padding-left:90px}.tabulator-row.tabulator-group.tabulator-group-level-5{padding-left:110px}.tabulator-row.tabulator-group .tabulator-group-toggle{display:inline-block}.tabulator-row.tabulator-group .tabulator-arrow{border-bottom:6px solid transparent;border-left:6px solid #666;border-right:0;border-top:6px solid transparent;display:inline-block;height:0;margin-right:16px;vertical-align:middle;width:0}.tabulator-row.tabulator-group span{color:#d00;margin-left:10px}.tabulator-toggle{background:#dcdcdc;border:1px solid #ccc;box-sizing:border-box;display:flex;flex-direction:row}.tabulator-toggle.tabulator-toggle-on{background:#1c6cc2}.tabulator-toggle .tabulator-toggle-switch{background:#fff;border:1px solid #ccc;box-sizing:border-box}.tabulator-popup-container{-webkit-overflow-scrolling:touch;background:#fff;border:1px solid #aaa;box-shadow:0 0 5px #0003;box-sizing:border-box;display:inline-block;font-size:14px;overflow-y:auto;position:absolute;z-index:10000}.tabulator-popup{border-radius:3px;padding:5px}.tabulator-tooltip{border-radius:2px;box-shadow:none;font-size:12px;max-width:Min(500px,100%);padding:3px 5px;pointer-events:none}.tabulator-menu .tabulator-menu-item{box-sizing:border-box;padding:5px 10px;position:relative;-webkit-user-select:none;user-select:none}.tabulator-menu .tabulator-menu-item.tabulator-menu-item-disabled{opacity:.5}@media (hover:hover) and (pointer:fine){.tabulator-menu .tabulator-menu-item:not(.tabulator-menu-item-disabled):hover{background:#efefef;cursor:pointer}}.tabulator-menu .tabulator-menu-item.tabulator-menu-item-submenu{padding-right:25px}.tabulator-menu .tabulator-menu-item.tabulator-menu-item-submenu:after{border-color:#aaa;border-style:solid;border-width:1px 1px 0 0;content:\"\";display:inline-block;height:7px;position:absolute;right:10px;top:calc(5px + .4em);transform:rotate(45deg);vertical-align:top;width:7px}.tabulator-menu .tabulator-menu-separator{border-top:1px solid #aaa}.tabulator-edit-list{-webkit-overflow-scrolling:touch;font-size:14px;max-height:200px;overflow-y:auto}.tabulator-edit-list .tabulator-edit-list-item{color:#333;outline:none;padding:4px}.tabulator-edit-list .tabulator-edit-list-item.active{background:#1d68cd;color:#fff}.tabulator-edit-list .tabulator-edit-list-item.active.focused{outline:1px solid hsla(0,0%,100%,.5)}.tabulator-edit-list .tabulator-edit-list-item.focused{outline:1px solid #1d68cd}@media (hover:hover) and (pointer:fine){.tabulator-edit-list .tabulator-edit-list-item:hover{background:#1d68cd;color:#fff;cursor:pointer}}.tabulator-edit-list .tabulator-edit-list-placeholder{color:#333;padding:4px;text-align:center}.tabulator-edit-list .tabulator-edit-list-group{border-bottom:1px solid #aaa;color:#333;font-weight:700;padding:6px 4px 4px}.tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-2,.tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-2{padding-left:12px}.tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-3,.tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-3{padding-left:20px}.tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-4,.tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-4{padding-left:28px}.tabulator-edit-list .tabulator-edit-list-group.tabulator-edit-list-group-level-5,.tabulator-edit-list .tabulator-edit-list-item.tabulator-edit-list-group-level-5{padding-left:36px}.tabulator.tabulator-ltr{direction:ltr}.tabulator.tabulator-rtl{direction:rtl;text-align:initial}.tabulator.tabulator-rtl .tabulator-header .tabulator-col{border-left:1px solid #aaa;border-right:initial;text-align:initial}.tabulator.tabulator-rtl .tabulator-header .tabulator-col.tabulator-col-group .tabulator-col-group-cols{margin-left:-1px;margin-right:0}.tabulator.tabulator-rtl .tabulator-header .tabulator-col.tabulator-sortable .tabulator-col-title{padding-left:25px;padding-right:0}.tabulator.tabulator-rtl .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-sorter{left:8px;right:auto}.tabulator.tabulator-rtl .tabulator-tableholder .tabulator-range-overlay .tabulator-range.tabulator-range-active:after{background-color:#2975dd;border-radius:999px;bottom:-3px;content:\"\";height:6px;left:-3px;position:absolute;right:auto;width:6px}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell{border-left:1px solid #aaa;border-right:initial}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell .tabulator-data-tree-branch{border-bottom-left-radius:0;border-bottom-right-radius:1px;border-left:initial;border-right:2px solid #aaa;margin-left:5px;margin-right:0}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell .tabulator-data-tree-control{margin-left:5px;margin-right:0}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell.tabulator-frozen.tabulator-frozen-left{border-left:2px solid #aaa}.tabulator.tabulator-rtl .tabulator-row .tabulator-cell.tabulator-frozen.tabulator-frozen-right{border-right:2px solid #aaa}.tabulator.tabulator-rtl .tabulator-row .tabulator-col-resize-handle:last-of-type{margin-left:0;margin-right:-3px;width:3px}.tabulator.tabulator-rtl .tabulator-footer .tabulator-calcs-holder{text-align:initial}.tabulator-print-fullscreen{inset:0;position:absolute;z-index:10000}body.tabulator-print-fullscreen-hide>:not(.tabulator-print-fullscreen){display:none!important}.tabulator-print-table{border-collapse:collapse}.tabulator-print-table .tabulator-data-tree-branch{border-bottom:2px solid #aaa;border-bottom-left-radius:1px;border-left:2px solid #aaa;display:inline-block;height:9px;margin-right:5px;margin-top:-9px;vertical-align:middle;width:7px}.tabulator-print-table .tabulator-print-table-group{background:#ccc;border-bottom:1px solid #999;border-right:1px solid #aaa;border-top:1px solid #999;box-sizing:border-box;font-weight:700;min-width:100%;padding:5px 5px 5px 10px}@media (hover:hover) and (pointer:fine){.tabulator-print-table .tabulator-print-table-group:hover{background-color:#0000001a;cursor:pointer}}.tabulator-print-table .tabulator-print-table-group.tabulator-group-visible .tabulator-arrow{border-bottom:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #666;margin-right:10px}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-1 td{padding-left:30px!important}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-2 td{padding-left:50px!important}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-3 td{padding-left:70px!important}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-4 td{padding-left:90px!important}.tabulator-print-table .tabulator-print-table-group.tabulator-group-level-5 td{padding-left:110px!important}.tabulator-print-table .tabulator-print-table-group .tabulator-group-toggle{display:inline-block}.tabulator-print-table .tabulator-print-table-group .tabulator-arrow{border-bottom:6px solid transparent;border-left:6px solid #666;border-right:0;border-top:6px solid transparent;display:inline-block;height:0;margin-right:16px;vertical-align:middle;width:0}.tabulator-print-table .tabulator-print-table-group span{color:#d00;margin-left:10px}.tabulator-print-table .tabulator-data-tree-control{align-items:center;background:#0000001a;border:1px solid #333;border-radius:2px;display:inline-flex;height:11px;justify-content:center;margin-right:5px;overflow:hidden;vertical-align:middle;width:11px}@media (hover:hover) and (pointer:fine){.tabulator-print-table .tabulator-data-tree-control:hover{background:#0003;cursor:pointer}}.tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-collapse{background:transparent;display:inline-block;height:7px;position:relative;width:1px}.tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-collapse:after{background:#333;content:\"\";height:1px;left:-3px;position:absolute;top:3px;width:7px}.tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-expand{background:#333;display:inline-block;height:7px;position:relative;width:1px}.tabulator-print-table .tabulator-data-tree-control .tabulator-data-tree-control-expand:after{background:#333;content:\"\";height:1px;left:-3px;position:absolute;top:3px;width:7px}\n"] }]
        }], ctorParameters: () => [{ type: i0.Renderer2 }], propDecorators: { cardTemplate: [{
                type: Input
            }], rowClicked: [{
                type: Output
            }], tableElement: [{
                type: ViewChild,
                args: ['table', { static: true }]
            }] } });

class BydGridTagsComponent extends BydAbstractGridComponent {
    get group() {
        return this._grid.groupBy;
    }
    get activeFilters() {
        return this._grid.filters?.get() ?? [];
    }
    ngOnInit() {
        super.ngOnInit();
    }
    remove(filter) {
        this._grid.filters?.remove(filter);
    }
    removeGroup() {
        this._grid.clearGroupBy();
    }
    clear() {
        this._grid.filters?.apply([]);
        this._grid.clearGroupBy();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridTagsComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.1", type: BydGridTagsComponent, isStandalone: true, selector: "byd-grid-tags", usesInheritance: true, ngImport: i0, template: "<div class=\"space-between align-center\">\r\n  <div class=\"list-tag flex-start g-space-sm\">\r\n    <div class=\"group-tag flex-start g-space-xs align-center\">\r\n      @if (this.group) {\r\n        {{ 'grid.' + this.gridId + '.core.groupBy' | translate }}:\r\n        <byd-badge [value]=\"this.group\" type=\"primary\" icon=\"close\" (clickAction)=\"this.removeGroup()\"></byd-badge>\r\n      }\r\n    </div>\r\n\r\n    @for (tag of this.activeFilters; track tag.key) {\r\n      <div class=\"item-tag flex-start g-space-xs align-center\">\r\n        <div class=\"tag-title\">{{ 'grid.' + this.gridId + '.core.' + tag.key | translate }}:</div>\r\n        @for (value of tag.values; track value.field) {\r\n          <byd-badge\r\n            [value]=\"value.type + ' ' + value.value\"\r\n            type=\"primary\"\r\n            icon=\"close\"\r\n            (clickAction)=\"this.remove(value)\"\r\n          ></byd-badge>\r\n        }\r\n      </div>\r\n    }\r\n  </div>\r\n\r\n  <div class=\"reset-n-result flex-start g-space-md align-center\">\r\n    @if (this.activeFilters.length > 0) {\r\n      <div class=\"reset\">\r\n        <byd-button (action)=\"this.clear()\">\r\n          {{ 'grid.tag.reset' | translate }}\r\n        </byd-button>\r\n      </div>\r\n    }\r\n    <div class=\"result\">\r\n      <byd-text>\r\n        {{ 'grid.tag.results' | translate: { nb: this.grid.totalItems() } }}\r\n      </byd-text>\r\n    </div>\r\n  </div>\r\n</div>\r\n", styles: [""], dependencies: [{ kind: "pipe", type: TranslatePipe, name: "translate" }, { kind: "component", type: BydBadgeComponent, selector: "byd-badge", inputs: ["value", "type", "icon", "size"], outputs: ["clickAction"] }, { kind: "component", type: BydTextComponent, selector: "byd-text", inputs: ["size", "isBold", "color"] }, { kind: "component", type: BydButtonComponent, selector: "byd-button", inputs: ["state", "type", "size", "icon", "options", "stopPropagationActivation"], outputs: ["action"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridTagsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-grid-tags', standalone: true, imports: [TranslatePipe, BydBadgeComponent, BydTextComponent, BydButtonComponent], template: "<div class=\"space-between align-center\">\r\n  <div class=\"list-tag flex-start g-space-sm\">\r\n    <div class=\"group-tag flex-start g-space-xs align-center\">\r\n      @if (this.group) {\r\n        {{ 'grid.' + this.gridId + '.core.groupBy' | translate }}:\r\n        <byd-badge [value]=\"this.group\" type=\"primary\" icon=\"close\" (clickAction)=\"this.removeGroup()\"></byd-badge>\r\n      }\r\n    </div>\r\n\r\n    @for (tag of this.activeFilters; track tag.key) {\r\n      <div class=\"item-tag flex-start g-space-xs align-center\">\r\n        <div class=\"tag-title\">{{ 'grid.' + this.gridId + '.core.' + tag.key | translate }}:</div>\r\n        @for (value of tag.values; track value.field) {\r\n          <byd-badge\r\n            [value]=\"value.type + ' ' + value.value\"\r\n            type=\"primary\"\r\n            icon=\"close\"\r\n            (clickAction)=\"this.remove(value)\"\r\n          ></byd-badge>\r\n        }\r\n      </div>\r\n    }\r\n  </div>\r\n\r\n  <div class=\"reset-n-result flex-start g-space-md align-center\">\r\n    @if (this.activeFilters.length > 0) {\r\n      <div class=\"reset\">\r\n        <byd-button (action)=\"this.clear()\">\r\n          {{ 'grid.tag.reset' | translate }}\r\n        </byd-button>\r\n      </div>\r\n    }\r\n    <div class=\"result\">\r\n      <byd-text>\r\n        {{ 'grid.tag.results' | translate: { nb: this.grid.totalItems() } }}\r\n      </byd-text>\r\n    </div>\r\n  </div>\r\n</div>\r\n" }]
        }] });

class BydGridControlComponent extends BydAbstractGridComponent {
    show = {
        switchView: true,
        filters: true,
        preset: true,
    };
    dialog = inject(MatDialog);
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
    openFilters() {
        this.dialog.open(FiltersModal, {
            data: { gridId: this.gridId },
        });
    }
    setPreset(preset) {
        this.grid.filters?.apply(preset.filters);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridControlComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.1", type: BydGridControlComponent, isStandalone: true, selector: "byd-grid-control", inputs: { show: "show" }, usesInheritance: true, ngImport: i0, template: "@if (this.isReady$ | async) {\r\n  <div class=\"d-flex\">\r\n    @if (this.show.filters) {\r\n      <div class=\"grid-control-container ml-space-xs c-pointer\">\r\n        <div (click)=\"this.openFilters()\" class=\"trigger\">\r\n          <mat-icon>filter_list</mat-icon>\r\n        </div>\r\n      </div>\r\n    }\r\n    @if (this.show.preset && (this.grid.filters?.preset?.length ?? 0 > 0)) {\r\n      <div class=\"grid-control-container ml-space-xs c-pointer\">\r\n        <div [matMenuTriggerFor]=\"menu\" class=\"trigger\">\r\n          <mat-icon>visibility</mat-icon>\r\n        </div>\r\n      </div>\r\n      <mat-menu #menu=\"matMenu\">\r\n        @for (preset of this.grid.filters?.preset; track preset.name) {\r\n          <button mat-menu-item (click)=\"this.setPreset(preset)\">\r\n            <span>{{ preset.name }}</span>\r\n          </button>\r\n        }\r\n      </mat-menu>\r\n    }\r\n    @if (this.show.switchView) {\r\n      <div class=\"grid-control-container ml-space-xs c-pointer\">\r\n        <div (click)=\"this.switchView('grid')\" class=\"trigger\" [class.active]=\"this.displayType() === 'grid'\">\r\n          <mat-icon>list</mat-icon>\r\n        </div>\r\n        <div class=\"sep\"></div>\r\n\r\n        <div (click)=\"this.switchView('card')\" class=\"trigger\" [class.active]=\"this.displayType() === 'card'\">\r\n          <mat-icon>grid_view</mat-icon>\r\n        </div>\r\n      </div>\r\n    }\r\n  </div>\r\n}\r\n", styles: [".grid-control-container{display:flex;flex-direction:row;justify-content:space-between;border-radius:8px;border:1px solid var(--byd-brand-400);overflow:hidden}.grid-control-container .trigger{display:flex;align-items:center;padding:var(--byd-space-sm)}.grid-control-container .trigger.active{background:var(--byd-brand-100);color:var(--byd-brand-500)}.grid-control-container .sep{border-left:1px solid var(--byd-brand-400)}\n"], dependencies: [{ kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "pipe", type: AsyncPipe, name: "async" }, { kind: "ngmodule", type: MatMenuModule }, { kind: "component", type: i1.MatMenu, selector: "mat-menu", inputs: ["backdropClass", "aria-label", "aria-labelledby", "aria-describedby", "xPosition", "yPosition", "overlapTrigger", "hasBackdrop", "class", "classList"], outputs: ["closed", "close"], exportAs: ["matMenu"] }, { kind: "component", type: i1.MatMenuItem, selector: "[mat-menu-item]", inputs: ["role", "disabled", "disableRipple"], exportAs: ["matMenuItem"] }, { kind: "directive", type: i1.MatMenuTrigger, selector: "[mat-menu-trigger-for], [matMenuTriggerFor]", inputs: ["mat-menu-trigger-for", "matMenuTriggerFor", "matMenuTriggerData", "matMenuTriggerRestoreFocus"], outputs: ["menuOpened", "onMenuOpen", "menuClosed", "onMenuClose"], exportAs: ["matMenuTrigger"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridControlComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-grid-control', standalone: true, imports: [MatIcon, AsyncPipe, MatMenuModule], template: "@if (this.isReady$ | async) {\r\n  <div class=\"d-flex\">\r\n    @if (this.show.filters) {\r\n      <div class=\"grid-control-container ml-space-xs c-pointer\">\r\n        <div (click)=\"this.openFilters()\" class=\"trigger\">\r\n          <mat-icon>filter_list</mat-icon>\r\n        </div>\r\n      </div>\r\n    }\r\n    @if (this.show.preset && (this.grid.filters?.preset?.length ?? 0 > 0)) {\r\n      <div class=\"grid-control-container ml-space-xs c-pointer\">\r\n        <div [matMenuTriggerFor]=\"menu\" class=\"trigger\">\r\n          <mat-icon>visibility</mat-icon>\r\n        </div>\r\n      </div>\r\n      <mat-menu #menu=\"matMenu\">\r\n        @for (preset of this.grid.filters?.preset; track preset.name) {\r\n          <button mat-menu-item (click)=\"this.setPreset(preset)\">\r\n            <span>{{ preset.name }}</span>\r\n          </button>\r\n        }\r\n      </mat-menu>\r\n    }\r\n    @if (this.show.switchView) {\r\n      <div class=\"grid-control-container ml-space-xs c-pointer\">\r\n        <div (click)=\"this.switchView('grid')\" class=\"trigger\" [class.active]=\"this.displayType() === 'grid'\">\r\n          <mat-icon>list</mat-icon>\r\n        </div>\r\n        <div class=\"sep\"></div>\r\n\r\n        <div (click)=\"this.switchView('card')\" class=\"trigger\" [class.active]=\"this.displayType() === 'card'\">\r\n          <mat-icon>grid_view</mat-icon>\r\n        </div>\r\n      </div>\r\n    }\r\n  </div>\r\n}\r\n", styles: [".grid-control-container{display:flex;flex-direction:row;justify-content:space-between;border-radius:8px;border:1px solid var(--byd-brand-400);overflow:hidden}.grid-control-container .trigger{display:flex;align-items:center;padding:var(--byd-space-sm)}.grid-control-container .trigger.active{background:var(--byd-brand-100);color:var(--byd-brand-500)}.grid-control-container .sep{border-left:1px solid var(--byd-brand-400)}\n"] }]
        }], ctorParameters: () => [], propDecorators: { show: [{
                type: Input
            }] } });
class FiltersModal {
    dialogRef = inject((MatDialogRef));
    data = inject(MAT_DIALOG_DATA);
    close() {
        this.dialogRef.close();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: FiltersModal, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: FiltersModal, isStandalone: true, selector: "ng-component", ngImport: i0, template: '<div class="p-space-md"><byd-grid-form [gridId]="this.data.gridId"></byd-grid-form><byd-button (action)="this.close()">Applied</byd-button></div>', isInline: true, dependencies: [{ kind: "component", type: BydGridFormComponent, selector: "byd-grid-form" }, { kind: "component", type: BydButtonComponent, selector: "byd-button", inputs: ["state", "type", "size", "icon", "options", "stopPropagationActivation"], outputs: ["action"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: FiltersModal, decorators: [{
            type: Component,
            args: [{
                    selector: '',
                    template: '<div class="p-space-md"><byd-grid-form [gridId]="this.data.gridId"></byd-grid-form><byd-button (action)="this.close()">Applied</byd-button></div>',
                    standalone: true,
                    imports: [BydGridFormComponent, BydButtonComponent],
                }]
        }] });

class BydGridSessionService {
    _filterData = new HandleComplexRequest();
    setFilter(key, filter) {
        this._filterData.update(key, filter, false);
    }
    getFilter(key) {
        return this._filterData.get(key);
    }
    clearFilter(key) {
        this._filterData.update(key, []);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridSessionService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridSessionService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridSessionService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

const gridSearchFieldsName = 'search';
class BydGridViewService extends BydBaseOdooService {
    constructor() {
        super();
    }
    getData$(model, ajaxParam) {
        const filterParams = () => {
            const searchField = ajaxParam.filter.filter(f => f.field === gridSearchFieldsName);
            const otherFields = ajaxParam.filter.filter(f => f.field !== gridSearchFieldsName);
            return [
                ...searchField.flatMap(f => this._buildOrDomain(ajaxParam.colsMetaData.filter(c => c.isSearchField).map(f => f.name), f.value)),
                ...otherFields.map(f => [f.field, f.type, f.value]),
            ];
        };
        const orderParams = ajaxParam.sort.map(s => `${s.field} ${s.dir}`).join(',') ?? '';
        const groupBy = ajaxParam.groupBy;
        return this._odooService.searchCount$(model, filterParams()).pipe(mergeMap(count => this._odooService
            .searchRead$(model, filterParams(), ajaxParam.colsMetaData.filter(col => !col.notDisplayable).map(col => col.name), {
            order: groupBy ? `${groupBy} asc ${orderParams ? ',' + orderParams : ''}` : orderParams,
            offset: (ajaxParam.page - 1) * ajaxParam.size,
            limit: ajaxParam.size,
        })
            .pipe(filter(isNonNullable), map(data => {
            const mapping = ajaxParam.colsMetaData
                .filter(col => col.type === ParameterType.Relation)
                .map(col => ({ from: col.name, to: col.name.split('_')[0] }));
            if (!mapping || mapping.length === 0) {
                return data;
            }
            return data.map(entity => this._handleJoinData(entity, mapping));
        }), map(data => ({
            data: data,
            total: count,
            last_page: Math.ceil(count / ajaxParam.size),
        })))));
    }
    _buildOrDomain(fields, value) {
        if (fields.length === 0)
            return [];
        return [...fields.slice(0, -1).map(_ => '|'), ...fields.map(field => [field, 'ilike', value])];
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

class BydGridSearchComponent extends BydAbstractGridComponent {
    outOfBox = false;
    input = new InputTextBox();
    _session = inject(BydGridSessionService);
    constructor() {
        super();
        this.input.createFormControl();
    }
    valueChanged(value) {
        const filters = [
            {
                field: gridSearchFieldsName,
                type: 'like',
                value: value.trim(),
            },
        ];
        if (this.outOfBox) {
            this._session.setFilter(this.gridId, filters);
        }
        else {
            this.grid.filters?.apply(filters);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridSearchComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: BydGridSearchComponent, isStandalone: true, selector: "byd-grid-search", inputs: { outOfBox: "outOfBox" }, usesInheritance: true, ngImport: i0, template: "<byd-input-textbox [input]=\"this.input\" (valueChanged)=\"this.valueChanged($event)\"></byd-input-textbox>\r\n", styles: [""], dependencies: [{ kind: "component", type: TextBoxComponent, selector: "byd-input-textbox", inputs: ["input", "matcher", "space"], outputs: ["valueChanged"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridSearchComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-grid-search', imports: [TextBoxComponent], template: "<byd-input-textbox [input]=\"this.input\" (valueChanged)=\"this.valueChanged($event)\"></byd-input-textbox>\r\n" }]
        }], ctorParameters: () => [], propDecorators: { outOfBox: [{
                type: Input
            }] } });

class BydGridContainerComponent extends BydAbstractGridComponent {
    model;
    colsMetaData = [];
    preset;
    tableElement;
    _session = inject(BydGridSessionService);
    _service = inject(BydGridViewService);
    ngAfterViewInit() {
        const raw = this._session.getFilter(this.gridId);
        this._grid.init({
            elementRef: this.tableElement,
            colsMetaData: this.colsMetaData,
            initialFilter: raw ?? [],
            preset: this.preset,
            services: {
                getData$: params => this._service.getData$(this.model, params),
            },
        });
    }
    ngOnDestroy() {
        this._grid.destroy();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridContainerComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: BydGridContainerComponent, isStandalone: true, selector: "byd-grid-container", inputs: { model: "model", colsMetaData: "colsMetaData", preset: "preset" }, viewQueries: [{ propertyName: "tableElement", first: true, predicate: ["table"], descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: "<div style=\"display: none\">\r\n  <div #table></div>\r\n</div>\r\n\r\n<ng-content></ng-content>\r\n", styles: [""] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGridContainerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-grid-container', imports: [], template: "<div style=\"display: none\">\r\n  <div #table></div>\r\n</div>\r\n\r\n<ng-content></ng-content>\r\n" }]
        }], propDecorators: { model: [{
                type: Input
            }], colsMetaData: [{
                type: Input
            }], preset: [{
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

export { BydGridComponent, BydGridContainerComponent, BydGridControlComponent, BydGridFormComponent, BydGridSearchComponent, BydGridTagsComponent, FiltersModal, ParameterType };
//# sourceMappingURL=beyond-features.mjs.map
