import {
    AfterViewInit,
    Component,
    OnInit,
    ViewChild,
    ElementRef,
} from '@angular/core';
import { BasePlaneComponent } from '../../base/base-plane.component';
import { PreviewPlaneService } from '../../services/preview-plane.service';
import { DrawingMode, DrawPoint } from '../../definitions';
import { Observable, BehaviorSubject } from 'rxjs';
import { Input } from '@angular/core';
import { PointerService } from '../../services/pointer.service';
import { NgxCanvasService } from '../../services/canvas.service';

@Component({
    selector: 'ngx-canvas-preview-plane',
    templateUrl: './preview-plane.component.html',
    styleUrls: ['./preview-plane.component.scss'],
})
export class PreviewPlaneComponent
    extends BasePlaneComponent
    implements OnInit, AfterViewInit
{
    @Input()
    public height!: number;

    @Input()
    public width!: number;

    protected override previousPoint = { x: 0, y: 0 };

    @ViewChild('previewCanvas')
    private readonly _previewCanvas: ElementRef<HTMLCanvasElement> | undefined;

    constructor(
        pointerService: PointerService,
        canvasService: NgxCanvasService,
        private planeService: PreviewPlaneService
    ) {
        super(pointerService, canvasService);
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this.planeService.previewDrawn.subscribe((nextPoint) =>
                this.onPreviewDraw(nextPoint)
            ),
            // this.planeService.pipedMoveEvent.subscribe(
            //     (point) => (this.previousPoint = point)
            // ),
            this.planeService.previewCleared.subscribe(() => this.onClear())
        );
    }

    public ngAfterViewInit(): void {
        if (this._previewCanvas?.nativeElement) {
            // this.context = this._previewCanvas.nativeElement.getContext('2d');
            // const { x, y } =
            //     this._previewCanvas.nativeElement.getBoundingClientRect();
            // this._screenX = x;
            // this._screenY = y;
            this.setCanvas(this._previewCanvas.nativeElement);
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

    private onClear(): void {
        this.context?.beginPath();
        this.context?.clearRect(0, 0, 600, 600);
        this.context?.closePath();
    }
}
