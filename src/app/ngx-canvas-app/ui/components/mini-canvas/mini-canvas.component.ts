import { Component, Input } from '@angular/core';
import { CanvasComponent } from '../canvas/canvas.component';

@Component({
  selector: 'ngx-mini-canvas',
  templateUrl: './mini-canvas.component.html',
  styleUrls: ['./mini-canvas.component.scss'],
})
export class MiniCanvasComponent extends CanvasComponent {
  @Input()
  public ngxWidth = '40px';

  @Input()
  public ngxHeight = '40px';
}
