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
  displayKeys: string[] = [];
  wantList: string[] = [];
  hasList: string[] = [];

  currentKeys: string[] = [];
  options = ['all', 'has', 'want'];
  currentOption = 'all';

  showCreateGood: boolean = false;
  currentShowMore: string;

  pageSize: number = 40;
  currentPage: number = 0;
  numbers: number[];
  ref: any;

  get isAdmin() { return this.adminService.isAdmin; }
  get currentUser() {
    return wilddog.auth().currentUser ?
      wilddog.auth().currentUser.uid : null;
  }
  constructor(public adminService: AdminService,
              public snackbar: SnackbarService) { }

  switchOption(option: string) {
    if (option != this.currentOption) {
      this.currentOption = option;
      switch(option) {
        case 'all':
          this.currentKeys = this.goodsKeys;
          break;
        case 'has':
          this.currentKeys = this.hasList;
          break;
        case 'want':
          this.currentKeys = this.wantList;
          break;
      }
      this.buildPageNumbers();
      this.goToPage(0);
    }
  }
  ngOnInit() {
    this.ref = wilddog.sync().ref('goods-list').orderByValue();
    this.ref.on('value', (snapshot) => {
      this._addGoods(snapshot);
    });
    wilddog.auth().onAuthStateChanged((user) => {
      if (user) {
        this._fetchGoods();
      }
    })
  }

  goToPage(i: number) {
    this.currentPage = i;
    let start = this.currentPage * this.pageSize;
    this.displayKeys = this.currentKeys.slice(start, start + this.pageSize);
  }

  _addGoods(snapshot: any) {
    this.goodsKeys = [];
    this.numbers = [];
    snapshot.forEach((childSnapshot) => {
      let goodsKey = childSnapshot.key();
      this.goodsKeys.push(goodsKey);
    });
    this.goodsKeys = this.goodsKeys.reverse();

    if (this.currentOption == 'all') {
      this.currentKeys = this.goodsKeys;
      this.buildPageNumbers();
      this.goToPage(this.currentPage);

    }
  }

  buildPageNumbers() {
    this.numbers = [];
    for (let i = 0; i <= (this.currentKeys.length / this.pageSize); i++) {
      if (i * this.pageSize < this.currentKeys.length) {
        this.numbers.push(i);
      }
    }
  }

  _fetchGoods() {
    wilddog.sync().ref('user-goods').child(this.currentUser).child('has')
      .on('value', (snapshot) => {
      this.hasList = [];
      snapshot.forEach((childSnapshot) => {
        this.hasList.push(childSnapshot.key());
      });
      this.hasList = this.hasList.reverse();
      if (this.currentOption == 'has') {
        this.currentKeys = this.hasList;
        this.buildPageNumbers();
        this.goToPage(this.currentPage);
      }
    });
    wilddog.sync().ref('user-goods').child(this.currentUser).child('want')
      .on('value', (snapshot) => {
      this.wantList = [];
      snapshot.forEach((childSnapshot) => {
        this.wantList.push(childSnapshot.key());
      });
      this.wantList = this.wantList.reverse();
      if (this.currentOption == 'want') {
        this.currentKeys = this.wantList;
        this.buildPageNumbers();
        this.goToPage(this.currentPage);
      }
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
