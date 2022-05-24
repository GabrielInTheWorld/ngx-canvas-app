import { PlaneDescription } from './index';
import { Plane } from './plane';
import { BehaviorSubject } from 'rxjs';

export interface CanvasDescription {
    width: number;
    height: number;
    backgroundColor: string;
    resolution: number;
}

export class CanvasDescriptor implements CanvasDescription {
    public readonly width!: number;
    public readonly height!: number;
    public readonly backgroundColor!: string;
    public readonly resolution!: number;

    public readonly planes = new BehaviorSubject<Plane[]>([]);

    private _localPlaneCount = 0;
    private _planeStore: { [planeId: number]: Plane } = {};

    public constructor(description: CanvasDescription) {
        // this.backgroundColor = backgroundColor
        // this.width = width
        // this.height = height
        // for (const key in description) {
        //     this[`${key as keyof CanvasDescription}`]= description[key]
        // }
        Object.assign(this, description);
        this.addPlane({ backgroundColor: this.backgroundColor, index: 0 });
    }

    /**
     * Adds a new plane to the local store
     *
     * @param planeDescription Some config values for the next plane to add
     * @returns The id of the added plane
     */
    public addPlane(planeDescription: Partial<PlaneDescription>): number {
        const nextId = ++this._localPlaneCount;
        this._planeStore[nextId] = new Plane({
            id: nextId,
            width: planeDescription.width || this.width,
            height: planeDescription.height || this.height,
            index: planeDescription.index || nextId,
            isBackground: planeDescription.isBackground || false,
            visible: planeDescription.visible || true,
            backgroundColor: planeDescription.backgroundColor,
        });
        console.log(`addPlane:`, this._planeStore);
        this.planes.next(Object.values(this._planeStore));
        return nextId;
    }

    public getPlane(planeId: number): Plane {
        return this._planeStore[planeId];
    }
}
