import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PlaneService, Plane } from '../../services/plane.service';

@Component({
    selector: 'ngx-plane-handler',
    templateUrl: './plane-handler.component.html',
    styleUrls: ['./plane-handler.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaneHandlerComponent implements OnInit {
    public planes: Plane[] = [];

    constructor(private planeService: PlaneService, private cd: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.planeService.planes.subscribe(planes => {
            this.planes = planes;
            this.cd.markForCheck();
        });
    }

    public onAdd(): void {
        this.planeService.addPlane();
    }

    public onAdd500(): void {
        this.planeService.addPlane(500);
    }

    public onDrop(event: CdkDragDrop<Plane[], Plane>): void {
        const temp = this.planes;
        moveItemInArray(temp, event.previousIndex, event.currentIndex);
        this.sortPlanes(temp);
        this.planeService.planes.next(temp);
    }

    public onClick(event: Plane): void {
        this.planeService.activePlane.next(event.id);
    }

    public onChangeVisibility(event: Plane): void {
        const plane = this.planeService.planes.value.find(plane => event.id === plane.id);
        if (plane) {
            plane.visible = !plane.visible;
        }
    }

    private sortPlanes(planes: Plane[]): Plane[] {
        let index = planes.length - 1;
        for (const plane of planes) {
            plane.index = index--;
        }
        return planes;
    }
}
