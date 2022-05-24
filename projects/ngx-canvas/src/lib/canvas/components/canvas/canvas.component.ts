import { Component, Input, OnInit } from '@angular/core';
import {
    CanvasDescriptor,
    Coordinate,
    DrawingMode,
    DrawPoint,
    PlaneDescription,
} from '../../definitions';
import { PlaneService } from '../../services/plane.service';
import { Observable } from 'rxjs';
import { CursorPlaneService } from '../../services/cursor-plane.service';
import { PreviewPlaneService } from '../../services/preview-plane.service';
import { NgxCanvasService } from '../../services/canvas.service';
import { PointerService } from '../../services/pointer.service';

const DEFAULT_FOREGROUND_COLOR = `#000`;
const DEFAULT_BACKGROUND_COLOR = `#FFF`;
const DEFAULT_RESOLUTION = 72;

@Component({
    selector: 'ngx-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {
    @Input()
    public width = 600;

    @Input()
    public height = 600;

    @Input()
    public color = DEFAULT_FOREGROUND_COLOR;

    public get canvasObservable(): Observable<CanvasDescriptor | null> {
        return this.canvasService.getCanvasObservable();
    }

    private get drawingMode(): DrawingMode {
        return this.planeService.drawingModeChanged.value;
    }

    private get activePlaneId(): number {
        return this.planeService.activePlane.value;
    }

    private _isDrawing = false;
    private _coordinates: Coordinate[] = [];

    private _lastDrawSlot = 0;

    public constructor(
        private canvasService: NgxCanvasService,
        private pointerService: PointerService,
        private planeService: PlaneService,
        private cursorPlane: CursorPlaneService,
        private previewPlane: PreviewPlaneService
    ) {}

    public ngOnInit(): void {
        if (this.height || this.width) {
            this.canvasService.addCanvas({
                backgroundColor: DEFAULT_BACKGROUND_COLOR,
                resolution: DEFAULT_RESOLUTION,
                height: this.height || this.width,
                width: this.width || this.height,
            });
        }
    }

    public onMouseDown(): void {
        this._isDrawing = true;
        if (this.drawingMode === DrawingMode.ERASER) {
            this._lastDrawSlot = this.planeService.getNextDrawSlot(
                this.activePlaneId
            );
        }
    }

    public onPointerMove(event: PointerEvent): void {
        const coordinate = { x: event.offsetX, y: event.offsetY };
        this.cursorPlane.pointerMoved.next(coordinate);
        if (this._isDrawing) {
            this.onDraw(coordinate);
        } else {
            this.pointerService.pipedMoveEvent.next(coordinate);
        }
    }

    public onMouseUp(): void {
        this.onBeforeDraw();
        this._isDrawing = false;
        this.planeService.addDrawing(
            this.activePlaneId,
            this.getDrawPoint(this._coordinates)
        );
        this.previewPlane.previewCleared.next();
        this._coordinates = [];
        if (this.drawingMode === DrawingMode.ERASER) {
            const nextDrawSlot = this.planeService.closeNextDrawSlot(
                this.activePlaneId
            );
            const difference = nextDrawSlot - this._lastDrawSlot;
            this.planeService.exchangeDrawingPoints(
                this.activePlaneId,
                (drawPoints) =>
                    drawPoints
                        .slice(0, this._lastDrawSlot)
                        .concat(
                            this.planeService.mergeDrawPoints(
                                drawPoints.splice(
                                    this._lastDrawSlot,
                                    difference
                                )
                            )
                        )
            );
        }
        // this.planeService.addSnapshot(
        //     this.activePlaneId,
        //     this.planeService.planeComponents[this.activePlaneId].getSnapshot()
        // );
    }

    private getDrawPoint(nextCoordinates: Coordinate[]): DrawPoint {
        return {
            nextCoordinates,
            color: this.color,
            mode: this.drawingMode,
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
                this.planeService.addDrawing(
                    this.activePlaneId,
                    this.getDrawPoint([coordinate])
                );
                break;
            default:
                this.previewPlane.previewDrawn.next(
                    this.getDrawPoint([coordinate])
                );
                this._coordinates.push(coordinate);
        }
    }
}
