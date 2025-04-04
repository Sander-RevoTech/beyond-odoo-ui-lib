import * as i0 from '@angular/core';
import { Input, Component, EventEmitter, Output } from '@angular/core';
import * as i4 from '@angular/forms';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import * as i1 from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import * as i2$1 from '@angular/material/input';
import { MatInputModule } from '@angular/material/input';
import { BydBaseComponent, TranslatePipe, toArray } from '@beyond/utils';
import { NgIf, NgFor, AsyncPipe, NgClass } from '@angular/common';
import * as i3 from '@angular/material/core';
import { ErrorStateMatcher } from '@angular/material/core';
import * as i2 from '@angular/material/select';
import { MatSelectModule } from '@angular/material/select';
import { switchMap, map } from 'rxjs/operators';
import * as i1$1 from '@angular/material/radio';
import { MatRadioModule } from '@angular/material/radio';
import * as i3$1 from '@angular/cdk/text-field';
import * as i2$2 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import * as i2$3 from '@angular/material/slide-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslatePipe as TranslatePipe$1 } from '@beyond/translation';
import { BydButtonComponent } from '@beyond/ui';

class CheckboxComponent extends BydBaseComponent {
    input;
    constructor() {
        super();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: CheckboxComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: CheckboxComponent, isStandalone: true, selector: "byd-input-checkbox", inputs: { input: "input" }, usesInheritance: true, ngImport: i0, template: "<mat-checkbox [formControl]=\"$any(this.input.formControl)\">\r\n  {{ input.label | translate }}\r\n</mat-checkbox>\r\n", styles: [""], dependencies: [{ kind: "ngmodule", type: MatFormFieldModule }, { kind: "ngmodule", type: MatInputModule }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i4.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "pipe", type: TranslatePipe, name: "translate" }, { kind: "component", type: MatCheckbox, selector: "mat-checkbox", inputs: ["aria-label", "aria-labelledby", "aria-describedby", "aria-expanded", "aria-controls", "aria-owns", "id", "required", "labelPosition", "name", "value", "disableRipple", "tabIndex", "color", "disabledInteractive", "checked", "disabled", "indeterminate"], outputs: ["change", "indeterminateChange"], exportAs: ["matCheckbox"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: CheckboxComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-input-checkbox', standalone: true, imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, TranslatePipe, MatCheckbox], template: "<mat-checkbox [formControl]=\"$any(this.input.formControl)\">\r\n  {{ input.label | translate }}\r\n</mat-checkbox>\r\n" }]
        }], ctorParameters: () => [], propDecorators: { input: [{
                type: Input
            }] } });

class FormLabelComponent {
    input;
    validators = Validators;
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: FormLabelComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: FormLabelComponent, isStandalone: true, selector: "byd-form-label", inputs: { input: "input" }, ngImport: i0, template: "<div *ngIf=\"this.input.label\">\r\n  <mat-label>\r\n    {{ this.input.label | translate }}\r\n    <span *ngFor=\"let validator of this.input.validators\">\r\n      <span *ngIf=\"validator === validators.required\"> * </span>\r\n    </span>\r\n  </mat-label>\r\n</div>\r\n", styles: ["mat-label{display:block;font-size:var(--byd-font-body-sm-default-size);line-height:var(--byd-font-body-sm-default-line);font-weight:var(--byd-font-body-sm-default-weight);color:var(--byd-brand-700);margin-bottom:var(--byd-space-sm)}\n"], dependencies: [{ kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "ngmodule", type: MatFormFieldModule }, { kind: "directive", type: i1.MatLabel, selector: "mat-label" }, { kind: "ngmodule", type: MatInputModule }, { kind: "ngmodule", type: FormsModule }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "pipe", type: TranslatePipe, name: "translate" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: FormLabelComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-form-label', standalone: true, imports: [NgIf, NgFor, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, TranslatePipe], template: "<div *ngIf=\"this.input.label\">\r\n  <mat-label>\r\n    {{ this.input.label | translate }}\r\n    <span *ngFor=\"let validator of this.input.validators\">\r\n      <span *ngIf=\"validator === validators.required\"> * </span>\r\n    </span>\r\n  </mat-label>\r\n</div>\r\n", styles: ["mat-label{display:block;font-size:var(--byd-font-body-sm-default-size);line-height:var(--byd-font-body-sm-default-line);font-weight:var(--byd-font-body-sm-default-weight);color:var(--byd-brand-700);margin-bottom:var(--byd-space-sm)}\n"] }]
        }], propDecorators: { input: [{
                type: Input
            }] } });

