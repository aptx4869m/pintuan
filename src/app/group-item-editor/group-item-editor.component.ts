import { Component, OnDestroy, Input } from '@angular/core';
import {MdSnackBar} from '@angular/material'
import * as wilddog from 'wilddog';
import {Item} from '../item';


@Component({
  selector: 'app-group-item-editor',
  templateUrl: './group-item-editor.component.html',
  styleUrls: ['./group-item-editor.component.css']
})
export class GroupItemEditorComponent implements OnDestroy {
  ref: any;
  _key: string;
  editItem: Item;
  items: Map<string, Item> = new Map<string, Item>();
  itemKeys: string[] = [];
  currentKey: string;
  @Input() isOwner: boolean = false;

  constructor(public snackbar: MdSnackBar) { }

  ngOnDestroy() {
    this.ref.off();
  }

  @Input()
  get key(): string {
    return this._key;
  }
  set key(value: string) {
    this._key = value;
    this.ref = wilddog.sync().ref('groups').child(this._key).child('items');
    this.ref.on('value', (snapshot) => {
      this.items.clear();
      this.itemKeys = [];
      snapshot.forEach((childSnapshot) => {
        this.itemKeys.push(childSnapshot.key());
        this.items.set(childSnapshot.key(), childSnapshot.val());
      });
    });
  }

  addItem(name: string) {
    // check name
    if (!!name && name.trim() !== '') {
      console.log(name);
      name = name.trim();
      this.editItem = new Item(name);
      let ref = wilddog.sync().ref('groups').child(this.key).child('items');
      ref.push(this.editItem).then((newRef) => {
        this.snackbar.open(`成功添加`, null, {duration: 2000});
        this.currentKey = newRef.key();
      }).catch((err) => this.snackbar.open(`错误: ${err}`, null, {duration: 2000}));
    }
  }

  itemAdded() {
    this.editItem = null;
  }
}
