import {
  AfterViewInit,
  Component,
  ContentChildren,
  Input,
  OnInit,
  QueryList,
} from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'ngx-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.scss'],
})
export class TabGroupComponent implements OnInit, AfterViewInit {
  @ContentChildren(TabComponent, { descendants: true })
  public set tabs(tabs: QueryList<TabComponent>) {
    this._tabs = tabs;
  }

  public get tabs(): QueryList<TabComponent> {
    return this._tabs;
  }

  @Input()
  public roundedCorners = false;

  public selectedIndex = 0;
  public selectedTab?: TabComponent = this.tabs?.get(0);

  private _tabs!: QueryList<TabComponent>;

  constructor() {}

  ngOnInit(): void {}

  public ngAfterViewInit(): void {
    if (this.tabs?.get(0)) {
      setTimeout(() => this.onSelectTab(0, this.tabs.get(0)!));
    }
  }

  public onSelectTab(index: number, tab: TabComponent): void {
    this.selectedIndex = index;
    this.selectedTab = tab;
  }

  public isTabSelected(index: number): boolean {
    return this.selectedIndex === index;
  }
}
