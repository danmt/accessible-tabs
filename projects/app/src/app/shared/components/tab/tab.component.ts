import {
  Component,
  AfterViewInit,
  ContentChildren,
  ElementRef,
  QueryList,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver
} from '@angular/core';
import { TabTriggerComponent } from '../tab-trigger/tab-trigger.component';
import { TabPanelComponent } from '../tab-panel/tab-panel.component';

@Component({
  selector: 'app-tab',
  template: `
    <div class="tabs">
      <div
        role="tablist"
        aria-label="options"
        (keyup)="handleKeyUp($event)"
        (keydown)="handleKeyDown($event)"
        #tabList
      ></div>
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements AfterViewInit {
  @ViewChild('tabList', { read: ViewContainerRef })
  tabTriggersContainer: ViewContainerRef;
  @ContentChildren(TabPanelComponent, { read: ElementRef })
  tabPanels: QueryList<ElementRef>;
  @ContentChildren(TabTriggerComponent, { read: ElementRef })
  tabTriggers: QueryList<ElementRef>;
  tabs: ElementRef[];
  activated = 0;
  focused = 0;
  tabsFocused = false;

  constructor(private cfr: ComponentFactoryResolver) {}

  ngAfterViewInit() {
    this.tabs = this.tabTriggers.toArray();
    this.tabTriggers.first.nativeElement.firstChild.tabIndex = '0';
    this.tabTriggersContainer.clear();
    const componentFactory = this.cfr.resolveComponentFactory(
      TabTriggerComponent
    );
  }

  activatePanel(index: number) {
    this.tabs.forEach(tab => (tab.nativeElement.firstChild.tabIndex = -1));
    this.tabs[index].nativeElement.firstChild.tabIndex = index.toString();
    this.focused = index;
    this.activated = index;
  }

  focusPanel(index: number) {
    this.focused = index;
    this.tabs[this.focused].nativeElement.firstChild.focus();
  }

  handleKeyUp(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft':
        this.focusPanel(this.focused ? this.focused - 1 : this.tabs.length - 1);
        break;
      case 'ArrowRight':
        this.focusPanel((this.focused + 1) % this.tabs.length);
        break;
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Home':
        event.preventDefault();
        this.focusPanel(0);
        break;
      case 'End':
        event.preventDefault();
        this.focusPanel(this.tabTriggers.length - 1);
        break;
    }
  }
}
