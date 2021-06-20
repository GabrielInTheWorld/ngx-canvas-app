import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { CanvasWrapperComponent } from './components/canvas-wrapper/canvas-wrapper.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { CursorCanvasComponent } from './components/cursor-canvas/cursor-canvas.component';
import { PlaneHandlerComponent } from './components/plane-handler/plane-handler.component';
import { PreviewCanvasComponent } from './components/preview-canvas/preview-canvas.component';
import { PlaneModuleComponent } from './components/plane-module/plane-module.component';
import { MiniCanvasComponent } from './components/mini-canvas/mini-canvas.component';
import { ColorTileComponent } from './components/color-tile/color-tile.component';
import { NgxTabModule } from './modules/ngx-tab/ngx-tab.module';

const declarations: any[] | Type<any>[] = [
  CanvasComponent,
  CanvasWrapperComponent,
  PlaneHandlerComponent,
  PreviewCanvasComponent,
  CursorCanvasComponent,
  PlaneModuleComponent,
  MiniCanvasComponent,
  ColorTileComponent,
];

const modules: any[] | Type<any>[] = [NgxTabModule];

@NgModule({
  declarations: [...declarations],
  exports: [...declarations, ...modules],
  imports: [CommonModule, MaterialDesignModule, ...modules],
})
export class UiModule {}
