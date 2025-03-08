import { TemplateRef, ViewContainerRef } from '@angular/core';
import * as i0 from "@angular/core";
interface LetContext<T> {
    ngLet: T;
    $implicit: T;
}
export declare class LetDirective<T> {
    private _viewContainer;
    private _templateRef;
    private _context;
    private _hasView;
    constructor(_viewContainer: ViewContainerRef, _templateRef: TemplateRef<LetContext<T>>);
    set ngLet(value: T);
    /** @internal */
    static ngLetUseIfTypeGuard: void;
    /**
     * Assert the correct type of the expression bound to the `NgLet` input within the template.
     *
     * The presence of this static field is a signal to the Ivy template type check compiler that
     * when the `NgLet` structural directive renders its template, the type of the expression bound
     * to `NgLet` should be narrowed in some way. For `NgLet`, the binding expression itself is used to
     * narrow its type, which allows the strictNullChecks feature of TypeScript to work with `NgLet`.
     */
    static ngTemplateGuard_ngLet: 'binding';
    /**
     * Asserts the correct type of the context for the template that `NgLet` will render.
     *
     * The presence of this method is a signal to the Ivy template type-check compiler that the
     * `NgLet` structural directive renders its template with a specific context type.
     */
    static ngTemplateContextGuard<T>(dir: LetDirective<T>, ctx: any): ctx is LetContext<Exclude<T, false | 0 | '' | null | undefined>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<LetDirective<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<LetDirective<any>, "[ngLet]", never, { "ngLet": { "alias": "ngLet"; "required": false; }; }, {}, never, never, true, never>;
}
export {};
