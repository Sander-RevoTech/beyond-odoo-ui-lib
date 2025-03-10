import { NgOptimizedImage, NgIf, NgClass, NgTemplateOutlet } from '@angular/common';
import * as i0 from '@angular/core';
import { Input, Component, EventEmitter, Output } from '@angular/core';
import { TranslatePipe, StopPropagationDirective, BydBaseComponent } from '@beyond/utils';
import * as i1 from '@angular/material/progress-spinner';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

class LogoComponent {
    /**
     * If set, logo oneline version will be taken
     */
    type;
    constructor() { }
    getImagePath() {
        return `assets/logo/logo${this.type ? `-${this.type}` : ''}.png`;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LogoComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: LogoComponent, isStandalone: true, selector: "byd-logo", inputs: { type: "type" }, ngImport: i0, template: "<img [src]=\"this.getImagePath()\" />\n", styles: ["img{margin:auto;height:55px}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LogoComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-logo', standalone: true, imports: [NgOptimizedImage], template: "<img [src]=\"this.getImagePath()\" />\n", styles: ["img{margin:auto;height:55px}\n"] }]
        }], ctorParameters: () => [], propDecorators: { type: [{
                type: Input
            }] } });

// import { MaterialIconComponent } from "@beyond/icons";
class TypedMessageComponent {
    text;
    type;
    get icon() {
        switch (this.type) {
            case 'danger':
                return 'error_outline';
            case 'success':
                return 'check_circle_outline';
            case 'info':
                return 'help_outline';
            case 'warning':
                return 'warning_amber';
            default:
                return '';
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TypedMessageComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: TypedMessageComponent, isStandalone: true, selector: "byd-typed-message", inputs: { text: "text", type: "type" }, ngImport: i0, template: "<div class=\"alert alert-{{ this.type }}\" role=\"alert\">\r\n  <!-- <byd-material-icon [type]=\"'md'\">{{ this.icon }}</byd-material-icon> -->\r\n  <span class=\"text\">{{ this.text | translate }}</span>\r\n</div>\r\n", styles: [".alert{border-radius:8px;display:inline-flex;gap:var(--byd-space-xs);border:none;padding:var(--byd-space-xs)}.text{margin:auto}\n"], dependencies: [{ kind: "pipe", type: TranslatePipe, name: "translate" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TypedMessageComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-typed-message', standalone: true, imports: [TranslatePipe], template: "<div class=\"alert alert-{{ this.type }}\" role=\"alert\">\r\n  <!-- <byd-material-icon [type]=\"'md'\">{{ this.icon }}</byd-material-icon> -->\r\n  <span class=\"text\">{{ this.text | translate }}</span>\r\n</div>\r\n", styles: [".alert{border-radius:8px;display:inline-flex;gap:var(--byd-space-xs);border:none;padding:var(--byd-space-xs)}.text{margin:auto}\n"] }]
        }], propDecorators: { text: [{
                type: Input
            }], type: [{
                type: Input
            }] } });

class PictureInfoMessageComponent {
    icon;
    iconSize;
    text;
    type = 'info';
    get displayedText() {
        return this.text ?? '';
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: PictureInfoMessageComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: PictureInfoMessageComponent, isStandalone: true, selector: "byd-picture-info-message", inputs: { icon: "icon", iconSize: "iconSize", text: "text", type: "type" }, ngImport: i0, template: "<ng-container *ngIf=\"this.icon\">\r\n  <div class=\"card\">\r\n    <!-- <byd-material-icon\r\n      class=\"font-icon\"\r\n      *ngIf=\"this.icon\"\r\n      [type]=\"this.iconSize ?? 'md'\"\r\n    >\r\n      {{ this.icon }}\r\n    </byd-material-icon> -->\r\n\r\n    <div class=\"pt-space-xs\">{{ this.displayedText | translate }}</div>\r\n  </div>\r\n</ng-container>\r\n\r\n<ng-container *ngIf=\"!this.icon\">\r\n  <byd-typed-message\r\n    [text]=\"this.displayedText\"\r\n    [type]=\"this.type ?? 'info'\"\r\n  ></byd-typed-message>\r\n</ng-container>\r\n", styles: [".card{padding:var(--byd-space-sm);text-align:center}p{padding-top:var(--byd-space-sm)}byd-font-icon{color:var(--byd-brand-400)}\n"], dependencies: [{ kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "pipe", type: TranslatePipe, name: "translate" }, { kind: "component", type: TypedMessageComponent, selector: "byd-typed-message", inputs: ["text", "type"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: PictureInfoMessageComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-picture-info-message', standalone: true, imports: [NgIf, TranslatePipe, TypedMessageComponent], template: "<ng-container *ngIf=\"this.icon\">\r\n  <div class=\"card\">\r\n    <!-- <byd-material-icon\r\n      class=\"font-icon\"\r\n      *ngIf=\"this.icon\"\r\n      [type]=\"this.iconSize ?? 'md'\"\r\n    >\r\n      {{ this.icon }}\r\n    </byd-material-icon> -->\r\n\r\n    <div class=\"pt-space-xs\">{{ this.displayedText | translate }}</div>\r\n  </div>\r\n</ng-container>\r\n\r\n<ng-container *ngIf=\"!this.icon\">\r\n  <byd-typed-message\r\n    [text]=\"this.displayedText\"\r\n    [type]=\"this.type ?? 'info'\"\r\n  ></byd-typed-message>\r\n</ng-container>\r\n", styles: [".card{padding:var(--byd-space-sm);text-align:center}p{padding-top:var(--byd-space-sm)}byd-font-icon{color:var(--byd-brand-400)}\n"] }]
        }], propDecorators: { icon: [{
                type: Input
            }], iconSize: [{
                type: Input
            }], text: [{
                type: Input
            }], type: [{
                type: Input
            }] } });

class TitleComponent {
    /**
     * Title level
     * Higher value means lower title size
     */
    level = 1;
    /**
     * Title theme
     * If set to true, title will be themed with CSS
     */
    isTheme = false;
    isBold = false;
    constructor() { }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TitleComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.1", type: TitleComponent, isStandalone: true, selector: "byd-title", inputs: { level: "level", isTheme: "isTheme", isBold: "isBold" }, ngImport: i0, template: "<div [ngClass]=\"{ 'theme-title': this.isTheme, bold: this.isBold }\">\n  @switch (this.level) {\n  <!-- Cases -->\n  @case (1) {\n  <h1>\n    <ng-container *ngTemplateOutlet=\"contentTemplate\"></ng-container>\n  </h1>\n  } @case (2) {\n  <h2>\n    <ng-container *ngTemplateOutlet=\"contentTemplate\"></ng-container>\n  </h2>\n  } @case (3) {\n  <h3>\n    <ng-container *ngTemplateOutlet=\"contentTemplate\"></ng-container>\n  </h3>\n  } @case (4) {\n  <h4>\n    <ng-container *ngTemplateOutlet=\"contentTemplate\"></ng-container>\n  </h4>\n  } @case (5) {\n  <h5>\n    <ng-container *ngTemplateOutlet=\"contentTemplate\"></ng-container>\n  </h5>\n  } @case (6) {\n  <h6>\n    <ng-container *ngTemplateOutlet=\"contentTemplate\"></ng-container>\n  </h6>\n  } }\n</div>\n\n<ng-template #contentTemplate>\n  <ng-content></ng-content>\n</ng-template>\n", styles: ["h1{font-size:var(--byd-font-h1-default-size);line-height:var(--byd-font-h1-default-line);font-weight:var(--byd-font-h1-default-weight);margin:0}h2{font-size:var(--byd-font-h2-default-size);line-height:var(--byd-font-h2-default-line);font-weight:var(--byd-font-h2-default-weight);margin:0}.bold h2{font-size:var(--byd-font-h2-default-size);line-height:var(--byd-font-h2-default-line);font-weight:var(--byd-font-h2-bold-weight)}h3{font-size:var(--byd-font-h3-default-size);line-height:var(--byd-font-h3-default-line);font-weight:var(--byd-font-h3-default-weight);margin:0}h4{font-size:var(--byd-font-h4-default-size);line-height:var(--byd-font-h4-default-line);font-weight:var(--byd-font-h4-default-weight);margin:0}.theme-title{color:var(--byd-surface-brand-primary)}.bold h3{font-size:var(--byd-font-h3-default-size);line-height:var(--byd-font-h3-default-line);font-weight:var(--byd-font-h3-bold-weight)}.bold h4{font-size:var(--byd-font-h4-default-size);line-height:var(--byd-font-h4-default-line);font-weight:var(--byd-font-h4-bold-weight)}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TitleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-title', standalone: true, imports: [NgClass, NgTemplateOutlet], template: "<div [ngClass]=\"{ 'theme-title': this.isTheme, bold: this.isBold }\">\n  @switch (this.level) {\n  <!-- Cases -->\n  @case (1) {\n  <h1>\n    <ng-container *ngTemplateOutlet=\"contentTemplate\"></ng-container>\n  </h1>\n  } @case (2) {\n  <h2>\n    <ng-container *ngTemplateOutlet=\"contentTemplate\"></ng-container>\n  </h2>\n  } @case (3) {\n  <h3>\n    <ng-container *ngTemplateOutlet=\"contentTemplate\"></ng-container>\n  </h3>\n  } @case (4) {\n  <h4>\n    <ng-container *ngTemplateOutlet=\"contentTemplate\"></ng-container>\n  </h4>\n  } @case (5) {\n  <h5>\n    <ng-container *ngTemplateOutlet=\"contentTemplate\"></ng-container>\n  </h5>\n  } @case (6) {\n  <h6>\n    <ng-container *ngTemplateOutlet=\"contentTemplate\"></ng-container>\n  </h6>\n  } }\n</div>\n\n<ng-template #contentTemplate>\n  <ng-content></ng-content>\n</ng-template>\n", styles: ["h1{font-size:var(--byd-font-h1-default-size);line-height:var(--byd-font-h1-default-line);font-weight:var(--byd-font-h1-default-weight);margin:0}h2{font-size:var(--byd-font-h2-default-size);line-height:var(--byd-font-h2-default-line);font-weight:var(--byd-font-h2-default-weight);margin:0}.bold h2{font-size:var(--byd-font-h2-default-size);line-height:var(--byd-font-h2-default-line);font-weight:var(--byd-font-h2-bold-weight)}h3{font-size:var(--byd-font-h3-default-size);line-height:var(--byd-font-h3-default-line);font-weight:var(--byd-font-h3-default-weight);margin:0}h4{font-size:var(--byd-font-h4-default-size);line-height:var(--byd-font-h4-default-line);font-weight:var(--byd-font-h4-default-weight);margin:0}.theme-title{color:var(--byd-surface-brand-primary)}.bold h3{font-size:var(--byd-font-h3-default-size);line-height:var(--byd-font-h3-default-line);font-weight:var(--byd-font-h3-bold-weight)}.bold h4{font-size:var(--byd-font-h4-default-size);line-height:var(--byd-font-h4-default-line);font-weight:var(--byd-font-h4-bold-weight)}\n"] }]
        }], ctorParameters: () => [], propDecorators: { level: [{
                type: Input
            }], isTheme: [{
                type: Input
            }], isBold: [{
                type: Input
            }] } });

