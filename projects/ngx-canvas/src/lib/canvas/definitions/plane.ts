import { PlaneDescription, DrawPoint } from './index';
import { Identifiable } from '../../../core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

interface DrawPointStore {
    [drawPointId: number]: DrawPoint;
}

export class Plane implements PlaneDescription {
    public readonly id!: number;
    public width!: number;
    public height!: number;
    public visible!: boolean;
    public index!: number;
    public isBackground!: boolean;
    public backgroundColor!: string;

    public get drawingObservable(): Observable<DrawPoint> {
        return this._localDrawingSubject;
    }

    private _localDrawingCount = 0;
    private _localStore: DrawPointStore = {};
    private _localDrawingSubject = new Subject<DrawPoint>();

    public constructor(description: PlaneDescription & Identifiable) {
        Object.assign(this, description);
    }

    public addDrawPoint(point: DrawPoint): void {
        const nextId = ++this._localDrawingCount;
        this._localStore[nextId] = point;
        this._localDrawingSubject.next(point);
    }
}
