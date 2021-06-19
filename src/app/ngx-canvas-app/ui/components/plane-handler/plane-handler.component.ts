import { Component, OnInit } from '@angular/core';
import { CanvasService } from '../../services/canvas.service';

@Component({
  selector: 'ngx-plane-handler',
  templateUrl: './plane-handler.component.html',
  styleUrls: ['./plane-handler.component.scss'],
})
export class PlaneHandlerComponent implements OnInit {
  public planes: any[] = [];

  private nextId = 1;

  constructor(private canvasService: CanvasService) {}

  ngOnInit(): void {
    this.canvasService.planes.subscribe((planes) => (this.planes = planes));
  }

  public onAdd(): void {
    this.canvasService.planes.next(
      this.planes.concat({ id: this.nextId++, width: 600, height: 600 })
    );
  }
}
