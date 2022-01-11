import { PlaneComponent } from './../components/plane/plane.component';
import { Color } from './color.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

const CREATE = 'CREATE';
const DELETE = 'DELETE';
const DRAW = 'DRAW';

export abstract class EventDescription {
    private static _id = 0;
    public readonly id = ++EventDescription._id;

    public snapshot: string = '';
    public snapshotSubject: BehaviorSubject<string> | null = null;

    public abstract readonly type: string;
}

export class CreateEvent extends EventDescription {
    public readonly type = CREATE;

    public constructor(public readonly plane: PlaneConstruction) {
        super();
    }
}

export class DeleteEvent extends EventDescription {
    public readonly type = DELETE;

    public constructor(public readonly planeId: number) {
        super();
    }
}

export class DrawEvent extends EventDescription {
    public readonly type = DRAW;

    public constructor(public readonly planeId: number, public readonly drawPoint: DrawDescriptor) {
        super();
    }
}

export enum DrawingMode {
    PEN = 'pen',
    ERASER = 'eraser',
    DELETE = 'delete',
    RECTANGLE = 'rectangle',
    CIRCLE = 'circle'
}

export interface Plane extends PlaneConstruction {
    id: number;
}

export interface PlaneConstruction {
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

export interface DrawDescriptor {
    nextCoordinates: Coordinate[];
    mode: DrawingMode;
    color: Color;
    snapshot?: string;
}

const DEFAULT_COORDINATE: Coordinate = { x: 0, y: 0 };
const BACKGROUND_PLANE: Plane = { id: 0, width: 600, height: 600, visible: true, index: 0, isBackground: true };

@Injectable({
    providedIn: 'root'
})
export class PlaneService {
    public readonly lineWidthEvent = new BehaviorSubject<number>(30);

    public readonly planeComponents: { [planeId: number]: PlaneComponent } = {};

    public readonly planes = new BehaviorSubject<Plane[]>([BACKGROUND_PLANE]);

    public readonly activePlane = new BehaviorSubject<number>(0);

    public readonly pipedMoveEvent = new BehaviorSubject<Coordinate>(DEFAULT_COORDINATE);

    public readonly moveEvent = new BehaviorSubject<Coordinate>(DEFAULT_COORDINATE);

    public readonly previewDrawEvent = new Subject<DrawDescriptor>();

    public readonly drawingModeEvent = new BehaviorSubject<DrawingMode>(DrawingMode.PEN);

    public readonly clearPreviewEvent = new Subject<void>();

    public readonly clearSiteEvent = new Subject<void>();

    public readonly nextEventDescription = new Subject<EventDescription[]>();

    public get lastMoveCoordinate(): Coordinate {
        return this.pipedMoveEvent.value;
    }

    public get lastEventDescription(): EventDescription {
        return this._eventStore[this._currentEventId];
    }

    public get drawingObservable(): Observable<DrawDescriptor> {
        return this._drawEvent.asObservable();
    }

    private readonly _drawEvent = new Subject<DrawDescriptor>();
    private readonly _currentPlaneStateEvent: { [planeId: number]: BehaviorSubject<string> } = {};
    private _globalStore: { [id: number]: DrawDescriptor[] } = {};
    private _nextId = 1;

    //////////////////////////////////////
    private _drawCache: DrawDescriptor[] = [];
    private _eventStore: { [id: number]: EventDescription } = {};
    private _currentEventId = 0;
    private _lastSnapshot = '';
    private _snapshotMap: { [planeId: number]: string } = {};

    //////////////////////////////////////
    ///////////// Events /////////////////
    //////////////////////////////////////

    public nextEvent(event: EventDescription): void {
        switch (event.type) {
            case CREATE:
                this.nextPlane((event as CreateEvent).plane);
                break;
            case DELETE:
                this.deletePlane((event as DeleteEvent).planeId);
                break;
            case DRAW:
                const { planeId, drawPoint } = event as DrawEvent;
                this.addDrawing(planeId, drawPoint);
                break;
        }
        // event.snapshot = this.getSnapshot();
        event.snapshotSubject = new BehaviorSubject(this._lastSnapshot);
        this.addEventDescription(event);
        // this._eventStore[event.id] = event;
        // console.log('eventstore:', this._eventStore);
    }

    public nextPlane(plane: PlaneConstruction): number {
        const temp = this.planes.value;
        const currentIndex = this._nextId++;
        this._globalStore[currentIndex] = [];
        temp.unshift({
            ...plane,
            id: currentIndex
        });
        this.planes.next(temp);
        return currentIndex;
    }

    public deletePlane(planeId: number): void {
        delete this._globalStore[planeId];
        const temp = this.planes.value;
        const planeIndex = temp.findIndex(plane => plane.id === planeId);
        if (planeIndex > 0) {
            temp.splice(planeIndex, 1);
            this.planes.next(temp);
        }
    }

    //////////////////////////////////////
    //////////////////////////////////////
    //////////////////////////////////////

    public getSnapshotEvent(planeId: number): BehaviorSubject<string> {
        if (!this._currentPlaneStateEvent[planeId]) {
            this._currentPlaneStateEvent[planeId] = new BehaviorSubject('');
        }
        return this._currentPlaneStateEvent[planeId];
    }

