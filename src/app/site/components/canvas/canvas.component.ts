import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseComponent } from '../../base/base.component';
import { CanvasService } from '../../services/canvas.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('canvas')
  private canvas: ElementRef<HTMLCanvasElement> | null = null;

  @Input()
  public plane: any = {};

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

  constructor(private canvasService: CanvasService) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.canvasService.activePlane.subscribe((id) => {
        this.isActivePlane = id === this.plane.id;
      })
    );
  }

  public ngAfterViewInit(): void {
    if (this.canvas?.nativeElement) {
      this.context = this.canvas.nativeElement.getContext('2d');
    }
  }

  private addEventListener(): void {
    this.drawSubscription = this.canvasService.drawEvent.subscribe((points) =>
      this.onDraw(points)
    );
  }

  private removeEventListener(): void {
    if (this.drawSubscription) {
      this.drawSubscription.unsubscribe();
      this.drawSubscription = null;
    }
  }

  private onDraw(points: { x: number; y: number }[]): void {
    let firstPoint = points[0];
    points.forEach((point) => {
      this.context?.beginPath();
      this.context?.moveTo(firstPoint.x, firstPoint.y);
      this.context?.lineTo(point.x, point.y);
      this.context?.stroke();
      this.context?.closePath();
      firstPoint = point;
    });
  }
}
