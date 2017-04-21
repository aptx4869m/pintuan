import { Component, OnInit } from '@angular/core';
import {Goods} from '../goods';
import * as wilddog from 'wilddog';

import {AdminService} from '../admin.service';
import {SnackbarService} from '../snackbar.service';

@Component({
  selector: 'app-goods-index',
  templateUrl: './goods-index.component.html',
  styleUrls: ['./goods-index.component.css']
})
export class GoodsIndexComponent implements OnInit {
  goodsKeys: string[] = [];
  wantList: string[] = [];
  hasList: string[] = [];

  showCreateGood: boolean = false;
  currentShowMore: string;

  pageSize: number = 40;
  lastValue: number;
  firstValue: number;
  ref: any;

  get isAdmin() { return this.adminService.isAdmin; }
  get currentUser() {
    return wilddog.auth().currentUser ?
      wilddog.auth().currentUser.uid : null;
  }
  constructor(public adminService: AdminService,
              public snackbar: SnackbarService) { }

  ngOnInit() {
    this.ref = wilddog.sync().ref('goods-list').orderByValue().limitToFirst(this.pageSize);
    this.ref.on('value', (snapshot) => {
      this._addGoods(snapshot);
    });
    wilddog.auth().onAuthStateChanged((user) => {
      if (user) {
        this._fetchGoods();
      }
    })
  }

  nextPage() {
    this.ref.off();
    this.ref = wilddog.sync().ref('goods-list').orderByValue()
      .startAt(this.lastValue).limitToFirst(this.pageSize);
    this.ref.on('value', (snapshot) => {
        this._addGoods(snapshot);
    });
  }

  prevPage() {
    this.ref.off();
    this.ref = wilddog.sync().ref('goods-list').orderByValue()
      .endAt(this.firstValue).limitToLast(this.pageSize);
    this.ref.on('value', (snapshot) => {
        this._addGoods(snapshot);
    });
  }

  _addGoods(snapshot: any) {
    this.goodsKeys = [];
    snapshot.forEach((childSnapshot) => {
      let goodsKey = childSnapshot.key();
      this.goodsKeys.push(goodsKey);

      if (this.goodsKeys.length == 1) {
        this.firstValue = childSnapshot.val();
      }
      if (this.goodsKeys.length === snapshot.numChildren()) {
        this.lastValue = childSnapshot.val();
      }
    });
  }

  _fetchGoods() {
    wilddog.sync().ref('user-goods').child(this.currentUser).child('has')
      .on('value', (snapshot) => {
      this.hasList = [];
      snapshot.forEach((childSnapshot) => {
        this.hasList.push(childSnapshot.key());
      });
    });
    wilddog.sync().ref('user-goods').child(this.currentUser).child('want')
      .on('value', (snapshot) => {
      this.wantList = [];
      snapshot.forEach((childSnapshot) => {
        this.wantList.push(childSnapshot.key());
      });
    });
  }

  addClicked() {
    this.showCreateGood = true;
    window.scrollTo(0, 0)
  }

  has(key: string) {
    return !!key && this.hasList.includes(key);
  }

  want(key: string) {
    return !!key && this.wantList.includes(key);
  }

  setShowMore(key: string, value: boolean) {
    this.currentShowMore = value ? key : null;
  }
}
