/**
 * The main component that renders single TabComponent
 * instances.
 */

import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  ViewChild,
  ComponentFactoryResolver,
  ViewContainerRef,
} from '@angular/core';

import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'my-tabs',
  template: `
    <ul class="nav nav-tabs splitted justify-content-center">
      <div
        *ngFor="let tab of tabs"
        (click)="selectTab(tab)"
        class="button2 col-md-3"
        [class.active]="tab.active"
        [ngStyle]="{
          'background-color': tab.active ? 'white' : '#6f86d6',
          color: tab.active ? '#6f86d6' : 'white'
        }"
        style="padding: 5px 10px ; border: 1px solid; margin: 0 auto;border-bottom: none; cursor: pointer;"
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <div class="center-this">
          {{ tab.title }}
        </div>
      </div>
    </ul>
    <ng-content></ng-content>
  `,
  styles: [
    `
      .tab-close {
        color: '#ffffff';
        text-align: right;
        cursor: pointer;
      }
      .splitted {
        display: flex;
        justify-content: space-between;
        /* Adding for cross browser support */
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -webkit-justify-content: space-between;
        -ms-flex-pack: justify;
        justify-content: space-between;
      }
      @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
      @keyframes star {
        0% {
          margin-left: -8px;
          margin-top: -8px;
        }
        25% {
          margin-left: 194px;
          margin-top: -8px;
        }
        50% {
          margin-left: 194px;
          margin-top: 75px;
        }
        75% {
          margin-left: -8px;
          margin-top: 75px;
        }
        100% {
          margin-left: -8px;
          margin-top: -8px;
        }
      }

      .button2 {
        position: relative;
        display: inline-block;
        padding: 30px 61px;
        border-radius: 4px;
        color: #6f86d6;
        text-decoration: none;
        overflow: hidden;
        font-family: 'Roboto', sans-serif;
        filter: hue-rotate(0deg);
        border: 2px solid #6f86d6;
        transition: all 0.1s linear;
      }

      @keyframes animate1 {
        0% {
          left: -100%;
        }
        50%,
        100% {
          left: 100%;
        }
      }
      .button2:hover span:nth-child(2) {
        filter: hue-rotate(60deg);
        top: -100%;
        right: 0;
        width: 3px;
        height: 100%;
        background: linear-gradient(180deg, transparent, #3a86ff);
        animation: animate2 1s linear infinite;
        animation-delay: 0.25s;
      }
      @keyframes animate2 {
        0% {
          top: -100%;
        }
        50%,
        100% {
          top: 100%;
        }
      }
      .button2:hover span:nth-child(3) {
        filter: hue-rotate(120deg);
        bottom: 0;
        right: 0;
        width: 100%;
        background: linear-gradient(270deg, transparent, #3a86ff);
        animation: animate3 1s linear infinite;
        animation-delay: 0.5s;
      }
      @keyframes animate3 {
        0% {
          right: -100%;
          height: 3px;
        }
        50%,
        100% {
          height: 2px;
          right: 100%;
        }
      }
      .button2:hover span:nth-child(4) {
        filter: hue-rotate(300deg);
        bottom: -100%;
        left: 0;
        width: 3px;
        height: 100%;
        background: linear-gradient(360deg, transparent, #3a86ff);
        animation: animate4 1s linear infinite;
        animation-delay: 0.75s;
      }
      @keyframes animate4 {
        0% {
          bottom: -100%;
        }
        50%,
        100% {
          bottom: 100%;
        }
      }
    `,
  ],
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    let activeTabs = this.tabs.filter((tab) => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: any) {
    // deactivate all tabs
    this.tabs.toArray().forEach((tab) => (tab.active = false));

    // activate the tab the user has clicked on.
    tab.active = true;
  }
}
