import { Component, OnInit } from '@angular/core';
import { ColorService } from '../../services/color.service';

@Component({
    selector: 'ngx-painting-utils-color-chooser',
    templateUrl: './painting-utils-color-chooser.component.html',
    styleUrls: ['./painting-utils-color-chooser.component.scss']
})
export class PaintingUtilsColorChooserComponent implements OnInit {
    // @Input()
    // public vertical = true;

    public get currentColor(): string {
        return this.colorService.currentColor;
    }

    public secondColor = '#FFF';

    public constructor(private colorService: ColorService) {}

    public ngOnInit(): void {}
}
