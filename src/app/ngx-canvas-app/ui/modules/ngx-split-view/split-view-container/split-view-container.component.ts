import { Component, ContentChild, OnInit, TemplateRef } from '@angular/core';
import { SplitViewContentDirective } from '../split-view-content.directive';

@Component({
  selector: 'ngx-split-view-container',
  templateUrl: './split-view-container.component.html',
  styleUrls: ['./split-view-container.component.scss'],
})
export class SplitViewContainerComponent implements OnInit {
  @ContentChild(SplitViewContentDirective, { read: TemplateRef, static: true })
  public content: TemplateRef<any> | null = null;

  constructor() {}

  ngOnInit(): void {}
}
