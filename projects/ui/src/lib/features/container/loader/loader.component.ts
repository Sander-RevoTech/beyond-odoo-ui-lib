import { Component, Input } from '@angular/core';

import { Placeholder, PlaceholderConfig, getPlaceholderConfig } from '../placeholder/config';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'byd-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  standalone: true,
  imports: [MatProgressSpinnerModule, NgIf]
})
export class LoaderComponent {
  @Input()
  isLoading = false;

  @Input()
  skeleton: PlaceholderConfig | null = null;

  constructor() {
    this.isLoading = true;
  }

  public getPlaceholder(): Placeholder {
    return getPlaceholderConfig(this.skeleton || 'default');
  }
}
