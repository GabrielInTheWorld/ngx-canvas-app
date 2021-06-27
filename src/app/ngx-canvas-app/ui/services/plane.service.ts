import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface Plane {
    id: number;
    width: number;
    height: number;
    visible: boolean;
    index: number;
}

export interface DrawPoint {
    x: number;
    y: number;
}

const BACKGROUND_PLANE: Plane = { id: 0, width: 600, height: 600, visible: true, index: 0 };

@Injectable({
    providedIn: 'root'
})
export class PlaneService {
    public readonly planes = new BehaviorSubject<Plane[]>([BACKGROUND_PLANE]);

    public readonly activePlane = new BehaviorSubject<number>(0);

    public readonly moveEvent = new Subject<DrawPoint>();

    public readonly previewDrawEvent = new Subject<DrawPoint>();

    public readonly drawEvent = new Subject<DrawPoint[]>();

    public readonly clearPreviewEvent = new Subject<void>();
}