class DropdownComponent extends BydBaseComponent {
    input;
    matcher;
    space = true;
    valueChanged = new EventEmitter();
    validators = Validators;
    filteredOptions$ = null;
    constructor() {
        super();
    }
    ngOnInit() {
        if (this.matcher === null) {
            this.matcher = new ErrorStateMatcher();
        }
        if (this.input.formControl) {
            this.filteredOptions$ = this.input.formControl.valueChanges.pipe(switchMap(x => this._filter(x)));
        }
    }
    onChange(value) {
        this.valueChanged.emit(value);
    }
    _filter(value) {
        return this.input.options.pipe(map(x => x.filter(option => option.name?.toLowerCase()?.includes(toArray(value).join(' ')?.toLowerCase()))));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: DropdownComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: DropdownComponent, isStandalone: true, selector: "byd-input-dropdown", inputs: { input: "input", matcher: "matcher", space: "space" }, outputs: { valueChanged: "valueChanged" }, usesInheritance: true, ngImport: i0, template: "<ng-container *ngIf=\"this.input\">\r\n  <byd-form-label [input]=\"this.input\"></byd-form-label>\r\n\r\n  <mat-form-field [floatLabel]=\"'auto'\">\r\n    <mat-select\r\n      #box\r\n      panelClass=\"dropdown-panel\"\r\n      [disabled]=\"this.input.disabled\"\r\n      [id]=\"this.input.key\"\r\n      [formControl]=\"$any(this.input.formControl)\"\r\n      [multiple]=\"this.input.multiple\"\r\n      (selectionChange)=\"this.onChange($event)\"\r\n    >\r\n      <mat-option *ngIf=\"this.input.showNothingOption\" [value]=\"null\"></mat-option>\r\n      <mat-option *ngFor=\"let opt of this.input.options | async\" [value]=\"opt.id\" [disabled]=\"opt.disabled || false\">\r\n        {{ opt.name | translate }}\r\n      </mat-option>\r\n    </mat-select>\r\n\r\n    <mat-hint>\r\n      <div *ngIf=\"this.input.message\" class=\"message\">\r\n        <span> {{ this.input.message }} </span>\r\n      </div>\r\n    </mat-hint>\r\n    <mat-error *ngIf=\"this.input.formControl?.hasError('message')\">\r\n      <div class=\"alert alert-danger\" role=\"alert\">\r\n        {{ this.input.formControl?.getError('message') }}\r\n      </div>\r\n    </mat-error>\r\n    <mat-error *ngIf=\"this.input.formControl?.hasError('required')\">\r\n      <div class=\"alert alert-danger\" role=\"alert\">\r\n        {{ this.input.label | translate }} est <strong>obligatoire</strong>\r\n      </div>\r\n    </mat-error>\r\n  </mat-form-field>\r\n</ng-container>\r\n", styles: [""], dependencies: [{ kind: "pipe", type: AsyncPipe, name: "async" }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "ngmodule", type: MatFormFieldModule }, { kind: "component", type: i1.MatFormField, selector: "mat-form-field", inputs: ["hideRequiredMarker", "color", "floatLabel", "appearance", "subscriptSizing", "hintLabel"], exportAs: ["matFormField"] }, { kind: "directive", type: i1.MatHint, selector: "mat-hint", inputs: ["align", "id"] }, { kind: "directive", type: i1.MatError, selector: "mat-error, [matError]", inputs: ["id"] }, { kind: "ngmodule", type: MatSelectModule }, { kind: "component", type: i2.MatSelect, selector: "mat-select", inputs: ["aria-describedby", "panelClass", "disabled", "disableRipple", "tabIndex", "hideSingleSelectionIndicator", "placeholder", "required", "multiple", "disableOptionCentering", "compareWith", "value", "aria-label", "aria-labelledby", "errorStateMatcher", "typeaheadDebounceInterval", "sortComparator", "id", "panelWidth", "canSelectNullableOptions"], outputs: ["openedChange", "opened", "closed", "selectionChange", "valueChange"], exportAs: ["matSelect"] }, { kind: "component", type: i3.MatOption, selector: "mat-option", inputs: ["value", "id", "disabled"], outputs: ["onSelectionChange"], exportAs: ["matOption"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i4.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "pipe", type: TranslatePipe, name: "translate" }, { kind: "component", type: FormLabelComponent, selector: "byd-form-label", inputs: ["input"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: DropdownComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-input-dropdown', standalone: true, imports: [
                        AsyncPipe,
                        NgIf,
                        NgFor,
                        MatFormFieldModule,
                        MatSelectModule,
                        FormsModule,
                        ReactiveFormsModule,
                        TranslatePipe,
                        FormLabelComponent,
                    ], template: "<ng-container *ngIf=\"this.input\">\r\n  <byd-form-label [input]=\"this.input\"></byd-form-label>\r\n\r\n  <mat-form-field [floatLabel]=\"'auto'\">\r\n    <mat-select\r\n      #box\r\n      panelClass=\"dropdown-panel\"\r\n      [disabled]=\"this.input.disabled\"\r\n      [id]=\"this.input.key\"\r\n      [formControl]=\"$any(this.input.formControl)\"\r\n      [multiple]=\"this.input.multiple\"\r\n      (selectionChange)=\"this.onChange($event)\"\r\n    >\r\n      <mat-option *ngIf=\"this.input.showNothingOption\" [value]=\"null\"></mat-option>\r\n      <mat-option *ngFor=\"let opt of this.input.options | async\" [value]=\"opt.id\" [disabled]=\"opt.disabled || false\">\r\n        {{ opt.name | translate }}\r\n      </mat-option>\r\n    </mat-select>\r\n\r\n    <mat-hint>\r\n      <div *ngIf=\"this.input.message\" class=\"message\">\r\n        <span> {{ this.input.message }} </span>\r\n      </div>\r\n    </mat-hint>\r\n    <mat-error *ngIf=\"this.input.formControl?.hasError('message')\">\r\n      <div class=\"alert alert-danger\" role=\"alert\">\r\n        {{ this.input.formControl?.getError('message') }}\r\n      </div>\r\n    </mat-error>\r\n    <mat-error *ngIf=\"this.input.formControl?.hasError('required')\">\r\n      <div class=\"alert alert-danger\" role=\"alert\">\r\n        {{ this.input.label | translate }} est <strong>obligatoire</strong>\r\n      </div>\r\n    </mat-error>\r\n  </mat-form-field>\r\n</ng-container>\r\n" }]
        }], ctorParameters: () => [], propDecorators: { input: [{
                type: Input
            }], matcher: [{
                type: Input
            }], space: [{
                type: Input
            }], valueChanged: [{
                type: Output
            }] } });

