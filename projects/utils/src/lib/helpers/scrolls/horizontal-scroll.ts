/**
 * Must be used after ngAfterViewInit
 */
export class HorizontalScroll {
  private _startX!: number;
  private _scrollLeft!: number;
  private _isDown = false;
  private readonly _elementRef: HTMLElement;

  constructor(element: HTMLElement) {
    this._elementRef = element;

    this._elementRef.addEventListener('mousedown', this.mouseDown);
    this._elementRef.addEventListener('mousemove', this.mouseMove);
    this._elementRef.addEventListener('mouseleave', this.mouseLeft);
    this._elementRef.addEventListener('mouseup', this.mouseLeft);
  }

  public mouseDown = (event: MouseEvent) => {
    this._isDown = true;
    this._startX = event.pageX - this._elementRef.offsetLeft;
    this._scrollLeft = this._elementRef.scrollLeft;
  };

  public mouseLeft = () => {
    this._isDown = false;
  };

  public mouseMove = (event: MouseEvent) => {
    if (!this._isDown) return;

    event.preventDefault();
    const horizontalOffset = event.pageX - this._elementRef.offsetLeft;
    const walk = horizontalOffset - this._startX;
    this._elementRef.scrollLeft = this._scrollLeft - walk;
  };
}