class BydTextComponent {
    size = 'md';
    isBold = false;
    color = 'primary';
    getColorClass() {
        return `text-color-text-${this.color}`;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydTextComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: BydTextComponent, isStandalone: true, selector: "byd-text", inputs: { size: "size", isBold: "isBold", color: "color" }, ngImport: i0, template: "<div class=\"text\" [class.bold]=\"this.isBold\" [ngClass]=\"this.size + ' ' + this.getColorClass()\">\n  <ng-content></ng-content>\n</div>\n", styles: [".text{font-size:var(--byd-font-body-md-default-size);line-height:var(--byd-font-body-md-default-line);font-weight:var(--byd-font-body-md-default-weight)}.sm{font-size:var(--byd-font-body-sm-default-size);line-height:var(--byd-font-body-sm-default-line);font-weight:var(--byd-font-body-sm-default-weight)}.xs{font-size:var(--byd-font-body-xs-default-size);line-height:var(--byd-font-body-xs-default-line);font-weight:var(--byd-font-body-xs-default-weight)}.bold{font-size:var(--byd-font-body-md-default-size);line-height:var(--byd-font-body-md-default-line);font-weight:var(--byd-font-body-md-bold-weight)}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydTextComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-text', standalone: true, imports: [NgClass], template: "<div class=\"text\" [class.bold]=\"this.isBold\" [ngClass]=\"this.size + ' ' + this.getColorClass()\">\n  <ng-content></ng-content>\n</div>\n", styles: [".text{font-size:var(--byd-font-body-md-default-size);line-height:var(--byd-font-body-md-default-line);font-weight:var(--byd-font-body-md-default-weight)}.sm{font-size:var(--byd-font-body-sm-default-size);line-height:var(--byd-font-body-sm-default-line);font-weight:var(--byd-font-body-sm-default-weight)}.xs{font-size:var(--byd-font-body-xs-default-size);line-height:var(--byd-font-body-xs-default-line);font-weight:var(--byd-font-body-xs-default-weight)}.bold{font-size:var(--byd-font-body-md-default-size);line-height:var(--byd-font-body-md-default-line);font-weight:var(--byd-font-body-md-bold-weight)}\n"] }]
        }], propDecorators: { size: [{
                type: Input
            }], isBold: [{
                type: Input
            }], color: [{
                type: Input
            }] } });

