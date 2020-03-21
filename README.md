# Accessible Tabs in Angular

This article intention is to guide the reader through the process of building a Tab interface that complies with the WAI-ARIA 1.1 Specification. I know that sounds scary, but this is just one of those things that's way easier than it sounds.

## The Problem

When we are working with an user interface, sometimes we have too much content for the space available, that's when we have to be clever and find a way to make easy to use a big chunk of information.

## The Solution

We could solve the problem by dividing the big chunk into smaller chunks, then we can show a single chunk at a time and allow users to jump between the different chunks available. And Voila! Suddenly we need to build a tab interface.

## The Implementation

If you've been reading the Make it Accessible series you probably know the first step. If you don't just go to this page [WAI-ARIA Practices](https://www.w3.org/TR/wai-aria-practices-1.1). That's basically the holy grail, if you want to make your apps more accessible, that site is going to be your best friend from now on.

As you can see, they list a bunch of common widgets for user interfaces, the one we're looking for is **Tabs**. Which is under the number **3.22** or access directly to [Tabs Section of the WAI-ARIA Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#tabpanel).

The first thing to notice is they describe the terms used:

- Tabs or Tabbed Interface: A set of tab elements and their associated tab panels.
- Tab List: A set of tab elements contained in a tablist element.
- Tab: An element in the tab list that serves as a label for one of the tab panels and can be activated to display that panel.
- Tabpanel: The element that contains the content associated with a tab.

There's also a list of **Keyboard Interactions** and a few examples. Sadly, all the examples in the WAI-ARIA specification are in plain HTML + Javascript, that's why I decided to start writing an article for each of the available widgets built with Angular.

> Enough talk

Let's start by generating a new application, you can do that by using the Angular CLI. For this project I'm using the version 9.0.5. Just open your terminal of choice and type `ng new ng-tabs` and the Angular CLI will take care of creating all the files you need for your application.

Next we are going to generate the first module named `SharedModule`. For this we'll go back to the Angular CLI, while in your terminal of choice, go to the project's folder and type `ng g module shared`. It will generate the module for you, you'll need to import it in your `src/app/app.module.ts` file like this:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, SharedModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

Thanks to the SharedModule, now we can create and export any component and use it across the application. Let's create a component for each of the core concepts behind tabs, one for a tab (I'll call this tab trigger from now on) and a tabpanel.

### Tab Trigger

We'll need a new component to hold the each tab trigger's logic, this way we can abstract some of the implementation details and make it easier to use later on. For creating this component we're going to use the Angular CLI again, using your terminal, go to the project folder and type `ng g component shared/components/tab-trigger --style=scss --export --inlineTemplate`. With that command a new component will be generated and automatically exported in the SharedModule.

Now let's customize the new component, open the `src/app/shared/components/tab-trigger/tab-trigger.component.ts`:

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab-trigger',
  template: `
    <button
      [id]="triggerId"
      role="tab"
      [attr.aria-controls]="panelId"
      [attr.aria-selected]="isActive"
      tabindex="-1"
    >
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./tab-trigger.component.scss']
})
export class TabTriggerComponent {
  @Input() isActive: boolean;
  @Input() triggerId: string;
  @Input() panelId: string;
}
```

And now let's integrate the styles, open the `src/app/shared/components/tab-trigger/tab-trigger.component.scss`:

```scss
button {
  position: relative;
  margin: 0;
  padding: 0.3em 0.5em 0.4em;
  border: 1px solid hsl(219, 1%, 72%);
  border-radius: 0.2em 0.2em 0 0;
  box-shadow: 0 0 0.2em hsl(219, 1%, 72%);
  overflow: visible;
  font-family: inherit;
  font-size: inherit;
  background: hsl(220, 20%, 94%);

  &:hover::before,
  &:focus::before,
  &[aria-selected='true']::before {
    position: absolute;
    bottom: 100%;
    right: -1px;
    left: -1px;
    border-radius: 0.2em 0.2em 0 0;
    border-top: 3px solid hsl(20, 96%, 48%);
    content: '';
  }

  &[aria-selected='true'] {
    border-radius: 0;
    background: hsl(220, 43%, 99%);
    outline: 0;
  }

  &[aria-selected='true']:not(:focus):not(:hover)::before {
    border-top: 5px solid hsl(218, 96%, 48%);
  }

  &[aria-selected='true']::after {
    position: absolute;
    z-index: 3;
    bottom: -1px;
    right: 0;
    left: 0;
    height: 0.3em;
    background: hsl(220, 43%, 99%);
    box-shadow: none;
    content: '';
  }

  &:hover,
  &:focus,
  &:active {
    outline: 0;
    border-radius: 0;
    color: inherit;
  }

  &:hover::before,
  &:focus::before {
    border-color: hsl(20, 96%, 48%);
  }
}
```

