import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Coordinate } from '../definitions';
import { NgxCanvasServiceModule } from './canvas-service.module';

const DEFAULT_LINE_WIDTH = 30;
const DEFAULT_COORDINATE: Coordinate = { x: 0, y: 0 };

@Injectable({
    providedIn: NgxCanvasServiceModule,
})
export class PointerService {
    /**
     * @deprecated: Unclear which usage and which name
     */
    public readonly pipedMoveEvent = new BehaviorSubject<Coordinate>(
        DEFAULT_COORDINATE
    );

    public readonly lineWidthChanged = new BehaviorSubject<number>(
        DEFAULT_LINE_WIDTH
    );

    public get currentLineWidth(): number {
        return this.lineWidthChanged.value;
    }
}
