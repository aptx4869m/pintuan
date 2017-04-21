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
  goods: Goods[] = [];
  wantList: string[] = [];
  hasList: string[] = [];

  showCreateGood: boolean = false;
  editGoods: Goods = new Goods();
  currentShowMore: string;

  get isAdmin() { return this.adminService.isAdmin; }
  get currentUser() {
    return wilddog.auth().currentUser ?
      wilddog.auth().currentUser.uid : null;
  }
  constructor(public adminService: AdminService,
              public snackbar: SnackbarService) { }

  ngOnInit() {
    wilddog.sync().ref('goods').orderByChild('lastModified').limitToLast(150).on('value', (snapshot) => {
      this.goods = [];

      snapshot.forEach((childSnapshot) => {
        let good = childSnapshot.val();
        good.key = childSnapshot.key();
        this.goods.push(good);
      });
    });
    wilddog.auth().onAuthStateChanged((user) => {
      if (user) {
        this._fetchGoods();
      }
    })
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

  addGood() {
    this.showCreateGood = false;

    if (!this.editGoods.key) {
      wilddog.sync().ref('goods').push(this.editGoods);
    } else {
      wilddog.sync().ref('goods').child(this.editGoods.key)
        .update(this.editGoods);
    }
    this.editGoods = new Goods();
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
