import { Component, OnInit } from '@angular/core';

export interface UtilsButton {
    label: string;
    onClick?: (mode: any) => void;
    mode: any;
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
            mode: 'pen',
            // onClick: mode => this.planeDrawService.setDrawingMode(mode),
            icon: 'create'
        },
        {
            label: 'Radiergummi',
            mode: 'eraser',
            // onClick: mode => this.planeDrawService.setDrawingMode(mode),
            // svgIcon: mdiEraser
            svgIcon: 'mdi-eraser'
        },
        {
            label: 'Rechteck',
            mode: 'rect',
            // icon: 'crop_16_9'
            svgIcon: 'mdi-rectangle-outline'
        },
        {
            label: 'Ellipse',
            mode: 'circle',
            // icon: 'circle'
            svgIcon: 'mdi-ellipse-outline'
        },
        {
            label: 'Seite leeren',
            mode: 'delete',
            // onClick: () => {
            //     this.planeDrawService.clearSite();
            //     this.planeDrawService.setDrawingMode('pen');
            // },
            icon: 'delete_outline'
        }
    ];

    // @Input()
    // public vertical = true;

    public constructor(/* private planeDrawService: PlaneDrawService */) {}

    public ngOnInit(): void {}

    // public isDrawingMode(mode: DrawingMode): boolean {
    //     return this.planeDrawService.currentDrawingMode === mode;
    // }
}
