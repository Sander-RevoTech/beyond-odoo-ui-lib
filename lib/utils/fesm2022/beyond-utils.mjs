import * as i0 from '@angular/core';
import { HostListener, Input, Directive, Pipe, EventEmitter, Output, inject, signal, Component, InjectionToken } from '@angular/core';
import * as i1 from '@angular/platform-browser';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { differenceInMinutes } from 'date-fns';
import { Camera, CameraResultType } from '@capacitor/camera';
import Compressor from 'compressorjs';

class StopPropagationDirective {
    stopPropagationActivation = true;
    onClick(event) {
        if (event && this.stopPropagationActivation) {
            event.stopPropagation();
            event.preventDefault();
        }
        return false;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: StopPropagationDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "19.2.1", type: StopPropagationDirective, isStandalone: true, selector: "[appStopPropagation]", inputs: { stopPropagationActivation: "stopPropagationActivation" }, host: { listeners: { "click": "onClick($event)" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: StopPropagationDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[appStopPropagation]',
                    standalone: true,
                }]
        }], propDecorators: { stopPropagationActivation: [{
                type: Input
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

// import { differenceInCalendarDays } from 'date-fns';
// import { BydTranslationService } from '@beyond/translation';
class TimeAgoDirective {
    // protected _translationService = inject(BydTranslationService);
    transform(date) {
        // const diffDays = differenceInCalendarDays(new Date(date), new Date());
        // const key = this._getTranslationKey(diffDays);
        return date;
        // return this._translationService.get(key, {
        //   date: formatDate(date, 'mediumDate', this._translationService.getLanguage()),
        //   days: Math.abs(diffDays),
        // });
    }
    _getTranslationKey(diffDays) {
        if (diffDays === 0) {
            return 'common.today';
        }
        if (diffDays === -1) {
            return 'common.yesterday';
        }
        if (diffDays === 1) {
            return 'common.tomorrow';
        }
        if (diffDays < -1 && diffDays >= -3) {
            return 'common.above';
        }
        if (diffDays > 1 && diffDays <= 3) {
            return 'common.ahead';
        }
        return 'common.to-date';
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TimeAgoDirective, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
    static ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "19.2.1", ngImport: i0, type: TimeAgoDirective, isStandalone: true, name: "appTimeAgo" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TimeAgoDirective, decorators: [{
            type: Pipe,
            args: [{ name: 'appTimeAgo' }]
        }] });

class TypedTemplateDirective {
    contentTemplate;
    typedTemplate;
    // @ts-ignore
    constructor(contentTemplate) {
        this.contentTemplate = contentTemplate;
    }
    static ngTemplateContextGuard(dir, ctx) {
        return true;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TypedTemplateDirective, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "19.2.1", type: TypedTemplateDirective, isStandalone: true, selector: "ng-template[typedTemplate]", inputs: { typedTemplate: "typedTemplate" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TypedTemplateDirective, decorators: [{
            type: Directive,
            args: [{ selector: 'ng-template[typedTemplate]', standalone: true }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }], propDecorators: { typedTemplate: [{
                type: Input
            }] } });

class LetDirective {
    _viewContainer;
    _templateRef;
    _context = { ngLet: null, $implicit: null };
    _hasView = false;
    constructor(_viewContainer, _templateRef) {
        this._viewContainer = _viewContainer;
        this._templateRef = _templateRef;
    }
    set ngLet(value) {
        this._context.$implicit = this._context.ngLet = value;
        if (!this._hasView) {
            this._viewContainer.createEmbeddedView(this._templateRef, this._context);
            this._hasView = true;
        }
    }
    /** @internal */
    static ngLetUseIfTypeGuard;
    /**
     * Assert the correct type of the expression bound to the `NgLet` input within the template.
     *
     * The presence of this static field is a signal to the Ivy template type check compiler that
     * when the `NgLet` structural directive renders its template, the type of the expression bound
     * to `NgLet` should be narrowed in some way. For `NgLet`, the binding expression itself is used to
     * narrow its type, which allows the strictNullChecks feature of TypeScript to work with `NgLet`.
     */
    static ngTemplateGuard_ngLet;
    /**
     * Asserts the correct type of the context for the template that `NgLet` will render.
     *
     * The presence of this method is a signal to the Ivy template type-check compiler that the
     * `NgLet` structural directive renders its template with a specific context type.
     */
    static ngTemplateContextGuard(dir, ctx) {
        return true;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LetDirective, deps: [{ token: i0.ViewContainerRef }, { token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "19.2.1", type: LetDirective, isStandalone: true, selector: "[ngLet]", inputs: { ngLet: "ngLet" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LetDirective, decorators: [{
            type: Directive,
            args: [{
                    // eslint-disable-next-line @angular-eslint/directive-selector
                    selector: '[ngLet]',
                }]
        }], ctorParameters: () => [{ type: i0.ViewContainerRef }, { type: i0.TemplateRef }], propDecorators: { ngLet: [{
                type: Input
            }] } });

class OnRenderDirective {
    onRender;
    rendered = new EventEmitter();
    ngOnChanges(changes) {
        if (changes['onRender'].previousValue !== changes['onRender'].currentValue) {
            this.rendered.emit();
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: OnRenderDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "19.2.1", type: OnRenderDirective, isStandalone: true, selector: "[taOnRender]", inputs: { onRender: "onRender" }, outputs: { rendered: "rendered" }, usesOnChanges: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: OnRenderDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[taOnRender]',
                }]
        }], propDecorators: { onRender: [{
                type: Input
            }], rendered: [{
                type: Output
            }] } });

const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const FILE_SIZE_UNITS_LONG = [
    'Bytes',
    'Kilobytes',
    'Megabytes',
    'Gigabytes',
    'Pettabytes',
    'Exabytes',
    'Zettabytes',
    'Yottabytes',
];
class FileSizePipe {
    transform(sizeInBytes, longForm = false) {
        if (sizeInBytes === null) {
            return '';
        }
        const units = longForm ? FILE_SIZE_UNITS_LONG : FILE_SIZE_UNITS;
        let power = Math.round(Math.log(sizeInBytes) / Math.log(1024));
        power = Math.min(power, units.length - 1);
        const size = sizeInBytes / Math.pow(1024, power);
        const formattedSize = Math.round(size * 100) / 100;
        const unit = units[power];
        return `${formattedSize} ${unit}`;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: FileSizePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
    static ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "19.2.1", ngImport: i0, type: FileSizePipe, isStandalone: true, name: "fileSize" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: FileSizePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'fileSize',
                }]
        }] });

class JoinPipe {
    transform(input, sep = ', ') {
        return input.join(sep);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: JoinPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
    static ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "19.2.1", ngImport: i0, type: JoinPipe, isStandalone: true, name: "join" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: JoinPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'join',
                }]
        }] });

