import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  public readonly planes = new BehaviorSubject<any[]>([
    { id: 0, width: 600, height: 600 },
  ]);

  public readonly activePlane = new BehaviorSubject<number>(0);

  public readonly moveEvent = new Subject<{ x: number; y: number }>();

  public readonly previewDrawEvent = new Subject<{ x: number; y: number }>();

  public readonly drawEvent = new Subject<{ x: number; y: number }[]>();

  public readonly clearPreviewEvent = new Subject<void>();
}
