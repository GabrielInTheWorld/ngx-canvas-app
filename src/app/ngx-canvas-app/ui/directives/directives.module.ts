import { ResizeDetectorDirective } from './resize-detector/resize-detector.directive';
import { NgModule, Type } from '@angular/core';

const declarations: any[] | Type<any>[] = [ResizeDetectorDirective];

@NgModule({
    declarations: declarations,
    exports: declarations
})
export class DirectivesModule {}