class PluralTranslatePipe {
    transform(key, number) {
        return `${key}.${number == 0 || number == 1 ? 'one' : 'plural'}`;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: PluralTranslatePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
    static ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "19.2.1", ngImport: i0, type: PluralTranslatePipe, isStandalone: true, name: "pluralTranslate", pure: false });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: PluralTranslatePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'pluralTranslate',
                    pure: false,
                    standalone: true,
                }]
        }] });

class SafePipe {
    sanitizer;
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
    }
    transform(value, type) {
        switch (type) {
            case 'html':
                return this.sanitizer.bypassSecurityTrustHtml(value);
            case 'style':
                return this.sanitizer.bypassSecurityTrustStyle(value);
            case 'script':
                return this.sanitizer.bypassSecurityTrustScript(value);
            case 'url':
                return this.sanitizer.bypassSecurityTrustUrl(value);
            case 'resourceUrl':
                return this.sanitizer.bypassSecurityTrustResourceUrl(value);
            default:
                throw new Error(`Invalid safe type specified: ${type}`);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: SafePipe, deps: [{ token: i1.DomSanitizer }], target: i0.ɵɵFactoryTarget.Pipe });
    static ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "19.2.1", ngImport: i0, type: SafePipe, isStandalone: true, name: "safe" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: SafePipe, decorators: [{
            type: Pipe,
            args: [{ name: 'safe' }]
        }], ctorParameters: () => [{ type: i1.DomSanitizer }] });

