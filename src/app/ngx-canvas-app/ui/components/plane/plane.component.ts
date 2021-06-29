import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { BasePlaneComponent } from '../../base/base-plane.component';
import { PlaneService, Plane, DrawPoint, DrawingMode, Coordinate } from '../../services/plane.service';

@Component({
    selector: 'ngx-plane',
    templateUrl: './plane.component.html',
    styleUrls: ['./plane.component.scss']
})
export class PlaneComponent extends BasePlaneComponent implements OnInit, AfterViewInit {
    @ViewChild('canvas')
    private canvas: ElementRef<HTMLCanvasElement> | null = null;

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

    constructor(private canvasService: PlaneService) {
        super();
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this.canvasService.activePlane.subscribe(id => {
                this.isActivePlane = id === this.plane?.id;
            })
        );
    }

    public ngAfterViewInit(): void {
        if (this.canvas?.nativeElement) {
            this.context = this.canvas.nativeElement.getContext('2d');
        }
    }

    private addEventListener(): void {
        this.drawSubscription = this.canvasService.drawEvent.subscribe(point => this.onDraw(point));
    }

    private removeEventListener(): void {
        if (this.drawSubscription) {
            this.drawSubscription.unsubscribe();
            this.drawSubscription = null;
        }
    }

    private onDraw(point: DrawPoint): void {
        switch (point.mode) {
            case DrawingMode.PEN:
                this.drawPen(point);
                break;
            case DrawingMode.RECTANGLE:
                this.drawRectangle(point);
                break;
            case DrawingMode.CIRCLE:
                this.drawCircle(point);
                break;
        }
    }

    protected getFirstCoordinate(point: DrawPoint): Coordinate {
        return point.nextCoordinates[0];
    }

    protected getLastCoordinate(point: DrawPoint): Coordinate {
        return point.nextCoordinates[point.nextCoordinates.length - 1];
    }
}
