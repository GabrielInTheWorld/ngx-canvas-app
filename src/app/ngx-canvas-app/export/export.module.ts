import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { UiModule } from '../ui/ui.module';
import { NgxColorFieldComponent } from './components/ngx-color-field/ngx-color-field.component';
import { NgxRightSiteComponent } from './components/ngx-right-site/ngx-right-site.component';

const declarations: any[] | Type<any>[] = [
  NgxColorFieldComponent,
  NgxRightSiteComponent,
];

@NgModule({
  imports: [UiModule, CommonModule, MaterialDesignModule],
  exports: [...declarations],
  declarations: [...declarations],
})
export class ExportModule {}
