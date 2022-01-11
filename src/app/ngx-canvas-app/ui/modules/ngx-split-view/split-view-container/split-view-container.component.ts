import { TemplatePortal } from '@angular/cdk/portal';
import { Component, ContentChild, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { SplitViewContentDirective } from '../split-view-content.directive';

@Component({
    selector: 'ngx-split-view-container',
    templateUrl: './split-view-container.component.html',
    styleUrls: ['./split-view-container.component.scss']
})
export class SplitViewContainerComponent implements OnInit {
    @ViewChild(TemplateRef, { static: true })
    public implicitContent: TemplateRef<any> | null = null;
    // public set ngContent(content: TemplateRef<any>) {
    //     console.log('ngContent', content);
    // }

    @ContentChild(SplitViewContentDirective, { read: TemplateRef, static: true })
    public explicitContent: TemplateRef<any> | null = null;

    @Input()
    public minWidth = 60;

    public get content(): TemplateRef<any> | null {
        if (this.explicitContent) {
            return this.explicitContent;
        }
        if (this.implicitContent) {
            return this.implicitContent;
        }
        return null;
    }

    // public get contentPortal(): TemplatePortal | null {
    //     return this._contentPortal;
    // }

    // private _contentPortal: TemplatePortal | null = null;

    public constructor(/* private _viewContainerRef: ViewContainerRef */) {}

    public ngOnInit(): void {
        // let template: TemplateRef<any> | null = null;
        // if (this.explicitContent) {
        //     template = this.explicitContent;
        // } else if (this.implicitContent) {
        //     template = this.implicitContent;
        // }
        // if (template) {
        //     this._contentPortal = new TemplatePortal(template, this._viewContainerRef);
        // }
    }
}
