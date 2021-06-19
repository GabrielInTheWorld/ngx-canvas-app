import { NgModule, Type } from '@angular/core';
import { ExportModule } from './export/export.module';
import { NgxCanvasAppComponent } from './ngx-canvas-app.component';
import { UiModule } from './ui/ui.module';

const declarations: any[] | Type<any>[] = [NgxCanvasAppComponent];

@NgModule({
  imports: [UiModule, ExportModule],
  exports: [ExportModule, ...declarations],
  declarations: [...declarations],
})
export class NgxCanvasAppModule {}
