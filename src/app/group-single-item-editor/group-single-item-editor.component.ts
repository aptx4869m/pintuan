import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {MdSnackBar} from '@angular/material';
import * as wilddog from 'wilddog';
import {Item} from '../item';


@Component({
  selector: 'app-group-single-item-editor',
  templateUrl: './group-single-item-editor.component.html',
  styleUrls: ['./group-single-item-editor.component.css']
})
export class GroupSingleItemEditorComponent {
  _item: Item;
  _oldItem: Item;
  @Input()
  get item() { return this._item; }
  set item(value: Item) {
    this._item = value;
    this._oldItem = new Item(value.name);
    this._oldItem.img = value.img;
    this._oldItem.price = value.price;
    this._oldItem.stock = value.stock;
    this._oldItem.total = value.total;

  }
  @Input() itemKey: string;
  @Input() isOwner: boolean;
  @Input() groupKey: string;
  @Input() isEditMode: boolean = false;

  @Output()
  submitChange: EventEmitter<null> = new EventEmitter<null>();

  constructor(public snackbar: MdSnackBar) { }

  ngOnInit() {
  }

  delete() {
    wilddog.sync().ref('groups').child(this.groupKey).child('items')
      .child(this.itemKey).set(null).then(() => {
        this.snackbar.open(`成功删除`, null, {duration: 2000});
      }).catch((err) =>
        this.snackbar.open(`错误: ${err}`, null, {duration: 2000})
      );
  }

  edit() {
    this.isEditMode = true;
  }

  submit() {
    if (!this.item.name) return;
    let ref = wilddog.sync().ref('groups').child(this.groupKey).child('items')
      .child(this.itemKey).update(this.item).then((_) => {
      this.snackbar.open(`成功更新`, null, {duration: 2000});
      this.close();
      this.submitChange.emit();
    }).catch((err) => this.snackbar.open(`错误: ${err}`, null, {duration: 2000}));
  }

  close() {
    this._item.name = this._oldItem.name;
    this._item.img = this._oldItem.img;
    this._item.price = this._oldItem.price;
    this._item.stock = this._oldItem.stock;
    this._item.total = this._oldItem.total;
    this.isEditMode = false;
  }
}
