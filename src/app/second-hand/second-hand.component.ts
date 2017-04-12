import { Component, OnDestroy } from '@angular/core';
import {SecondHand} from '../second-hand';
import * as wilddog from 'wilddog';



@Component({
  selector: 'app-second-hand',
  templateUrl: './second-hand.component.html',
  styleUrls: ['./second-hand.component.css']
})
export class SecondHandComponent implements OnDestroy {
  pays = [
    {code: null, name: '未结算'},
    {code: 'japan', name: '已跟代购结算'},
    {code: 'china', name: '已付清'}];

  deliveries = [
    {code: null, name: '未送达'},
    {code: 'japan', name: '已到日本代购'},
    {code: 'china', name: '已到中国'},
    {code: 'final', name: '已到手'}
  ];
  ref: any = wilddog.sync().ref('second-hands');
  keys: string[] = [];
  secondHandItems: Map<string, SecondHand> = new Map<string, SecondHand>();
  filteredKeys: string[] = [];
  currentItem: SecondHand;
  currentKey: string;
  filterItem: SecondHand = new SecondHand();
  totalPrice: number = 0;
  totalCount: number = 0;
  expanded: boolean = false;

  constructor() {
    this.ref.on('value', (snapshot) => {
      this.secondHandItems.clear();
      this.keys = [];
      snapshot.forEach((childSnapshot) => {
        let item = childSnapshot.val() as SecondHand;
        this.secondHandItems.set(childSnapshot.key(), item);
        this.keys.push(childSnapshot.key());
        this.filteredKeys = this.keys.slice();
      });
    });
  }

  filter() {
    this.filteredKeys = [];
    this.totalPrice = 0;
    this.totalCount = 0;
    for (let key of this.keys) {
      let item = this.secondHandItems.get(key);
      if (this.filterItem.name && item.name.indexOf(this.filterItem.name) < 0) {
        continue;
      }
      if (this.filterItem.user && item.user !== this.filterItem.user) {
        continue;
      }
      if (this.filterItem.price && item.price !== this.filterItem.price) {
        continue;
      }
      if (this.filterItem.link && item.link !== this.filterItem.link) {
        continue;
      }
      if (this.filterItem.delivered && item.delivered !== this.filterItem.delivered) {
        continue;
      }
      if (this.filterItem.paid && item.paid !== this.filterItem.paid) {
        continue;
      }
      this.filteredKeys.push(key);
      if (item.price) this.totalPrice += item.price;
      this.totalCount += 1;
    }
  }

  editItem(key: string) {
    this.currentItem = this.secondHandItems.get(key);
    this.currentKey = key;
  }

  getDelivered(key: string) {
    let value = this.secondHandItems.get(key).delivered;
    for (let v of this.deliveries) {
      if (v.code === value) return v.name;
    }
  }

  getPaid(key: string) {
    let value = this.secondHandItems.get(key).paid;
    for (let v of this.pays) {
      if (v.code === value) return v.name;
    }
  }

  deleteItem(key: string) {
    this.ref.child(key).remove();
  }

  ngOnDestroy() {
    this.ref.off();
  }

  submit() {
    if (!this.currentItem.price || !this.currentItem.link || !this.currentItem.name || !this.currentItem.user) {
      return;
    }
    if (this.currentKey) {
      this.ref.child(this.currentKey).update(this.currentItem).then((newRef) => {
        this.close();
      });
    } else {
      this.ref.push(this.currentItem).then((newRef) => {
        this.currentKey = newRef.key();
        this.currentItem = this.secondHandItems.get(this.currentKey);
        this.close();
      });
    }
  }

  close() {
    this.currentItem = null;
    this.currentKey = null;
  }

  addItem() {
    this.currentKey = null;
    this.currentItem = new SecondHand();
  }
}