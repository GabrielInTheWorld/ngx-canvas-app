import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorFieldComponent } from './components/color-field/color-field.component';
import { ColorTileComponent } from './components/color-tile/color-tile.component';



@NgModule({
  declarations: [
    ColorFieldComponent,
    ColorTileComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ColorFieldModule { }
