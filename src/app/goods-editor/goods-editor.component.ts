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
  @Input() goods: Goods;
  @Input() want: boolean;
  @Input() has: boolean;
  @Input() showMore: boolean;

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

  markHas() {
    let value = !this.has;
    let ref = wilddog.sync().ref('user-goods')
      .child(this.currentUser).child('has').child(this.goods.key);
    let action = value ? ref.set(value) : ref.remove();
    action.then((_) => {
      this.snackbar.info('更新成功');
    })
    .catch((err) => this.snackbar.error(err));
  }

  markWant() {
    let value = !this.want;
    let ref = wilddog.sync().ref('user-goods')
      .child(this.currentUser).child('want').child(this.goods.key);
    let action = value ? ref.set(value) : ref.remove();
    action.then((_) => {
      this.snackbar.info('更新成功');
    })
    .catch((err) => this.snackbar.error(err));
  }

  deleteGoods() {
    if (this.adminService.isAdmin && this.goods.key) {
      let action = wilddog.sync().ref('goods').child(this.goods.key).remove();
      action.then((_) => {
        this.snackbar.info('更新成功');
      })
      .catch((err) => this.snackbar.error(err));

    }
  }

  addGood() {
    this.isEditMode = false;

    let action;
    if (!this.goods.key) {
      action = wilddog.sync().ref('goods').push(this.goods);
    } else {
      action = wilddog.sync().ref('goods').child(this.goods.key)
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
    wilddog.sync().ref('goods').child(this.goods.key)
      .child('img').set(image).then((_) => {
        this.snackbar.info('更新成功');
        this.toggleShowMore();
      })
      .catch((err) => this.snackbar.error(err));
  }
}
