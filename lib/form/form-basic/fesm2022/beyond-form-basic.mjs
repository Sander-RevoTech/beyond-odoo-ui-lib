import * as i0 from '@angular/core';
import { Input, Component, EventEmitter, Output } from '@angular/core';
import * as i1 from '@angular/forms';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';
import { BydBaseComponent, TranslatePipe } from '@beyond/utils';
import { NgIf, NgFor, NgTemplateOutlet, NgClass, AsyncPipe, NgSwitch, NgSwitchCase, NgStyle } from '@angular/common';
import { TextBoxComponent, TextareaComponent, DropdownComponent, RadioComponent, CheckboxComponent, ToggleComponent, LabelComponent } from '@beyond/form-input';
import { LoaderComponent, BydButtonComponent } from '@beyond/ui';
import deepEqual from 'fast-deep-equal';
import { NotificationInlineComponent } from '@beyond/notification';

class PanelComponent extends BydBaseComponent {
    inputsTemplate;
    panel;
    constructor() {
        super();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: PanelComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: PanelComponent, isStandalone: true, selector: "byd-form-panel", inputs: { inputsTemplate: "inputsTemplate", panel: "panel" }, usesInheritance: true, ngImport: i0, template: "<div [ngClass]=\"this.panel.containerClass\">\n  <ng-container *ngIf=\"this.panel.label\">\n    <h2 class=\"panel-title\">{{ this.panel.label | translate }}</h2>\n  </ng-container>\n\n  <div [ngClass]=\"this.panel.contentClass\">\n    <ng-container *ngFor=\"let input of this.panel.children; trackBy: this.trackByKey\">\n      <div\n        [ngClass]=\"input.class\"\n        [style.display]=\"(input.visible$ | async) ? 'block' : 'none'\"\n        *ngIf=\"input\"\n        class=\"mb-space-sm\"\n      >\n        <ng-container\n          [ngTemplateOutlet]=\"this.inputsTemplate\"\n          [ngTemplateOutletContext]=\"{\n            input: input\n          }\"\n        >\n        </ng-container>\n      </div>\n    </ng-container>\n  </div>\n</div>\n", styles: [".with-separator{border-bottom:1px solid #a9a9a9;padding-bottom:2em}.highlight-title .panel-title{color:var(--byd-surface-brand-primary);font-style:normal;font-weight:500;font-size:15px;line-height:24px;letter-spacing:.1em;text-transform:uppercase;padding-top:2em}.no-title-space .panel-title{padding-top:0}\n"], dependencies: [{ kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "pipe", type: AsyncPipe, name: "async" }, { kind: "pipe", type: TranslatePipe, name: "translate" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: PanelComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-form-panel', standalone: true, imports: [NgIf, NgFor, NgTemplateOutlet, NgClass, AsyncPipe, TranslatePipe], template: "<div [ngClass]=\"this.panel.containerClass\">\n  <ng-container *ngIf=\"this.panel.label\">\n    <h2 class=\"panel-title\">{{ this.panel.label | translate }}</h2>\n  </ng-container>\n\n  <div [ngClass]=\"this.panel.contentClass\">\n    <ng-container *ngFor=\"let input of this.panel.children; trackBy: this.trackByKey\">\n      <div\n        [ngClass]=\"input.class\"\n        [style.display]=\"(input.visible$ | async) ? 'block' : 'none'\"\n        *ngIf=\"input\"\n        class=\"mb-space-sm\"\n      >\n        <ng-container\n          [ngTemplateOutlet]=\"this.inputsTemplate\"\n          [ngTemplateOutletContext]=\"{\n            input: input\n          }\"\n        >\n        </ng-container>\n      </div>\n    </ng-container>\n  </div>\n</div>\n", styles: [".with-separator{border-bottom:1px solid #a9a9a9;padding-bottom:2em}.highlight-title .panel-title{color:var(--byd-surface-brand-primary);font-style:normal;font-weight:500;font-size:15px;line-height:24px;letter-spacing:.1em;text-transform:uppercase;padding-top:2em}.no-title-space .panel-title{padding-top:0}\n"] }]
        }], ctorParameters: () => [], propDecorators: { inputsTemplate: [{
                type: Input
            }], panel: [{
                type: Input
            }] } });

