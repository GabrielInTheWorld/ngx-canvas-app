import { Directive } from '@angular/core';
import { Coordinate, DrawPoint } from '../services/plane.service';
import { BaseComponent } from './base.component';

export interface RectParams {
    width: number;
    height: number;
    x: number;
    y: number;
}

@Directive()
export class BasePlaneComponent extends BaseComponent {
    protected context: CanvasRenderingContext2D | null = null;

    protected drawPen(point: DrawPoint): void {
        const coordinates = point.nextCoordinates;
        let firstPoint = this.getFirstCoordinate(point);
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
            this.context.arc(coordinate.x, coordinate.y, radius, 0, 2 * Math.PI);
            this.context.stroke();
            this.context.closePath();
        }
    }

    protected getRectParams(point: DrawPoint): RectParams {
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

    protected getFirstCoordinate(_point: DrawPoint): Coordinate {
        return { x: 0, y: 0 };
    }

    protected getLastCoordinate(_point: DrawPoint): Coordinate {
        return { x: 0, y: 0 };
    }
}
