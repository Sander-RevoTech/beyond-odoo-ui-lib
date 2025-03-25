import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, of, distinctUntilChanged } from 'rxjs';
import { SubscriberHandler } from '@beyond/utils';
import { map } from 'rxjs/operators';

function slugValidator() {
    return (control) => {
        const value = control.value;
        // Vérifier si la valeur respecte les caractéristiques d'un slug
        const isValidSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
        return isValidSlug ? null : { invalidSlug: true };
    };
}

class InputBase {
    key;
    label;
    type;
    message;
    controlType;
    validators;
    formControl;
    class;
    children;
    disabled;
    readonly;
    visible$;
    changeValue$ = new Subject();
    _value;
    _isVisible;
    _subscriberHandler = new SubscriberHandler();
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        this.formControl?.setValue(value);
    }
    constructor(options = {}) {
        if (options.value$) {
            this._subscriberHandler.registerSubscription(options.value$.subscribe({
                next: value => {
                    if (this.value) {
                        return;
                    }
                    this.value = value;
                },
            }));
        }
        this._value = options.value === undefined ? null : options.value;
        this.key = options.key || Math.random().toString();
        this.label = options.label || '';
        this.type = options.type || '';
        this.message = options.message || '';
        this.controlType = options.controlType || '';
        this.validators = options.validators || [];
        this.class = options.class || 'col';
        this.children = [];
        this.disabled = options.disabled === true;
        this.readonly = options.readonly === true;
        this.visible$ = options.visible$ || of(true);
        if (options.bindStatusToVisible !== false) {
            this._subscriberHandler.registerSubscription(this.visible$.subscribe(visible => {
                this._isVisible = visible;
                if (options.bindStatusToVisible !== false) {
                    if (!visible) {
                        this.disable();
                    }
                    else {
                        this.enable();
                    }
                }
                if (!visible) {
                    this.formControl?.setValue(null);
                }
            }));
        }
    }
    createFormControl(group) {
        if (this.children.length > 0) {
            for (const child of this.children) {
                if (child instanceof InputBase) {
                    child.createFormControl(group);
                }
            }
        }
        else {
            this.formControl = new FormControl(this.value, this.validators);
            if (this.disabled) {
                this.formControl.disable();
            }
            this._subscriberHandler.registerSubscription(this.formControl.valueChanges.pipe(distinctUntilChanged()).subscribe(value => {
                this.value = value;
                this.launchChangeValue();
            }));
            if (group) {
                group.addControl(this.key, this.formControl);
            }
        }
    }
    launchChangeValue() {
        this.changeValue$.next(this.value);
        this.formControl?.updateValueAndValidity();
        this.children.forEach(child => child.launchChangeValue());
    }
    disable() {
        this.formControl?.disable();
        this.children.forEach(child => child.disable());
    }
    enable() {
        if (!this._isVisible)
            return;
        this.formControl?.enable();
        this.children.forEach(child => child.enable());
    }
    destroy() {
        this.changeValue$.complete();
        this._subscriberHandler.destroy();
    }
}

class InputCheckBox extends InputBase {
    controlType = 'checkbox';
    constructor(options = {}) {
        super(options);
        if (options.toggle === true) {
            this.controlType = 'toggle';
        }
        if (!this.value) {
            this.value = false;
        }
    }
}

class InputTextBox extends InputBase {
    controlType = 'textbox';
    icon;
    iconClicked;
    constructor(options = {}) {
        super(options);
        this.type = options.type || 'text';
        this.icon = options.icon || null;
        this.iconClicked = options.iconClicked;
    }
}

class InputColorPicker extends InputTextBox {
    constructor(options = {}) {
        super(options);
        this.controlType = 'colorPicker';
    }
}

class InputDropdown extends InputBase {
    controlType = 'dropdown';
    options;
    multiple;
    showNothingOption = false;
    withSearch = false;
    width;
    searchChangeValue$ = new Subject();
    constructor(options = {}) {
        super(options);
        this.options = options['options'] || of([]);
        this.multiple = options['multiple'] || false;
        this.showNothingOption = !this.multiple ? !!options.showNothingOption : false;
        this.width = options.width || '100%';
        this.withSearch = options.withSearch || false;
    }
}

