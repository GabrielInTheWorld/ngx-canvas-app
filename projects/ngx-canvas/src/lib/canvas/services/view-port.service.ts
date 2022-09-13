import { NgxCanvasServiceModule } from './canvas-service.module';
import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

interface ViewPort {
    viewportHeight: number;
    viewportWidth: number;
}

@Injectable({
    providedIn: NgxCanvasServiceModule,
})
export class ViewPortService {
    public get currentViewPort(): ViewPort {
        return this._viewportSubject.value;
    }

    private readonly _viewportSubject = new BehaviorSubject<ViewPort>({
        viewportHeight: 0,
        viewportWidth: 0,
    });

    public constructor(@Inject(DOCUMENT) document: Document) {
        new ResizeObserver(() => {
            const { clientWidth: viewportWidth, clientHeight: viewportHeight } =
                document.documentElement;
            this._viewportSubject.next({ viewportWidth, viewportHeight });
        }).observe(document.documentElement);
    }
}
