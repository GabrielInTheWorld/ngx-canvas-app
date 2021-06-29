import { Component, OnInit } from '@angular/core';
import { Plane, PlaneService } from '../../services/plane.service';

@Component({
    selector: 'ngx-plane-wrapper',
    templateUrl: './plane-wrapper.component.html',
    styleUrls: ['./plane-wrapper.component.scss']
})
export class PlaneWrapperComponent implements OnInit {
    public planes: Plane[] = [];

    private isDrawing = false;
    private points: { x: number; y: number }[] = [];

    constructor(private canvasService: PlaneService) {}

    ngOnInit(): void {
        this.canvasService.planes.subscribe(planes => (this.planes = planes));
    }

    public onMouseDown(): void {
        this.isDrawing = true;
    }

    public onMouseMove(event: MouseEvent): void {
        const point = { x: event.offsetX, y: event.offsetY };
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
