import { ElementResizeDetectorService } from './../../libraries/element-resize-detector/element-resize-detector.service';
import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

export interface ResizeEvent {
    dimensions: { width: number; height: number };
    element: HTMLElement;
}

@Directive({
    selector: '[ngxResizeDetector]'
})
export class ResizeDetectorDirective implements OnInit, OnDestroy {
    @Output()
    public ngxResizeDetector = new EventEmitter<ResizeEvent>();

    public constructor(private resizeService: ElementResizeDetectorService, private host: ElementRef<HTMLElement>) {}

    public ngOnInit(): void {
        this.resizeService.addResizeEventListener(this.host.nativeElement.parentElement!, element => {
            const { width, height } = element.getBoundingClientRect();
            this.ngxResizeDetector.emit({ dimensions: { width, height }, element });
        });
    }

    public ngOnDestroy(): void {
        this.resizeService.removeResizeEventListener(this.host.nativeElement);
    }
}