var EFileExtension;
(function (EFileExtension) {
    EFileExtension[EFileExtension["Unknown"] = 0] = "Unknown";
    EFileExtension[EFileExtension["PDF"] = 1] = "PDF";
    EFileExtension[EFileExtension["Excel"] = 2] = "Excel";
    EFileExtension[EFileExtension["Word"] = 3] = "Word";
    EFileExtension[EFileExtension["Image"] = 4] = "Image";
})(EFileExtension || (EFileExtension = {}));

class TemporaryFile {
    files = [];
    constructor() { }
    addFiles(files) {
        const fileData = this._convertToFileData(files);
        this.files = this.files.concat(fileData);
    }
    removeFiles(files) {
        const urls = files.map(file => file.localUrl);
        this.files = this.files.filter(file => !urls.includes(file.url));
    }
    removeAll() {
        this.files = [];
    }
    _convertToFileData(files) {
        return files.map((file, index) => ({
            isLoading: true,
            id: index,
            type: 'Image',
            url: file.localUrl || '',
        }));
    }
}

var Civility;
(function (Civility) {
    Civility[Civility["Unknown"] = 0] = "Unknown";
    Civility[Civility["Sir"] = 1] = "Sir";
    Civility[Civility["Madame"] = 2] = "Madame";
    Civility[Civility["Dear"] = 3] = "Dear";
})(Civility || (Civility = {}));

