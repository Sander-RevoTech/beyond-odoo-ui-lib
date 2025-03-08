/**
 * Must be used after ngAfterViewInit
 */
export declare class HorizontalScroll {
    private _startX;
    private _scrollLeft;
    private _isDown;
    private readonly _elementRef;
    constructor(element: HTMLElement);
    mouseDown: (event: MouseEvent) => void;
    mouseLeft: () => void;
    mouseMove: (event: MouseEvent) => void;
}