class LabelComponent {
    input;
    constructor() { }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LabelComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: LabelComponent, isStandalone: true, selector: "byd-input-label", inputs: { input: "input" }, ngImport: i0, template: "<span>{{ input.label | translate }}</span>\r\n<span>{{ input.extraInfo | async }}</span>\r\n", styles: [""], dependencies: [{ kind: "ngmodule", type: MatFormFieldModule }, { kind: "ngmodule", type: MatInputModule }, { kind: "ngmodule", type: FormsModule }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "pipe", type: TranslatePipe, name: "translate" }, { kind: "pipe", type: AsyncPipe, name: "async" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LabelComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-input-label', standalone: true, imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, TranslatePipe, AsyncPipe], template: "<span>{{ input.label | translate }}</span>\r\n<span>{{ input.extraInfo | async }}</span>\r\n" }]
        }], ctorParameters: () => [], propDecorators: { input: [{
                type: Input
            }] } });

class RadioComponent extends BydBaseComponent {
    input;
    constructor() {
        super();
    }
    iconSize(option) {
        return this.hasLabel(option) ? 'xs' : 'sm';
    }
    hasLabel(option) {
        return !!option.name && option.name.length > 0;
    }
    onOptionClicked(optionId) {
        if (this.input.disabled)
            return;
        if (this.input.value === optionId) {
            this.input.formControl?.setValue(null);
        }
        else {
            this.input.formControl?.setValue(optionId);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: RadioComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: RadioComponent, isStandalone: true, selector: "byd-input-radio", inputs: { input: "input" }, usesInheritance: true, ngImport: i0, template: "<div class=\"radio-label\">\r\n  <byd-form-label [input]=\"this.input\"></byd-form-label>\r\n</div>\r\n\r\n<div class=\"radio-container\" *ngIf=\"!this.input.useMaterialTheme\">\r\n  <div\r\n    class=\"radio-element\"\r\n    [ngClass]=\"{\r\n      validated: this.input.value === option.id,\r\n      disabled: this.input.disabled,\r\n    }\"\r\n    *ngFor=\"let option of this.input.options | async\"\r\n    (click)=\"this.onOptionClicked(option.id)\"\r\n  >\r\n    <div\r\n      [ngClass]=\"{\r\n        'button-with-icon': this.hasLabel(option),\r\n        'only-icon': !this.hasLabel(option),\r\n      }\"\r\n    >\r\n      <!-- <byd-local-icon\r\n        *ngIf=\"option.icon\"\r\n        [type]=\"option.icon\"\r\n        [size]=\"this.iconSize(option)\"\r\n      >\r\n      </byd-local-icon> -->\r\n\r\n      <span *ngIf=\"option.name\">\r\n        {{ option.name | translate }}\r\n      </span>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<mat-radio-group *ngIf=\"this.input.useMaterialTheme\" [id]=\"this.input.key\" [formControl]=\"$any(this.input.formControl)\">\r\n  <mat-radio-button\r\n    [ngClass]=\"{ validated: this.input.value === option.id }\"\r\n    *ngFor=\"let option of this.input.options | async\"\r\n    [value]=\"option.id\"\r\n  >\r\n    <div class=\"button-with-icon\">\r\n      <!-- <byd-local-icon\r\n        *ngIf=\"this.option.icon\"\r\n        [type]=\"this.option.icon\"\r\n        [size]=\"this.iconSize(option)\"\r\n      >\r\n      </byd-local-icon> -->\r\n\r\n      <span *ngIf=\"option.name\">\r\n        {{ option.name | translate }}\r\n      </span>\r\n    </div>\r\n  </mat-radio-button>\r\n</mat-radio-group>\r\n", styles: [".radio-label{display:block;padding-bottom:.5em}.button-with-icon{display:flex;flex-direction:row;justify-content:flex-start;align-items:center;column-gap:8px}.only-icon{margin-left:auto;margin-right:auto}.radio-container{display:flex!important;display:flex;flex-direction:row;justify-content:space-between}.radio-container .radio-element{display:flex;height:50px;width:45%;border:2px solid var(--byd-neutral-400);border-radius:20px;box-sizing:border-box;align-items:center;gap:8px;justify-content:center;color:var(--byd-neutral-600);font-size:var(--byd-font-body-md-default-size);line-height:var(--byd-font-body-md-default-line);font-weight:var(--byd-font-body-md-default-weight);line-height:28px;font-weight:500}.radio-container .radio-element app-local-icon{opacity:.4}.radio-container .radio-element.validated{border:2px solid var(--byd-surface-brand-primary)}.radio-container .radio-element.validated app-local-icon{opacity:1}.radio-container .radio-element.validated span{color:var(--byd-neutral-900)}.radio-container .radio-element.disabled{opacity:.4}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: MatFormFieldModule }, { kind: "ngmodule", type: MatRadioModule }, { kind: "directive", type: i1$1.MatRadioGroup, selector: "mat-radio-group", inputs: ["color", "name", "labelPosition", "value", "selected", "disabled", "required", "disabledInteractive"], outputs: ["change"], exportAs: ["matRadioGroup"] }, { kind: "component", type: i1$1.MatRadioButton, selector: "mat-radio-button", inputs: ["id", "name", "aria-label", "aria-labelledby", "aria-describedby", "disableRipple", "tabIndex", "checked", "value", "labelPosition", "disabled", "required", "color", "disabledInteractive"], outputs: ["change"], exportAs: ["matRadioButton"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i4.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "pipe", type: TranslatePipe, name: "translate" }, { kind: "component", type: FormLabelComponent, selector: "byd-form-label", inputs: ["input"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: RadioComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-input-radio', standalone: true, imports: [
                        NgClass,
                        NgIf,
                        MatFormFieldModule,
                        MatRadioModule,
                        FormsModule,
                        ReactiveFormsModule,
                        TranslatePipe,
                        FormLabelComponent,
                    ], template: "<div class=\"radio-label\">\r\n  <byd-form-label [input]=\"this.input\"></byd-form-label>\r\n</div>\r\n\r\n<div class=\"radio-container\" *ngIf=\"!this.input.useMaterialTheme\">\r\n  <div\r\n    class=\"radio-element\"\r\n    [ngClass]=\"{\r\n      validated: this.input.value === option.id,\r\n      disabled: this.input.disabled,\r\n    }\"\r\n    *ngFor=\"let option of this.input.options | async\"\r\n    (click)=\"this.onOptionClicked(option.id)\"\r\n  >\r\n    <div\r\n      [ngClass]=\"{\r\n        'button-with-icon': this.hasLabel(option),\r\n        'only-icon': !this.hasLabel(option),\r\n      }\"\r\n    >\r\n      <!-- <byd-local-icon\r\n        *ngIf=\"option.icon\"\r\n        [type]=\"option.icon\"\r\n        [size]=\"this.iconSize(option)\"\r\n      >\r\n      </byd-local-icon> -->\r\n\r\n      <span *ngIf=\"option.name\">\r\n        {{ option.name | translate }}\r\n      </span>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<mat-radio-group *ngIf=\"this.input.useMaterialTheme\" [id]=\"this.input.key\" [formControl]=\"$any(this.input.formControl)\">\r\n  <mat-radio-button\r\n    [ngClass]=\"{ validated: this.input.value === option.id }\"\r\n    *ngFor=\"let option of this.input.options | async\"\r\n    [value]=\"option.id\"\r\n  >\r\n    <div class=\"button-with-icon\">\r\n      <!-- <byd-local-icon\r\n        *ngIf=\"this.option.icon\"\r\n        [type]=\"this.option.icon\"\r\n        [size]=\"this.iconSize(option)\"\r\n      >\r\n      </byd-local-icon> -->\r\n\r\n      <span *ngIf=\"option.name\">\r\n        {{ option.name | translate }}\r\n      </span>\r\n    </div>\r\n  </mat-radio-button>\r\n</mat-radio-group>\r\n", styles: [".radio-label{display:block;padding-bottom:.5em}.button-with-icon{display:flex;flex-direction:row;justify-content:flex-start;align-items:center;column-gap:8px}.only-icon{margin-left:auto;margin-right:auto}.radio-container{display:flex!important;display:flex;flex-direction:row;justify-content:space-between}.radio-container .radio-element{display:flex;height:50px;width:45%;border:2px solid var(--byd-neutral-400);border-radius:20px;box-sizing:border-box;align-items:center;gap:8px;justify-content:center;color:var(--byd-neutral-600);font-size:var(--byd-font-body-md-default-size);line-height:var(--byd-font-body-md-default-line);font-weight:var(--byd-font-body-md-default-weight);line-height:28px;font-weight:500}.radio-container .radio-element app-local-icon{opacity:.4}.radio-container .radio-element.validated{border:2px solid var(--byd-surface-brand-primary)}.radio-container .radio-element.validated app-local-icon{opacity:1}.radio-container .radio-element.validated span{color:var(--byd-neutral-900)}.radio-container .radio-element.disabled{opacity:.4}\n"] }]
        }], ctorParameters: () => [], propDecorators: { input: [{
                type: Input
            }] } });

