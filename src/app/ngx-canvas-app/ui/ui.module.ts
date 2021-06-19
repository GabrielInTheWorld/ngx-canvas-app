import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { CanvasWrapperComponent } from './components/canvas-wrapper/canvas-wrapper.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { CursorCanvasComponent } from './components/cursor-canvas/cursor-canvas.component';
import { PlaneHandlerComponent } from './components/plane-handler/plane-handler.component';
import { PreviewCanvasComponent } from './components/preview-canvas/preview-canvas.component';

const declarations: any[] | Type<any>[] = [
  CanvasComponent,
  CanvasWrapperComponent,
  PlaneHandlerComponent,
  PreviewCanvasComponent,
  CursorCanvasComponent,
];

@NgModule({
  declarations: declarations,
  exports: [...declarations],
  imports: [CommonModule, MaterialDesignModule],
})
export class UiModule {}