const breakpoint_xxl = 1400;
const breakpoint_xl = 1200;
const breakpoint_lg = 992;
const breakpoint_md = 768;
const breakpoint_sm = 576;
const breakpoint_xs = 0;
const Breakpoints = {
    XSmall: `(min-width: ${breakpoint_xs}px) and (max-width: ${breakpoint_sm - 1}px)`,
    Small: `(min-width: ${breakpoint_sm}px) and (max-width: ${breakpoint_md - 1}px)`,
    Medium: `(min-width: ${breakpoint_md}px) and (max-width: ${breakpoint_lg - 1}px)`,
    Large: `(min-width: ${breakpoint_lg}px) and (max-width: ${breakpoint_xl - 1}px)`,
    XLarge: `(min-width: ${breakpoint_xl}px) and (max-width: ${breakpoint_xxl - 1}px)`,
    XXLarge: `(min-width: ${breakpoint_xxl}px)`,
    Handset: `(max-width: ${breakpoint_sm - 1}px) and (orientation: portrait), ` +
        `(max-width: ${breakpoint_md - 1}px) and (orientation: landscape)`,
    Tablet: `(min-width: ${breakpoint_sm}px) and (max-width: 839.98px) and (orientation: portrait), ` +
        `(min-width: ${breakpoint_md}px) and (max-width: ${breakpoint_lg - 1}px) and (orientation: landscape)`,
    Web: `(min-width: 840px) and (orientation: portrait), ` + `(min-width: ${breakpoint_lg}px) and (orientation: landscape)`,
    HandsetPortrait: `(max-width: ${breakpoint_sm - 1}px) and (orientation: portrait)`,
    TabletPortrait: `(min-width: ${breakpoint_sm}px) and (max-width: 839.98px) and (orientation: portrait)`,
    WebPortrait: `(min-width: 840px) and (orientation: portrait)`,
    HandsetLandscape: `(max-width: ${breakpoint_md - 1}px) and (orientation: landscape)`,
    TabletLandscape: `(min-width: ${breakpoint_md}px) and (max-width: ${breakpoint_lg - 1}px) and (orientation: landscape)`,
    WebLandscape: `(min-width: ${breakpoint_lg}px) and (orientation: landscape)`,
};
class BreakpointDetection {
    breakpointObserver = inject(BreakpointObserver);
    platform = inject(Platform);
    isLessThanXS = this._isMatched([Breakpoints.XSmall]);
    isLessThanSM = this._isMatched([Breakpoints.XSmall, Breakpoints.Small]);
    isLessThanMD = this._isMatched([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium]);
    isLessThanLG = this._isMatched([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large]);
    isMoreThanXS = !this._isMatched([Breakpoints.XSmall]);
    isMoreThanSM = !this._isMatched([Breakpoints.XSmall, Breakpoints.Small]);
    isMoreThanMD = !this._isMatched([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium]);
    isMoreThanLG = !this._isMatched([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
    ]);
    isLessThanXS$ = this._isMatched$([Breakpoints.XSmall]);
    isLessThanSM$ = this._isMatched$([Breakpoints.XSmall, Breakpoints.Small]);
    isLessThanMD$ = this._isMatched$([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium]);
    isLessThanLG$ = this._isMatched$([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
    ]);
    isMoreThanXS$ = this._isMatched$([Breakpoints.XSmall]).pipe(map(value => !value));
    isMoreThanSM$ = this._isMatched$([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(value => !value));
    isMoreThanMD$ = this._isMatched$([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium]).pipe(map(value => !value));
    isMoreThanLG$ = this._isMatched$([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
    ]).pipe(map(value => !value));
    isMobile = this.isLessThanXS;
    isMobile$ = this.isLessThanXS$;
    isTablette = this.isLessThanMD;
    isTablette$ = this.isLessThanMD$;
    isDesktop = this.isMoreThanLG;
    isDesktop$ = this.isMoreThanLG$;
    isMobileDevice$ = new BehaviorSubject(this.platform.ANDROID || this.platform.IOS);
    isDesktopDevice$ = this.isMobileDevice$.pipe(map(value => !value));
    constructor() { }
    _isMatched$(values) {
        return this.breakpointObserver.observe(values).pipe(map((state) => state.matches));
    }
    _isMatched(values) {
        return this.breakpointObserver.isMatched(values);
    }
}

class RequestState {
    loading = signal(false);
    error = { status: -1, message: '' };
    alreadyAsked = false;
    isLoading() {
        return this.loading();
    }
    getErrorStatus() {
        return this.error.status;
    }
    getErrorMessage() {
        return this.error.message;
    }
    clean() {
        this.alreadyAsked = false;
        this.loading.set(false);
        this.resetError();
    }
    asked() {
        this.alreadyAsked = true;
        this.loading.set(true);
        this.resetError();
    }
    completed() {
        this.loading.set(false);
    }
    resetError() {
        this.error = { status: -1, message: '' };
    }
    onError(status, message) {
        this.loading.set(false);
        this.error = { status, message };
    }
}

class SubscriberHandler {
    _subscriptionList = [];
    constructor() { }
    destroy() {
        this._subscriptionList.forEach(subscription => subscription.unsubscribe());
    }
    registerSubscription(subscription) {
        this._subscriptionList.push(subscription);
    }
}

class BydAbstractComponent {
    breakpoints = new BreakpointDetection();
    requestState = new RequestState();
    get isMobile() {
        return this.breakpoints.isMobile;
    }
    get isDesktop() {
        return this.breakpoints.isDesktop;
    }
    get isMobileDevice$() {
        return this.breakpoints.isMobileDevice$;
    }
    get isDesktopDevice$() {
        return this.breakpoints.isDesktopDevice$;
    }
    _subscriberHandler = new SubscriberHandler();
    /* Routing */
    _route = inject(ActivatedRoute);
    _router = inject(Router);
    _location = inject(Location);
    constructor() { }
    ngOnDestroy() {
        this._subscriberHandler.destroy();
    }
    _getSnapshotQueryParams(key) {
        return this._route.snapshot.queryParams[key] ?? null;
    }
    _registerSubscription(subscription) {
        this._subscriberHandler.registerSubscription(subscription);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydAbstractComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: BydAbstractComponent, isStandalone: true, selector: "ng-component", ngImport: i0, template: '', isInline: true });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydAbstractComponent, decorators: [{
            type: Component,
            args: [{ template: '' }]
        }], ctorParameters: () => [] });

class BydBaseComponent extends BydAbstractComponent {
    constructor() {
        super();
    }
    trackById(_, item) {
        return item.id;
    }
    trackByKey(_, item) {
        return item.key;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydBaseComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: BydBaseComponent, isStandalone: true, selector: "ng-component", usesInheritance: true, ngImport: i0, template: '', isInline: true });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydBaseComponent, decorators: [{
            type: Component,
            args: [{ template: '' }]
        }], ctorParameters: () => [] });