    public nextSnapshotEvent(planeId: number, nextSnapshot?: string): void {
        // console.log('nextSnapshot event');
        const snapshot = nextSnapshot ?? this.planeComponents[planeId].getSnapshot();
        if (this._currentPlaneStateEvent[planeId]) {
            this._currentPlaneStateEvent[planeId].next(snapshot);
        } else {
            this._currentPlaneStateEvent[planeId] = new BehaviorSubject(snapshot);
        }
        if (this._currentEventId !== 0) {
            this._snapshotMap[planeId] = snapshot;
            // this.getSnapshot().then(snapshot => {
            this.lastEventDescription.snapshot = snapshot;
            this.lastEventDescription.snapshotSubject?.next(snapshot);
            this._lastSnapshot = snapshot;
            // });
        }
    }

    public async getSnapshot(): Promise<string> {
        const canvas = document.querySelector<HTMLCanvasElement>('#invisiblePicture')!;
        // canvas.width = 600;
        // canvas.height = 600;
        // canvas.style.display = 'none';
        const context = canvas.getContext('2d');
        for (const snapshot of Object.values(this._snapshotMap)) {
            const img = new Image(600, 600);
            const promise = new Promise<void>(resolve => {
                img.onload = () => {
                    context?.drawImage(img, 0, 0);
                    resolve();
                };
            });
            img.src = snapshot;
            await promise;
        }
        // for (const plane of Object.values(this.planeComponents)) {
        //     // console.log('plane', plane, canvas, context);
        //     const img = new Image(600, 600);
        //     // img.onload = event => {
        //     //     console.log('onload::ready', event);
        //     //     context!.drawImage(img, 0, 0);
        //     // };
        //     const promise = new Promise<void>(resolve => {
        //         img.onload = () => {
        //             context?.drawImage(img, 0, 0);
        //             resolve();
        //         };
        //     });
        //     img.src = this.getSnapshotEvent(plane.plane.id).value;
        //     await promise;
        //     // console.log('next image');
        //     // console.log('image', img, img.src);
        // }
        // console.log('return canvas');
        // console.log('data url', canvas.toDataURL());
        return canvas.toDataURL();
    }

    public addSnapshot(planeId: number, nextSnapshot: string): void {}

    /**
     * Function to add new planes to the global plane store.
     *
     * @param amount Number of planes to be added
     * @returns The id of the last added plane
     */
    public addPlane(amount: number = 1): number {
        // const temp = this.planes.value;
        // let returnValue = 0;
        for (let i = 0; i < amount; ++i) {
            // const currentIndex = this._nextId++;
            // returnValue = currentIndex;
            // temp.unshift({
            //     id: currentIndex,
            //     width: 600,
            //     height: 600,
            //     visible: true,
            //     index: currentIndex,
            //     isBackground: false
            // });
            const currentIndex = this._nextId;
            this.nextEvent(
                new CreateEvent({
                    width: 600,
                    height: 600,
                    visible: true,
                    index: currentIndex,
                    isBackground: false
                })
            );
        }
        return this._nextId;
        // this.planes.next(temp);
        // return returnValue;
    }

    /**
     * Function to get the next slot in the shape-array of a plane
     *
     * @param planeId The id the plane that next slot is returned
     * @returns the next slot of the given plane
     */
    public getNextDrawSlot(planeId: number): number {
        if (!this._globalStore[planeId]) {
            this._globalStore[planeId] = [];
        }
        return this._globalStore[planeId].length;
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
    public exchangeDrawingPoints(planeId: number, callback: (drawPoints: DrawDescriptor[]) => DrawDescriptor[]): void {
        const drawPoints = this.getFullDrawing(planeId);
        this._globalStore[planeId] = callback(drawPoints.slice(0));
    }

    /**
     * Function to merge the coordinates of drawpoints together and create one drawpoint
     *
     * @param drawPoints An array of drawpoints that will be merged into one drawpoint
     *
     * @returns The new drawpoint containing all coordinates from the original drawpoints
     */
    public mergeDrawPoints(drawPoints: DrawDescriptor[]): DrawDescriptor {
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

    public addDirectDrawingToPlane(planeId: number, drawPoint: DrawDescriptor): void {
        // if (this._globalStore[planeId]) {
        //     this._globalStore[planeId].push(drawPoint);
        // } else {
        //     this._globalStore[planeId] = [drawPoint];
        // }
        // this._drawEvent.next(drawPoint);
        // this.addDrawing(planeId, drawPoint);
        this.planeComponents[planeId].draw(drawPoint);
        this._drawCache.push(drawPoint);
    }

    public clearDrawCache(): DrawDescriptor[] {
        const points = this._drawCache;
        this._drawCache = [];
        return points;
    }

    private addEventDescription(event: EventDescription): void {
        this._currentEventId = event.id;
        this._eventStore[event.id] = event;
        this.nextEventDescription.next(Object.values(this._eventStore));
    }

    private addDrawing(planeId: number, drawing: DrawDescriptor): void {
        if (this._globalStore[planeId]) {
            this._globalStore[planeId].push(drawing);
        } else {
            this._globalStore[planeId] = [drawing];
        }
        this._drawEvent.next(drawing);
    }

    public getFullDrawing(id: number): DrawDescriptor[] {
        return this._globalStore[id] || [];
    }
}
