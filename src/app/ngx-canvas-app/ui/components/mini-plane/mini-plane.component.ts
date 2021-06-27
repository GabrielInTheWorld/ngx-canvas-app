import { Component, Input } from '@angular/core';
import { PlaneComponent } from '../plane/plane.component';

@Component({
    selector: 'ngx-mini-plane',
    templateUrl: './mini-plane.component.html',
    styleUrls: ['./mini-plane.component.scss']
})
export class MiniPlaneComponent extends PlaneComponent {
    @Input()
    public ngxWidth = '40px';

    @Input()
    public ngxHeight = '40px';
}
