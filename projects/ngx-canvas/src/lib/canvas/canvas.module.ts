import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from './components/canvas/canvas.component';
import { PlaneComponent } from './components/plane/plane.component';
import { PreviewPlaneComponent } from './components/preview-plane/preview-plane.component';
import { CursorPlaneComponent } from './components/cursor-plane/cursor-plane.component';
import { NgxCanvasServiceModule } from './services/canvas-service.module';

const EXPORTED_COMPONENTS = [CanvasComponent];

@NgModule({
    declarations: [
        ...EXPORTED_COMPONENTS,
        PlaneComponent,
        PreviewPlaneComponent,
        CursorPlaneComponent,
    ],
    exports: EXPORTED_COMPONENTS,
    imports: [CommonModule, NgxCanvasServiceModule],
})
export class NgxCanvasModule {}
