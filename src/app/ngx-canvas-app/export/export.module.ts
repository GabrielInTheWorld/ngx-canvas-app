import { NgxProtocolsWrapperComponent } from './components/ngx-protocols-wrapper/ngx-protocols-wrapper.component';
import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { UiModule } from '../ui/ui.module';
import { NgxColorFieldComponent } from './components/ngx-color-field/ngx-color-field.component';
import { NgxRightSiteComponent } from './components/ngx-right-site/ngx-right-site.component';
import { NgxLeftSiteComponent } from './components/ngx-left-site/ngx-left-site.component';
import { NgxPaintingUtilsWrapperComponent } from './components/ngx-painting-utils-wrapper/ngx-painting-utils-wrapper.component';

const declarations: any[] | Type<any>[] = [
    NgxColorFieldComponent,
    NgxRightSiteComponent,
    NgxLeftSiteComponent,
    NgxPaintingUtilsWrapperComponent,
    NgxProtocolsWrapperComponent
];

@NgModule({
    imports: [UiModule, CommonModule, MaterialDesignModule],
    exports: [...declarations],
    declarations: [...declarations]
})
export class ExportModule {}
