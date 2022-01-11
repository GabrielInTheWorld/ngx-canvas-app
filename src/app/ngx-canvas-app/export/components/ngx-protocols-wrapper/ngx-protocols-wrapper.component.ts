import { Observable, Subject } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/ngx-canvas-app/ui/base/base.component';
import { DrawDescriptor, EventDescription, PlaneService } from 'src/app/ngx-canvas-app/ui/services/plane.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
    selector: 'ngx-protocols-wrapper',
    templateUrl: './ngx-protocols-wrapper.component.html',
    styleUrls: ['./ngx-protocols-wrapper.component.scss']
})
export class NgxProtocolsWrapperComponent extends BaseComponent implements OnInit {
    public get currentPlaneDrawing(): DrawDescriptor[] {
        return this.planeService.getFullDrawing(this.planeService.activePlane.value);
    }

    // private _currentPlaneId = 0
    public get nextEventObservable(): Observable<EventDescription[]> {
        return this.planeService.nextEventDescription.asObservable();
    }

    public get nextEventDescription(): Subject<EventDescription[]> {
        return this.planeService.nextEventDescription;
    }

    @ViewChild(CdkVirtualScrollViewport)
    private _viewPort?: CdkVirtualScrollViewport;

    public constructor(private planeService: PlaneService) {
        super();
    }

    public ngOnInit(): void {
        this.subscriptions.push(
            this.planeService.nextEventDescription.subscribe(descriptions => {
                // console.log('incoming desccriptions', descriptions);
                // console.log('height of viewport', this._viewPort?.getViewportSize());
                this._viewPort?.scrollToOffset(descriptions.length * 30, 'smooth');
                // this._viewPort?.scrollToIndex(descriptions.length - 1, 'smooth');
            })
        );
    }
}
