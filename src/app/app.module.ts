import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxCanvasAppModule } from './ngx-canvas-app/ngx-canvas-app.module';
import { ProtocolModuleComponent } from './ui/components/protocol-module/protocol-module.component';

@NgModule({
  declarations: [AppComponent, ProtocolModuleComponent],
  imports: [BrowserModule, BrowserAnimationsModule, NgxCanvasAppModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