class MyErrorStateMatcher {
    isErrorState(control, form) {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}
class InputsComponent extends BydBaseComponent {
    input;
    space = true;
    matcher = new MyErrorStateMatcher();
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: InputsComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: InputsComponent, isStandalone: true, selector: "byd-inputs", inputs: { input: "input", space: "space" }, usesInheritance: true, ngImport: i0, template: "<ng-container\n  [ngTemplateOutlet]=\"inputsTemplate\"\n  [ngTemplateOutletContext]=\"{\n    input: this.input,\n    matcher: this.matcher\n  }\"\n></ng-container>\n\n<ng-template #inputsTemplate let-input=\"input\" let-matcher=\"matcher\">\n  <ng-container [ngSwitch]=\"input.controlType\">\n    <ng-container *ngSwitchCase=\"'textbox'\">\n      <byd-input-textbox\n        [input]=\"input\"\n        [matcher]=\"matcher\"\n        [space]=\"this.space\"\n      ></byd-input-textbox>\n    </ng-container>\n    <ng-container *ngSwitchCase=\"'textarea'\">\n      <byd-input-textarea\n        [input]=\"input\"\n        [matcher]=\"matcher\"\n      ></byd-input-textarea>\n    </ng-container>\n    <ng-container *ngSwitchCase=\"'dropdown'\">\n      <byd-input-dropdown\n        [input]=\"input\"\n        [matcher]=\"matcher\"\n        [space]=\"this.space\"\n      ></byd-input-dropdown>\n    </ng-container>\n    <ng-container *ngSwitchCase=\"'radio'\">\n      <byd-input-radio [input]=\"input\"></byd-input-radio>\n    </ng-container>\n    <ng-container *ngSwitchCase=\"'checkbox'\">\n      <byd-input-checkbox [input]=\"input\"></byd-input-checkbox>\n    </ng-container>\n    <ng-container *ngSwitchCase=\"'toggle'\">\n      <byd-input-toggle [input]=\"input\"></byd-input-toggle>\n    </ng-container>\n    <ng-container *ngSwitchCase=\"'panel'\">\n      <byd-form-panel\n        [panel]=\"input\"\n        [inputsTemplate]=\"inputsTemplate\"\n      ></byd-form-panel>\n    </ng-container>\n    <ng-container *ngSwitchCase=\"'label'\">\n      <byd-input-label [input]=\"input\"></byd-input-label>\n    </ng-container>\n  </ng-container>\n</ng-template>\n", styles: [""], dependencies: [{ kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "component", type: TextBoxComponent, selector: "byd-input-textbox", inputs: ["input", "matcher", "space"], outputs: ["valueChanged"] }, { kind: "component", type: TextareaComponent, selector: "byd-input-textarea", inputs: ["input", "matcher"] }, { kind: "component", type: DropdownComponent, selector: "byd-input-dropdown", inputs: ["input", "matcher", "space"], outputs: ["valueChanged"] }, { kind: "component", type: RadioComponent, selector: "byd-input-radio", inputs: ["input"] }, { kind: "component", type: CheckboxComponent, selector: "byd-input-checkbox", inputs: ["input"] }, { kind: "component", type: ToggleComponent, selector: "byd-input-toggle", inputs: ["input"] }, { kind: "component", type: PanelComponent, selector: "byd-form-panel", inputs: ["inputsTemplate", "panel"] }, { kind: "component", type: LabelComponent, selector: "byd-input-label", inputs: ["input"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: InputsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-inputs', standalone: true, imports: [NgTemplateOutlet, NgSwitch, NgSwitchCase, TextBoxComponent, TextareaComponent, DropdownComponent, RadioComponent, CheckboxComponent, ToggleComponent, PanelComponent, LabelComponent], template: "<ng-container\n  [ngTemplateOutlet]=\"inputsTemplate\"\n  [ngTemplateOutletContext]=\"{\n    input: this.input,\n    matcher: this.matcher\n  }\"\n></ng-container>\n\n<ng-template #inputsTemplate let-input=\"input\" let-matcher=\"matcher\">\n  <ng-container [ngSwitch]=\"input.controlType\">\n    <ng-container *ngSwitchCase=\"'textbox'\">\n      <byd-input-textbox\n        [input]=\"input\"\n        [matcher]=\"matcher\"\n        [space]=\"this.space\"\n      ></byd-input-textbox>\n    </ng-container>\n    <ng-container *ngSwitchCase=\"'textarea'\">\n      <byd-input-textarea\n        [input]=\"input\"\n        [matcher]=\"matcher\"\n      ></byd-input-textarea>\n    </ng-container>\n    <ng-container *ngSwitchCase=\"'dropdown'\">\n      <byd-input-dropdown\n        [input]=\"input\"\n        [matcher]=\"matcher\"\n        [space]=\"this.space\"\n      ></byd-input-dropdown>\n    </ng-container>\n    <ng-container *ngSwitchCase=\"'radio'\">\n      <byd-input-radio [input]=\"input\"></byd-input-radio>\n    </ng-container>\n    <ng-container *ngSwitchCase=\"'checkbox'\">\n      <byd-input-checkbox [input]=\"input\"></byd-input-checkbox>\n    </ng-container>\n    <ng-container *ngSwitchCase=\"'toggle'\">\n      <byd-input-toggle [input]=\"input\"></byd-input-toggle>\n    </ng-container>\n    <ng-container *ngSwitchCase=\"'panel'\">\n      <byd-form-panel\n        [panel]=\"input\"\n        [inputsTemplate]=\"inputsTemplate\"\n      ></byd-form-panel>\n    </ng-container>\n    <ng-container *ngSwitchCase=\"'label'\">\n      <byd-input-label [input]=\"input\"></byd-input-label>\n    </ng-container>\n  </ng-container>\n</ng-template>\n" }]
        }], propDecorators: { input: [{
                type: Input
            }], space: [{
                type: Input
            }] } });

class BydFormComponent extends BydBaseComponent {
    inputs;
    askValidation$;
    askOnDestroy;
    loader = false;
    error = { status: 0, message: '' };
    border = true;
    canDisplayButton = true;
    buttonTitle = 'form.save';
    onLive = false;
    valid = new EventEmitter();
    isFormValid = new EventEmitter();
    form;
    constructor() {
        super();
    }
    ngOnInit() {
        this.form = this.toFormGroup(this.inputs);
        this._registerSubscription(this.form.statusChanges.subscribe(() => this.isFormValid.emit(this.isValid())));
        if (this.onLive) {
            this._registerSubscription(this.form.valueChanges.pipe(distinctUntilChanged((prev, curr) => deepEqual(prev, curr))).subscribe(() => this.onSubmit()));
        }
        if (this.askValidation$) {
            this._registerSubscription(this.askValidation$.subscribe(_ => this.onSubmit()));
        }
    }
    ngOnChanges(simpleChanges) {
        if (simpleChanges['inputs'] && !simpleChanges['inputs'].firstChange) {
            this.form = this.toFormGroup(this.inputs);
        }
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this.inputs.forEach(input => {
            input.destroy();
        });
        if (this.askOnDestroy) {
            this.onSubmit();
        }
    }
    onSubmit() {
        if (!this.isValid()) {
            return;
        }
        this.valid.emit(this.form.value);
    }
    isValid() {
        return this.form.valid && !this.loader;
    }
    toFormGroup(inputs) {
        const group = new FormGroup({});
        if (inputs === null || inputs.length === 0) {
            return group;
        }
        inputs.forEach(input => {
            input.createFormControl(group);
        });
        return group;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydFormComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: BydFormComponent, isStandalone: true, selector: "byd-form", inputs: { inputs: "inputs", askValidation$: "askValidation$", askOnDestroy: "askOnDestroy", loader: "loader", error: "error", border: "border", canDisplayButton: "canDisplayButton", buttonTitle: "buttonTitle", onLive: "onLive" }, outputs: { valid: "valid", isFormValid: "isFormValid" }, usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<div class=\"form-container\">\n  <form (ngSubmit)=\"onSubmit()\" [formGroup]=\"this.form\">\n    <div *ngFor=\"let input of this.inputs; trackBy: trackByKey\">\n      <ng-container *ngIf=\"input.visible$ | async\">\n        <byd-inputs [input]=\"input\"></byd-inputs>\n      </ng-container>\n    </div>\n    <div>\n      <byd-loader [isLoading]=\"this.loader\">\n        <byd-button\n          *ngIf=\"this.canDisplayButton && this.buttonTitle\"\n          (action)=\"this.onSubmit()\"\n          [state]=\"!this.isValid() ? 'disabled' : 'classic'\"\n          icon=\"check-line\"\n        >\n          {{ this.buttonTitle | translate }}\n        </byd-button>\n      </byd-loader>\n      <byd-notification-inline\n        [message]=\"this.error.message\"\n        [code]=\"this.error.status\"\n        class=\"my-space-sm\"\n      >\n        <div class=\"justify-end\"></div>\n      </byd-notification-inline>\n    </div>\n  </form>\n</div>\n", styles: [""], dependencies: [{ kind: "component", type: InputsComponent, selector: "byd-inputs", inputs: ["input", "space"] }, { kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "pipe", type: AsyncPipe, name: "async" }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i1.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i1.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "component", type: LoaderComponent, selector: "byd-loader", inputs: ["isLoading", "skeleton"] }, { kind: "component", type: BydButtonComponent, selector: "byd-button", inputs: ["state", "type", "size", "icon", "options", "stopPropagationActivation"], outputs: ["action"] }, { kind: "pipe", type: TranslatePipe, name: "translate" }, { kind: "component", type: NotificationInlineComponent, selector: "byd-notification-inline", inputs: ["message", "code", "showClose"], outputs: ["askClose"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydFormComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-form', standalone: true, imports: [InputsComponent, NgFor, NgIf, AsyncPipe, FormsModule, ReactiveFormsModule, LoaderComponent, BydButtonComponent, TranslatePipe, NotificationInlineComponent], template: "<div class=\"form-container\">\n  <form (ngSubmit)=\"onSubmit()\" [formGroup]=\"this.form\">\n    <div *ngFor=\"let input of this.inputs; trackBy: trackByKey\">\n      <ng-container *ngIf=\"input.visible$ | async\">\n        <byd-inputs [input]=\"input\"></byd-inputs>\n      </ng-container>\n    </div>\n    <div>\n      <byd-loader [isLoading]=\"this.loader\">\n        <byd-button\n          *ngIf=\"this.canDisplayButton && this.buttonTitle\"\n          (action)=\"this.onSubmit()\"\n          [state]=\"!this.isValid() ? 'disabled' : 'classic'\"\n          icon=\"check-line\"\n        >\n          {{ this.buttonTitle | translate }}\n        </byd-button>\n      </byd-loader>\n      <byd-notification-inline\n        [message]=\"this.error.message\"\n        [code]=\"this.error.status\"\n        class=\"my-space-sm\"\n      >\n        <div class=\"justify-end\"></div>\n      </byd-notification-inline>\n    </div>\n  </form>\n</div>\n" }]
        }], ctorParameters: () => [], propDecorators: { inputs: [{
                type: Input
            }], askValidation$: [{
                type: Input
            }], askOnDestroy: [{
                type: Input
            }], loader: [{
                type: Input
            }], error: [{
                type: Input
            }], border: [{
                type: Input
            }], canDisplayButton: [{
                type: Input
            }], buttonTitle: [{
                type: Input
            }], onLive: [{
                type: Input
            }], valid: [{
                type: Output
            }], isFormValid: [{
                type: Output
            }] } });

class EditFieldComponent extends BydBaseComponent {
    layout = 'row';
    getInput;
    changeEditMode$ = null;
    isLoading = false;
    newValue = new EventEmitter();
    height = '22px';
    withBorder = true;
    input;
    editMode = false;
    ngOnInit() {
        if (this.changeEditMode$) {
            this._registerSubscription(this.changeEditMode$.subscribe(value => (this.editMode = value)));
        }
        this.input = this.getInput();
    }
    ngOnChanges(changes) {
        if (changes["isLoading"] && changes["isLoading"].currentValue !== changes["isLoading"].previousValue && changes["isLoading"].currentValue === false) {
            this.input = this.getInput();
            this.editMode = false;
        }
    }
    toggleEditMode() {
        this.editMode = !this.editMode;
    }
    validation() {
        this.newValue.emit(this.input.value);
        this.toggleEditMode();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: EditFieldComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: EditFieldComponent, isStandalone: true, selector: "byd-edit-field", inputs: { layout: "layout", getInput: "getInput", changeEditMode$: "changeEditMode$", isLoading: "isLoading", height: "height", withBorder: "withBorder" }, outputs: { newValue: "newValue" }, usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<byd-loader [isLoading]=\"this.isLoading\">\n  <ng-container *ngIf=\"!this.editMode\">\n    <div\n      class=\"value-container\"\n      [ngStyle]=\"{ height: height }\"\n      [ngClass]=\"{ 'no-border': !this.withBorder }\"\n      (click)=\"this.toggleEditMode()\"\n    >\n      <ng-content></ng-content>\n      <!-- <byd-font-icon class=\"hidden-icon\" name=\"modify\" type=\"sm\"></byd-font-icon> -->\n    </div>\n  </ng-container>\n  <ng-container *ngIf=\"this.editMode\">\n    <div class=\"align-center g-space-sm\" [ngClass]=\"'flex-' + this.layout\">\n      <byd-form\n        class=\"flex-fill\"\n        [inputs]=\"[this.input]\"\n        [canDisplayButton]=\"false\"\n      ></byd-form>\n\n      <!-- <byd-font-icon\n        name=\"check-line\"\n        type=\"sm\"\n        (click)=\"this.validation()\"\n      ></byd-font-icon> -->\n    </div>\n  </ng-container>\n</byd-loader>\n", styles: [".value-container{flex-direction:row;justify-content:space-between;align-items:center;border:1px solid;border-radius:4px;border-color:var(--byd-neutral-300);display:flex;padding:var(--byd-space-sm)}.value-container:hover{border-color:var(--byd-neutral-500)}.value-container.no-border{border:none}.hidden-icon{visibility:hidden}.value-container:hover .hidden-icon{visibility:visible}\n"], dependencies: [{ kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: LoaderComponent, selector: "byd-loader", inputs: ["isLoading", "skeleton"] }, { kind: "component", type: BydFormComponent, selector: "byd-form", inputs: ["inputs", "askValidation$", "askOnDestroy", "loader", "error", "border", "canDisplayButton", "buttonTitle", "onLive"], outputs: ["valid", "isFormValid"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: EditFieldComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-edit-field', standalone: true, imports: [NgIf, NgClass, NgStyle, LoaderComponent, BydFormComponent], template: "<byd-loader [isLoading]=\"this.isLoading\">\n  <ng-container *ngIf=\"!this.editMode\">\n    <div\n      class=\"value-container\"\n      [ngStyle]=\"{ height: height }\"\n      [ngClass]=\"{ 'no-border': !this.withBorder }\"\n      (click)=\"this.toggleEditMode()\"\n    >\n      <ng-content></ng-content>\n      <!-- <byd-font-icon class=\"hidden-icon\" name=\"modify\" type=\"sm\"></byd-font-icon> -->\n    </div>\n  </ng-container>\n  <ng-container *ngIf=\"this.editMode\">\n    <div class=\"align-center g-space-sm\" [ngClass]=\"'flex-' + this.layout\">\n      <byd-form\n        class=\"flex-fill\"\n        [inputs]=\"[this.input]\"\n        [canDisplayButton]=\"false\"\n      ></byd-form>\n\n      <!-- <byd-font-icon\n        name=\"check-line\"\n        type=\"sm\"\n        (click)=\"this.validation()\"\n      ></byd-font-icon> -->\n    </div>\n  </ng-container>\n</byd-loader>\n", styles: [".value-container{flex-direction:row;justify-content:space-between;align-items:center;border:1px solid;border-radius:4px;border-color:var(--byd-neutral-300);display:flex;padding:var(--byd-space-sm)}.value-container:hover{border-color:var(--byd-neutral-500)}.value-container.no-border{border:none}.hidden-icon{visibility:hidden}.value-container:hover .hidden-icon{visibility:visible}\n"] }]
        }], propDecorators: { layout: [{
                type: Input
            }], getInput: [{
                type: Input
            }], changeEditMode$: [{
                type: Input
            }], isLoading: [{
                type: Input
            }], newValue: [{
                type: Output
            }], height: [{
                type: Input
            }], withBorder: [{
                type: Input
            }] } });

/*
 * Public API Surface of form-basic
 */

/**
 * Generated bundle index. Do not edit.
 */

export { BydFormComponent, EditFieldComponent, InputsComponent, MyErrorStateMatcher };
//# sourceMappingURL=beyond-form-basic.mjs.map
