import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ngx-color-tile',
  templateUrl: './color-tile.component.html',
  styleUrls: ['./color-tile.component.scss'],
})
export class ColorTileComponent implements OnInit {
  @Input()
  public set backgroundColor(color: string) {
    this._backgroundColor = this.validateColor(color);
  }

  public get backgroundColor(): string {
    return this._backgroundColor;
  }

  @Input()
  public set size(size: string | number) {
    if (typeof size === 'number') {
      this._size = `${size}px`;
    } else {
      this._size = size;
    }
  }

  public get size(): string | number {
    return this._size;
  }

  @Output()
  public clickColor = new EventEmitter<string>();

  private _backgroundColor = '';
  private _size = '20px';

  public constructor() {}

  public ngOnInit(): void {}

  private validateColor(color: string): string {
    if (!color.startsWith('#')) {
      console.warn('Please prefix a color with "#"!');
      color = `#${color}`;
    }
    if (color.length !== 7 && color.length !== 4) {
      console.error('Wrong color-format:', color);
      return '';
    }
    return color;
  }
}
