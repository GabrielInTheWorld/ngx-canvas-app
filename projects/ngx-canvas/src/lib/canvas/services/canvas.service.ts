import { Injectable } from '@angular/core';
import { NgxCanvasServiceModule } from './canvas-service.module';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { CanvasDescription, CanvasDescriptor, Plane } from '../definitions';

@Injectable({
    providedIn: NgxCanvasServiceModule,
})
export class NgxCanvasService {
    private readonly _currentCanvasSubject =
        new BehaviorSubject<CanvasDescriptor | null>(null);

    public readonly canvasResized = new Subject<{
        width: number;
        height: number;
    }>();

    public addCanvas(canvasDescription: CanvasDescription): void {
        if (!this._currentCanvasSubject.value) {
            this._currentCanvasSubject.next(
                new CanvasDescriptor(canvasDescription)
            );
        }
    }

    public getCanvas(): CanvasDescriptor | null {
        return this._currentCanvasSubject.value;
    }

    public addPlane(amount: number = 1): void {
        this.getCanvas()?.addPlane();
    }

    public getPlane(planeId: number): Plane | undefined {
        return this.getCanvas()?.getPlane(planeId);
    }

    public getCanvasObservable(): Observable<CanvasDescriptor | null> {
        return this._currentCanvasSubject.asObservable();
    }
}
