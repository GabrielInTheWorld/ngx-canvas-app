import { Injectable } from '@angular/core';
import * as elementResizeDetectorMarker from 'element-resize-detector';

@Injectable({ providedIn: 'root' })
export class ElementResizeDetectorService {
    private resizeDetector: elementResizeDetectorMarker.Erd;

    public constructor() {
        this.resizeDetector = elementResizeDetectorMarker({ strategy: 'scroll' });
    }

    public addResizeEventListener(element: HTMLElement, handler: (elem: HTMLElement) => void): void {
        this.resizeDetector.listenTo(element, handler);
    }

    public removeResizeEventListener(element: HTMLElement): void {
        this.resizeDetector.uninstall(element);
    }
}
