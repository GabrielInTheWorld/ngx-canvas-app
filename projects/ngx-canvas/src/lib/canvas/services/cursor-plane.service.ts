import { Injectable } from '@angular/core';
import { NgxCanvasServiceModule } from './canvas-service.module';
import { Subject } from 'rxjs';
import { Coordinate } from '../definitions';

@Injectable({
    providedIn: NgxCanvasServiceModule,
})
export class CursorPlaneService {
    public readonly pointerVisibilityChanged = new Subject<boolean>();
    public readonly pointerMoved = new Subject<Coordinate>();
}