/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 * @param init object - Initial Object
 * @param {...object} objects - Objects to merge
 * @returns {object} New object with merged key/values
 */
const merge = (override = true) => (init, ...objects) => {
    // RecursivePartial<T>
    const isObject = (obj) => obj && typeof obj === 'object';
    return objects.reduce((prev, obj) => {
        Object.keys(obj).forEach(key => {
            const pVal = prev[key];
            const oVal = obj[key];
            if (Array.isArray(pVal) && Array.isArray(oVal)) {
                prev[key] = pVal.concat(...oVal);
            }
            else if (isObject(pVal) && isObject(oVal)) {
                prev[key] = merge(override)(pVal, oVal);
            }
            else {
                if (!pVal || (pVal && override)) {
                    prev[key] = oVal;
                }
            }
        });
        return prev;
    }, init);
};
const getPropertyTypes = (obj) => {
    const propertyTypes = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            propertyTypes[key] = typeof obj[key];
        }
    }
    return propertyTypes;
};
const ObjectKeys = (object) => (object instanceof Object ? Object.keys(object) : []);
const ObjectKeysReOrder = (base, keysOrder) => {
    return keysOrder.reduce((final, key) => {
        if (base.hasOwnProperty(key)) {
            final[key] = base[key];
        }
        return final;
    }, {});
};

class BydBasePage extends BydAbstractComponent {
    constructor() {
        super();
    }
    _getPathParams(data) {
        return this._filterParams(this._route.params, getPropertyTypes(data));
    }
    _getQueryParams(data) {
        return this._filterParams(this._route.queryParams, getPropertyTypes(data));
    }
    _filterParams(routeParams, paramsAsked) {
        return routeParams.pipe(map(params => convertToParamMap(params)), map(params => this._getParamsTyped(paramsAsked, params)), distinctUntilChanged());
    }
    _getParamsTyped(paramsAsked, params) {
        let paramObject = {};
        for (let param in paramsAsked) {
            const value = params.get(param);
            if (value)
                paramObject[param] = paramsAsked[param] === 'number' ? Number(value) : value;
        }
        return paramObject;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydBasePage, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: BydBasePage, isStandalone: true, selector: "ng-component", usesInheritance: true, ngImport: i0, template: '', isInline: true });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydBasePage, decorators: [{
            type: Component,
            args: [{ template: '' }]
        }], ctorParameters: () => [] });

class BydBaseModal extends BydAbstractComponent {
    constructor() {
        super();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydBaseModal, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: BydBaseModal, isStandalone: true, selector: "ng-component", usesInheritance: true, ngImport: i0, template: '', isInline: true });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydBaseModal, decorators: [{
            type: Component,
            args: [{ template: '' }]
        }], ctorParameters: () => [] });

const getUniqueValues = (inputArray, propName) => {
    return [...new Map(inputArray.map(x => [propName(x), x])).values()];
};
const getUniqueArray = (array) => {
    return [...new Set(array)].filter(isNonNullable);
};
const getFirstString = (array) => {
    return array ? array.find(data => typeof data === 'string') || null : null;
};
const getFirstNumber = (array) => {
    return array ? array.find(data => typeof data === 'number') || null : null;
};
const isNonNullable = (value) => {
    return value !== null && value !== undefined;
};
const toArray = (value) => {
    return Array.isArray(value) ? value : [value];
};
const keepUniqueObjectByProperty = (list, property) => {
    const unique = getUniqueArray(list.map(property));
    return unique.map(u => list.find(item => property(item) === u)).filter(isNonNullable);
};
/**
 * @deprecated
 */
const removeElementsWithSameProperty = (arrayA, arrayB, property) => {
    const idsToDelete = arrayB.map(property);
    return arrayA.filter(item => !idsToDelete.includes(property(item)));
};
/**
 * @deprecated
 */
const removeElement = (array, elementToRemove) => {
    let indexOfElement = array.indexOf(elementToRemove);
    if (indexOfElement > -1)
        array.splice(indexOfElement, 1);
    return array;
};

const isLight = (color) => {
    const hex = color.replace('#', '');
    const c_r = parseInt(hex.substring(0, 0 + 2), 16);
    const c_g = parseInt(hex.substring(2, 2 + 2), 16);
    const c_b = parseInt(hex.substring(4, 4 + 2), 16);
    const brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000;
    return brightness > 155;
};