class InputLabel extends InputBase {
    extraInfo;
    constructor(options = {}) {
        super(options);
        this.extraInfo = options.extraInfo ? options.extraInfo : of('');
        this.controlType = 'label';
    }
}

class InputNumber extends InputTextBox {
    constructor(options = {}) {
        super(options);
        this.type = 'number';
    }
}

class InputPanel extends InputBase {
    containerClass;
    contentClass;
    constructor(options) {
        super(options);
        this.controlType = 'panel';
        this.containerClass = options.containerClass || [];
        this.contentClass = options.contentClass || '';
        this.children = options.children || [];
    }
}

class InputRadio extends InputBase {
    controlType = 'radio';
    useMaterialTheme;
    options;
    constructor(options = {}) {
        super(options);
        this.options = options['options'] || of([]);
        this.type = 'radioGroup';
        this.useMaterialTheme = options.useMaterialTheme || false;
    }
}

class InputTextarea extends InputBase {
    controlType = 'textarea';
    constructor(options = {}) {
        super(options);
    }
}

class InputUpload extends InputBase {
    confirmButton;
    constructor(options) {
        super(options);
        this.controlType = 'upload';
        this.confirmButton = options.confirmButton ?? false;
    }
    confirmValue(ids) {
        this.formControl?.setValue(ids);
    }
}

class InputFactory {
    static getInput(key, options) {
        if (options.templateChildren) {
            options.children = options.templateChildren();
        }
        switch (key) {
            case 'InputCheckBox':
                return new InputCheckBox(options);
            case 'InputRadio':
                return new InputRadio(options);
            case 'InputColorPicker':
                return new InputColorPicker(options);
            case 'InputDropdown':
                return new InputDropdown(options);
            // case 'InputImages':
            // return new InputImages(options);
            case 'InputLabel':
                return new InputLabel(options);
            case 'InputNumber':
                return new InputNumber(options);
            case 'InputPanel':
                return new InputPanel(options);
            // case 'InputSchema':
            //   return new InputSchema(options);
            case 'InputTextarea':
                return new InputTextarea(options);
            case 'InputTextBox':
                return new InputTextBox(options);
            case 'InputUpload':
                return new InputUpload(options);
            default:
                return new InputTextBox(options);
        }
    }
}

class InputChoices extends InputDropdown {
    controlType = 'choices';
    constructor(options = {}) {
        super(options);
    }
}

class InputDatePicker extends InputBase {
    minDate;
    maxDate;
    rangeEnabled;
    constructor(options = {}) {
        super(options);
        this.controlType = 'datePicker';
        this.minDate = this.parseDate(options.minDate);
        this.maxDate = this.parseDate(options.maxDate);
        this.rangeEnabled = options.rangeEnabled ?? false;
    }
    parseDate(date) {
        if (!date) {
            return null;
        }
        if (date instanceof Date) {
            return date;
        }
        switch (date) {
            case 'today':
                return new Date();
            default:
                return new Date(date);
        }
    }
}

class InputDynamic extends InputBase {
    listChanged$ = new Subject();
    inputsGroup;
    template;
    firstRender = true;
    composedKeyForGroup = true;
    constructor(options = {}) {
        super(options);
        this.inputsGroup = options.inputsGroup || {};
        this.template = options.template || [];
        this.controlType = 'dynamic';
    }
    add(key) {
        const templates = [];
        const value = key && this.value ? this.value[key] : null;
        for (const template of this.template) {
            templates.push(InputFactory.getInput(template.type, {
                ...template.options,
                ...{ value: value ? value[template.options.key ?? ''] : null },
            }));
        }
        this._addControl(templates, key ?? this._inputKey());
        this.listChanged$.next();
    }
    remove(id) {
        if (this.inputsGroup[id]) {
            this.formControl?.removeControl(this.key + '-' + id);
            delete this.inputsGroup[id];
        }
        this.listChanged$.next();
    }
    createFormControl(group) {
        this.formControl = new FormGroup({});
        const inputGroupKeys = Object.keys(this.inputsGroup);
        inputGroupKeys.forEach(key => {
            this._addControl(this.inputsGroup[key], key);
        });
        if (this.firstRender && this.template && inputGroupKeys.length === 0) {
            this.add();
        }
        group.addControl(this.key, this.formControl);
    }
    _addControl(inputs, key) {
        const childGroup = new FormGroup({});
        inputs.forEach(input => {
            input.createFormControl(childGroup);
        });
        this.formControl?.addControl(this.composedKeyForGroup ? this.key + '-' + key : key, childGroup);
        this.inputsGroup[key] = inputs;
    }
    _inputKey() {
        return '' + Math.floor(Math.random() * 10000);
    }
}