class TextareaComponent {
    input;
    matcher;
    validators = Validators;
    constructor() { }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TextareaComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: TextareaComponent, isStandalone: true, selector: "byd-input-textarea", inputs: { input: "input", matcher: "matcher" }, ngImport: i0, template: "<!-- <quill-editor [beforeRender]=\"beforeRender\"></quill-editor> -->\r\n\r\n<byd-form-label [input]=\"this.input\"></byd-form-label>\r\n\r\n<mat-form-field [floatLabel]=\"'auto'\" class=\"textarea-container\" appearance=\"fill\">\r\n  <!-- IMPROVE: remove $any -->\r\n  <textarea\r\n    matInput\r\n    cdkTextareaAutosize\r\n    cdkAutosizeMinRows=\"1\"\r\n    cdkAutosizeMaxRows=\"5\"\r\n    class=\"form-control\"\r\n    [value]=\"this.input.value\"\r\n    [formControl]=\"$any(this.input.formControl)\"\r\n    [errorStateMatcher]=\"this.matcher\"\r\n  ></textarea>\r\n</mat-form-field>\r\n", styles: [".textarea-container{width:100%}\n"], dependencies: [{ kind: "ngmodule", type: MatFormFieldModule }, { kind: "component", type: i1.MatFormField, selector: "mat-form-field", inputs: ["hideRequiredMarker", "color", "floatLabel", "appearance", "subscriptSizing", "hintLabel"], exportAs: ["matFormField"] }, { kind: "ngmodule", type: MatInputModule }, { kind: "directive", type: i2$1.MatInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],      input[matNativeControl], textarea[matNativeControl]", inputs: ["disabled", "id", "placeholder", "name", "required", "type", "errorStateMatcher", "aria-describedby", "value", "readonly", "disabledInteractive"], exportAs: ["matInput"] }, { kind: "directive", type: i3$1.CdkTextareaAutosize, selector: "textarea[cdkTextareaAutosize]", inputs: ["cdkAutosizeMinRows", "cdkAutosizeMaxRows", "cdkTextareaAutosize", "placeholder"], exportAs: ["cdkTextareaAutosize"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i4.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i4.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "component", type: FormLabelComponent, selector: "byd-form-label", inputs: ["input"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TextareaComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-input-textarea', standalone: true, imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, FormLabelComponent], template: "<!-- <quill-editor [beforeRender]=\"beforeRender\"></quill-editor> -->\r\n\r\n<byd-form-label [input]=\"this.input\"></byd-form-label>\r\n\r\n<mat-form-field [floatLabel]=\"'auto'\" class=\"textarea-container\" appearance=\"fill\">\r\n  <!-- IMPROVE: remove $any -->\r\n  <textarea\r\n    matInput\r\n    cdkTextareaAutosize\r\n    cdkAutosizeMinRows=\"1\"\r\n    cdkAutosizeMaxRows=\"5\"\r\n    class=\"form-control\"\r\n    [value]=\"this.input.value\"\r\n    [formControl]=\"$any(this.input.formControl)\"\r\n    [errorStateMatcher]=\"this.matcher\"\r\n  ></textarea>\r\n</mat-form-field>\r\n", styles: [".textarea-container{width:100%}\n"] }]
        }], ctorParameters: () => [], propDecorators: { input: [{
                type: Input
            }], matcher: [{
                type: Input
            }] } });

