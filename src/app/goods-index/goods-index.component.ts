import { Component, OnInit } from '@angular/core';
import {Goods} from '../goods';
import * as wilddog from 'wilddog';

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
  editGoods: Goods;

  get currentUser() {
    return wilddog.auth().currentUser ?
      wilddog.auth().currentUser.uid : null;
  }
  constructor() { }

  ngOnInit() {
    wilddog.sync().ref('goods').on('value', (snapshot) => {
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

  markHas(key: string) {
    let value = !this.hasList.includes(key);
    let ref = wilddog.sync().ref('user-goods')
      .child(this.currentUser).child('has').child(key);
    value ? ref.set(value) : ref.remove();
  }

  markWant(key: string) {
    let value = !this.wantList.includes(key);
    let ref = wilddog.sync().ref('user-goods')
      .child(this.currentUser).child('want').child(key);
    value ? ref.set(value) : ref.remove();
  }

  addGood() {
    this.showCreateGood = false;

    if (!this.editGoods.key) {
      wilddog.sync().ref('goods').push(this.editGoods);
    } else {
      wilddog.sync().ref('goods').child(this.editGoods.key)
        .update(this.editGoods);
    }
  }

  hasClass(key: string) {
    return !!key && this.hasList.includes(key) ? 'has-good' : 'no-good'
  }

  wantClass(key: string) {
    return !!key && this.wantList.includes(key) ? 'want-good' : 'no-good'
  }
}
