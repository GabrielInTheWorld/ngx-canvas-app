import { Color } from './color.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export enum DrawingMode {
    PEN = 'pen',
    ERASER = 'eraser',
    DELETE = 'delete',
    RECTANGLE = 'rectangle',
    CIRCLE = 'circle'
}

export interface Plane {
    id: number;
    width: number;
    height: number;
    visible: boolean;
    index: number;
}

export interface Coordinate {
    x: number;
    y: number;
}

export interface DrawPoint {
    nextCoordinates: Coordinate[];
    mode: DrawingMode;
    color: Color;
}

const BACKGROUND_PLANE: Plane = { id: 0, width: 600, height: 600, visible: true, index: 0 };

@Injectable({
    providedIn: 'root'
})
export class PlaneService {
    public readonly planes = new BehaviorSubject<Plane[]>([BACKGROUND_PLANE]);

    public readonly activePlane = new BehaviorSubject<number>(0);

    public readonly moveEvent = new Subject<Coordinate>();

    public readonly previewDrawEvent = new Subject<DrawPoint>();

    public readonly drawEvent = new Subject<DrawPoint>();

    public readonly drawingModeEvent = new BehaviorSubject<DrawingMode>(DrawingMode.PEN);

    public readonly clearPreviewEvent = new Subject<void>();

    public readonly clearSiteEvent = new Subject<void>();
}
