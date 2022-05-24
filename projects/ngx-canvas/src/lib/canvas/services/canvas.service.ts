import { Injectable } from '@angular/core';
import { NgxCanvasServiceModule } from './canvas-service.module';
import { Observable, BehaviorSubject } from 'rxjs';
import { CanvasDescription, CanvasDescriptor } from '../definitions/canvas';

@Injectable({
    providedIn: NgxCanvasServiceModule,
})
export class NgxCanvasService {
    private readonly _currentCanvasSubject =
        new BehaviorSubject<CanvasDescriptor | null>(null);

    public addCanvas(canvasDescription: CanvasDescription): void {
        if (!this._currentCanvasSubject.value) {
            this._currentCanvasSubject.next(
                new CanvasDescriptor(canvasDescription)
            );
        }
    }

    public addPlane(amount: number = 1): void {}

    public getCanvasObservable(): Observable<CanvasDescriptor | null> {
        return this._currentCanvasSubject.asObservable();
    }
}
