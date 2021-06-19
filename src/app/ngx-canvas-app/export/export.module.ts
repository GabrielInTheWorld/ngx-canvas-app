import { NgModule, Type } from '@angular/core';
import { UiModule } from '../ui/ui.module';

const declarations: any[] | Type<any>[] = [];

@NgModule({
  imports: [UiModule],
  exports: [...declarations],
  declarations: [...declarations],
})
export class ExportModule {}
