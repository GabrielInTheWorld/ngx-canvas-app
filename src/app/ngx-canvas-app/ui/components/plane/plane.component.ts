import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { BasePlaneComponent } from '../../base/base-plane.component';
import { PlaneService, Plane, DrawDescriptor, DrawingMode, Coordinate } from '../../services/plane.service';

export class PlaneContext {}

@Component({
    selector: 'ngx-plane',
    templateUrl: './plane.component.html',
    styleUrls: ['./plane.component.scss']
})
export class PlaneComponent extends BasePlaneComponent implements OnInit {
    @Input()
    public plane!: Plane;

    public get isVisible(): boolean {
        return this.plane.visible;
    }

    private set isActivePlane(is: boolean) {
        if (!this._isActivePlane && is) {
            this.addEventListener();
        } else if (this._isActivePlane && !is) {
            this.removeEventListener();
        }
        this._isActivePlane = is;
    }

    private drawSubscription: Subscription | null = null;

    private _isActivePlane = false;

    constructor(planeService: PlaneService) {
        super(planeService);
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this.planeService.activePlane.subscribe(id => {
                this.isActivePlane = id === this.plane?.id;
            })
        );
    }

    public getSnapshot(): string {
        return this.canvas!.nativeElement.toDataURL();
    }

    public getImageData(): ImageData {
        return this.context!.getImageData(0, 0, this.plane.width, this.plane.height);
    }

    /**
     * Use this with caution, because it is a hack to erase on a plane
     *
     * @param point
     */
    public draw(point: DrawDescriptor): void {
        this.onDraw(point);
    }

    protected onAfterViewInit(): void {
        this.planeService.planeComponents[this.plane.id] = this;
        this.planeService.makeNextSnapshot(this.plane.id, this.getSnapshot());
        this.rerender();
    }

    protected getFirstCoordinate(_point: DrawDescriptor): Coordinate {
        return this.planeService.lastMoveCoordinate;
    }

    private addEventListener(): void {
        this.drawSubscription = this.planeService.drawingObservable.subscribe(point => {
            if (point.mode === DrawingMode.ERASER) {
                this.previousPoint = point.nextCoordinates[0];
            }
            this.onDraw(point);
        });
    }

    private removeEventListener(): void {
        if (this.drawSubscription) {
            this.drawSubscription.unsubscribe();
            this.drawSubscription = null;
        }
    }

    private onDraw(point: DrawDescriptor): void {
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

    // private drawEraser(point: DrawDescriptor): void {
    //     const coordinates = point.nextCoordinates;
    //     let firstPoint = this.previousPoint;
    //     coordinates.forEach(coordinate => {
    //         this.context!.lineJoin = 'round';
    //         this.context!.globalCompositeOperation = 'destination-out';
    //         this.context!.lineWidth = 30;
    //         this.context?.beginPath();
    //         this.context?.moveTo(firstPoint.x, firstPoint.y);
    //         this.context?.lineTo(coordinate.x, coordinate.y);
    //         this.context?.closePath();
    //         this.context?.stroke();
    //         firstPoint = coordinate;
    //     });
    //     this.previousPoint = firstPoint;
    // }

    private rerender(): void {
        const drawPoints = this.planeService.getFullDrawing(this.plane.id);
        for (const drawPoint of drawPoints) {
            this.onDraw(drawPoint);
        }
    }
}