### Tab Panel

We'll need a new component to hold the each tab's panel, just like with the triggers, this way we can abstract some of the implementation details and make it easier to use later on. For creating this component we're going to use the Angular CLI again, using your terminal, go to the project folder and type `ng g component shared/components/tab-panel --style=scss --export --inlineTemplate`. With that command a new component will be generated and automatically exported in the SharedModule.

Now let's customize the new component, open the `src/app/shared/components/tab-panel/tab-panel.component.ts`:

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab-panel',
  template: `
    <div
      [id]="panelId"
      role="tabpanel"
      [attr.aria-labelledby]="triggerId"
      tabindex="0"
    >
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./tab-panel.component.scss']
})
export class TabPanelComponent {
  @Input() panelId: string;
  @Input() triggerId: string;
}
```

And now let's integrate the styles, open the `src/app/shared/components/tab-panel/tab-panel.component.scss`:

### Finish it

All we have left is to use our new components, since this is an example I will use it directly in the AppComponent, go to `src/app/app.component.ts`:

```typescript
import {
  Component,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { TabTriggerComponent } from './shared/components/tab-trigger/tab-trigger.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChildren(TabTriggerComponent, { read: ElementRef })
  tabElements: QueryList<ElementRef>;
  tabs: ElementRef[];
  activated = 0;
  focused = 0;

  ngAfterViewInit() {
    this.tabs = this.tabElements.toArray();
    this.tabElements.first.nativeElement.firstChild.tabIndex = '0';
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
        this.focusPanel(this.tabElements.length - 1);
        break;
    }
  }
}
```

Let walk through this component:

- We're using @ViewChildren to get all the TabTriggerComponent instances.
- Using the AfterViewInit life cycle, I get a clone of the component instances and set `tabindex=0` to the first one.
- A method activatePanel used when any of the triggers is clicked.
- A method focusPanel triggering the focus in the Button Element.
- A method handleKeyUp and handleKeyDown, we separate them because Home and End keys have a default behavior that needs to be prevented.

Now open the template in `src/app/app.component.html`:

```html
<main>
  <div class="tabs">
    <div
      role="tablist"
      aria-label="options"
      (keyup)="handleKeyUp($event)"
      (keydown)="handleKeyDown($event)"
    >
      <app-tab-trigger
        triggerId="trigger-a"
        panelId="panel-a"
        [isActive]="activated === 0"
        (click)="activatePanel(0)"
      >
        Panel A
      </app-tab-trigger>
      <app-tab-trigger
        triggerId="trigger-b"
        panelId="panel-b"
        [isActive]="activated === 1"
        (click)="activatePanel(1)"
      >
        Panel B
      </app-tab-trigger>
      <app-tab-trigger
        triggerId="trigger-c"
        panelId="panel-c"
        [isActive]="activated === 2"
        (click)="activatePanel(2)"
      >
        Panel C
      </app-tab-trigger>
    </div>

    <app-tab-panel
      *ngIf="activated === 0"
      panelId="panel-a"
      triggerId="trigger-a"
    >
      <p>Panel A</p>
    </app-tab-panel>
    <app-tab-panel
      *ngIf="activated === 1"
      panelId="panel-b"
      triggerId="trigger-b"
    >
      <p>Panel B</p>
    </app-tab-panel>
    <app-tab-panel
      *ngIf="activated === 2"
      panelId="panel-c"
      triggerId="trigger-c"
    >
      <p>Panel C</p>
    </app-tab-panel>
  </div>
</main>
```

And the final styles to the AppComponent, open `src/app/app.component.scss`:

```scss
.tabs {
  width: 20em;
}

[role='tablist'] {
  margin: 0 0 -0.1em;
  overflow: visible;
}
```

## Conclusion

As simple as that we were able to replicate the WAI-ARIA spec for Tabs using a component oriented approach with Angular's help. I heavily based my implementation in the one found in the spec, my goal was primarily to show how easy is to use Angular concepts to build such a feature. If you encounter any issues while trying to do this, drop a comment below.
