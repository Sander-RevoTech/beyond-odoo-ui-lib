import { Component, Input } from '@angular/core';

@Component({
  selector: 'byd-card-image',
  templateUrl: './card-image.component.html',
  styleUrls: ['./card-image.component.scss'],
  standalone: true,
  imports: []
})
export class CardImageComponent {
  @Input()
  src: string = '';

  constructor() {}
}
