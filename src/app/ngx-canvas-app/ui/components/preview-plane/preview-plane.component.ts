import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { DrawingMode, DrawPoint, PlaneService } from '../../services/plane.service';

interface RectParams {
    width: number;
    height: number;
    x: number;
    y: number;
}

@Component({
    selector: 'ngx-preview-plane',
    templateUrl: './preview-plane.component.html',
    styleUrls: ['./preview-plane.component.scss']
})
export class PreviewPlaneComponent extends BaseComponent implements OnInit, AfterViewInit {
    @ViewChild('previewCanvas')
    private previewCanvas: ElementRef<HTMLCanvasElement> | null = null;

    private context: CanvasRenderingContext2D | null = null;

    private previousPoint = { x: 0, y: 0 };

    constructor(private canvasService: PlaneService) {
        super();
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this.canvasService.previewDrawEvent.subscribe(nextPoint => this.onPreviewDraw(nextPoint)),
            this.canvasService.moveEvent.subscribe(point => (this.previousPoint = point)),
            this.canvasService.clearPreviewEvent.subscribe(() => this.onClear())
        );
    }

    public ngAfterViewInit(): void {
        if (this.previewCanvas?.nativeElement) {
            this.context = this.previewCanvas.nativeElement.getContext('2d');
        }
    }

    private onPreviewDraw(point: DrawPoint): void {
        switch (point.mode) {
            case DrawingMode.PEN:
                this.drawPen(point);
                break;
            case DrawingMode.RECTANGLE:
                this.onClear();
                this.drawRectangle(point);
                break;
            case DrawingMode.CIRCLE:
                this.onClear();
                this.drawCircle(point);
                break;
        }
    }

    private drawPen(point: DrawPoint): void {
        if (this.context) {
            const coordinate = point.nextCoordinates[0];
            this.context.lineJoin = 'round';
            this.context.strokeStyle = point.color;
            this.context.beginPath();
            this.context.moveTo(this.previousPoint.x, this.previousPoint.y);
            this.context.lineTo(coordinate.x, coordinate.y);
            this.context.stroke();
            this.context.closePath();
            this.previousPoint = coordinate;
        }
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
        const coordinate = this.previousPoint;
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
        const coordinate = point.nextCoordinates[0];
        const x = this.previousPoint.x < coordinate.x ? this.previousPoint.x : coordinate.x;
        const y = this.previousPoint.y < coordinate.y ? this.previousPoint.y : coordinate.y;
        const width = Math.abs(this.previousPoint.x - coordinate.x);
        const height = Math.abs(this.previousPoint.y - coordinate.y);
        return {
            x,
            y,
            width,
            height
        };
    }

    private onClear(): void {
        this.context?.beginPath();
        this.context?.clearRect(0, 0, 600, 600);
        this.context?.closePath();
    }
}