class TextBoxComponent {
    input;
    matcher;
    valueChanged = new EventEmitter();
    space = true;
    validators = Validators;
    hide = false;
    get isPassword() {
        return this.input.type === 'password';
    }
    constructor() { }
    ngOnInit() {
        if (this.matcher === null) {
            this.matcher = new ErrorStateMatcher();
        }
        if (this.isPassword) {
            this.hide = true;
        }
    }
    onChange(value) {
        this.valueChanged.emit(value);
    }
    iconClicked() {
        if (this.input.iconClicked)
            this.input.iconClicked();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TextBoxComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: TextBoxComponent, isStandalone: true, selector: "byd-input-textbox", inputs: { input: "input", matcher: "matcher", space: "space" }, outputs: { valueChanged: "valueChanged" }, ngImport: i0, template: "<byd-form-label [input]=\"this.input\"></byd-form-label>\r\n\r\n<ng-container *ngIf=\"this.input.type === 'textarea'\">\r\n  <byd-input-textarea [input]=\"$any(this.input)\" [matcher]=\"this.matcher\"></byd-input-textarea>\r\n</ng-container>\r\n\r\n<div class=\"input-group\" *ngIf=\"this.input.type !== 'textarea'\">\r\n  <mat-form-field class=\"textbox-container\" [floatLabel]=\"'auto'\" [ngClass]=\"{ noSpace: !this.space }\">\r\n    <!-- IMPROVE: remove $any -->\r\n    <input\r\n      #box\r\n      matInput\r\n      class=\"form-control\"\r\n      [value]=\"this.input.value\"\r\n      [formControl]=\"$any(this.input.formControl)\"\r\n      [errorStateMatcher]=\"this.matcher\"\r\n      [readonly]=\"this.input.disabled\"\r\n      [type]=\"this.isPassword && !this.hide ? 'text' : this.input.type\"\r\n      (keyup)=\"this.onChange(box.value)\"\r\n    />\r\n    <span matSuffix mat-icon-button aria-label=\"Hide/Show\" (click)=\"this.hide = !this.hide\" *ngIf=\"this.isPassword\">\r\n      <mat-icon>\r\n        {{ this.hide ? 'Visibility' : 'Visibility Off' }}\r\n      </mat-icon>\r\n    </span>\r\n\r\n    <mat-hint>\r\n      <small class=\"form-text text-muted\">\r\n        <div *ngIf=\"this.input.message\" class=\"message\">\r\n          <span> {{ this.input.message }} </span>\r\n        </div>\r\n      </small>\r\n    </mat-hint>\r\n    <mat-error *ngIf=\"this.input.formControl?.hasError('message')\">\r\n      <small class=\"form-text text-danger\">\r\n        {{ this.input.formControl?.getError('message') }}\r\n      </small>\r\n    </mat-error>\r\n    <mat-error *ngIf=\"this.input.formControl?.getError('invalidSlug')\">\r\n      {{ 'input.text-box.is-slug' }}\r\n    </mat-error>\r\n    <mat-error *ngIf=\"this.input.formControl?.hasError('minlength')\">\r\n      <small class=\"form-text text-danger\">\r\n        {{\r\n          'input.text-box.minimum-length'\r\n            | translate\r\n              : {\r\n                  length: this.input.formControl?.getError('minlength').requiredLength,\r\n                }\r\n        }}\r\n      </small>\r\n    </mat-error>\r\n    <mat-error *ngIf=\"this.input.formControl?.hasError(this.input.type)\">\r\n      <small class=\"form-text text-danger\">{{ 'input.text-box.error-occured' | translate }}</small>\r\n    </mat-error>\r\n    <mat-error *ngIf=\"this.input.formControl?.hasError('required')\">\r\n      <small class=\"form-text text-danger\">\r\n        {{\r\n          'input.text-box.is-mandatory'\r\n            | translate\r\n              : {\r\n                  field: (this.input.label | translate) || 'input.text-box.this-field' | translate,\r\n                }\r\n        }}\r\n      </small>\r\n    </mat-error>\r\n  </mat-form-field>\r\n\r\n  <span class=\"action\" *ngIf=\"this.input.icon\" (click)=\"this.iconClicked()\">\r\n    <!-- <byd-local-icon [type]=\"this.input.icon\" size=\"xs\"></byd-local-icon> -->\r\n  </span>\r\n</div>\r\n", styles: [".textbox-container{width:100%}.input-group{position:relative}.input-group .action{position:absolute;right:8px;top:16px;bottom:0}\n"], dependencies: [{ kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "ngmodule", type: MatFormFieldModule }, { kind: "component", type: i1.MatFormField, selector: "mat-form-field", inputs: ["hideRequiredMarker", "color", "floatLabel", "appearance", "subscriptSizing", "hintLabel"], exportAs: ["matFormField"] }, { kind: "directive", type: i1.MatHint, selector: "mat-hint", inputs: ["align", "id"] }, { kind: "directive", type: i1.MatError, selector: "mat-error, [matError]", inputs: ["id"] }, { kind: "directive", type: i1.MatSuffix, selector: "[matSuffix], [matIconSuffix], [matTextSuffix]", inputs: ["matTextSuffix"] }, { kind: "ngmodule", type: MatIconModule }, { kind: "component", type: i2$2.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "ngmodule", type: MatInputModule }, { kind: "directive", type: i2$1.MatInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],      input[matNativeControl], textarea[matNativeControl]", inputs: ["disabled", "id", "placeholder", "name", "required", "type", "errorStateMatcher", "aria-describedby", "value", "readonly", "disabledInteractive"], exportAs: ["matInput"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i4.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i4.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "pipe", type: TranslatePipe, name: "translate" }, { kind: "component", type: FormLabelComponent, selector: "byd-form-label", inputs: ["input"] }, { kind: "component", type: TextareaComponent, selector: "byd-input-textarea", inputs: ["input", "matcher"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TextBoxComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-input-textbox', standalone: true, imports: [
                        NgIf,
                        NgClass,
                        MatFormFieldModule,
                        MatIconModule,
                        MatInputModule,
                        FormsModule,
                        ReactiveFormsModule,
                        TranslatePipe,
                        FormLabelComponent,
                        TextareaComponent,
                    ], template: "<byd-form-label [input]=\"this.input\"></byd-form-label>\r\n\r\n<ng-container *ngIf=\"this.input.type === 'textarea'\">\r\n  <byd-input-textarea [input]=\"$any(this.input)\" [matcher]=\"this.matcher\"></byd-input-textarea>\r\n</ng-container>\r\n\r\n<div class=\"input-group\" *ngIf=\"this.input.type !== 'textarea'\">\r\n  <mat-form-field class=\"textbox-container\" [floatLabel]=\"'auto'\" [ngClass]=\"{ noSpace: !this.space }\">\r\n    <!-- IMPROVE: remove $any -->\r\n    <input\r\n      #box\r\n      matInput\r\n      class=\"form-control\"\r\n      [value]=\"this.input.value\"\r\n      [formControl]=\"$any(this.input.formControl)\"\r\n      [errorStateMatcher]=\"this.matcher\"\r\n      [readonly]=\"this.input.disabled\"\r\n      [type]=\"this.isPassword && !this.hide ? 'text' : this.input.type\"\r\n      (keyup)=\"this.onChange(box.value)\"\r\n    />\r\n    <span matSuffix mat-icon-button aria-label=\"Hide/Show\" (click)=\"this.hide = !this.hide\" *ngIf=\"this.isPassword\">\r\n      <mat-icon>\r\n        {{ this.hide ? 'Visibility' : 'Visibility Off' }}\r\n      </mat-icon>\r\n    </span>\r\n\r\n    <mat-hint>\r\n      <small class=\"form-text text-muted\">\r\n        <div *ngIf=\"this.input.message\" class=\"message\">\r\n          <span> {{ this.input.message }} </span>\r\n        </div>\r\n      </small>\r\n    </mat-hint>\r\n    <mat-error *ngIf=\"this.input.formControl?.hasError('message')\">\r\n      <small class=\"form-text text-danger\">\r\n        {{ this.input.formControl?.getError('message') }}\r\n      </small>\r\n    </mat-error>\r\n    <mat-error *ngIf=\"this.input.formControl?.getError('invalidSlug')\">\r\n      {{ 'input.text-box.is-slug' }}\r\n    </mat-error>\r\n    <mat-error *ngIf=\"this.input.formControl?.hasError('minlength')\">\r\n      <small class=\"form-text text-danger\">\r\n        {{\r\n          'input.text-box.minimum-length'\r\n            | translate\r\n              : {\r\n                  length: this.input.formControl?.getError('minlength').requiredLength,\r\n                }\r\n        }}\r\n      </small>\r\n    </mat-error>\r\n    <mat-error *ngIf=\"this.input.formControl?.hasError(this.input.type)\">\r\n      <small class=\"form-text text-danger\">{{ 'input.text-box.error-occured' | translate }}</small>\r\n    </mat-error>\r\n    <mat-error *ngIf=\"this.input.formControl?.hasError('required')\">\r\n      <small class=\"form-text text-danger\">\r\n        {{\r\n          'input.text-box.is-mandatory'\r\n            | translate\r\n              : {\r\n                  field: (this.input.label | translate) || 'input.text-box.this-field' | translate,\r\n                }\r\n        }}\r\n      </small>\r\n    </mat-error>\r\n  </mat-form-field>\r\n\r\n  <span class=\"action\" *ngIf=\"this.input.icon\" (click)=\"this.iconClicked()\">\r\n    <!-- <byd-local-icon [type]=\"this.input.icon\" size=\"xs\"></byd-local-icon> -->\r\n  </span>\r\n</div>\r\n", styles: [".textbox-container{width:100%}.input-group{position:relative}.input-group .action{position:absolute;right:8px;top:16px;bottom:0}\n"] }]
        }], ctorParameters: () => [], propDecorators: { input: [{
                type: Input
            }], matcher: [{
                type: Input
            }], valueChanged: [{
                type: Output
            }], space: [{
                type: Input
            }] } });

