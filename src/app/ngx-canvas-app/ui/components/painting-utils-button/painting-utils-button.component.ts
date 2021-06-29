import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ngx-painting-utils-button',
    templateUrl: './painting-utils-button.component.html',
    styleUrls: ['./painting-utils-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaintingUtilsButtonComponent implements OnInit {
    @Input()
    public label?: string;

    @Input()
    public icon?: string;

    @Input()
    public svgIcon?: string;

    @Input()
    public isActive = false;

    // @Input()
    // public vertical = true;

    // @Output()
    // public clickHandler = new EventEmitter<void>();

    public constructor() {}

    public ngOnInit(): void {}
}
