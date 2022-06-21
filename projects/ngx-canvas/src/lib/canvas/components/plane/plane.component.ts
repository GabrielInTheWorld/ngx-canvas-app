import {
    AfterViewInit,
    Component,
    Input,
    OnInit,
    ElementRef,
    ViewChild,
} from '@angular/core';
import { BasePlaneComponent } from '../../base/base-plane.component';
import { Coordinate, DrawingMode, DrawPoint } from '../../definitions';
import { Subscription } from 'rxjs';
import { PlaneService } from '../../services/plane.service';
import { PointerService } from '../../services/pointer.service';
import { Plane } from '../../definitions/plane';
import { NgxCanvasService } from '../../services/canvas.service';

@Component({
    selector: 'ngx-canvas-plane',
    templateUrl: './plane.component.html',
    styleUrls: ['./plane.component.scss'],
})
export class PlaneComponent
    extends BasePlaneComponent
    implements OnInit, AfterViewInit
{
    @Input()
    // public plane!: Plane;
    public set plane(plane: Plane) {
        this._plane = plane;
        this.updateDrawSubscription();
    }

    public get plane(): Plane {
        return this._plane;
    }

    public get isVisible(): boolean {
        return this.plane.visible;
    }

    @ViewChild('canvas')
    private readonly _canvasWrapper: ElementRef<HTMLCanvasElement> | undefined;

    private set isActivePlane(is: boolean) {
        // if (!this._isActivePlane && is) {
        //     this.addEventListener();
        // } else if (this._isActivePlane && !is) {
        //     this.removeEventListener();
        // }
        this._isActivePlane = is;
    }

    private _drawSubscription: Subscription | null = null;

    private _isActivePlane = false;
    private _plane!: Plane;

    public constructor(
        pointerService: PointerService,
        canvasService: NgxCanvasService,
        private planeService: PlaneService
    ) {
        super(pointerService, canvasService);
    }

    public ngOnInit(): void {
        this.subscriptions.push(
            this.planeService.activePlaneIdChanged.subscribe((id) => {
                this.isActivePlane = id === this.plane?.id;
            })
        );
    }

    public ngAfterViewInit(): void {
        if (this._canvasWrapper?.nativeElement) {
            // this.context = this._canvas.nativeElement.getContext('2d');
            // const { x, y } = this._canvas.nativeElement.getBoundingClientRect();
            // this._screenX = x;
            // this._screenY = y;
            // this.planeService.planeComponents[this.plane.id] = this;
            this.setCanvas(this._canvasWrapper.nativeElement);
            this.rerender();
        }
    }

    // public getSnapshot(): string {
    //     return this._canvas!.nativeElement.toDataURL();
    // }

    protected override getFirstCoordinate(_point: DrawPoint): Coordinate {
        return this.planeService.lastMoveCoordinate;
    }

    private updateDrawSubscription(): void {
        this.subscriptions.updateSubscription(
            `DRAWING`,
            this.plane.drawingObservable.subscribe((point) =>
                this.onDraw(point)
            )
        );
    }

    // private addEventListener(): void {
    //     this._drawSubscription = this.planeService.drawingObservable.subscribe(
    //         (point) => this.onDraw(point)
    //     );
    // }

    // private removeEventListener(): void {
    //     if (this._drawSubscription) {
    //         this._drawSubscription.unsubscribe();
    //         this._drawSubscription = null;
    //     }
    // }

    private onDraw(point: DrawPoint): void {
        switch (point.mode) {
            case DrawingMode.PEN:
                this.drawPen(point);
                break;
            case DrawingMode.ERASER:
                this.drawEraser(point);
                break;
            case DrawingMode.RECTANGLE:
                this.drawRectangle(point);
                break;
            case DrawingMode.CIRCLE:
                this.drawCircle(point);
                break;
        }
        // this.planeService.addSnapshot(this.plane.id, this.canvas!.nativeElement.toDataURL());
    }

    private drawEraser(point: DrawPoint): void {
        const coordinates = point.nextCoordinates;
        let firstPoint = this.previousPoint;
        coordinates.forEach((coordinate) => {
            this.context!.lineJoin = 'round';
            this.context!.globalCompositeOperation = 'destination-out';
            this.context!.lineWidth = 30;
            this.context?.beginPath();
            this.context?.moveTo(firstPoint.x, firstPoint.y);
            this.context?.lineTo(coordinate.x, coordinate.y);
            this.context?.closePath();
            this.context?.stroke();
            firstPoint = coordinate;
        });
        this.previousPoint = firstPoint;
    }

    private rerender(): void {
        // const drawPoints = this.planeService.getFullDrawing(this.plane.id);
        // for (const drawPoint of drawPoints) {
        //     this.onDraw(drawPoint);
        // }
    }
}
