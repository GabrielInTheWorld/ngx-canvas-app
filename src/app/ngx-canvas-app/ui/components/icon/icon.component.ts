import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ngx-icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
    @Input()
    public path!: string;

    public constructor(private host: ElementRef<HTMLElement>) {}

    public ngOnInit(): void {
        this.host.nativeElement.querySelector('svg path')?.setAttribute('d', this.path);
        this.host.nativeElement.querySelector('span.iconify')?.setAttribute('data-icon', this.path);
    }
}