class ToggleComponent extends BydBaseComponent {
    input;
    constructor() {
        super();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: ToggleComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: ToggleComponent, isStandalone: true, selector: "byd-input-toggle", inputs: { input: "input" }, usesInheritance: true, ngImport: i0, template: "<mat-slide-toggle [checked]=\"this.input.value\" [formControl]=\"$any(this.input.formControl)\">\r\n  <span class=\"label\">{{ this.input.label | translate }}</span>\r\n</mat-slide-toggle>\r\n", styles: [".label{display:block;padding-left:10px}\n"], dependencies: [{ kind: "ngmodule", type: MatFormFieldModule }, { kind: "ngmodule", type: MatCheckboxModule }, { kind: "ngmodule", type: MatButtonToggleModule }, { kind: "ngmodule", type: MatInputModule }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i4.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i4.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }, { kind: "pipe", type: TranslatePipe, name: "translate" }, { kind: "ngmodule", type: MatSlideToggleModule }, { kind: "component", type: i2$3.MatSlideToggle, selector: "mat-slide-toggle", inputs: ["name", "id", "labelPosition", "aria-label", "aria-labelledby", "aria-describedby", "required", "color", "disabled", "disableRipple", "tabIndex", "checked", "hideIcon", "disabledInteractive"], outputs: ["change", "toggleChange"], exportAs: ["matSlideToggle"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: ToggleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-input-toggle', standalone: true, imports: [
                        MatFormFieldModule,
                        MatCheckboxModule,
                        MatButtonToggleModule,
                        MatInputModule,
                        FormsModule,
                        ReactiveFormsModule,
                        TranslatePipe,
                        MatSlideToggleModule,
                    ], template: "<mat-slide-toggle [checked]=\"this.input.value\" [formControl]=\"$any(this.input.formControl)\">\r\n  <span class=\"label\">{{ this.input.label | translate }}</span>\r\n</mat-slide-toggle>\r\n", styles: [".label{display:block;padding-left:10px}\n"] }]
        }], ctorParameters: () => [], propDecorators: { input: [{
                type: Input
            }] } });

