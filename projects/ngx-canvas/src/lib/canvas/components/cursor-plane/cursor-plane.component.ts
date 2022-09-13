import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BaseUiComponent } from '../../../base-ui-component';
import { Coordinate } from '../../definitions';
import { CursorPlaneService } from '../../services/cursor-plane.service';
import {
    DEFAULT_COORDINATE,
    PointerService,
} from '../../services/pointer.service';

@Component({
    selector: 'ngx-canvas-cursor-plane',
    templateUrl: './cursor-plane.component.html',
    styleUrls: ['./cursor-plane.component.scss'],
})
export class CursorPlaneComponent extends BaseUiComponent implements OnInit {
    @ViewChild('cursorCanvas')
    public set cursorCanvas(canvasWrapper: ElementRef<HTMLCanvasElement>) {
        this._canvas = canvasWrapper.nativeElement;
        this._context = this._canvas.getContext('2d');
    }

    public ngxWidth = 600;
    public ngxHeight = 600;

    private get currentScaleFactor(): number {
        return this.pointerService.scaleFactorChanged.value;
    }

    private _canvas!: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D | null = null;
    private _lastCoordinate: Coordinate = DEFAULT_COORDINATE;

    public constructor(
        private planeService: CursorPlaneService,
        private pointerService: PointerService,
        host: ElementRef<HTMLElement>
    ) {
        super();
        new ResizeObserver(() => {
            const { width, height } =
                host.nativeElement.getBoundingClientRect();
            this.ngxWidth = width;
            this.ngxHeight = height;
        }).observe(host.nativeElement);
    }

    public ngOnInit(): void {
        this.subscriptions.push(
            this.planeService.pointerMoved.subscribe((coordinate) =>
                this.onMoveEvent(coordinate)
            ),
            this.planeService.pointerVisibilityChanged.subscribe((isVisible) =>
                this.onVisibilityChanged(isVisible)
            ),
            this.pointerService.scaleFactorChanged.subscribe(() => {
                this.clearCanvas();
                this.drawCursor(this._lastCoordinate);
            })
        );
    }

    private clearCanvas(): void {
        if (this._context) {
            this._context.clearRect(0, 0, this.ngxWidth, this.ngxHeight);
        }
    }

    private onVisibilityChanged(isVisible: boolean): void {
        if (!isVisible) {
            this.clearCanvas();
        }
    }

    private onMoveEvent(coordinate: Coordinate): void {
        if (this._context) {
            this.clearCanvas();
            this._lastCoordinate = coordinate;
            this.drawCursor(this._lastCoordinate);
        }
    }

    private drawCursor(coordinate: Coordinate): void {
        this.drawCircle(coordinate, 15 * this.currentScaleFactor, '#ff0');
        this.drawCircle(coordinate, 16 * this.currentScaleFactor);
        this.drawCircle(coordinate, 17 * this.currentScaleFactor, '#ff0');
    }

    private drawCircle(
        coordinate: Coordinate,
        radius: number,
        lineColor: string = '#000'
    ): void {
        if (this._context) {
            this._context.beginPath();
            this._context.lineWidth = 1;
            this._context.arc(
                coordinate.x,
                coordinate.y,
                radius,
                0,
                Math.PI * 2,
                false
            );
            this._context.strokeStyle = lineColor;
            this._context.stroke();
            this._context.closePath();
        }
    }
}
