import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxCanvasAppModule } from './ngx-canvas-app/ngx-canvas-app.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, NgxCanvasAppModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
