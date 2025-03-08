import { Directive, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[taOnRender]',
})
export class OnRenderDirective {
  @Input() onRender!: boolean;

  @Output() rendered = new EventEmitter();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['onRender'].previousValue !== changes['onRender'].currentValue) {
      this.rendered.emit();
    }
  }
}
