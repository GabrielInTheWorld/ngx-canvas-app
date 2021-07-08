import { Color } from './color.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

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

    public readonly moveEvent = new BehaviorSubject<Coordinate>({ x: 0, y: 0 });

    public readonly previewDrawEvent = new Subject<DrawPoint>();

    private readonly drawEvent = new Subject<DrawPoint>();

    public readonly drawingModeEvent = new BehaviorSubject<DrawingMode>(DrawingMode.PEN);

    public readonly clearPreviewEvent = new Subject<void>();

    public readonly clearSiteEvent = new Subject<void>();

    public get lastMoveCoordinate(): Coordinate {
        return this.moveEvent.value;
    }

    public get drawingObservable(): Observable<DrawPoint> {
        return this.drawEvent.asObservable();
    }

    private globalStore: { [id: number]: DrawPoint[] } = {};

    private nextId = 1;

    /**
     * Function to add new planes to the global plane store.
     *
     * @param amount Number of planes to be added
     * @returns The id of the last added plane
     */
    public addPlane(amount: number = 1): number {
        const temp = this.planes.value;
        let returnValue = 0;
        for (let i = 0; i < amount; ++i) {
            const currentIndex = this.nextId++;
            returnValue = currentIndex;
            temp.unshift({
                id: currentIndex,
                width: 600,
                height: 600,
                visible: true,
                index: currentIndex
            });
        }
        this.planes.next(temp);
        return returnValue;
    }

    public addDrawing(planeId: number, drawing: DrawPoint): void {
        if (this.globalStore[planeId]) {
            this.globalStore[planeId].push(drawing);
        } else {
            this.globalStore[planeId] = [drawing];
        }
        this.drawEvent.next(drawing);
    }

    public getFullDrawing(id: number): DrawPoint[] | undefined {
        return this.globalStore[id];
    }
}