class InputEmail extends InputTextBox {
    constructor(options = {}) {
        super(options);
        this.type = 'email';
        this.validators.push(Validators.email);
    }
}

class InputPassword extends InputTextBox {
    constructor(options = {}) {
        super(options);
        this.type = 'password';
        this.validators.push(Validators.required);
    }
}

class InputPhone extends InputBase {
    controlType = 'phone';
    preferredCountries;
    constructor(options = {}) {
        super(options);
        this.type = 'tel';
        this.preferredCountries = ['be', 'fr'];
    }
}

class InputSlider extends InputBase {
    min;
    max;
    controlType = 'slider';
    constructor(options = {}) {
        super(options);
        this.min = options.min || 0;
        this.max = options.max || 100;
    }
}

class InputSwitch extends InputBase {
    contentClass;
    matchtype;
    constructor(options) {
        super(options);
        this.controlType = 'switch';
        this.matchtype = options.matchtype.pipe(map(type => (this.type = type))) || of('');
    }
}

class InputTimePicker extends InputTextBox {
    constructor(options = {}) {
        super(options);
        this.type = 'time';
        this.controlType = 'timePicker';
    }
}

var EAddressValues;
(function (EAddressValues) {
    EAddressValues["street"] = "street";
    EAddressValues["streetNumber"] = "streetNumber";
    EAddressValues["locality"] = "locality";
    EAddressValues["postalCode"] = "postalCode";
    EAddressValues["country"] = "country";
    EAddressValues["longitude"] = "longitude";
    EAddressValues["latitude"] = "latitude";
})(EAddressValues || (EAddressValues = {}));
class InputAddress extends InputPanel {
    controlType = 'address';
    set value(data) {
        this.children.find(x => x.key === EAddressValues.street).value = data.street;
        this.children.find(x => x.key === EAddressValues.streetNumber).value = data.streetNumber;
        this.children.find(x => x.key === EAddressValues.country).value = data.country;
        this.children.find(x => x.key === EAddressValues.locality).value = data.locality;
        this.children.find(x => x.key === EAddressValues.postalCode).value = data.postalCode;
        this.children.find(x => x.key === EAddressValues.longitude).value = data.longitude;
        this.children.find(x => x.key === EAddressValues.latitude).value = data.latitude;
    }
    constructor(options = {}) {
        super(options);
        this.type = 'address';
        this.children.push(new InputTextBox({
            key: EAddressValues.street,
        }), new InputTextBox({
            key: EAddressValues.streetNumber,
        }), new InputTextBox({
            key: EAddressValues.locality,
        }), new InputTextBox({
            key: EAddressValues.country,
        }), new InputTextBox({
            key: EAddressValues.postalCode,
        }), new InputTextBox({
            key: EAddressValues.longitude,
        }), new InputTextBox({
            key: EAddressValues.latitude,
        }));
    }
}

class InputButton extends InputBase {
    controlType = 'button';
    callback = () => { };
    disabled$ = of(false);
    style;
    constructor(options = {}) {
        super(options);
        if (options.callback) {
            this.callback = options.callback;
        }
        if (options.disabled$) {
            this.disabled$ = options.disabled$;
        }
        this.style = options.style ?? 'primary';
    }
}

/*
 * Public API Surface of form-model
 */

/**
 * Generated bundle index. Do not edit.
 */

export { EAddressValues, InputAddress, InputBase, InputButton, InputCheckBox, InputChoices, InputColorPicker, InputDatePicker, InputDropdown, InputDynamic, InputEmail, InputFactory, InputLabel, InputNumber, InputPanel, InputPassword, InputPhone, InputRadio, InputSlider, InputSwitch, InputTextBox, InputTextarea, InputTimePicker, InputUpload, slugValidator };
//# sourceMappingURL=beyond-form-model.mjs.map
