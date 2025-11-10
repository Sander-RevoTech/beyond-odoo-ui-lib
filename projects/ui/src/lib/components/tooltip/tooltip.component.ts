import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'byd-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  standalone: true,
  imports: [MatTooltipModule, MatIconModule],
})
export class BydTooltipComponent {
  @Input({ required: true })
  message!: string;

  constructor() {}
}