class BydButtonComponent {
    /**
     * Is button type
     */
    state = 'classic';
    /**
     * Indicate the button type
     */
    type = 'primary';
    size = 'medium';
    icon = null;
    /**
     * Class - Add custom classes separates by space
     * Outline - Draw a border around the button when true
     * Rounded - Make button rounded when true
     * Circular - Make button circular when true
     */
    options = null;
    stopPropagationActivation = true;
    /**
     * Event emitted when button is clicked
     */
    action = new EventEmitter();
    constructor() { }
    handleClick() {
        if (this.state === 'classic') {
            this.action.emit();
        }
    }
    getClass() {
        const css = {};
        css[this.state] = true;
        css[this.size] = true;
        css[this.type] = true;
        if (this.options?.circular === true) {
            css['circular'] = true;
        }
        if (this.options?.circular === 'big') {
            css['circular big'] = true;
        }
        if (this.options?.circular === 'small') {
            css['circular small'] = true;
        }
        if (this.options?.class) {
            css[this.options.class] = true;
        }
        if (this.options?.border === false) {
            css['no-border'] = true;
        }
        return css;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: BydButtonComponent, isStandalone: true, selector: "byd-button", inputs: { state: "state", type: "type", size: "size", icon: "icon", options: "options", stopPropagationActivation: "stopPropagationActivation" }, outputs: { action: "action" }, ngImport: i0, template: "<button\n  appStopPropagation\n  [stopPropagationActivation]=\"this.stopPropagationActivation\"\n  type=\"button\"\n  class=\"button pointer\"\n  [ngClass]=\"this.getClass()\"\n  (click)=\"handleClick()\"\n>\n  <div class=\"flex-row g-space-sm ta.align-center\">\n    <!-- <byd-material-icon *ngIf=\"this.icon\">{{ this.icon }}</byd-material-icon> -->\n    <ng-content></ng-content>\n  </div>\n</button>\n", styles: [".button{width:100%;border:none;border-radius:var(--byd-radius-full);padding:var(--byd-space-sm) var(--byd-space-md);font-size:var(--byd-font-body-md-default-size);line-height:var(--byd-font-body-md-default-line);font-weight:var(--byd-font-body-md-default-weight);align-items:center;display:flex;justify-content:center;margin:auto;gap:var(--byd-space-md)}.button.small{font-size:var(--byd-font-body-sm-default-size);line-height:var(--byd-font-body-sm-default-line);font-weight:var(--byd-font-body-sm-default-weight);padding:var(--byd-space-sm) calc(var(--byd-space-base) * 2)}.button.large{padding:var(--byd-space-md) var(--byd-space-lg)}.button.no-border{border:none}.button.disabled,.button.inactive{cursor:not-allowed}.button.primary{color:var(--byd-text-invert-primary);background-color:var(--byd-surface-brand-primary)}.button.primary:hover{background-color:var(--byd-surface-hover-primary)}.button.primary.disabled{color:var(--byd-text-brand-secondary);background-color:var(--byd-surface-hover-secondary)}.button.primary.inactive{color:var(--byd-text-primary);background-color:var(--byd-surface-tertiary)}.button.secondary{color:var(--byd-text-primary);background-color:var(--byd-surface-primary);border:1px solid var(--byd-border-secondary)}.button.secondary:hover{border-color:var(--byd-border-invert)}.button.secondary.disabled{color:var(--byd-text-tertiary);border-color:var(--byd-border-disabled)}.button.secondary.inactive{border-color:var(--byd-border-primary)}.circular{height:50px;width:50px;border-radius:50px;padding:0}.circular.big{height:90px;width:90px}.circular.small{height:40px;width:40px}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: StopPropagationDirective, selector: "[appStopPropagation]", inputs: ["stopPropagationActivation"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-button', standalone: true, imports: [NgClass, StopPropagationDirective], template: "<button\n  appStopPropagation\n  [stopPropagationActivation]=\"this.stopPropagationActivation\"\n  type=\"button\"\n  class=\"button pointer\"\n  [ngClass]=\"this.getClass()\"\n  (click)=\"handleClick()\"\n>\n  <div class=\"flex-row g-space-sm ta.align-center\">\n    <!-- <byd-material-icon *ngIf=\"this.icon\">{{ this.icon }}</byd-material-icon> -->\n    <ng-content></ng-content>\n  </div>\n</button>\n", styles: [".button{width:100%;border:none;border-radius:var(--byd-radius-full);padding:var(--byd-space-sm) var(--byd-space-md);font-size:var(--byd-font-body-md-default-size);line-height:var(--byd-font-body-md-default-line);font-weight:var(--byd-font-body-md-default-weight);align-items:center;display:flex;justify-content:center;margin:auto;gap:var(--byd-space-md)}.button.small{font-size:var(--byd-font-body-sm-default-size);line-height:var(--byd-font-body-sm-default-line);font-weight:var(--byd-font-body-sm-default-weight);padding:var(--byd-space-sm) calc(var(--byd-space-base) * 2)}.button.large{padding:var(--byd-space-md) var(--byd-space-lg)}.button.no-border{border:none}.button.disabled,.button.inactive{cursor:not-allowed}.button.primary{color:var(--byd-text-invert-primary);background-color:var(--byd-surface-brand-primary)}.button.primary:hover{background-color:var(--byd-surface-hover-primary)}.button.primary.disabled{color:var(--byd-text-brand-secondary);background-color:var(--byd-surface-hover-secondary)}.button.primary.inactive{color:var(--byd-text-primary);background-color:var(--byd-surface-tertiary)}.button.secondary{color:var(--byd-text-primary);background-color:var(--byd-surface-primary);border:1px solid var(--byd-border-secondary)}.button.secondary:hover{border-color:var(--byd-border-invert)}.button.secondary.disabled{color:var(--byd-text-tertiary);border-color:var(--byd-border-disabled)}.button.secondary.inactive{border-color:var(--byd-border-primary)}.circular{height:50px;width:50px;border-radius:50px;padding:0}.circular.big{height:90px;width:90px}.circular.small{height:40px;width:40px}\n"] }]
        }], ctorParameters: () => [], propDecorators: { state: [{
                type: Input
            }], type: [{
                type: Input
            }], size: [{
                type: Input
            }], icon: [{
                type: Input
            }], options: [{
                type: Input
            }], stopPropagationActivation: [{
                type: Input
            }], action: [{
                type: Output
            }] } });

var EToast;
(function (EToast) {
    EToast[EToast["none"] = 0] = "none";
    EToast[EToast["error"] = 1] = "error";
    EToast[EToast["warning"] = 2] = "warning";
    EToast[EToast["information"] = 3] = "information";
    EToast[EToast["success"] = 4] = "success";
})(EToast || (EToast = {}));
const getTypeClass = (code) => {
    if (code === EToast.error) {
        return 'danger';
    }
    else if (code === EToast.warning) {
        return 'warning';
    }
    else if (code === EToast.information) {
        return 'info';
    }
    else if (code === EToast.success) {
        return 'success';
    }
    else {
        return '';
    }
};

