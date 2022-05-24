import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxCanvasModule, NgxCanvasPaintingUtilsModule } from 'ngx-canvas';

import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, NgxCanvasModule, NgxCanvasPaintingUtilsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
