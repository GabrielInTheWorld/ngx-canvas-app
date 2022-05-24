import { PlaneDescription, DrawPoint } from './index';
import { Identifiable } from '../../../core';

export class Plane implements PlaneDescription {
    public readonly id!: number;
    public width!: number;
    public height!: number;
    public visible!: boolean;
    public index!: number;
    public isBackground!: boolean;

    private _localDrawingCount = 0;
    private _localStore: { [drawPointId: number]: DrawPoint } = {};

    public constructor(description: PlaneDescription & Identifiable) {
        Object.assign(this, description);
    }

    public addDrawPoint(point: DrawPoint): void {
        const nextId = ++this._localDrawingCount;
        this._localStore[nextId] = point;
    }
}
