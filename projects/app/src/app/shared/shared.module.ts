import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabPanelComponent } from './components/tab-panel/tab-panel.component';
import { TabTriggerComponent } from './components/tab-trigger/tab-trigger.component';

@NgModule({
  declarations: [TabPanelComponent, TabTriggerComponent],
  imports: [CommonModule],
  exports: [TabPanelComponent, TabTriggerComponent]
})
export class SharedModule {}