class ToastComponent {
    code = EToast.information;
    getTypeClass = getTypeClass;
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: ToastComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: ToastComponent, isStandalone: true, selector: "byd-toast", inputs: { code: "code" }, ngImport: i0, template: "<div class=\"card\" [ngClass]=\"this.getTypeClass(this.code)\">\n  <ng-content></ng-content>\n</div>\n", styles: [".card{box-shadow:var(--byd-shadow-brand-md);border-radius:var(--byd-space-md);overflow:hidden;padding:var(--byd-space-lg);background-color:var(--byd-surface-primary);color:var(--byd-text-primary);font-size:var(--byd-font-body-md-default-size);line-height:var(--byd-font-body-md-default-line);font-weight:var(--byd-font-body-md-default-weight)}.card.success{border:1px solid var(--byd-semantic-token-success)}.card.danger{border:1px solid var(--byd-semantic-token-alert)}.card.warning{border:1px solid var(--byd-semantic-token-warning)}.card.info{border:1px solid var(--byd-semantic-token-link)}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: ToastComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-toast', standalone: true, imports: [NgClass], template: "<div class=\"card\" [ngClass]=\"this.getTypeClass(this.code)\">\n  <ng-content></ng-content>\n</div>\n", styles: [".card{box-shadow:var(--byd-shadow-brand-md);border-radius:var(--byd-space-md);overflow:hidden;padding:var(--byd-space-lg);background-color:var(--byd-surface-primary);color:var(--byd-text-primary);font-size:var(--byd-font-body-md-default-size);line-height:var(--byd-font-body-md-default-line);font-weight:var(--byd-font-body-md-default-weight)}.card.success{border:1px solid var(--byd-semantic-token-success)}.card.danger{border:1px solid var(--byd-semantic-token-alert)}.card.warning{border:1px solid var(--byd-semantic-token-warning)}.card.info{border:1px solid var(--byd-semantic-token-link)}\n"] }]
        }], propDecorators: { code: [{
                type: Input
            }] } });

class EmptyComponent {
    isEmpty = true;
    isLight = true;
    showMessage = true;
    text = 'container.empty.light-message';
    type = 'info';
    icon = 'ghost';
    iconSize;
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: EmptyComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: EmptyComponent, isStandalone: true, selector: "byd-empty", inputs: { isEmpty: "isEmpty", isLight: "isLight", showMessage: "showMessage", text: "text", type: "type", icon: "icon", iconSize: "iconSize" }, ngImport: i0, template: "<ng-container *ngIf=\"this.isEmpty\">\n  <div class=\"empty-container\">\n    <ng-container *ngIf=\"this.showMessage\">\n      <ng-container *ngIf=\"this.isLight\">\n        <byd-picture-info-message [type]=\"this.type\" [text]=\"this.text\">\n        </byd-picture-info-message>\n      </ng-container>\n      <ng-container *ngIf=\"!this.isLight\">\n        <byd-picture-info-message\n          [icon]=\"this.icon\"\n          [iconSize]=\"this.iconSize\"\n          [type]=\"this.type\"\n          [text]=\"this.text\"\n        >\n        </byd-picture-info-message>\n      </ng-container>\n    </ng-container>\n  </div>\n</ng-container>\n\n<ng-container *ngIf=\"!this.isEmpty\">\n  <ng-content></ng-content>\n</ng-container>\n", styles: [".empty-container{margin:var(--byd-space-sm) auto;text-align:center}\n"], dependencies: [{ kind: "component", type: PictureInfoMessageComponent, selector: "byd-picture-info-message", inputs: ["icon", "iconSize", "text", "type"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: EmptyComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-empty', standalone: true, imports: [PictureInfoMessageComponent, NgIf], template: "<ng-container *ngIf=\"this.isEmpty\">\n  <div class=\"empty-container\">\n    <ng-container *ngIf=\"this.showMessage\">\n      <ng-container *ngIf=\"this.isLight\">\n        <byd-picture-info-message [type]=\"this.type\" [text]=\"this.text\">\n        </byd-picture-info-message>\n      </ng-container>\n      <ng-container *ngIf=\"!this.isLight\">\n        <byd-picture-info-message\n          [icon]=\"this.icon\"\n          [iconSize]=\"this.iconSize\"\n          [type]=\"this.type\"\n          [text]=\"this.text\"\n        >\n        </byd-picture-info-message>\n      </ng-container>\n    </ng-container>\n  </div>\n</ng-container>\n\n<ng-container *ngIf=\"!this.isEmpty\">\n  <ng-content></ng-content>\n</ng-container>\n", styles: [".empty-container{margin:var(--byd-space-sm) auto;text-align:center}\n"] }]
        }], propDecorators: { isEmpty: [{
                type: Input
            }], isLight: [{
                type: Input
            }], showMessage: [{
                type: Input
            }], text: [{
                type: Input
            }], type: [{
                type: Input
            }], icon: [{
                type: Input
            }], iconSize: [{
                type: Input
            }] } });

class ErrorComponent {
    message = '';
    code = 200;
    constructor() { }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: ErrorComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: ErrorComponent, isStandalone: true, selector: "byd-error", inputs: { message: "message", code: "code" }, ngImport: i0, template: "<ng-container *ngIf=\"this.message === ''\">\n  <ng-content></ng-content>\n</ng-container>\n<ng-container *ngIf=\"this.message !== ''\">\n  <byd-picture-info-message\n    icon=\"sad\"\n    iconSize=\"lg\"\n    type=\"danger\"\n    text=\"container.error.title\"\n  >\n  </byd-picture-info-message>\n  <p>{{ this.message | translate }}</p>\n</ng-container>\n", styles: [""], dependencies: [{ kind: "pipe", type: TranslatePipe, name: "translate" }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: PictureInfoMessageComponent, selector: "byd-picture-info-message", inputs: ["icon", "iconSize", "text", "type"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: ErrorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-error', standalone: true, imports: [TranslatePipe, NgIf, PictureInfoMessageComponent], template: "<ng-container *ngIf=\"this.message === ''\">\n  <ng-content></ng-content>\n</ng-container>\n<ng-container *ngIf=\"this.message !== ''\">\n  <byd-picture-info-message\n    icon=\"sad\"\n    iconSize=\"lg\"\n    type=\"danger\"\n    text=\"container.error.title\"\n  >\n  </byd-picture-info-message>\n  <p>{{ this.message | translate }}</p>\n</ng-container>\n" }]
        }], ctorParameters: () => [], propDecorators: { message: [{
                type: Input
            }], code: [{
                type: Input
            }] } });

