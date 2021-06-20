import { Component, ContentChild, OnInit, TemplateRef } from '@angular/core';
import { TabContentDirective } from '../tab-content.directive';
import { TabLabelDirective } from '../tab-label.directive';

@Component({
  selector: 'ngx-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent implements OnInit {
  @ContentChild(TabContentDirective, { read: TemplateRef, static: true })
  public tabContentRef: TemplateRef<any> | null = null;

  @ContentChild(TabLabelDirective, { read: TemplateRef, static: true })
  public tabLabelRef: TemplateRef<any> | null = null;

  constructor() {}

  ngOnInit(): void {}
}
