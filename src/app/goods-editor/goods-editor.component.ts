import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Goods} from '../goods';
import * as wilddog from 'wilddog';

import {AdminService} from '../admin.service';
import {SnackbarService} from '../snackbar.service';
@Component({
  selector: 'app-goods-editor',
  templateUrl: './goods-editor.component.html',
  styleUrls: ['./goods-editor.component.css']
})
export class GoodsEditorComponent implements OnInit {
  @Input() isEditMode: boolean = false;
  @Input() want: boolean;
  @Input() has: boolean;
  @Input() showMore: boolean;
  _goodsKey: string;
  goods: Goods = new Goods();

  @Input()
  get goodsKey(): string { return this._goodsKey; }
  set goodsKey(key: string) {
    this._goodsKey = key;
    this._fetchGoods();
  }

  @Output() submitChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() showMoreChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  get isAdmin() { return this.adminService.isAdmin; }
  get currentUser() {
    return wilddog.auth().currentUser ?
      wilddog.auth().currentUser.uid : null;
  }
  constructor(public adminService: AdminService,
              public snackbar: SnackbarService) { }

  ngOnInit() {
  }

  _fetchGoods() {
    if (!this.goodsKey) {
      this.goods = new Goods();
      return;
    }
    wilddog.sync().ref('goods').child(this.goodsKey).once('value', (snapshot) => {
      this.goods = snapshot.val() as Goods;
    });
  }

  markHas() {
    let value = !this.has;
    let ref = wilddog.sync().ref('user-goods')
      .child(this.currentUser).child('has').child(this.goodsKey);
    let action = value ? ref.set(value) : ref.remove();
    action.then((_) => {
      this.snackbar.info('更新成功');
    })
    .catch((err) => this.snackbar.error(err));
  }

  markWant() {
    let value = !this.want;
    let ref = wilddog.sync().ref('user-goods')
      .child(this.currentUser).child('want').child(this.goodsKey);
    let action = value ? ref.set(value) : ref.remove();
    action.then((_) => {
      this.snackbar.info('更新成功');
    })
    .catch((err) => this.snackbar.error(err));
  }

  deleteGoods() {
    if (this.adminService.isAdmin && this.goodsKey) {
      let action = wilddog.sync().ref('goods-list').child(this.goodsKey).remove();
      action.then((_) => {
        this.snackbar.info('更新成功');
      })
      .catch((err) => this.snackbar.error(err));
    }
  }

  close(){
    this.isEditMode = false;
    this._fetchGoods();
    if (!this.goodsKey) {
      this.submitChange.emit();
    }
  }

  addGood() {
    this.isEditMode = false;

    let action;

    if (!this.goodsKey) {
      this.goods.lastModified = wilddog.sync().ServerValue.TIMESTAMP;
      action = wilddog.sync().ref('goods').push(this.goods).then((newRef) => {
        this.goodsKey = newRef.key();
        wilddog.sync().ref('goods-list').child(this.goodsKey).set(true);
      });
    } else {
      action = wilddog.sync().ref('goods').child(this.goodsKey)
        .update(this.goods);
    }
    action.then((_) => {
      this.snackbar.info('更新成功');
      this.submitChange.emit();
    })
    .catch((err) => this.snackbar.error(err));
  }

  get hasClass() {
    return this.has ? 'has-good' : 'no-good'
  }

  get wantClass() {
    return this.want ? 'want-good' : 'no-good'
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
    this.showMoreChange.emit(this.showMore);
  }

  setImage(image: string) {
    wilddog.sync().ref('goods').child(this.goodsKey)
      .child('img').set(image).then((_) => {
        this.snackbar.info('更新成功');
        this.toggleShowMore();
      })
      .catch((err) => this.snackbar.error(err));
  }
}
