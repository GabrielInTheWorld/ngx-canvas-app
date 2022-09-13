import {
    Component,
    Input,
    OnInit,
    ViewChild,
    ElementRef,
    Inject,
} from '@angular/core';
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
import {
    PointerService,
    DEFAULT_COORDINATE,
} from '../../services/pointer.service';
import { PointerButton } from '../../../../core/pointer-button';
import { DOCUMENT } from '@angular/common';

const DEFAULT_FOREGROUND_COLOR = `#000`;
const DEFAULT_BACKGROUND_COLOR = `#FFF`;
const DEFAULT_RESOLUTION = 72;

const SCALE_FACTOR_CHANGE = 0.055;

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
            this.canvasService.canvasViewPortResized.next({ width, height });
        }).observe(nativeElement);
    }

    @ViewChild(`ngxCanvasContentWrapper`)
    private readonly _ngxCanvasContentWrapper!: ElementRef<HTMLElement>;

    public get insetTop(): number {
        return this.height / 2 + this._insetTop;
    }

    public get insetLeft(): number {
        return this.width / 2 + this._insetLeft;
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

    private _isLeftButtonDown = false;
    private _isRightButtonDown = false;
    private _coordinates: Coordinate[] = [];

    private _lastDrawSlot = 0;
    private _lastDrawCoordinate: Coordinate = DEFAULT_COORDINATE;

    private _insetTop = 0;
    private _insetLeft = 0;

    public constructor(
        private canvasService: NgxCanvasService,
        private pointerService: PointerService,
        private planeService: PlaneService,
        private cursorPlane: CursorPlaneService,
        private previewPlane: PreviewPlaneService,
        @Inject(DOCUMENT) document: Document
    ) {
        document.oncontextmenu = () => false;
    }

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

    public onWheel(event: WheelEvent): void {
        event.preventDefault();
        event.stopPropagation();
        if (event.ctrlKey) {
            this.zoomCanvas(event);
        } else {
            if (event.shiftKey) {
                this._insetLeft += this.isWheelUp(event) ? -25 : 25;
            } else {
                this._insetTop += this.isWheelUp(event) ? -25 : 25;
            }
            setTimeout(() => {
                this.pointerService.scaleFactorChanged.next(
                    this.pointerService.scaleFactorChanged.value
                );
            });
        }
    }

    public onPointerEntered(): void {
        this.cursorPlane.pointerVisibilityChanged.next(true);
    }

    public onPointerLeaved(): void {
        this.cursorPlane.pointerVisibilityChanged.next(false);
    }

    public onPointerDown(event: PointerEvent): void {
        switch (event.button) {
            case PointerButton.LEFT:
                this.onLeftPointerDown(event);
                break;
            case PointerButton.RIGHT:
                this.onRightPointerDown(event);
                break;
            case PointerButton.ERASER:
                break;
            case PointerButton.MIDDLE:
                break;
        }
    }

    public onPointerMove(event: PointerEvent): void {
        const coordinate = this.getCoordinate(event);
        this.cursorPlane.pointerMoved.next(coordinate);
        this.invokeMoveHandler(coordinate);
    }

    public onPointerUp(): void {
        this.onBeforeDraw();
        this._isLeftButtonDown = false;
        this._isRightButtonDown = false;
        this.planeService.addDrawing(
            this.activePlaneId,
            this.getDrawPoint(this._coordinates)
        );
        this.previewPlane.previewCleared.next();
        this._coordinates = [];
        if (this.drawingMode === DrawingMode.ERASER) {
            this.erase();
        }
    }

    private onLeftPointerDown(event: PointerEvent): void {
        this._isLeftButtonDown = true;
        if (this.drawingMode === DrawingMode.ERASER) {
            this._lastDrawSlot = this.planeService.getNextDrawSlot(
                this.activePlaneId
            );
        }
        const coordinate = this.getCoordinate(event);
        this.invokeMoveHandler(coordinate);
    }

    private onRightPointerDown(event: PointerEvent): void {
        this._isRightButtonDown = true;
        this._lastDrawCoordinate = this.getCoordinate(event);
    }

    private zoomCanvas(event: WheelEvent): void {
        const currentScaleFactor = this.pointerService.scaleFactorChanged.value;
        if (this.isWheelUp(event) && currentScaleFactor > SCALE_FACTOR_CHANGE) {
            const nextScaleFactor = currentScaleFactor - SCALE_FACTOR_CHANGE;
            this._ngxCanvasContentWrapper.nativeElement.style.transform = `scale(${nextScaleFactor})`;
            // zooming out
            this.pointerService.scaleFactorChanged.next(nextScaleFactor);
        } else if (
            !this.isWheelUp(event) &&
            currentScaleFactor < SCALE_FACTOR_CHANGE * 30
        ) {
            const nextScaleFactor = currentScaleFactor + SCALE_FACTOR_CHANGE;
            this._ngxCanvasContentWrapper.nativeElement.style.transform = `scale(${nextScaleFactor})`;

            // zooming in
            this.pointerService.scaleFactorChanged.next(nextScaleFactor);
        }
        const { width, height } =
            this._ngxCanvasContentWrapper.nativeElement?.getBoundingClientRect();
        this.canvasService.canvasPlaneHandlerResized.next({
            width,
            height,
        });
    }

    private moveCanvas({ x, y }: Coordinate): void {
        this._insetLeft += this._lastDrawCoordinate.x - x;
        this._insetTop += this._lastDrawCoordinate.y - y;
        this._lastDrawCoordinate = { x, y };
        this.pointerService.scaleFactorChanged.next(
            this.pointerService.scaleFactorChanged.value
        );
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

    private invokeMoveHandler(coordinate: Coordinate): void {
        if (this._isLeftButtonDown) {
            this.draw(coordinate);
        } else if (this._isRightButtonDown) {
            this.moveCanvas(coordinate);
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

    private draw(coordinate: Coordinate): void {
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

    private erase(): void {
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
                            drawPoints.splice(this._lastDrawSlot, difference)
                        )
                    )
        );
    }

    private isWheelUp({ deltaY }: WheelEvent): boolean {
        return deltaY > 0;
    }
}
