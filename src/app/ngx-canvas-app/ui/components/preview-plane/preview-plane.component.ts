import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BasePlaneComponent } from '../../base/base-plane.component';
import { DrawingMode, DrawDescriptor, PlaneService } from '../../services/plane.service';

@Component({
    selector: 'ngx-preview-plane',
    templateUrl: './preview-plane.component.html',
    styleUrls: ['./preview-plane.component.scss']
})
export class PreviewPlaneComponent extends BasePlaneComponent implements OnInit {
    // @ViewChild('previewCanvas')
    // private previewCanvas: ElementRef<HTMLCanvasElement> | null = null;

    protected previousPoint = { x: 0, y: 0 };

    constructor(planeService: PlaneService) {
        super(planeService);
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this.planeService.previewDrawEvent.subscribe(nextPoint => this.onPreviewDraw(nextPoint)),
            this.planeService.pipedMoveEvent.subscribe(point => (this.previousPoint = point)),
            this.planeService.clearPreviewEvent.subscribe(() => this.onClear())
        );
    }

    // public ngAfterViewInit(): void {
    //     if (this.previewCanvas?.nativeElement) {
    //         this.context = this.previewCanvas.nativeElement.getContext('2d');
    //     }
    // }

    private onPreviewDraw(point: DrawDescriptor): void {
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

    private onClear(): void {
        this.context?.beginPath();
        this.context?.clearRect(0, 0, 600, 600);
        this.context?.closePath();
    }
}
