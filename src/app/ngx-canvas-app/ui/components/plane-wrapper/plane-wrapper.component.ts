import { ColorService } from 'src/app/ngx-canvas-app/ui/services/color.service';
import { Component, OnInit } from '@angular/core';
import { Coordinate, DrawingMode, DrawPoint, Plane, PlaneService } from '../../services/plane.service';

@Component({
    selector: 'ngx-plane-wrapper',
    templateUrl: './plane-wrapper.component.html',
    styleUrls: ['./plane-wrapper.component.scss']
})
export class PlaneWrapperComponent implements OnInit {
    public planes: Plane[] = [];

    private get drawingMode(): DrawingMode {
        return this.planeService.drawingModeEvent.value;
    }

    private get activePlaneId(): number {
        return this.planeService.activePlane.value;
    }

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
            this.onDraw(coordinate);
        } else {
            this.planeService.moveEvent.next(coordinate);
        }
    }

    public onMouseUp(): void {
        this.onBeforeDraw();
        this.isDrawing = false;
        this.planeService.addDrawing(this.activePlaneId, this.getDrawPoint(this.coordinates));
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

    private onBeforeDraw(): void {
        switch (this.drawingMode) {
            case DrawingMode.CIRCLE:
            case DrawingMode.RECTANGLE:
                const id = this.planeService.addPlane();
                this.planeService.activePlane.next(id);
                break;
        }
    }

    private onDraw(coordinate: Coordinate): void {
        switch (this.drawingMode) {
            case DrawingMode.ERASER:
                this.planeService.addDrawing(this.activePlaneId, this.getDrawPoint([coordinate]));
                break;
            default:
                this.planeService.previewDrawEvent.next(this.getDrawPoint([coordinate]));
                this.coordinates.push(coordinate);
        }
    }
}
