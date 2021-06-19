import { NgModule, Type } from '@angular/core';

const modules: any[] | Type<any>[] = [];

@NgModule({
  imports: [...modules],
  exports: [...modules],
})
export class MaterialDesignModule {}
