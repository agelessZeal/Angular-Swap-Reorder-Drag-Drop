import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {SwapDragComponent} from '../swap-drag/swap-drag.component';

@Component({
  selector: 'app-swap-grid-shower',
  templateUrl: './swap-grid-shower.component.html',
  styleUrls: ['./swap-grid-shower.component.scss']
})
export class SwapGridShowerComponent implements OnInit {

  @ViewChild('listComponent', {static: true}) listComponent: SwapDragComponent;

  public items = [];
  public originalItems = [
    {
      number: 1,
      title: 'Allergies',
      width: 1,
      height: 1,
    },
    {
      number: 2,
      title: 'Current Medications',
      width: 1,
      height: 1,
    },
    {
      number: 3,
      title: 'Tasks/Appointments',
      width: 2,
      height: 1,
    },
    {
      number: 4,
      title: 'Service Authorizations',
      width: 2,
      height: 1,
    },
    {
      number: 5,
      title: 'Diagnoses',
      width: 1,
      height: 1,
    },
    {
      number: 6,
      title: 'Programs',
      width: 1,
      height: 1,
    },
    {
      number: 7,
      title: 'Care Team',
      width: 2,
      height: 1,
    },
    {
      number: 8,
      title: 'Scoring and Outcomes',
      width: 1,
      height: 1,
    },
    {
      number: 9,
      title: 'Waiting Lists',
      width: 1,
      height: 1,
    },
    {
      number: 10,
      title: 'Addt`l Insurance Details',
      width: 1,
      height: 1,
    },
    {
      number: 11,
      title: 'Risk Scores',
      width: 1,
      height: 1,
    },
    {
      number: 12,
      title: 'Care Plan',
      width: 1,
      height: 1,
    },
    {
      number: 13,
      title: 'Medication Management Encounters',
      width: 1,
      height: 1,
    },
  ];

  constructor() { }
  ngOnInit() {
    const localItems = localStorage.getItem('swapDrags');
    if (localItems) {
      const  orders = JSON.parse(localItems);
      this.items = [];
      orders.forEach( item => {
        for ( let index = 0; index < this.originalItems.length ; index ++) {
          const original = this.originalItems[index];
          if (item === original.number) {
            this.items.push(original);
            break;
          }
        }
      });
    } else {
      this.items = this.originalItems;
    }
  }
  OnDestroy() {
    localStorage.setItem('dragItems', JSON.stringify(this.items));
  }
}
