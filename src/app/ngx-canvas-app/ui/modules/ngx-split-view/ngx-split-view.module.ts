import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { SplitViewComponent } from './split-view/split-view.component';
import { SplitViewContentDirective } from './split-view-content.directive';
import { SplitViewContainerComponent } from './split-view-container/split-view-container.component';

const declarations: any[] | Type<any>[] = [
  SplitViewComponent,
  SplitViewContentDirective,
  SplitViewContainerComponent,
];

@NgModule({
  imports: [CommonModule, MatIconModule, DragDropModule],
  exports: [...declarations],
  declarations: [...declarations],
})
export class NgxSplitViewModule {}
