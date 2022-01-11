import { Directive, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Coordinate, DrawDescriptor, PlaneService } from '../services/plane.service';
import { BaseComponent } from './base.component';

export interface RectParams {
    width: number;
    height: number;
    x: number;
    y: number;
}

@Directive()
export class BasePlaneComponent extends BaseComponent implements AfterViewInit {
    @ViewChild('canvas')
    protected canvas: ElementRef<HTMLCanvasElement> | null = null;
    protected context: CanvasRenderingContext2D | null = null;

    protected previousPoint: Coordinate = { x: 0, y: 0 };

    protected get lineWidth(): number {
        return this.planeService.lineWidthEvent.value;
    }

    public constructor(protected planeService: PlaneService) {
        super();
        this.subscriptions.push(planeService.pipedMoveEvent.subscribe(nextPoint => (this.previousPoint = nextPoint)));
    }

    public ngAfterViewInit(): void {
        if (this.canvas) {
            this.context = this.canvas.nativeElement.getContext('2d');
        }
        this.onAfterViewInit();
    }

    protected drawPen(point: DrawDescriptor): void {
        const coordinates = point.nextCoordinates;
        let firstPoint = this.previousPoint;
        coordinates.forEach(coordinate => {
            this.context!.lineJoin = 'round';
            this.context!.strokeStyle = point.color;
            this.context!.globalCompositeOperation = 'source-over';
            this.context!.lineWidth = this.lineWidth;
            this.context?.beginPath();
            this.context?.moveTo(firstPoint.x, firstPoint.y);
            this.context?.lineTo(coordinate.x, coordinate.y);
            this.context?.closePath();
            this.context?.stroke();
            firstPoint = coordinate;
        });
    }

    protected drawEraser(point: DrawDescriptor): void {
        const coordinates = point.nextCoordinates;
        let firstPoint = this.previousPoint;
        coordinates.forEach(coordinate => {
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

    protected drawRectangle(point: DrawDescriptor): void {
        if (this.context) {
            const { x, y, width, height } = this.getRectParams(point);
            this.context.strokeStyle = point.color;
            this.context.beginPath();
            this.context.rect(x, y, width, height);
            this.context.stroke();
            this.context.closePath();
        }
    }

    protected drawCircle(point: DrawDescriptor): void {
        const coordinate = this.getFirstCoordinate(point);
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

    protected getRectParams(point: DrawDescriptor): RectParams {
        const previousCoordinate = this.getFirstCoordinate(point);
        const nextCoordinate = this.getLastCoordinate(point);
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

    protected getFirstCoordinate(_point: DrawDescriptor): Coordinate {
        return this.previousPoint;
    }

    protected getLastCoordinate(_point: DrawDescriptor): Coordinate {
        return _point.nextCoordinates[_point.nextCoordinates.length - 1];
    }

    protected onAfterViewInit(): void {}
}
