import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { CanvasWrapperComponent } from './components/canvas-wrapper/canvas-wrapper.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { CursorCanvasComponent } from './components/cursor-canvas/cursor-canvas.component';
import { PlaneHandlerComponent } from './components/plane-handler/plane-handler.component';
import { PreviewCanvasComponent } from './components/preview-canvas/preview-canvas.component';
import { RightSiteComponent } from './components/right-site/right-site.component';
import { PlaneModuleComponent } from './components/plane-module/plane-module.component';
import { MiniCanvasComponent } from './components/mini-canvas/mini-canvas.component';

const declarations: any[] | Type<any>[] = [
  CanvasComponent,
  CanvasWrapperComponent,
  PlaneHandlerComponent,
  PreviewCanvasComponent,
  CursorCanvasComponent,
  RightSiteComponent,
  PlaneModuleComponent,
  MiniCanvasComponent,
];

@NgModule({
  declarations: [...declarations],
  exports: [...declarations],
  imports: [CommonModule, MaterialDesignModule],
})
export class UiModule {}