const cardPlaceholder = {
    type: 'item',
    children: [
        {
            type: 'col',
            children: [
                {
                    type: 'row',
                    children: [
                        {
                            type: 'col',
                            gridSize: 8,
                            attributes: ['big'],
                            repeat: 1,
                        },
                        {
                            type: 'col',
                            gridSize: 4,
                            attributes: ['empty', 'big'],
                            repeat: 1,
                        },
                        {
                            type: 'col',
                            gridSize: 4,
                            repeat: 1,
                        },
                    ],
                    repeat: 1,
                },
            ],
            repeat: 1,
        },
        {
            type: 'col',
            gridSize: 2,
            children: [
                {
                    type: 'avatar',
                    repeat: 1,
                },
            ],
            repeat: 1,
        },
        {
            type: 'col',
            gridSize: 12,
            children: [
                {
                    type: 'row',
                    children: [
                        {
                            type: 'col',
                            gridSize: 8,
                            repeat: 1,
                        },
                        {
                            type: 'col',
                            gridSize: 4,
                            attributes: ['empty'],
                            repeat: 1,
                        },
                    ],
                    repeat: 2,
                },
            ],
            repeat: 1,
        },
        {
            type: 'row',
            children: [
                {
                    type: 'col',
                    gridSize: 12,
                    repeat: 6,
                },
            ],
            repeat: 1,
        },
    ],
    repeat: 1,
};
const menuPlaceholder = {
    type: 'row',
    children: [
        {
            type: 'col',
            gridSize: 3,
            attributes: ['big'],
            repeat: 1,
        },
        {
            type: 'col',
            gridSize: 1,
            attributes: ['big', 'empty'],
            repeat: 1,
        },
        {
            type: 'col',
            gridSize: 4,
            attributes: ['big'],
            repeat: 1,
        },
        {
            type: 'col',
            gridSize: 1,
            attributes: ['big', 'empty'],
            repeat: 1,
        },
        {
            type: 'col',
            gridSize: 3,
            attributes: ['big'],
            repeat: 1,
        },
    ],
    repeat: 3,
};
const morePlaceholder = {
    type: 'row',
    children: [
        {
            type: 'col',
            gridSize: 4,
            attributes: ['big', 'empty'],
            repeat: 1,
        },
        {
            type: 'col',
            gridSize: 4,
            attributes: ['big'],
            repeat: 1,
        },
        {
            type: 'col',
            gridSize: 4,
            attributes: ['big', 'empty'],
            repeat: 1,
        },
        {
            type: 'col',
            gridSize: 12,
            attributes: ['empty'],
            repeat: 1,
        },
    ],
    repeat: 3,
};
const fileListPlaceholder = {
    type: 'container',
    attributes: ['block'],
    children: [
        {
            type: 'item',
            attributes: ['no-shadow'],
            gridSize: 3,
            repeat: 1,
            children: [
                {
                    type: 'col',
                    gridSize: 4,
                    repeat: 9,
                    children: [
                        {
                            type: 'picture',
                            repeat: 1,
                        },
                    ],
                },
            ],
        },
    ],
    repeat: 1,
};
const cardListPlaceholder = {
    type: 'container',
    children: [
        {
            type: 'container',
            children: [cardPlaceholder],
            repeat: 3,
        },
        {
            type: 'container',
            children: [morePlaceholder],
            repeat: 3,
        },
    ],
    repeat: 1,
};
const detailPlaceholder = {
    type: 'container',
    children: [
        {
            type: 'container',
            children: [cardPlaceholder],
            repeat: 2,
        },
    ],
    repeat: 1,
};
const getPlaceholderConfig = (placeHolder) => {
    switch (placeHolder) {
        case 'cardList':
            return cardListPlaceholder;
        case 'detail':
            return detailPlaceholder;
        case 'fileList':
            return fileListPlaceholder;
        default:
            return cardPlaceholder;
    }
};

class LoaderComponent {
    isLoading = false;
    skeleton = null;
    constructor() {
        this.isLoading = true;
    }
    getPlaceholder() {
        return getPlaceholderConfig(this.skeleton || 'default');
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LoaderComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: LoaderComponent, isStandalone: true, selector: "byd-loader", inputs: { isLoading: "isLoading", skeleton: "skeleton" }, ngImport: i0, template: "<ng-container *ngIf=\"this.isLoading\">\n  <ng-container *ngIf=\"!this.skeleton\">\n    <div class=\"pt-space-15\">\n      <mat-spinner style=\"margin: 0 auto\" [diameter]=\"20\"></mat-spinner>\n    </div>\n  </ng-container>\n\n  <ng-container *ngIf=\"this.skeleton\">\n    <!-- <byd-placeholder [placeholder]=\"this.getPlaceholder()\"></byd-placeholder> -->\n  </ng-container>\n</ng-container>\n<ng-container *ngIf=\"!this.isLoading\">\n  <ng-content></ng-content>\n</ng-container>\n", styles: [""], dependencies: [{ kind: "ngmodule", type: MatProgressSpinnerModule }, { kind: "component", type: i1.MatProgressSpinner, selector: "mat-progress-spinner, mat-spinner", inputs: ["color", "mode", "value", "diameter", "strokeWidth"], exportAs: ["matProgressSpinner"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LoaderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-loader', standalone: true, imports: [MatProgressSpinnerModule, NgIf], template: "<ng-container *ngIf=\"this.isLoading\">\n  <ng-container *ngIf=\"!this.skeleton\">\n    <div class=\"pt-space-15\">\n      <mat-spinner style=\"margin: 0 auto\" [diameter]=\"20\"></mat-spinner>\n    </div>\n  </ng-container>\n\n  <ng-container *ngIf=\"this.skeleton\">\n    <!-- <byd-placeholder [placeholder]=\"this.getPlaceholder()\"></byd-placeholder> -->\n  </ng-container>\n</ng-container>\n<ng-container *ngIf=\"!this.isLoading\">\n  <ng-content></ng-content>\n</ng-container>\n" }]
        }], ctorParameters: () => [], propDecorators: { isLoading: [{
                type: Input
            }], skeleton: [{
                type: Input
            }] } });

class SwiperLightComponent extends BydBaseComponent {
    items;
    template;
    swiperClasses = 'g-space-sm';
    containerClasses;
    forced = true;
    classes = '';
    constructor() {
        super();
    }
    ngOnInit() {
        if (this.forced) {
            this.classes = `items ${this.swiperClasses ?? ''}`;
        }
        else {
            // this._registerSubscription(
            //   this._deviceInfoService.os$.subscribe(os => {
            //     this.classes = this._deviceInfoService.isMobileOs(os)
            //       ? `items ${this.swiperClasses ?? ''}`
            //       : this.containerClasses ?? '';
            //   })
            // );
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: SwiperLightComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.1", type: SwiperLightComponent, isStandalone: true, selector: "byd-swiper-light", inputs: { items: "items", template: "template", swiperClasses: "swiperClasses", containerClasses: "containerClasses", forced: "forced" }, usesInheritance: true, ngImport: i0, template: "<div class=\"swiper-container\" [ngClass]=\"this.classes\">\n  @for(item of this.items; track item.key) {\n  <ng-container\n    *ngTemplateOutlet=\"this.template; context: { element: item }\"\n  ></ng-container>\n  }\n</div>\n", styles: [".items{display:flex;flex-wrap:wrap;justify-content:flex-start;position:relative;width:100%;-webkit-user-select:none;user-select:none;cursor:pointer;overflow-x:auto;overflow-y:hidden;flex-wrap:nowrap}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: SwiperLightComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-swiper-light', standalone: true, imports: [NgClass], template: "<div class=\"swiper-container\" [ngClass]=\"this.classes\">\n  @for(item of this.items; track item.key) {\n  <ng-container\n    *ngTemplateOutlet=\"this.template; context: { element: item }\"\n  ></ng-container>\n  }\n</div>\n", styles: [".items{display:flex;flex-wrap:wrap;justify-content:flex-start;position:relative;width:100%;-webkit-user-select:none;user-select:none;cursor:pointer;overflow-x:auto;overflow-y:hidden;flex-wrap:nowrap}\n"] }]
        }], ctorParameters: () => [], propDecorators: { items: [{
                type: Input
            }], template: [{
                type: Input
            }], swiperClasses: [{
                type: Input
            }], containerClasses: [{
                type: Input
            }], forced: [{
                type: Input
            }] } });

