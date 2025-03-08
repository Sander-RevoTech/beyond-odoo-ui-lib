import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { inject } from '@angular/core';

import { map } from 'rxjs/operators';

const breakpoint_xxl = 1400;
const breakpoint_xl = 1200;
const breakpoint_lg = 992;
const breakpoint_md = 768;
const breakpoint_sm = 576;
const breakpoint_xs = 0;

export const Breakpoints = {
  XSmall: `(min-width: ${breakpoint_xs}px) and (max-width: ${breakpoint_sm - 1}px)`,
  Small: `(min-width: ${breakpoint_sm}px) and (max-width: ${breakpoint_md - 1}px)`,
  Medium: `(min-width: ${breakpoint_md}px) and (max-width: ${breakpoint_lg - 1}px)`,
  Large: `(min-width: ${breakpoint_lg}px) and (max-width: ${breakpoint_xl - 1}px)`,
  XLarge: `(min-width: ${breakpoint_xl}px) and (max-width: ${breakpoint_xxl - 1}px)`,
  XXLarge: `(min-width: ${breakpoint_xxl}px)`,
  Handset:
    `(max-width: ${breakpoint_sm - 1}px) and (orientation: portrait), ` +
    `(max-width: ${breakpoint_md - 1}px) and (orientation: landscape)`,
  Tablet:
    `(min-width: ${breakpoint_sm}px) and (max-width: 839.98px) and (orientation: portrait), ` +
    `(min-width: ${breakpoint_md}px) and (max-width: ${breakpoint_lg - 1}px) and (orientation: landscape)`,
  Web:
    `(min-width: 840px) and (orientation: portrait), ` + `(min-width: ${breakpoint_lg}px) and (orientation: landscape)`,
  HandsetPortrait: `(max-width: ${breakpoint_sm - 1}px) and (orientation: portrait)`,
  TabletPortrait: `(min-width: ${breakpoint_sm}px) and (max-width: 839.98px) and (orientation: portrait)`,
  WebPortrait: `(min-width: 840px) and (orientation: portrait)`,
  HandsetLandscape: `(max-width: ${breakpoint_md - 1}px) and (orientation: landscape)`,
  TabletLandscape: `(min-width: ${breakpoint_md}px) and (max-width: ${
    breakpoint_lg - 1
  }px) and (orientation: landscape)`,
  WebLandscape: `(min-width: ${breakpoint_lg}px) and (orientation: landscape)`,
};

export class BreakpointDetection {
  public breakpointObserver = inject(BreakpointObserver);

  public isLessThanXS = this._isMatched([Breakpoints.XSmall]);
  public isLessThanSM = this._isMatched([Breakpoints.XSmall, Breakpoints.Small]);
  public isLessThanMD = this._isMatched([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium]);
  public isLessThanLG = this._isMatched([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large]);

  public isMoreThanXS = !this._isMatched([Breakpoints.XSmall]);
  public isMoreThanSM = !this._isMatched([Breakpoints.XSmall, Breakpoints.Small]);
  public isMoreThanMD = !this._isMatched([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium]);
  public isMoreThanLG = !this._isMatched([
    Breakpoints.XSmall,
    Breakpoints.Small,
    Breakpoints.Medium,
    Breakpoints.Large,
  ]);

  public isLessThanXS$ = this._isMatched$([Breakpoints.XSmall]);
  public isLessThanSM$ = this._isMatched$([Breakpoints.XSmall, Breakpoints.Small]);
  public isLessThanMD$ = this._isMatched$([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium]);
  public isLessThanLG$ = this._isMatched$([
    Breakpoints.XSmall,
    Breakpoints.Small,
    Breakpoints.Medium,
    Breakpoints.Large,
  ]);

  public isMoreThanXS$ = this._isMatched$([Breakpoints.XSmall]).pipe(map(value => !value));
  public isMoreThanSM$ = this._isMatched$([Breakpoints.XSmall, Breakpoints.Small]).pipe(map(value => !value));
  public isMoreThanMD$ = this._isMatched$([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium]).pipe(
    map(value => !value)
  );
  public isMoreThanLG$ = this._isMatched$([
    Breakpoints.XSmall,
    Breakpoints.Small,
    Breakpoints.Medium,
    Breakpoints.Large,
  ]).pipe(map(value => !value));

  public isMobile = this.isLessThanXS;
  public isMobile$ = this.isLessThanXS$;

  public isTablette = this.isLessThanMD;
  public isTablette$ = this.isLessThanMD$;

  public isDesktop = this.isMoreThanLG;
  public isDesktop$ = this.isMoreThanLG$;

  constructor() {}

  private _isMatched$(values: string[]) {
    return this.breakpointObserver.observe(values).pipe(map((state: BreakpointState) => state.matches));
  }

  private _isMatched(values: string[]) {
    return this.breakpointObserver.isMatched(values);
  }
}
