import { NgIf, NgFor, NgTemplateOutlet, NgClass, AsyncPipe, NgSwitch, NgSwitchCase, NgStyle } from '@angular/common';
import * as i0 from '@angular/core';
import { Input, Component, EventEmitter, Output } from '@angular/core';
import * as i1 from '@angular/forms';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationInlineComponent } from '@beyond/notification';
import { TranslatePipe } from '@beyond/translation';
import { LoaderComponent, BydButtonComponent } from '@beyond/ui';
import { BydBaseComponent } from '@beyond/utils';
import deepEqual from 'fast-deep-equal';
import { distinctUntilChanged } from 'rxjs';
import { TextBoxComponent, TextareaComponent, DropdownComponent, RadioComponent, CheckboxComponent, ToggleComponent, LabelComponent, BydInputChoicesComponent, BydInputButtonComponent, BydDatePickerComponent } from '@beyond/form-input';

class PanelComponent extends BydBaseComponent {
    inputsTemplate;
    panel;
    constructor() {
        super();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: PanelComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: PanelComponent, isStandalone: true, selector: "byd-form-panel", inputs: { inputsTemplate: "inputsTemplate", panel: "panel" }, usesInheritance: true, ngImport: i0, template: "<div [ngClass]=\"this.panel.containerClass\">\r\n  <ng-container *ngIf=\"this.panel.label\">\r\n    <h2 class=\"panel-title\">{{ this.panel.label | translate }}</h2>\r\n  </ng-container>\r\n\r\n  <div [ngClass]=\"this.panel.contentClass\">\r\n    <ng-container *ngFor=\"let input of this.panel.children; trackBy: this.trackByKey\">\r\n      <div\r\n        [ngClass]=\"input.class\"\r\n        [style.display]=\"(input.visible$ | async) ? 'block' : 'none'\"\r\n        *ngIf=\"input\"\r\n        class=\"mb-space-xs\"\r\n      >\r\n        <ng-container\r\n          [ngTemplateOutlet]=\"this.inputsTemplate\"\r\n          [ngTemplateOutletContext]=\"{\r\n            input: input,\r\n          }\"\r\n        >\r\n        </ng-container>\r\n      </div>\r\n    </ng-container>\r\n  </div>\r\n</div>\r\n", styles: [".with-separator{border-bottom:1px solid #a9a9a9;padding-bottom:2em}.highlight-title .panel-title{color:var(--byd-surface-brand-primary);font-style:normal;font-weight:500;font-size:15px;line-height:24px;letter-spacing:.1em;text-transform:uppercase;padding-top:2em}.no-title-space .panel-title{padding-top:0}\n"], dependencies: [{ kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "pipe", type: AsyncPipe, name: "async" }, { kind: "pipe", type: TranslatePipe, name: "translate" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: PanelComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-form-panel', standalone: true, imports: [NgIf, NgFor, NgTemplateOutlet, NgClass, AsyncPipe, TranslatePipe], template: "<div [ngClass]=\"this.panel.containerClass\">\r\n  <ng-container *ngIf=\"this.panel.label\">\r\n    <h2 class=\"panel-title\">{{ this.panel.label | translate }}</h2>\r\n  </ng-container>\r\n\r\n  <div [ngClass]=\"this.panel.contentClass\">\r\n    <ng-container *ngFor=\"let input of this.panel.children; trackBy: this.trackByKey\">\r\n      <div\r\n        [ngClass]=\"input.class\"\r\n        [style.display]=\"(input.visible$ | async) ? 'block' : 'none'\"\r\n        *ngIf=\"input\"\r\n        class=\"mb-space-xs\"\r\n      >\r\n        <ng-container\r\n          [ngTemplateOutlet]=\"this.inputsTemplate\"\r\n          [ngTemplateOutletContext]=\"{\r\n            input: input,\r\n          }\"\r\n        >\r\n        </ng-container>\r\n      </div>\r\n    </ng-container>\r\n  </div>\r\n</div>\r\n", styles: [".with-separator{border-bottom:1px solid #a9a9a9;padding-bottom:2em}.highlight-title .panel-title{color:var(--byd-surface-brand-primary);font-style:normal;font-weight:500;font-size:15px;line-height:24px;letter-spacing:.1em;text-transform:uppercase;padding-top:2em}.no-title-space .panel-title{padding-top:0}\n"] }]
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
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: InputsComponent, isStandalone: true, selector: "byd-inputs", inputs: { input: "input", space: "space" }, usesInheritance: true, ngImport: i0, template: "<ng-container\r\n  [ngTemplateOutlet]=\"inputsTemplate\"\r\n  [ngTemplateOutletContext]=\"{\r\n    input: this.input,\r\n    matcher: this.matcher,\r\n  }\"\r\n></ng-container>\r\n\r\n<ng-template #inputsTemplate let-input=\"input\" let-matcher=\"matcher\">\r\n  <ng-container [ngSwitch]=\"input.controlType\">\r\n    <ng-container *ngSwitchCase=\"'textbox'\">\r\n      <byd-input-textbox [input]=\"input\" [matcher]=\"matcher\" [space]=\"this.space\"></byd-input-textbox>\r\n    </ng-container>\r\n    <ng-container *ngSwitchCase=\"'textarea'\">\r\n      <byd-input-textarea [input]=\"input\" [matcher]=\"matcher\"></byd-input-textarea>\r\n    </ng-container>\r\n    <ng-container *ngSwitchCase=\"'dropdown'\">\r\n      <byd-input-dropdown [input]=\"input\" [matcher]=\"matcher\" [space]=\"this.space\"></byd-input-dropdown>\r\n    </ng-container>\r\n    <ng-container *ngSwitchCase=\"'radio'\">\r\n      <byd-input-radio [input]=\"input\"></byd-input-radio>\r\n    </ng-container>\r\n    <ng-container *ngSwitchCase=\"'checkbox'\">\r\n      <byd-input-checkbox [input]=\"input\"></byd-input-checkbox>\r\n    </ng-container>\r\n    <ng-container *ngSwitchCase=\"'toggle'\">\r\n      <byd-input-toggle [input]=\"input\"></byd-input-toggle>\r\n    </ng-container>\r\n    <ng-container *ngSwitchCase=\"'panel'\">\r\n      <byd-form-panel [panel]=\"input\" [inputsTemplate]=\"inputsTemplate\"></byd-form-panel>\r\n    </ng-container>\r\n    <ng-container *ngSwitchCase=\"'label'\">\r\n      <byd-input-label [input]=\"input\"></byd-input-label>\r\n    </ng-container>\r\n    <ng-container *ngSwitchCase=\"'date-picker'\">\r\n      <byd-input-date-picker [input]=\"input\"></byd-input-date-picker>\r\n    </ng-container>\r\n    <ng-container *ngSwitchCase=\"'button'\">\r\n      <byd-input-button [input]=\"$any(input)\"></byd-input-button>\r\n    </ng-container>\r\n    <ng-container *ngSwitchCase=\"'choices'\">\r\n      <byd-input-choices [input]=\"$any(input)\"></byd-input-choices>\r\n    </ng-container>\r\n  </ng-container>\r\n</ng-template>\r\n", styles: [""], dependencies: [{ kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "component", type: TextBoxComponent, selector: "byd-input-textbox", inputs: ["input", "matcher", "space"], outputs: ["valueChanged"] }, { kind: "component", type: TextareaComponent, selector: "byd-input-textarea", inputs: ["input", "matcher"] }, { kind: "component", type: DropdownComponent, selector: "byd-input-dropdown", inputs: ["input", "matcher", "space"], outputs: ["valueChanged"] }, { kind: "component", type: RadioComponent, selector: "byd-input-radio", inputs: ["input"] }, { kind: "component", type: CheckboxComponent, selector: "byd-input-checkbox", inputs: ["input"] }, { kind: "component", type: ToggleComponent, selector: "byd-input-toggle", inputs: ["input"] }, { kind: "component", type: PanelComponent, selector: "byd-form-panel", inputs: ["inputsTemplate", "panel"] }, { kind: "component", type: LabelComponent, selector: "byd-input-label", inputs: ["input"] }, { kind: "component", type: BydInputChoicesComponent, selector: "byd-input-choices", inputs: ["input", "matcher"] }, { kind: "component", type: BydInputButtonComponent, selector: "byd-input-button", inputs: ["input"] }, { kind: "component", type: BydDatePickerComponent, selector: "byd-input-date-picker", inputs: ["input"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: InputsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-inputs', standalone: true, imports: [
                        NgTemplateOutlet,
                        NgSwitch,
                        NgSwitchCase,
                        TextBoxComponent,
                        TextareaComponent,
                        DropdownComponent,
                        RadioComponent,
                        CheckboxComponent,
                        ToggleComponent,
                        PanelComponent,
                        LabelComponent,
                        BydInputChoicesComponent,
                        BydInputButtonComponent,
                        BydDatePickerComponent,
                    ], template: "<ng-container\r\n  [ngTemplateOutlet]=\"inputsTemplate\"\r\n  [ngTemplateOutletContext]=\"{\r\n    input: this.input,\r\n    matcher: this.matcher,\r\n  }\"\r\n></ng-container>\r\n\r\n<ng-template #inputsTemplate let-input=\"input\" let-matcher=\"matcher\">\r\n  <ng-container [ngSwitch]=\"input.controlType\">\r\n    <ng-container *ngSwitchCase=\"'textbox'\">\r\n      <byd-input-textbox [input]=\"input\" [matcher]=\"matcher\" [space]=\"this.space\"></byd-input-textbox>\r\n    </ng-container>\r\n    <ng-container *ngSwitchCase=\"'textarea'\">\r\n      <byd-input-textarea [input]=\"input\" [matcher]=\"matcher\"></byd-input-textarea>\r\n    </ng-container>\r\n    <ng-container *ngSwitchCase=\"'dropdown'\">\r\n      <byd-input-dropdown [input]=\"input\" [matcher]=\"matcher\" [space]=\"this.space\"></byd-input-dropdown>\r\n    </ng-container>\r\n    <ng-container *ngSwitchCase=\"'radio'\">\r\n      <byd-input-radio [input]=\"input\"></byd-input-radio>\r\n    </ng-container>\r\n    <ng-container *ngSwitchCase=\"'checkbox'\">\r\n      <byd-input-checkbox [input]=\"input\"></byd-input-checkbox>\r\n    </ng-container>\r\n    <ng-container *ngSwitchCase=\"'toggle'\">\r\n      <byd-input-toggle [input]=\"input\"></byd-input-toggle>\r\n    </ng-container>\r\n    <ng-container *ngSwitchCase=\"'panel'\">\r\n      <byd-form-panel [panel]=\"input\" [inputsTemplate]=\"inputsTemplate\"></byd-form-panel>\r\n    </ng-container>\r\n    <ng-container *ngSwitchCase=\"'label'\">\r\n      <byd-input-label [input]=\"input\"></byd-input-label>\r\n    </ng-container>\r\n    <ng-container *ngSwitchCase=\"'date-picker'\">\r\n      <byd-input-date-picker [input]=\"input\"></byd-input-date-picker>\r\n    </ng-container>\r\n    <ng-container *ngSwitchCase=\"'button'\">\r\n      <byd-input-button [input]=\"$any(input)\"></byd-input-button>\r\n    </ng-container>\r\n    <ng-container *ngSwitchCase=\"'choices'\">\r\n      <byd-input-choices [input]=\"$any(input)\"></byd-input-choices>\r\n    </ng-container>\r\n  </ng-container>\r\n</ng-template>\r\n" }]
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
            this._registerSubscription(this.form.valueChanges
                .pipe(distinctUntilChanged((prev, curr) => deepEqual(prev, curr)))
                .subscribe(() => this.onSubmit()));
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
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: BydFormComponent, isStandalone: true, selector: "byd-form", inputs: { inputs: "inputs", askValidation$: "askValidation$", askOnDestroy: "askOnDestroy", loader: "loader", error: "error", border: "border", canDisplayButton: "canDisplayButton", buttonTitle: "buttonTitle", onLive: "onLive" }, outputs: { valid: "valid", isFormValid: "isFormValid" }, usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<div class=\"form-container\">\r\n  <form (ngSubmit)=\"onSubmit()\" [formGroup]=\"this.form\">\r\n    <div *ngFor=\"let input of this.inputs; trackBy: trackByKey\" class=\"login-submit-button\">\r\n      <ng-container *ngIf=\"input.visible$ | async\">\r\n        <byd-inputs [input]=\"input\"></byd-inputs>\r\n      </ng-container>\r\n    </div>\r\n    <div class=\"login-submit-button\">\r\n      <byd-loader [isLoading]=\"this.loader\">\r\n        <byd-button\r\n          *ngIf=\"this.canDisplayButton && this.buttonTitle\"\r\n          (action)=\"this.onSubmit()\"\r\n          [state]=\"!this.isValid() ? 'disabled' : 'classic'\"\r\n        >\r\n          {{ this.buttonTitle | translate }}\r\n        </byd-button>\r\n      </byd-loader>\r\n      <byd-notification-inline [message]=\"this.error.message\" [code]=\"this.error.status\" class=\"my-space-sm\">\r\n        <div class=\"justify-end\"></div>\r\n      </byd-notification-inline>\r\n    </div>\r\n  </form>\r\n</div>\r\n", styles: [".login-submit-button{padding-top:20px}\n"], dependencies: [{ kind: "component", type: InputsComponent, selector: "byd-inputs", inputs: ["input", "space"] }, { kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "pipe", type: AsyncPipe, name: "async" }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i1.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i1.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "component", type: LoaderComponent, selector: "byd-loader", inputs: ["isLoading", "skeleton"] }, { kind: "component", type: BydButtonComponent, selector: "byd-button", inputs: ["state", "type", "size", "icon", "options", "stopPropagationActivation"], outputs: ["action"] }, { kind: "pipe", type: TranslatePipe, name: "translate" }, { kind: "component", type: NotificationInlineComponent, selector: "byd-notification-inline", inputs: ["message", "code", "showClose"], outputs: ["askClose"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydFormComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-form', standalone: true, imports: [
                        InputsComponent,
                        NgFor,
                        NgIf,
                        AsyncPipe,
                        FormsModule,
                        ReactiveFormsModule,
                        LoaderComponent,
                        BydButtonComponent,
                        TranslatePipe,
                        NotificationInlineComponent,
                    ], template: "<div class=\"form-container\">\r\n  <form (ngSubmit)=\"onSubmit()\" [formGroup]=\"this.form\">\r\n    <div *ngFor=\"let input of this.inputs; trackBy: trackByKey\" class=\"login-submit-button\">\r\n      <ng-container *ngIf=\"input.visible$ | async\">\r\n        <byd-inputs [input]=\"input\"></byd-inputs>\r\n      </ng-container>\r\n    </div>\r\n    <div class=\"login-submit-button\">\r\n      <byd-loader [isLoading]=\"this.loader\">\r\n        <byd-button\r\n          *ngIf=\"this.canDisplayButton && this.buttonTitle\"\r\n          (action)=\"this.onSubmit()\"\r\n          [state]=\"!this.isValid() ? 'disabled' : 'classic'\"\r\n        >\r\n          {{ this.buttonTitle | translate }}\r\n        </byd-button>\r\n      </byd-loader>\r\n      <byd-notification-inline [message]=\"this.error.message\" [code]=\"this.error.status\" class=\"my-space-sm\">\r\n        <div class=\"justify-end\"></div>\r\n      </byd-notification-inline>\r\n    </div>\r\n  </form>\r\n</div>\r\n", styles: [".login-submit-button{padding-top:20px}\n"] }]
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
    layout = 'grid';
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
        if (changes['isLoading'] &&
            changes['isLoading'].currentValue !== changes['isLoading'].previousValue &&
            changes['isLoading'].currentValue === false) {
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
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: EditFieldComponent, isStandalone: true, selector: "byd-edit-field", inputs: { layout: "layout", getInput: "getInput", changeEditMode$: "changeEditMode$", isLoading: "isLoading", height: "height", withBorder: "withBorder" }, outputs: { newValue: "newValue" }, usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<byd-loader [isLoading]=\"this.isLoading\">\r\n  <ng-container *ngIf=\"!this.editMode\">\r\n    <div\r\n      class=\"value-container\"\r\n      [ngStyle]=\"{ height: height }\"\r\n      [ngClass]=\"{ 'no-border': !this.withBorder }\"\r\n      (click)=\"this.toggleEditMode()\"\r\n    >\r\n      <ng-content></ng-content>\r\n      <!-- <byd-font-icon class=\"hidden-icon\" name=\"modify\" type=\"sm\"></byd-font-icon> -->\r\n    </div>\r\n  </ng-container>\r\n  <ng-container *ngIf=\"this.editMode\">\r\n    <div class=\"align-center g-space-sm\" [ngClass]=\"'flex-' + this.layout\">\r\n      <byd-form class=\"flex-fill\" [inputs]=\"[this.input]\" [canDisplayButton]=\"false\"></byd-form>\r\n\r\n      <!-- <byd-font-icon\r\n        name=\"check-line\"\r\n        type=\"sm\"\r\n        (click)=\"this.validation()\"\r\n      ></byd-font-icon> -->\r\n    </div>\r\n  </ng-container>\r\n</byd-loader>\r\n", styles: [".value-container{flex-direction:row;justify-content:space-between;align-items:center;border:1px solid;border-radius:4px;border-color:var(--byd-neutral-300);display:flex;padding:var(--byd-space-sm)}.value-container:hover{border-color:var(--byd-neutral-500)}.value-container.no-border{border:none}.hidden-icon{visibility:hidden}.value-container:hover .hidden-icon{visibility:visible}\n"], dependencies: [{ kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: LoaderComponent, selector: "byd-loader", inputs: ["isLoading", "skeleton"] }, { kind: "component", type: BydFormComponent, selector: "byd-form", inputs: ["inputs", "askValidation$", "askOnDestroy", "loader", "error", "border", "canDisplayButton", "buttonTitle", "onLive"], outputs: ["valid", "isFormValid"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: EditFieldComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-edit-field', standalone: true, imports: [NgIf, NgClass, NgStyle, LoaderComponent, BydFormComponent], template: "<byd-loader [isLoading]=\"this.isLoading\">\r\n  <ng-container *ngIf=\"!this.editMode\">\r\n    <div\r\n      class=\"value-container\"\r\n      [ngStyle]=\"{ height: height }\"\r\n      [ngClass]=\"{ 'no-border': !this.withBorder }\"\r\n      (click)=\"this.toggleEditMode()\"\r\n    >\r\n      <ng-content></ng-content>\r\n      <!-- <byd-font-icon class=\"hidden-icon\" name=\"modify\" type=\"sm\"></byd-font-icon> -->\r\n    </div>\r\n  </ng-container>\r\n  <ng-container *ngIf=\"this.editMode\">\r\n    <div class=\"align-center g-space-sm\" [ngClass]=\"'flex-' + this.layout\">\r\n      <byd-form class=\"flex-fill\" [inputs]=\"[this.input]\" [canDisplayButton]=\"false\"></byd-form>\r\n\r\n      <!-- <byd-font-icon\r\n        name=\"check-line\"\r\n        type=\"sm\"\r\n        (click)=\"this.validation()\"\r\n      ></byd-font-icon> -->\r\n    </div>\r\n  </ng-container>\r\n</byd-loader>\r\n", styles: [".value-container{flex-direction:row;justify-content:space-between;align-items:center;border:1px solid;border-radius:4px;border-color:var(--byd-neutral-300);display:flex;padding:var(--byd-space-sm)}.value-container:hover{border-color:var(--byd-neutral-500)}.value-container.no-border{border:none}.hidden-icon{visibility:hidden}.value-container:hover .hidden-icon{visibility:visible}\n"] }]
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