class CardComponent {
    highlight = false;
    shadow = true;
    fullHeight = false;
    noContent = false;
    isNew = false;
    click = new EventEmitter();
    hasHandler = false;
    ngOnInit() {
        this.hasHandler = this.click.observers.length > 0;
    }
    constructor() { }
    clickTrigger() {
        this.click.emit(null);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: CardComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: CardComponent, isStandalone: true, selector: "byd-card", inputs: { highlight: "highlight", shadow: "shadow", fullHeight: "fullHeight", noContent: "noContent", isNew: "isNew" }, outputs: { click: "click" }, ngImport: i0, template: "<div\n  class=\"card flex-column\"\n  [ngClass]=\"{\n    'card-shadow': this.shadow,\n    highlight: this.highlight,\n    'full-height': this.fullHeight,\n    'no-card-border': this.noContent\n  }\"\n  [class.hover]=\"this.hasHandler\"\n  (click)=\"this.clickTrigger()\"\n>\n  <!-- <byd-new [visible]=\"this.isNew\"></byd-new> -->\n  <div class=\"responsive-content\">\n    <div class=\"img-container\">\n      <div class=\"card-img-container\">\n        <ng-content select=\"byd-card-image\"></ng-content>\n      </div>\n    </div>\n    <div class=\"content-container flex-column flex-full\">\n      <div class=\"card-header-container\">\n        <ng-content select=\"byd-card-header\"></ng-content>\n      </div>\n      <div class=\"card-content-container flex-full\">\n        <ng-content select=\"byd-card-content\" class=\"flex-full\"></ng-content>\n      </div>\n      <div class=\"card-cbyd-container\">\n        <ng-content select=\"byd-card-cta\"></ng-content>\n      </div>\n    </div>\n  </div>\n</div>\n", styles: [".card{border-radius:var(--byd-space-md);position:relative;padding:var(--byd-space-md);background-color:var(--byd-surface-default);color:var(--byd-text-primary);font-size:var(--byd-font-body-md-default-size);line-height:var(--byd-font-body-md-default-line);font-weight:var(--byd-font-body-md-default-weight)}.card.hover:hover{cursor:pointer;background-color:var(--byd-surface-hover-secondary)}.card.full-height{height:calc(100% - var(--byd-space-md) * 2)}.card.highlight{background-color:var(--byd-surface-hover-secondary);border-color:1px solid var(--byd-border-secondary)}.card.card-shadow{box-shadow:var(--byd-shadow-black-md)}.card .responsive-content{display:flex;flex-direction:column}:host-context(.card-force-mobile) .card .responsive-content{display:flex;flex-direction:column}:host-context(.card-force-mobile) .card .responsive-content .img-container{order:0}\n"], dependencies: [{ kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: CardComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-card', standalone: true, imports: [NgClass], template: "<div\n  class=\"card flex-column\"\n  [ngClass]=\"{\n    'card-shadow': this.shadow,\n    highlight: this.highlight,\n    'full-height': this.fullHeight,\n    'no-card-border': this.noContent\n  }\"\n  [class.hover]=\"this.hasHandler\"\n  (click)=\"this.clickTrigger()\"\n>\n  <!-- <byd-new [visible]=\"this.isNew\"></byd-new> -->\n  <div class=\"responsive-content\">\n    <div class=\"img-container\">\n      <div class=\"card-img-container\">\n        <ng-content select=\"byd-card-image\"></ng-content>\n      </div>\n    </div>\n    <div class=\"content-container flex-column flex-full\">\n      <div class=\"card-header-container\">\n        <ng-content select=\"byd-card-header\"></ng-content>\n      </div>\n      <div class=\"card-content-container flex-full\">\n        <ng-content select=\"byd-card-content\" class=\"flex-full\"></ng-content>\n      </div>\n      <div class=\"card-cbyd-container\">\n        <ng-content select=\"byd-card-cta\"></ng-content>\n      </div>\n    </div>\n  </div>\n</div>\n", styles: [".card{border-radius:var(--byd-space-md);position:relative;padding:var(--byd-space-md);background-color:var(--byd-surface-default);color:var(--byd-text-primary);font-size:var(--byd-font-body-md-default-size);line-height:var(--byd-font-body-md-default-line);font-weight:var(--byd-font-body-md-default-weight)}.card.hover:hover{cursor:pointer;background-color:var(--byd-surface-hover-secondary)}.card.full-height{height:calc(100% - var(--byd-space-md) * 2)}.card.highlight{background-color:var(--byd-surface-hover-secondary);border-color:1px solid var(--byd-border-secondary)}.card.card-shadow{box-shadow:var(--byd-shadow-black-md)}.card .responsive-content{display:flex;flex-direction:column}:host-context(.card-force-mobile) .card .responsive-content{display:flex;flex-direction:column}:host-context(.card-force-mobile) .card .responsive-content .img-container{order:0}\n"] }]
        }], ctorParameters: () => [], propDecorators: { highlight: [{
                type: Input
            }], shadow: [{
                type: Input
            }], fullHeight: [{
                type: Input
            }], noContent: [{
                type: Input
            }], isNew: [{
                type: Input
            }], click: [{
                type: Output
            }] } });

