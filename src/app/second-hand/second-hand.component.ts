import { Component, OnDestroy } from '@angular/core';
import { Router} from '@angular/router';
import {SecondHand} from '../second-hand';
import {AdminService} from '../admin.service';
import {SnackbarService} from '../snackbar.service';

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

  isAdmin: boolean = false;

  get currentUser() {
    return wilddog.auth().currentUser;
  }

  constructor(adminService: AdminService,
              public snackbar: SnackbarService,
              router: Router) {
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
    adminService.checkGlobal().then((value) => {
      this.isAdmin = value;
      if (value === true) {
        router.navigateByUrl('./');
      }
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
      if (this.filterItem.uid && item.uid !== this.filterItem.uid) {
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
    if (!this.isAdmin) {
      return;
    }
    this.ref.child(key).remove();
  }

  ngOnDestroy() {
    this.ref.off();
  }

  submit() {
    if (!this.isAdmin) {
      return;
    }
    if (!this.currentItem.price || !this.currentItem.link || !this.currentItem.name || !this.currentItem.user) {
      return;
    }
    if (this.currentKey) {
      this.ref.child(this.currentKey).update(this.currentItem).then((newRef) => {
        this.close();
      }).then((_) => this.snackbar.info('更新成功'))
      .catch((err) => this.snackbar.error(err));
    } else {
      this.ref.push(this.currentItem).then((newRef) => {
        this.currentKey = newRef.key();
        this.currentItem = this.secondHandItems.get(this.currentKey);
        this.close();
      }).then((_) => this.snackbar.info('更新成功'))
      .catch((err) => this.snackbar.error(err));
    }
  }

  close() {
    this.currentItem = null;
    this.currentKey = null;
  }

  addItem() {
    if (!this.isAdmin) {
      return;
    }
    this.currentKey = null;
    this.currentItem = new SecondHand();
    this.currentItem.uid = this.currentUser.uid;
    this.currentItem.user = this.currentUser.displayName;
  }
}
