import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BaseUiComponent } from '../../../base-ui-component';
import { Coordinate } from '../../definitions';
import { CursorPlaneService } from '../../services/cursor-plane.service';

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

    private _canvas!: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D | null = null;

    public constructor(
        private planeService: CursorPlaneService,
        host: ElementRef<HTMLElement>
    ) {
        super();
        const { width, height } = host.nativeElement.getBoundingClientRect();
        this.ngxWidth = width;
        this.ngxHeight = height;
    }

    public ngOnInit(): void {
        this.subscriptions.push(
            this.planeService.pointerMoved.subscribe((coordinate) =>
                this.onMoveEvent(coordinate)
            )
        );
    }

    private onMoveEvent(coordinate: Coordinate): void {
        if (this._context) {
            this._context.clearRect(0, 0, this.ngxWidth, this.ngxHeight);
            this.drawCircle(coordinate, 15, '#ff0');
            this.drawCircle(coordinate, 16);
            this.drawCircle(coordinate, 17, '#ff0');
        }
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