const compare = (a, b, isAsc) => {
    let compare = 0;
    if (!a) {
        compare = 1;
    }
    else if (!b) {
        compare = -1;
    }
    else {
        compare = a < b ? -1 : 1;
    }
    return compare * (isAsc ? 1 : -1);
};
const compareHour = (a, b, isAsc) => {
    if (a.getHours() === b.getHours()) {
        if (a.getMinutes() === b.getMinutes()) {
            if (a.getSeconds() === b.getSeconds()) {
                return 0;
            }
            return (a.getSeconds() - b.getSeconds()) * (isAsc ? 1 : -1);
        }
        return (a.getMinutes() - b.getMinutes()) * (isAsc ? 1 : -1);
    }
    return (a.getHours() - b.getHours()) * (isAsc ? 1 : -1);
};

const toLocalDateString = (utcDateString) => {
    return toLocalDate(utcDateString).toString();
};
const toLocalDate = (utcDateString) => {
    const utcDate = new Date(utcDateString);
    return new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60 * 1000);
};
const toUtcDate = (localDateString) => {
    return new Date(localDateString.getTime() - localDateString.getTimezoneOffset() * 60 * 1000);
};
const diffInHourAndMinutes = (start, end) => {
    const diff = differenceInMinutes(new Date(end), new Date(start));
    const hours = Math.floor(diff / 60);
    const minutes = Math.round(diff - hours * 60);
    return { h: hours.toString().padStart(2, '0'), m: minutes.toString().padStart(2, '0') };
};

const extractEnum = (allEnum, backendOne = false) => {
    const keys = Object.keys(allEnum).filter(k => typeof allEnum[k] === 'number');
    return keys
        .map(key => {
        return { value: allEnum[key], name: key };
    })
        .filter(item => (backendOne ? item.value !== 0 : true));
};

const newGuid = () => {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};
const newId = () => {
    return Math.floor(Math.random() * 1000000 + 1);
};
const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};

const sendMail = (mail) => {
    window.open(`mailto:${mail}`);
};
const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

const openMap = (query) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`);
};

const createRange = (number) => {
    return new Array(number).fill(0).map((n, index) => index + 1);
};
const roundToDecimal = (number, precision) => {
    return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision);
};
const percentage = (partialValue, totalValue) => {
    return (100 * partialValue) / totalValue;
};

const call = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`);
};

const sort = (array, options) => {
    if (!options) {
        return array;
    }
    return array.sort((a, b) => {
        return compare(a[options.active], b[options.active], options.direction === 'asc');
    });
};

const getFileExtension = (filePath) => {
    const extension = getFullFileNameFromUrl(filePath)?.split('.').pop()?.toLowerCase() || null;
    switch (extension) {
        case 'pdf':
            return EFileExtension.PDF;
        case 'docx':
            return EFileExtension.Word;
        case 'xls':
        case 'xlsx':
            return EFileExtension.Excel;
        case 'jpg':
        case 'jpeg':
        case 'png':
            return EFileExtension.Image;
    }
    return EFileExtension.Unknown;
};
const getFullFileNameFromUrl = (url) => {
    return url.split('/').pop() || null;
};
const trigram = (name) => {
    if (!name) {
        return '';
    }
    if (name.length < 4) {
        return name;
    }
    return (name[0] + name[2] + name[3]).toUpperCase();
};
const capitalizeFirstLetter = (value) => {
    if (value.length === 0)
        return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
};
const convertToNumber = (values) => values?.map(value => Number(value)) || [];
const isURL = (str) => {
    // Expression régulière pour vérifier une URL
    const pattern = /^https?:\/\//; // Fragment d'URL
    return !!pattern.test(str);
};

