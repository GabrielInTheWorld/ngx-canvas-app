import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ngx-icon-button',
    templateUrl: './icon-button.component.html',
    styleUrls: ['./icon-button.component.scss']
})
export class IconButtonComponent implements OnInit {
    @Input()
    public rotate: string = '0';

    public constructor() {}

    public ngOnInit(): void {}

    public getRotation(): string {
        return `rotate(${this.rotate}deg)`;
    }
}
