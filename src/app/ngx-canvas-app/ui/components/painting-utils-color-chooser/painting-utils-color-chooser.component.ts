import { Component } from '@angular/core';
import { ColorService } from '../../services/color.service';

const DEFAULT_SECOND_COLOR = '#FFF';
const DEFAULT_FIRST_COLOR = '#000';

@Component({
    selector: 'ngx-painting-utils-color-chooser',
    templateUrl: './painting-utils-color-chooser.component.html',
    styleUrls: ['./painting-utils-color-chooser.component.scss']
})
export class PaintingUtilsColorChooserComponent {
    public get currentColor(): string {
        return this.colorService.currentColor;
    }

    public secondColor = DEFAULT_SECOND_COLOR;

    public constructor(private colorService: ColorService) {}

    public switchColors(): void {
        const tempColor = this.secondColor;
        this.secondColor = this.currentColor;
        this.colorService.colorSubject.next(tempColor);
    }

    public resetColors(): void {
        this.secondColor = DEFAULT_SECOND_COLOR;
        this.colorService.colorSubject.next(DEFAULT_FIRST_COLOR);
    }
}
