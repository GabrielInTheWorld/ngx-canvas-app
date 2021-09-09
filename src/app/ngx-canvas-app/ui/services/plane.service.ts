import { PlaneComponent } from './../components/plane/plane.component';
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
    isBackground: boolean;
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

const BACKGROUND_PLANE: Plane = { id: 0, width: 600, height: 600, visible: true, index: 0, isBackground: true };

@Injectable({
    providedIn: 'root'
})
export class PlaneService {
    private readonly _currentPlaneStateEvent: { [planeId: number]: BehaviorSubject<string> } = {};

    public readonly planeComponents: { [planeId: number]: PlaneComponent } = {};

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

    public getSnapshotEvent(planeId: number): BehaviorSubject<string> {
        if (!this._currentPlaneStateEvent[planeId]) {
            this._currentPlaneStateEvent[planeId] = new BehaviorSubject('');
        }
        return this._currentPlaneStateEvent[planeId];
    }

    public addSnapshot(planeId: number, nextSnapshot: string): void {
        if (this._currentPlaneStateEvent[planeId]) {
            this._currentPlaneStateEvent[planeId].next(nextSnapshot);
        } else {
            this._currentPlaneStateEvent[planeId] = new BehaviorSubject(nextSnapshot);
        }
    }

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
                index: currentIndex,
                isBackground: false
            });
        }
        this.planes.next(temp);
        return returnValue;
    }

    /**
     * Function to get the next slot in the shape-array of a plane
     *
     * @param planeId The id the plane that next slot is returned
     * @returns the next slot of the given plane
     */
    public getNextDrawSlot(planeId: number): number {
        if (!this.globalStore[planeId]) {
            this.globalStore[planeId] = [];
        }
        return this.globalStore[planeId].length;
    }

    public closeNextDrawSlot(planeId: number): number {
        return this.getNextDrawSlot(planeId);
    }

    /**
     * Function, through which the shape-array of a plane will be exchanged
     *
     * @param planeId The id of a plane which shape-array is modified
     * @param callback A function that receives a copy of the original shape-array and must return a shape-array, which
     * will be set as the new shape-array for the plane
     */
    public exchangeDrawingPoints(planeId: number, callback: (drawPoints: DrawPoint[]) => DrawPoint[]): void {
        const drawPoints = this.getFullDrawing(planeId);
        this.globalStore[planeId] = callback(drawPoints.slice(0));
    }

    /**
     * Function to merge the coordinates of drawpoints together and create one drawpoint
     *
     * @param drawPoints An array of drawpoints that will be merged into one drawpoint
     *
     * @returns The new drawpoint containing all coordinates from the original drawpoints
     */
    public mergeDrawPoints(drawPoints: DrawPoint[]): DrawPoint {
        const nextCoordinates = drawPoints.reduce(
            (previousValue, nextPoint) => previousValue.concat(nextPoint.nextCoordinates),
            [] as Coordinate[]
        );
        return {
            nextCoordinates,
            color: drawPoints[0].color,
            mode: drawPoints[0].mode
        };
    }

    public addDrawing(planeId: number, drawing: DrawPoint): void {
        if (this.globalStore[planeId]) {
            this.globalStore[planeId].push(drawing);
        } else {
            this.globalStore[planeId] = [drawing];
        }
        this.drawEvent.next(drawing);
    }

    public getFullDrawing(id: number): DrawPoint[] {
        return this.globalStore[id] || [];
    }
}
