import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface LetContext<T> {
  ngLet: T;
  $implicit: T;
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ngLet]',
})
export class LetDirective<T> {
  private _context: LetContext<T | null> = { ngLet: null, $implicit: null };

  private _hasView: boolean = false;

  constructor(
    private _viewContainer: ViewContainerRef,
    private _templateRef: TemplateRef<LetContext<T>>
  ) {}

  @Input()
  set ngLet(value: T) {
    this._context.$implicit = this._context.ngLet = value;
    if (!this._hasView) {
      this._viewContainer.createEmbeddedView(this._templateRef, this._context);
      this._hasView = true;
    }
  }

  /** @internal */
  public static ngLetUseIfTypeGuard: void;

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
  static ngTemplateContextGuard<T>(
    dir: LetDirective<T>,
    ctx: any
  ): ctx is LetContext<Exclude<T, false | 0 | '' | null | undefined>> {
    return true;
  }
}
