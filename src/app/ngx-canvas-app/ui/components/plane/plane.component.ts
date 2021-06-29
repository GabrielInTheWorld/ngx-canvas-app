import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseComponent } from '../../base/base.component';
import { PlaneService, Plane, DrawPoint } from '../../services/plane.service';

@Component({
    selector: 'ngx-plane',
    templateUrl: './plane.component.html',
    styleUrls: ['./plane.component.scss']
})
export class PlaneComponent extends BaseComponent implements OnInit, AfterViewInit {
    @ViewChild('canvas')
    private canvas: ElementRef<HTMLCanvasElement> | null = null;

    @Input()
    public plane!: Plane;

    public get isVisible(): boolean {
        return this.plane.visible;
    }

    private set isActivePlane(is: boolean) {
        if (!this._isActivePlane && is) {
            this.addEventListener();
        } else if (this._isActivePlane && !is) {
            this.removeEventListener();
        }
        this._isActivePlane = is;
    }

    private context: CanvasRenderingContext2D | null = null;

    private drawSubscription: Subscription | null = null;

    private _isActivePlane = false;

    constructor(private canvasService: PlaneService) {
        super();
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this.canvasService.activePlane.subscribe(id => {
                this.isActivePlane = id === this.plane?.id;
            })
        );
    }

    public ngAfterViewInit(): void {
        if (this.canvas?.nativeElement) {
            this.context = this.canvas.nativeElement.getContext('2d');
        }
    }

    private addEventListener(): void {
        this.drawSubscription = this.canvasService.drawEvent.subscribe(point => this.onDraw(point));
    }

    private removeEventListener(): void {
        if (this.drawSubscription) {
            this.drawSubscription.unsubscribe();
            this.drawSubscription = null;
        }
    }

    private onDraw(point: DrawPoint): void {
        const coordinates = point.nextCoordinates;
        let firstPoint = coordinates[0];
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
}
