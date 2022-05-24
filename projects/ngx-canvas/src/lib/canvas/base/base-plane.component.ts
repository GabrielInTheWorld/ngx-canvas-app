import { Directive } from '@angular/core';
import { Coordinate, DrawPoint } from '../definitions';
import { SubscriptionMap } from '../../subscription-map';
import { PointerService } from '../services/pointer.service';

export interface RectParams {
    width: number;
    height: number;
    x: number;
    y: number;
}

export class BasePlaneComponent {
    protected context: CanvasRenderingContext2D | null = null;

    protected previousPoint: Coordinate = { x: 0, y: 0 };

    protected get lineWidth(): number {
        return this.pointerService.currentLineWidth;
    }

    protected readonly subscriptions = new SubscriptionMap();

    public constructor(protected pointerService: PointerService) {
        this.subscriptions.push(
            pointerService.pipedMoveEvent.subscribe(
                (nextPoint) => (this.previousPoint = nextPoint)
            )
        );
    }

    protected drawPen(point: DrawPoint): void {
        const coordinates = point.nextCoordinates;
        let firstPoint = this.previousPoint;
        coordinates.forEach((coordinate) => {
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

    protected drawRectangle(point: DrawPoint): void {
        if (this.context) {
            const { x, y, width, height } = this.getRectParams(point);
            this.context.strokeStyle = point.color;
            this.context.beginPath();
            this.context.rect(x, y, width, height);
            this.context.stroke();
            this.context.closePath();
        }
    }

    protected drawCircle(point: DrawPoint): void {
        const coordinate = this.getFirstCoordinate(point);
        const { width, height } = this.getRectParams(point);
        const radius = Math.sqrt(width ** 2 + height ** 2);
        if (this.context) {
            this.context.strokeStyle = point.color;
            this.context.beginPath();
            this.context.arc(
                coordinate.x,
                coordinate.y,
                radius,
                0,
                2 * Math.PI
            );
            this.context.stroke();
            this.context.closePath();
        }
    }

    protected getRectParams(point: DrawPoint): RectParams {
        const previousCoordinate = this.getFirstCoordinate(point);
        const nextCoordinate = this.getLastCoordinate(point);
        const x =
            previousCoordinate.x < nextCoordinate.x
                ? previousCoordinate.x
                : nextCoordinate.x;
        const y =
            previousCoordinate.y < nextCoordinate.y
                ? previousCoordinate.y
                : nextCoordinate.y;
        const width = Math.abs(previousCoordinate.x - nextCoordinate.x);
        const height = Math.abs(previousCoordinate.y - nextCoordinate.y);
        return {
            x,
            y,
            width,
            height,
        };
    }

    protected getFirstCoordinate(_point: DrawPoint): Coordinate {
        return this.previousPoint;
    }

    protected getLastCoordinate(_point: DrawPoint): Coordinate {
        return _point.nextCoordinates[_point.nextCoordinates.length - 1];
    }
}
