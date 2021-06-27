import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { PlaneWrapperComponent } from './components/plane-wrapper/plane-wrapper.component';
import { PlaneComponent } from './components/plane/plane.component';
import { CursorCanvasComponent } from './components/cursor-canvas/cursor-canvas.component';
import { PlaneHandlerComponent } from './components/plane-handler/plane-handler.component';
import { PreviewPlaneComponent } from './components/preview-plane/preview-plane.component';
import { PlaneModuleComponent } from './components/plane-module/plane-module.component';
import { MiniPlaneComponent } from './components/mini-plane/mini-plane.component';
import { ColorTileComponent } from './components/color-tile/color-tile.component';
import { NgxTabModule } from './modules/ngx-tab/ngx-tab.module';
import { NgxSplitViewModule } from './modules/ngx-split-view/ngx-split-view.module';
import { IconButtonComponent } from './components/icon-button/icon-button.component';

const declarations: any[] | Type<any>[] = [
    PlaneComponent,
    PlaneWrapperComponent,
    PlaneHandlerComponent,
    PreviewPlaneComponent,
    CursorCanvasComponent,
    PlaneModuleComponent,
    MiniPlaneComponent,
    ColorTileComponent,
    IconButtonComponent
];

const modules: any[] | Type<any>[] = [NgxTabModule, NgxSplitViewModule];

@NgModule({
    declarations: [...declarations],
    exports: [...declarations, ...modules],
    imports: [CommonModule, MaterialDesignModule, ...modules]
})
export class UiModule {}
