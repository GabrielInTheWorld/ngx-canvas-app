import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ContentChildren, ElementRef, QueryList } from '@angular/core';
import { SplitViewContainerComponent } from '../split-view-container/split-view-container.component';

@Component({
    selector: 'ngx-split-view',
    templateUrl: './split-view.component.html',
    styleUrls: ['./split-view.component.scss']
})
export class SplitViewComponent implements AfterViewInit {
    @ContentChildren(SplitViewContainerComponent)
    public containers!: QueryList<SplitViewContainerComponent>;

    private containerElementsHeight: number[] = [];

    constructor(private host: ElementRef<HTMLElement>) {}

    public ngAfterViewInit(): void {
        const containerElements = this.host.nativeElement.querySelectorAll<HTMLElement>('.view-container');
        const maxHeight = this.host.nativeElement.clientHeight - (containerElements.length - 1) * 26;
        const containerHeight = maxHeight / containerElements.length;
        containerElements.forEach(container => {
            container.style.height = `${containerHeight}px`;
        });
        containerElements.forEach(container =>
            this.containerElementsHeight.push(container.getBoundingClientRect().height)
        );
    }

    public onDragMove(event: CdkDragMove, index: number): void {
        const containerOne = this.host.nativeElement.querySelector<HTMLElement>(`#view-container--${index}`);
        const containerTwo = this.host.nativeElement.querySelector<HTMLElement>(`#view-container--${index + 1}`);
        event.source.element.nativeElement.style.transform = `translate3d(0,0,0)`;
        if (containerOne && containerTwo) {
            const heightOne = this.containerElementsHeight[index] + event.distance.y;
            const heightTwo = this.containerElementsHeight[index + 1] - event.distance.y;
            if (heightOne >= 60 && heightTwo >= 60) {
                containerOne.style.height = `${heightOne}px`;
                containerTwo.style.height = `${heightTwo}px`;
            }
        }
    }

    public dragEnd(event: CdkDragEnd, index: number): void {
        this.containerElementsHeight[index] += event.distance.y;
        this.containerElementsHeight[index + 1] -= event.distance.y;
        const containerOne = this.host.nativeElement.querySelector<HTMLElement>(`#view-container--${index}`);
        const containerTwo = this.host.nativeElement.querySelector<HTMLElement>(`#view-container--${index + 1}`);
        if (containerOne && containerTwo) {
            const heightOne = this.containerElementsHeight[index];
            const heightTwo = this.containerElementsHeight[index + 1];
            if (heightOne >= 60 && heightTwo >= 60) {
                containerOne.style.height = `${heightOne}px`;
                containerTwo.style.height = `${heightTwo}px`;
            }
        }
    }
}
