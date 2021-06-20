import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { TabContentDirective } from './tab-content.directive';
import { TabGroupComponent } from './tab-group/tab-group.component';
import { TabLabelDirective } from './tab-label.directive';
import { TabComponent } from './tab/tab.component';

const declarations: any[] | Type<any>[] = [
  TabComponent,
  TabGroupComponent,
  TabLabelDirective,
  TabContentDirective,
];

@NgModule({
  imports: [CommonModule],
  exports: [...declarations],
  declarations: [...declarations],
})
export class NgxTabModule {}
