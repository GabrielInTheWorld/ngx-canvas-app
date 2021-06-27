import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CanvasService, Plane } from '../../services/canvas.service';

@Component({
    selector: 'ngx-plane-handler',
    templateUrl: './plane-handler.component.html',
    styleUrls: ['./plane-handler.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaneHandlerComponent implements OnInit {
    public planes: Plane[] = [];

    private nextId = 1;

    constructor(private canvasService: CanvasService) {}

    ngOnInit(): void {
        this.canvasService.planes.subscribe(planes => (this.planes = planes));
    }

    public onAdd(): void {
        for (let i = 0; i < 500; ++i) {
            const temp = this.planes;
            const currentIndex = this.nextId++;
            temp.unshift({
                id: currentIndex,
                width: 600,
                height: 600,
                visible: true,
                index: currentIndex
            });
            this.canvasService.planes.next(temp);
        }
    }

    public onDrop(event: CdkDragDrop<Plane[], Plane>): void {
        const temp = this.planes;
        moveItemInArray(temp, event.previousIndex, event.currentIndex);
        this.sortPlanes(temp);
        this.canvasService.planes.next(temp);
    }

    public onClick(event: Plane): void {
        this.canvasService.activePlane.next(event.id);
    }

    public onChangeVisibility(event: Plane): void {
        const plane = this.canvasService.planes.value.find(plane => event.id === plane.id);
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
