import { Component, OnInit } from '@angular/core';
import { DrawingMode, PlaneService } from 'src/app/ngx-canvas-app/ui/services/plane.service';

export interface UtilsButton {
    label: string;
    onClick?: (mode: DrawingMode) => void;
    mode: DrawingMode;
    icon?: string;
    svgIcon?: string;
}

@Component({
    selector: 'ngx-painting-utils-wrapper',
    templateUrl: './ngx-painting-utils-wrapper.component.html',
    styleUrls: ['./ngx-painting-utils-wrapper.component.scss']
})
export class NgxPaintingUtilsWrapperComponent implements OnInit {
    public readonly utilsButtons: UtilsButton[] = [
        {
            label: 'Stift',
            mode: DrawingMode.PEN,
            onClick: mode => this.planeService.drawingModeEvent.next(mode),
            icon: 'create'
        },
        {
            label: 'Radiergummi',
            mode: DrawingMode.ERASER,
            onClick: mode => this.planeService.drawingModeEvent.next(mode),
            svgIcon: 'mdi-eraser'
        },
        {
            label: 'Rechteck',
            mode: DrawingMode.RECTANGLE,
            onClick: mode => this.planeService.drawingModeEvent.next(mode),
            svgIcon: 'mdi-rectangle-outline'
        },
        {
            label: 'Ellipse',
            mode: DrawingMode.CIRCLE,
            onClick: mode => this.planeService.drawingModeEvent.next(mode),
            svgIcon: 'mdi-ellipse-outline'
        },
        {
            label: 'Seite leeren',
            mode: DrawingMode.DELETE,
            onClick: () => {
                this.planeService.clearSiteEvent.next();
                this.planeService.drawingModeEvent.next(DrawingMode.PEN);
            },
            icon: 'delete_outline'
        }
    ];

    // @Input()
    // public vertical = true;

    public constructor(private planeService: PlaneService) {}

    public ngOnInit(): void {}

    public onClick(button: UtilsButton): void {
        if (button.onClick) {
            button.onClick(button.mode);
        }
    }

    public isDrawingMode(mode: DrawingMode): boolean {
        return this.planeService.drawingModeEvent.value === mode;
    }
}