class CardContentComponent {
    constructor() { }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: CardContentComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: CardContentComponent, isStandalone: true, selector: "byd-card-content", ngImport: i0, template: "<div class=\"card-content flex-full\">\n  <ng-content></ng-content>\n</div>\n", styles: [".card-content{padding:var(--byd-space-xs) 0}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: CardContentComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-card-content', standalone: true, imports: [], template: "<div class=\"card-content flex-full\">\n  <ng-content></ng-content>\n</div>\n", styles: [".card-content{padding:var(--byd-space-xs) 0}\n"] }]
        }], ctorParameters: () => [] });

class CardCtaComponent {
    constructor() { }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: CardCtaComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: CardCtaComponent, isStandalone: true, selector: "byd-card-cta", ngImport: i0, template: "<div class=\"cta\">\n  <ng-content></ng-content>\n</div>\n", styles: [".cta{border-top:1px solid var(--byd-neutral-main);padding-top:var(--byd-space-md)}:host-context(.no-card-border) .cta{border-width:0px}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: CardCtaComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-card-cta', standalone: true, imports: [], template: "<div class=\"cta\">\n  <ng-content></ng-content>\n</div>\n", styles: [".cta{border-top:1px solid var(--byd-neutral-main);padding-top:var(--byd-space-md)}:host-context(.no-card-border) .cta{border-width:0px}\n"] }]
        }], ctorParameters: () => [] });

class CardImageComponent {
    src = '';
    constructor() { }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: CardImageComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: CardImageComponent, isStandalone: true, selector: "byd-card-image", inputs: { src: "src" }, ngImport: i0, template: "<div class=\"img-container\">\n    <img [src]=\"this.src\" class=\"img\" />\n</div>\n", styles: [".img-container{aspect-ratio:16/9;overflow:hidden;border-radius:var(--byd-radius-rounded)}.img-container .img{width:100%}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: CardImageComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-card-image', standalone: true, imports: [], template: "<div class=\"img-container\">\n    <img [src]=\"this.src\" class=\"img\" />\n</div>\n", styles: [".img-container{aspect-ratio:16/9;overflow:hidden;border-radius:var(--byd-radius-rounded)}.img-container .img{width:100%}\n"] }]
        }], ctorParameters: () => [], propDecorators: { src: [{
                type: Input
            }] } });

class CardHeaderComponent {
    constructor() { }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: CardHeaderComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: CardHeaderComponent, isStandalone: true, selector: "byd-card-header", ngImport: i0, template: "<div class=\"header\">\n  <div class=\"header-tag\">\n    <ng-content select=\"byd-card-tag\"></ng-content>\n  </div>\n  <div class=\"header-title\">\n    <div class=\"title\">\n      <ng-content select=\"byd-card-title\"></ng-content>\n    </div>\n    <div class=\"subtitle\">\n      <ng-content select=\"byd-card-subtitle\"></ng-content>\n    </div>\n  </div>\n</div>\n", styles: [".header-tag{margin-bottom:var(--byd-space-md)}.header-title{border-bottom:1px solid var(--byd-neutral-main);padding-bottom:var(--byd-space-xs)}.header-title :host-context(.no-card-border){border-width:0px}.header-title .title{font-size:var(--byd-font-body-md-default-size);line-height:var(--byd-font-body-md-default-line);font-weight:var(--byd-font-body-md-bold-weight)}.header-title .subtitle{font-size:var(--byd-font-body-xs-default-size);line-height:var(--byd-font-body-xs-default-line);font-weight:var(--byd-font-body-xs-default-weight)}:host-context(.no-card-border) .header-title{border-width:0px}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: CardHeaderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-card-header', standalone: true, imports: [], template: "<div class=\"header\">\n  <div class=\"header-tag\">\n    <ng-content select=\"byd-card-tag\"></ng-content>\n  </div>\n  <div class=\"header-title\">\n    <div class=\"title\">\n      <ng-content select=\"byd-card-title\"></ng-content>\n    </div>\n    <div class=\"subtitle\">\n      <ng-content select=\"byd-card-subtitle\"></ng-content>\n    </div>\n  </div>\n</div>\n", styles: [".header-tag{margin-bottom:var(--byd-space-md)}.header-title{border-bottom:1px solid var(--byd-neutral-main);padding-bottom:var(--byd-space-xs)}.header-title :host-context(.no-card-border){border-width:0px}.header-title .title{font-size:var(--byd-font-body-md-default-size);line-height:var(--byd-font-body-md-default-line);font-weight:var(--byd-font-body-md-bold-weight)}.header-title .subtitle{font-size:var(--byd-font-body-xs-default-size);line-height:var(--byd-font-body-xs-default-line);font-weight:var(--byd-font-body-xs-default-weight)}:host-context(.no-card-border) .header-title{border-width:0px}\n"] }]
        }], ctorParameters: () => [] });

class CardSubtitleComponent {
    constructor() { }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: CardSubtitleComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: CardSubtitleComponent, isStandalone: true, selector: "byd-card-subtitle", ngImport: i0, template: "<ng-content></ng-content>\n", styles: [""] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: CardSubtitleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-card-subtitle', standalone: true, imports: [], template: "<ng-content></ng-content>\n" }]
        }], ctorParameters: () => [] });

class CardBydgComponent {
    constructor() { }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: CardBydgComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: CardBydgComponent, isStandalone: true, selector: "byd-card-tag", ngImport: i0, template: "<ng-content></ng-content>\n", styles: [""] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: CardBydgComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-card-tag', standalone: true, imports: [], template: "<ng-content></ng-content>\n" }]
        }], ctorParameters: () => [] });

class CardTitleComponent {
    constructor() { }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: CardTitleComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: CardTitleComponent, isStandalone: true, selector: "byd-card-title", ngImport: i0, template: "<ng-content></ng-content>\n", styles: [""] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: CardTitleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-card-title', standalone: true, imports: [], template: "<ng-content></ng-content>\n" }]
        }], ctorParameters: () => [] });

class LayoutContentComponent {
    autoHeight = false;
    constructor() { }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LayoutContentComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: LayoutContentComponent, isStandalone: true, selector: "byd-layout-content", inputs: { autoHeight: "autoHeight" }, ngImport: i0, template: "<div class=\"layout-content\" [class.auto]=\"this.autoHeight\">\n  <ng-content></ng-content>\n</div>\n", styles: [".layout-content{position:relative;margin:8px}.layout-content.auto{min-height:auto;margin:0}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LayoutContentComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-layout-content', standalone: true, imports: [], template: "<div class=\"layout-content\" [class.auto]=\"this.autoHeight\">\n  <ng-content></ng-content>\n</div>\n", styles: [".layout-content{position:relative;margin:8px}.layout-content.auto{min-height:auto;margin:0}\n"] }]
        }], ctorParameters: () => [], propDecorators: { autoHeight: [{
                type: Input
            }] } });

