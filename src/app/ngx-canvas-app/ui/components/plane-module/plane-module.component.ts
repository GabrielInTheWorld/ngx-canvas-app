import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { PlaneService, Plane } from '../../services/plane.service';

@Component({
    selector: 'ngx-plane-module',
    templateUrl: './plane-module.component.html',
    styleUrls: ['./plane-module.component.scss']
})
export class PlaneModuleComponent extends BaseComponent implements OnInit {
    @Input()
    public plane!: Plane;

    @Output()
    public choosePlane = new EventEmitter<Plane>();

    @Output()
    public changeVisibility = new EventEmitter<Plane>();

    public get isActivePlane(): boolean {
        return this.plane.id === this._activePlaneId;
    }

    public get isVisible(): boolean {
        return this.plane.visible as boolean;
    }

    private _activePlaneId: number = 0;

    public constructor(private planeService: PlaneService) {
        super();
    }

    public ngOnInit(): void {
        this.subscriptions.push(
            this.planeService.activePlane.subscribe(activePlaneId => (this._activePlaneId = activePlaneId))
        );
    }

    public onClick(event: Event): void {
        event.stopPropagation();
        event.preventDefault();
        this.choosePlane.emit(this.plane);
    }
}
