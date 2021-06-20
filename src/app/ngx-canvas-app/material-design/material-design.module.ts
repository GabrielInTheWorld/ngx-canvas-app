import { NgModule, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { DragDropModule } from '@angular/cdk/drag-drop';

const modules: any[] | Type<any>[] = [
  DragDropModule,
  MatButtonModule,
  MatIconModule,
  MatDividerModule,
];

@NgModule({
  imports: [...modules],
  exports: [...modules],
})
export class MaterialDesignModule {}