class LayoutTitleComponent {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LayoutTitleComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: LayoutTitleComponent, isStandalone: true, selector: "byd-layout-title", ngImport: i0, template: "<div class=\"title\">\n  <ng-content></ng-content>\n</div>\n", styles: [".title{padding:0 var(--byd-space-sm)}\n"] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LayoutTitleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-layout-title', standalone: true, imports: [], template: "<div class=\"title\">\n  <ng-content></ng-content>\n</div>\n", styles: [".title{padding:0 var(--byd-space-sm)}\n"] }]
        }] });

class LayoutHeaderComponent {
    constructor() { }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LayoutHeaderComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: LayoutHeaderComponent, isStandalone: true, selector: "byd--layout-header", ngImport: i0, template: "<div class=\"header\">\n  <ng-content></ng-content>\n</div>\n", styles: [""] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LayoutHeaderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd--layout-header', standalone: true, imports: [], template: "<div class=\"header\">\n  <ng-content></ng-content>\n</div>\n" }]
        }], ctorParameters: () => [] });

class LayoutHeaderDefaultComponent extends BydBaseComponent {
    goToHome() {
        this._router.navigateByUrl('/');
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LayoutHeaderDefaultComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: LayoutHeaderDefaultComponent, isStandalone: true, selector: "byd-layout-header-default", usesInheritance: true, ngImport: i0, template: "<div\n  class=\"layout-header-default-container flex-start g-space-sm\"\n  (click)=\"this.goToHome()\"\n>\n  <div class=\"d-flex\">\n    <byd-logo></byd-logo>\n  </div>\n  <div class=\"flex-column\">\n    <byd-title> Notaire Denotte </byd-title>\n    <byd-title [level]=\"4\"> DocBuilder </byd-title>\n  </div>\n</div>\n", styles: [".layout-header-default-container{color:var(--byd-text-invert-primary);background-color:var(--byd-surface-brand-primary);padding:var(--byd-space-sm)}\n"], dependencies: [{ kind: "component", type: TitleComponent, selector: "byd-title", inputs: ["level", "isTheme", "isBold"] }, { kind: "component", type: LogoComponent, selector: "byd-logo", inputs: ["type"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LayoutHeaderDefaultComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-layout-header-default', standalone: true, imports: [TitleComponent, LogoComponent], template: "<div\n  class=\"layout-header-default-container flex-start g-space-sm\"\n  (click)=\"this.goToHome()\"\n>\n  <div class=\"d-flex\">\n    <byd-logo></byd-logo>\n  </div>\n  <div class=\"flex-column\">\n    <byd-title> Notaire Denotte </byd-title>\n    <byd-title [level]=\"4\"> DocBuilder </byd-title>\n  </div>\n</div>\n", styles: [".layout-header-default-container{color:var(--byd-text-invert-primary);background-color:var(--byd-surface-brand-primary);padding:var(--byd-space-sm)}\n"] }]
        }] });

class LayoutNavComponent {
    constructor() { }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LayoutNavComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: LayoutNavComponent, isStandalone: true, selector: "byd-layout-nav", ngImport: i0, template: "<ng-content></ng-content>\n", styles: [""] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LayoutNavComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-layout-nav', standalone: true, imports: [], template: "<ng-content></ng-content>\n" }]
        }], ctorParameters: () => [] });

class LayoutWithNavComponent extends BydBaseComponent {
    type;
    constructor() {
        super();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LayoutWithNavComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: LayoutWithNavComponent, isStandalone: true, selector: "byd-layout-with-nav", inputs: { type: "type" }, usesInheritance: true, ngImport: i0, template: "<div class=\"layout-container\">\n  <div class=\"layout-content-container\" #bottomLayoutContainer>\n    <div class=\"container\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n  <div class=\"nav-container\" #bottomNavContainer>\n    <ng-content select=\"byd-layout-nav\"></ng-content>\n  </div>\n</div>\n", styles: [""] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LayoutWithNavComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-layout-with-nav', standalone: true, imports: [], template: "<div class=\"layout-container\">\n  <div class=\"layout-content-container\" #bottomLayoutContainer>\n    <div class=\"container\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n  <div class=\"nav-container\" #bottomNavContainer>\n    <ng-content select=\"byd-layout-nav\"></ng-content>\n  </div>\n</div>\n" }]
        }], ctorParameters: () => [], propDecorators: { type: [{
                type: Input
            }] } });

class LayoutPageComponent {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LayoutPageComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: LayoutPageComponent, isStandalone: true, selector: "byd-layout-page", ngImport: i0, template: "<byd-layout-with-nav>\n  <div class=\"layout-page-header\">\n    <ng-content select=\"byd-layout-header\"></ng-content>\n  </div>\n  <div class=\"layout-page-title\">\n    <ng-content select=\"byd-layout-title\"></ng-content>\n  </div>\n  <div class=\"layout-page-content\">\n    <ng-content></ng-content>\n  </div>\n  <byd-layout-nav>\n    <ng-content select=\"byd-layout-nav\"></ng-content>\n  </byd-layout-nav>\n</byd-layout-with-nav>\n", styles: [".layout-page-title,.layout-page-content{padding:var(--byd-space-sm)}\n"], dependencies: [{ kind: "component", type: LayoutWithNavComponent, selector: "byd-layout-with-nav", inputs: ["type"] }, { kind: "component", type: LayoutNavComponent, selector: "byd-layout-nav" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LayoutPageComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-layout-page', standalone: true, imports: [LayoutWithNavComponent, LayoutNavComponent], template: "<byd-layout-with-nav>\n  <div class=\"layout-page-header\">\n    <ng-content select=\"byd-layout-header\"></ng-content>\n  </div>\n  <div class=\"layout-page-title\">\n    <ng-content select=\"byd-layout-title\"></ng-content>\n  </div>\n  <div class=\"layout-page-content\">\n    <ng-content></ng-content>\n  </div>\n  <byd-layout-nav>\n    <ng-content select=\"byd-layout-nav\"></ng-content>\n  </byd-layout-nav>\n</byd-layout-with-nav>\n", styles: [".layout-page-title,.layout-page-content{padding:var(--byd-space-sm)}\n"] }]
        }] });

/*
 * Public API Surface of ui
 */

/**
 * Generated bundle index. Do not edit.
 */

export { BydButtonComponent, BydTextComponent, CardBydgComponent, CardComponent, CardContentComponent, CardCtaComponent, CardHeaderComponent, CardImageComponent, CardSubtitleComponent, CardTitleComponent, EToast, EmptyComponent, ErrorComponent, LayoutContentComponent, LayoutHeaderComponent, LayoutHeaderDefaultComponent, LayoutNavComponent, LayoutPageComponent, LayoutTitleComponent, LayoutWithNavComponent, LoaderComponent, LogoComponent, PictureInfoMessageComponent, SwiperLightComponent, TitleComponent, ToastComponent, TypedMessageComponent };
//# sourceMappingURL=beyond-ui.mjs.map
