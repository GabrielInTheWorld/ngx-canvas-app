import {
    AfterViewInit,
    Component,
    Input,
    OnInit,
    ElementRef,
    ViewChild,
} from '@angular/core';
import { BasePlaneComponent } from '../../base/base-plane.component';
import {
    Coordinate,
    DrawingMode,
    DrawPoint,
    PlaneDescription,
} from '../../definitions';
import { Subscription } from 'rxjs';
import { PlaneService } from '../../services/plane.service';
import { PointerService } from '../../services/pointer.service';

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
    public plane!: PlaneDescription;

    public get isVisible(): boolean {
        return this.plane.visible;
    }

    @ViewChild('canvas')
    private readonly _canvas: ElementRef<HTMLCanvasElement> | undefined;

    private set isActivePlane(is: boolean) {
        if (!this._isActivePlane && is) {
            this.addEventListener();
        } else if (this._isActivePlane && !is) {
            this.removeEventListener();
        }
        this._isActivePlane = is;
    }

    private _drawSubscription: Subscription | null = null;

    private _isActivePlane = false;

    public constructor(
        pointerService: PointerService,
        private planeService: PlaneService
    ) {
        super(pointerService);
    }

    public ngOnInit(): void {
        this.subscriptions.push(
            this.planeService.activePlane.subscribe((id) => {
                // this.isActivePlane = id === this.plane?.id;
            })
        );
    }

    public ngAfterViewInit(): void {
        if (this._canvas?.nativeElement) {
            this.context = this._canvas.nativeElement.getContext('2d');
            // this.planeService.planeComponents[this.plane.id] = this;
            this.rerender();
        }
    }

    // public getSnapshot(): string {
    //     return this._canvas!.nativeElement.toDataURL();
    // }

    protected override getFirstCoordinate(_point: DrawPoint): Coordinate {
        return this.planeService.lastMoveCoordinate;
    }

    private addEventListener(): void {
        this._drawSubscription = this.planeService.drawingObservable.subscribe(
            (point) => this.onDraw(point)
        );
    }

    private removeEventListener(): void {
        if (this._drawSubscription) {
            this._drawSubscription.unsubscribe();
            this._drawSubscription = null;
        }
    }

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
