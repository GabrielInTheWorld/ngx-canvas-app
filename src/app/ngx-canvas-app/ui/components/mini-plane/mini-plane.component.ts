import { Observable, of } from 'rxjs';
import { Component, Input } from '@angular/core';
import { Plane, PlaneService } from '../../services/plane.service';

@Component({
    selector: 'ngx-mini-plane',
    templateUrl: './mini-plane.component.html',
    styleUrls: ['./mini-plane.component.scss']
})
export class MiniPlaneComponent {
    @Input()
    public plane?: Plane;

    @Input()
    public ngxWidth = '40px';

    @Input()
    public ngxHeight = '40px';

    public get snapshot(): Observable<string> {
        return this.plane ? this.planeService.getSnapshotEvent(this.plane.id) : of('');
    }

    public constructor(private planeService: PlaneService) {}
}