const getBase64Image = (img) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg');
};
const getBase64FromFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
                resolve(reader.result.toString());
            }
            reject(null);
        };
        reader.readAsDataURL(file);
    });
};
const getBlobImage = async (base64) => {
    return await fetch(base64).then(res => res.blob());
};
const compressImage = async (blob) => {
    return new Promise((resolve, reject) => {
        new Compressor(blob, {
            quality: 0.1,
            success: (blob) => {
                resolve(blob);
            },
            error: (error) => {
                reject(error);
            },
        });
    });
};
const downloadFile = (url) => {
    window.open('https://docs.google.com/a/google.com/viewer?url=' + url + '&embedded=false');
};
const takeImage = async () => {
    const image = await Camera.getPhoto({
        quality: 30,
        allowEditing: true,
        saveToGallery: true,
        resultType: CameraResultType.Uri,
    });
    const file = {
        file: await pathToFile(image),
        localUrl: image.webPath || null,
    };
    if (!file.file) {
        return;
    }
    return file;
};
const picImages = async () => {
    const gallery = await Camera.pickImages({
        quality: 30,
    });
    const pics = [];
    for (let pic of gallery.photos) {
        const file = {
            file: await pathToFile(pic),
            localUrl: pic.webPath,
        };
        if (!file.file) {
            continue;
        }
        pics.push(file);
    }
    return pics;
};
const pathToFile = async (pic) => {
    if (!pic.webPath)
        return null;
    const response = await fetch(pic.webPath);
    const blob = await compressImage(await response.blob());
    return new File([blob], newGuid(), { type: pic.format });
};

const copyTextToClipboard = async (text, success, error) => {
    try {
        await navigator.clipboard.writeText(text);
        success('utils.clipboard.success');
    }
    catch (err) {
        error('utils.clipboard.error');
    }
};

/**
 * Must be used after ngAfterViewInit
 */
class HorizontalScroll {
    _startX;
    _scrollLeft;
    _isDown = false;
    _elementRef;
    constructor(element) {
        this._elementRef = element;
        this._elementRef.addEventListener('mousedown', this.mouseDown);
        this._elementRef.addEventListener('mousemove', this.mouseMove);
        this._elementRef.addEventListener('mouseleave', this.mouseLeft);
        this._elementRef.addEventListener('mouseup', this.mouseLeft);
    }
    mouseDown = (event) => {
        this._isDown = true;
        this._startX = event.pageX - this._elementRef.offsetLeft;
        this._scrollLeft = this._elementRef.scrollLeft;
    };
    mouseLeft = () => {
        this._isDown = false;
    };
    mouseMove = (event) => {
        if (!this._isDown)
            return;
        event.preventDefault();
        const horizontalOffset = event.pageX - this._elementRef.offsetLeft;
        const walk = horizontalOffset - this._startX;
        this._elementRef.scrollLeft = this._scrollLeft - walk;
    };
}

class HandleEntity {
    entity$ = null;
    constructor() { }
    set(subscriber) {
        this.entity$ = subscriber;
    }
    get$() {
        return this.entity$;
    }
}

const APPLICATION_CONFIG = new InjectionToken('config_application');

/*
 * Public API Surface of utils
 */

/**
 * Generated bundle index. Do not edit.
 */

export { APPLICATION_CONFIG, BydAbstractComponent, BydBaseComponent, BydBaseModal, BydBasePage, Civility, EFileExtension, FileSizePipe, HandleEntity, HorizontalScroll, JoinPipe, LetDirective, ObjectKeys, ObjectKeysReOrder, OnRenderDirective, PluralTranslatePipe, RequestState, SafePipe, StopPropagationDirective, SubscriberHandler, TemporaryFile, TimeAgoDirective, TypedTemplateDirective, call, capitalizeFirstLetter, compare, compareHour, compressImage, convertToNumber, copyTextToClipboard, createRange, diffInHourAndMinutes, downloadFile, extractEnum, getBase64FromFile, getBase64Image, getBlobImage, getFileExtension, getFirstNumber, getFirstString, getFullFileNameFromUrl, getPropertyTypes, getUniqueArray, getUniqueValues, isLight, isNonNullable, isURL, isValidEmail, keepUniqueObjectByProperty, merge, newGuid, newId, openMap, pathToFile, percentage, picImages, removeElement, removeElementsWithSameProperty, roundToDecimal, s4, sendMail, sort, takeImage, toArray, toLocalDate, toLocalDateString, toUtcDate, trigram };
//# sourceMappingURL=beyond-utils.mjs.map
