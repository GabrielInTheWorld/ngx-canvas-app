import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Coordinate } from '../definitions';
import { NgxCanvasServiceModule } from './canvas-service.module';

export const DEFAULT_COORDINATE: Coordinate = { x: 0, y: 0 };

const DEFAULT_LINE_WIDTH = 30;
const DEFAULT_SCALE_FACTOR = 1.0;

@Injectable({
    providedIn: NgxCanvasServiceModule,
})
export class PointerService {
    /**
     * @deprecated: Unclear which usage and which name
     */
    public readonly pipedMoveEvent = new BehaviorSubject(DEFAULT_COORDINATE);

    public readonly lineWidthChanged = new BehaviorSubject(DEFAULT_LINE_WIDTH);

    public readonly scaleFactorChanged = new BehaviorSubject(
        DEFAULT_SCALE_FACTOR
    );

    public get currentLineWidth(): number {
        return this.lineWidthChanged.value;
    }
}
