import { Injectable } from '@angular/core';
import { NgxCanvasServiceModule } from './canvas-service.module';
import { Subject } from 'rxjs';
import { DrawPoint } from '../definitions';

@Injectable({
    providedIn: NgxCanvasServiceModule,
})
export class PreviewPlaneService {
    public readonly previewDrawn = new Subject<DrawPoint>();
    public readonly previewCleared = new Subject<void>();
}
