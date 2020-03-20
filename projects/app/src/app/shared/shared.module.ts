import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from './components/tab/tab.component';
import { TabPanelComponent } from './components/tab-panel/tab-panel.component';
import { TabTriggerComponent } from './components/tab-trigger/tab-trigger.component';

@NgModule({
  declarations: [TabComponent, TabPanelComponent, TabTriggerComponent],
  imports: [CommonModule],
  exports: [TabComponent, TabPanelComponent, TabTriggerComponent]
})
export class SharedModule {}
