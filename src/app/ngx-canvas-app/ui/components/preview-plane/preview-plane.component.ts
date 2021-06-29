import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { DrawPoint, PlaneService } from '../../services/plane.service';

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

    private onClear(): void {
        this.context?.beginPath();
        this.context?.clearRect(0, 0, 600, 600);
        this.context?.closePath();
    }
}