class BydInputButtonComponent {
    input;
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydInputButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: BydInputButtonComponent, isStandalone: true, selector: "byd-input-button", inputs: { input: "input" }, ngImport: i0, template: "<byd-button\r\n  (action)=\"this.input.callback()\"\r\n  [state]=\"(this.input.disabled$ | async) ? 'disabled' : 'classic'\"\r\n  [type]=\"this.input.style\"\r\n>\r\n  {{ this.input.label | translate }}\r\n</byd-button>\r\n", styles: [""], dependencies: [{ kind: "component", type: BydButtonComponent, selector: "byd-button", inputs: ["state", "type", "size", "icon", "options", "stopPropagationActivation"], outputs: ["action"] }, { kind: "pipe", type: TranslatePipe$1, name: "translate" }, { kind: "pipe", type: AsyncPipe, name: "async" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydInputButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-input-button', standalone: true, imports: [BydButtonComponent, TranslatePipe$1, AsyncPipe], template: "<byd-button\r\n  (action)=\"this.input.callback()\"\r\n  [state]=\"(this.input.disabled$ | async) ? 'disabled' : 'classic'\"\r\n  [type]=\"this.input.style\"\r\n>\r\n  {{ this.input.label | translate }}\r\n</byd-button>\r\n" }]
        }], propDecorators: { input: [{
                type: Input
            }] } });

/*
 * Public API Surface of form
 */

/**
 * Generated bundle index. Do not edit.
 */

export { BydInputButtonComponent, CheckboxComponent, DropdownComponent, LabelComponent, RadioComponent, TextBoxComponent, TextareaComponent, ToggleComponent };
//# sourceMappingURL=beyond-form-input.mjs.map
