import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BasePlaneComponent } from '../../base/base-plane.component';
import { Coordinate, DrawingMode, DrawPoint, PlaneService } from '../../services/plane.service';

@Component({
    selector: 'ngx-preview-plane',
    templateUrl: './preview-plane.component.html',
    styleUrls: ['./preview-plane.component.scss']
})
export class PreviewPlaneComponent extends BasePlaneComponent implements OnInit, AfterViewInit {
    @ViewChild('previewCanvas')
    private previewCanvas: ElementRef<HTMLCanvasElement> | null = null;

    private previousPoint = { x: 0, y: 0 };

    constructor(private planeService: PlaneService) {
        super();
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this.planeService.previewDrawEvent.subscribe(nextPoint => this.onPreviewDraw(nextPoint)),
            this.planeService.moveEvent.subscribe(point => (this.previousPoint = point)),
            this.planeService.clearPreviewEvent.subscribe(() => this.onClear())
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
                this.previousPoint = this.getLastCoordinate(point);
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

    protected getFirstCoordinate(_point: DrawPoint): Coordinate {
        return this.previousPoint;
    }

    protected getLastCoordinate(point: DrawPoint): Coordinate {
        return point.nextCoordinates[0];
    }

    private onClear(): void {
        this.context?.beginPath();
        this.context?.clearRect(0, 0, 600, 600);
        this.context?.closePath();
    }
}
