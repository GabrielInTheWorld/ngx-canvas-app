import { ElementResizeDetectorService } from './../../libraries/element-resize-detector/element-resize-detector.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { Coordinate, PlaneService } from '../../services/plane.service';
import { ResizeEvent } from '../../directives/resize-detector/resize-detector.directive';

@Component({
    selector: 'ngx-cursor-canvas',
    templateUrl: './cursor-canvas.component.html',
    styleUrls: ['./cursor-canvas.component.scss']
})
export class CursorCanvasComponent extends BaseComponent implements OnInit {
    @ViewChild('cursorCanvas')
    public set cursorCanvas(canvasWrapper: ElementRef<HTMLCanvasElement>) {
        this._canvas = canvasWrapper.nativeElement;
        this._context = this._canvas.getContext('2d');
    }

    public ngxWidth = 600;
    public ngxHeight = 600;

    private _canvas!: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D | null = null;

    constructor(private planeService: PlaneService, host: ElementRef<HTMLElement>) {
        super();
        const { width, height } = host.nativeElement.getBoundingClientRect();
        this.ngxWidth = width;
        this.ngxHeight = height;
    }

    ngOnInit(): void {
        this.subscriptions.push(this.planeService.moveEvent.subscribe(coordinate => this.onMoveEvent(coordinate)));
    }

    public onResize(event: ResizeEvent): void {
        setTimeout(() => {
            this.ngxWidth = event.dimensions.width;
            this.ngxHeight = event.dimensions.height;
        });
    }

    private onMoveEvent(coordinate: Coordinate): void {
        if (this._context) {
            this._context.clearRect(0, 0, this.ngxWidth, this.ngxHeight);
            this.drawCircle(coordinate, 15, '#ff0');
            this.drawCircle(coordinate, 16);
            this.drawCircle(coordinate, 17, '#ff0');
        }
    }

    private drawCircle(coordinate: Coordinate, radius: number, lineColor: string = '#000'): void {
        if (this._context) {
            this._context.beginPath();
            this._context.lineWidth = 1;
            this._context.arc(coordinate.x, coordinate.y, radius, 0, Math.PI * 2, false);
            this._context.strokeStyle = lineColor;
            this._context.stroke();
            this._context.closePath();
        }
    }
}
