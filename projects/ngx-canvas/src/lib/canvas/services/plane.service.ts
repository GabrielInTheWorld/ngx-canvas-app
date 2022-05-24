import { Injectable } from '@angular/core';
import { NgxCanvasServiceModule } from './canvas-service.module';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
    Coordinate,
    DrawingMode,
    DrawPoint,
    PlaneDescription,
} from '../definitions';
import { PlaneComponent } from '../components/plane/plane.component';
import { PointerService } from './pointer.service';

const BACKGROUND_PLANE: PlaneDescription = {
    // id: 0,
    width: 600,
    height: 600,
    visible: true,
    index: 0,
    isBackground: true,
};

@Injectable({
    providedIn: NgxCanvasServiceModule,
})
export class PlaneService {
    public readonly planeComponents: { [planeId: number]: PlaneComponent } = {};

    // public readonly planes = new BehaviorSubject<PlaneDescription[]>([
    //     BACKGROUND_PLANE,
    // ]);

    public readonly activePlane = new BehaviorSubject<number>(0);

    public readonly drawingModeChanged = new BehaviorSubject<DrawingMode>(
        DrawingMode.PEN
    );

    public get lastMoveCoordinate(): Coordinate {
        return this.pointerService.pipedMoveEvent.value;
    }

    public get drawingObservable(): Observable<DrawPoint> {
        return this._drawing.asObservable();
    }

    public constructor(private pointerService: PointerService) {}

    private readonly _drawing = new Subject<DrawPoint>();
    // private readonly _currentPlaneState: {
    //     [planeId: number]: BehaviorSubject<string>;
    // } = {};
    private _globalStore: { [id: number]: DrawPoint[] } = {};
    // private _nextId = 1;

    /**
     * Function to add new planes to the global plane store.
     *
     * @param amount Number of planes to be added
     * @returns The id of the last added plane
     */
    public addPlane(amount: number = 1): number {
        // const temp = this.planes.value;
        let returnValue = 0;
        // for (let i = 0; i < amount; ++i) {
        //     const currentIndex = this._nextId++;
        //     returnValue = currentIndex;
        //     temp.unshift({
        //         id: currentIndex,
        //         width: 600,
        //         height: 600,
        //         visible: true,
        //         index: currentIndex,
        //         isBackground: false,
        //     });
        // }
        // this.planes.next(temp);
        return returnValue;
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
    public exchangeDrawingPoints(
        planeId: number,
        callback: (drawPoints: DrawPoint[]) => DrawPoint[]
    ): void {
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
    public mergeDrawPoints(drawPoints: DrawPoint[]): DrawPoint {
        const nextCoordinates = drawPoints.reduce(
            (previousValue, nextPoint) =>
                previousValue.concat(nextPoint.nextCoordinates),
            [] as Coordinate[]
        );
        return {
            nextCoordinates,
            color: drawPoints[0].color,
            mode: drawPoints[0].mode,
        };
    }

    public addDrawing(planeId: number, drawing: DrawPoint): void {
        if (this._globalStore[planeId]) {
            this._globalStore[planeId].push(drawing);
        } else {
            this._globalStore[planeId] = [drawing];
        }
        this._drawing.next(drawing);
    }

    public getFullDrawing(id: number): DrawPoint[] {
        return this._globalStore[id] || [];
    }
}
