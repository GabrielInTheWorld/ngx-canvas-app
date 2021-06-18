import { Component, OnInit } from '@angular/core';
import { CanvasService } from '../../services/canvas.service';

@Component({
  selector: 'app-canvas-wrapper',
  templateUrl: './canvas-wrapper.component.html',
  styleUrls: ['./canvas-wrapper.component.scss'],
})
export class CanvasWrapperComponent implements OnInit {
  public planes: any[] = [{ id: 0, width: 600, height: 600 }];

  private isDrawing = false;
  private points: { x: number; y: number }[] = [];

  constructor(private canvasService: CanvasService) {}

  ngOnInit(): void {
    this.canvasService.planes.subscribe((planes) => (this.planes = planes));
  }

  public onMouseDown(): void {
    this.isDrawing = true;
  }

  public onMouseMove(event: MouseEvent): void {
    const point = { x: event.clientX, y: event.clientY };
    if (this.isDrawing) {
      this.canvasService.previewDrawEvent.next(point);
      this.points.push(point);
    } else {
      this.canvasService.moveEvent.next(point);
    }
  }

  public onMouseUp(): void {
    this.isDrawing = false;
    this.canvasService.drawEvent.next(this.points);
    this.canvasService.clearPreviewEvent.next();
    this.points = [];
  }
}
