import { ColorService } from 'src/app/ngx-canvas-app/ui/services/color.service';
import { Component, OnInit } from '@angular/core';
import { Coordinate, DrawEvent, DrawingMode, DrawDescriptor, Plane, PlaneService } from '../../services/plane.service';

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

    private _isDrawing = false;
    private _coordinates: Coordinate[] = [];

    private _lastDrawSlot = 0;

    constructor(private planeService: PlaneService, private colorService: ColorService) {}

    ngOnInit(): void {
        this.planeService.planes.subscribe(planes => (this.planes = planes));
    }

    public onMouseDown(): void {
        this._isDrawing = true;
        if (this.drawingMode === DrawingMode.ERASER) {
            this._lastDrawSlot = this.planeService.getNextDrawSlot(this.activePlaneId);
        }
    }

    public onMouseMove(event: MouseEvent): void {
        const coordinate = { x: event.offsetX, y: event.offsetY };
        this.planeService.moveEvent.next(coordinate);
        if (this._isDrawing) {
            this.onDraw(coordinate);
        } else {
            this.planeService.pipedMoveEvent.next(coordinate);
        }
    }

    public onMouseUp(): void {
        this.onBeforeDraw();
        this._isDrawing = false;
        if (this.drawingMode === DrawingMode.ERASER) {
            const drawPoint = this.planeService.mergeDrawPoints(this.planeService.clearDrawCache());
            this.planeService.nextEvent(new DrawEvent(this.activePlaneId, drawPoint));
        } else {
            this.planeService.nextEvent(new DrawEvent(this.activePlaneId, this.getDrawPoint(this._coordinates)));
        }
        this.planeService.clearPreviewEvent.next();
        this._coordinates = [];
        this.planeService.makeNextSnapshot(this.activePlaneId);
    }

    private getDrawPoint(nextCoordinates: Coordinate[]): DrawDescriptor {
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
                this.planeService.addDirectDrawingToPlane(this.activePlaneId, this.getDrawPoint([coordinate]));
                break;
            default:
                this.planeService.previewDrawEvent.next(this.getDrawPoint([coordinate]));
                this._coordinates.push(coordinate);
        }
    }
}
