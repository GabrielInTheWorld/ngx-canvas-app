import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
    CanvasDescriptor,
    Coordinate,
    DrawingMode,
    DrawPoint,
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

    @ViewChild(`ngxCanvasWrapper`)
    private set _ngxCanvasWrapper(element: ElementRef<HTMLElement>) {
        const { nativeElement } = element;
        new ResizeObserver(() => {
            const { width, height } = nativeElement.getBoundingClientRect();
            this.canvasService.canvasResized.next({ width, height });
        }).observe(nativeElement);
    }

    public get canvasObservable(): Observable<CanvasDescriptor | null> {
        return this.canvasService.getCanvasObservable();
    }

    private get drawingMode(): DrawingMode {
        return this.planeService.drawingModeChanged.value;
    }

    private get activePlaneId(): number {
        return this.planeService.activePlaneIdChanged.value;
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

    public onPointerDown(event: PointerEvent): void {
        this._isDrawing = true;
        if (this.drawingMode === DrawingMode.ERASER) {
            this._lastDrawSlot = this.planeService.getNextDrawSlot(
                this.activePlaneId
            );
        }
        const coordinate = this.getCoordinate(event);
        this.draw(coordinate);
    }

    public onPointerMove(event: PointerEvent): void {
        const coordinate = this.getCoordinate(event);
        this.cursorPlane.pointerMoved.next(coordinate);
        this.draw(coordinate);
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

    private getCoordinate(event: PointerEvent): Coordinate {
        return { x: event.offsetX, y: event.offsetY };
    }

    private getDrawPoint(nextCoordinates: Coordinate[]): DrawPoint {
        return {
            nextCoordinates,
            color: this.color,
            mode: this.drawingMode,
        };
    }

    private draw(coordinate: Coordinate): void {
        if (this._isDrawing) {
            this.onDraw(coordinate);
        } else {
            this.pointerService.pipedMoveEvent.next(coordinate);
        }
    }

    private onBeforeDraw(): void {
        switch (this.drawingMode) {
            case DrawingMode.CIRCLE:
            case DrawingMode.RECTANGLE:
                const id = this.planeService.addPlane();
                this.planeService.activePlaneIdChanged.next(id);
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
