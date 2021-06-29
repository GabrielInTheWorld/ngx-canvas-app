import { ColorService } from 'src/app/ngx-canvas-app/ui/services/color.service';
import { Component, OnInit } from '@angular/core';
import { Coordinate, DrawPoint, Plane, PlaneService } from '../../services/plane.service';

@Component({
    selector: 'ngx-plane-wrapper',
    templateUrl: './plane-wrapper.component.html',
    styleUrls: ['./plane-wrapper.component.scss']
})
export class PlaneWrapperComponent implements OnInit {
    public planes: Plane[] = [];

    private isDrawing = false;
    private coordinates: Coordinate[] = [];

    constructor(private planeService: PlaneService, private colorService: ColorService) {}

    ngOnInit(): void {
        this.planeService.planes.subscribe(planes => (this.planes = planes));
    }

    public onMouseDown(): void {
        this.isDrawing = true;
    }

    public onMouseMove(event: MouseEvent): void {
        const coordinate = { x: event.offsetX, y: event.offsetY };
        if (this.isDrawing) {
            this.planeService.previewDrawEvent.next(this.getDrawPoint([coordinate]));
            this.coordinates.push(coordinate);
        } else {
            this.planeService.moveEvent.next(coordinate);
        }
    }

    public onMouseUp(): void {
        this.isDrawing = false;
        this.planeService.drawEvent.next(this.getDrawPoint(this.coordinates));
        this.planeService.clearPreviewEvent.next();
        this.coordinates = [];
    }

    private getDrawPoint(nextCoordinates: Coordinate[]): DrawPoint {
        return {
            nextCoordinates,
            color: this.colorService.currentColor,
            mode: this.planeService.drawingModeEvent.value
        };
    }
}
