import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
    selector: 'ngx-canvas',
    template: ` <p>ngx-canvas works!</p> `,
    styles: [],
})
export class NgxCanvasComponent implements OnInit {
    public constructor(@Inject(DOCUMENT) document: Document) {
        document.oncontextmenu = () => false;
    }

    ngOnInit(): void {}
}
