import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseComponent } from '../../base/base.component';
import { PlaneService, Plane, DrawPoint, DrawingMode } from '../../services/plane.service';

interface RectParams {
    width: number;
    height: number;
    x: number;
    y: number;
}

@Component({
    selector: 'ngx-plane',
    templateUrl: './plane.component.html',
    styleUrls: ['./plane.component.scss']
})
export class PlaneComponent extends BaseComponent implements OnInit, AfterViewInit {
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

    private context: CanvasRenderingContext2D | null = null;

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

    private drawPen(point: DrawPoint): void {
        const coordinates = point.nextCoordinates;
        let firstPoint = coordinates[0];
        coordinates.forEach(coordinate => {
            this.context!.lineJoin = 'round';
            this.context!.strokeStyle = point.color;
            this.context?.beginPath();
            this.context?.moveTo(firstPoint.x, firstPoint.y);
            this.context?.lineTo(coordinate.x, coordinate.y);
            this.context?.stroke();
            this.context?.closePath();
            firstPoint = coordinate;
        });
    }

    private drawRectangle(point: DrawPoint): void {
        if (this.context) {
            const { x, y, width, height } = this.getRectParams(point);
            this.context.strokeStyle = point.color;
            this.context.beginPath();
            this.context.rect(x, y, width, height);
            this.context.stroke();
            this.context.closePath();
        }
    }

    private drawCircle(point: DrawPoint): void {
        const coordinate = point.nextCoordinates[0];
        const { width, height } = this.getRectParams(point);
        const radius = Math.sqrt(width ** 2 + height ** 2);
        if (this.context) {
            this.context.strokeStyle = point.color;
            this.context.beginPath();
            this.context.arc(coordinate.x, coordinate.y, radius, 0, 2 * Math.PI);
            this.context.stroke();
            this.context.closePath();
        }
    }

    private getRectParams(point: DrawPoint): RectParams {
        const previousCoordinate = point.nextCoordinates[0];
        const nextCoordinate = point.nextCoordinates[point.nextCoordinates.length - 1];
        const x = previousCoordinate.x < nextCoordinate.x ? previousCoordinate.x : nextCoordinate.x;
        const y = previousCoordinate.y < nextCoordinate.y ? previousCoordinate.y : nextCoordinate.y;
        const width = Math.abs(previousCoordinate.x - nextCoordinate.x);
        const height = Math.abs(previousCoordinate.y - nextCoordinate.y);
        return {
            x,
            y,
            width,
            height
        };
    }
}
